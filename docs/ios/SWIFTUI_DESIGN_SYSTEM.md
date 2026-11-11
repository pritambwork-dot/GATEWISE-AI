# GATEWISE AI — iOS 26 SwiftUI Design System
## Daylight Institutional Aesthetics · Native Liquid Glass · SF Symbols · Dynamic Type

### 1. Design System Philosophy
The GATEWISE iOS Design System combines **Daylight Institutional Elegance** with native iOS 26 system craftsmanship. It honors the existing GATEWISE brand identity (fresh forest greens, soft sage tints, and crisp white card surfaces) while embracing modern SwiftUI visual expressions:

- **Restrained Liquid Glass:** Targeted use of `.ultraThinMaterial` and frosted translucent capsules for floating control bars and telemetry pills without over-saturating the interface.
- **System SF Symbols:** Every icon utilizes high-legibility SF Symbols with optical weights and hierarchical color rendering.
- **Dynamic Type & High Contrast:** Full support for system text scaling and high outdoor contrast.
- **Tactile Haptic Feedback:** Coordinated haptic impulses for shutter release, biometric verification confirmations, and navigation steps.

---

### 2. Color Palette & Semantic Tints

```swift
public struct GatewiseColors {
    // Daylight Canvas
    public static let background = Color(hex: 0xF4F8F5)
    public static let surface = Color(hex: 0xFFFFFF)
    public static let surfaceSecondary = Color(hex: 0xEDF4EF)
    
    // Brand Greens
    public static let primary = Color(hex: 0x23865D)
    public static let deep = Color(hex: 0x176346)
    public static let lightGreen = Color(hex: 0xDDF0E2)
    public static let mint = Color(hex: 0xC7E7D8)
    public static let teal = Color(hex: 0x3A9B8B)
    
    // Text Shades
    public static let textPrimary = Color(hex: 0x1E2D26)
    public static let textSecondary = Color(hex: 0x65756C)
    public static let textMuted = Color(hex: 0x95A39A)
    
    // Status
    public static let success = Color(hex: 0x26865E)
    public static let warning = Color(hex: 0xCF983E)
    public static let error = Color(hex: 0xC85B57)
    public static let info = Color(hex: 0x3A9B8B)
    
    // Borders
    public static let borderSubtle = Color(hex: 0xE2EBE4)
    public static let borderMedium = Color(hex: 0xC8D9CD)
}
```

---

### 3. Typography Hierarchy

| Style Token | SwiftUI Font | Weight | Design Intent |
| :--- | :--- | :--- | :--- |
| `displayTitle` | `.system(size: 26, weight: .bold)` | Bold | Onboarding headlines, splash branding |
| `sectionTitle` | `.system(size: 20, weight: .bold)` | Bold | Screen titles, candidate names |
| `cardTitle` | `.system(size: 16, weight: .semibold)`| SemiBold| Card headings, modal titles |
| `headline` | `.system(size: 15, weight: .bold)` | Bold | Action button labels |
| `body` | `.system(size: 14, weight: .regular)` | Regular | Paragraph copy, instructions |
| `bodyMedium` | `.system(size: 14, weight: .medium)` | Medium | Checklist items, metadata |
| `caption` | `.system(size: 12, weight: .regular)` | Regular | Subtitles, input hints |
| `captionBold` | `.system(size: 12, weight: .bold)` | Bold | Telemetry values, timestamps |
| `badge` | `.system(size: 11, weight: .heavy)` | Heavy | Category tags, step counters |
| `monospace` | `.system(size: 11, weight: .medium, design: .monospaced)` | Medium | Cryptographic signatures |

---

### 4. SF Symbols System Directory

```swift
public struct GatewiseIcons {
    public static let shield = "shield.checkmark.fill"
    public static let station = "building.2.fill"
    public static let camera = "camera.fill"
    public static let cameraFlip = "camera.rotate.fill"
    public static let torchOn = "flashlight.on.fill"
    public static let torchOff = "flashlight.off.fill"
    public static let reticle = "viewfinder"
    public static let biometric = "person.badge.shield.checkmark.fill"
    public static let check = "checkmark.circle.fill"
    public static let warning = "exclamationmark.triangle.fill"
    public static let denied = "xmark.octagon.fill"
    public static let lock = "lock.fill"
    public static let seal = "checkmark.seal.fill"
    public static let visitors = "person.2.fill"
    public static let activity = "clock.arrow.circlepath"
    public static let profile = "person.crop.circle.fill"
    public static let sopAssistant = "bubble.left.and.bubble.right.fill"
    public static let diagnostics = "cpu.fill"
    public static let search = "magnifyingglass"
    public static let filter = "line.3.horizontal.decrease.circle"
}
```

---

### 5. Reusable Component Suite

#### 5.1 `GatewisePrimaryButton`
- **Features:** 50pt touch height, rounded capsule geometry, subtle drop shadow, optional SF Symbol, inlined progress spinner during async loading states, and haptic impact on tap.

#### 5.2 `GatewiseCard`
- **Features:** Native `.background(.regularMaterial)` or pure white card surface with subtle 1pt border (`GatewiseColors.borderSubtle`), 16pt corner radius, and daylight soft elevation.

#### 5.3 `StationTelemetryHeader`
- **Features:** Pinned header showing active gate post name, assigned officer, shift schedule, and real-time connectivity status dot with pulsing animation.

#### 5.4 `StatusBadgeView`
- **Features:** Compact pill containing semantic SF Symbol and bold localized status text, automatically color-coded for 7 verification outcomes.

#### 5.5 `CryptographicSealCard`
- **Features:** Translucent frosted card rendering the 64-character HMAC-SHA256 non-repudiation signature in monospace format with verified timestamp and locked badge.
