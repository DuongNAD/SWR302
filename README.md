# 📚 SWR302 — Software Requirements Engineering Project

> **Khóa học:** SWR302 - Software Requirements (Kỹ nghệ Yêu cầu Phần mềm)  
> **Mục tiêu:** Xây dựng bộ tài liệu đặc tả yêu cầu phần mềm hoàn chỉnh theo chuẩn quốc tế (**IEEE Std 830 / ISO/IEC/IEEE 29148**), mô hình hóa hệ thống với UML, thiết kế User Stories & Acceptance Criteria theo chuẩn Agile, và thiết lập ma trận truy vết (RTM).

---

## 📂 Cấu trúc thư mục dự án

```text
SWR302/
├── README.md                      # Hướng dẫn tổng quan & lộ trình môn học
├── PROJECT_INFO.md                # Thông tin nhóm, đề tài, phân công vai trò
├── PROMPTS_GUIDE.md               # Sổ tay Prompt AI chuyên dụng để phân tích & viết tài liệu
│
├── docs/                          # Thư mục tài liệu đồ án chính thức
│   ├── 01_vision_and_scope/       # Vision & Scope, Phân tích Stakeholder, Context Diagram
│   ├── 02_elicitation/            # Kịch bản phỏng vấn, Persona, Vấn đề nghiệp vụ
│   ├── 03_srs/                    # Đặc tả yêu cầu phần mềm SRS (FRs, NFRs, Business Rules)
│   ├── 04_use_cases/              # Danh mục & Đặc tả chi tiết Use Cases (Alistair Cockburn format)
│   ├── 05_user_stories/           # Agile Backlog (INVEST), Story Map, Acceptance Criteria (Gherkin)
│   ├── 06_diagrams_models/        # Sơ đồ UML (Use Case, Activity, Sequence, Domain Class Diagram)
│   ├── 07_ui_wireframes/          # Sơ đồ luồng màn hình (UI Flow) & Wireframe Specs
│   └── 08_rtm_and_validation/     # Ma trận truy vết (RTM) & Checklist đánh giá chất lượng SRS
│
├── templates/                     # Bộ mẫu văn bản chuẩn để nhân bản nhanh
│   ├── template_vision_scope.md
│   ├── template_srs.md
│   ├── template_use_case.md
│   ├── template_user_story.md
│   └── template_rtm.md
│
├── scripts/                       # Tool hỗ trợ đồ án
│   ├── export_docs.py             # Script gộp & xuất toàn bộ Markdown ra HTML nộp bài / in ấn
│   └── validate_traceability.py   # Script kiểm tra tính toàn vẹn của mã yêu cầu (Traceability Check)
│
└── assets/                        # Ảnh chụp màn hình, sơ đồ xuất ra từ Figma / PlantUML
```

---

## 🎯 Lộ trình thực hiện môn SWR302 (Milestone / Phases)

| Giai đoạn | Nội dung trọng tâm | Deliverables chính | Thư mục tương ứng |
| :--- | :--- | :--- | :--- |
| **Phase 1: Inception & Scope** | Xác định đề tài, bài toán kinh doanh, phạm vi dự án | `Vision and Scope Document`, `Stakeholder Analysis`, `Context Diagram` | `docs/01_vision_and_scope/` |
| **Phase 2: Elicitation & Analysis** | Thu thập yêu cầu, thấu cảm người dùng | `Interview Transcripts`, `User Personas`, `Empathy Maps` | `docs/02_elicitation/` |
| **Phase 3: Requirements Modeling** | Phân tích chức năng, mô hình hóa luồng nghiệp vụ | `Use Case Index & Specs`, `User Stories (Agile)`, `Activity Diagrams` | `docs/04_use_cases/`, `docs/05_user_stories/` |
| **Phase 4: Detailed Specification (SRS)** | Đặc tả chi tiết theo chuẩn IEEE 830 / ISO 29148 | `Full SRS Document`, `Functional Reqs (FR)`, `Non-Functional Reqs (FURPS+)`, `Business Rules` | `docs/03_srs/` |
| **Phase 5: Design Models & Prototype** | Kiến trúc phân tích & giao diện người dùng | `Domain Class Diagram`, `Sequence Diagrams`, `UI Wireframes & Prototype` | `docs/06_diagrams_models/`, `docs/07_ui_wireframes/` |
| **Phase 6: Verification & Validation** | Đảm bảo tính nhất quán, đo lường độ bao phủ | `Requirements Traceability Matrix (RTM)`, `SRS Review Checklist` | `docs/08_rtm_and_validation/` |

---

## 🛠️ Công cụ khuyên dùng trong môn SWR302

1. **UML Diagrams:**
   - [Mermaid.js](https://mermaid.js.org/) (Tích hợp sẵn trong Markdown - render trực tiếp trên GitHub/VS Code).
   - [PlantUML](https://plantuml.com/) hoặc [Draw.io](https://app.diagrams.net/).
2. **Wireframe & Mockup:**
   - [Figma](https://www.figma.com/) hoặc [Balsamiq Wireframes](https://balsamiq.com/).
3. **Quản lý Task / Backlog:**
   - GitHub Projects, Jira hoặc Trello.
4. **Viết và xuất tài liệu:**
   - VS Code / Antigravity IDE với extension Markdown Preview Enhanced.
   - Script xuất tài liệu: `python3 scripts/export_docs.py` (tự động xuất ra 1 file HTML duy nhất).

---

## 🚀 Bắt đầu ngay

1. Mở file [PROJECT_INFO.md](file:///Users/duongnad/Documents/project/SWR302/PROJECT_INFO.md) để điền tên đề tài, thông tin giảng viên và thành viên nhóm.
2. Đọc [PROMPTS_GUIDE.md](file:///Users/duongnad/Documents/project/SWR302/PROMPTS_GUIDE.md) để biết các prompt mẫu hỗ trợ AI brainstorm yêu cầu, viết Use Case, và sinh kịch bản Acceptance Criteria.
3. Chỉnh sửa tài liệu trong thư mục `docs/` theo từng tuần học.
