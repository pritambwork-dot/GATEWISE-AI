import SwiftUI

public enum TypographyTokens {
    public static let largeTitle = Font.system(size: 34, weight: .bold, design: .default)
    public static let title1 = Font.system(size: 28, weight: .bold, design: .default)
    public static let title2 = Font.system(size: 22, weight: .bold, design: .default)
    public static let title3 = Font.system(size: 20, weight: .semibold, design: .default)
    public static let headline = Font.system(size: 17, weight: .semibold, design: .default)
    public static let body = Font.system(size: 16, weight: .regular, design: .default)
    public static let callout = Font.system(size: 15, weight: .medium, design: .default)
    public static let subheadline = Font.system(size: 14, weight: .regular, design: .default)
    public static let footnote = Font.system(size: 13, weight: .regular, design: .default)
    public static let caption1 = Font.system(size: 12, weight: .medium, design: .default)
    public static let caption2 = Font.system(size: 11, weight: .semibold, design: .default)
    
    // Monospaced Digits for Timers & Quantitative Telemetry
    public static let monoScore = Font.system(size: 40, weight: .bold, design: .monospaced)
    public static let monoKpi = Font.system(size: 24, weight: .bold, design: .monospaced)
    public static let monoTimestamp = Font.system(size: 12, weight: .medium, design: .monospaced)
}
