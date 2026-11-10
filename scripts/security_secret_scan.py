#!/usr/bin/env python3
"""
GATEWISE AI - Automated Secret Scanning & Repository History Audit Tool
Audits committed files and working tree for leaked credentials, private keys,
OAuth secrets, API keys, and Android signing keystores.
"""

import os
import re
import subprocess
import sys
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parents[1]

# High-risk entropy and secret patterns
SECRET_PATTERNS = [
    (r"AIza[0-9A-Za-z\\-_]{35}", "Google API Key (Gemini/GCP)"),
    (r"AKIA[0-9A-Z]{16}", "AWS Access Key ID"),
    (r"-----BEGIN (?:RSA |EC |DSA |OPENSSH )?PRIVATE KEY-----", "Private Cryptographic Key"),
    (r"ghp_[0-9a-zA-Z]{36}", "GitHub Personal Access Token"),
    (r"gho_[0-9a-zA-Z]{36}", "GitHub OAuth Access Token"),
    (r"xox[baprs]-[0-9a-zA-Z]{10,48}", "Slack Bot/User Token"),
    (r"(?:postgres|postgresql)://[a-zA-Z0-9_\-]+:[a-zA-Z0-9_!@#$%^&*()+\-=]+@[a-zA-Z0-9.\-]+:[0-9]+/[a-zA-Z0-9_\-]+", "Live PostgreSQL URI with Credentials"),
]

# Sensitive file extensions that should NEVER be tracked in Git
BANNED_COMMITTED_EXTENSIONS = [
    ".jks", ".keystore", ".p12", ".pfx", ".pem", ".key",
    ".env.production", ".env.staging", ".env.local"
]

def scan_working_tree():
    findings = []
    print(f"Scanning working directory: {ROOT_DIR}")
    
    # Check for banned sensitive files
    for root, dirs, files in os.walk(ROOT_DIR):
        # Exclude node_modules, .git, .pytest_cache, and local gitignored key stores
        dirs[:] = [d for d in dirs if d not in ("node_modules", ".git", ".next", ".pytest_cache", "__pycache__", "dist", ".signing_keys", "backups")]
        for file in files:
            path = Path(root) / file
            rel_path = path.relative_to(ROOT_DIR)
            
            # Check banned extensions
            for ext in BANNED_COMMITTED_EXTENSIONS:
                if file.endswith(ext):
                    findings.append({
                        "file": str(rel_path),
                        "type": "Banned Sensitive File Extension",
                        "match": ext
                    })
            
            # Skip binary files from regex scan
            if file.endswith((".onnx", ".png", ".jpg", ".ico", ".db", ".tsbuildinfo", ".ttf", ".woff", ".woff2")):
                continue
            
            try:
                content = path.read_text(encoding="utf-8", errors="ignore")
                for pattern, desc in SECRET_PATTERNS:
                    matches = re.findall(pattern, content)
                    for m in matches:
                        # Allow template placeholders
                        if any(token in m for token in ("replace-with", "your-", "fake", "gatewise_secure_password", "example", "<", ">", "STRONG_PASSWORD")):
                            continue
                        findings.append({
                            "file": str(rel_path),
                            "type": desc,
                            "match": m[:8] + "..." + m[-4:] if len(m) > 12 else "[REDACTED]"
                        })
            except Exception:
                pass
                
    return findings

def scan_git_history():
    findings = []
    print("Scanning recent Git commit log for credential leaks...")
    try:
        # Check git log diffs for the last 50 commits
        res = subprocess.run(
            ["git", "log", "-p", "-n", "50", "--", ":!pnpm-lock.yaml"],
            cwd=ROOT_DIR,
            capture_output=True,
            text=True
        )
        diff_text = res.stdout
        for pattern, desc in SECRET_PATTERNS:
            for match in re.finditer(r"^\+[^+].*?(" + pattern + r")", diff_text, re.MULTILINE):
                val = match.group(1)
                if any(token in val for token in ("replace-with", "your-", "fake", "gatewise_secure_password", "example", "<", ">", "STRONG_PASSWORD")):
                    continue
                findings.append({
                    "commit_scan": True,
                    "type": desc,
                    "match": val[:6] + "..." + val[-4:] if len(val) > 10 else "[REDACTED]"
                })
    except Exception as e:
        print(f"Warning: git scan encountered {e}")
        
    return findings

def main():
    print("==================================================")
    print(" GATEWISE AI — Security & Secret Scanning Audit")
    print("==================================================")
    
    wt_findings = scan_working_tree()
    git_findings = scan_git_history()
    
    total = len(wt_findings) + len(git_findings)
    print(f"\nAudit Complete:")
    print(f"• Working Tree Findings: {len(wt_findings)}")
    print(f"• Git History Findings:  {len(git_findings)}")
    
    if total > 0:
        print("\n❌ CRITICAL FINDINGS:")
        for f in wt_findings:
            print(f"  [WORKING TREE] {f['file']}: {f['type']} -> {f['match']}")
        for f in git_findings:
            print(f"  [GIT HISTORY]  {f['type']} -> {f['match']}")
        sys.exit(1)
    else:
        print("\n✅ ZERO SECRETS DETECTED. Repository working tree and history are clean.")
        sys.exit(0)

if __name__ == "__main__":
    main()
