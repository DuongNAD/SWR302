#!/usr/bin/env node
// Kiểm tra giao diện khi CHẠY THẬT bằng Chrome headless — không cần cài thêm gói nào.
//
//   Yêu cầu: Node ≥ 22, Google Chrome (macOS/Linux/Windows), dev server đang chạy (npm run dev).
//   Dùng:    node ui-spec/audit-runtime.mjs                       # desktop + mobile
//            node ui-spec/audit-runtime.mjs --viewports=desktop,tablet,mobile --links
//            node ui-spec/audit-runtime.mjs --routes=/admin --shots=/tmp/shots
//   Tuỳ chọn: --base=http://localhost:5173  --routes=<chuỗi lọc>  --links (dò link chết)  --shots=<thư mục ảnh>
//   Biến môi trường: CHROME_PATH=<đường dẫn Chrome>
//
// Thoát với mã 1 nếu còn LỖI (cảnh báo không làm thất bại). Khi thêm route mới, thêm vào ROUTES bên dưới.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const args = Object.fromEntries(process.argv.slice(2).map((a) => { const [k, ...v] = a.replace(/^--/, '').split('='); return [k, v.length ? v.join('=') : true]; }));
const BASE = args.base || 'http://localhost:5173';
const VIEWPORTS = { desktop: [1440, 900], tablet: [768, 1024], mobile: [375, 812] };
const wanted = String(args.viewports || 'desktop,mobile').split(',').filter((v) => VIEWPORTS[v]);
const CHROME = process.env.CHROME_PATH || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'].find((p) => fs.existsSync(p));
if (!CHROME) { console.error('Không tìm thấy Chrome. Đặt biến CHROME_PATH.'); process.exit(2); }

const ROUTES = [
  '/', '/san-pham', '/san-pham?danh-muc=cat-dairy', '/tim-kiem?q=b%C6%A1', '/tim-kiem?q=zzzz',
  '/san-pham/prod-01', '/san-pham/prod-14', '/san-pham/prod-16', '/combo', '/combo/bundle-tiramisu', '/gio-hang', '/thanh-toan',
  '/dat-hang/thanh-cong/GHP-889120', '/tra-cuu-don-hang', '/don-hang/GHP-889120', '/mua-si', '/cua-hang', '/ho-tro', '/gioi-thieu', '/lien-he',
  '/dang-nhap', '/dang-ky', '/quen-mat-khau',
  '/tai-khoan', '/tai-khoan/don-hang', '/tai-khoan/dia-chi', '/tai-khoan/yeu-thich', '/tai-khoan/ho-so', '/tai-khoan/doanh-nghiep',
  '/admin', '/admin/don-hang', '/admin/don-hang/ord-889120', '/admin/san-pham', '/admin/san-pham/moi', '/admin/san-pham/prod-01',
  '/admin/danh-muc', '/admin/ton-kho', '/admin/khach-hang', '/admin/khuyen-mai', '/admin/van-chuyen', '/admin/bao-cao', '/admin/nhan-vien', '/admin/cai-dat',
  '/dev/style-guide', '/dev/requirements',
].filter((r) => !args.routes || r.includes(args.routes));

// Chạy TRONG trang: trả về các số đo cho route hiện tại.
async function measure(isDev) {
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
  for (const y of [0.33, 0.66, 1, 0]) { window.scrollTo(0, document.documentElement.scrollHeight * y); await sleep(140); } // kích hoạt ảnh lazy
  await sleep(500);
  const vis = (e) => e.offsetParent !== null || getComputedStyle(e).position === 'fixed';
  const text = document.body.innerText || '';
  const h1s = [...document.querySelectorAll('h1')].filter(vis);
  const broken = [...document.images].filter((i) => i.complete && i.naturalWidth === 0 && (i.currentSrc || i.src)).map((i) => (i.currentSrc || i.src).slice(-60));
  const small = [...document.querySelectorAll('body *')].filter((e) => vis(e) && !e.closest('svg, [aria-hidden=true], #recharts_measurement_span') && getComputedStyle(e).visibility !== 'hidden' && !e.classList.contains('sr-only')
    && [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && parseFloat(getComputedStyle(e).fontSize) < 12).map((e) => e.textContent.trim().slice(0, 18));
  const unnamed = [...document.querySelectorAll('button, a[href], input:not([type=hidden]), select, textarea, [role=button], [role=checkbox], [role=switch], [role=tab]')].filter(vis).filter((e) => {
    const name = (e.getAttribute('aria-label') || e.getAttribute('aria-labelledby') || e.getAttribute('title') || e.innerText || e.value || '').trim();
    if (name || (e.labels && e.labels.length) || e.closest('label') || e.querySelector('img[alt]:not([alt=""])')) return false;
    return !(e.id && document.querySelector(`label[for="${CSS.escape(e.id)}"]`));
  }).map((e) => e.tagName.toLowerCase() + (e.getAttribute('role') ? `[${e.getAttribute('role')}]` : '') + (e.getAttribute('placeholder') ? `[placeholder="${e.getAttribute('placeholder').slice(0, 24)}"]` : '') + (e.id ? `#${e.id}` : ''));
  const taps = [...document.querySelectorAll('button, [role=button], select, input:not([type=checkbox]):not([type=radio]):not([type=hidden])')].filter(vis)
    .filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && (b.height < 36 || b.width < 36); }).length;
  const bc = document.querySelector('nav[aria-label="breadcrumb"]');
  const logo = document.querySelector('header a');
  const sticky = [...document.querySelectorAll('*')].filter((e) => ['sticky', 'fixed'].includes(getComputedStyle(e).position) && e.getBoundingClientRect().top <= 1 && e.getBoundingClientRect().height > 20 && e.getBoundingClientRect().width > innerWidth * 0.6).map((e) => Math.round(e.getBoundingClientRect().height));
  return {
    title: document.title, h1: h1s.length, h1Text: (h1s[0]?.innerText || '').slice(0, 40),
    overflow: document.documentElement.scrollWidth - innerWidth,
    broken, small, unnamed, taps,
    leakedCodes: isDev ? [] : (text.match(/SCR-[A-Z0-9]+/g) || []),
    rawEnums: isDev ? [] : (text.match(/(^|\s)(pending|confirmed|packing|shipping|delivered|cancelled|vnpay|momo|banking|cod)(?=\s|$)/gm) || []).map((s) => s.trim()),
    exclaim: isDev ? 0 : (text.match(/!/g) || []).length,
    capsWords: isDev ? [] : (text.match(/\p{Lu}{2,}(?:[ ·&]+\p{Lu}{2,}){2,}/gu) || []).slice(0, 3),
    english: isDev ? [] : (text.match(/\b(Free|Chilled Express|Telemetry)\b/g) || []),
    bcLeft: bc ? Math.round(bc.getBoundingClientRect().left) : null, logoLeft: logo ? Math.round(logo.getBoundingClientRect().left) : null,
    sticky: Math.max(0, ...sticky),
    links: [...document.querySelectorAll('a[href^="#/"]')].map((a) => a.getAttribute('href').slice(1)),
  };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const port = 9300 + Math.floor(Math.random() * 600);
const prof = fs.mkdtempSync(path.join(os.tmpdir(), 'ui-audit-'));
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=${prof}`, '--window-size=1500,1000', 'about:blank'], { stdio: 'ignore' });
const cleanup = () => { try { chrome.kill('SIGKILL'); } catch {} try { fs.rmSync(prof, { recursive: true, force: true }); } catch {} };
process.on('exit', cleanup); process.on('SIGINT', () => process.exit(130));
let page; for (let i = 0; i < 80 && !page; i++) { try { page = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch {} if (!page) await sleep(250); }
if (!page) { console.error('Chrome không khởi động được.'); process.exit(2); }
const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = new Map(); let cur = '(tải trang)'; const events = [];
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pend.has(d.id)) { pend.get(d.id)(d); pend.delete(d.id); return; }
  const p = d.params || {};
  if (d.method === 'Runtime.consoleAPICalled' && p.type === 'error') events.push({ r: cur, k: 'console.error', m: (p.args || []).map((a) => a.value ?? a.description ?? '').join(' ').replace(/\s+/g, ' ').slice(0, 160) });
  if (d.method === 'Runtime.exceptionThrown') events.push({ r: cur, k: 'exception', m: (p.exceptionDetails?.exception?.description || p.exceptionDetails?.text || '').split('\n')[0].slice(0, 160) });
  if (d.method === 'Network.responseReceived' && p.response.status >= 400) events.push({ r: cur, k: 'http ' + p.response.status, m: p.response.url.slice(0, 120) });
  if (d.method === 'Network.loadingFailed' && !p.canceled) events.push({ r: cur, k: 'net-fail', m: (p.errorText || '') + ' ' + (p.type || '') });
};
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
const ev = async (expr) => (await send('Runtime.evaluate', { expression: expr, awaitPromise: true, returnByValue: true })).result?.result?.value;
for (const d of ['Page', 'Runtime', 'Network', 'Log']) await send(d + '.enable');

const errors = new Map(), warns = new Map(); // key -> {routes:Set, vp:Set, sample}
const add = (map, key, route, vp, sample) => { if (!map.has(key)) map.set(key, { routes: new Set(), vps: new Set(), sample }); const e = map.get(key); e.routes.add(route); e.vps.add(vp); };
const seenLinks = new Map();

try { await fetch(BASE); } catch { console.error(`Không kết nối được ${BASE}. Hãy chạy "npm run dev" trước.`); process.exit(2); }
if (args.shots) fs.mkdirSync(String(args.shots), { recursive: true });
console.log(`== audit-runtime: ${ROUTES.length} route × ${wanted.join(' + ')} (Chrome headless) ==`);

for (const vp of wanted) {
  const [w, h] = VIEWPORTS[vp];
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
  cur = '(tải trang)'; await send('Page.navigate', { url: BASE + '/#/' }); await sleep(2500);
  for (const r of ROUTES) {
    cur = r; await ev(`location.hash='#${r}'`); await sleep(900);
    const isDev = r.startsWith('/dev/');
    const m = await ev(`(${measure.toString()})(${isDev})`);
    if (!m) { add(errors, 'không đo được trang', r, vp); continue; }
    const hasTop = !r.startsWith('/dang-') && r !== '/quen-mat-khau' && r !== '/thanh-toan' && !r.startsWith('/dat-hang');
    if (m.h1 !== 1 && !isDev) add(errors, `số <h1> = ${m.h1} (phải đúng 1)`, r, vp);
    if (m.overflow > 1) add(errors, 'TRÀN NGANG (scrollWidth > viewport)', r, vp, `+${m.overflow}px`);
    for (const b of m.broken) add(errors, 'ảnh hỏng / không tải được', r, vp, b);
    if (m.leakedCodes.length) add(errors, 'mã nội bộ "SCR-…" lộ ra giao diện', r, vp, m.leakedCodes[0]);
    if (m.rawEnums.length) add(errors, 'giá trị thô chưa Việt hóa (packing/pending/vnpay…)', r, vp, [...new Set(m.rawEnums)].join(','));
    if (m.exclaim) add(errors, 'dấu "!" trong chữ hiển thị', r, vp, `${m.exclaim} chỗ`);
    if (m.capsWords.length) add(errors, 'chữ IN HOA gõ cứng', r, vp, m.capsWords[0]);
    if (m.english.length) add(errors, 'từ tiếng Anh lẫn trong giao diện (Free/Chilled Express/Telemetry)', r, vp, [...new Set(m.english)].join(','));
    if (m.small.length) add(warns, 'chữ nhỏ hơn 12px', r, vp, `${m.small.length} phần tử, vd "${m.small[0]}"`);
    if (m.unnamed.length) add(warns, 'điều khiển không có tên truy cập (aria-label/label)', r, vp, `${m.unnamed.length}: ${[...new Set(m.unnamed)].slice(0, 3).join(' · ')}`);
    if (vp === 'mobile' && m.taps > 8) add(warns, 'nhiều vùng bấm < 36px trên mobile', r, vp, `${m.taps} phần tử`);
    if (vp !== 'mobile' && m.bcLeft !== null && m.logoLeft !== null && Math.abs(m.bcLeft - m.logoLeft) > 2 && hasTop) add(warns, 'lề trái nội dung lệch với header (container không thống nhất)', r, vp, `breadcrumb ${m.bcLeft}px ≠ logo ${m.logoLeft}px`);
    if (hasTop && m.sticky > (vp === 'mobile' ? 64 : 72)) add(warns, 'phần dính trên cùng quá cao', r, vp, `${m.sticky}px`);
    if (vp === 'desktop') for (const l of m.links) if (!seenLinks.has(l)) seenLinks.set(l, r);
    if (args.shots) { const dim = await ev('({w: Math.max(document.documentElement.scrollWidth, innerWidth), h: Math.min(document.documentElement.scrollHeight, 6000)})'); const s = await send('Page.captureScreenshot', { format: 'png', captureBeyondViewport: true, clip: { x: 0, y: 0, width: dim.w, height: dim.h, scale: 1 } }); fs.writeFileSync(path.join(String(args.shots), `${vp}-${r.replace(/[^a-z0-9]+/gi, '_')}.png`), Buffer.from(s.result.data, 'base64')); }
  }
}
for (const e of events) add(errors, `${e.k}: ${e.m}`, e.r, 'all');

if (args.links) { // dò link chết: mở từng link nội bộ khác nhau, trang 404 có h1 "Không tìm thấy"
  await send('Emulation.setDeviceMetricsOverride', { width: 1440, height: 900, deviceScaleFactor: 1, mobile: false });
  const known = new Set(ROUTES);
  for (const [l, from] of seenLinks) {
    if (known.has(l) || l === '/') continue;
    cur = l; await ev(`location.hash='#${l}'`); await sleep(600);
    const t = await ev(`(document.querySelector('h1')?.innerText || '')`);
    if (/Không tìm thấy/i.test(t || '')) add(errors, 'LINK CHẾT (dẫn tới trang 404)', from, 'desktop', l);
  }
}

const dump = (title, map, mark) => {
  console.log(`\n${title} — ${map.size} loại`);
  for (const [k, v] of [...map.entries()].sort((a, b) => b[1].routes.size - a[1].routes.size)) {
    const shown = args.all ? v.routes.size : 5; // --all: in đủ danh sách route thay vì 5 route đầu
    console.log(`  ${mark} ${k}\n      ${v.routes.size} route [${[...v.vps].join(',')}]: ${[...v.routes].slice(0, shown).join(', ')}${v.routes.size > shown ? ' …' : ''}${v.sample ? '\n      vd: ' + v.sample : ''}`);
  }
};
dump('LỖI', errors, '✗'); dump('CẢNH BÁO', warns, '•');
console.log(`\nKẾT QUẢ: ${errors.size} loại lỗi, ${warns.size} loại cảnh báo.`);
cleanup(); process.exit(errors.size ? 1 : 0);
