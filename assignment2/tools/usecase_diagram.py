"""Draw the Assignment 2 use case diagram as SVG with a fixed layout (no crossing lines).

Usage:  python3 usecase_diagram.py <out_dir>
Writes <out_dir>/UC_Diagram.svg. Convert to PNG with:  rsvg-convert -z 2 UC_Diagram.svg -o UC_Diagram.png

The use cases, actors and relations below follow SRS_BakeCraft_v1.0 (section 3.1, UC01-UC15).
Edit the data block, then run the build script again.
"""
import sys
from pathlib import Path
from xml.sax.saxutils import escape

# ---------------------------------------------------------------- data
TITLE = 'Use Case Diagram - Gia Hoa Phat Bakery Supply (Topic 1)'
SYSTEM = 'Gia Hoa Phat Bakery Supply'

# id, label, y  (main column)
STORE = [
    ('UC01', 'Register an account', 190),
    ('UC02', 'Search and view products', 290),
    ('UC03', 'View recipe combos', 390),
    ('UC04', 'Manage shopping cart', 490),
    ('UC05', 'Place an order and pay', 590),
    ('UC06', 'Track an order', 690),
    ('UC07', 'Manage personal account', 790),
]
SHARED = [('UC08', 'Log in', 915)]
ADMIN = [
    ('UC09', 'View dashboard and reports', 1040),
    ('UC10', 'Process orders', 1140),
    ('UC11', 'Manage products and categories', 1240),
    ('UC12', 'Manage stock and expiry', 1340),
    ('UC13', 'Manage promotions', 1440),
    ('UC14', 'Manage customers', 1540),
    ('UC15', 'Manage staff and settings', 1640),
]
# helper use cases (right column): id, label, y, relation, base use case
HELPERS = [
    ('OTP', 'Verify OTP code', 190, 'include', 'UC01'),
    ('VOUCH', 'Apply voucher code', 490, 'extend', 'UC04'),
    ('VAT', 'Request VAT invoice', 590, 'extend', 'UC05'),
]

W, H = 1480, 1840
MAIN_X, MAIN_RX, MAIN_RY = 540, 175, 36
HELP_X, HELP_RX, HELP_RY = 930, 130, 30
BOX = (320, 95, 1130, 1720)  # x1, y1, x2, y2 of the system boundary

ACTORS = {
    'User': dict(x=140, y=500, name='User', sub=['Guest, retail customer,', 'wholesale customer'], system=False),
    'Admin': dict(x=1330, y=1290, name='Admin', sub=['GHP operators: sales,', 'warehouse, accountant'], system=False),
    'MAIL': dict(x=1330, y=720, name='E-mail / SMS Service', sub=['OTP, order confirmation'], system=True),
    'PG': dict(x=1330, y=930, name='Payment Gateway', sub=['VNPay / MoMo'], system=True),
}
# actor associations: actor, use case id
LINKS = [('User', u[0]) for u in STORE + SHARED] + [('Admin', u[0]) for u in SHARED + ADMIN] + [
    ('PG', 'UC05'),
    ('MAIL', 'OTP'),
    ('MAIL', 'UC05'),
]

FONT = 'Arial, Helvetica, sans-serif'


# ---------------------------------------------------------------- drawing
def text(x, y, s, size=15, weight='normal', anchor='middle', style='normal', fill='#111'):
    return (f'<text x="{x:.1f}" y="{y:.1f}" font-family="{FONT}" font-size="{size}" font-weight="{weight}" '
            f'font-style="{style}" text-anchor="{anchor}" fill="{fill}">{escape(s)}</text>')


def ellipse_point(cx, cy, rx, ry, tx, ty):
    """Point on the ellipse border in the direction of (tx, ty)."""
    dx, dy = tx - cx, ty - cy
    k = 1 / ((dx / rx) ** 2 + (dy / ry) ** 2) ** 0.5
    return cx + dx * k, cy + dy * k


def actor_svg(a):
    x, y = a['x'], a['y']
    out = []
    if a['system']:
        out.append(text(x, y - 78, '«system»', 13, style='italic', fill='#333'))
    out += [
        f'<circle cx="{x}" cy="{y - 50}" r="15" fill="#fff" stroke="#111" stroke-width="2"/>',
        f'<line x1="{x}" y1="{y - 35}" x2="{x}" y2="{y + 8}" stroke="#111" stroke-width="2"/>',
        f'<line x1="{x - 26}" y1="{y - 20}" x2="{x + 26}" y2="{y - 20}" stroke="#111" stroke-width="2"/>',
        f'<line x1="{x}" y1="{y + 8}" x2="{x - 20}" y2="{y + 42}" stroke="#111" stroke-width="2"/>',
        f'<line x1="{x}" y1="{y + 8}" x2="{x + 20}" y2="{y + 42}" stroke="#111" stroke-width="2"/>',
        text(x, y + 68, a['name'], 17, 'bold'),
    ]
    for i, s in enumerate(a['sub']):
        out.append(text(x, y + 90 + i * 18, s, 13, style='italic', fill='#444'))
    return out


def actor_anchor(a, tx):
    """Where association lines leave the actor: the side facing the use case, at arm height."""
    side = 1 if tx > a['x'] else -1
    return a['x'] + side * 30, a['y'] - 8


def build():
    pos = {}
    for uid, label, y in STORE + SHARED + ADMIN:
        pos[uid] = (MAIN_X, y, MAIN_RX, MAIN_RY, uid, label)
    for uid, label, y, _, _ in HELPERS:
        pos[uid] = (HELP_X, y, HELP_RX, HELP_RY, None, label)

    svg = [f'<svg xmlns="http://www.w3.org/2000/svg" width="{W}" height="{H}" viewBox="0 0 {W} {H}">',
           '<defs><marker id="open" markerWidth="14" markerHeight="12" refX="13" refY="6" orient="auto" '
           'markerUnits="userSpaceOnUse"><path d="M1,1 L13,6 L1,11" fill="none" stroke="#111" stroke-width="1.6"/>'
           '</marker></defs>',
           f'<rect width="{W}" height="{H}" fill="#fff"/>',
           text(W / 2, 48, TITLE, 24, 'bold')]

    x1, y1, x2, y2 = BOX
    svg.append(f'<rect x="{x1}" y="{y1}" width="{x2 - x1}" height="{y2 - y1}" fill="none" stroke="#111" stroke-width="2"/>')
    svg.append(text((x1 + x2) / 2, y1 + 30, SYSTEM, 18, 'bold'))
    # light separators naming the parts of the system
    svg.append(text(x2 - 16, y1 + 58, 'Storefront', 13, 'bold', 'end', fill='#666'))
    for yy, name in ((855, 'Shared'), (975, 'Administration')):
        svg.append(f'<line x1="{x1 + 14}" y1="{yy}" x2="{x2 - 14}" y2="{yy}" stroke="#999" stroke-dasharray="5 5"/>')
        svg.append(text(x2 - 16, yy + 20, name, 13, 'bold', 'end', fill='#666'))

    # associations (solid lines)
    for actor, uid in LINKS:
        a = ACTORS[actor]
        cx, cy, rx, ry, _, _ = pos[uid]
        ax, ay = actor_anchor(a, cx)
        if a['system']:  # external systems: shortest line to the ellipse border
            ex, ey = ellipse_point(cx, cy, rx, ry, ax, ay)
        else:  # people: end at the left or right tip so lines never cut other ellipses
            ex, ey = (cx - rx if ax < cx else cx + rx), cy
        svg.append(f'<line x1="{ax:.1f}" y1="{ay:.1f}" x2="{ex:.1f}" y2="{ey:.1f}" stroke="#111" stroke-width="1.6"/>')

    # include / extend (dashed, open arrow towards the target)
    for uid, _, y, rel, base in HELPERS:
        bx, by, brx, _, _, _ = pos[base]
        hx, hy, hrx, _, _, _ = pos[uid]
        left, right = (bx + brx, by), (hx - hrx, hy)
        src, dst = (left, right) if rel == 'include' else (right, left)
        svg.append(f'<line x1="{src[0]:.1f}" y1="{src[1]:.1f}" x2="{dst[0]:.1f}" y2="{dst[1]:.1f}" stroke="#111" '
                   f'stroke-width="1.5" stroke-dasharray="8 6" marker-end="url(#open)"/>')
        svg.append(text((left[0] + right[0]) / 2, y - 9, f'«{rel}»', 14, style='italic'))

    # use cases
    for uid, (cx, cy, rx, ry, code, label) in pos.items():
        svg.append(f'<ellipse cx="{cx}" cy="{cy}" rx="{rx}" ry="{ry}" fill="#fff" stroke="#111" stroke-width="1.8"/>')
        if code:
            svg.append(text(cx, cy - 6, code, 13, 'bold', fill='#555'))
            svg.append(text(cx, cy + 15, label, 16))
        else:
            svg.append(text(cx, cy + 5, label, 15))

    for a in ACTORS.values():
        svg += actor_svg(a)

    # legend
    ly = H - 70
    svg.append(f'<line x1="330" y1="{ly}" x2="400" y2="{ly}" stroke="#111" stroke-width="1.6"/>')
    svg.append(text(412, ly + 5, 'Association (actor takes part in the use case)', 14, anchor='start', fill='#444'))
    svg.append(f'<line x1="800" y1="{ly}" x2="870" y2="{ly}" stroke="#111" stroke-width="1.5" stroke-dasharray="8 6" marker-end="url(#open)"/>')
    svg.append(text(882, ly + 5, '«include» / «extend» dependency', 14, anchor='start', fill='#444'))
    svg.append('</svg>')
    return '\n'.join(svg)


if __name__ == '__main__':
    out = Path(sys.argv[1] if len(sys.argv) > 1 else '.')
    out.mkdir(parents=True, exist_ok=True)
    (out / 'UC_Diagram.svg').write_text(build(), encoding='utf-8')
    print('wrote', out / 'UC_Diagram.svg')
