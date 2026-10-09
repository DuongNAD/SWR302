#!/usr/bin/env node
// Tìm LINK TỚI ROUTE KHÔNG TỒN TẠI: so mọi đường dẫn nội bộ trong src với bảng route ở src/router.tsx.
//   Chạy từ thư mục client/:   node ui-spec/check-links.mjs
// In ra mỗi dòng "file:dòng  /đường-dẫn" cho link chết; thoát mã 1 nếu có.
import fs from 'node:fs';
import path from 'node:path';

const SRC = 'src';
const router = fs.readFileSync(path.join(SRC, 'router.tsx'), 'utf8').split('\n');

// 1) dựng danh sách route đầy đủ (route con ghép với route cha có children)
const routes = new Set(); let parent = '';
for (const line of router) {
  const m = line.match(/path="([^"]+)"/); if (!m) continue;
  const p = m[1]; const hasChildren = />\s*$/.test(line) && !/\/>\s*$/.test(line);
  const full = p.startsWith('/') ? p : `${parent}/${p}`.replace(/\/+/g, '/');
  if (p !== '*') routes.add(full);
  if (p.startsWith('/')) parent = hasChildren ? p : '';
}
const patterns = [...routes].map((r) => new RegExp('^' + r.replace(/[.+?^${}()|[\]\\]/g, '\\$&').replace(/:[A-Za-z]+/g, '[^/]+') + '/?$'));
const ok = (p) => p === '/' || patterns.some((re) => re.test(p));

// 2) quét mọi chuỗi đường dẫn nội bộ
const files = []; (function walk(d) { for (const f of fs.readdirSync(d, { withFileTypes: true })) { const fp = path.join(d, f.name); if (f.isDirectory()) walk(fp); else if (/\.tsx?$/.test(f.name)) files.push(fp); } })(SRC);
const re = /(?:\bto=|\bhref=|navigate\(|\bto:\s*)(?:\{\s*)?(['"`])(#?\/[^'"`]*)\1/g;
const bad = [];
for (const f of files) {
  if (f.endsWith('router.tsx')) continue;
  fs.readFileSync(f, 'utf8').split('\n').forEach((line, i) => {
    if (/^\s*(\/\/|\{\/\*|\*)/.test(line)) return;
    for (const m of line.matchAll(re)) {
      let p = m[2].replace(/^#/, '').replace(/\$\{[^}]*\}/g, 'x').split(/[?#]/)[0];
      if (!p.startsWith('/') || /^\/\//.test(p)) continue;
      if (!ok(p)) bad.push(`${f}:${i + 1}  ${m[2]}`);
    }
  });
}
if (bad.length) { console.log(bad.join('\n')); process.exit(1); }
console.log(`✓ ${files.length} file đã quét, ${routes.size} route — không có link chết`);
