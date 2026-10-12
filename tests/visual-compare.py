from pathlib import Path
from PIL import Image, ImageChops
import json
from datetime import datetime, timezone
root=Path("evidence")
a=root/"screenshot-0"; b=root/"screenshot-1"
out=Path("visual-diff"); out.mkdir(exist_ok=True)
results=[]
for src in sorted(a.rglob("*.png")):
    rel=src.relative_to(a)
    tgt=b/rel
    if not tgt.exists():
        results.append({"file":str(rel),"status":"missing_after"}); continue
    with Image.open(src) as im1, Image.open(tgt) as im2:
        x,y=im1.convert("RGB"),im2.convert("RGB")
        if x.size!=y.size:
            results.append({"file":str(rel),"status":"dimension_change","before":x.size,"after":y.size})
            continue
        from PIL import ImageStat
        diff=ImageChops.difference(x,y)
        bounds=diff.getbbox()
        if bounds:
            hist=diff.convert("L").histogram()
            changed=sum(hist[10:])
            ratio=round(changed/(x.width*x.height),6)
            diff.save(out/rel.name)
        else: ratio=0
        results.append({"file":str(rel),"status":"compared","changed_fraction_over_10":ratio,"width":x.width,"height":x.height})
with open(out/"comparison.json","w") as fh: json.dump({"generated_utc":datetime.now(timezone.utc).isoformat(),"results":results},fh,indent=2)
unexpected=[r for r in results if r["status"]!="compared" or (r.get("changed_fraction_over_10",0)>0.001 and "professionals" not in r["file"] and "employee_experience" not in r["file"])]
print(json.dumps({"compared":len(results),"unexpected":unexpected[:30],"changes":[r for r in results if r.get("changed_fraction_over_10",0)>0.001]},indent=2))
if unexpected: raise SystemExit("Unexpected visual drift or screenshot size mismatch: manual review required")
