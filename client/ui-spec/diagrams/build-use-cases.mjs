#!/usr/bin/env node
// Dựng SƠ ĐỒ USE CASE (UML) cho Topic 1 — Gia Hòa Phát Bakery Supply, từ dữ liệu ở `use-case-data.mjs`.
// Bố cục theo tài liệu mẫu của nhóm: khung hệ thống có thẻ tên ở góc trên phải, cột use case hình elip,
// actor hình người que ở hai bên, mũi tên tam giác rỗng cho quan hệ kế thừa. Một sơ đồ TỔNG QUAN (mỗi elip là một
// nhóm chức năng) và các sơ đồ PHÂN RÃ (mỗi nhóm một hình, đủ mọi thao tác người dùng làm được).
//
//   node ui-spec/diagrams/build-use-cases.mjs              → ghi uc-*.svg và uc-*.png (nét x2) cạnh file này
//   node ui-spec/diagrams/build-use-cases.mjs --write-doc  → cập nhật các bảng và hình trong ../05_use_case_diagram.md
//   node ui-spec/diagrams/build-use-cases.mjs --no-png     → chỉ ghi SVG (không cần Chrome)
//
// Script tự bố trí từng nhóm, rồi tự kiểm tra: báo ⚠ nếu một đường nối xuyên qua elip khác, in số đường cắt nhau.
// Cần Chrome để xuất PNG (đặt CHROME_PATH nếu Chrome ở chỗ khác; đặt UC_TMPDIR để đổi thư mục tạm).
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { SYSTEM_NAME, ACTORS, ACTOR_PARENT, SYSTEMS, GROUPS } from './use-case-data.mjs';

const dir = path.dirname(fileURLToPath(import.meta.url));
const pad2 = (n) => String(n).padStart(2, '0');
const figOf = (gi) => `Hình 2.${gi + 1}`;
const codeOf = (gi, u) => `UC-${gi + 1}.${u.id}`;
const fileOf = (gi) => `uc-${pad2(gi + 1)}-${GROUPS[gi].slug}`;
const actorName = (k) => ACTORS[k].name.join(' ');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const sgn = (v) => (v < 0 ? -1 : 1);
const mean = (a) => a.reduce((s, v) => s + v, 0) / a.length;

// ═══════════════════════════ NGẮT DÒNG ═══════════════════════════
// Cụm từ không được ngắt dòng ở giữa; dòng đầu không nên kết thúc bằng từ nối.
const KEEP = ['sản phẩm', 'đơn hàng', 'giỏ hàng', 'hóa đơn', 'mật khẩu', 'tài khoản', 'hệ thống', 'cửa hàng', 'khách hàng', 'tồn kho', 'chuỗi lạnh', 'giá sỉ', 'giảm giá', 'vận chuyển', 'phương thức',
  'nhân viên', 'danh mục', 'tổng quan', 'kinh doanh', 'trang chủ', 'bậc thang', 'hạn dùng', 'lô hàng', 'hành trình', 'theo dõi', 'giám sát', 'khuyến mãi', 'hồ sơ', 'địa chỉ', 'lịch sử', 'mua lại', 'phân quyền',
  'công thức', 'yêu thích', 'đánh giá', 'đăng ký', 'đăng nhập', 'thông tin', 'số lượng', 'doanh nghiệp', 'nhận hàng', 'thanh toán', 'xuất kho', 'nhập kho', 'báo cáo', 'chi tiết'];
const STOP = new Set(['và', 'của', 'theo', 'cho', 'trong', 'tại', 'hoặc', 'ở']);
function wrap(text, max = 24) { // tối đa 2 dòng, ngắt cân bằng
  if (text.length <= max) return [text];
  let t = text; for (const p of KEEP) t = t.replace(new RegExp(p, 'gi'), (m) => m.replace(' ', '\u00A0'));
  const w = t.split(' '); let best = null;
  for (let i = 1; i < w.length; i++) {
    const a = w.slice(0, i).join(' '), b = w.slice(i).join(' ');
    const last = a.split(/[\s\u00A0]/).pop().replace(/[,.;]$/, '');
    const s = Math.max(a.length, b.length) + (STOP.has(last) ? 6 : 0);
    if (!best || s <= best.s) best = { a, b, s };
  }
  return [best.a, best.b].map((l) => l.replace(/\u00A0/g, ' '));
}

// ═══════════════════════════ MÔ HÌNH ═══════════════════════════
const ancestors = (a) => { const o = []; for (let p = ACTOR_PARENT[a]; p; p = ACTOR_PARENT[p]) o.push(p); return o; };
const CANON = ['NV', 'AD', 'KV', 'KL', 'KS']; // thứ tự xếp tác nhân: cha trên con
const descendants = (a) => Object.keys(ACTOR_PARENT).filter((c) => ancestors(c).includes(a));
// mọi tác nhân dùng được nhóm: làm trực tiếp, hoặc kế thừa từ tác nhân làm trực tiếp
const actorsAll = (g) => { const set = new Set(g.actors); for (const a of g.actors) for (const d of descendants(a)) set.add(d); return CANON.filter((a) => set.has(a)); };

function analyse(g, gi) {
  const byId = new Map(g.ucs.map((u) => [u.id, u]));
  const order = new Map(g.ucs.map((u, i) => [u.id, i]));
  if (byId.size !== g.ucs.length) throw new Error(`Nhóm ${gi + 1}: trùng id use case`);
  const edges = [];
  for (const u of g.ucs) for (const [type, to] of u.rel || []) {
    const t = String(to);
    if (!byId.has(t)) throw new Error(`Nhóm ${gi + 1} (${g.title}): UC ${u.id} nối tới UC ${t} không tồn tại`);
    if (type !== 'include' && type !== 'extend') throw new Error(`Nhóm ${gi + 1}: quan hệ lạ "${type}"`);
    edges.push({ type, from: u.id, to: t });
  }
  for (const u of g.ucs) for (const a of u.by) if (!ACTORS[a]) throw new Error(`Nhóm ${gi + 1}: tác nhân lạ ${a}`);
  for (const u of g.ucs) for (const s of u.sys || []) if (!SYSTEMS[s] || !g.systems.includes(s)) throw new Error(`Nhóm ${gi + 1}: UC ${u.id} dùng hệ thống ${s} chưa khai báo ở nhóm`);
  const nbr = new Map(g.ucs.map((u) => [u.id, new Set()]));
  for (const e of edges) { nbr.get(e.from).add(e.to); nbr.get(e.to).add(e.from); }
  const depth = new Map(); g.ucs.forEach((u) => u.by.length && depth.set(u.id, 0));
  for (let ch = true; ch;) {
    ch = false;
    for (const u of g.ucs) if (!depth.has(u.id)) {
      const ds = [...nbr.get(u.id)].filter((n) => depth.has(n)).map((n) => depth.get(n));
      if (ds.length) { depth.set(u.id, Math.min(...ds) + 1); ch = true; }
    }
  }
  for (const u of g.ucs) if (!depth.has(u.id)) throw new Error(`Nhóm ${gi + 1} (${g.title}): UC ${u.id} không nối với use case nào có tác nhân`);
  const baseIds = (id) => [...nbr.get(id)].filter((n) => depth.get(n) === depth.get(id) - 1).sort((a, b) => order.get(a) - order.get(b));
  const kids = new Map(g.ucs.map((u) => [u.id, []]));
  for (const u of g.ucs) if (depth.get(u.id) > 0) kids.get(baseIds(u.id)[0]).push(u.id);
  // tác nhân của use case: trực tiếp, hoặc thừa hưởng từ use case gốc mà nó nối tới
  const actorsOf = (id, seen = new Set()) => {
    const u = byId.get(id); if (u.by.length) return u.by;
    if (seen.has(id)) return []; seen.add(id);
    return [...new Set(baseIds(id).flatMap((b) => actorsOf(b, seen)))];
  };
  return { byId, order, edges, depth, kids, baseIds, actorsOf };
}
const MODEL = GROUPS.map((g, gi) => ({ g, gi, ...analyse(g, gi) }));

// ═══════════════════════════ NÚT ═══════════════════════════
const RX = 118, RY = 34, ROW = 88, COL_X = [430, 760, 1090], SYS_W = 176, SYS_H = 62;
const personNode = (k, x, y, notes = []) => ({ id: 'p:' + k, type: 'person', x, y, lines: ACTORS[k].name, role: ACTORS[k].role, notes });
const sysNode = (k, x, y) => ({ id: 'sys:' + k, type: 'system', x, y, lines: SYSTEMS[k].lines });
const ucNode = (gi, u, x, y) => ({ id: 'uc:' + u.id, type: 'uc', x, y, rx: RX, ry: RY, lines: [{ t: codeOf(gi, u), k: 'id' }, ...wrap(u.name).map((t) => ({ t, k: 'name' }))] });

// ═══════════════════════════ BỐ TRÍ MỘT NHÓM ═══════════════════════════
// Mỗi use case có tác nhân (cột 0) cùng các use case phụ của nó tạo thành một "khối". Khối xếp chồng theo thứ tự dữ liệu.
// Use case phụ nằm cột 1; nếu nó có ≤ 2 use case phụ con thì các con nằm cùng cột (trên/dưới), nhiều hơn thì sang cột 2.
function blockOf(m, id, col) {
  const ks = m.kids.get(id), node = m.byId.get(id);
  const items = [{ id, col, dy: 0 }];
  if (!ks.length) return { items, top: -44, bottom: 44 };
  const sameCol = col > 0 && ks.length <= 2;
  const kcol = sameCol ? col : col + 1;
  const blocks = ks.map((k) => blockOf(m, k, kcol));
  const put = (b, dy) => b.items.forEach((it) => items.push({ ...it, dy: it.dy + dy }));
  let top = -44, bottom = 44;
  if (sameCol) {
    if (blocks.length === 1) { const dy = 44 + 8 - blocks[0].top; put(blocks[0], dy); bottom = Math.max(bottom, dy + blocks[0].bottom); }
    else {
      const d1 = -(44 + 8 + blocks[0].bottom), d2 = 44 + 8 - blocks[1].top;
      put(blocks[0], d1); put(blocks[1], d2);
      top = Math.min(top, d1 + blocks[0].top); bottom = Math.max(bottom, d2 + blocks[1].bottom);
    }
    return { items, top, bottom };
  }
  const gap = (node.sys || []).length > 0 && col === 0 ? 100 : 0; // chừa lối đi cho đường nối tới hệ thống ngoài
  const up = gap ? Math.ceil(blocks.length / 2) : 0;
  if (gap) {
    let end = -gap / 2;
    for (let i = up - 1; i >= 0; i--) { const dy = end - blocks[i].bottom; put(blocks[i], dy); end = dy + blocks[i].top - 8; top = Math.min(top, dy + blocks[i].top); }
    let cur = gap / 2;
    for (let i = up; i < blocks.length; i++) { const dy = cur - blocks[i].top; put(blocks[i], dy); cur = dy + blocks[i].bottom + 8; bottom = Math.max(bottom, dy + blocks[i].bottom); }
  } else {
    const H = blocks.reduce((t, b) => t + b.bottom - b.top + 8, -8);
    let cur = -H / 2;
    for (const b of blocks) { const dy = cur - b.top; put(b, dy); cur = dy + b.bottom + 8; top = Math.min(top, dy + b.top); bottom = Math.max(bottom, dy + b.bottom); }
  }
  return { items, top, bottom };
}

function layoutGroup(m) {
  const { g, gi, depth, kids, baseIds, edges } = m;
  const bases = g.ucs.filter((u) => depth.get(u.id) === 0);
  const pos = new Map();
  let cursor = 0;
  for (const b of bases) {
    const blk = blockOf(m, b.id, 0), y = cursor - blk.top;
    blk.items.forEach((it) => pos.set(it.id, { x: COL_X[it.col], y: y + it.dy }));
    cursor = y + blk.bottom + 12;
  }
  // use case phụ nối tới nhiều use case gốc: đặt ở giữa các use case gốc đó (kéo theo các con của nó)
  const shift = (id, dy) => { pos.get(id).y += dy; for (const k of kids.get(id)) shift(k, dy); };
  for (const u of g.ucs) if (depth.get(u.id) === 1) {
    const bs = baseIds(u.id).filter((b) => depth.get(b) === 0);
    if (bs.length > 1) shift(u.id, mean(bs.map((b) => pos.get(b).y)) - pos.get(u.id).y);
  }
  for (const x of COL_X.slice(1)) { // chống chồng nhau trong từng cột phụ
    const col = g.ucs.filter((u) => pos.get(u.id).x === x).sort((a, b) => pos.get(a.id).y - pos.get(b.id).y);
    for (let i = 1; i < col.length; i++) { const p = pos.get(col[i - 1].id), c = pos.get(col[i].id); if (c.y - p.y < ROW - 8) c.y = p.y + ROW - 8; }
  }
  const maxCol = Math.max(...g.ucs.map((u) => COL_X.indexOf(pos.get(u.id).x)));
  // tác nhân: đặt theo trung bình các use case làm trực tiếp, cách nhau ≥ 215, cha trên con
  const AC = actorsAll(g);
  const actorY = new Map(); let prev = -Infinity;
  for (const a of AC) {
    const ys = g.ucs.filter((u) => u.by.includes(a)).map((u) => pos.get(u.id).y);
    let t = ys.length ? mean(ys) : (prev === -Infinity ? 100 : prev + 215);
    if (t < prev + 215) t = prev + 215;
    actorY.set(a, t); prev = t;
  }
  // hệ thống ngoài: mỗi cụm use case nối tới (cùng cột, cách nhau ≤ 130) dùng một hộp, đặt ngang tầm cụm đó
  const sysInst = [];
  for (const s of g.systems) {
    const att = g.ucs.filter((u) => (u.sys || []).includes(s)).map((u) => ({ id: u.id, y: pos.get(u.id).y, x: pos.get(u.id).x })).sort((a, b) => a.y - b.y);
    let cl = [];
    const flush = () => { if (cl.length) { sysInst.push({ s, ids: cl.map((c) => c.id), y: mean(cl.map((c) => c.y)) }); cl = []; } };
    for (const a of att) { const l = cl[cl.length - 1]; if (l && l.x === a.x && a.y - l.y <= 130) cl.push(a); else { flush(); cl = [a]; } }
    flush();
  }
  sysInst.sort((a, b) => a.y - b.y);
  let sp = -Infinity; for (const si of sysInst) { si.y = Math.max(si.y, sp + 84); sp = si.y; }

  const ys = g.ucs.map((u) => pos.get(u.id).y);
  const tw = Math.max(150, g.title.length * 7.6 + 30);
  const left = COL_X[0] - RX - 40;
  let right = COL_X[maxCol] + RX + 40;
  if (right - left < tw) right = left + tw;
  const dy = 44 - (Math.min(...ys) - RY - 44);
  const top = 44, bottom = Math.max(...ys) + dy + RY + 44;

  const nodes = [];
  for (const a of AC) nodes.push(personNode(a, 110, actorY.get(a) + dy));
  for (const u of g.ucs) nodes.push(ucNode(gi, u, pos.get(u.id).x, pos.get(u.id).y + dy));
  sysInst.forEach((si, n) => { si.node = { ...sysNode(si.s, right + 150, si.y + dy), id: `sys:${si.s}:${n}` }; nodes.push(si.node); });
  const links = [];
  for (const u of g.ucs) for (const a of u.by) links.push(['p:' + a, 'uc:' + u.id]);
  for (const a of AC) if (ACTOR_PARENT[a] && AC.includes(ACTOR_PARENT[a])) links.push(['p:' + a, 'p:' + ACTOR_PARENT[a], 'general']);
  for (const e of edges) links.push(['uc:' + e.from, 'uc:' + e.to, e.type]);
  for (const si of sysInst) for (const id of si.ids) links.push(['uc:' + id, si.node.id]);

  const maxPersonBottom = Math.max(...AC.map((a) => actorY.get(a) + dy + 58 + 17 * (ACTORS[a].name.length + 1) + 12));
  const maxSysBottom = sysInst.length ? Math.max(...sysInst.map((si) => si.node.y + SYS_H / 2)) : 0;
  const h = Math.max(bottom, maxPersonBottom, maxSysBottom) + 70;
  const w = sysInst.length ? right + 150 + SYS_W / 2 + 40 : right + 60;
  return { file: fileOf(gi), tab: g.title, title: `Sơ đồ use case phân rã — ${g.title}`, w: Math.max(w, 720), h, box: { x: left, y: top, w: right - left, h: bottom - top }, nodes, links };
}

// ═══════════════════════════ SƠ ĐỒ TỔNG QUAN ═══════════════════════════
function layoutOverview() {
  const X = 500, Y0 = 108, PITCH = 64, rowY = (i) => Y0 + i * PITCH;
  const nodes = GROUPS.map((g, i) => ({
    id: 'g:' + i, type: 'uc', x: X, y: rowY(i), rx: 176, ry: 27, big: true,
    lines: [{ t: g.title, k: 'name' }, { t: `${figOf(i)} · ${g.ucs.length} chức năng`, k: 'id' }],
  }));
  const rowsOf = (a) => GROUPS.map((g, i) => (g.ucs.some((u) => u.by.includes(a)) ? i : -1)).filter((i) => i >= 0);
  const S = stats();
  const notesOf = (k) => (ACTOR_PARENT[k]
    ? [`${S.total[k]} chức năng`, `${S.own[k]} riêng`, `${S.total[k] - S.own[k]} kế thừa`, `xem ${actorFig(k)}`]
    : [`${S.total[k]} chức năng`, `xem ${actorFig(k)}`]);
  const stack = (keys, x) => {
    let prev = -Infinity;
    for (const k of keys) {
      const rs = rowsOf(k); let t = rs.length ? mean(rs.map(rowY)) : prev + 235;
      if (t < prev + 235) t = prev + 235;
      nodes.push(personNode(k, x, t, notesOf(k))); prev = t;
    }
  };
  stack(['KV', 'KL', 'KS'], 895); stack(['NV', 'AD'], 105);
  const links = [];
  // đường mờ: nhóm mà tác nhân dùng được nhờ kế thừa (vẽ trước, nằm dưới đường trực tiếp)
  for (const k of Object.keys(ACTORS)) {
    const own = rowsOf(k), inh = new Set();
    for (const anc of ancestors(k)) for (const r of rowsOf(anc)) if (!own.includes(r)) inh.add(r);
    for (const r of inh) links.push(['p:' + k, 'g:' + r, 'inherit']);
  }
  for (const k of Object.keys(ACTORS)) for (const r of rowsOf(k)) links.push(['p:' + k, 'g:' + r]);
  for (const k of Object.keys(ACTOR_PARENT)) links.push(['p:' + k, 'p:' + ACTOR_PARENT[k], 'general']);
  const bottom = rowY(GROUPS.length - 1) + 27 + 34;
  const lowest = Math.max(...nodes.filter((n) => n.type === 'person').map((n) => n.y + 100));
  return { file: 'uc-00-tong-quan', tab: SYSTEM_NAME, title: `Sơ đồ use case tổng quan — ${SYSTEM_NAME} (Topic 1)`, w: 1000, h: Math.max(bottom, lowest) + 62, box: { x: 290, y: 44, w: 420, h: bottom - 44 }, nodes, links };
}

// ═══════════════════════════ SƠ ĐỒ THEO TÁC NHÂN ═══════════════════════════
// Mỗi tác nhân một hình: MỌI chức năng tác nhân đó dùng được, mỗi chức năng một elip và một đường nối.
// Chức năng làm trực tiếp vẽ đậm; chức năng thừa hưởng từ tác nhân cha vẽ mờ. Đường nối là "xương sống" thẳng đứng
// ở giữa, hai cột elip hai bên (không có đường nào cắt qua elip).
const ACTOR_SLUG = { KV: 'khach-vang-lai', KL: 'khach-hang-le', KS: 'khach-hang-si', NV: 'nhan-vien-kho', AD: 'quan-tri-vien' };
const actorFigNo = (a) => ['KV', 'KL', 'KS', 'NV', 'AD'].indexOf(a) + 1;
const actorFig = (a) => `Hình 1.${actorFigNo(a)}`;
const actorFile = (a) => `uc-00-${actorFigNo(a)}-${ACTOR_SLUG[a]}`;

function layoutActorFigure(a) {
  const items = [];
  for (const m of MODEL) for (const u of m.g.ucs) {
    const owners = m.actorsOf(u.id);
    if (canDo(a, owners)) items.push({ gi: m.gi, u, inh: ancestors(a).some((p) => canDo(p, owners)) });
  }
  const blocks = [...new Set(items.map((x) => x.gi))].map((gi) => ({ gi, list: items.filter((x) => x.gi === gi) }));
  const HDR = 34, PITCH = 48, GAP = 18, RXA = 186, RYA = 21;
  const hOf = (b) => HDR + b.list.length * PITCH + GAP;
  const total = blocks.reduce((t, b) => t + hOf(b), 0);
  let split = blocks.length, best = Infinity;
  for (let i = 0; i <= blocks.length; i++) { // chia hai cột tại ranh giới nhóm sao cho hai cột cao gần bằng nhau
    const A = blocks.slice(0, i).reduce((t, b) => t + hOf(b), 0), d = Math.max(A, total - A);
    if (d < best) { best = d; split = i; }
  }
  const cols = [blocks.slice(0, split), blocks.slice(split)].filter((c) => c.length);
  const S = stats(), own = S.own[a], all = S.total[a], inhN = all - own;
  const notes = [`${all} chức năng`];
  if (ACTOR_PARENT[a]) notes.push(`${own} riêng`, `${inhN} kế thừa từ ${actorName(ACTOR_PARENT[a])}`);
  const person = personNode(a, 165, 118, notes);
  const left = 60, TRUNK = 520, XS = cols.length === 1 ? [TRUNK + 70 + RXA] : [280, 760];
  const top = personBottom(person) + 44;
  const armY = person.y + ARM_Y;
  const parts = [], rows = [];
  let bottom = top;
  cols.forEach((col, ci) => {
    let cur = top + 14;
    for (const b of col) {
      const g = GROUPS[b.gi], cx = XS[ci];
      parts.push(`<text x="${cx - RXA}" y="${cur + 18}" font-size="12.5" font-weight="700" fill="${C.ink2}">${esc(`${figOf(b.gi)} · ${g.title}`)}</text>`);
      parts.push(`<line x1="${cx - RXA}" y1="${cur + 25}" x2="${cx + RXA}" y2="${cur + 25}" stroke="#E7E5E4" stroke-width="1"/>`);
      b.list.forEach((it, i) => {
        const y = cur + HDR + i * PITCH + PITCH / 2 - 1;
        rows.push({ cx, y, it, ci });
      });
      cur += hOf(b);
    }
    bottom = Math.max(bottom, cur);
  });
  const lastY = Math.max(...rows.map((r) => r.y));
  const right = (cols.length === 1 ? XS[0] : XS[1]) + RXA + 30;
  const trunkTop = armY, bw = right - left;
  // xương sống + nhánh
  parts.push(`<line x1="${person.x + ARM_X}" y1="${armY}" x2="${TRUNK}" y2="${armY}" stroke="${C.line}" stroke-width="1.4"/>`);
  parts.push(`<line x1="${TRUNK}" y1="${trunkTop}" x2="${TRUNK}" y2="${lastY}" stroke="${C.line}" stroke-width="1.4"/>`);
  for (const r of rows) {
    const tipX = r.ci === 0 && cols.length > 1 ? r.cx + RXA : r.cx - RXA;
    const col = r.it.inh ? '#B8B2AA' : C.line;
    parts.push(`<line x1="${TRUNK}" y1="${r.y}" x2="${tipX}" y2="${r.y}" stroke="${col}" stroke-width="${r.it.inh ? 1.1 : 1.4}"/>`);
  }
  for (const r of rows) {
    const u = r.it.u, gi = r.it.gi, dim = r.it.inh;
    parts.push(`<g><ellipse cx="${r.cx}" cy="${r.y}" rx="${RXA}" ry="${RYA}" fill="#fff" stroke="${dim ? '#B8B2AA' : C.line}" stroke-width="1.4"/>`
      + `<text x="${r.cx}" y="${r.y + 4.5}" text-anchor="middle" font-size="12.5" fill="${dim ? '#78716C' : C.ink}"><tspan font-weight="700" fill="${dim ? '#78716C' : C.ink2}">${esc(codeOf(gi, u))}</tspan><tspan dx="7">${esc(u.name)}</tspan></text></g>`);
  }
  const tw = Math.max(150, `Chức năng của ${actorName(a)}`.length * 7.6 + 30);
  const frameTop = top, frameH = bottom - top + 6;
  const tab = `<rect x="${left + bw - tw}" y="${frameTop - 27}" width="${tw}" height="27" fill="#fff" stroke="${C.line}" stroke-width="1.5"/>`
    + `<text x="${left + bw - tw / 2}" y="${frameTop - 9}" text-anchor="middle" font-size="13" font-weight="600" fill="${C.ink}">${esc(`Chức năng của ${actorName(a)}`)}</text>`;
  const frame = `<rect x="${left}" y="${frameTop}" width="${bw}" height="${frameH}" fill="#fff" stroke="${C.line}" stroke-width="1.8"/>`;
  const H = frameTop + frameH + 70, ly = H - 24;
  let leg = `<g transform="translate(24,${ly})"><line x1="0" y1="0" x2="34" y2="0" stroke="${C.line}" stroke-width="1.4"/><text x="42" y="4" font-size="12" fill="${C.ink2}">Chức năng làm trực tiếp</text></g>`;
  if (inhN) leg += `<g transform="translate(250,${ly})"><line x1="0" y1="0" x2="34" y2="0" stroke="#B8B2AA" stroke-width="1.1"/><text x="42" y="4" font-size="12" fill="${C.ink2}">Chức năng kế thừa từ ${esc(actorName(ACTOR_PARENT[a]))}${ACTOR_PARENT[ACTOR_PARENT[a]] ? ' và cấp trên' : ''}</text></g>`;
  const W = right + 40;
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif">
<title>${esc(`Chức năng của ${actorName(a)} — ${all} chức năng`)}</title>
<rect width="100%" height="100%" fill="#FFFFFF"/>
${tab}
${frame}
${parts.join('\n')}
${personSvg(person)}
${leg}
</svg>
`;
  return { file: actorFile(a), svg, w: W, h: H, title: `Chức năng của ${actorName(a)}`, nodes: items.map(() => ({ type: 'uc' })), actor: a };
}

// ═══════════════════════════ HÌNH HỌC ═══════════════════════════
const ARM_X = 21, ARM_Y = -11;
const personLines = (n) => [...n.lines, `(${n.role})`, ...(n.notes || [])];
const personBottom = (n) => n.y + 58 + 17 * (personLines(n).length - 1) + 5;
function side(n, o) { // điểm nối của đường kết hợp: đầu tay (actor), mép (hệ thống ngoài), đỉnh elip phía đối diện
  const s = sgn(o.x - n.x);
  if (n.type === 'person') return { x: n.x + s * ARM_X, y: n.y + ARM_Y };
  if (n.type === 'system') return { x: n.x + s * SYS_W / 2, y: n.y };
  return { x: n.x + s * n.rx, y: n.y };
}
function clip(n, o) { // điểm trên biên elip theo hướng tới tâm nút kia
  const dx = o.x - n.x, dy = o.y - n.y, t = 1 / Math.sqrt((dx / n.rx) ** 2 + (dy / n.ry) ** 2);
  return { x: n.x + dx * t, y: n.y + dy * t };
}
function route(A, B, type) {
  if (type === 'general') return [{ x: A.x, y: A.y - 49 }, { x: B.x, y: personBottom(B) + 5 }];
  if (A.type === 'uc' && B.type === 'uc') {
    if (Math.abs(A.x - B.x) < 40) return [clip(A, B), clip(B, A)]; // cùng cột: nối tâm với tâm
    // khác cột: tới đỉnh gần nhất của elip bên phải, nên đường nối không thể cắt qua elip khác trong cùng cột
    const aLeft = A.x < B.x, L = aLeft ? A : B, R = aLeft ? B : A;
    const tip = side(R, L);
    // điểm xuất phát trên cung bên phải của elip trái, lệch theo độ cao của đích nên các đường tỏa ra thành quạt
    const th = Math.max(-0.96, Math.min(0.96, Math.atan((tip.y - L.y) / 260)));
    const pl = { x: L.x + L.rx * Math.cos(th), y: L.y + L.ry * Math.sin(th) };
    return aLeft ? [pl, tip] : [tip, pl];
  }
  return [side(A, B), side(B, A)];
}
function hit(n, px, py, pad = 4) {
  if (n.type === 'person') { // hình người, rồi từng dòng chữ theo đúng độ rộng của nó
    if (Math.abs(px - n.x) < 26 && py > n.y - 52 && py < n.y + 42) return true;
    const L = personLines(n);
    return L.some((l, i) => { const cy = n.y + 58 + i * 17, hw = (l.length * (i < n.lines.length ? 7.4 : 6.3)) / 2 + 4; return Math.abs(px - n.x) < hw && py > cy - 13 && py < cy + 5; });
  }
  if (n.type === 'system') return Math.abs(px - n.x) < SYS_W / 2 + pad && Math.abs(py - n.y) < SYS_H / 2 + pad;
  return ((px - n.x) / (n.rx + pad)) ** 2 + ((py - n.y) / (n.ry + pad)) ** 2 < 1;
}
function crosses(a1, a2, b1, b2) {
  const d = (p, q, r) => (q.x - p.x) * (r.y - p.y) - (q.y - p.y) * (r.x - p.x);
  return d(b1, b2, a1) * d(b1, b2, a2) < 0 && d(a1, a2, b1) * d(a1, a2, b2) < 0;
}

// ═══════════════════════════ VẼ SVG ═══════════════════════════
const C = { ink: '#1C1917', ink2: '#57534E', line: '#292524' };
function personSvg(n) {
  const { x, y } = n, s = C.line, L = personLines(n);
  const nName = n.lines.length;
  const text = L.map((l, i) => {
    const small = i >= nName, note = i > nName;
    return `<text x="${x}" y="${y + 58 + i * 17}" text-anchor="middle" font-size="${small ? 12.5 : 14}" font-weight="${small ? 400 : 700}"${note ? ' font-style="italic"' : ''} fill="${small ? C.ink2 : C.ink}">${esc(l)}</text>`;
  }).join('');
  return `<g><circle cx="${x}" cy="${y - 34}" r="11" fill="#fff" stroke="${s}" stroke-width="2"/>`
    + `<path d="M${x} ${y - 23} V${y + 10} M${x - ARM_X} ${y + ARM_Y} H${x + ARM_X} M${x} ${y + 10} L${x - 16} ${y + 38} M${x} ${y + 10} L${x + 16} ${y + 38}" fill="none" stroke="${s}" stroke-width="2" stroke-linecap="round"/>${text}</g>`;
}
function systemSvg(n) {
  const top = n.y - SYS_H / 2, L = n.lines, base = top + 31 + (L.length === 1 ? 6 : 0);
  return `<g><rect x="${n.x - SYS_W / 2}" y="${top}" width="${SYS_W}" height="${SYS_H}" fill="#fff" stroke="${C.line}" stroke-width="1.5"/>`
    + `<text x="${n.x}" y="${top + 15}" text-anchor="middle" font-size="11" font-style="italic" fill="${C.ink2}">«hệ thống ngoài»</text>`
    + L.map((l, i) => `<text x="${n.x}" y="${base + i * 15}" text-anchor="middle" font-size="13" font-weight="600" fill="${C.ink}">${esc(l)}</text>`).join('') + '</g>';
}
function ucSvg(n) {
  const lh = (k) => (k === 'id' ? (n.big ? 15 : 14) : n.big ? 19 : 16), fs = (k) => (k === 'id' ? 11 : n.big ? 14.5 : 13.5);
  const total = n.lines.reduce((s, l) => s + lh(l.k), 0);
  let top = n.y - total / 2;
  const t = n.lines.map((l) => { const y = top + lh(l.k) * 0.76; top += lh(l.k); return `<text x="${n.x}" y="${y.toFixed(1)}" text-anchor="middle" font-size="${fs(l.k)}" font-weight="${l.k === 'id' ? 700 : 500}" fill="${l.k === 'id' ? C.ink2 : C.ink}">${esc(l.t)}</text>`; }).join('');
  return `<g><ellipse cx="${n.x}" cy="${n.y}" rx="${n.rx}" ry="${n.ry}" fill="#fff" stroke="${C.line}" stroke-width="1.5"/>${t}</g>`;
}
function build(d) {
  const byId = new Map(d.nodes.map((n) => [n.id, n]));
  const warn = [], segs = [], parts = [], used = new Set(), labelJobs = [];
  for (const [a, b, type = 'assoc'] of d.links) {
    const A = byId.get(a), B = byId.get(b);
    if (!A || !B) { warn.push(`link ${a}→${b}: thiếu nút`); continue; }
    used.add(type);
    const [p1, p2] = route(A, B, type);
    if (type !== 'inherit') segs.push({ a, b, p1, p2, type });
    const dash = type === 'include' || type === 'extend' ? ' stroke-dasharray="7 5"' : '';
    const mk = type === 'include' || type === 'extend' ? ' marker-end="url(#open)"' : type === 'general' ? ' marker-end="url(#tri)"' : '';
    const light = type === 'inherit';
    parts.push(`<line x1="${p1.x.toFixed(1)}" y1="${p1.y.toFixed(1)}" x2="${p2.x.toFixed(1)}" y2="${p2.y.toFixed(1)}" stroke="${light ? '#B8B2AA' : C.line}" stroke-width="${light ? 1.1 : 1.4}"${dash}${mk}/>`);
    if (type === 'include' || type === 'extend') labelJobs.push({ p1, p2, type, a, b });
    for (let i = 1; i < 80; i++) { // đường nối không được xuyên qua nút khác
      const t = i / 80, px = p1.x + (p2.x - p1.x) * t, py = p1.y + (p2.y - p1.y) * t;
      const h = d.nodes.find((n) => n.id !== a && n.id !== b && hit(n, px, py));
      if (h) { warn.push(`đường ${a}→${b} (${type}) xuyên qua ${h.id}`); break; }
    }
  }
  // nhãn «include» / «extend»: đặt sát đường nối, thử nhiều vị trí để không chạm elip, nét khác hay nhãn khác
  const placed = [];
  const boxHitsNode = (r) => {
    const pts = [];
    for (let i = 0; i <= 6; i++) { const x = r.x1 + ((r.x2 - r.x1) * i) / 6; pts.push([x, r.y1], [x, r.y2]); }
    for (let j = 0; j <= 2; j++) { const y = r.y1 + ((r.y2 - r.y1) * j) / 2; pts.push([r.x1, y], [r.x2, y]); }
    return d.nodes.some((n) => pts.some(([x, y]) => hit(n, x, y, 2)));
  };
  const boxHitsSeg = (r, sg) => {
    for (let i = 0; i <= 28; i++) {
      const t = i / 28, x = sg.p1.x + (sg.p2.x - sg.p1.x) * t, y = sg.p1.y + (sg.p2.y - sg.p1.y) * t;
      if (x > r.x1 - 2 && x < r.x2 + 2 && y > r.y1 - 2 && y < r.y2 + 2) return true;
    }
    return false;
  };
  for (const job of labelJobs) {
    const { p1, p2, type } = job;
    const dx = p2.x - p1.x, dy = p2.y - p1.y, len = Math.hypot(dx, dy) || 1, txt = `«${type}»`;
    const hw = txt.length * 3.3 + 2, hh = 8, vertical = Math.abs(dx) < 24;
    const pref = vertical ? 0.5 : (p1.x > p2.x ? 0.4 : 0.6); // lệch về phía use case phụ (bên phải)
    const ts = vertical ? [0.5, 0.4, 0.6, 0.3, 0.7] : [pref, 0.5, p1.x > p2.x ? 0.3 : 0.7, 0.4, 0.6, 0.25, 0.75];
    let nx = -dy / len, ny = dx / len; if (!vertical && ny > 0) { nx = -nx; ny = -ny; }
    const cands = [];
    for (const t of ts) for (const sd of [1, -1]) {
      const mx = p1.x + dx * t, my = p1.y + dy * t;
      if (vertical) cands.push({ cx: mx + sd * (hw + 8), cy: my });
      else { const off = hw * Math.abs(nx) + hh * Math.abs(ny) + 5; cands.push({ cx: mx + sd * nx * off, cy: my + sd * ny * off }); }
    }
    const ok = (c) => {
      const r = { x1: c.cx - hw, x2: c.cx + hw, y1: c.cy - hh, y2: c.cy + hh };
      return !boxHitsNode(r) && !placed.some((q) => r.x1 < q.x2 && r.x2 > q.x1 && r.y1 < q.y2 && r.y2 > q.y1)
        && !segs.some((sg) => !(sg.p1 === p1 && sg.p2 === p2) && boxHitsSeg(r, sg));
    };
    const c = cands.find(ok) || cands[0];
    placed.push({ x1: c.cx - hw, x2: c.cx + hw, y1: c.cy - hh, y2: c.cy + hh });
    parts.push(`<text x="${c.cx.toFixed(1)}" y="${(c.cy + 4).toFixed(1)}" text-anchor="middle" font-size="12" font-style="italic" fill="${C.ink2}" stroke="#fff" stroke-width="4" paint-order="stroke">${txt}</text>`);
  }
  let cross = 0;
  for (let i = 0; i < segs.length; i++) for (let j = i + 1; j < segs.length; j++) {
    const s = segs[i], t = segs[j];
    if (s.a === t.a || s.a === t.b || s.b === t.a || s.b === t.b) continue;
    if (crosses(s.p1, s.p2, t.p1, t.p2)) cross++;
  }
  const bd = d.box, tw = Math.max(150, d.tab.length * 7.6 + 30);
  const tab = `<rect x="${bd.x + bd.w - tw}" y="${bd.y - 27}" width="${tw}" height="27" fill="#fff" stroke="${C.line}" stroke-width="1.5"/>`
    + `<text x="${bd.x + bd.w - tw / 2}" y="${bd.y - 9}" text-anchor="middle" font-size="13" font-weight="600" fill="${C.ink}">${esc(d.tab)}</text>`;
  const frame = `<rect x="${bd.x}" y="${bd.y}" width="${bd.w}" height="${bd.h}" fill="#fff" stroke="${C.line}" stroke-width="1.8"/>`;
  let lx = 24; const ly = d.h - 24, leg = [];
  const item = (w, svg, label) => { leg.push(`<g transform="translate(${lx},${ly})">${svg}<text x="${w + 8}" y="4" font-size="12" fill="${C.ink2}">${label}</text></g>`); lx += w + 8 + label.length * 6.4 + 28; };
  item(34, `<line x1="0" y1="0" x2="34" y2="0" stroke="${C.line}" stroke-width="1.4"/>`, 'Kết hợp trực tiếp');
  if (used.has('inherit')) item(34, `<line x1="0" y1="0" x2="34" y2="0" stroke="#B8B2AA" stroke-width="1.1"/>`, 'Dùng được nhờ kế thừa');
  if (used.has('include') || used.has('extend')) item(34, `<line x1="0" y1="0" x2="34" y2="0" stroke="${C.line}" stroke-width="1.4" stroke-dasharray="7 5" marker-end="url(#open)"/>`, '«include» / «extend»');
  if (used.has('general')) item(34, `<line x1="0" y1="0" x2="34" y2="0" stroke="${C.line}" stroke-width="1.4" marker-end="url(#tri)"/>`, 'Kế thừa (actor con → actor cha)');
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${d.w}" height="${d.h}" viewBox="0 0 ${d.w} ${d.h}" font-family="'Helvetica Neue', Helvetica, Arial, sans-serif">
<title>${esc(d.title)}</title>
<defs>
  <marker id="open" viewBox="0 0 12 12" refX="11" refY="6" markerWidth="11" markerHeight="11" orient="auto"><path d="M1 1 L11 6 L1 11" fill="none" stroke="${C.line}" stroke-width="1.5"/></marker>
  <marker id="tri" viewBox="0 0 16 14" refX="15" refY="7" markerWidth="15" markerHeight="13" orient="auto"><path d="M1 1 L15 7 L1 13 Z" fill="#fff" stroke="${C.line}" stroke-width="1.5"/></marker>
</defs>
<rect width="100%" height="100%" fill="#FFFFFF"/>
${tab}
${frame}
${parts.join('\n')}
${d.nodes.map((n) => (n.type === 'person' ? personSvg(n) : n.type === 'system' ? systemSvg(n) : ucSvg(n))).join('\n')}
${leg.join('\n')}
</svg>
`;
  return { svg, warn, cross };
}

// ═══════════════════════════ BẢNG VÀ HÌNH CHO TÀI LIỆU ═══════════════════════════
const ACTOR_KEYS = ['KV', 'KL', 'KS', 'NV', 'AD'];
const canDo = (actor, owners) => owners.some((o) => o === actor || ancestors(actor).includes(o));
function stats() {
  const all = MODEL.flatMap((m) => m.g.ucs.map((u) => ({ gi: m.gi, u, owners: m.actorsOf(u.id), rel: m.byId.get(u.id).rel || [] })));
  const inc = MODEL.flatMap((m) => m.edges).filter((e) => e.type === 'include').length;
  const ext = MODEL.flatMap((m) => m.edges).filter((e) => e.type === 'extend').length;
  const own = Object.fromEntries(ACTOR_KEYS.map((a) => [a, all.filter((x) => canDo(a, x.owners) && !ancestors(a).some((p) => canDo(p, x.owners))).length]));
  const total = Object.fromEntries(ACTOR_KEYS.map((a) => [a, all.filter((x) => canDo(a, x.owners)).length]));
  return { all, inc, ext, own, total, ucCount: all.length };
}
function tables() {
  const S = stats();
  const nameOf = (gi, id) => { const u = GROUPS[gi].ucs.find((x) => x.id === String(id)); return `${codeOf(gi, u)} ${u.name}`; };
  // 1. nhóm chức năng
  const groups = ['| Hình | Nhóm chức năng | Tác nhân làm trực tiếp | Dùng được thêm nhờ kế thừa | Số use case |', '|---|---|---|---|---|'];
  GROUPS.forEach((g, gi) => {
    const dir = ACTOR_KEYS.filter((a) => g.ucs.some((u) => u.by.includes(a)));
    const inh = actorsAll({ actors: dir }).filter((a) => !dir.includes(a));
    groups.push(`| ${figOf(gi)} | ${g.title} | ${dir.map(actorName).join(', ')} | ${inh.length ? inh.map(actorName).join(', ') : '—'} | ${g.ucs.length} |`);
  });
  // 2. tác nhân × số chức năng
  const actors = ['| Tác nhân | Vai trò | Làm trực tiếp | Kế thừa thêm | Tổng chức năng |', '|---|---|---|---|---|'];
  for (const a of ACTOR_KEYS) {
    const parent = ACTOR_PARENT[a];
    actors.push(`| ${actorName(a)} | ${ACTORS[a].role} | ${S.own[a]} | ${parent ? `${S.total[a] - S.own[a]} (từ ${actorName(parent)}${ACTOR_PARENT[parent] ? ' và cấp trên' : ''})` : '—'} | **${S.total[a]}** |`);
  }
  // 3. chức năng của từng tác nhân
  const per = [];
  for (const a of ACTOR_KEYS) {
    per.push(`#### ${actorName(a)} (${ACTORS[a].role}) — ${S.total[a]} chức năng`);
    per.push('');
    per.push(`${ACTORS[a].desc}.${ACTOR_PARENT[a] ? ` Làm được **toàn bộ ${S.total[ACTOR_PARENT[a]]} chức năng của ${actorName(ACTOR_PARENT[a])}** và thêm ${S.own[a]} chức năng riêng dưới đây.` : ` ${S.own[a]} chức năng.`}`);
    per.push('');
    for (const m of MODEL) {
      const mine = m.g.ucs.filter((u) => m.actorsOf(u.id).includes(a));
      if (mine.length) per.push(`- **${figOf(m.gi)} — ${m.g.title}:** ${mine.map((u) => `${u.name} (${codeOf(m.gi, u)})`).join(' · ')}`);
    }
    per.push('');
  }
  // 3b. hệ thống ngoài
  const systems = ['| Hệ thống ngoài | Dùng ở | Trong prototype |', '|---|---|---|'];
  for (const [k, sd] of Object.entries(SYSTEMS)) {
    const uses = MODEL.flatMap((m) => m.g.ucs.filter((u) => (u.sys || []).includes(k)).map((u) => codeOf(m.gi, u)));
    systems.push(`| ${sd.lines.join(' ')} | ${uses.join(', ')} | ${sd.note} |`);
  }
  // 4. hình
  const figs = [];
  for (const m of MODEL) {
    const g = m.g, gi = m.gi, acts = actorsAll(g).map(actorName).join(', ');
    figs.push(`### ${figOf(gi)} — ${g.title}`, '', `![${figOf(gi)} — ${g.title}](diagrams/${fileOf(gi)}.png)`, '');
    figs.push(`*${figOf(gi)} — ${g.title}. Tác nhân: ${acts}${g.systems.length ? `. Hệ thống ngoài: ${g.systems.map((s) => SYSTEMS[s].lines.join(' ')).join(', ')}` : ''}. ${g.ucs.length} use case: ${codeOf(gi, g.ucs[0])} → ${codeOf(gi, g.ucs[g.ucs.length - 1])}. Ảnh vector: [\`diagrams/${fileOf(gi)}.svg\`](diagrams/${fileOf(gi)}.svg).*`, '');
  }
  // 4b. hình theo tác nhân
  const afigs = [];
  for (const a of ACTOR_KEYS) {
    afigs.push(`### ${actorFig(a)} — Chức năng của ${actorName(a)} (${S.total[a]} chức năng)`, '', `![${actorFig(a)} — Chức năng của ${actorName(a)}](diagrams/${actorFile(a)}.png)`, '');
    afigs.push(`*${actorFig(a)} — ${ACTORS[a].role}: **${S.total[a]} chức năng**${ACTOR_PARENT[a] ? ` (${S.own[a]} riêng + ${S.total[a] - S.own[a]} kế thừa từ ${actorName(ACTOR_PARENT[a])})` : ''}, mỗi chức năng một đường nối. Ảnh vector: [\`diagrams/${actorFile(a)}.svg\`](diagrams/${actorFile(a)}.svg).*`, '');
  }
  // 5. quan hệ
  const rels = ['| Hình | Quan hệ | Use case nguồn | Use case đích |', '|---|---|---|---|'];
  for (const m of MODEL) for (const e of m.edges) rels.push(`| ${figOf(m.gi)} | «${e.type}» | ${nameOf(m.gi, e.from)} | ${nameOf(m.gi, e.to)} |`);
  // 6. danh mục
  const cat = ['| Mã | Use case | Tác nhân | Màn hình | Yêu cầu | Ghi chú |', '|---|---|---|---|---|---|'];
  for (const m of MODEL) for (const u of m.g.ucs) {
    const owners = m.actorsOf(u.id).map(actorName).join(', ');
    cat.push(`| ${codeOf(m.gi, u)} | ${u.name} | ${owners}${u.by.length ? '' : ' *(qua use case gốc)*'} | ${u.scr} | ${u.req || m.g.req} | ${u.note || ''} |`);
  }
  const summary = `${ACTOR_KEYS.length} tác nhân (người) · ${Object.keys(SYSTEMS).length} hệ thống ngoài · **${S.ucCount} use case** · ${GROUPS.length} nhóm chức năng · ${GROUPS.length + 1 + ACTOR_KEYS.length} hình · ${S.inc} quan hệ «include» · ${S.ext} quan hệ «extend» · ${Object.keys(ACTOR_PARENT).length} quan hệ kế thừa`;
  return { summary, actorfigs: afigs.join('\n').trimEnd(), groups: groups.join('\n'), actors: actors.join('\n'), systems: systems.join('\n'), peractor: per.join('\n').trimEnd(), figures: figs.join('\n').trimEnd(), relations: rels.join('\n'), catalogue: cat.join('\n') };
}
if (process.argv.includes('--write-doc')) {
  const file = path.join(dir, '..', '05_use_case_diagram.md');
  let md = fs.readFileSync(file, 'utf8'); const t = tables();
  for (const key of ['summary', 'actorfigs', 'groups', 'actors', 'systems', 'peractor', 'figures', 'relations', 'catalogue']) {
    const re = new RegExp(`(<!-- uc:${key}:start -->)[\\s\\S]*?(<!-- uc:${key}:end -->)`);
    if (!re.test(md)) { console.error(`Thiếu cặp dấu <!-- uc:${key}:start/end --> trong ${path.basename(file)}`); process.exit(1); }
    md = md.replace(re, (_, a, b) => `${a}\n${t[key]}\n${b}`);
  }
  fs.writeFileSync(file, md);
  console.log(`Đã cập nhật ${path.basename(file)}: ${t.summary.replace(/\*\*/g, '')}`);
  process.exit(0);
}

// ═══════════════════════════ CHẠY ═══════════════════════════
const DIAGRAMS = [layoutOverview(), ...ACTOR_KEYS.map(layoutActorFigure), ...MODEL.map(layoutGroup)];
let bad = 0;
for (const f of fs.readdirSync(dir)) if (/^uc-\d\d-.*\.(svg|png)$/.test(f) && !DIAGRAMS.some((d) => f.startsWith(d.file + '.'))) { fs.unlinkSync(path.join(dir, f)); console.log(`• đã xóa file cũ ${f}`); }
for (const d of DIAGRAMS) {
  const { svg, warn, cross } = d.svg ? { svg: d.svg, warn: [], cross: 0 } : build(d);
  fs.writeFileSync(path.join(dir, d.file + '.svg'), svg);
  console.log(`${warn.length ? '⚠' : '✓'} ${d.file}  (${d.nodes.filter((n) => n.type === 'uc').length} elip, ${cross} đường cắt nhau)${warn.length ? '\n    ' + warn.join('\n    ') : ''}`);
  bad += warn.length;
}
if (process.argv.includes('--no-png')) process.exit(bad ? 1 : 0);

const CHROME = process.env.CHROME_PATH || ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium', 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'].find((p) => fs.existsSync(p));
if (!CHROME) { console.log('• Không có Chrome: chỉ xuất SVG (đặt CHROME_PATH để xuất PNG).'); process.exit(bad ? 1 : 0); }
const tmp = fs.mkdtempSync(path.join(process.env.UC_TMPDIR || os.tmpdir(), 'uc-png-'));
const port = 9500 + Math.floor(Math.random() * 400);
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', '--no-first-run', '--hide-scrollbars', `--remote-debugging-port=${port}`, `--user-data-dir=${tmp}`, '--window-size=1400,1100', 'about:blank'], { stdio: 'ignore' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
let page; for (let i = 0; i < 80 && !page; i++) { try { page = (await (await fetch(`http://127.0.0.1:${port}/json`)).json()).find((t) => t.type === 'page'); } catch {} if (!page) await sleep(250); }
if (!page) { console.log('• Không mở được Chrome: chỉ có SVG.'); chrome.kill('SIGKILL'); process.exit(bad ? 1 : 0); }
const ws = new WebSocket(page.webSocketDebuggerUrl); await new Promise((r) => (ws.onopen = r));
let id = 0; const pend = new Map(); ws.onmessage = (m) => { const x = JSON.parse(m.data); if (x.id && pend.has(x.id)) { pend.get(x.id)(x); pend.delete(x.id); } };
const send = (method, params = {}) => new Promise((res) => { const i = ++id; pend.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
await send('Page.enable');
for (const d of DIAGRAMS) {
  await send('Emulation.setDeviceMetricsOverride', { width: Math.ceil(d.w), height: Math.ceil(d.h), deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url: 'file://' + path.join(dir, d.file + '.svg') }); await sleep(450);
  const shot = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: d.w, height: d.h, scale: 2 } });
  fs.writeFileSync(path.join(dir, d.file + '.png'), Buffer.from(shot.result.data, 'base64'));
}
try { chrome.kill('SIGKILL'); fs.rmSync(tmp, { recursive: true, force: true }); } catch {}
console.log(`PNG: ${DIAGRAMS.length} ảnh (nét x2).`);
process.exit(bad ? 1 : 0);
