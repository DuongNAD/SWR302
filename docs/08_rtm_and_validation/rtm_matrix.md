# 📊 MA TRẬN TRUY VẾT YÊU CẦU (REQUIREMENTS TRACEABILITY MATRIX - RTM)

> **Mục tiêu:** Ánh xạ từ Mục tiêu Kinh doanh (BO) ➔ Yêu cầu Chức năng (FR) ➔ Quy tắc Nghiệp vụ (BR) ➔ Use Case (UC) ➔ User Story (US) ➔ Màn hình (SCR) ➔ Kịch bản Kiểm thử (TC).

| Business Obj | Functional Req (FR) | Business Rule (BR) | Use Case (UC) | User Story (US) | Screen (SCR) | Test Case (TC) | Trạng thái |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **BO-1** | `FR-AUTH-01` | `BR-02` | `UC-01` | `US-01` | `SCR-02` | `TC-AUTH-01` | Verified |
| **BO-1** | `FR-AUTH-02` | — | `UC-01` | `US-01` | `SCR-02` | `TC-AUTH-02` | Verified |
| **BO-1** | `FR-AUTH-03` | `BR-01` | `UC-01` | `US-02` | `SCR-02` | `TC-AUTH-03` | Verified |
| **BO-1** | `FR-AUTH-04` | `BR-03` | `UC-01` | `US-02` | `SCR-02` | `TC-AUTH-04` | Verified |
| **BO-1** | `FR-AUTH-05` | — | `UC-01` | `US-02` | `SCR-02` | `TC-AUTH-05` | Planned |
| **BO-1** | `FR-AUTH-06` | — | `UC-01` | `US-02` | `SCR-02` | `TC-AUTH-06` | Planned |
| **BO-1** | `FR-SRC-01` | — | `UC-02` | `US-03` | `SCR-01` | `TC-SRC-01` | In Dev |
| **BO-1** | `FR-SRC-02` | — | `UC-02` | `US-03` | `SCR-01` | `TC-SRC-02` | In Dev |
| **BO-1** | `FR-SRC-03` | — | `UC-02` | `US-03` | `SCR-03` | `TC-SRC-03` | In Dev |
| **BO-2** | `FR-BOK-01` | — | `UC-03` | `US-04` | `SCR-04` | `TC-BOK-01` | In Dev |
| **BO-2** | `FR-BOK-02` | `BR-04` | `UC-03` | `US-04` | `SCR-04` | `TC-BOK-02` | In Dev |
| **BO-2** | `FR-BOK-03` | — | `UC-03` | `US-04` | `SCR-06` | `TC-BOK-03` | In Dev |
| **BO-2** | `FR-PAY-01` | `BR-07` | `UC-04` | `US-05` | `SCR-05` | `TC-PAY-01` | Planned |
| **BO-2** | `FR-PAY-02` | `BR-06` | `UC-04` | `US-05` | `SCR-05` | `TC-PAY-02` | Planned |
| **BO-2** | `FR-PAY-03` | — | `UC-04` | `US-05` | `SCR-05` | `TC-PAY-03` | Planned |
| **BO-3** | `FR-BOK-04` | `BR-05` | `UC-05` | `US-06` | `SCR-06` | `TC-BOK-04` | Planned |
| **BO-3** | `FR-BOK-05` | — | `UC-05` | `US-06` | — | `TC-BOK-05` | Planned |
| **BO-2** | `FR-BOK-01` | `BR-08` | `UC-06` | `US-07` | `SCR-04` | `TC-BOK-06` | In Dev |
| **BO-2** | — | — | `UC-07` | `US-06` | `SCR-03` | `TC-REV-01` | Planned |
| **BO-2** | `FR-ADM-01` | — | `UC-08` | `US-07` | `SCR-07` | `TC-ADM-01` | Planned |
| **BO-2** | `FR-ADM-02` | `BR-08` | `UC-09` | `US-07` | `SCR-07` | `TC-ADM-02` | Planned |
| **BO-3** | `FR-ADM-03` | — | `UC-10` | `US-08` | `SCR-07` | `TC-ADM-03` | Planned |

---

## TỔNG KẾT TRACEABILITY
- **100% FRs** đều được liên kết trực tiếp với Use Case và User Story.
- **Không có Orphan Requirement** (Yêu cầu không rõ nguồn gốc mục tiêu nghiệp vụ).
- **Không có Gold Plating** (Tính năng tự tiện thêm vào mà không phục vụ mục tiêu kinh doanh).
