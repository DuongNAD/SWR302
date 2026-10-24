import os
import sys
import time

if sys.platform == "win32":
    sys.stdout.reconfigure(encoding='utf-8')
    sys.stderr.reconfigure(encoding='utf-8')

from playwright.sync_api import sync_playwright

OUTPUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'screenshots_use_cases'))
os.makedirs(OUTPUT_DIR, exist_ok=True)

BASE_URL = "http://localhost:5173/#"

TARGETS = [
    # 1. Khám phá & Tra cứu
    {
        "file": "00_Trang_Chu_GiaHoaPhat.png",
        "path": "/",
        "title": "Trang chủ hệ thống Gia Hòa Phát Bakery Supply",
        "action": None
    },
    {
        "file": "UC01_Dang_Ky_Tai_Khoan.png",
        "path": "/dang-ky",
        "title": "UC01 - Đăng ký tài khoản (Khách lẻ / Khách sỉ B2B)",
        "action": None
    },
    {
        "file": "UC02_Dang_Nhap_He_Thong.png",
        "path": "/dang-nhap",
        "title": "UC02 - Đăng nhập hệ thống & Demo RBAC",
        "action": None
    },
    {
        "file": "UC03_Tim_Kiem_Nguyen_Lieu.png",
        "path": "/tim-kiem?q=b%C6%A1",
        "title": "UC03 - Tìm kiếm nguyên liệu & Gợi ý từ khóa",
        "action": None
    },
    {
        "file": "UC04_Loc_Theo_Chuoi_Lanh_Va_Gia.png",
        "path": "/san-pham",
        "title": "UC04 - Danh mục sản phẩm, bộ lọc chuỗi lạnh 2-8°C & khoảng giá",
        "action": None
    },
    {
        "file": "UC05_Chi_Tiet_San_Pham_HSD_Bang_Gia_Si.png",
        "path": "/san-pham/prod-01",
        "title": "UC05 - Chi tiết sản phẩm, HSD theo lô & Bảng giá sỉ",
        "action": None
    },
    {
        "file": "UC06_Danh_Sach_Combo_Cong_Thuc.png",
        "path": "/combo",
        "title": "UC06 - Danh sách combo công thức làm bánh (Recipe Kits)",
        "action": None
    },
    {
        "file": "UC06_Chi_Tiet_Combo_Cong_Thuc.png",
        "path": "/combo/bundle-tiramisu",
        "title": "UC06 - Chi tiết combo bánh Tiramisu & trọn bộ nguyên liệu",
        "action": None
    },

    # 2. Mua hàng & Vận chuyển
    {
        "file": "UC07_Quan_Ly_Gio_Hang.png",
        "path": "/gio-hang",
        "title": "UC07 - Quản lý giỏ hàng thông minh & Cảnh báo chuỗi lạnh",
        "action": None
    },
    {
        "file": "UC08_Dat_Hang_Hoa_Toc_Xe_Lanh.png",
        "path": "/thanh-toan",
        "title": "UC08 & UC09 - Đặt hàng hỏa tốc xe lạnh & Phí thùng xốp đá gel",
        "action": None
    },
    {
        "file": "UC09_Thanh_Toan_Dat_Hang_Thanh_Cong.png",
        "path": "/dat-hang/thanh-cong/GHP-889120",
        "title": "UC09 & UC10 - Đặt hàng thành công & Thanh toán trực tuyến",
        "action": None
    },
    {
        "file": "UC10_Tra_Cuu_Don_Hang.png",
        "path": "/tra-cuu-don-hang",
        "title": "UC10 - Tra cứu thông tin đơn hàng",
        "action": None
    },
    {
        "file": "UC10_Theo_Doi_Don_Hang_Xe_Lanh.png",
        "path": "/don-hang/GHP-889120",
        "title": "UC10 & UC12 - Theo dõi hành trình giao hàng xe lạnh real-time",
        "action": None
    },

    # 3. Kênh B2B & Tài khoản cá nhân
    {
        "file": "Bo_Sung_Trang_Mua_Si_B2B.png",
        "path": "/mua-si",
        "title": "Chính sách & Cổng mua sỉ cho tiệm bánh B2B",
        "action": None
    },
    {
        "file": "Bo_Sung_Quan_Ly_Tai_Khoan.png",
        "path": "/tai-khoan",
        "title": "Trang tổng quan tài khoản khách hàng",
        "action": None
    },
    {
        "file": "Bo_Sung_Lich_Su_Don_Hang_User.png",
        "path": "/tai-khoan/don-hang",
        "title": "Lịch sử đơn hàng cá nhân",
        "action": None
    },

    # 4. Quản trị & Vận hành (Admin / Warehouse)
    {
        "file": "UC11_Admin_Quan_Ly_San_Pham.png",
        "path": "/admin/san-pham",
        "title": "UC11 & UC16 - Quản lý danh sách sản phẩm & Bảng giá sỉ",
        "action": None
    },
    {
        "file": "UC11_Admin_Form_San_Pham_Gia_Si.png",
        "path": "/admin/san-pham/moi",
        "title": "UC11 & UC16 - Biểu mẫu tạo mới sản phẩm & thiết lập bảng giá sỉ",
        "action": None
    },
    {
        "file": "UC12_Admin_Quan_Ly_Danh_Muc.png",
        "path": "/admin/danh-muc",
        "title": "UC12 & UC17 - Quản lý danh mục nguyên liệu & combo làm bánh",
        "action": None
    },
    {
        "file": "UC13_Admin_Quan_Ly_Ton_Kho_So_Lo.png",
        "path": "/admin/ton-kho",
        "title": "UC13 - Quản lý tồn kho theo số lô & Kho mát / Kho đông",
        "action": None
    },
    {
        "file": "UC14_Admin_Giam_Sat_FEFO_Canh_Bao_HSD.png",
        "path": "/admin/ton-kho",
        "title": "UC14 - Giám sát hạn dùng & Cảnh báo FEFO xuất kho trước",
        "action": "click_fefo_tab"
    },
    {
        "file": "UC15_Admin_Dieu_Phoi_Van_Chuyen.png",
        "path": "/admin/van-chuyen",
        "title": "UC15 - Đóng gói đá gel chuỗi lạnh & Điều phối xe lạnh",
        "action": None
    },
    {
        "file": "UC16_Admin_Danh_Sach_Don_Hang.png",
        "path": "/admin/don-hang",
        "title": "UC16 & UC18 - Quản lý danh sách đơn hàng & Phân loại vận chuyển",
        "action": None
    },
    {
        "file": "UC16_Admin_Chi_Tiet_Don_Hang.png",
        "path": "/admin/don-hang/ord-889120",
        "title": "UC16 & UC18 - Chi tiết đơn hàng, quy cách đóng gói & thông tin khách",
        "action": None
    },
    {
        "file": "UC17_Admin_Quan_Tri_Nhan_Vien_RBAC.png",
        "path": "/admin/nhan-vien",
        "title": "UC17 & UC19 - Quản trị nhân viên & Ma trận phân quyền RBAC",
        "action": None
    },
    {
        "file": "UC17_Admin_Danh_Sach_Khach_Hang.png",
        "path": "/admin/khach-hang",
        "title": "UC17 & UC19 - Danh sách khách hàng lẻ & khách sỉ B2B",
        "action": None
    },
    {
        "file": "UC18_Admin_Bao_Cao_Thong_Ke.png",
        "path": "/admin/bao-cao",
        "title": "UC18 & UC20 - Báo cáo thống kê doanh thu & Hiệu suất chuỗi lạnh",
        "action": None
    },
    {
        "file": "Admin_Dashboard_Tong_Quan.png",
        "path": "/admin",
        "title": "Admin Dashboard - Tổng quan chỉ số vận hành & Cảnh báo nhanh",
        "action": None
    },
]

def main():
    print(f"Bắt đầu chụp màn hình các giao diện theo sơ đồ Use Case...")
    print(f"Thư mục lưu trữ: {OUTPUT_DIR}")

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Desktop 1440x900 viewport with device scale 1.25 for sharp crisp text
        context = browser.new_context(
            viewport={"width": 1440, "height": 900},
            device_scale_factor=1.25,
            locale="vi-VN"
        )
        page = context.new_page()

        for idx, target in enumerate(TARGETS, 1):
            out_path = os.path.join(OUTPUT_DIR, target["file"])
            url = f"{BASE_URL}{target['path']}"
            print(f"[{idx}/{len(TARGETS)}] Đang chụp: {target['file']} ({url})...")
            try:
                page.goto(url, wait_until="networkidle", timeout=20000)
                time.sleep(1.0)

                # Special action
                if target.get("action") == "click_fefo_tab":
                    fefo_btn = page.locator("button:has-text('FEFO')")
                    if fefo_btn.count() > 0:
                        fefo_btn.first.click()
                        time.sleep(0.8)

                page.screenshot(path=out_path, full_page=False)
                size_kb = os.path.getsize(out_path) / 1024
                print(f"  -> Lưu thành công ({size_kb:.1f} KB)")
            except Exception as e:
                print(f"  -> Lỗi: {e}")

        browser.close()

    print("\nHoàn tất chụp 100% các màn hình giao diện theo sơ đồ Use Case!")

if __name__ == "__main__":
    main()
