// Kiểm tra giao diện client + chụp ảnh bằng Chrome headless (CDP). Dùng: node ui-check.mjs <thư mục ra>
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const OUT = process.argv[2];
const BASE = 'http://localhost:5173';
const CHROME = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const PORT = 9333;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
fs.mkdirSync(OUT, { recursive: true });

// id = mã màn hình trong ui-spec (02_pages.md)
const ROUTES = [
  { id: 'SCR-01', name: 'trang-chu', path: '/' },
  { id: 'SCR-02', name: 'danh-sach-san-pham', path: '/san-pham' },
  { id: 'SCR-03', name: 'tim-kiem', path: '/tim-kiem?q=bot' },
  { id: 'SCR-04', name: 'chi-tiet-san-pham', path: '/san-pham/prod-01' },
  { id: 'SCR-05', name: 'combo', path: '/combo' },
  { id: 'SCR-06', name: 'chi-tiet-combo', path: '/combo/bundle-tiramisu' },
  { id: 'SCR-07', name: 'gio-hang', path: '/gio-hang' },
  { id: 'SCR-08', name: 'thanh-toan', path: '/thanh-toan' },
  { id: 'SCR-09', name: 'dat-hang-thanh-cong', path: '/dat-hang/thanh-cong/GHP-889120' },
  { id: 'SCR-10', name: 'tra-cuu-don', path: '/tra-cuu-don-hang' },
  { id: 'SCR-11', name: 'theo-doi-don', path: '/don-hang/GHP-889120' },
  { id: 'SCR-12', name: 'dang-nhap', path: '/dang-nhap' },
  { id: 'SCR-13', name: 'dang-ky', path: '/dang-ky' },
  { id: 'SCR-14', name: 'quen-mat-khau', path: '/quen-mat-khau' },
  { id: 'SCR-15', name: 'tai-khoan', path: '/tai-khoan' },
  { id: 'SCR-16', name: 'don-hang-cua-toi', path: '/tai-khoan/don-hang' },
  { id: 'SCR-17', name: 'so-dia-chi', path: '/tai-khoan/dia-chi' },
  { id: 'SCR-18', name: 'yeu-thich', path: '/tai-khoan/yeu-thich' },
  { id: 'SCR-19', name: 'ho-so', path: '/tai-khoan/ho-so' },
  { id: 'SCR-20', name: 'doanh-nghiep', path: '/', steps: ['role:Khách sỉ', 'link:#/tai-khoan/yeu-thich', 'link:#/tai-khoan/doanh-nghiep'] },
  { id: 'SCR-21', name: 'mua-si', path: '/mua-si' },
  { id: 'SCR-22', name: 'cua-hang', path: '/cua-hang' },
  { id: 'SCR-23', name: 'ho-tro', path: '/ho-tro' },
  { id: 'SCR-24', name: 'gioi-thieu', path: '/gioi-thieu' },
  { id: 'SCR-24b', name: 'lien-he', path: '/lien-he' },
  { id: 'SCR-A01', name: 'admin-tong-quan', path: '/admin' },
  { id: 'SCR-A02', name: 'admin-don-hang', path: '/admin/don-hang' },
  { id: 'SCR-A03', name: 'admin-chi-tiet-don', path: '/admin/don-hang/GHP-889120' },
  { id: 'SCR-A04', name: 'admin-san-pham', path: '/admin/san-pham' },
  { id: 'SCR-A05', name: 'admin-form-san-pham', path: '/admin/san-pham/moi' },
  { id: 'SCR-A06', name: 'admin-danh-muc', path: '/admin/danh-muc' },
  { id: 'SCR-A07', name: 'admin-ton-kho', path: '/admin/ton-kho' },
  { id: 'SCR-A08', name: 'admin-khach-hang', path: '/admin/khach-hang' },
  { id: 'SCR-A09', name: 'admin-khuyen-mai', path: '/admin/khuyen-mai' },
  { id: 'SCR-A10', name: 'admin-van-chuyen', path: '/admin/van-chuyen' },
  { id: 'SCR-A11', name: 'admin-bao-cao', path: '/admin/bao-cao' },
  { id: 'SCR-A12', name: 'admin-nhan-vien', path: '/admin/nhan-vien' },
  { id: 'SCR-A13', name: 'admin-cai-dat', path: '/admin/cai-dat' },
];
const ONLY = process.env.ONLY;
const ADMINW = Number(process.env.ADMINW || 1440);
const RUN = ONLY ? ROUTES.filter((r) => r.id.includes(ONLY)) : ROUTES;
const MOBILE_SHOTS = ['/', '/san-pham/prod-01'];
const MOBILE_CHECK = ['/', '/san-pham', '/san-pham/prod-01', '/gio-hang', '/thanh-toan', '/tai-khoan'];

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'uicheck-'));
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars', `--remote-debugging-port=${PORT}`, `--user-data-dir=${tmp}`, '--window-size=1440,900', 'about:blank'], { stdio: 'ignore' });
const cleanup = () => { try { chrome.kill(); } catch {} };
process.on('exit', cleanup);

async function wsUrl() {
  for (let i = 0; i < 60; i++) {
    try {
      const l = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      const p = l.find((x) => x.type === 'page');
      if (p) return p.webSocketDebuggerUrl;
    } catch {}
    await sleep(250);
  }
  throw new Error('Chrome không khởi động');
}
const ws = new WebSocket(await wsUrl());
await new Promise((r) => (ws.onopen = r));
let nid = 0;
const pending = new Map();
let issues = [];
let loadWaiters = [];
ws.onmessage = (m) => {
  const d = JSON.parse(m.data);
  if (d.id && pending.has(d.id)) {
    const { res, rej } = pending.get(d.id); pending.delete(d.id);
    d.error ? rej(new Error(d.error.message)) : res(d.result);
    return;
  }
  if (d.method === 'Page.loadEventFired') { loadWaiters.forEach((f) => f()); loadWaiters = []; }
  if (d.method === 'Runtime.consoleAPICalled' && d.params.type === 'error') {
    issues.push('console.error: ' + d.params.args.map((a) => a.value ?? a.description ?? '').join(' ').slice(0, 240));
  }
  if (d.method === 'Runtime.exceptionThrown') {
    const e = d.params.exceptionDetails;
    issues.push('exception: ' + ((e.exception && e.exception.description) || e.text || '').split('\n')[0].slice(0, 240));
  }
  if (d.method === 'Log.entryAdded' && d.params.entry.level === 'error') {
    issues.push('log: ' + d.params.entry.text.slice(0, 160) + ' ' + (d.params.entry.url || '').slice(0, 120));
  }
};
const send = (method, params = {}) => new Promise((res, rej) => { const id = ++nid; pending.set(id, { res, rej }); ws.send(JSON.stringify({ id, method, params })); });
const ev = async (expr) => {
  const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
  if (r.exceptionDetails) throw new Error('eval: ' + (r.exceptionDetails.exception?.description || r.exceptionDetails.text));
  return r.result.value;
};
for (const d of ['Page', 'Runtime', 'Log', 'Network']) await send(d + '.enable');

const viewport = (w, h, mobile = false) => send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile });
// App dùng HashRouter → URL thật là BASE/#/đường-dẫn. Qua about:blank để mỗi lần là một lần nạp mới (reset vai trò, giỏ hàng).
async function go(p) {
  const nav = async (url) => {
    const loaded = new Promise((r) => { loadWaiters.push(r); setTimeout(r, 15000); });
    await send('Page.navigate', { url });
    await loaded;
  };
  await nav('about:blank');
  await nav(BASE + '/#' + p);
}
async function settle(max = 10000) {
  const t0 = Date.now(); let last = -1, same = 0;
  while (Date.now() - t0 < max) {
    const n = await ev('document.body ? document.body.innerText.length : 0');
    same = n === last ? same + 1 : 0; last = n;
    if (same >= 3 && Date.now() - t0 > 1200) break;
    await sleep(350);
  }
  await ev('document.fonts.ready.then(()=>true)');
  await sleep(300);
}
const click = (sel, text) => ev(`(()=>{const els=[...document.querySelectorAll(${JSON.stringify(sel)})];const el=${text ? `els.find(e=>e.innerText.trim()===${JSON.stringify(text)})` : 'els[0]'};if(!el)return false;el.click();return true})()`);
async function runSteps(steps) {
  for (const s of steps) {
    if (s.startsWith('role:')) {
      const a = await click('button[aria-label="Đổi vai trò và công cụ demo"]');
      await sleep(300);
      const b = await click('button', s.slice(5));
      if (!a || !b) return `bước "${s}" thất bại (mở=${a}, chọn=${b})`;
    } else if (s.startsWith('link:')) {
      const ok = await click(`a[href="${s.slice(5)}"]`);
      if (!ok) return `không thấy liên kết ${s.slice(5)}`;
    }
    await sleep(900);
    await settle(6000);
  }
  return null;
}
const inspect = () => ev(`(()=>{
  const imgs=[...document.images];
  const h=document.querySelector('h1')||document.querySelector('h2');
  const t=document.body.innerText;
  return {
    path: location.hash,
    title: document.title,
    heading: h ? h.innerText.replace(/\\s+/g,' ').slice(0,70) : null,
    chars: t.length,
    overflowX: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
    brokenImgs: imgs.filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.getAttribute('src')).slice(0,6),
    notFound: /không tìm thấy trang|404/i.test(t.slice(0,500)),
    errorBoundary: /something went wrong|đã xảy ra lỗi|có lỗi xảy ra/i.test(t),
    spinner: !!document.querySelector('[class*="animate-spin"]'),
    tables: [...document.querySelectorAll('table')].map((t) => ({ w: t.offsetWidth, cols: [...t.querySelectorAll('thead th')].map((th) => th.innerText.trim().slice(0, 14) + ':' + th.offsetWidth) })),
    scrollers: [...document.querySelectorAll('body *')].filter((el) => { const o = getComputedStyle(el).overflowX; return (o === 'auto' || o === 'scroll') && el.scrollWidth > el.clientWidth + 1 && el.getBoundingClientRect().height > 0; }).slice(0, 4).map((el) => ({ tag: el.tagName, sw: el.scrollWidth, cw: el.clientWidth })),
    clipped: [...document.querySelectorAll('body *')].filter((el) => {
      const cs = getComputedStyle(el);
      if (cs.textOverflow === 'ellipsis' || cs.webkitLineClamp !== 'none' && cs.webkitLineClamp) return false;
      if (!(cs.overflowX === 'hidden' || cs.overflow === 'hidden')) return false;
      if (el.scrollWidth <= el.clientWidth + 1) return false;
      const r = el.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return false;
      return (el.innerText || '').trim().length > 0;
    }).slice(0, 8).map((el) => ({ tag: el.tagName, text: (el.innerText || '').trim().replace(/\\s+/g, ' ').slice(0, 60), sw: el.scrollWidth, cw: el.clientWidth }))
  };
})()`);
const shot = async (file) => {
  const r = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(path.join(OUT, file), Buffer.from(r.data, 'base64'));
};

const results = [];
// Lượt khởi động: để Vite tối ưu dependency và nạp các chunk lazy, tránh reload giữa chừng.
console.log('Khởi động (warm-up)…');
await viewport(1440, 900);
for (const r of RUN.filter((x) => !x.steps)) { await go(r.path); await sleep(1200); }
await go('/'); await sleep(2500);

console.log('Kiểm tra desktop 1440×900…');
for (const r of RUN) {
  await viewport(r.id.startsWith('SCR-A') ? ADMINW : 1440, r.id.startsWith('SCR-A') ? Math.round(ADMINW * 0.6) : 900);
  issues = [];
  await go(r.path);
  await settle();
  let stepErr = null;
  if (r.steps) stepErr = await runSteps(r.steps);
  const info = await inspect();
  const file = `${r.id.replace('SCR-', '')}-${r.name}.png`;
  await shot(file);
  results.push({ id: r.id, route: r.path, file, stepErr, ...info, issues: [...new Set(issues)] });
  const flag = (info.overflowX ? ' OVERFLOW' : '') + (info.brokenImgs.length ? ' IMG-VỠ' + info.brokenImgs.length : '') + (info.notFound ? ' 404' : '') + (info.errorBoundary ? ' ERRBOUNDARY' : '') + (issues.length ? ' LỖI' + issues.length : '') + (stepErr ? ' STEP' : '');
  console.log(`${r.id.padEnd(8)} ${r.path.padEnd(34)} -> ${info.path.padEnd(34)} h="${(info.heading || '').slice(0, 40)}" chars=${info.chars}${flag}`);
  for (const t of info.tables) console.log(`           BẢNG ${t.w}px | ${t.cols.join(' ')}`);
  for (const c of info.scrollers) console.log(`           CUỘN-NGANG <${c.tag}> scroll ${c.sw} > client ${c.cw}`);
  for (const c of info.clipped) console.log(`           CẮT <${c.tag}> "${c.text}" (scroll ${c.sw} > client ${c.cw})`);
}

if (ONLY) { fs.writeFileSync(path.join(OUT, `results-${ONLY}.json`), JSON.stringify({ results }, null, 2)); cleanup(); process.exit(0); }
console.log('Kiểm tra mobile…');
const mobile = [];
for (const p of MOBILE_CHECK) {
  await viewport(360, 800, true);
  issues = [];
  await go(p); await settle();
  const i = await inspect();
  mobile.push({ w: 360, route: p, overflowX: i.overflowX, scrollW: i.scrollW, brokenImgs: i.brokenImgs, issues: [...new Set(issues)] });
  console.log(`360px ${p.padEnd(22)} overflowX=${i.overflowX} scrollW=${i.scrollW}`);
}
await viewport(390, 844, true);
for (const p of MOBILE_SHOTS) {
  await go(p); await settle();
  const file = `m-${p === '/' ? 'trang-chu' : 'chi-tiet-san-pham'}.png`;
  await shot(file);
  console.log('mobile shot', file);
}

fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify({ results, mobile }, null, 2));
cleanup();
process.exit(0);
