# Project agents

These TOML files define specialist Codex agents. The lead agent should first run the four read-only discovery agents in parallel, then freeze contracts, then delegate implementation to agents with disjoint file ownership.

Available agents:
- `react_auditor`
- `supabase_auditor`
- `design_researcher`
- `security_reviewer`
- `ios_architect`
- `design_system_builder`
- `supabase_integrator`
- `feature_implementer` (spawn one per independent feature)
- `qa_engineer`
- `integration_reviewer`
