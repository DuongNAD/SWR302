# 🤖 SỔ TAY PROMPT AI CHUYÊN DỤNG CHO MÔN SWR302

> Bộ prompt này được tối ưu hóa theo phương pháp kỹ nghệ yêu cầu chuẩn (**Karl Wiegers, Alistair Cockburn, IEEE 830, ISO/IEC/IEEE 29148**). Dán các prompt này vào AI (Antigravity, Gemini, ChatGPT...) kèm thông tin đề tài của bạn để sinh tài liệu chất lượng cao.

---

## 1. Prompt Brainstorming & Xác định Vision & Scope

```markdown
Bạn là một Chuyên gia Phân tích Nghiệp vụ (Senior Business Analyst).
Tôi đang làm đồ án môn SWR302 (Software Requirements) về đề tài: [TÊN ĐỀ TÀI].

Hãy giúp tôi xây dựng khung tài liệu Vision & Scope gồm:
1. Problem Statement (Tuyên bố vấn đề: Vấn đề hiện tại là gì? Ai bị ảnh hưởng? Hậu quả là gì? Lợi ích giải pháp mang lại).
2. Business Objectives & Success Metrics (Mục tiêu kinh doanh SMART và chỉ số đo lường thành công).
3. Target Audience & Stakeholder Profile (Xác định các nhóm người dùng chính, nỗi đau và mong đợi).
4. Project Scope (Phạm vi dự án: Tính năng có trong Scope (In-Scope) và tính năng nằm ngoài Scope (Out-of-Scope) của phiên bản MVP).
5. Giả định (Assumptions) & Ràng buộc (Constraints) về công nghệ, pháp lý, thời gian.
```

---

## 2. Prompt Thu thập Yêu cầu & Viết Persona (Elicitation)

```markdown
Đóng vai trò Chuyên gia UX Researcher và Lead BA.
Đối với hệ thống [TÊN ĐỀ TÀI], hãy xây dựng:
1. Bộ câu hỏi phỏng vấn bán cấu trúc (Semi-structured Interview Script) dành cho 2 nhóm:
   - Nhóm người dùng cuối (End-user).
   - Nhóm quản lý / vận hành hệ thống (Admin / Business Owner).
2. 02 User Personas chi tiết bao gồm: Họ tên, Nghề nghiệp, Demographic, Goals & Needs, Pain Points, Scenarios khi họ dùng hệ thống.
3. Bản đồ thấu cảm (Empathy Map: Says - Thinks - Does - Feels).
```

---

## 3. Prompt Viết Đặc tả Use Case chuẩn Alistair Cockburn (Fully Dressed)

```markdown
Đóng vai trò Business Analyst chuyên nghiệp.
Hãy viết đặc tả chi tiết (Fully Dressed Use Case Specification) theo chuẩn Alistair Cockburn cho Use Case sau:
- Use Case ID: [Ví dụ: UC03]
- Tên Use Case: [Ví dụ: Đặt lịch hẹn khám bệnh]
- Primary Actor: [Ví dụ: Bệnh nhân]

Cấu trúc yêu cầu:
1. Use Case Name & ID
2. Primary Actor, Secondary Actors
3. Preconditions (Tiền điều kiện)
4. Postconditions (Hậu điều kiện: Minimal Guarantees & Success Guarantees)
5. Trigger (Sự kiện kích hoạt)
6. Main Success Scenario (Luồng cơ bản đánh số 1, 2, 3... phân rõ hành động của Actor và phản hồi của System)
7. Extensions / Alternative Flows (Các luồng nhánh và ngoại lệ, ví dụ 3a, 4a, 4b...)
8. Special Requirements (Yêu cầu phi chức năng cụ thể cho UC này)
9. Technology & Data Variations List
10. Open Issues
```

---

## 4. Prompt Viết User Story & Acceptance Criteria chuẩn Gherkin

```markdown
Đóng vai trò Product Owner / Agile Business Analyst.
Với module [TÊN MODULE, ví dụ: Thanh toán đơn hàng], hãy viết 3-5 User Stories theo tiêu chí INVEST.

Mỗi User Story cần có định dạng:
- Story ID: [US-xx]
- Title: [Tên ngắn gọn]
- Format: "Là một [Vai trò], tôi muốn [Hành động/Chức năng], để [Lợi ích mang lại]".
- Business Value & Priority (MoSCoW: Must have / Should have / Could have / Won't have).
- Story Points ước tính (Fibonacci: 1, 2, 3, 5, 8).
- Acceptance Criteria viết theo cú pháp Gherkin BDD (Scenario: Given... When... Then...).
```

---

## 5. Prompt Viết Yêu cầu Phi chức năng (NFRs) chuẩn FURPS+

```markdown
Đóng vai trò Software Architect và Requirements Engineer.
Hãy phân tích và viết danh sách Yêu cầu Phi Chức năng (Non-Functional Requirements - NFRs) cho hệ thống [TÊN ĐỀ TÀI] theo chuẩn FURPS+:
- F (Functionality: Security, Auditing, Access Control)
- U (Usability: UX, Accessibility, Learning curve, Internationalization)
- R (Reliability: Availability 99.9%, MTBF, MTTR, Data Backup & Recovery)
- P (Performance: Response time, Throughput, Concurrency, Resource usage)
- S (Supportability: Maintainability, Extensibility, Testability, Portability)
- Ràng buộc bổ sung: Ràng buộc pháp lý (Data Privacy/GDPR/Luật An ninh mạng VN) và ràng buộc triển khai.

Yêu cầu: Mỗi NFR phải có ID (NFR-01, NFR-02...), đo lường được (quantifiable / testable), KHÔNG dùng các từ mơ hồ như "nhanh", "dễ dùng", "an toàn".
```

---

## 6. Prompt Sinh sơ đồ Mermaid (Use Case, Activity, Sequence)

```markdown
Hãy viết mã nguồn sơ đồ Mermaid Markdown cho nghiệp vụ [TÊN NGHIỆP VỤ] của hệ thống [TÊN ĐỀ TÀI]:
1. Diagram type: [Chọn một trong: mermaid sequenceDiagram / flowchart TD / classDiagram]
2. Thể hiện đầy đủ các thành phần, thông điệp rõ ràng, các điều kiện rẽ nhánh (alt / else / opt).
3. Đảm bảo cú pháp Mermaid chuẩn, không dùng ký tự đặc biệt gây lỗi render.
```

---

## 7. Prompt Review & Kiểm định chất lượng SRS (Verification & Validation)

```markdown
Đóng vai trò Lead Quality Assurance / Giảng viên chấm thi môn SWR302.
Tôi cung cấp cho bạn đoạn đặc tả yêu cầu sau:
"""
[DÁN ĐOẠN ĐẶC TẢ HOẶC DANH SÁCH FR CỦA BẠN VÀO ĐÂY]
"""

Hãy đánh giá đoạn đặc tả trên dựa trên 8 đặc tính chất lượng của IEEE 830:
1. Correctness (Tính đúng đắn)
2. Unambiguous (Tính không mơ hồ - chỉ ra các từ ngữ mơ hồ cần sửa)
3. Complete (Tính đầy đủ - chỉ ra các kịch bản ngoại lệ bị bỏ sót)
4. Consistent (Tính nhất quán)
5. Ranked for importance/stability (Xếp hạng độ ưu tiên)
6. Verifiable / Testable (Khả năng kiểm chứng)
7. Modifiable (Khả năng sửa đổi)
8. Traceable (Khả năng truy vết)

Hãy đề xuất câu viết lại chuẩn xác cho từng điểm còn yếu.
```
