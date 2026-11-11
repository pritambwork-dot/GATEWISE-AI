import SwiftUI

public enum ColorTokens {
    // Canvas & Surfaces
    public static let canvas = Color(hex: 0xF4F8F5)
    public static let surface = Color(hex: 0xFFFFFF)
    public static let surfaceSecondary = Color(hex: 0xEDF4EF)
    
    // Brand Greens
    public static let brandPrimary = Color(hex: 0x23865D)
    public static let brandDeep = Color(hex: 0x176346)
    public static let brandMint = Color(hex: 0xC7E7D8)
    public static let brandLightGreen = Color(hex: 0xDDF0E2)
    public static let brandTeal = Color(hex: 0x3A9B8B)
    
    // Institutional Text
    public static let textPrimary = Color(hex: 0x1E2D26)
    public static let textSecondary = Color(hex: 0x65756C)
    public static let textMuted = Color(hex: 0x95A39A)
    
    // Structural Borders
    public static let borderSubtle = Color(hex: 0xE2EBE4)
    public static let borderMedium = Color(hex: 0xC8D9CD)
    public static let borderStrong = Color(hex: 0x8FA998)
    
    // Status Semantic Colors
    public static let statusSuccess = Color(hex: 0x26865E)
    public static let statusWarning = Color(hex: 0xCF983E)
    public static let statusError = Color(hex: 0xC85B57)
    public static let statusInfo = Color(hex: 0x3A9B8B)
    
    // Liquid Glass Accents
    public static let glassTint = Color(hex: 0x23865D).opacity(0.08)
    public static let glassBorder = Color.white.opacity(0.65)
}
