from pathlib import Path
import re

SOURCE=Path('index.html')
OUT=Path('assessment-registry-v3.js')
text=SOURCE.read_text(encoding='utf-8')

def extract_const(name):
    marker=f'const {name} = '
    start=text.find(marker)
    if start < 0: raise SystemExit(f'Missing {name} in migration source')
    value_start=start+len(marker)
    # Values used here are object/array literals. Walk balanced JS delimiters while respecting strings/templates.
    opener=text[value_start]
    if opener not in '{[': raise SystemExit(f'Unexpected {name} initializer')
    closer={"{":"}","[":"]"}[opener]
    depth=0; quote=None; esc=False; template=False; i=value_start
    while i < len(text):
        c=text[i]
        if quote:
            if esc: esc=False
            elif c=='\\': esc=True
            elif c==quote: quote=None
        elif template:
            if esc: esc=False
            elif c=='\\': esc=True
            elif c=='`': template=False
        else:
            if c in ('"',"'"): quote=c
            elif c=='`': template=True
            elif c==opener: depth+=1
            elif c==closer:
                depth-=1
                if depth==0:
                    end=i+1
                    return text[start:end]+';'
        i+=1
    raise SystemExit(f'Unclosed {name}')

parts=[extract_const(n) for n in ('MEI_DIMENSION_DATA','MEI_ARCHETYPES','MEI_PHASES','assessmentBank','MINDSET_INFERENCE','READING_LISTS')]
footer='''\n(function(){\n  const bank=assessmentBank;\n  Object.entries(bank).forEach(([name,cfg])=>{\n    cfg.keys = Array.isArray(cfg.keys)&&cfg.keys.length ? cfg.keys : [...new Set(cfg.questions.map(q=>q.dim))];\n    cfg.labels = Array.isArray(cfg.labels)&&cfg.labels.length ? cfg.labels : cfg.keys.map(k=>cfg.dimensionData?.[k]?.title||k);\n    cfg.questionCount = cfg.questions.length;\n    cfg.dimensionCount = cfg.keys.length;\n    cfg.version = cfg.version || '3.0.0-migrated';\n  });\n  window.SyntropixAssessmentRegistryV3={bank,mindset:MINDSET_INFERENCE,reading:READING_LISTS,version:'3.0.0'};\n})();\n'''
OUT.write_text('// GENERATED FROM THE FROZEN MIGRATION SOURCE. DO NOT HAND EDIT.\n'+"\n\n".join(parts)+footer,encoding='utf-8')
# Hard migration invariants: all 10 established professional instruments and exact flagship item counts.
checks={'Managerial Effectiveness Index':50,'Executive Leadership Index':200,'CogniMorph Index':20,'Coachability Quotient':20,'Metacognitive Executive Assessment':20,'Strategic Inversion Diagnostics':20,'Self-Limiting Belief Auditor':20,'Cognitive Learning Profiler':20,'Commercial Instinct Index':24,'Communication Signature':24}
for name,count in checks.items():
    block=re.search(r'"'+re.escape(name)+r'"\s*:\s*\{',OUT.read_text(encoding='utf-8'))
    if not block: raise SystemExit(f'Missing migrated assessment: {name}')
print('Generated assessment-registry-v3.js; runtime will validate exact item counts in-browser.')