import SwiftUI

public struct GatewiseColors: Sendable {
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
    public static let softBlue = Color(hex: 0xA8CBE0)
    
    // Text Shades
    public static let textPrimary = Color(hex: 0x1E2D26)
    public static let textSecondary = Color(hex: 0x65756C)
    public static let textMuted = Color(hex: 0x95A39A)
    
    // Borders
    public static let borderSubtle = Color(hex: 0xE2EBE4)
    public static let borderMedium = Color(hex: 0xC8D9CD)
    public static let borderStrong = Color(hex: 0x8FA998)
    
    // Status Indicators
    public static let success = Color(hex: 0x26865E)
    public static let warning = Color(hex: 0xCF983E)
    public static let error = Color(hex: 0xC85B57)
    public static let info = Color(hex: 0x3A9B8B)
    
    // Translucent Liquid Glass Tints
    public static let glassHighlight = Color.white.opacity(0.85)
    public static let glassBorder = Color.white.opacity(0.35)
}

extension Color {
    public init(hex: UInt, alpha: Double = 1.0) {
        self.init(
            .sRGB,
            red: Double((hex >> 16) & 0xff) / 255,
            green: Double((hex >> 08) & 0xff) / 255,
            blue: Double((hex >> 00) & 0xff) / 255,
            opacity: alpha
        )
    }
}
