// Dựng SRS (IEEE 830) bằng docx-js. Dùng: node build-srs.js <thư mục shots> <thư mục figs> <file ra .docx> [pages.json]
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, ShadingType, AlignmentType,
  HeadingLevel, ImageRun, Header, Footer, PageNumber, NumberFormat, TabStopType, LeaderType, BorderStyle,
  LevelFormat, SectionType, VerticalAlign, TableLayoutType, Tab, PageBreak,
} = require('docx');

const SHOTS = process.argv[2], FIGS = process.argv[3], OUT = process.argv[4];
const PAGES = process.argv[5] && fs.existsSync(process.argv[5]) ? JSON.parse(fs.readFileSync(process.argv[5], 'utf8')) : {};

const TW = 9412; // bề rộng nội dung (DXA) — A4, lề trái/phải 2.2 cm
const BROWN = '7A3B1D', LIGHT = 'F6EFE9', GREY = '5C5650', LINE = 'B9B2AB';
const HEAD = 'Times New Roman', BODY = 'Arial';

// ───────────── tiện ích ─────────────
function runs(text, o = {}) {
  return String(text).split(/(\*\*[^*]+\*\*)/g).filter((s) => s !== '').map((p) =>
    p.startsWith('**') ? new TextRun({ text: p.slice(2, -2), bold: true, size: o.size, color: o.color, italics: o.italics })
      : new TextRun({ text: p, bold: o.bold, size: o.size, color: o.color, italics: o.italics }));
}
const P = (text, o = {}) => new Paragraph({
  children: runs(text, { size: o.size || 20, italics: o.italics, color: o.color, bold: o.bold }),
  spacing: { before: o.before || 0, after: o.after === undefined ? 100 : o.after, line: 276 },
  alignment: o.align, keepNext: o.keepNext, indent: o.indent,
});
const BUL = (text, o = {}) => new Paragraph({
  numbering: { reference: 'bul', level: 0 }, children: runs(text, { size: o.size || 20 }), spacing: { after: 60, line: 276 },
});
const PB = () => new Paragraph({ children: [new PageBreak()] });

const headings = [];
function H(level, num, title, o = {}) {
  headings.push({ level, num, title });
  const style = [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3][level - 1];
  return new Paragraph({
    heading: style, keepNext: true, pageBreakBefore: !!o.pageBreak,
    spacing: { before: level === 1 ? 360 : level === 2 ? 240 : 200, after: 120 },
    children: [new TextRun({ text: num ? `${num} ${title}` : title })],
  });
}

const bd = { style: BorderStyle.SINGLE, size: 4, color: LINE };
const borders = { top: bd, bottom: bd, left: bd, right: bd };
function cellParas(content, o) {
  return (Array.isArray(content) ? content : [content]).map((c) => {
    if (typeof c !== 'string') return c;
    if (c.startsWith('- ')) return new Paragraph({ numbering: { reference: 'bul', level: 0 }, children: runs(c.slice(2), { size: o.size || 18, color: o.color }), spacing: { after: 40 } });
    return new Paragraph({ children: runs(c, { size: o.size || 18, bold: o.bold, color: o.color, italics: o.italics }), alignment: o.align, spacing: { after: 40 } });
  });
}
function cell(content, w, o = {}) {
  return new TableCell({
    width: { size: w, type: WidthType.DXA }, borders,
    shading: o.fill ? { fill: o.fill, type: ShadingType.CLEAR, color: 'auto' } : undefined,
    margins: { top: 60, bottom: 60, left: 100, right: 100 }, verticalAlign: VerticalAlign.TOP,
    columnSpan: o.span, children: cellParas(content, o),
  });
}
function scale(fr) { const s = fr.reduce((a, b) => a + b, 0); const w = fr.map((f) => Math.floor(TW * f / s)); w[w.length - 1] += TW - w.reduce((a, b) => a + b, 0); return w; }
function table(fr, header, rows, o = {}) {
  const w = scale(fr);
  const trs = [];
  if (header) trs.push(new TableRow({ tableHeader: true, cantSplit: true, children: header.map((h, i) => cell(h, w[i], { fill: BROWN, color: 'FFFFFF', bold: true })) }));
  rows.forEach((r) => trs.push(new TableRow({ cantSplit: o.cantSplit !== false, children: r.map((c, i) => cell(c, w[i], { size: o.size, fill: i === 0 && o.firstFill ? LIGHT : undefined, bold: i === 0 && o.firstBold })) })));
  return new Table({ width: { size: TW, type: WidthType.DXA }, columnWidths: w, layout: TableLayoutType.FIXED, rows: trs });
}
// bảng 2 cột (nhãn | giá trị) cho đặc tả use case
function kv(rows) {
  const w = scale([22, 78]);
  return new Table({
    width: { size: TW, type: WidthType.DXA }, columnWidths: w, layout: TableLayoutType.FIXED,
    rows: rows.map(([k, v]) => new TableRow({ children: [cell(k, w[0], { fill: LIGHT, bold: true }), cell(v, w[1])] })),
  });
}
const gap = (n = 120) => new Paragraph({ spacing: { after: n }, children: [] });

function pngSize(buf) { return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) }; }
let figN = 0;
function fig(file, caption, widthPx) {
  const buf = fs.readFileSync(file);
  const { w, h } = pngSize(buf);
  const height = Math.round(widthPx * h / w);
  figN += 1;
  return [
    new Paragraph({
      alignment: AlignmentType.CENTER, keepNext: true, spacing: { before: 120, after: 60 },
      children: [new ImageRun({ type: 'png', data: buf, transformation: { width: widthPx, height }, altText: { title: caption, description: caption, name: path.basename(file) } })],
    }),
    new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: `Figure ${figN} — ${caption}`, italics: true, size: 18, color: GREY })] }),
  ];
}
const shot = (f, cap, wpx = 540) => fig(path.join(SHOTS, f), cap, wpx);

// ───────────── nội dung ─────────────
const body = [];
const add = (...x) => x.flat().forEach((e) => body.push(e));

// 1. Introduction
add(H(1, '1.', 'Introduction', { pageBreak: false }));
add(H(2, '1.1', 'Purpose'));
add(P('This document specifies the system requirements of **BakeCraft**, the Online Shopping for Baking Ingredients System of Gia Hòa Phát (GHP), release 1.0. It records the business objectives, the user requirements, the functional requirements (use cases, scenarios and screen prototypes) and the non-functional requirements, so that the customer, developers and testers share one agreement about the product to be built.'));
add(P('Release 1.0 is a **web front-end prototype**: it demonstrates the user interface and the use cases with simulated data. Back-end services are not part of this release (see 1.6).'));

add(H(2, '1.2', 'System Purpose'));
add(P('GHP operates several shops selling baking ingredients (flour, butter, chocolate, additives…) and baking equipment (ovens, molds, tools). Today GHP sells only through physical shops: customers must visit a shop, availability is checked by phone or by walking the shelves, orders and stock are tracked manually, and GHP reaches only customers near its shops. GHP wants to move from traditional retail to e-business with an online shopping system.'));
add(P('**Vision statement.** For home bakers, bakeries and cafés who need baking ingredients and equipment conveniently, BakeCraft is a web store that lets them find products, order, pay and track delivery at any time, with batch and expiry information and cold-chain delivery for perishable goods. Unlike buying only in the physical shops, the system lets GHP sell beyond its shop areas and process orders with less manual work.'));
add(P('**Business opportunity.** Growing demand for home baking and for ordering supplies online; GHP already has the product range, suppliers and shops, so an online channel can be added at moderate cost. **Business risks:** low adoption by traditional customers, stock mismatch between shops and the online store, quality of delivery of perishable goods, payment fraud.', { after: 140 }));
add(P('**Business objectives**', { keepNext: true, color: BROWN }));
add(table([11, 38, 31, 20], ['ID', 'Objective', 'Measure of success', 'Use cases'], [
  ['OBJ-01', 'Open an online sales channel that lets customers browse the full catalogue and buy 24/7.', 'Online catalogue covers ≥ 95% of in-store products at launch.', 'UC02, UC03, UC11'],
  ['OBJ-02', 'Increase sales revenue and reach customers beyond the neighborhood of the shops.', 'Online orders reach ≥ 20% of total revenue within 12 months after launch.', 'UC05, UC09'],
  ['OBJ-03', 'Give customers a simple purchase flow: search → cart → checkout → payment → tracking.', 'A customer completes an order in ≤ 5 minutes and ≤ 6 steps; cart abandonment < 60%.', 'UC02, UC04, UC05, UC06'],
  ['OBJ-04', 'Support multiple payment methods and delivery options (standard and cold-chain).', '≥ 4 payment methods (COD, bank transfer, e-wallet, QR); ≥ 98% of online payments processed correctly.', 'UC05'],
  ['OBJ-05', 'Reduce manual work of staff by centralizing products, inventory, orders and customers in one system.', 'Order processing time per order reduced by ≥ 30%; stock discrepancy < 2%.', 'UC10, UC11, UC12, UC14'],
  ['OBJ-06', 'Provide accurate stock and expiry information shared between the shops and the online store.', 'Online stock updated within 1 minute of any sale or stock change.', 'UC02, UC12'],
  ['OBJ-07', 'Strengthen customer relationship through accounts, wishlists, reviews and vouchers.', '≥ 30% of orders come from returning customers within 12 months.', 'UC07, UC13'],
  ['OBJ-08', 'Give management timely reports (revenue, best sellers, low stock) for decision-making.', 'Daily/weekly/monthly reports available on demand in < 10 seconds.', 'UC09'],
]));
add(P('Numeric targets are proposals to be confirmed with GHP (ISS-01).', { before: 80, italics: true, color: GREY, size: 18 }));

add(H(2, '1.3', 'Definitions, Acronyms and Abbreviations'));
add(P('See Appendix A: Glossary. Main abbreviations: GHP – Gia Hòa Phát; SRS – Software Requirements Specification; UR – User Requirement; UC – Use Case; SCR – Screen; BR – Business Rule; NFR – Non-Functional Requirement; OBJ – Business Objective; COD – Cash on Delivery; OTP – One-Time Password; FEFO – First-Expired, First-Out; B2B – business-to-business (wholesale).'));

add(H(2, '1.4', 'Document Conventions'));
add(P('Requirements are written with the keyword “shall” and identified by unique IDs: OBJ-xx (objectives), UR-xx (user requirements), UCxx (use cases), SCR-xx (screens, the same codes as in the prototype’s UI specification), BR-xx (business rules), NFR-xx (non-functional requirements) and ISS-xx (open issues). Priority is M (Must) or S (Should) for NFRs and High/Medium/Low for use cases. The column “Rel.” of the NFR tables states the release in which a requirement applies (1.0 prototype or 2 production).'));
add(P('Screens are screenshots of the prototype at 1440 px width. The user interface is in Vietnamese; its labels are quoted as “…”. Numeric targets are proposals to be confirmed with stakeholders.'));

add(H(2, '1.5', 'Intended Audience and Reading Suggestions'));
add(P('Readers: GHP owner and managers (sections 1, 2, 3.1), sales and warehouse staff (3.1 and the screens), developers and architects (all of sections 3 and 4), testers (3.1 scenarios and 3.2 requirements, which are written to be verifiable), project managers (2.9 and 3.2.2.2). Suggested reading order: 1 → 2 → 3.1 → 3.2 → 4.'));

add(H(2, '1.6', 'Project Scope'));
add(P('**In scope (release 1.0):** a responsive web prototype, in Vietnamese and with simulated data, of (a) the customer storefront – catalogue, search, recipe combos, cart, checkout, order tracking and personal account – and (b) the administration console – dashboard, orders, products and categories, stock and batches, promotions, customers, staff and settings, reports. The system has **two roles: User and Admin**.'));
add(P('**Out of scope (this release):** back-end services and database, real integration with payment gateways, delivery partners and e-mail/SMS providers (they are simulated), native mobile app, accounting/ERP integration, multi-language support, marketplace for third-party sellers, return and refund workflow.'));
add(P('**Using objectives to control scope:** a requested feature is accepted into release 1.0 only if it supports at least one objective OBJ-01…OBJ-08; otherwise it goes to the backlog.'));

add(H(2, '1.7', 'References'));
[
  'IEEE Std 830-1998, Recommended Practice for Software Requirements Specifications.',
  'Template_System Requirement Spec (IEEE830) v1.2, SWR302.',
  'SWR302 Assignment 1 – Topics, Topic 1.',
  'SWR302 course slides, Chapters 1–13 (requirements development, elicitation, writing and documenting requirements).',
  'BakeCraft web prototype (React single-page application, folder client/) and its UI specification (client/ui-spec/02_pages.md).',
].forEach((t) => add(BUL(t)));

// 2. Overall description
add(H(1, '2.', 'Overall Description', { pageBreak: true }));
add(H(2, '2.1', 'Product/System Perspective'));
add(P('BakeCraft is a new, self-contained web application developed for Gia Hòa Phát. It is the core of GHP’s transition from a traditional retail business to an e-business model. It has two parts: the **customer storefront** used by the User, and the **administration console** used by the Admin.'));
add(P('In production the system would exchange data with three kinds of external services; in release 1.0 they are only simulated by screens and on-screen notifications:'));
add(BUL('**Payment gateway** (VNPay / MoMo): online payment of an order.'));
add(BUL('**Delivery partner** (cold-chain delivery within 2–4 hours): delivery fee, journey and truck temperature.'));
add(BUL('**E-mail / SMS service**: OTP codes, order confirmation and delivery notifications.'));
add(fig(path.join(FIGS, 'fig-context.png'), 'System context diagram', 560));

add(H(2, '2.2', 'System/Product Features'));
add(P('**1. Customer storefront (role User)**', { keepNext: true }));
[
  '**Account:** registration with OTP (retail or wholesale), login, password recovery, profile, address book, wishlist, business profile for wholesale customers.',
  '**Catalogue and search:** browse by category, filter by storage condition, brand and price, search with suggestions, product detail with tiered wholesale prices, batch and expiry date, store availability and reviews.',
  '**Recipe combos:** choose a recipe, select the ingredients still needed and add them to the cart.',
  '**Cart and checkout:** change quantities, apply vouchers, see cold-pack fee and free-shipping progress, 3-step checkout, choose delivery and payment method, request a VAT invoice.',
  '**Order tracking:** look up an order by code and phone, follow the delivery journey and cold-chain temperature, cancel, re-order, print or download the invoice.',
].forEach((t) => add(BUL(t)));
add(P('**2. Administration console (role Admin)**', { keepNext: true, before: 80 }));
[
  '**Dashboard and reports:** key figures, revenue chart, orders by status, alerts; revenue, best sellers and customer segments with CSV export.',
  '**Orders and delivery:** order list and detail, status workflow, cold-pack checklist, delivery note and VAT invoice, cold-chain trips and temperature log.',
  '**Products, categories and stock:** product and category management with tiered prices; stock by product, batches by expiry date (FEFO), stock receipts, low-stock and near-expiry alerts.',
  '**Promotions, customers, staff and settings:** vouchers, wholesale account approval, staff accounts and permission matrix, shipping fees, payment methods and notifications.',
].forEach((t) => add(BUL(t)));

add(H(2, '2.3', 'User requirements'));
add(P('**1. Requirements of the User (shopper and wholesale customer)**', { keepNext: true }));
add(table([10, 70, 20], ['ID', 'User requirement', 'Use cases'], [
  ['UR-01', '**Product search and filtering.** Users want to find ingredients and equipment quickly by keyword and to filter by category, storage condition, brand and price.', 'UC02'],
  ['UR-02', '**Detailed product information.** Users want expiry date, batch, storage guide, ingredients, usage, tiered prices and store availability.', 'UC02'],
  ['UR-03', '**Shopping cart.** Users must be able to add, adjust and remove items and apply a voucher code.', 'UC04'],
  ['UR-04', '**Flexible payment and delivery.** Users want COD, bank transfer, e-wallet or QR payment, standard or cold-chain delivery, and a VAT invoice when needed.', 'UC05'],
  ['UR-05', '**Order tracking.** Customers want to look up an order, follow its status and delivery journey and cancel it while it is not yet packed.', 'UC06'],
  ['UR-06', '**Responsive interface.** Customers expect a seamless experience on mobile phone, tablet and desktop.', 'all'],
  ['UR-07', '**Wishlist and reviews.** Customers want to save favourite products and leave ratings and reviews.', 'UC07'],
  ['UR-08', '**Recipe combos.** Customers want to pick a recipe and buy all its ingredients at once.', 'UC03'],
  ['UR-09', '**Wholesale account (B2B).** Bakery owners want a business profile, tiered prices, a pre-filled VAT invoice and an approved wholesale status.', 'UC01, UC07, UC14'],
]));
add(P('**2. Requirements of the Admin (GHP operators)**', { keepNext: true, before: 160 }));
add(table([10, 70, 20], ['ID', 'User requirement', 'Use cases'], [
  ['UR-10', '**Efficient order processing.** Staff want to filter orders, approve them in bulk, update status, check the cold-pack list and print the delivery note and VAT invoice.', 'UC10'],
  ['UR-11', '**Inventory and expiry control.** Staff require stock per product, batches sorted by expiry (FEFO), stock receipts, and low-stock and near-expiry alerts.', 'UC12'],
  ['UR-12', '**Product catalogue management.** Admins want to add, edit, hide or delete products and categories and set tiered prices.', 'UC11'],
  ['UR-13', '**Promotions.** Admins need to create, enable and disable discount vouchers and free-shipping codes.', 'UC13'],
  ['UR-14', '**Reporting.** Management requires dashboards and reports on revenue by period, best-selling products and customer segments, with export.', 'UC09'],
  ['UR-15', '**Role-based access.** The system shall separate the User role from the Admin role; Admins manage staff accounts and permissions.', 'UC08, UC15'],
]));

add(H(2, '2.4', 'User Classes and Characteristics'));
add(P('**1. User** (favoured user class)', { keepNext: true }));
add(table([28, 72], null, [
  ['Sub-types', ['**Guest** – not logged in: browses, searches, looks up an order, registers.', '**Retail customer** – home baker, logged in: cart, orders, tracking, account.', '**Wholesale customer (B2B)** – bakery owner with an approved business account: also tiered prices, business profile, pre-filled VAT invoice.']],
  ['Frequency of use', 'Retail: regular (1–3 times per week). Wholesale: periodic bulk purchases (weekly or monthly).'],
  ['Functions used', 'UC01–UC08.'],
  ['Technical expertise', 'Basic; familiar with e-commerce sites (Shopee, Lazada).'],
  ['Privilege level', 'Guest: none. Customer: own account data and orders only.'],
  ['Key characteristics', 'Needs an intuitive interface, fast search, clear delivery and cold-chain information. This is the most critical user class to satisfy.'],
], { firstFill: true, firstBold: true }));
add(P('**2. Admin** (GHP operator)', { keepNext: true, before: 160 }));
add(table([28, 72], null, [
  ['Sub-types', 'System administrator, sales and customer-care staff, warehouse and cold-chain staff, accountant. All use the same console; their access is set in the permission matrix (UC15).'],
  ['Frequency of use', 'Daily during business hours.'],
  ['Functions used', 'UC08–UC15.'],
  ['Technical expertise', 'Intermediate; trained internally on the administration console.'],
  ['Privilege level', 'Admin: all administration screens.'],
  ['Key characteristics', 'Needs efficient order workflow, clear tables and alerts for stock and expiry.'],
], { firstFill: true, firstBold: true }));

add(H(2, '2.5', 'Operating Environment'));
add(BUL('**Client side:** latest two versions of Chrome, Edge, Firefox and Safari on desktop; Android 10+ and iOS 14+ browsers on mobile; screen width from 360 px; the administration console is optimised for desktop and tablet (1440 px or wider recommended).'));
add(BUL('**Prototype:** a static single-page application (React, TypeScript, Vite, Tailwind CSS) that runs in the browser with simulated data; no server or database is required.'));
add(BUL('**Coexisting components:** none in release 1.0; external services are simulated (see 2.1).'));

add(H(2, '2.6', 'Design and Implementation Constraints'));
add(BUL('**Technology:** web application built as a React + TypeScript single-page application with Tailwind CSS; open-source or properly licensed components only.'));
add(BUL('**Interface:** Vietnamese language, VND currency, responsive layout from 360 px, brand colours and typography of the GHP design system (Be Vietnam Pro font).'));
add(BUL('**Data:** all data and external services are simulated in release 1.0.'));
add(BUL('**Process:** Git source control; requirements, design and test documents are version-controlled; UML for models.'));

add(H(2, '2.7', 'User Documentation'));
add(BUL('**In-application help:** “Trung tâm hỗ trợ” page with FAQ and policies.'));
add(BUL('**This SRS:** the scenarios of section 3.1 serve as the user guide for the prototype demonstration.'));
add(BUL('**Administrator quick guide** (PDF): planned for release 2.'));

add(H(2, '2.8', 'Assumptions and Dependencies'));
add(P('**Assumptions**', { keepNext: true }));
add(BUL('Users own a device with a compliant web browser and have basic internet literacy.'));
add(BUL('GHP staff have basic computer proficiency to operate the administration console.'));
add(BUL('Master data (products, prices, batches, stores) is supplied by GHP; the prototype uses sample data.'));
add(P('**Dependencies (production release)**', { keepNext: true, before: 100 }));
add(BUL('Availability and API of the payment gateway (VNPay / MoMo).'));
add(BUL('Availability of the cold-chain delivery partner and its interface (ISS-03).'));
add(BUL('E-mail / SMS provider and hosting provider.'));

add(H(2, '2.9', 'Apportioning of Requirements'));
add(P('**Release 1.0 – web prototype (current scope):** all user requirements UR-01 … UR-15 and use cases UC01 … UC15 with simulated data; order cancellation by the customer.', { after: 80 }));
add(P('**Release 2 – production (deferred):**', { after: 60, keepNext: true }));
[
  'Back-end services and database; real-time stock synchronisation between shops and the online store.',
  'Real integration with payment gateway, delivery partner and e-mail/SMS provider.',
  'Return and refund workflow; automatic VAT e-invoice issuing.',
  'Security hardening: password hashing, HTTPS, audit log, role enforcement on the server.',
  'Data migration of existing products, prices and customers; backup and monitoring.',
  'Smart recommendation, native mobile apps, chatbot support and subscription orders for B2B bakeries.',
].forEach((t) => add(BUL(t)));

// 3. Specific requirements
add(H(1, '3.', 'Specific Requirements', { pageBreak: true }));
add(P('The functional requirements are organised by use case. Each use case is described with its scenario, business rules and the prototype screens that realise it.'));
add(H(2, '3.1', 'Functional Requirements Specification'));
add(P('The system has two actors. The **User** covers the guest, the retail customer and the wholesale customer (a customer with an approved business account); the **Admin** covers all GHP operators. Figure 2 shows the 15 use cases; the three dashed relations are the only «include»/«extend» relations needed at this level.'));
add(fig(path.join(FIGS, 'fig-usecase.png'), 'Use case diagram of BakeCraft (2 actors, 15 use cases)', 612));

add(P('**Use case list**', { keepNext: true, before: 120 }));
const UCS = [
  ['UC01', 'Register an account', 'User (Guest)', 'SCR-13', 'High'],
  ['UC02', 'Search and view products', 'User', 'SCR-01, 02, 03, 04', 'High'],
  ['UC03', 'View recipe combos', 'User', 'SCR-05, 06', 'Medium'],
  ['UC04', 'Manage shopping cart', 'User (logged in)', 'SCR-07', 'High'],
  ['UC05', 'Place an order and pay', 'User (logged in)', 'SCR-08, 09', 'High'],
  ['UC06', 'Track an order', 'User', 'SCR-10, 11, 16', 'High'],
  ['UC07', 'Manage personal account', 'User (logged in)', 'SCR-15, 17, 18, 19, 20', 'Medium'],
  ['UC08', 'Log in', 'User, Admin', 'SCR-12, 14', 'High'],
  ['UC09', 'View dashboard and reports', 'Admin', 'SCR-A01, A11', 'Medium'],
  ['UC10', 'Process orders', 'Admin', 'SCR-A02, A03, A10', 'High'],
  ['UC11', 'Manage products and categories', 'Admin', 'SCR-A04, A05, A06', 'High'],
  ['UC12', 'Manage stock and expiry', 'Admin', 'SCR-A07', 'High'],
  ['UC13', 'Manage promotions', 'Admin', 'SCR-A09', 'Medium'],
  ['UC14', 'Manage customers', 'Admin', 'SCR-A08', 'Medium'],
  ['UC15', 'Manage staff and settings', 'Admin', 'SCR-A12, A13', 'Low'],
];
add(table([9, 33, 20, 28, 10], ['ID', 'Use case', 'Actor', 'Screens', 'Priority'], UCS));

// đặc tả từng use case
const SPEC = [
  {
    id: 'UC01', name: 'Register an account', vn: 'Đăng ký tài khoản', actor: 'User (Guest)', scr: 'SCR-13', pri: 'High',
    goal: 'A guest creates a retail account, or applies for a wholesale (bakery owner) account.',
    pre: 'The user is not logged in.',
    main: [
      '1. The guest opens “Đăng ký” and chooses the tab “Khách mua lẻ” or “Chủ tiệm bánh (Sỉ)”.',
      '2. The guest enters full name, phone, optional e-mail and password (wholesale: also business name and tax code).',
      '3. The system validates the form and sends an OTP code (**«include» Verify OTP code**).',
      '4. The guest enters the OTP.',
      '5. The system creates the account. A retail user is signed in; a wholesale account is set to “pending approval” (see UC14).',
    ],
    alt: ['A1. A required field is empty or invalid: the field shows an error and no OTP is sent.', 'A2. The OTP is wrong: an error is shown and the guest may ask for a new code.', 'A3. The phone or e-mail is already registered: the system proposes to log in.'],
    br: 'BR-03 (OTP), BR-04 (wholesale approval). The password shall have at least 6 characters (NFR-S1).',
    figs: [['13-dang-ky.png', 'SCR-13 — Register account (“Đăng ký tài khoản”), step 1']],
  },
  {
    id: 'UC02', name: 'Search and view products', vn: 'Tìm kiếm và xem sản phẩm', actor: 'User', scr: 'SCR-01, SCR-02, SCR-03, SCR-04', pri: 'High',
    goal: 'The user finds an ingredient or an equipment item and reads its complete information.',
    pre: 'None.',
    main: [
      '1. The user opens the home page or the product list.',
      '2. The user browses by category or types a keyword in the search box (suggestions are shown; shortcut Ctrl/⌘ + K).',
      '3. The user filters by category, storage condition, brand, price range and availability, and sorts the result.',
      '4. The user opens a product.',
      '5. The system shows price, tiered wholesale price table, storage condition, expiry date and batch, stock and availability in stores, description, ingredients, usage and reviews.',
      '6. The user may choose a quantity from a price tier, add the product to the cart (UC04) or to the wishlist (UC07).',
    ],
    alt: ['A1. No product matches: the system shows an empty-state message with suggestions.'],
    br: 'BR-01 (cold-chain notice on chilled products), BR-02 (tiered price).',
    figs: [['02-danh-sach-san-pham.png', 'SCR-02 — Product list (“Tất cả sản phẩm”)'], ['04-chi-tiet-san-pham.png', 'SCR-04 — Product detail with tiered wholesale prices']],
  },
  {
    id: 'UC03', name: 'View recipe combos', vn: 'Xem combo công thức làm bánh', actor: 'User', scr: 'SCR-05, SCR-06', pri: 'Medium',
    goal: 'The user picks a recipe and buys all the ingredients needed for it.',
    pre: 'None to browse; adding to the cart requires a logged-in user (UC08).',
    main: [
      '1. The user opens “Combo công thức” and selects a combo (for example Tiramisu).',
      '2. The system shows the ingredients with price, preparation time, servings and the preparation steps.',
      '3. The user unticks the ingredients already owned; the system updates the total.',
      '4. The user chooses “Thêm … nguyên liệu vào giỏ”; the selected items are added to the cart (UC04).',
    ],
    alt: ['A1. The user is not logged in: the system asks to log in before adding to the cart.'],
    br: 'BR-06 (recipe combo availability).',
    figs: [['06-chi-tiet-combo.png', 'SCR-06 — Recipe combo detail (“Bánh Tiramisu Truyền Thống Nước Ý”)']],
  },
  {
    id: 'UC04', name: 'Manage shopping cart', vn: 'Quản lý giỏ hàng', actor: 'User (logged in)', scr: 'SCR-07', pri: 'High',
    goal: 'The user reviews and adjusts the items to buy.',
    pre: 'The user is logged in; the cart contains at least one item.',
    main: [
      '1. The user adds products from the list, the product detail, a combo or the wishlist; the mini cart is updated.',
      '2. The user opens the cart.',
      '3. The user changes a quantity, removes an item or clears the cart.',
      '4. The system recalculates line totals, applies the wholesale tier price automatically, adds the cold-pack fee when needed and shows the progress to free shipping.',
      '5. The user enters a voucher code (**«extend» Apply voucher code**); the system validates it and shows the discount.',
      '6. The user chooses “Tiến hành thanh toán” to go to UC05.',
    ],
    alt: ['A1. The voucher is invalid, expired or the order is below its minimum value: an error message is shown.', 'A2. The cart is empty: the system shows a message and a link to the product list.'],
    br: 'BR-01 (cold-pack fee), BR-02 (tier price), BR-05 (voucher).',
    figs: [['07-gio-hang.png', 'SCR-07 — Shopping cart (“Giỏ hàng”)']],
  },
  {
    id: 'UC05', name: 'Place an order and pay', vn: 'Đặt hàng và thanh toán', actor: 'User (logged in)', scr: 'SCR-08, SCR-09', pri: 'High',
    goal: 'The user completes the purchase of the items in the cart.',
    pre: 'The cart is not empty and the user is logged in.',
    main: [
      '1. Step 1 “Thông tin nhận hàng”: the user chooses home delivery or pick-up at a store and selects a saved address or enters recipient name, phone, e-mail, address and note.',
      '2. Step 2 “Phương thức vận chuyển”: the user chooses standard delivery or cold-chain truck; the system adds the delivery fee.',
      '3. Step 3 “Thanh toán và xác nhận”: the user chooses VNPay QR, MoMo, bank transfer or COD and, if needed, requests a VAT invoice (**«extend» Request VAT invoice**; wholesale customers have the company data pre-filled).',
      '4. The user confirms; the system creates the order, shows the confirmation page with the order code and sends a confirmation e-mail/SMS.',
    ],
    alt: ['A1. A required field is missing: errors are shown and the user stays on the step.', 'A2. The online payment fails or is cancelled: the system shows an error and lets the user retry or choose another method.'],
    br: 'BR-01 (cold chain), BR-05 (voucher), BR-07 (currency).',
    figs: [['08-thanh-toan.png', 'SCR-08 — Checkout, step 1 (“Thanh toán”)']],
  },
  {
    id: 'UC06', name: 'Track an order', vn: 'Theo dõi đơn hàng', actor: 'User', scr: 'SCR-10, SCR-11, SCR-16', pri: 'High',
    goal: 'The user follows the status and the delivery of an order.',
    pre: 'A guest needs the order code and phone number; a logged-in user needs at least one order.',
    main: [
      '1. A guest opens “Tra cứu đơn hàng” and enters order code and phone; a logged-in user opens “Đơn hàng của tôi” and filters by status.',
      '2. The user opens an order.',
      '3. The system shows the status, the five-step delivery journey with times, driver and vehicle, the cold-box temperature (cold-chain orders), payment status and cost summary.',
      '4. The user may cancel the order, re-order its items, print the invoice or download the e-invoice PDF.',
    ],
    alt: ['A1. Code and phone do not match any order: a “not found” message is shown.', 'A2. The order is already packed or shipped: the cancel action is not offered.'],
    br: 'BR-08 (order status and cancellation).',
    figs: [['11-theo-doi-don.png', 'SCR-11 — Order tracking (“Đơn hàng #GHP-889120”)']],
  },
  {
    id: 'UC07', name: 'Manage personal account', vn: 'Quản lý tài khoản cá nhân', actor: 'User (logged in)', scr: 'SCR-15, SCR-17, SCR-18, SCR-19, SCR-20', pri: 'Medium',
    goal: 'The user maintains personal data, addresses, favourites and (wholesale) business data.',
    pre: 'The user is logged in.',
    main: [
      '1. The user opens “Tài khoản”; the overview shows loyalty points, recent orders and the default address.',
      '2. The user manages the address book (add, edit, delete, set default) and updates personal information or password.',
      '3. The user opens the wishlist, removes favourites, or writes a product review with stars and a comment.',
      '4. A wholesale customer also opens the business profile: company data, VAT information, discount table and credit limit.',
    ],
    alt: ['A1. Invalid data (for example a wrong password confirmation): an error is shown and nothing is saved.'],
    br: 'BR-04 (wholesale account).',
    figs: [['15-tai-khoan.png', 'SCR-15 — Account overview (“Tài khoản”)']],
  },
  {
    id: 'UC08', name: 'Log in', vn: 'Đăng nhập', actor: 'User, Admin', scr: 'SCR-12, SCR-14', pri: 'High',
    goal: 'A registered person signs in to use the storefront or the administration console.',
    pre: 'The person has an account.',
    main: [
      '1. The person opens “Đăng nhập” and enters e-mail or phone and password (option “Ghi nhớ đăng nhập”).',
      '2. The system authenticates the person and opens the storefront (User) or the administration console (Admin).',
    ],
    alt: ['A1. Wrong credentials: an error is shown.', 'A2. “Quên mật khẩu?”: the person enters an e-mail and receives a reset link (SCR-14).'],
    br: 'BR-03 (account lock). The prototype also offers three demo-account shortcuts: retail customer, wholesale customer and administrator.',
    figs: [['12-dang-nhap.png', 'SCR-12 — Login (“Đăng nhập tài khoản”)']],
  },
  {
    id: 'UC09', name: 'View dashboard and reports', vn: 'Xem tổng quan và báo cáo', actor: 'Admin', scr: 'SCR-A01, SCR-A11', pri: 'Medium',
    goal: 'Management follows the business and exports figures for decisions.',
    pre: 'The Admin is logged in.',
    main: [
      '1. The Admin opens “Bảng điều khiển”: revenue, new orders, orders to process, stock and expiry alerts, revenue chart and orders by status.',
      '2. The Admin switches the period between 7 and 30 days.',
      '3. The Admin opens “Báo cáo doanh thu”: revenue over time, top 10 products and the retail/wholesale share.',
      '4. The Admin exports a report to CSV.',
    ],
    alt: ['A1. There is no data for the selected period: the charts show an empty state.'],
    br: '—',
    figs: [['A01-admin-tong-quan.png', 'SCR-A01 — Dashboard (“Tổng quan hoạt động kinh doanh”)']],
  },
  {
    id: 'UC10', name: 'Process orders', vn: 'Xử lý đơn hàng', actor: 'Admin', scr: 'SCR-A02, SCR-A03, SCR-A10', pri: 'High',
    goal: 'Staff move each order from receipt to delivery.',
    pre: 'The Admin is logged in; there are orders to process.',
    main: [
      '1. The Admin opens “Đơn hàng”, filters by status tab or delivery method and searches by code, customer or phone.',
      '2. The Admin selects orders and approves them in bulk, or opens one order.',
      '3. The system shows items, customer and delivery data, payment and the VAT request.',
      '4. For cold-chain orders the Admin ticks the packing checklist: insulated box, gel packs, temperature sensor, seal.',
      '5. The Admin advances the status with the primary button (confirm → pack → hand over to the cold truck → complete); the status history is updated.',
      '6. The Admin prints the delivery note or the VAT invoice, exports the list to CSV and follows trips and temperatures in “Vận chuyển chuỗi lạnh”.',
    ],
    alt: ['A1. The order is cancelled by the customer or by the Admin: the status becomes “Đã hủy”.'],
    br: 'BR-01 (cold chain), BR-08 (order status).',
    figs: [['A02-admin-don-hang.png', 'SCR-A02 — Order list (“Danh sách đơn hàng”)'], ['A03-admin-chi-tiet-don.png', 'SCR-A03 — Order detail and packing checklist']],
  },
  {
    id: 'UC11', name: 'Manage products and categories', vn: 'Quản lý sản phẩm và danh mục', actor: 'Admin', scr: 'SCR-A04, SCR-A05, SCR-A06', pri: 'High',
    goal: 'The Admin keeps the catalogue accurate and up to date.',
    pre: 'The Admin is logged in.',
    main: [
      '1. The Admin opens “Sản phẩm”, searches and filters by category, storage condition or low stock.',
      '2. The Admin adds a product: name, SKU, category, brand, origin, packing, weight, description, ingredients, usage, storage, image, retail price, tiered wholesale prices and visibility.',
      '3. The Admin edits, hides, shows or deletes a product (deleting asks for confirmation).',
      '4. The Admin manages categories: add, rename, delete.',
    ],
    alt: ['A1. A required field (name, SKU) is missing: the form shows an error.'],
    br: 'BR-02 (tiered price), BR-01 (storage condition).',
    figs: [['A05-admin-form-san-pham.png', 'SCR-A05 — Add product form (“Thêm sản phẩm mới”)']],
  },
  {
    id: 'UC12', name: 'Manage stock and expiry', vn: 'Quản lý kho và hạn dùng', actor: 'Admin', scr: 'SCR-A07', pri: 'High',
    goal: 'Staff keep stock accurate and sell the earliest-expiring batches first.',
    pre: 'The Admin is logged in.',
    main: [
      '1. The Admin opens “Tồn kho và lô HSD”; the tab “Tồn kho theo sản phẩm” shows stock against the alert threshold.',
      '2. The Admin adjusts a quantity or creates a stock receipt (batch number, expiry date, quantity).',
      '3. The tab “Lô hàng và hạn dùng (FEFO)” lists batches by earliest expiry; low-stock and near-expiry alerts are highlighted.',
      '4. The tab “Nhật ký nhập / xuất” shows the stock movement log.',
    ],
    alt: ['A1. A quantity would become negative: the change is rejected.'],
    br: 'BR-03 (FEFO).',
    figs: [['A07-admin-ton-kho.png', 'SCR-A07 — Stock and batches (“Quản trị tồn kho và hạn dùng (FEFO)”)']],
  },
  {
    id: 'UC13', name: 'Manage promotions', vn: 'Quản lý khuyến mãi', actor: 'Admin', scr: 'SCR-A09', pri: 'Medium',
    goal: 'The Admin runs discount campaigns with vouchers.',
    pre: 'The Admin is logged in.',
    main: [
      '1. The Admin opens “Khuyến mãi và mã” and sees each voucher with type, condition, usage and validity.',
      '2. The Admin filters by type (fixed amount, percentage, free shipping).',
      '3. The Admin creates a voucher with code, value, minimum order, cap, validity and usage limit.',
      '4. The Admin enables or disables a voucher with its switch, or deletes it.',
    ],
    alt: ['A1. The code already exists or a value is invalid: the form shows an error.'],
    br: 'BR-05 (voucher).',
    figs: [['A09-admin-khuyen-mai.png', 'SCR-A09 — Promotions and vouchers (“Khuyến mãi & mã giảm giá”)']],
  },
  {
    id: 'UC14', name: 'Manage customers', vn: 'Quản lý khách hàng', actor: 'Admin', scr: 'SCR-A08', pri: 'Medium',
    goal: 'The Admin supervises customers and approves wholesale accounts.',
    pre: 'The Admin is logged in.',
    main: [
      '1. The Admin opens “Khách hàng”; tabs show all customers, wholesale customers and accounts pending approval.',
      '2. The Admin searches by name, e-mail, phone or company and exports the list to CSV.',
      '3. For a pending wholesale account the Admin opens the business profile and licence and approves or rejects the request.',
    ],
    alt: ['A1. The request is rejected: the account remains a retail account.'],
    br: 'BR-04 (wholesale account).',
    figs: [['A08-admin-khach-hang.png', 'SCR-A08 — Customer management (“Quản lý khách hàng”)']],
  },
  {
    id: 'UC15', name: 'Manage staff and settings', vn: 'Quản lý nhân viên và cài đặt', actor: 'Admin', scr: 'SCR-A12, SCR-A13', pri: 'Low',
    goal: 'The Admin controls who can do what and configures the store.',
    pre: 'The Admin is logged in.',
    main: [
      '1. The Admin opens “Nhân viên và quyền” and sees staff with role, location and status.',
      '2. The Admin invites a new staff member or edits an account.',
      '3. The Admin opens the permission matrix and updates the permissions of a staff role.',
      '4. The Admin opens “Cài đặt hệ thống” and updates store information, shipping fees and free-shipping threshold, enabled payment methods and automatic notifications.',
    ],
    alt: ['A1. An invitation e-mail is invalid: the form shows an error.'],
    br: '—',
    figs: [['A12-admin-nhan-vien.png', 'SCR-A12 — Staff and permissions (“Nhân viên và phân quyền hệ thống”)']],
  },
];
let n = 0;
for (const u of SPEC) {
  n += 1;
  add(H(3, `3.1.${n}`, `${u.id} — ${u.name} (${u.vn})`));
  add(kv([
    ['Actor / priority', `${u.actor} · ${u.pri}`],
    ['Screens', u.scr],
    ['Goal', u.goal],
    ['Pre-condition', u.pre],
    ['Main scenario', u.main],
    ['Alternative flows', u.alt],
    ['Business rules', u.br],
  ]));
  add(gap(80));
  for (const [f, c] of u.figs) add(shot(f, c, 540));
}

add(H(3, `3.1.${n + 1}`, 'Business rules'));
add(table([11, 24, 65], ['ID', 'Rule', 'Description'], [
  ['BR-01', 'Cold-chain rule', 'If the cart contains a product stored chilled (2–8 °C) or frozen, the order shall be packed in an insulated box with gel packs, a cold-pack fee of 15.000 ₫ applies (free for orders from 300.000 ₫) and cold-chain delivery (2–4 hours) is offered.'],
  ['BR-02', 'Wholesale tier price', 'When the quantity of a product reaches a tier threshold, the unit price drops to the tier price automatically in the cart, without a code. Example: butter 227 g – 78.000 ₫ (1–9), 72.000 ₫ (10–39), 66.000 ₫ (from 40).'],
  ['BR-03', 'OTP and account lock', 'A new account is activated with a 6-digit OTP valid for 5 minutes. The account is locked for 15 minutes after 5 consecutive wrong passwords.'],
  ['BR-04', 'Wholesale account', 'A wholesale account needs business name, tax code and address, and the status “approved” given by an Admin before tier prices and VAT pre-filling apply.'],
  ['BR-05', 'Voucher', 'A voucher is accepted only if it is active, inside its validity period, its usage limit is not exhausted and the order value reaches its minimum.'],
  ['BR-06', 'Recipe combo availability', 'A recipe combo is “in stock” only when all of its ingredients are in stock.'],
  ['BR-07', 'Currency and format', 'Amounts are in Vietnamese đồng (VND) with a thousands separator, for example 150.000 ₫.'],
  ['BR-08', 'Order status flow', 'Pending → Confirmed → Packing → Shipping → Delivered. An order can be cancelled only while it is Pending or Confirmed.'],
  ['BR-09', 'FEFO and alerts', 'Batches are issued first-expired, first-out. A batch with 30 days or fewer to expiry raises an alert (highlighted at 7 days or fewer); a cold-box temperature above 8 °C raises an alert.'],
]));
const brCount = 9; void brCount;

// 3.2 NFR
add(H(2, '3.2', 'Non-Functional Requirements Specification', { pageBreak: true }));
add(P('Each non-functional requirement states a quality attribute, a condition, a measure and a threshold, so that it can be tested. Priority: M = Must, S = Should. “Rel.” gives the release: 1.0 (prototype) or 2 (production).'));
const NH = ['ID', 'Requirement', 'How to confirm', 'Pri', 'Rel.'];
const NW = [12, 45, 29, 6, 8];
add(H(3, '3.2.1', 'External Interface Requirements'));
add(H(3, '3.2.1.1', 'User Interfaces'));
add(P('Screens are shown in section 3.1 and listed in Appendix B (SCR-xx). The user interface shall follow these requirements:'));
add(table(NW, NH, [
  ['NFR-U1', 'Usability: ≥ 90% of first-time test customers shall complete a purchase without training in ≤ 5 minutes; checkout shall take ≤ 6 steps; every error message shall be in Vietnamese and state the cause and the corrective action.', 'Usability test with 5–10 users on the prototype.', 'M', '1.0'],
  ['NFR-U2', 'Usability: the storefront shall be fully usable on smartphone (≥ 360 px), tablet and desktop without horizontal scrolling; the administration console is optimised for desktop and tablet.', 'Prototype review; checked at 360 px on SCR-01, 02, 04, 07, 08 and 15.', 'M', '1.0'],
  ['NFR-U3', 'Accessibility: body text of the storefront ≥ 14 px, text/background contrast ≥ 4.5:1 (WCAG 2.1 AA), alternative text for every product image.', 'Design review; contrast checker.', 'S', '1.0'],
  ['NFR-U4', 'Learnability: staff shall be able to learn the administration console within 1 day of training.', 'Observe staff using the prototype.', 'S', '1.0'],
]));
add(gap(80));
add(P('The same screens adapt to a phone (390 px), as shown below.', { keepNext: true }));
{
  const img = (f, wpx) => { const buf = fs.readFileSync(path.join(SHOTS, f)); const { w: iw, h: ih } = pngSize(buf); return new ImageRun({ type: 'png', data: buf, transformation: { width: wpx, height: Math.round(wpx * ih / iw) }, altText: { title: f, description: f, name: f } }); };
  add(new Paragraph({ alignment: AlignmentType.CENTER, keepNext: true, spacing: { before: 80, after: 60 }, children: [img('m-trang-chu.png', 190), new TextRun({ text: '        ' }), img('m-chi-tiet-san-pham.png', 190)] }));
  figN += 1;
  add(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: `Figure ${figN} — Responsive layout at 390 px: home page (SCR-01) and product detail (SCR-04)`, italics: true, size: 18, color: GREY })] }));
}
add(H(3, '3.2.1.2', 'Hardware Interfaces'));
add(P('No special hardware is required. Customers use smartphones, tablets or PCs; staff use PCs or tablets. Printing of delivery notes and invoices uses the print function of the browser.'));
add(H(3, '3.2.1.3', 'Software Interfaces'));
add(table(NW, NH, [
  ['NFR-C1', 'Compatibility: latest two versions of Chrome, Edge, Firefox and Safari; Android 10+ and iOS 14+ browsers.', 'Test on the listed browsers.', 'M', '1.0'],
  ['NFR-I1', 'Integration with the payment gateway, the delivery partner and the e-mail/SMS provider shall be done through replaceable interfaces so that a provider can be changed without changing the core.', 'Design review (release 2).', 'S', '2'],
]));
add(H(3, '3.2.1.4', 'Communications Interfaces'));
add(table(NW, NH, [
  ['NFR-I2', 'Communication between browser and server shall use HTTPS (TLS 1.2+); e-mail/SMS notifications shall be sent asynchronously so that a failure of the mail service does not block orders. In release 1.0 notifications are shown as on-screen messages.', 'Security scan; failure test of the mail service.', 'S', '2'],
]));
add(H(3, '3.2.2', 'Other Nonfunctional Requirements'));
add(H(3, '3.2.2.1', 'Performance Requirements'));
add(table(NW, NH, [
  ['NFR-P1', 'Performance: pages (home, list, detail) shall load in ≤ 3 seconds for 95% of requests on a 4G connection; search results in ≤ 2 seconds.', 'Lighthouse / browser timing on the prototype.', 'M', '1.0'],
  ['NFR-P2', 'Performance: placing an order shall respond in ≤ 5 seconds excluding time spent at the payment gateway.', 'Timing test of the checkout flow.', 'M', '2'],
  ['NFR-P3', 'Capacity: the system shall support at least 500 concurrent users, 10,000 products and 3,000 orders per day without degradation.', 'Load test.', 'S', '2'],
]));
add(H(3, '3.2.2.2', 'Design constraints'));
add(table(NW, NH, [
  ['NFR-D1', 'Technology: the prototype is a React + TypeScript single-page application styled with Tailwind CSS; only open-source or properly licensed components are used.', 'Dependency list; code review.', 'M', '1.0'],
  ['NFR-D2', 'Process: iterative development in sprints of 2 weeks; requirements, design and test documents are version-controlled.', 'Repository history.', 'M', '1.0'],
  ['NFR-D3', 'Source control: Git with branches and review before merge.', 'Repository settings.', 'M', '1.0'],
  ['NFR-D4', 'Testing: test cases derived from the use cases and a user acceptance test by GHP; critical (severity 1) defects = 0 at release.', 'Test report.', 'M', '1.0'],
  ['NFR-D5', 'Documentation: SRS (IEEE 830) and screen prototypes are delivered; UML is used for models.', 'Document review.', 'M', '1.0'],
  ['NFR-D6', 'Consistency: the interface shall follow the GHP design system (colours, Be Vietnam Pro typography, components) on all screens.', 'Style-guide page review.', 'S', '1.0'],
]));
add(H(3, '3.2.2.3', 'Safety Requirements'));
add(P('Safety here means protection against loss or damage of data and business harm from the use of the product.', { italics: true, color: GREY }));
add(table(NW, NH, [
  ['NFR-R1', 'Destructive actions (delete a product, a category or a voucher) shall require a confirmation by the user.', 'Walkthrough of SCR-A04, A06, A09.', 'M', '1.0'],
  ['NFR-R2', 'Data consistency: a stock quantity shall never become negative, and concurrent orders for the last item shall be resolved so that only one succeeds.', 'Test of stock adjustment; concurrency test.', 'M', '2'],
  ['NFR-R3', 'Reliability: no confirmed order may be lost; daily backup with retention ≥ 30 days; RPO ≤ 24 h, RTO ≤ 4 h.', 'Backup/restore test.', 'M', '2'],
]));
add(H(3, '3.2.2.4', 'Security Requirements'));
add(table(NW, NH, [
  ['NFR-S1', 'Authentication: the registration form shall require a password of at least 6 characters; in production passwords shall be ≥ 8 characters with letters and digits, stored hashed with salt, and the account locked 15 minutes after 5 failed logins.', 'Form validation test; security review.', 'M', '1.0'],
  ['NFR-S2', 'Authorization: the roles User (guest/customer) and Admin shall be separated; administration screens shall not be accessible to a User. In release 1.0 the administration routes are not guarded (ISS-07).', 'Role-based test cases.', 'M', '2'],
  ['NFR-S3', 'Data protection: all traffic over HTTPS/TLS 1.2+; protection against OWASP Top 10 risks (SQL injection, XSS, CSRF); sessions time out after 30 minutes of inactivity.', 'Security scan.', 'M', '2'],
  ['NFR-S4', 'Payment: the system shall not store card numbers or CVV; card data is handled by the payment gateway (PCI DSS compliant).', 'Design review.', 'M', '2'],
  ['NFR-S5', 'Audit: login, price change, stock adjustment and order status change shall be logged with user and time and kept ≥ 1 year.', 'Log inspection.', 'S', '2'],
]));
add(H(3, '3.2.2.5', 'Software Quality Attributes'));
add(table(NW, NH, [
  ['NFR-A1', 'Availability: ≥ 99.5% uptime per month, excluding planned maintenance announced ≥ 24 hours before and outside 22:00–06:00.', 'Hosting SLA; monitoring.', 'M', '2'],
  ['NFR-M1', 'Maintainability: the code shall be modular (reusable components) and follow the agreed coding standard; a defect fix can be deployed without downtime of more than 15 minutes.', 'Code review; deployment test.', 'S', '1.0'],
]));

// 4. Other requirements
add(H(1, '4.', 'Other Requirements', { pageBreak: true }));
add(P('Internationalization, legal requirements and data migration:', { italics: true, color: GREY }));
add(table(NW, NH, [
  ['NFR-L1', 'Localization: Vietnamese language, VND currency, dd/MM/yyyy dates; the design allows adding English later.', 'Interface review.', 'M', '1.0'],
  ['NFR-LG1', 'Legal: comply with Vietnamese e-commerce, consumer-protection and personal-data rules (consent to collect data, right to correct/delete data); show the policies (return, privacy, terms); support VAT e-invoice information.', 'Document analysis; ask the GHP accountant.', 'M', '1.0'],
  ['NFR-D7', 'Data migration: existing products, prices and customer data of the shops shall be imported (Excel/CSV) before go-live.', 'Migration test.', 'M', '2'],
]));

// Appendices
add(H(1, 'Appendix A:', 'Glossary', { pageBreak: true }));
add(table([24, 76], null, [
  ['GHP', 'Gia Hòa Phát company, owner of the shops and of the system.'],
  ['BakeCraft', 'Project name of the Online Shopping for Baking Ingredients System; the brand shown on the interface is “Gia Hòa Phát Bakery Supply”.'],
  ['User', 'Role of any person using the storefront: guest, retail customer or wholesale customer.'],
  ['Admin', 'Role of any GHP operator using the administration console (administrator, sales, warehouse, accounting staff).'],
  ['Guest', 'Visitor who is not logged in.'],
  ['Wholesale customer (B2B)', 'Bakery, café or reseller with an approved business account who gets tiered prices and a pre-filled VAT invoice.'],
  ['Cold chain', 'Transport and storage of chilled (2–8 °C) or frozen goods in insulated boxes with gel packs and cold trucks.'],
  ['FEFO', 'First-Expired, First-Out: the batch that expires first is issued first.'],
  ['Batch / lot', 'A quantity of a product received together, with one batch number and expiry date.'],
  ['Tier price', 'Unit price that decreases when the quantity reaches a threshold.'],
  ['Recipe combo', 'A set of ingredients sold together for one recipe.'],
  ['Voucher', 'Code giving a discount or free shipping on an order.'],
  ['COD', 'Cash on delivery: payment when the goods are delivered.'],
  ['OTP', 'One-time password sent by SMS or e-mail to verify an account.'],
  ['VAT invoice', 'Value-added-tax invoice (including e-invoice) requested by a business customer.'],
  ['SKU', 'Stock keeping unit: unique code of a product.'],
  ['SCR', 'Screen code used by the prototype’s UI specification (SCR-01 … SCR-24, SCR-A01 … SCR-A13).'],
  ['Order status', 'Pending (Chờ xác nhận) → Confirmed (Đã xác nhận) → Packing (Đóng gói) → Shipping (Đang giao) → Delivered (Hoàn tất), or Cancelled (Đã hủy).'],
  ['RPO / RTO', 'Recovery point / recovery time objective after a failure.'],
  ['Fit criterion', 'Measure that makes a requirement verifiable.'],
], { firstFill: true, firstBold: true }));

add(H(1, 'Appendix B:', 'Analysis Models'));
add(P('Context diagram: see 2.1 (Figure 1). Use case diagram: see 3.1 (Figure 2). Screen prototypes: see 3.1. The screen inventory below lists every screen of the prototype; routes are hash routes (for example #/san-pham).'));
add(table([11, 38, 33, 18], ['Screen', 'Name', 'Route', 'Use case'], [
  ['SCR-01', 'Trang chủ', '/', 'UC02'], ['SCR-02', 'Danh sách sản phẩm', '/san-pham', 'UC02'], ['SCR-03', 'Kết quả tìm kiếm', '/tim-kiem?q=', 'UC02'],
  ['SCR-04', 'Chi tiết sản phẩm', '/san-pham/:id', 'UC02'], ['SCR-05', 'Combo công thức', '/combo', 'UC03'], ['SCR-06', 'Chi tiết combo', '/combo/:id', 'UC03'],
  ['SCR-07', 'Giỏ hàng', '/gio-hang', 'UC04'], ['SCR-08', 'Thanh toán', '/thanh-toan', 'UC05'], ['SCR-09', 'Đặt hàng thành công', '/dat-hang/thanh-cong/:ma', 'UC05'],
  ['SCR-10', 'Tra cứu đơn', '/tra-cuu-don-hang', 'UC06'], ['SCR-11', 'Theo dõi đơn hàng', '/don-hang/:ma', 'UC06'], ['SCR-12', 'Đăng nhập', '/dang-nhap', 'UC08'],
  ['SCR-13', 'Đăng ký + OTP', '/dang-ky', 'UC01'], ['SCR-14', 'Quên mật khẩu', '/quen-mat-khau', 'UC08'], ['SCR-15', 'Tổng quan tài khoản', '/tai-khoan', 'UC07'],
  ['SCR-16', 'Đơn hàng của tôi', '/tai-khoan/don-hang', 'UC06'], ['SCR-17', 'Sổ địa chỉ', '/tai-khoan/dia-chi', 'UC07'], ['SCR-18', 'Yêu thích', '/tai-khoan/yeu-thich', 'UC07'],
  ['SCR-19', 'Hồ sơ và mật khẩu', '/tai-khoan/ho-so', 'UC07'], ['SCR-20', 'Doanh nghiệp', '/tai-khoan/doanh-nghiep', 'UC07'],
  ['SCR-21…24', 'Mua sỉ, Hệ thống cửa hàng, Hỗ trợ và chính sách, Giới thiệu và Liên hệ', '/mua-si, /cua-hang, /ho-tro, /gioi-thieu, /lien-he', 'supporting pages'],
  ['SCR-A01', 'Tổng quan quản trị', '/admin', 'UC09'], ['SCR-A02', 'Danh sách đơn', '/admin/don-hang', 'UC10'], ['SCR-A03', 'Chi tiết và xử lý đơn', '/admin/don-hang/:id', 'UC10'],
  ['SCR-A04', 'Sản phẩm', '/admin/san-pham', 'UC11'], ['SCR-A05', 'Thêm / sửa sản phẩm', '/admin/san-pham/moi, /:id', 'UC11'], ['SCR-A06', 'Danh mục', '/admin/danh-muc', 'UC11'],
  ['SCR-A07', 'Tồn kho và lô hàng', '/admin/ton-kho', 'UC12'], ['SCR-A08', 'Khách hàng', '/admin/khach-hang', 'UC14'], ['SCR-A09', 'Khuyến mãi và voucher', '/admin/khuyen-mai', 'UC13'],
  ['SCR-A10', 'Vận chuyển và chuỗi lạnh', '/admin/van-chuyen', 'UC10'], ['SCR-A11', 'Báo cáo', '/admin/bao-cao', 'UC09'], ['SCR-A12', 'Nhân viên và phân quyền', '/admin/nhan-vien', 'UC15'],
  ['SCR-A13', 'Cài đặt', '/admin/cai-dat', 'UC15'],
], { size: 17 }));

add(H(1, 'Appendix C:', 'Issues List', { pageBreak: true }));
add(table([10, 46, 20, 12, 12], ['ID', 'Issue / TBD', 'Needs', 'Owner', 'Status'], [
  ['ISS-01', 'Confirm numeric targets of objectives and NFRs (revenue share, response time, uptime).', 'GHP owner / manager', 'Team 1', 'Open'],
  ['ISS-02', 'Which payment methods and gateway provider will be used in production?', 'Sponsor, IT team', 'Team 1', 'Open'],
  ['ISS-03', 'Delivery area, shipping fees, cold-chain partner and its interface (API or manual).', 'Sales staff, delivery partner', 'Team 1', 'Open'],
  ['ISS-04', 'Return/refund policy and VAT e-invoice requirements.', 'Accountant, legal', 'Team 1', 'Open'],
  ['ISS-05', 'Section “3.4” is mentioned in the assignment but not in the template; design/architecture/development requirements are placed in 3.2.2.2.', 'Lecturer', 'Team 1', 'Open'],
  ['ISS-06', 'The system has two roles only (User, Admin). Confirm that merging sales and warehouse staff into Admin is acceptable.', 'Lecturer', 'Team 1', 'Open'],
  ['ISS-07', 'The prototype does not guard the administration routes: /admin is reachable by URL for any user. To be enforced with the back-end (NFR-S2).', 'Team 1', 'Team 1', 'Open'],
  ['ISS-08', 'Sample data is not fully consistent (dashboard counts versus the order list; the demo retail customer is listed as wholesale in the customer list). Fix before the demonstration.', 'Team 1', 'Team 1', 'Open'],
], { size: 17 }));

// ───────────── ghép tài liệu ─────────────
function tocEntries() {
  return headings.filter((h) => h.level <= 3 && !(h.level === 3 && /^3\.2\.1\.[1-4]$|^3\.2\.2\.[1-5]$/.test(h.num) === false && false));
}
function tocPara(h) {
  const key = `${h.num}|${h.title}`;
  const pg = PAGES[key] !== undefined ? String(PAGES[key]) : '';
  const left = h.level === 1 ? 0 : h.level === 2 ? 280 : 700;
  const numW = h.level === 1 ? (/^Appendix/.test(h.num) ? 1250 : 450) : h.level === 2 ? 760 : 1200;
  return new Paragraph({
    spacing: { after: h.level === 1 ? 50 : 20, before: h.level === 1 ? 90 : 0 },
    indent: { left },
    tabStops: [{ type: TabStopType.LEFT, position: left + numW }, { type: TabStopType.RIGHT, position: TW, leader: LeaderType.DOT }],
    children: [
      new TextRun({ text: h.num, bold: h.level === 1, size: h.level === 3 ? 17 : 19 }),
      new TextRun({ children: [new Tab()] }),
      new TextRun({ text: h.title, bold: h.level === 1, size: h.level === 3 ? 17 : 19 }),
      new TextRun({ children: [new Tab()] }),
      new TextRun({ text: pg, bold: h.level === 1, size: h.level === 3 ? 17 : 19 }),
    ],
  });
}
const headerPara = () => new Paragraph({
  tabStops: [{ type: TabStopType.RIGHT, position: TW }],
  border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '000000', space: 4 } },
  children: [
    new TextRun({ text: 'Software Requirements Specification for BakeCraft', italics: true, bold: true, font: HEAD, size: 18 }),
    new TextRun({ children: [new Tab(), 'Page ', PageNumber.CURRENT], italics: true, bold: true, font: HEAD, size: 18 }),
  ],
});
const pageMargin = { top: 1304, right: 1247, bottom: 1134, left: 1247 };
const pageSize = { width: 11906, height: 16838 };

// bìa
const cover = [
  new Table({
    width: { size: TW, type: WidthType.DXA }, columnWidths: [TW],
    rows: [new TableRow({ children: [new TableCell({ width: { size: TW, type: WidthType.DXA }, borders: { top: bd, left: bd, right: bd, bottom: { style: BorderStyle.SINGLE, size: 36, color: '000000' } }, margins: { top: 140, bottom: 380, left: 140, right: 140 }, children: [new Paragraph({ children: [new TextRun({ text: 'Gia Hoa Phat company', font: HEAD, size: 30 })] })] })] })],
  }),
  new Paragraph({ spacing: { before: 1500 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'System/Software', bold: true, size: 64 })] }),
  new Paragraph({ alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Requirements Specification', bold: true, size: 64 })] }),
  new Paragraph({ spacing: { before: 500 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'for', bold: true, size: 36 })] }),
  new Paragraph({ spacing: { before: 300 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'BakeCraft', bold: true, size: 76 })] }),
  new Paragraph({ spacing: { before: 120 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Gia Hòa Phát Bakery Supply – Online Shopping for Baking Ingredients', size: 24 })] }),
  new Paragraph({ spacing: { before: 700 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Version 1.0 (draft for review)', bold: true, size: 28 })] }),
  new Paragraph({ spacing: { before: 360 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'Prepared by Team 1', bold: true, size: 28 })] }),
  new Paragraph({ spacing: { before: 360 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: 'FPT University', bold: true, size: 28 })] }),
  new Paragraph({ spacing: { before: 360 }, alignment: AlignmentType.RIGHT, children: [new TextRun({ text: '10/10/2026', bold: true, size: 28 })] }),
  new Paragraph({ spacing: { before: 2600 }, alignment: AlignmentType.CENTER, children: [new TextRun({ text: 'Copyright © 2002 by Sang Nguyen.', italics: true, bold: true, font: HEAD, size: 18 })] }),
];

// phần đầu: mục lục + lịch sử sửa đổi
const front = [
  new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { after: 160 }, children: [new TextRun({ text: 'Table of Contents' })] }),
  ...headings.filter((h) => h.level <= 3).map(tocPara),
  new Paragraph({ children: [new PageBreak()] }),
  new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { after: 160 }, children: [new TextRun({ text: 'Revision History' })] }),
  table([16, 14, 56, 14], ['Name', 'Date', 'Reason For Changes', 'Version'], [
    ['Team 1', '09/10/2026', 'Initial draft of the SRS following the IEEE 830 template.', '0.9'],
    ['Team 1', '10/10/2026', 'Re-scoped to the front-end prototype with two roles (User, Admin); added use cases UC01–UC15, screen prototypes and diagrams; removed back-end and infrastructure requirements; unified names, order statuses and release plan.', '1.0'],
  ]),
];

const doc = new Document({
  creator: 'Team 1',
  title: 'System/Software Requirements Specification for BakeCraft',
  styles: {
    default: { document: { run: { font: BODY, size: 20 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: HEAD, size: 34, bold: true, color: '000000' }, paragraph: { spacing: { before: 360, after: 120 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: HEAD, size: 28, bold: true, color: '000000' }, paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
      { id: 'Heading3', name: 'Heading 3', basedOn: 'Normal', next: 'Normal', quickFormat: true, run: { font: HEAD, size: 23, bold: true, color: '000000' }, paragraph: { spacing: { before: 200, after: 100 }, outlineLevel: 2 } },
    ],
  },
  numbering: { config: [{ reference: 'bul', levels: [{ level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 400, hanging: 220 } } } }] }] },
  sections: [
    { properties: { page: { size: pageSize, margin: pageMargin } }, children: cover },
    { properties: { type: SectionType.NEXT_PAGE, page: { size: pageSize, margin: pageMargin, pageNumbers: { start: 2, formatType: NumberFormat.LOWER_ROMAN } } }, headers: { default: new Header({ children: [headerPara()] }) }, children: front },
    { properties: { type: SectionType.NEXT_PAGE, page: { size: pageSize, margin: pageMargin, pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL } } }, headers: { default: new Header({ children: [headerPara()] }) }, children: body },
  ],
});

Packer.toBuffer(doc).then((buf) => {
  fs.writeFileSync(OUT, buf);
  fs.writeFileSync(OUT.replace(/\.docx$/, '.headings.json'), JSON.stringify(headings, null, 1));
  console.log('ghi', OUT, (buf.length / 1024).toFixed(0) + ' KB', headings.length, 'tiêu đề,', figN, 'hình');
});
