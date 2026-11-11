# Parallel execution plan

## Work breakdown

| Workstream | Initial mode | Write ownership | Dependency |
|---|---|---|---|
| React source audit | Parallel, read-only | `migration/reports/react-audit.md` | None |
| Supabase audit | Parallel, read-only | `migration/reports/supabase-audit.md` | None |
| UI/design research | Parallel, read-only | `migration/reports/design-research.md` | None |
| Security review | Parallel, read-only | `migration/reports/security-review.md` | None |
| Architecture | After discovery | `NativeApp/App/`, `NativeApp/Domain/` | Contracts frozen |
| Design system | After discovery; can run with architecture | `NativeApp/Core/DesignSystem/` | Design tokens agreed |
| Supabase integration | After API/schema contract | `NativeApp/Core/Supabase/`, `NativeApp/Data/` | Backend contract frozen |
| Feature migration | Parallel by feature | One `NativeApp/Features/<Feature>/` directory per agent | Domain/API/design contracts frozen |
| QA | Test design can run in parallel; execution follows builds | `NativeApp/Tests/`, `migration/qa/` | Acceptance criteria; executable build for integration tests |
| Integration/release | Sequential lead responsibility | Project composition and release config | All feature branches ready |

## Parallel rounds

### Round 1: discovery fan-out

Run four read-only agents concurrently. They must not edit application source. The lead reviews and merges their facts into a single feature map.

### Round 2: contract and scaffold

Lead freezes models, endpoint contracts, auth/session approach, navigation model, design tokens and folder ownership. Architect creates the app skeleton. Design-system work can begin once the token direction is approved.

### Round 3: implementation fan-out

Run backend, design system and independent feature modules concurrently only after contracts are stable. Feature agents each own separate folders. If two features share a file, the lead owns that shared file or creates a separate shared component contract first.

### Round 4: verification fan-out

Run independent unit-test groups, static review and security review concurrently. Simulator integration tests should be coordinated to avoid multiple agents controlling the same simulator at once. Assign one simulator operator.

### Round 5: integration

Lead reviews diffs, resolves integration conflicts, merges branches/worktrees, runs the complete build/test suite and inspects simulator screenshots.

## File ownership rules

- One active writer per file.
- Do not let several agents edit `AppCoordinator.swift`, shared models, project configuration, package manifests or the same feature screen.
- Do not change Supabase schema while feature agents are coding unless the migration is reviewed and communicated.
- Keep product-source changes on feature branches when worktrees are available.
- Never use force-push or destructive Git operations as an automatic conflict-resolution strategy.

## Concurrency recommendation

Start with four discovery agents concurrently. During implementation, use up to five or six workers only when each has a distinct scope. More agents are not automatically faster; merge conflicts, context handoffs and shared simulator use can reduce throughput.
