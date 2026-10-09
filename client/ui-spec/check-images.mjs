#!/usr/bin/env node
// Kiểm tra ẢNH của giao diện (xem 07_image_guide.md). Chạy từ thư mục client/:   node ui-spec/check-images.mjs
// Kiểm: mọi ảnh là file CỤC BỘ "./img/..." (không URL ngoài, không "/img/...") · file tồn tại trong public/ · định dạng, kích thước,
// dung lượng đạt ngưỡng · KHÔNG hai thực thể dùng chung một file, KHÔNG hai file giống hệt nội dung · không file mồ côi · đủ ảnh.
// Thoát mã 1 nếu còn lỗi.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const SRC = 'src', PUB = 'public', IMG = path.join(PUB, 'img');
// ngưỡng theo thư mục: short = cạnh ngắn tối thiểu, wide = chiều rộng tối thiểu, kb = dung lượng tối đa
const RULE = { products: { short: 800, kb: 150 }, categories: { short: 600, kb: 100 }, combos: { short: 600, kb: 150 }, banners: { wide: 1200, kb: 250 } };
const DATA = [ // [file dữ liệu, tiền tố mã, thư mục ảnh đúng, tên hiển thị]
  [path.join(SRC, 'data', 'products.ts'), /^prod-/, 'products', 'sản phẩm'],
  [path.join(SRC, 'data', 'categories.ts'), /^cat-/, 'categories', 'danh mục'],
  [path.join(SRC, 'data', 'recipeBundles.ts'), /^bundle-/, 'combos', 'combo'],
];
const errors = [], notes = [];
const err = (m) => errors.push(m);

// ── đọc kích thước ảnh từ phần đầu file (không cần thư viện) ──
function dims(buf, ext) {
  try {
    if (ext === '.png') return buf.toString('latin1', 1, 4) === 'PNG' ? { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) } : null;
    if (ext === '.jpg' || ext === '.jpeg') {
      let i = 2;
      while (i < buf.length - 9) {
        if (buf[i] !== 0xff) { i++; continue; }
        const m = buf[i + 1];
        if (m >= 0xc0 && m <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(m)) return { h: buf.readUInt16BE(i + 5), w: buf.readUInt16BE(i + 7) };
        i += 2 + buf.readUInt16BE(i + 2);
      }
      return null;
    }
    if (ext === '.webp') {
      if (buf.toString('latin1', 0, 4) !== 'RIFF' || buf.toString('latin1', 8, 12) !== 'WEBP') return null;
      const k = buf.toString('latin1', 12, 16);
      if (k === 'VP8X') return { w: 1 + buf.readUIntLE(24, 3), h: 1 + buf.readUIntLE(27, 3) };
      if (k === 'VP8 ') return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
      if (k === 'VP8L') return { w: 1 + (((buf[22] & 0x3f) << 8) | buf[21]), h: 1 + (((buf[24] & 0xf) << 10) | (buf[23] << 2) | ((buf[22] & 0xc0) >> 6)) };
    }
  } catch { /* file hỏng */ }
  return null;
}

// ── thu thập mọi tham chiếu ảnh trong src ──
const walk = (d, out = []) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? walk(p, out) : /\.(tsx?|css)$/.test(e.name) && out.push(p); } return out; };
const files = fs.existsSync(SRC) ? walk(SRC) : [];
const IMG_EXT = /\.(jpe?g|png|webp|avif|gif|svg)(\?|#|$)/i;
const IMG_HOST = /(unsplash\.com|pexels\.com|pixabay\.com|wikimedia\.org|qrserver\.com|googleusercontent\.com)/i;
const refs = []; // { where, url }
for (const f of files) {
  fs.readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    if (/^\s*(\/\/|\{\/\*|\/\*|\*)/.test(line)) return;
    for (const m of line.matchAll(/(['"`])((?:https?:)?\/\/[^'"`\s]+|\.?\/img\/[^'"`\s]+)\1/g)) {
      const u = m[2];
      if (/^(https?:)?\/\//.test(u) && !(IMG_EXT.test(u) || IMG_HOST.test(u))) continue; // link thường, không phải ảnh
      refs.push({ where: `${f.replace(/\\/g, '/')}:${i + 1}`, url: u });
    }
  });
}

// ── thực thể có ảnh (sản phẩm, danh mục, combo) ──
const entities = []; // { kind, id, url, where, folder }
for (const [file, idRe, folder, kind] of DATA) {
  if (!fs.existsSync(file)) { err(`Thiếu file dữ liệu ${file}`); continue; }
  let id = null;
  fs.readFileSync(file, 'utf8').split('\n').forEach((line, i) => {
    const m = line.match(/^\s*id:\s*['"]([^'"]+)['"]/); if (m && idRe.test(m[1])) id = m[1];
    const u = line.match(/imageUrl:\s*(['"`])([^'"`]+)\1/);
    if (u && id) entities.push({ kind, id, url: u[2], where: `${file.replace(/\\/g, '/')}:${i + 1}`, folder });
  });
}

// ── kiểm từng tham chiếu ──
const local = new Set();
for (const r of refs) {
  if (/^(https?:)?\/\//.test(r.url)) { err(`URL ngoài  ${r.where}  ${r.url.slice(0, 70)}…  → tải về public/img/ và dùng "./img/…"`); continue; }
  if (r.url.startsWith('/img/')) { err(`Đường dẫn tuyệt đối  ${r.where}  ${r.url}  → dùng "./img/…" (base './' + HashRouter)`); continue; }
  const rel = r.url.replace(/^\.\//, '').split(/[?#]/)[0];
  if (!fs.existsSync(path.join(PUB, rel))) { err(`Không có file  ${r.where}  ${r.url}  → thiếu public/${rel}`); continue; }
  local.add(rel);
}

// ── kiểm từng file cục bộ ──
const sizeOf = new Map(); // rel → { w, h, kb }
for (const rel of local) {
  const abs = path.join(PUB, rel), ext = path.extname(rel).toLowerCase(), folder = rel.split('/')[1]; // img/<folder>/…
  const st = fs.statSync(abs), kb = st.size / 1024;
  if (ext === '.svg') { if (!/placeholder/.test(rel)) err(`Định dạng  public/${rel}  → ảnh sản phẩm dùng WebP/JPEG, SVG chỉ cho placeholder`); continue; }
  if (!['.webp', '.jpg', '.jpeg', '.png'].includes(ext)) { err(`Định dạng  public/${rel}  → chỉ WebP, JPEG hoặc PNG`); continue; }
  const d = dims(fs.readFileSync(abs).subarray(0, 65536), ext);
  if (!d) { err(`Không đọc được kích thước  public/${rel}  → file hỏng hoặc sai định dạng`); continue; }
  sizeOf.set(rel, { ...d, kb });
  const rule = RULE[folder];
  if (!rule) { err(`Thư mục lạ  public/${rel}  → đặt trong img/products, img/categories, img/combos hoặc img/banners`); continue; }
  if (rule.short && Math.min(d.w, d.h) < rule.short) err(`Quá nhỏ  public/${rel}  ${d.w}×${d.h}  → cạnh ngắn ≥ ${rule.short}px`);
  if (rule.wide && d.w < rule.wide) err(`Quá nhỏ  public/${rel}  ${d.w}×${d.h}  → rộng ≥ ${rule.wide}px`);
  if (kb > rule.kb) err(`Quá nặng  public/${rel}  ${Math.round(kb)} KB  → ≤ ${rule.kb} KB (nén lại)`);
}

// ── thực thể: đúng thư mục, không trùng ──
const byUrl = new Map();
for (const e of entities) {
  if (!/^\.\/img\//.test(e.url)) continue; // lỗi URL ngoài đã báo ở trên
  const rel = e.url.replace(/^\.\//, '');
  if (!rel.startsWith(`img/${e.folder}/`)) err(`Sai thư mục  ${e.where}  ${e.id} → ${e.url}  (${e.kind} phải ở img/${e.folder}/)`);
  if (!byUrl.has(rel)) byUrl.set(rel, []); byUrl.get(rel).push(e.id);
}
for (const [rel, ids] of byUrl) if (ids.length > 1) err(`Trùng ảnh  public/${rel}  dùng cho ${ids.join(', ')}  → mỗi thực thể một ảnh riêng`);

// ── file giống hệt nội dung, file mồ côi ──
const all = fs.existsSync(IMG) ? (function w(d, o = []) { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const p = path.join(d, e.name); e.isDirectory() ? w(p, o) : o.push(p); } return o; })(IMG) : [];
const hashes = new Map();
for (const abs of all) {
  const rel = path.relative(PUB, abs).replace(/\\/g, '/');
  if (path.basename(abs).startsWith('.')) continue;
  const h = crypto.createHash('sha1').update(fs.readFileSync(abs)).digest('hex');
  if (!hashes.has(h)) hashes.set(h, []); hashes.get(h).push(rel);
  if (!local.has(rel)) err(`File mồ côi  public/${rel}  → không có chỗ nào dùng; xóa hoặc gắn vào đúng thực thể`);
}
for (const list of hashes.values()) if (list.length > 1) err(`Hai file giống hệt nhau  ${list.map((x) => 'public/' + x).join(' = ')}`);

// ── đủ ảnh ──
const need = { 'sản phẩm': 0, 'danh mục': 0, combo: 0 };
for (const e of entities) { need[e.kind]++; }
const have = { 'sản phẩm': 0, 'danh mục': 0, combo: 0 };
for (const e of entities) if (/^\.\/img\//.test(e.url) && local.has(e.url.replace(/^\.\//, ''))) have[e.kind]++;
for (const k of Object.keys(need)) if (have[k] < need[k]) err(`Thiếu ảnh ${k}: ${have[k]}/${need[k]} có file cục bộ hợp lệ`);
if (![...local].some((r) => r.startsWith('img/banners/'))) err('Thiếu banner trang chủ  → public/img/banners/hero.webp và dùng ở HomePage.tsx');
if (![...local].some((r) => /placeholder\.svg$/.test(r))) err('Thiếu ảnh dự phòng  → public/img/placeholder.svg và dùng ở product-image.tsx');

// ── kết quả ──
notes.push(`${files.length} file mã nguồn quét · ${refs.length} tham chiếu ảnh · ${local.size} file cục bộ hợp lệ · ${entities.length} thực thể (${have['sản phẩm']}/${need['sản phẩm']} sản phẩm, ${have['danh mục']}/${need['danh mục']} danh mục, ${have.combo}/${need.combo} combo)`);
if (errors.length) {
  const shown = errors.slice(0, 40);
  console.log(shown.map((e) => '✗ ' + e).join('\n') + (errors.length > shown.length ? `\n… và ${errors.length - shown.length} lỗi khác` : ''));
  console.log(`\n${notes[0]}\nKẾT QUẢ: ${errors.length} lỗi ảnh.`);
  process.exit(1);
}
console.log(`✓ ${notes[0]}\nKẾT QUẢ: ảnh sạch (0 lỗi).`);
