from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlparse
import re,sys
ROOT=Path(".")
ALLOW_PREFIX=("/api/","mailto:","tel:","javascript:")
class P(HTMLParser):
    def __init__(self): super().__init__(); self.refs=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        for k in ("href","src"):
            if k in a: self.refs.append((tag,k,a[k]))
errors=[]
htmls=list(ROOT.glob("*.html"))+list(ROOT.glob("*/*.html"))
for path in htmls:
    text=path.read_text("utf-8",errors="ignore")
    p=P()
    try:p.feed(text)
    except Exception as e: errors.append(f"{path}: parse error {e}");continue
    if not re.search(r"<title>.+?</title>",text,re.I|re.S): errors.append(f"{path}: missing title")
    for tag,k,ref in p.refs:
        if not ref or ref.startswith(("#","http://","https://","data:")) or ref.startswith(ALLOW_PREFIX): continue
        u=urlparse(ref).path
        if not u or "{" in u: continue
        target=(ROOT/u.lstrip("/")) if u.startswith("/") else (path.parent/u)
        if u.endswith("/"): target=target/"index.html"
        if not target.exists():
            errors.append(f"{path}: broken {k}={ref}")
# V6 public acquisition contract
for p in ["index.html","solutions.html","enterprise.html","professionals.html","assessment-intelligence.html","manager-development.html","prism360.html","talent-solutions.html","compliance-learning.html","employee-experience.html","professional-coaching.html","science.html","trust.html","pricing.html","privacy.html","terms.html","refund-cancellation.html"]:
    if not (ROOT/p).exists(): errors.append(f"missing required page: {p}")
if errors:
    print("\n".join(errors));sys.exit(1)
print(f"V6 static audit passed: {len(htmls)} HTML files checked")
