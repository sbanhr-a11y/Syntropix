#!/usr/bin/env python3
"""Static PDF composition gate for synthetic Cognimorph POC reports.

This complements, but does not replace, a manual editorial/a11y PDF review.
"""
import sys
from collections import Counter
import fitz

file = sys.argv[1] if len(sys.argv) > 1 else "qa-output-cognimorph/fictional-report.pdf"
pdf = fitz.open(file)
issues=[]
if not (7 <= len(pdf) <= 12):
    issues.append(f"Unexpected {len(pdf)} pages; expected 7-12 for current test scenario")
body_sizes=Counter()
for n,page in enumerate(pdf,1):
    pagewords=page.get_text("words")
    if len(pagewords)<30:
        issues.append(f"Page {n} appears blank or nearly blank ({len(pagewords)} words)")
    boxes=page.get_text("dict")["blocks"]
    bottom=0
    for block in boxes:
        for line in block.get("lines",[]):
            for span in line.get("spans",[]):
                if not span.get("text","").strip():
                    continue
                size=round(span["size"],1)
                if 10.9<=size<=11.1:
                    body_sizes["11pt"]+=1
                elif size < 8:
                    # The radar visual uses small data labels; those labels are also in full-size body text.
                    body_sizes["chart-small"]+=1
                else:
                    body_sizes["other"]+=1
                x0,y0,x1,y1=span["bbox"]
                if x0 < -1 or x1 > page.rect.width+1 or y0 < -1 or y1 > page.rect.height+1:
                    issues.append(f"Page {n}: text bbox outside page ({span['text'][:35]!r})")
                bottom=max(bottom,y1)
    if bottom < page.rect.height*.48:
        issues.append(f"Page {n} uses less than 48% of printable height (last text y={bottom:.0f})")
text="\n".join(page.get_text() for page in pdf)
for phrase in ["Your Cognimorph report","Learning through change",
               "Learning after setbacks","Handling pressure","Using feedback",
               "Your 30–60–90 day development plan","What this report can and cannot tell you",
               "How the response indexes are calculated","Why the numbers need careful interpretation"]:
    if phrase not in text:
        issues.append(f"Missing expected content: {phrase}")
if body_sizes["11pt"] < body_sizes["other"]*1.5:
    issues.append(f"Too much inconsistent body text: {dict(body_sizes)}")
print(f"PDF QA: pages={len(pdf)}, body-text spans={dict(body_sizes)}, issues={len(issues)}")
for issue in issues:
    print("FAIL:",issue)
if issues: sys.exit(1)
print("PASS: core text, pagination, type consistency and bounds")
