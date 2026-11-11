# MIGRATION AUDIT 03: COMPONENT DEPENDENCY & EQUIVALENCE MAP
## React / Next.js Component to Native SwiftUI 6 Architecture

**Audited By:** AGENT 01 — Product Reverse Engineering Agent  
**Date:** 2026-11-11  

---

### 1. Reusable Primitive & Molecule Mapping

| React / Tailwind Component | React Implementation Location | Props / Behavior | Native SwiftUI Component | SwiftUI Modifiers / Architecture |
|---|---|---|---|---|
| `<Button />` | `apps/web/components/ui/button.tsx` | `variant: 'primary' \| 'secondary' \| 'destructive' \| 'outline'`, `size`, `loading` | `AppButton` (`Core/DesignSystem`) | `Button(action:)` with `AppButtonStyle`, `.glass` / `.glassProminent` button styles, `.sensoryFeedback(.impact)` |
| `<Input />` | `apps/web/components/ui/input.tsx` | `value`, `onChangeText`, `label`, `error`, `secureTextEntry` | `AppTextField` (`Core/DesignSystem`) | `TextField` / `SecureField` with dynamic focus ring, floating caption, clear button |
| `<Card />` | `apps/web/components/ui/card.tsx` | `children`, `className`, `padding`, `elevated` | `AppCard` (`Core/DesignSystem`) | `VStack` inside `.background(.regularMaterial, in: RoundedRectangle(cornerRadius: 20))` |
| `<Badge />` | `apps/web/components/ui/badge.tsx` | `variant: 'success' \| 'warning' \| 'error' \| 'info'`, `label` | `StatusBadge` (`Core/DesignSystem`) | `HStack` with pulsing indicator dot and tinted stroke border |
| `<Modal />` / `<Dialog />` | `apps/web/components/ui/dialog.tsx` | `open`, `onClose`, `title`, `content` | `.sheet()` / `.fullScreenCover()` | Native iOS modal presentation with dynamic detents (`.presentationDetents([.medium, .large])`) |
| `<TabBar />` | `apps/mobile/app/(guard)/_layout.tsx` | 5 navigation tabs, icons, active tab tint | `TabView` / Custom Liquid Glass Bar | Native iOS 26 `TabView` with floating glass pill container (`GlassEffectContainer`) |
| `<CameraView />` | `apps/mobile/app/(guard)/verify/camera.tsx` | `facing`, `torch`, `onPictureTaken`, `reticle` | `CameraCaptureView` | `AVCaptureSession` coordinator with SwiftUI overlay reticle and haptic feedback |
| `<ProgressRing />` | `apps/mobile/components/ProgressRing.tsx` | `progress: 0..100`, `strokeWidth`, `animated` | `ProgressRing` (`Core/DesignSystem`) | `Circle().trim(from: 0, to: progress).stroke(AngularGradient)` with `.animation(.snappy)` |
| `<EmptyState />` | `apps/web/components/EmptyState.tsx` | `title`, `subtitle`, `actionLabel`, `onAction` | `EmptyStateView` (`Core/DesignSystem`) | Vertical stack with SF Symbol icon in `.quaternary` container and primary action button |
| `<LoadingSpinner />`| `apps/web/components/LoadingSpinner.tsx` | `size`, `message` | `LoadingView` (`Core/DesignSystem`) | `ProgressView()` with monospaced progress text and blurred backdrop |

---

### 2. State & Hook Equivalents

| React / Web Hook | React Purpose | Swift 6 / SwiftUI Equivalent |
|---|---|---|
| `useState<T>(initial)` | Local mutable view state | `@State private var property: T` |
| `useEffect(() => { ... }, [deps])` | Side effects on mount/change | `.task(id: deps) { await ... }` / `.onChange(of: deps)` |
| `useContext(AuthContext)` | Global authentication state | `@Environment(AppState.self)` / Shared Observable Model |
| `useRef<T>()` | Retained reference across renders | `@State` or actor-isolated storage |
| `useMemo(() => ..., [deps])` | Cached computation | Computed property or cached view model field |
| `useCallback(fn, [deps])` | Stable function reference | Swift member method (natively stable) |
| `useRouter()` | Programmatic navigation | `NavigationPath` with `NavigationStack` / `navigationDestination` |
| `useQuery()` (TanStack) | Remote data fetching & caching | `ViewModel.load()` with async/await and actor repository |
| `useForm()` (React Hook Form) | Form input validation & errors | `@Observable` Form ViewModel with validation rules |

---

### 3. Component Hierarchy & Composition

```
RootContentView (App Routing & Tab Coordinator)
├── OnboardingView (Presented if first launch)
├── LoginView (Presented when unauthenticated)
└── TabView (Presented when authenticated)
    ├── Tab 1: VerifyHomeView
    │   ├── ViewfinderCard (AppCard)
    │   ├── ActiveStationStatusRow (AppCard)
    │   └── FullScreenCover: CameraCaptureView
    │       ├── TargetReticleView
    │       ├── Navigation: ReviewCaptureView
    │       ├── Navigation: ProcessingView
    │       ├── Navigation: VerificationResultView
    │       └── Navigation: RecordDecisionView (Crypto HMACSigned)
    ├── Tab 2: VisitorViews (VisitorListView)
    │   ├── VisitorSearchBar (AppTextField)
    │   ├── VisitorStatusFilterPills (GlassControl)
    │   ├── VisitorList (LazyVStack with AppCard rows)
    │   └── Sheet: VisitorIntakeView (Registration Form)
    ├── Tab 3: ActivityFeedView
    │   ├── SearchAndOutcomeFilterBar
    │   └── ActivityList (LazyVStack with EventTimelineRows)
    ├── Tab 4: GuardProfileView
    │   ├── OfficerCredentialCard
    │   ├── HardwareDiagnosticsCard
    │   └── SopAssistantCard (Query input + AI Guidance)
    └── Tab 5: AdminDashboardView (Elevated Super-Admin role)
        ├── KpiMetricTiles (LazyVGrid)
        ├── PhysicalGateRelaysList
        └── EmergencyLockdownOverrideAction
```
