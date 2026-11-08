"""Build SWR302 Assignment 2: render every diagram and write one .docx per member plus the zip to submit.

Usage (from the assignment2 folder):
    python3 tools/build.py --jar /path/to/plantuml.jar      # render diagrams + build documents
    python3 tools/build.py --skip-render                     # only rebuild the documents from existing PNGs

Needs: Java + plantuml.jar (https://github.com/plantuml/plantuml/releases), Graphviz is not required,
rsvg-convert (librsvg) for the use case diagram, Python packages python-docx and Pillow.

Fill GROUP and MEMBERS below, then run again: the files are named Ass2_<GroupName>_<StudentName>.docx and
zipped as Ass2_<GroupName>_Topic1.zip, as the assignment asks.
"""
import argparse
import datetime as dt
import subprocess
import sys
import zipfile
from pathlib import Path

from docx import Document
from docx.enum.section import WD_ORIENT
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.text import WD_ALIGN_PARAGRAPH, WD_BREAK
from docx.oxml.ns import qn
from docx.shared import Cm, Pt, RGBColor
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
DIAGRAMS = ROOT / 'diagrams'
OUT = ROOT / 'submission'

# ------------------------------------------------------------------ team (edit here)
GROUP = 'GroupX'
MEMBERS = [  # (file name part, full name, roll number) -- the file name part must not contain spaces
    ('Member1', '[Full name of member 1]', '[Roll number]'),
    ('Member2', '[Full name of member 2]', '[Roll number]'),
    ('Member3', '[Full name of member 3]', '[Roll number]'),
    ('Member4', '[Full name of member 4]', '[Roll number]'),
    ('Member5', '[Full name of member 5]', '[Roll number]'),
]
TOPIC = 'Topic 1 - Online Shopping for Baking Ingredients System'
SYSTEM = 'Gia Hoa Phat Bakery Supply'

# ------------------------------------------------------------------ model data (from SRS_BakeCraft_v1.0)
ACTORS = [
    ('User', 'Primary', 'Guest, retail customer and wholesale customer (approved business account). '
     'Cart, checkout and personal account need a logged-in user.'),
    ('Admin', 'Primary', 'All GHP operators: sales and customer care, warehouse and cold-chain staff, accountant, '
     'system administrator. Their rights are set in the permission matrix (UC15).'),
    ('Payment Gateway (VNPay / MoMo)', 'Secondary, external system', 'Creates the QR payment and returns the result (UC05).'),
    ('E-mail / SMS Service', 'Secondary, external system', 'Sends the OTP code (Verify OTP code) and the order confirmation (UC05).'),
]
USE_CASES = [
    ('UC01', 'Register an account', 'User (Guest)', 'E-mail / SMS Service (through Verify OTP code)'),
    ('UC02', 'Search and view products', 'User', '-'),
    ('UC03', 'View recipe combos', 'User', '-'),
    ('UC04', 'Manage shopping cart', 'User (logged in)', '-'),
    ('UC05', 'Place an order and pay', 'User (logged in)', 'Payment Gateway, E-mail / SMS Service'),
    ('UC06', 'Track an order', 'User', '-'),
    ('UC07', 'Manage personal account', 'User (logged in)', '-'),
    ('UC08', 'Log in', 'User, Admin', '-'),
    ('UC09', 'View dashboard and reports', 'Admin', '-'),
    ('UC10', 'Process orders', 'Admin', '-'),
    ('UC11', 'Manage products and categories', 'Admin', '-'),
    ('UC12', 'Manage stock and expiry', 'Admin', '-'),
    ('UC13', 'Manage promotions', 'Admin', '-'),
    ('UC14', 'Manage customers', 'Admin', '-'),
    ('UC15', 'Manage staff and settings', 'Admin', '-'),
]
RELATIONS = [
    'UC01 Register an account «include» Verify OTP code: every registration sends and checks a 6-digit OTP (BR-03).',
    'Apply voucher code «extend» UC04 Manage shopping cart: only when the user enters a voucher code (BR-05).',
    'Request VAT invoice «extend» UC05 Place an order and pay: only when the user asks for a VAT invoice; '
    'pre-filled for a wholesale customer.',
]
CLASS_NOTES = [
    'Account is abstract and generalises Customer and StaffMember, so login data and the lock rule '
    '(5 wrong passwords, 15 minutes, BR-03) are defined once.',
    'A Customer owns 0..* Address and 0..1 BusinessProfile (composition). The business profile and '
    'approveWholesale() / rejectWholesale() realise the wholesale account rule (BR-04).',
    'Product is composed of WholesaleTier (tier prices, BR-02, used by getUnitPrice(qty)) and ProductBatch '
    '(batch number, expiry date, FEFO alerts, BR-09). A Category aggregates its products; a RecipeBundle '
    'aggregates 1..* products and isAvailable() checks BR-06.',
    'Cart is composed of CartItem; Order is composed of OrderItem, OrderStatusHistory and an optional '
    'VatInvoiceRequest. OrderItem copies name, SKU and unit price so that past orders do not change when a '
    'product is edited.',
    'An Order has 1..* Payment (a failed online payment can be retried with another method) and may be delivered '
    'by a DeliveryTrip, which keeps the TemperatureLog of the cold box (BR-01, alert above 8 °C).',
    'StaffMember has one Role; a Role grants 0..* Permission (permission matrix of UC15).',
    'Enumerations hold the allowed values: OrderStatus follows BR-08 (PENDING > CONFIRMED > PACKING > SHIPPING > '
    'DELIVERED, CANCELLED only from PENDING or CONFIRMED).',
]
RULE_MAP = [
    ('BR-01 Cold chain', 'Product.requiresColdChain(), Cart.recalculate() (cold-pack fee), Order.coldPackagingFee, '
     'DeliveryTrip / TemperatureLog'),
    ('BR-02 Wholesale tier price', 'WholesaleTier, Product.getUnitPrice(qty)'),
    ('BR-03 OTP and account lock', 'VerificationCode.verify(), Account.recordFailedLogin(), Account.lock()'),
    ('BR-04 Wholesale account', 'BusinessProfile, Customer.approveWholesale() / rejectWholesale()'),
    ('BR-05 Voucher', 'Voucher.isValid(orderValue), Voucher.calculateDiscount()'),
    ('BR-06 Recipe combo availability', 'RecipeBundle.isAvailable()'),
    ('BR-08 Order status flow', 'OrderStatus, Order.canCancel(), Order.updateStatus(), OrderStatusHistory'),
    ('BR-09 FEFO and alerts', 'ProductBatch.getDaysRemaining(), ProductBatch.getExpiryStatus()'),
]

# sequence diagrams: id, file stem, use case, actor(s), scenario, alternatives shown, rules
SDS = [
    ('SD01', 'SD01_UC01_Register', 'UC01 Register an account', 'User (Guest); E-mail / SMS Service',
     'A guest registers a retail account; the «include» Verify OTP code part is shown as a group.',
     'A1 invalid form, A2 wrong or expired OTP, A3 phone or e-mail already registered; wholesale variant in a note.',
     'BR-03, BR-04'),
    ('SD02', 'SD02_UC08_Login', 'UC08 Log in', 'User / Admin',
     'A registered person logs in and is sent to the storefront or the administration console by role.',
     'A1 wrong credentials, account locked after 5 failures; A2 forgot password in a note.', 'BR-03'),
    ('SD03', 'SD03_UC07_AddAddress', 'UC07 Manage personal account', 'User (logged in)',
     'The user adds a delivery address to the address book and makes it the default one.',
     'A1 invalid data.', '-'),
    ('SD04', 'SD04_UC02_SearchProducts', 'UC02 Search and view products', 'User',
     'Keyword search with suggestions, filter and sort, then the product detail (tier prices, expiry, batch, '
     'stock per store, reviews).', 'A1 no product matches.', 'BR-01, BR-02'),
    ('SD05', 'SD05_UC03_RecipeCombo', 'UC03 View recipe combos', 'User',
     'The user opens a recipe combo, unticks the ingredients already owned and adds the rest to the cart.',
     'A1 the user is not logged in.', 'BR-06, BR-02'),
    ('SD06', 'SD06_UC04_ManageCart', 'UC04 Manage shopping cart', 'User (logged in)',
     'The user changes a quantity (tier price, cold-pack fee) and applies a voucher («extend» Apply voucher code).',
     'A1 invalid voucher, A2 empty cart.', 'BR-01, BR-02, BR-05'),
    ('SD07', 'SD07_UC05_PlaceOrder', 'UC05 Place an order and pay', 'User (logged in); Payment Gateway; '
     'E-mail / SMS Service',
     'Three-step checkout with cold-chain delivery and VNPay QR payment, including «extend» Request VAT invoice.',
     'A1 missing field, A2 payment failed or cancelled.', 'BR-01, BR-05'),
    ('SD08', 'SD08_UC06_TrackOrder', 'UC06 Track an order', 'User (Guest)',
     'A guest looks up an order with code and phone, follows the journey and cold-box temperature, '
     'and cancels the order.', 'A1 order not found, A2 order can no longer be cancelled.', 'BR-08'),
    ('SD09', 'SD09_UC10_ProcessOrder', 'UC10 Process orders', 'Admin',
     'The Admin filters orders, opens one, ticks the cold-pack checklist and advances the status until delivery.',
     'Loop ends on DELIVERED or CANCELLED (A1).', 'BR-01, BR-08'),
    ('SD10', 'SD10_UC11_AddProduct', 'UC11 Manage products and categories', 'Admin',
     'The Admin adds a new product with tiered wholesale prices.',
     'A1 name or SKU missing; SKU already used.', 'BR-02'),
    ('SD11', 'SD11_UC12_StockReceipt', 'UC12 Manage stock and expiry', 'Admin (warehouse staff)',
     'A stock receipt creates a new batch and increases stock; the FEFO tab lists batches with expiry alerts.',
     'A1 invalid quantity or expiry date.', 'BR-09'),
    ('SD12', 'SD12_UC13_CreateVoucher', 'UC13 Manage promotions', 'Admin',
     'The Admin filters vouchers, creates a new voucher and disables one.',
     'A1 code already exists or a value is invalid.', 'BR-05'),
    ('SD13', 'SD13_UC09_Reports', 'UC09 View dashboard and reports', 'Admin',
     'The Admin reads the dashboard, switches the period, opens the sales report and exports it to CSV.',
     'A1 no data in the period.', '-'),
    ('SD14', 'SD14_UC14_ApproveWholesale', 'UC14 Manage customers', 'Admin',
     'The Admin reviews a pending wholesale application and approves or rejects it.',
     'A1 the request is rejected.', 'BR-04'),
    ('SD15', 'SD15_UC15_StaffPermissions', 'UC15 Manage staff and settings', 'Admin',
     'The Admin invites a staff member and updates the permissions of a role.',
     'A1 invalid or already used e-mail.', '-'),
]
ASSIGN = {0: ['SD01', 'SD02', 'SD03'], 1: ['SD04', 'SD05', 'SD06'], 2: ['SD07', 'SD08', 'SD09'],
          3: ['SD10', 'SD11', 'SD12'], 4: ['SD13', 'SD14', 'SD15']}
THEME = {0: 'Account and access', 1: 'Browsing and cart', 2: 'Ordering and fulfilment',
         3: 'Catalogue, stock and promotions', 4: 'Reports, customers and staff'}
SD_BY_ID = {s[0]: s for s in SDS}

NOTATION = [
    'Lifelines follow the Boundary-Control-Entity pattern: «boundary» is a screen of the prototype (screen IDs '
    'SCR-xx from the SRS), «control» is the controller that runs the use case, «entity» is a class of the class '
    'diagram, «system» is an external system.',
    'Messages are numbered. A solid arrow is a call, a dashed arrow is a return, an open arrowhead is an '
    'asynchronous message. create(...) creates a new object (its lifeline starts at that message).',
    'Messages named find..., search..., exists..., count... or sum... are class-level queries that read stored '
    'objects; they are not repeated in the class diagram.',
    'Fragments: alt = alternatives (A1, A2, ... are the alternative flows of the SRS), opt = optional part, '
    'loop = repetition, group «include» = the included use case.',
]


# ------------------------------------------------------------------ rendering
def render(jar: str):
    subprocess.run([sys.executable, str(ROOT / 'tools' / 'usecase_diagram.py'), str(DIAGRAMS)], check=True)
    subprocess.run(['rsvg-convert', '-z', '1.5', str(DIAGRAMS / 'UC_Diagram.svg'), '-o',
                    str(DIAGRAMS / 'UC_Diagram.png')], check=True)
    subprocess.run([sys.executable, str(ROOT / 'tools' / 'class_views.py'), str(DIAGRAMS)], check=True)
    pumls = sorted(str(p) for p in DIAGRAMS.glob('*.puml'))
    for fmt in ('-tpng', '-tsvg'):
        subprocess.run(['java', '-Djava.awt.headless=true', '-DPLANTUML_LIMIT_SIZE=16384', '-jar', jar, fmt,
                        '-failfast2', *pumls], check=True)
    print('rendered', len(pumls) + 1, 'diagrams')


# ------------------------------------------------------------------ docx helpers
def set_cell_bg(cell, hex_color):
    tc_pr = cell._tc.get_or_add_tcPr()
    shd = tc_pr.makeelement(qn('w:shd'), {qn('w:val'): 'clear', qn('w:color'): 'auto', qn('w:fill'): hex_color})
    tc_pr.append(shd)


def table(doc, header, rows, widths_cm, keep_together=False):
    t = doc.add_table(rows=1, cols=len(header))
    t.style = 'Table Grid'
    t.alignment = WD_TABLE_ALIGNMENT.CENTER
    for i, h in enumerate(header):
        c = t.rows[0].cells[i]
        c.text = ''
        r = c.paragraphs[0].add_run(h)
        r.bold = True
        set_cell_bg(c, 'E8E8E8')
    for row in rows:
        cells = t.add_row().cells
        for i, v in enumerate(row):
            cells[i].text = v
    t.autofit = False
    for i, w in enumerate(widths_cm):
        t.columns[i].width = Cm(w)
    for ri, row in enumerate(t.rows):
        tr_pr = row._tr.get_or_add_trPr()
        tr_pr.append(tr_pr.makeelement(qn('w:cantSplit'), {}))  # a row never breaks across pages
        for i, w in enumerate(widths_cm):
            row.cells[i].width = Cm(w)
            if keep_together and ri < len(t.rows) - 1:
                for par in row.cells[i].paragraphs:
                    par.paragraph_format.keep_with_next = True
    doc.add_paragraph()
    return t


def figure(doc, png: Path, caption: str, max_w_cm: float, max_h_cm: float):
    w, h = Image.open(png).size
    scale = min(max_w_cm / w, max_h_cm / h)
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p.add_run().add_picture(str(png), width=Cm(w * scale))
    c = doc.add_paragraph()
    c.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = c.add_run(caption)
    r.italic = True
    r.font.size = Pt(9.5)
    r.font.color.rgb = RGBColor(0x44, 0x44, 0x44)


def new_section(doc, landscape: bool):
    s = doc.add_section()
    s.orientation = WD_ORIENT.LANDSCAPE if landscape else WD_ORIENT.PORTRAIT
    long_side, short_side = Cm(29.7), Cm(21.0)
    s.page_width, s.page_height = (long_side, short_side) if landscape else (short_side, long_side)
    for side in ('left_margin', 'right_margin', 'top_margin', 'bottom_margin'):
        setattr(s, side, Cm(1.5))
    return s


def bullets(doc, items):
    for it in items:
        doc.add_paragraph(it, style='List Bullet')


def base_document():
    doc = Document()
    st = doc.styles['Normal']
    st.font.name = 'Arial'
    st.element.rPr.rFonts.set(qn('w:eastAsia'), 'Arial')
    st.font.size = Pt(10.5)
    for name in ('Heading 1', 'Heading 2', 'Heading 3', 'Title'):
        doc.styles[name].font.name = 'Arial'
        doc.styles[name].font.color.rgb = RGBColor(0x1F, 0x1F, 0x1F)
    s = doc.sections[0]
    s.page_width, s.page_height = Cm(21.0), Cm(29.7)
    for side in ('left_margin', 'right_margin', 'top_margin', 'bottom_margin'):
        setattr(s, side, Cm(1.5))
    return doc


# ------------------------------------------------------------------ document
def build_member_doc(idx: int) -> Path:
    file_part, full_name, roll = MEMBERS[idx]
    my_sds = [SD_BY_ID[x] for x in ASSIGN[idx]]
    doc = base_document()
    doc.core_properties.title = f'SWR302 Assignment 2 - {GROUP} - {file_part}'
    doc.core_properties.author = GROUP

    # ---- cover
    doc.add_paragraph('SWR302 - Software Requirements', style='Title')
    p = doc.add_paragraph()
    p.add_run('Assignment 2 - UML models').bold = True
    doc.add_paragraph(f'{TOPIC} ({SYSTEM})')
    table(doc, ['Item', 'Value'], [
        ('Group', GROUP),
        ('Student', f'{full_name} - {roll}'),
        ('File', f'Ass2_{GROUP}_{file_part}.docx'),
        ('My sequence diagrams', ', '.join(f'{s[0]} ({s[2]})' for s in my_sds)),
        ('Based on', 'SRS_BakeCraft_v1.0 (15 use cases UC01-UC15, business rules BR-01 to BR-09)'),
        ('Date', dt.date.today().strftime('%d/%m/%Y')),
    ], [5, 12])

    doc.add_heading('Contents', level=2)
    bullets(doc, [
        'Part A - Group diagrams: 1. Use case diagram, 2. Class diagram (full diagram and three package views).',
        f'Part B - My sequence diagrams ({THEME[idx]}): ' + ', '.join(s[0] for s in my_sds) + '.',
    ])
    doc.add_heading('Sequence diagrams of the group', level=2)
    doc.add_paragraph('Every member draws three sequence diagrams; together they cover all 15 use cases once, '
                      'so no two members draw the same diagram.')
    table(doc, ['Member', 'Part', 'Sequence diagrams'],
          [(MEMBERS[i][1] if MEMBERS[i][1][0] != '[' else MEMBERS[i][0], THEME[i],
            ', '.join(f'{x} {SD_BY_ID[x][2]}' for x in ASSIGN[i])) for i in range(len(MEMBERS))],
          [3.5, 4.5, 9])

    # ---- Part A: use case diagram
    doc.add_page_break()
    doc.add_heading('Part A - Group diagrams', level=1)
    doc.add_heading('1. Use case diagram', level=2)
    figure(doc, DIAGRAMS / 'UC_Diagram.png', 'Figure 1 - Use case diagram (2 primary actors, 15 use cases)', 17.4, 22.5)
    doc.add_heading('1.1 Actors', level=3)
    table(doc, ['Actor', 'Type', 'Description'], ACTORS, [4.2, 3.4, 9.8])
    doc.add_heading('1.2 Use cases', level=3)
    table(doc, ['ID', 'Use case', 'Primary actor', 'Secondary actor'], USE_CASES, [1.5, 5.6, 3.6, 6.7])
    doc.add_heading('1.3 Relationships between use cases', level=3)
    bullets(doc, RELATIONS)

    # ---- Part A: class diagram
    new_section(doc, landscape=False)
    doc.add_heading('2. Class diagram', level=2)
    doc.add_paragraph('Analysis-level class diagram of the domain. Attribute names follow the data model of the '
                      'prototype (client/src/types and client/src/mocks). The full diagram is on this page; the '
                      'three package views on the next pages show the same classes larger.')
    figure(doc, DIAGRAMS / 'Class_Diagram.png', 'Figure 2 - Class diagram (full)', 18.0, 21.0)
    new_section(doc, landscape=False)
    figure(doc, DIAGRAMS / 'Class_View_1_Accounts.png', 'Figure 3 - View 1: accounts and access control', 17.4, 12.0)
    figure(doc, DIAGRAMS / 'Class_View_2_Catalogue.png', 'Figure 4 - View 2: catalogue and inventory', 17.4, 11.0)
    new_section(doc, landscape=True)
    figure(doc, DIAGRAMS / 'Class_View_3_Sales.png', 'Figure 5 - View 3: sales, payment and delivery', 26.0, 16.5)
    new_section(doc, landscape=False)
    doc.add_heading('2.1 Main design decisions', level=3)
    bullets(doc, CLASS_NOTES)
    doc.add_heading('2.2 Business rules in the model', level=3)
    table(doc, ['Business rule (SRS)', 'Where it lives in the class diagram'], RULE_MAP, [5.5, 11.9])

    # ---- Part B
    doc.add_page_break()
    doc.add_heading(f'Part B - My sequence diagrams ({THEME[idx]})', level=1)
    doc.add_heading('Notation', level=3)
    bullets(doc, NOTATION)
    fig_no = 6
    for n, (sid, stem, uc, actor, scenario, alts, rules) in enumerate(my_sds, start=1):
        new_section(doc, landscape=False)
        doc.add_heading(f'3.{n} {sid} - {uc}', level=2)
        table(doc, ['Item', 'Value'], [('Use case', uc), ('Actors', actor), ('Scenario', scenario),
                                       ('Alternative flows shown', alts), ('Business rules', rules)], [4.2, 13.8],
              keep_together=True)
        # a long diagram is split with "newpage" in its .puml: PlantUML writes <stem>.png, <stem>_001.png, ...
        parts = [DIAGRAMS / f'{stem}.png'] + sorted(DIAGRAMS.glob(f'{stem}_[0-9][0-9][0-9].png'))
        for k, png in enumerate(parts):
            label = f' (part {k + 1} of {len(parts)})' if len(parts) > 1 else ''
            if k > 0:
                doc.add_page_break()
            figure(doc, png, f'Figure {fig_no} - {sid} {uc}{label}', 18.0, 20.5 if k == 0 else 24.5)
        fig_no += 1

    OUT.mkdir(parents=True, exist_ok=True)
    folder = OUT / f'Ass2_{GROUP}_Topic1'
    folder.mkdir(exist_ok=True)
    path = folder / f'Ass2_{GROUP}_{file_part}.docx'
    doc.save(path)
    return path


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--jar', help='path to plantuml.jar')
    ap.add_argument('--skip-render', action='store_true')
    a = ap.parse_args()
    if not a.skip_render:
        if not a.jar:
            sys.exit('give --jar /path/to/plantuml.jar or --skip-render')
        render(a.jar)
    files = [build_member_doc(i) for i in range(len(MEMBERS))]
    zpath = OUT / f'Ass2_{GROUP}_Topic1.zip'
    with zipfile.ZipFile(zpath, 'w', zipfile.ZIP_DEFLATED) as z:
        for f in files:
            z.write(f, f'Ass2_{GROUP}_Topic1/{f.name}')
    for f in files:
        print('wrote', f.relative_to(ROOT))
    print('wrote', zpath.relative_to(ROOT))


if __name__ == '__main__':
    main()
