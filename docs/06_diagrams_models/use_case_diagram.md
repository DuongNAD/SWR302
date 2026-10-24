# 📊 SƠ ĐỒ USE CASE DỰ ÁN (USE CASE DIAGRAMS)

> **Môn học:** SWR302 — Software Requirements Engineering  
> **Đề tài:** Topic 1 — Hệ Thống Mua Sắm Nguyên Liệu & Thiết Bị Làm Bánh Trực Tuyến (**Gia Hoa Phat Bakery Supply**)  
> **Định dạng:** Chuẩn giáo trình kỹ nghệ phần mềm Việt Nam & Quốc tế (UML 2.5 / Cockburn Use Case Model)  
> **Xem trực tiếp trên Web:** [http://localhost:5500/use_case_viewer.html](http://localhost:5500/use_case_viewer.html)

---

## 2.1 BIỂU ĐỒ USE CASE TỔNG QUAN (SYSTEM OVERVIEW USE CASE DIAGRAM)

Mô hình bố cục 2 phía kinh điển theo chuẩn giáo trình:
- **Phía bên trái:** Tác nhân Quản trị & Vận hành (`Admin / Quản Trị Viên`, `Nhân Viên Kho`).
- **Phía bên phải:** Tác nhân Người dùng (`Khách Vãng Lai / Guest`, `Khách Mua Hàng / Customer`, `Khách Mua Sỉ / Wholesale B2B`) có quan hệ kế thừa (`Generalization ▲`).
- **Ở giữa:** Khung ranh giới hệ thống (*System Boundary*) chứa cột các Use Case hình Oval xếp dọc thẳng hàng, ngăn nắp.

```mermaid
flowchart LR
    %% Primary Actors Left
    subgraph LeftActors["Quản Trị & Vận Hành"]
        Admin["👤\nQuản Trị Viên\n(Admin)"]
        Warehouse["👤\nNhân Viên Kho\n(Warehouse Staff)"]
    end

    %% Primary Actors Right
    subgraph RightActors["Khách Hàng"]
        direction TB
        Guest["👤\nKhách Vãng Lai\n(Guest)"]
        Customer["👤\nKhách Mua Hàng\n(Customer)"]
        Wholesale["👤\nKhách Mua Sỉ\n(Wholesale B2B)"]

        Customer -- "|kế thừa|" --> Guest
        Wholesale -- "|kế thừa|" --> Customer
    end

    %% System Boundary
    subgraph SystemBoundary["Hệ Thống Mua Sắm Nguyên Liệu Làm Bánh Gia Hòa Phát"]
        direction TB
        UC01(["Đăng ký tài khoản"]):::uc
        UC02(["Đăng nhập hệ thống"]):::uc
        UC03(["Tìm kiếm nguyên liệu"]):::uc
        UC04(["Lọc theo chuỗi lạnh & giá"]):::uc
        UC05(["Xem chi tiết & HSD lô hàng"]):::uc
        UC06(["Xem combo công thức làm bánh"]):::uc
        UC07(["Quản lý giỏ hàng"]):::uc
        UC08(["Đặt hàng hỏa tốc xe lạnh"]):::uc
        UC09(["Thanh toán trực tuyến"]):::uc
        UC10(["Tra cứu & Theo dõi đơn hàng"]):::uc
        UC11(["Quản lý sản phẩm & Bảng giá sỉ"]):::uc
        UC12(["Quản lý combo làm bánh (Recipe Kits)"]):::uc
        UC13(["Quản lý nhập/xuất kho theo lô"]):::uc
        UC14(["Giám sát HSD & Cảnh báo FEFO"]):::uc
        UC15(["Xử lý đóng gói đá gel chuỗi lạnh"]):::uc
        UC16(["Quản lý đơn hàng & Giao hàng"]):::uc
        UC17(["Quản trị người dùng & Phân quyền"]):::uc
        UC18(["Báo cáo thống kê doanh thu"]):::uc
    end

    %% Association Lines Right (Guest, Customer, Wholesale)
    Guest --- UC01
    Guest --- UC02
    Guest --- UC03
    Guest --- UC04
    Guest --- UC05
    Guest --- UC06
    Guest --- UC10

    Customer --- UC07
    Customer --- UC08
    Customer --- UC09
    Customer --- UC10

    Wholesale --- UC08
    Wholesale --- UC09

    %% Association Lines Left (Admin, Warehouse)
    Admin --- UC02
    Admin --- UC11
    Admin --- UC12
    Admin --- UC16
    Admin --- UC17
    Admin --- UC18

    Warehouse --- UC02
    Warehouse --- UC13
    Warehouse --- UC14
    Warehouse --- UC15
    Warehouse --- UC16

    classDef uc fill:#FFFDF0,stroke:#8B2500,stroke-width:1.5px,color:#3D1200,font-weight:600;
```

---

## 2.2 BIỂU ĐỒ USE CASE PHÂN RÃ (DECOMPOSED USE CASE DIAGRAMS)

### 2.2.1 Phân Rã 1: Phân Hệ Khách Hàng & Mua Sắm (Customer & Shopping)
Thể hiện chi tiết các quan hệ `<<include>>` (Bao hàm bắt buộc) và `<<extend>>` (Mở rộng có điều kiện) trong quá trình tìm kiếm, quản lý giỏ hàng và đặt hàng nguyên liệu làm bánh.

```mermaid
flowchart LR
    %% Actors
    subgraph ActorsPhanHe1["Tác Nhân"]
        direction TB
        Guest["👤\nKhách Vãng Lai\n(Guest)"]
        Customer["👤\nKhách Hàng\n(Customer)"]
        Wholesale["👤\nKhách Mua Sỉ\n(Wholesale B2B)"]

        Customer -- "|kế thừa|" --> Guest
        Wholesale -- "|kế thừa|" --> Customer
    end

    %% Use Cases
    subgraph CustomerSubsystem["Phân Hệ Khám Phá & Mua Hàng"]
        direction TB
        UC_Home(["Xem trang chủ"]):::uc
        UC_ViewProd(["Xem sản phẩm"]):::uc
        UC_CatFilter(["Xem theo danh mục / chuỗi lạnh"]):::uc
        UC_BrandFilter(["Xem theo thương hiệu"]):::uc
        UC_Search(["Tìm kiếm nguyên liệu"]):::uc
        UC_ProdDetail(["Xem chi tiết sản phẩm"]):::uc
        UC_TierPrice(["Xem bảng giá sỉ bậc thang"]):::uc
        UC_RecipeKit(["Xem combo công thức làm bánh"]):::uc
        UC_Cart(["Quản lý giỏ hàng"]):::uc
        UC_AutoDiscount(["Tự động áp dụng giá sỉ"]):::uc
        UC_Checkout(["Đặt hàng xe lạnh"]):::uc
        UC_ColdPackFee(["Tính phí thùng xốp đá gel"]):::uc
        UC_Payment(["Thanh toán đơn hàng"]):::uc
        UC_Voucher(["Áp dụng voucher"]):::uc
        UC_VAT(["Yêu cầu hóa đơn đỏ VAT"]):::uc
        UC_Track(["Theo dõi đơn hàng"]):::uc
        UC_RegMember(["Đăng ký thành viên"]):::uc
        UC_RegB2B(["Đăng ký khách sỉ B2B"]):::uc
        UC_VerifyOTP(["Xác thực OTP"]):::uc
    end

    %% Connections
    Guest --- UC_Home
    Guest --- UC_ViewProd
    Guest --- UC_Search
    Guest --- UC_ProdDetail
    Guest --- UC_RecipeKit
    Guest --- UC_RegMember
    Guest --- UC_Track

    Customer --- UC_Cart
    Customer --- UC_Checkout
    Customer --- UC_Track
    Customer --- UC_RegB2B

    Wholesale --- UC_Checkout

    %% UML Include Relationships
    UC_ViewProd -.->|"<<include>>"| UC_CatFilter
    UC_ViewProd -.->|"<<include>>"| UC_BrandFilter
    UC_Cart -.->|"<<include>>"| UC_AutoDiscount
    UC_Checkout -.->|"<<include>>"| UC_Payment
    UC_Checkout -.->|"<<include>>"| UC_ColdPackFee
    UC_RegMember -.->|"<<include>>"| UC_VerifyOTP

    %% UML Extend Relationships
    UC_ProdDetail -.->|"<<extend>>"| UC_TierPrice
    UC_Voucher -.->|"<<extend>>"| UC_Payment
    UC_VAT -.->|"<<extend>>"| UC_Checkout

    classDef uc fill:#FFFDF0,stroke:#8B2500,stroke-width:1.5px,color:#3D1200;
```

---

### 2.2.2 Phân Rã 2: Phân Hệ Quản Trị Cửa Hàng & Kho Vận (Admin & Warehouse)
Thể hiện luồng quản lý đơn hàng chuỗi lạnh và quản trị kho bơ sữa theo hạn sử dụng FEFO.

```mermaid
flowchart LR
    %% Actors
    subgraph ActorsPhanHe2["Tác Nhân Quản Trị"]
        direction TB
        Admin["👤\nQuản Trị Viên\n(Admin)"]
        Warehouse["👤\nNhân Viên Kho\n(Warehouse Staff)"]
        ColdCarrier["🚚\nĐơn Vị Xe Lạnh 2-4h"]
    end

    %% Use Cases
    subgraph AdminSubsystem["Phân Hệ Quản Trị & Vận Hành Kho"]
        direction TB
        UC_OrderMgt(["Quản lý đơn hàng"]):::uc
        UC_ConfirmOrder(["Tiếp nhận & Xác nhận"]):::uc
        UC_Packing(["Đóng gói thùng đá gel"]):::uc
        UC_Handover(["Bàn giao xe lạnh"]):::uc
        UC_Inventory(["Quản lý tồn kho theo lô"]):::uc
        UC_LotBatch(["Ghi nhận số lô & vị trí kho"]):::uc
        UC_ExpiryAlert(["Cảnh báo bơ sữa cận date"]):::uc
        UC_ProdMgt(["Quản lý sản phẩm"]):::uc
        UC_TierConfig(["Cấu hình giá sỉ bậc thang"]):::uc
        UC_KitMgt(["Quản lý bộ Recipe Kit"]):::uc
        UC_UserMgt(["Quản trị tài khoản & Duyệt B2B"]):::uc
        UC_Report(["Báo cáo doanh thu & kho"]):::uc
    end

    Admin --- UC_OrderMgt
    Admin --- UC_ProdMgt
    Admin --- UC_KitMgt
    Admin --- UC_UserMgt
    Admin --- UC_Report

    Warehouse --- UC_OrderMgt
    Warehouse --- UC_Inventory

    %% UML Includes
    UC_OrderMgt -.->|"<<include>>"| UC_ConfirmOrder
    UC_OrderMgt -.->|"<<include>>"| UC_Packing
    UC_OrderMgt -.->|"<<include>>"| UC_Handover
    UC_Inventory -.->|"<<include>>"| UC_LotBatch
    UC_ProdMgt -.->|"<<include>>"| UC_TierConfig

    %% UML Extends
    UC_ExpiryAlert -.->|"<<extend>>"| UC_Inventory

    UC_Handover <--> ColdCarrier

    classDef uc fill:#FFFDF0,stroke:#8B2500,stroke-width:1.5px,color:#3D1200;
```

---

## 2.3 MÃ PLANTUML CHUẨN ĐỂ IMPORT VÀO DRAW.IO / WORD

Sinh viên có thể sao chép đoạn mã PlantUML dưới đây vào **Draw.io** (`Arrange -> Insert -> Advanced -> PlantUML`) hoặc công cụ **PlantText.com** để xuất ra sơ đồ hình người que chuẩn 100%:

```plantuml
@startuml GiaHoaPhat_UseCase_TongQuan
left to right direction
skinparam packageStyle rectangle
skinparam actorStyle awesome

actor "Khách Vãng Lai\n(Guest)" as Guest
actor "Khách Mua Hàng\n(Customer)" as Customer
actor "Khách Mua Sỉ\n(Wholesale B2B)" as Wholesale
actor "Quản Trị Viên\n(Admin)" as Admin
actor "Nhân Viên Kho\n(Warehouse)" as Warehouse

Customer --|> Guest
Wholesale --|> Customer

rectangle "Hệ Thống Mua Sắm Nguyên Liệu Làm Bánh Gia Hòa Phát" {
  (Đăng ký tài khoản) as UC_Reg
  (Đăng nhập hệ thống) as UC_Login
  (Tìm kiếm nguyên liệu) as UC_Search
  (Lọc theo chuỗi lạnh & giá) as UC_Filter
  (Xem chi tiết & HSD lô hàng) as UC_Detail
  (Xem combo công thức làm bánh) as UC_Combo
  (Quản lý giỏ hàng) as UC_Cart
  (Đặt hàng hỏa tốc xe lạnh) as UC_Order
  (Thanh toán trực tuyến) as UC_Pay
  (Tra cứu & Theo dõi đơn hàng) as UC_Track
  
  (Quản lý sản phẩm & Bảng giá sỉ) as UC_Prod
  (Quản lý combo làm bánh) as UC_Kit
  (Quản lý kho theo số lô) as UC_Inv
  (Cảnh báo HSD cận date FEFO) as UC_FEFO
  (Đóng gói đá gel chuỗi lạnh) as UC_Pack
  (Xử lý đơn hàng) as UC_OrderMgt
  (Quản trị người dùng & Phân quyền) as UC_User
  (Báo cáo doanh thu & Kho) as UC_Report
}

Guest --> UC_Reg
Guest --> UC_Login
Guest --> UC_Search
Guest --> UC_Filter
Guest --> UC_Detail
Guest --> UC_Combo
Guest --> UC_Track

Customer --> UC_Cart
Customer --> UC_Order
Customer --> UC_Pay
Customer --> UC_Track

Wholesale --> UC_Order

Admin --> UC_Login
Admin --> UC_Prod
Admin --> UC_Kit
Admin --> UC_OrderMgt
Admin --> UC_User
Admin --> UC_Report

Warehouse --> UC_Login
Warehouse --> UC_Inv
Warehouse --> UC_FEFO
Warehouse --> UC_Pack
Warehouse --> UC_OrderMgt

@enduml
```
