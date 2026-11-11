#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
REF="$ROOT/.agent-references"
CODEX_SKILLS="$HOME/.codex/skills"
CLAUDE_SKILLS="$HOME/.claude/skills"
mkdir -p "$REF" "$CODEX_SKILLS" "$CLAUDE_SKILLS"

clone_or_update() {
  local url="$1" dir="$2"
  if [[ -d "$dir/.git" ]]; then
    git -C "$dir" fetch --depth 1 origin
    git -C "$dir" reset --hard FETCH_HEAD
  else
    git clone --depth 1 "$url" "$dir"
  fi
}

clone_or_update "https://github.com/OUANZOUGUIAbdelhak/Claude-Skills.git" "$REF/Claude-Skills"
clone_or_update "https://github.com/heyparsadev/liquid-glass-skill.git" "$REF/liquid-glass-skill"

cp -R "$REF/Claude-Skills/skills/ios-app" "$CODEX_SKILLS/ios-app"
cp -R "$REF/liquid-glass-skill/skills/liquid-glass" "$CODEX_SKILLS/liquid-glass"
cp -R "$REF/Claude-Skills/skills/ios-app" "$CLAUDE_SKILLS/ios-app"
cp -R "$REF/liquid-glass-skill/skills/liquid-glass" "$CLAUDE_SKILLS/liquid-glass"

echo "Installed skills into: $CODEX_SKILLS and $CLAUDE_SKILLS"
echo "Review upstream licenses and skill files before using them. No third-party code was added to the app target."
