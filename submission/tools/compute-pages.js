// Tính số trang của từng tiêu đề từ PDF để điền mục lục. Dùng: node compute-pages.js <pdf> <headings.json> <pages.json>
const fs = require('fs');
const { execFileSync } = require('child_process');

const [pdf, headingsFile, outFile] = process.argv.slice(2);
const info = execFileSync('pdfinfo', [pdf]).toString();
const total = Number(/Pages:\s+(\d+)/.exec(info)[1]);
const norm = (t) => t.replace(/[  ]/g, ' ').replace(/\s+/g, ' ').trim();

const pages = [];
for (let p = 1; p <= total; p++) {
  pages.push(norm(execFileSync('pdftotext', ['-layout', '-f', String(p), '-l', String(p), pdf, '-']).toString()));
}
// trang cuối của phần đầu (bìa + mục lục + lịch sử sửa đổi), 1-based
const front = pages.findIndex((t) => t.includes('Reason For Changes')) + 1;
const headings = JSON.parse(fs.readFileSync(headingsFile, 'utf8'));

const map = {};
const miss = [];
let cur = front + 1;
for (const h of headings) {
  const needle = norm(h.num + h.title.split(' — ')[0]);
  let found = -1;
  for (let p = cur; p <= total; p++) {
    if (pages[p - 1].includes(needle)) { found = p; break; }
  }
  if (found < 0) { miss.push(needle); continue; }
  map[h.num + '|' + h.title] = found - front;
  cur = found;
}
fs.writeFileSync(outFile, JSON.stringify(map, null, 1));
console.log('tổng', total, 'trang; phần đầu', front, 'trang; tìm thấy', Object.keys(map).length + '/' + headings.length, miss.length ? 'THIẾU: ' + miss.join(' | ') : '');
