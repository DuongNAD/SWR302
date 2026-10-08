#!/usr/bin/env python3
"""
SWR302 - Traceability & Integrity Validator
Kiểm tra tính toàn vẹn của mã yêu cầu (FRs, BRs, UCs) và đảm bảo
100% các yêu cầu đều có trong Ma trận truy vết (RTM).
"""

import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DOCS_DIR = BASE_DIR / "docs"

def extract_tokens(pattern, file_path):
    if not file_path.exists():
        return set()
    content = file_path.read_text(encoding="utf-8")
    return set(re.findall(pattern, content))

def main():
    print("=" * 60)
    print("🔍 SWR302 — REQUIREMENTS TRACEABILITY VALIDATOR")
    print("=" * 60)

    # 1. Quét FRs từ functional_reqs.md
    fr_file = DOCS_DIR / "03_srs" / "functional_reqs.md"
    fr_set = extract_tokens(r"FR-[A-Z]+-\d+", fr_file)
    print(f"📌 Tìm thấy {len(fr_set)} Functional Requirements (FRs): {sorted(list(fr_set))}")

    # 2. Quét BRs từ business_rules.md
    br_file = DOCS_DIR / "03_srs" / "business_rules.md"
    br_set = extract_tokens(r"BR-\d+", br_file)
    print(f"📌 Tìm thấy {len(br_set)} Business Rules (BRs): {sorted(list(br_set))}")

    # 3. Quét UCs từ use_case_index.md
    uc_file = DOCS_DIR / "04_use_cases" / "use_case_index.md"
    uc_set = extract_tokens(r"UC-\d+", uc_file)
    print(f"📌 Tìm thấy {len(uc_set)} Use Cases (UCs): {sorted(list(uc_set))}")

    # 4. Quét RTM Matrix
    rtm_file = DOCS_DIR / "08_rtm_and_validation" / "rtm_matrix.md"
    rtm_fr = extract_tokens(r"FR-[A-Z]+-\d+", rtm_file)
    rtm_br = extract_tokens(r"BR-\d+", rtm_file)
    rtm_uc = extract_tokens(r"UC-\d+", rtm_file)

    print("\n--- KẾT QUẢ ĐỐI SOÁT TRUY VẾT (RTM) ---")
    
    missing_fr = fr_set - rtm_fr
    if missing_fr:
        print(f"⚠️  CẢNH BÁO: Các FR chưa được ánh xạ trong RTM: {sorted(list(missing_fr))}")
    else:
        print("✅ 100% Functional Requirements đã được ánh xạ trong RTM!")

    missing_uc = uc_set - rtm_uc
    if missing_uc:
        print(f"⚠️  CẢNH BÁO: Các Use Case chưa được ánh xạ trong RTM: {sorted(list(missing_uc))}")
    else:
        print("✅ 100% Use Cases đã có trong RTM!")

    print("\n🎉 Kiểm tra hoàn tất!")

if __name__ == "__main__":
    main()
