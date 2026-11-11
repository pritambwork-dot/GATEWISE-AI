# Claude Code project subagents

These Markdown frontmatter files define project-level subagents for Claude Code. They mirror the Codex definitions in `.codex/agents/`.

Run Claude Code from the repository root, then explicitly ask it to use the four read-only discovery agents in parallel. After contracts are frozen, ask it to use the isolated implementation agents. Write-capable agents request `isolation: worktree` so their edits do not collide in a shared checkout.
