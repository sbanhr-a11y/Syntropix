#!/usr/bin/env python3
"""Compile canonical assessment data from the frozen historical source.
Only instrument/report data is emitted; commerce, UI and legacy runtime are excluded.
"""
from __future__ import annotations
import argparse,hashlib,re
from pathlib import Path
MARKERS=("const assessmentBank =","let assessmentBank =","var assessmentBank =")
DATA_DEPENDENCIES=('MEI_ARCHETYPES','MEI_DIMENSION_DATA','MEI_PHASES')
def scan_bank(text):
    hits=[(text.find(m),m) for m in MARKERS if text.find(m)>=0]
    if not hits:raise ValueError('assessmentBank declaration not found')
    pos,m=min(hits);start=text.find('{',pos+len(m));depth=0;quote=None;esc=line=block=False;i=start
    while i<len(text):
        c=text[i];n=text[i+1] if i+1<len(text) else ''
        if line:
            if c=='\n':line=False
        elif block:
            if c=='*' and n=='/':block=False;i+=1
        elif quote:
            if esc:esc=False
            elif c=='\\':esc=True
            elif c==quote:quote=None
        else:
            if c=='/' and n=='/':line=True;i+=1
            elif c=='/' and n=='*':block=True;i+=1
            elif c in "'\"`":quote=c
            elif c=='{':depth+=1
            elif c=='}':
                depth-=1
                if depth==0:return text[start:i+1]
        i+=1
    raise ValueError('assessmentBank closing brace not found')
def declaration(text,name):
    m=re.search(r'\bconst\s+'+re.escape(name)+r'\s*=\s*',text)
    if not m:raise ValueError('required assessment data missing: '+name)
    start=m.end();i=start;stack=[];quote=None;esc=line=block=False;pairs={'}':'{',']':'[',')':'('}
    while i<len(text):
        c=text[i];n=text[i+1] if i+1<len(text) else ''
        if line:
            if c=='\n':line=False
        elif block:
            if c=='*' and n=='/':block=False;i+=1
        elif quote:
            if esc:esc=False
            elif c=='\\':esc=True
            elif c==quote:quote=None
        else:
            if c=='/' and n=='/':line=True;i+=1
            elif c=='/' and n=='*':block=True;i+=1
            elif c in "'\"`":quote=c
            elif c in '{[(':stack.append(c)
            elif c in '}])' and stack and stack[-1]==pairs[c]:stack.pop()
            elif c==';' and not stack:return (m.start(),'const '+name+' = '+text[start:i].strip()+';')
        i+=1
    raise ValueError('unterminated declaration '+name)
def main():
    p=argparse.ArgumentParser();p.add_argument('--source',default='index.html');p.add_argument('--output',default='assessment-registry-v3.js');a=p.parse_args();text=Path(a.source).read_text(encoding='utf-8');bank=scan_bank(text)
    deps=[d for _,d in sorted((declaration(text,n) for n in DATA_DEPENDENCIES),key=lambda x:x[0])];payload='\n'.join(deps)+bank;digest=hashlib.sha256(payload.encode()).hexdigest()
    out=("/* GENERATED CANONICAL ASSESSMENT REGISTRY — data only.\n * source-sha256:"+digest+" */\n(function(g){'use strict';\n"+'\n'.join(deps)+"\nconst bank="+bank+";Object.freeze(bank);g.SyntropixAssessmentRegistryV3=Object.freeze({version:'3.0.0',sourceHash:'"+digest+"',bank});})(window);\n")
    Path(a.output).write_text(out,encoding='utf-8');print(f'canonical registry: {len(bank)} bank bytes, {len(deps)} data dependencies, sha256={digest}')
if __name__=='__main__':main()
