#!/usr/bin/env python3
"""Build the canonical browser registry from the frozen legacy assessmentBank.

This is a migration compiler, not a runtime compatibility layer. It copies the
instrument definitions byte-for-byte from the historical source, records a
SHA-256 fingerprint, and emits the only data dependency used by runtime-v3.
The generated registry contains no legacy UI, navigation, checkout or report
code.
"""
from __future__ import annotations
import argparse, hashlib
from pathlib import Path
from extract_assessment_bank import find_object_start, scan_object


def main() -> None:
    p=argparse.ArgumentParser()
    p.add_argument('--source',default='index.html')
    p.add_argument('--output',default='assessment-registry-v3.js')
    args=p.parse_args()
    text=Path(args.source).read_text(encoding='utf-8')
    obj=scan_object(text,find_object_start(text))
    digest=hashlib.sha256(obj.encode('utf-8')).hexdigest()
    banner=("/* GENERATED CANONICAL ASSESSMENT REGISTRY.\n"
            " * Instrument definitions migrated byte-for-byte from the frozen historical bank.\n"
            " * No legacy UI/runtime/payment/navigation code is included.\n"
            f" * source-sha256:{digest}\n */\n")
    out=(banner+"(function(g){'use strict';const bank="+obj+";"
         "Object.freeze(bank);g.SyntropixAssessmentRegistryV3=Object.freeze({version:'3.0.0',sourceHash:'"+digest+"',bank});})(window);\n")
    Path(args.output).write_text(out,encoding='utf-8')
    print(f'canonical registry: {len(obj)} bytes sha256={digest}')

if __name__=='__main__': main()
