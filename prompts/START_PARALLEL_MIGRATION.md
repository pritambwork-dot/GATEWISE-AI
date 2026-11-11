# Kickoff prompt — run the migration with parallel agents

You are the Lead Orchestrator for this repository. Read `AGENTS.md` and `docs/PARALLEL_EXECUTION_PLAN.md` first.

The goal is to migrate this existing React/Next.js + Supabase product to a fully native SwiftUI app targeting iOS 26. Preserve the existing React app and backend behaviour.

**Do not just propose agents. Use the available multi-agent/subagent tools to spawn the specialist agents and run independent tasks concurrently.** If this runtime does not expose subagent tools, stop and clearly report that limitation; do not pretend that multiple agents are running. In that case, execute the same workstreams sequentially and retain the same ownership rules.

## Round 1 — spawn four agents simultaneously

1. `react_auditor`: read-only complete React/Next.js inventory. Output `migration/reports/react-audit.md`.
2. `supabase_auditor`: read-only schema/auth/RLS/Realtime/Storage/Edge Function inventory. Output `migration/reports/supabase-audit.md`. Never reveal secret values.
3. `design_researcher`: inspect current UI and available assets, read the `ios-app` and `liquid-glass` skills if installed, inspect the selected Liquid Glass examples, and recommend a native iOS 26 design system. Output `migration/reports/design-research.md`.
4. `security_reviewer`: inspect client/server trust boundaries, OAuth callback risks, Keychain/session handling, RLS assumptions, secret exposure and local storage. Output `migration/reports/security-review.md`.

All four tasks are independent and READ-ONLY against product source. Start them concurrently, then do useful non-overlapping work: inspect the repository root, Git status, existing tests and Xcode availability. Wait for all four reports before freezing architecture contracts.

## Round 2 — synthesize contracts

The lead reads all reports, reconciles conflicts and creates the six contract files listed in `AGENTS.md`. Label every unknown. Do not fabricate features, table names or endpoint behaviour.

## Round 3 — spawn implementation workers

After contracts are approved, run these concurrently with disjoint ownership:

- Architect: `NativeApp/App/` and `NativeApp/Domain/`.
- Design-system builder: `NativeApp/Core/DesignSystem/`.
- Supabase integrator: `NativeApp/Core/Supabase/` and `NativeApp/Data/`.
- QA engineer: `NativeApp/Tests/` plus acceptance test specifications.

When the feature inventory is ready, spawn one feature implementer per independent feature. Each must receive a feature-specific acceptance contract and exclusive ownership of `NativeApp/Features/<FeatureName>/`. Do not have two agents edit a shared file.

## Round 4 — integrate and verify

The lead owns cross-feature wiring and project configuration. Review all diffs before merging. Build the app, run tests, launch a single coordinated iOS 26 simulator session, capture screenshots and fix defects. Ask the QA/security agents to review independently.

## Reporting

Maintain `migration/09_MIGRATION_TRACKER.md` with each feature marked `not started`, `in progress`, `blocked`, `implemented`, or `verified`. Every status change must include evidence. Do not mark a feature verified merely because code was generated.

At the end, report the agents actually spawned, the tasks completed by each, files changed, build/test results, unimplemented features and blockers. Never claim work was performed when it was not.
