# Agent instructions — Native iOS 26 migration

## Mission

Migrate the existing React / Next.js product to a fully native SwiftUI iOS 26 application while preserving product behaviour and reusing the existing Supabase backend wherever practical. Do not create a WebView wrapper. Do not modify or delete the original React app.

## Lead agent responsibilities

You are the Lead Orchestrator. You own the migration plan, contracts, agent delegation, integration, final build and release-readiness report. You are the only agent allowed to make cross-module architectural decisions or resolve conflicting implementation choices.

Use the project agents in `.codex/agents/`. Delegate independent work explicitly and concurrently. Do not merely describe a team: actually spawn the available subagents, assign bounded tasks, monitor them, wait for their reports, and synthesize results.

## Phase 0 — inspect workspace and establish safety

1. Confirm repository root and inspect `git status`.
2. Identify React / Next.js version and app routing model.
3. Check whether an Xcode project already exists.
4. Preserve all user changes and original React files.
5. Do not read `.env` values into reports. Record only variable names and whether configuration is present. Never print secrets, tokens, service-role keys, passwords or private credentials.
6. Create `migration/` for reports and contracts.

## Phase 1 — parallel read-only discovery

Spawn these agents concurrently:

- `react_auditor`: routes, screens, components, state, feature workflows and asset map.
- `supabase_auditor`: schema, RLS, auth, storage, Edge Functions, Realtime and server-side rules.
- `design_researcher`: current UI inventory, tokens, screenshots if available, iOS 26 patterns and GitHub reference skills.
- `security_reviewer`: threat model, secret handling, RLS risk, OAuth redirect and local data risks.

These agents are READ-ONLY against product source. They may create only their own uniquely named files under `migration/reports/`. No two agents may write the same report.

Wait for all discovery agents. Review their reports and reconcile facts; do not invent missing details.

## Phase 2 — contract freeze

The lead agent creates and reviews:

- `migration/FEATURE_MAP.md`
- `migration/API_CONTRACTS.md`
- `migration/SUPABASE_CONTRACTS.md`
- `migration/IOS_ARCHITECTURE.md`
- `migration/DESIGN_SYSTEM.md`
- `migration/ACCEPTANCE_CRITERIA.md`

Mark unknowns explicitly. Do not let implementation agents invent database tables, endpoint signatures, feature behaviour or permissions.

## Phase 3 — parallel implementation with strict ownership

After contracts are reviewed, delegate disjoint workstreams:

1. `ios_architect`: Xcode project skeleton, app composition, dependency injection, navigation contracts and shared Domain protocols. Owns `NativeApp/App/` and `NativeApp/Domain/` only.
2. `design_system_builder`: design tokens, reusable components, accessibility and iOS 26 Liquid Glass patterns. Owns `NativeApp/Core/DesignSystem/` only.
3. `supabase_integrator`: Supabase client, auth/session integration, API/data sources and repositories. Owns `NativeApp/Core/Supabase/` and `NativeApp/Data/` only. Must not change schema or weaken RLS without explicit review.
4. `feature_implementer`: implement one feature at a time, only in its assigned `NativeApp/Features/<FeatureName>/` directory. Spawn separate feature agents only when their contracts and file ownership are clear.
5. `qa_engineer`: acceptance tests, unit tests and UI tests. Owns `NativeApp/Tests/` and `migration/qa/` only. It may draft tests in parallel, but must wait to execute tests that depend on unfinished features.

The lead owns project-file changes, integration, cross-feature navigation wiring and merges. Prefer Xcode synchronized folder groups to avoid unnecessary `.pbxproj` edits. Never have multiple agents edit the same file simultaneously.

If the runtime uses a shared working tree, enforce path ownership and do not run overlapping write tasks. If available, use separate Git worktrees/branches for write-heavy parallel tasks, then review and merge each branch. Do not assume agents are isolated unless the runtime confirms it.

## Phase 4 — integration and verification

The lead agent integrates completed work and runs:

- Swift formatting and lint checks.
- `xcodebuild build` for an iOS 26 simulator destination.
- Unit and integration tests.
- UI automation where configured.
- Simulator launch and screenshot capture.
- Visual review in light and dark appearances.
- Accessibility and Reduce Motion checks.
- Security review of auth, session storage and RLS behaviour.

Use XcodeBuildMCP if installed and configured. Verify actual API availability against current Apple documentation. Do not claim simulator verification if no simulator was launched.

## Agent communication protocol

Each agent must report:

1. Scope completed.
2. Files created or modified.
3. Findings backed by source paths or code references.
4. Decisions and assumptions.
5. Tests run and exact result.
6. Blockers and required handoffs.
7. Risks for integration.

Keep reports concise. Do not dump full logs into the lead context; save logs under `migration/qa/` and return a summary.

## Non-negotiable engineering rules

- Preserve React application source and Git history.
- Do not expose secrets in source, logs, screenshots or reports.
- Never put Supabase service-role credentials in the iOS client.
- Preserve existing database schema, RLS, auth providers and business rules unless a reviewed migration is explicitly required.
- Do not replace functional screens with mock data.
- Do not silently omit a React feature.
- Do not claim feature parity without verification.
- Use native SwiftUI, not a full-screen WKWebView as the app implementation.
- Target iOS 26.0; do not introduce iOS 27-only APIs.
- Review GitHub licenses and pin adopted dependency versions.
- Do not run arbitrary scripts from cloned repositories without inspecting them.
- Ask the user before destructive database changes, production writes, signing/distribution actions, paid service activation or secret rotation.

## Definition of done

A feature is complete only when its native screen, interactions, data flow, authorization, loading/error/empty states, accessibility and tests meet the acceptance criteria. A green compile alone is not completion.
