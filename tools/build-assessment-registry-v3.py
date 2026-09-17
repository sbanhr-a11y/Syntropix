#!/usr/bin/env python3
"""Compile the canonical assessment registry from the frozen historical bank.

One-time migration compiler: instrument definitions are copied byte-for-byte;
legacy UI, navigation, checkout and report code are never emitted.
"""
from __future__ import annotations
import argparse, hashlib
from pathlib import Path
MARKERS=("const assessmentBank =","let assessmentBank =","var assessmentBank =")
def find_start(text):
    hits=[(text.find(m),m) for m in MARKERS if text.find(m)>=0]
    if not hits: raise ValueError('assessmentBank declaration not found')
    pos,marker=min(hits); brace=text.find('{',pos+len(marker))
    if brace<0: raise ValueError('assessmentBank opening brace not found')
    return brace
def scan(text,start):
    depth=0; quote=None; escaped=False; line=False; block=False; i=start
    while i<len(text):
        ch=text[i]; nxt=text[i+1] if i+1<len(text) else ''
        if line:
            if ch=='\n': line=False
        elif block:
            if ch=='*' and nxt=='/': block=False; i+=1
        elif quote:
            if escaped: escaped=False
            elif ch=='\\': escaped=True
            elif ch==quote: quote=None
        else:
            if ch=='/' and nxt=='/': line=True; i+=1
            elif ch=='/' and nxt=='*': block=True; i+=1
            elif ch in ("'",'"','`'): quote=ch
            elif ch=='{': depth+=1
            elif ch=='}':
                depth-=1
                if depth==0:return text[start:i+1]
                if depth<0:raise ValueError('assessmentBank brace underflow')
        i+=1
    raise ValueError('assessmentBank closing brace not found')
def main():
    p=argparse.ArgumentParser();p.add_argument('--source',default='index.html');p.add_argument('--output',default='assessment-registry-v3.js');a=p.parse_args()
    text=Path(a.source).read_text(encoding='utf-8');obj=scan(text,find_start(text));digest=hashlib.sha256(obj.encode()).hexdigest()
    out=("/* GENERATED CANONICAL ASSESSMENT REGISTRY. Instrument definitions migrated byte-for-byte.\n"
         f" * source-sha256:{digest} */\n(function(g){{'use strict';const bank="+obj+";Object.freeze(bank);g.SyntropixAssessmentRegistryV3=Object.freeze({version:'3.0.0',sourceHash:'"+digest+"',bank});})(window);\n")
    Path(a.output).write_text(out,encoding='utf-8');print(f'canonical registry: {len(obj)} bytes sha256={digest}')
if __name__=='__main__':main()
