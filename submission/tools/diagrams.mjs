// Sơ đồ use case rút gọn (2 vai trò) + sơ đồ ngữ cảnh → SVG + PNG (Chrome headless, nét x2).
// Dùng: node diagrams.mjs <thư mục ra>
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';

const OUT = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const FONT = `font-family="'Segoe UI', Arial, 'Helvetica Neue', sans-serif"`;
const INK = '#1c1917';
const GREY = '#6b6560';

function wrap(text, max = 26) {
  if (text.length <= max) return [text];
  const w = text.split(' ');
  let best = null;
  for (let i = 1; i < w.length; i++) {
    const a = w.slice(0, i).join(' '), b = w.slice(i).join(' ');
    const s = Math.max(a.length, b.length);
    if (!best || s < best.s) best = { a, b, s };
  }
  return [best.a, best.b];
}
const clip = (cx, cy, rx, ry, px, py) => {
  const dx = px - cx, dy = py - cy;
  const t = 1 / Math.sqrt((dx / rx) ** 2 + (dy / ry) ** 2);
  return [cx + dx * t, cy + dy * t];
};

function actor(x, yc, lines, descLines) {
  const y = yc - 32; // đầu
  let s = `<g stroke="${INK}" stroke-width="2.2" fill="none" stroke-linecap="round">
    <circle cx="${x}" cy="${y}" r="15" fill="#fff"/>
    <line x1="${x}" y1="${y + 15}" x2="${x}" y2="${y + 64}"/>
    <line x1="${x - 28}" y1="${y + 34}" x2="${x + 28}" y2="${y + 34}"/>
    <line x1="${x}" y1="${y + 64}" x2="${x - 22}" y2="${y + 98}"/>
    <line x1="${x}" y1="${y + 64}" x2="${x + 22}" y2="${y + 98}"/></g>`;
  s += `<text x="${x}" y="${y + 126}" text-anchor="middle" ${FONT} font-size="19" font-weight="700" fill="${INK}">${esc(lines[0])}</text>`;
  s += `<text x="${x}" y="${y + 148}" text-anchor="middle" ${FONT} font-size="15" fill="${GREY}">${esc(lines[1])}</text>`;
  descLines.forEach((d, i) => { s += `<text x="${x}" y="${y + 172 + i * 18}" text-anchor="middle" ${FONT} font-size="13" font-style="italic" fill="${GREY}">${esc(d)}</text>`; });
  return s;
}

// ═════════════ SƠ ĐỒ USE CASE ═════════════
const MAIN = [
  { id: 'UC01', name: 'Đăng ký tài khoản', who: 'U' },
  { id: 'UC02', name: 'Tìm kiếm và xem sản phẩm', who: 'U' },
  { id: 'UC03', name: 'Xem combo công thức làm bánh', who: 'U' },
  { id: 'UC04', name: 'Quản lý giỏ hàng', who: 'U' },
  { id: 'UC05', name: 'Đặt hàng và thanh toán', who: 'U' },
  { id: 'UC06', name: 'Theo dõi đơn hàng', who: 'U' },
  { id: 'UC07', name: 'Quản lý tài khoản cá nhân', who: 'U' },
  { id: 'UC08', name: 'Đăng nhập', who: 'UA' },
  { id: 'UC09', name: 'Xem tổng quan và báo cáo', who: 'A' },
  { id: 'UC10', name: 'Xử lý đơn hàng', who: 'A' },
  { id: 'UC11', name: 'Quản lý sản phẩm và danh mục', who: 'A' },
  { id: 'UC12', name: 'Quản lý kho và hạn dùng', who: 'A' },
  { id: 'UC13', name: 'Quản lý khuyến mãi', who: 'A' },
  { id: 'UC14', name: 'Quản lý khách hàng', who: 'A' },
  { id: 'UC15', name: 'Quản lý nhân viên và cài đặt', who: 'A' },
];
// quan hệ: kind 'include' (gốc → con) | 'extend' (con → gốc); row = hàng của use case gốc
const SUBS = [
  { row: 0, kind: 'include', name: 'Xác thực mã OTP' },
  { row: 3, kind: 'extend', name: 'Áp dụng mã giảm giá' },
  { row: 4, kind: 'extend', name: 'Yêu cầu hóa đơn VAT' },
];

function useCaseSvg() {
  const W = 1500, TOP = 140, PITCH = 78;
  const MX = 640, MRX = 180, MRY = 30; // cột chính
  const SX = 1060, SRX = 125, SRY = 26; // cột phụ
  const BX = 340, BW = 880;
  const y = (i) => TOP + i * PITCH;
  const H = y(MAIN.length - 1) + 130;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs><marker id="ar" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="userSpaceOnUse">
    <path d="M1,1 L10,6 L1,11" fill="none" stroke="${INK}" stroke-width="1.6"/></marker></defs>
  <rect width="${W}" height="${H}" fill="#fff"/>`;
  // khung hệ thống + thẻ tên
  s += `<rect x="${BX}" y="64" width="${BW}" height="${H - 64 - 70}" fill="#fff" stroke="${INK}" stroke-width="2"/>`;
  s += `<rect x="${BX + BW - 330}" y="28" width="330" height="36" fill="#fff" stroke="${INK}" stroke-width="2"/>`;
  s += `<text x="${BX + BW - 165}" y="52" text-anchor="middle" ${FONT} font-size="17" font-weight="700" fill="${INK}">Gia Hòa Phát Bakery Supply</text>`;

  // tác nhân
  const uRows = MAIN.map((m, i) => ({ ...m, i })).filter((m) => m.who.includes('U'));
  const aRows = MAIN.map((m, i) => ({ ...m, i })).filter((m) => m.who.includes('A'));
  const avg = (rs) => rs.reduce((t, r) => t + y(r.i), 0) / rs.length;
  const uy = avg(uRows), ay = avg(aRows);
  const UX = 150, AX = W - 150;

  // đường kết hợp (vẽ trước để elip che đầu mút)
  for (const r of uRows) {
    s += `<line x1="${UX + 28}" y1="${uy}" x2="${MX - MRX}" y2="${y(r.i)}" stroke="${INK}" stroke-width="1.6"/>`;
  }
  for (const r of aRows) {
    s += `<line x1="${AX - 28}" y1="${ay}" x2="${MX + MRX}" y2="${y(r.i)}" stroke="${INK}" stroke-width="1.6"/>`;
  }
  // use case chính
  MAIN.forEach((m, i) => {
    const cy = y(i);
    s += `<ellipse cx="${MX}" cy="${cy}" rx="${MRX}" ry="${MRY}" fill="#fff" stroke="${INK}" stroke-width="1.8"/>`;
    s += `<text x="${MX}" y="${cy - 10}" text-anchor="middle" ${FONT} font-size="12" font-weight="700" fill="${GREY}">${m.id}</text>`;
    const ls = wrap(m.name, 40);
    ls.forEach((l, k) => { s += `<text x="${MX}" y="${cy + (ls.length === 1 ? 8 : 6 + k * 17)}" text-anchor="middle" ${FONT} font-size="15" font-weight="600" fill="${INK}">${esc(l)}</text>`; });
  });
  // use case phụ + quan hệ
  for (const sub of SUBS) {
    const cy = y(sub.row);
    s += `<ellipse cx="${SX}" cy="${cy}" rx="${SRX}" ry="${SRY}" fill="#fff" stroke="${INK}" stroke-width="1.6"/>`;
    s += `<text x="${SX}" y="${cy + 5}" text-anchor="middle" ${FONT} font-size="14" font-weight="500" fill="${INK}">${esc(sub.name)}</text>`;
    const x1 = MX + MRX, x2 = SX - SRX;
    const [from, to] = sub.kind === 'include' ? [x1, x2] : [x2, x1];
    s += `<line x1="${from}" y1="${cy}" x2="${to}" y2="${cy}" stroke="${INK}" stroke-width="1.5" stroke-dasharray="7 5" marker-end="url(#ar)"/>`;
    s += `<text x="${(x1 + x2) / 2}" y="${cy - 8}" text-anchor="middle" ${FONT} font-size="13" font-style="italic" fill="${GREY}">«${sub.kind}»</text>`;
  }
  // tác nhân (vẽ sau)
  s += actor(UX, uy, ['Người dùng', '(User)'], ['gồm khách vãng lai,', 'khách lẻ và khách sỉ']);
  s += actor(AX, ay, ['Quản trị viên', '(Admin)'], ['gồm nhân viên kho', 'và vận hành']);
  // chú giải
  const ly = H - 34;
  s += `<line x1="${BX}" y1="${ly}" x2="${BX + 60}" y2="${ly}" stroke="${INK}" stroke-width="1.6"/><text x="${BX + 72}" y="${ly + 5}" ${FONT} font-size="14" fill="${GREY}">Kết hợp (tác nhân thực hiện use case)</text>`;
  s += `<line x1="${BX + 400}" y1="${ly}" x2="${BX + 460}" y2="${ly}" stroke="${INK}" stroke-width="1.5" stroke-dasharray="7 5" marker-end="url(#ar)"/><text x="${BX + 474}" y="${ly + 5}" ${FONT} font-size="14" fill="${GREY}">«include» / «extend»</text>`;
  s += '</svg>';
  return { svg: s, W, H };
}

// ═════════════ SƠ ĐỒ NGỮ CẢNH ═════════════
function contextSvg() {
  const W = 1300, H = 700;
  let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs><marker id="ar" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto" markerUnits="userSpaceOnUse"><path d="M1,1 L10,6 L1,11" fill="none" stroke="${INK}" stroke-width="1.6"/></marker>
  <marker id="al" markerWidth="12" markerHeight="12" refX="2" refY="6" orient="auto" markerUnits="userSpaceOnUse"><path d="M11,1 L2,6 L11,11" fill="none" stroke="${INK}" stroke-width="1.6"/></marker></defs>
  <rect width="${W}" height="${H}" fill="#fff"/>`;
  const SX = 430, SY = 100, SW = 440, SH = 500;
  s += `<rect x="${SX}" y="${SY}" width="${SW}" height="${SH}" rx="14" fill="#fff7ed" stroke="${INK}" stroke-width="2.2"/>`;
  s += `<text x="${SX + SW / 2}" y="${SY + 44}" text-anchor="middle" ${FONT} font-size="21" font-weight="700" fill="${INK}">Gia Hòa Phát Bakery Supply</text>`;
  s += `<text x="${SX + SW / 2}" y="${SY + 70}" text-anchor="middle" ${FONT} font-size="14" fill="${GREY}">Ứng dụng web (giao diện prototype, dữ liệu mô phỏng)</text>`;
  const mods = [['Cửa hàng trực tuyến', 'Tìm, giỏ hàng, đặt hàng, theo dõi đơn, tài khoản', 190], ['Bảng điều khiển quản trị', 'Đơn hàng, sản phẩm, kho/HSD, khuyến mãi, báo cáo', 430]];
  mods.forEach((m) => {
    s += `<rect x="${SX + 30}" y="${m[2]}" width="${SW - 60}" height="100" rx="8" fill="#fff" stroke="${INK}" stroke-width="1.6"/>`;
    s += `<text x="${SX + SW / 2}" y="${m[2] + 40}" text-anchor="middle" ${FONT} font-size="17" font-weight="700" fill="${INK}">${esc(m[0])}</text>`;
    s += `<text x="${SX + SW / 2}" y="${m[2] + 68}" text-anchor="middle" ${FONT} font-size="13.5" fill="${GREY}">${esc(m[1])}</text>`;
  });
  // tác nhân bên trái: mũi tên nằm ngang vào đúng phân hệ
  const ax = 150;
  const acts = [[240, ['Người dùng', '(User)'], ['khách vãng lai / lẻ / sỉ'], 'duyệt, đặt hàng'], [480, ['Quản trị viên', '(Admin)'], ['quản trị và vận hành'], 'quản lý, xử lý']];
  acts.forEach((a) => {
    s += actor(ax, a[0], a[1], a[2]);
    s += `<line x1="${ax + 34}" y1="${a[0]}" x2="${SX + 30}" y2="${a[0]}" stroke="${INK}" stroke-width="1.8" marker-end="url(#ar)" marker-start="url(#al)"/>`;
    s += `<text x="${(ax + 34 + SX) / 2}" y="${a[0] - 10}" text-anchor="middle" ${FONT} font-size="13.5" font-style="italic" fill="${GREY}">${esc(a[3])}</text>`;
  });
  // hệ thống ngoài bên phải: mũi tên nằm ngang
  const ext = [
    ['Cổng thanh toán', 'VNPay / MoMo', 'thanh toán', 200],
    ['Đơn vị vận chuyển', 'xe lạnh 2–4 giờ', 'giao hàng', 350],
    ['Dịch vụ Email / SMS', 'OTP, xác nhận đơn', 'thông báo', 500],
  ];
  const ex = 1010, ew = 250, eh = 100;
  ext.forEach((e) => {
    const ey = e[3] - eh / 2;
    s += `<rect x="${ex}" y="${ey}" width="${ew}" height="${eh}" fill="#fff" stroke="${INK}" stroke-width="1.8"/>`;
    s += `<text x="${ex + ew / 2}" y="${ey + 24}" text-anchor="middle" ${FONT} font-size="12" font-style="italic" fill="${GREY}">«hệ thống ngoài»</text>`;
    s += `<text x="${ex + ew / 2}" y="${ey + 55}" text-anchor="middle" ${FONT} font-size="17" font-weight="700" fill="${INK}">${esc(e[0])}</text>`;
    s += `<text x="${ex + ew / 2}" y="${ey + 80}" text-anchor="middle" ${FONT} font-size="13.5" fill="${GREY}">${esc(e[1])}</text>`;
    s += `<line x1="${SX + SW}" y1="${e[3]}" x2="${ex}" y2="${e[3]}" stroke="${INK}" stroke-width="1.8" marker-end="url(#ar)" marker-start="url(#al)"/>`;
    s += `<text x="${(SX + SW + ex) / 2}" y="${e[3] - 10}" text-anchor="middle" ${FONT} font-size="13.5" font-style="italic" fill="${GREY}">${esc(e[2])}</text>`;
  });
  s += `<text x="${W / 2}" y="${H - 24}" text-anchor="middle" ${FONT} font-size="13.5" font-style="italic" fill="${GREY}">Trong prototype, các hệ thống ngoài chỉ được mô phỏng bằng màn hình và thông báo; tích hợp thật thuộc giai đoạn sau.</text>`;
  s += '</svg>';
  return { svg: s, W, H };
}

// ═════════════ XUẤT SVG + PNG ═════════════
const figs = { 'fig-usecase': useCaseSvg(), 'fig-context': contextSvg() };
for (const [name, f] of Object.entries(figs)) fs.writeFileSync(path.join(OUT, name + '.svg'), f.svg);

const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9344;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'dg-'));
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, `--user-data-dir=${tmp}`, 'about:blank'], { stdio: 'ignore' });
let url = null;
for (let i = 0; i < 60 && !url; i++) {
  try { const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json(); url = (l.find((x) => x.type === 'page') || {}).webSocketDebuggerUrl; } catch {}
  if (!url) await sleep(250);
}
const ws = new WebSocket(url);
await new Promise((r) => (ws.onopen = r));
let nid = 0; const pend = new Map(); let loadRes = null;
ws.onmessage = (m) => { const d = JSON.parse(m.data); if (d.id && pend.has(d.id)) { pend.get(d.id)(d.result); pend.delete(d.id); } else if (d.method === 'Page.loadEventFired' && loadRes) { loadRes(); loadRes = null; } };
const send = (method, params = {}) => new Promise((res) => { const id = ++nid; pend.set(id, res); ws.send(JSON.stringify({ id, method, params })); });
await send('Page.enable');
for (const [name, f] of Object.entries(figs)) {
  const html = path.join(OUT, name + '.html');
  fs.writeFileSync(html, `<!doctype html><meta charset="utf-8"><body style="margin:0;background:#fff">${f.svg}</body>`);
  await send('Emulation.setDeviceMetricsOverride', { width: f.W, height: f.H, deviceScaleFactor: 2, mobile: false });
  const loaded = new Promise((r) => { loadRes = r; setTimeout(r, 8000); });
  await send('Page.navigate', { url: 'file:///' + html.replace(/\\/g, '/') });
  await loaded; await sleep(400);
  const r = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: f.W, height: f.H, scale: 1 } });
  fs.writeFileSync(path.join(OUT, name + '.png'), Buffer.from(r.data, 'base64'));
  fs.unlinkSync(html);
  console.log('ghi', name + '.png', f.W + 'x' + f.H);
}
chrome.kill();
process.exit(0);
