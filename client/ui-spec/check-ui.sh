#!/usr/bin/env bash
# Kiểm tra "dấu hiệu giao diện AI" và lỗi token trong client/src.
# Chạy từ thư mục client/:   bash ui-spec/check-ui.sh
# Thoát với mã 1 nếu còn vi phạm (mục tiêu cuối cùng: 0 vi phạm).
cd "$(dirname "$0")/.." || exit 1

SRC="src"
INC=(--include='*.tsx' --include='*.ts' --include='*.css')
violations=0

check() { # check "<tên>" "<regex -E>" "<gợi ý>" ["<regex loại trừ>"]
  local name="$1" pattern="$2" hint="$3" exclude="${4:-}" out count
  out=$(grep -rnE "${INC[@]}" -e "$pattern" "$SRC" 2>/dev/null)
  if [ -n "$exclude" ]; then out=$(printf '%s\n' "$out" | grep -vE "$exclude" || true); fi
  count=$(printf '%s' "$out" | grep -c . || true)
  if [ "$count" -gt 0 ]; then
    violations=$((violations + count))
    printf '\n✗ %s — %s chỗ\n  → %s\n' "$name" "$count" "$hint"
    printf '%s\n' "$out" | head -5 | sed 's/^/    /'
    [ "$count" -gt 5 ] && printf '    … và %s chỗ khác\n' "$((count - 5))"
  else
    printf '✓ %s\n' "$name"
  fi
}

echo "== UI check: dấu hiệu giao diện AI & lỗi token =="

check "Gradient"            'bg-(linear|gradient|radial|conic)|(^|[^a-z-])(from|via|to)-(\[|[a-z]+-[0-9]|[a-z]+/|transparent|black|white)|bg-clip-text' \
      "Dùng màu phẳng. Chỉ được phủ phẳng bg-black/40 khi đặt chữ lên ảnh."
check "Kính mờ / blur"      'backdrop-blur|(^|[^a-z-])blur-' \
      "Bỏ hẳn. Dùng nền trắng + viền 1px."
check "Bo góc quá lớn"      'rounded-(2xl|3xl|4xl)|rounded-\[(1[6-9]|[2-9][0-9]|[1-9][0-9]{2,})px\]|rounded-\[[1-9][0-9]*(\.[0-9]+)?rem\]' \
      "Chỉ rounded-sm/md/lg/xl; rounded-full cho avatar, chấm trạng thái, nút icon."
check "Đổ bóng nặng"        'shadow-(md|lg|xl|2xl)|drop-shadow' \
      "Chỉ shadow-pop / shadow-modal (token) cho dropdown, modal, drawer."
check "Hiệu ứng trang trí"  'animate-(float|pulse|bounce|ping)|(hover|group-hover|active|focus):-?(scale|translate)' \
      "Chỉ đổi màu 150ms. Chuyển trang dùng .page-enter (01_design_rules.md mục 10.1)."
check "Class animate của plugin ngoài components/ui" 'animate-(in|out)|(fade|zoom|slide)-(in|out)' \
      "Chỉ được dùng trong src/components/ui/ (Radix + tw-animate-css)." 'src/components/ui/'
check "Icon Sparkles"       'Sparkles' \
      "Bỏ. Không dùng icon 'lấp lánh' làm trang trí."
check "Chữ IN HOA / tracking" 'uppercase|tracking-(wide|wider|widest)' \
      "Dùng sentence case, không giãn chữ."
check "Chữ quá nhỏ / class không tồn tại" 'text-(2xs|3xs)|text-\[(8|9|10|11)px\]' \
      "Nhỏ nhất text-xs (12px)."
check "Màu hex cứng trong className" '\[#[0-9A-Fa-f]{3,8}\]' \
      "Dùng token: bg-brand, text-ink, border-line…"
# Cụm từ cấm (không phân biệt hoa thường)
phrases='hoàn hảo|tuyệt vời|đẳng cấp|đột phá|chuyển đổi số|100% hoàn thiện|siêu tiết kiệm'
out=$(grep -rniE "${INC[@]}" -e "$phrases" "$SRC" 2>/dev/null | grep -v 'src/data/')
count=$(printf '%s' "$out" | grep -c . || true)
if [ "$count" -gt 0 ]; then
  violations=$((violations + count))
  printf '\n✗ Cụm từ quảng cáo/hoa mỹ — %s chỗ\n  → Viết mô tả đúng, ngắn, cụ thể (xem 01_design_rules.md mục 8).\n' "$count"
  printf '%s\n' "$out" | head -5 | sed 's/^/    /'
else
  echo "✓ Cụm từ quảng cáo/hoa mỹ"
fi

# Emoji / ký tự biểu tượng (dùng perl vì grep của macOS không hỗ trợ -P)
if command -v perl >/dev/null 2>&1; then
  out=$(find "$SRC" \( -name '*.tsx' -o -name '*.ts' -o -name '*.css' \) -not -path 'src/data/*' -print0 \
    | xargs -0 perl -CSD -ne 'print "$ARGV:$.:$_" if /[\x{1F300}-\x{1FAFF}\x{2600}-\x{27BF}\x{2B50}\x{FE0F}]/; close ARGV if eof' 2>/dev/null)
  count=$(printf '%s' "$out" | grep -c . || true)
  if [ "$count" -gt 0 ]; then
    violations=$((violations + count))
    printf '\n✗ Emoji / ký tự biểu tượng — %s chỗ\n  → Dùng icon lucide-react.\n' "$count"
    printf '%s\n' "$out" | head -5 | sed 's/^/    /'
    [ "$count" -gt 5 ] && printf '    … và %s chỗ khác\n' "$((count - 5))"
  else
    echo "✓ Emoji / ký tự biểu tượng"
  fi
else
  echo "• Bỏ qua kiểm tra emoji (không có perl)"
fi

# Nội dung môn học/demo chỉ được nằm ở: DemoWidget, pages/dev, SiteFooter (1 dòng), data/
out=$(grep -rn 'SWR302' "$SRC" --include='*.tsx' 2>/dev/null | grep -vE 'DemoWidget|pages/dev/|SiteFooter|src/data/' | grep -vE ':[0-9]+:[[:space:]]*(//|\{/\*|/\*|\*)')
count=$(printf '%s' "$out" | grep -c . || true)
if [ "$count" -gt 0 ]; then
  violations=$((violations + count))
  printf '\n✗ Chữ "SWR302" lọt ra giao diện khách — %s chỗ\n  → Chỉ để trong DemoWidget, pages/dev/*, và 1 dòng ở SiteFooter.\n' "$count"
  printf '%s\n' "$out" | head -5 | sed 's/^/    /'
else
  echo '✓ "SWR302" chỉ nằm ở khu vực demo'
fi

# Cảnh báo (không tính vi phạm): font-mono chỉ hợp lệ cho SKU, số lô, mã đơn, OTP
mono=$(grep -rn 'font-mono' "$SRC" --include='*.tsx' 2>/dev/null | grep -c . || true)
printf '\n• font-mono: %s chỗ (chỉ hợp lệ cho SKU, số lô, mã đơn, OTP — tự rà bằng mắt)\n' "$mono"

[ -f THIRD_PARTY.md ] || echo '• THIRD_PARTY.md: chưa có (bắt buộc ở T16)'

echo
if [ "$violations" -gt 0 ]; then
  echo "KẾT QUẢ: $violations vi phạm."
  exit 1
fi
echo "KẾT QUẢ: sạch (0 vi phạm)."
