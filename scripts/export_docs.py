#!/usr/bin/env python3
"""
SWR302 - Document Export Tool
Xuất toàn bộ tài liệu Markdown của dự án SWR302 thành một file HTML duy nhất
kèm mục lục và CSS phong cách chuyên nghiệp để in ấn hoặc nộp bài.
"""

import os
import re
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DOCS_DIR = BASE_DIR / "docs"
OUTPUT_FILE = BASE_DIR / "SWR302_Full_Specification_Report.html"

FILES_IN_ORDER = [
    DOCS_DIR / "01_vision_and_scope" / "vision_and_scope.md",
    DOCS_DIR / "01_vision_and_scope" / "stakeholder_analysis.md",
    DOCS_DIR / "02_elicitation" / "user_personas.md",
    DOCS_DIR / "03_srs" / "IEEE_830_SRS.md",
    DOCS_DIR / "03_srs" / "functional_reqs.md",
    DOCS_DIR / "03_srs" / "non_functional_reqs.md",
    DOCS_DIR / "03_srs" / "business_rules.md",
    DOCS_DIR / "04_use_cases" / "use_case_index.md",
    DOCS_DIR / "04_use_cases" / "specs" / "UC01_Authentication.md",
    DOCS_DIR / "05_user_stories" / "product_backlog.md",
    DOCS_DIR / "06_diagrams_models" / "use_case_diagram.md",
    DOCS_DIR / "06_diagrams_models" / "activity_diagrams.md",
    DOCS_DIR / "06_diagrams_models" / "sequence_diagrams.md",
    DOCS_DIR / "06_diagrams_models" / "domain_model.md",
    DOCS_DIR / "07_ui_wireframes" / "ui_flow.md",
    DOCS_DIR / "08_rtm_and_validation" / "rtm_matrix.md",
    DOCS_DIR / "08_rtm_and_validation" / "srs_review_checklist.md",
]

HTML_TEMPLATE = """<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SWR302 — Software Requirements Specification Report</title>
    <!-- Mermaid.js for UML diagrams -->
    <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
    <!-- Marked.js for Markdown parsing -->
    <script src="https://cdn.jsdelivr.net/npm/marked/marked.min.js"></script>
    <style>
        :root {
            --primary: #2563eb;
            --primary-dark: #1d4ed8;
            --text: #1f2937;
            --bg: #f9fafb;
            --card-bg: #ffffff;
            --border: #e5e7eb;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            color: var(--text);
            background: var(--bg);
            line-height: 1.6;
            margin: 0;
            padding: 2rem;
        }
        .container {
            max-width: 900px;
            margin: 0 auto;
            background: var(--card-bg);
            padding: 3rem 4rem;
            border-radius: 12px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
        h1, h2, h3, h4 {
            color: #111827;
            font-weight: 700;
        }
        h1 {
            border-bottom: 2px solid var(--primary);
            padding-bottom: 0.5rem;
            margin-top: 2rem;
        }
        h2 {
            border-bottom: 1px solid var(--border);
            padding-bottom: 0.3rem;
            margin-top: 1.5rem;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
            font-size: 0.95rem;
        }
        th, td {
            border: 1px solid var(--border);
            padding: 0.75rem 1rem;
            text-align: left;
        }
        th {
            background-color: #f3f4f6;
            font-weight: 600;
        }
        tr:nth-child(even) {
            background-color: #f9fafb;
        }
        code {
            background-color: #f3f4f6;
            padding: 0.2rem 0.4rem;
            border-radius: 4px;
            font-size: 0.875em;
            color: #d97706;
        }
        pre {
            background-color: #1f2937;
            color: #f3f4f6;
            padding: 1rem;
            border-radius: 8px;
            overflow-x: auto;
        }
        pre code {
            background-color: transparent;
            color: inherit;
            padding: 0;
        }
        blockquote {
            border-left: 4px solid var(--primary);
            margin: 1.5rem 0;
            padding: 0.5rem 1rem;
            background: #eff6ff;
            color: #1e40af;
            border-radius: 0 8px 8px 0;
        }
        .mermaid {
            background: #ffffff;
            margin: 1.5rem 0;
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid var(--border);
            display: flex;
            justify-content: center;
        }
        @media print {
            body { padding: 0; background: #fff; }
            .container { box-shadow: none; padding: 1rem; max-width: 100%; }
            .no-print { display: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <header style="text-align: center; margin-bottom: 3rem;">
            <h1 style="border: none; margin-bottom: 0.5rem;">ĐẠI HỌC FPT — KHOA CÔNG NGHỆ THÔNG TIN</h1>
            <h2 style="border: none; color: #4b5563; font-weight: 500;">BÁO CÁO ĐỒ ÁN MÔN HỌC SWR302 (SOFTWARE REQUIREMENTS)</h2>
            <hr style="border: 0; border-top: 2px solid var(--primary); width: 80px; margin: 1.5rem auto;">
        </header>

        <div id="content"></div>
    </div>

    <script>
        mermaid.initialize({ startOnLoad: true, theme: 'default' });
        
        // Raw Markdown Content
        const rawMarkdown = `RAW_MARKDOWN_PLACEHOLDER`;
        
        // Custom renderer for Mermaid
        const renderer = new marked.Renderer();
        const defaultCode = renderer.code.bind(renderer);
        renderer.code = function(code, language) {
            if (language === 'mermaid') {
                return '<div class="mermaid">' + code + '</div>';
            }
            return defaultCode(code, language);
        };

        marked.setOptions({ renderer: renderer, gfm: true, breaks: true });
        document.getElementById('content').innerHTML = marked.parse(rawMarkdown);
        setTimeout(() => { mermaid.run(); }, 300);
    </script>
</body>
</html>
"""

def main():
    print("🚀 Đang tổng hợp các tài liệu Markdown SWR302...")
    combined_md = []
    
    for file_path in FILES_IN_ORDER:
        if file_path.exists():
            print(f"  + Đọc: {file_path.relative_to(BASE_DIR)}")
            content = file_path.read_text(encoding="utf-8")
            combined_md.append(f"\n\n---\n\n<!-- FILE: {file_path.name} -->\n\n" + content)
        else:
            print(f"  ⚠️ Bỏ qua (không tìm thấy): {file_path.relative_to(BASE_DIR)}")

    all_text = "".join(combined_md)
    # Escape backticks and backslashes for JS string template
    safe_text = all_text.replace("\\", "\\\\").replace("`", "\\`").replace("${", "\\${")

    html_out = HTML_TEMPLATE.replace("RAW_MARKDOWN_PLACEHOLDER", safe_text)
    OUTPUT_FILE.write_text(html_out, encoding="utf-8")
    print(f"\n✅ Đã xuất báo cáo thành công tại:\n👉 file://{OUTPUT_FILE.resolve()}")

if __name__ == "__main__":
    main()
