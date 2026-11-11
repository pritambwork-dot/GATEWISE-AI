import SwiftUI
#if canImport(UIKit)
import UIKit
#endif

public enum MotionTokens {
    public static let snappy = Animation.snappy(duration: 0.28)
    public static let bouncy = Animation.bouncy(duration: 0.45, extraBounce: 0.15)
    public static let smooth = Animation.smooth(duration: 0.35)
    public static let quick = Animation.easeInOut(duration: 0.18)
}

public enum HapticTokens {
    public static func selection() {
        #if os(iOS)
        UISelectionFeedbackGenerator().selectionChanged()
        #endif
    }
    
    public static func tapLight() {
        #if os(iOS)
        UIImpactFeedbackGenerator(style: .light).impactOccurred()
        #endif
    }
    
    public static func tapMedium() {
        #if os(iOS)
        UIImpactFeedbackGenerator(style: .medium).impactOccurred()
        #endif
    }
    
    public static func success() {
        #if os(iOS)
        UINotificationFeedbackGenerator().notificationOccurred(.success)
        #endif
    }
    
    public static func warning() {
        #if os(iOS)
        UINotificationFeedbackGenerator().notificationOccurred(.warning)
        #endif
    }
    
    public static func error() {
        #if os(iOS)
        UINotificationFeedbackGenerator().notificationOccurred(.error)
        #endif
    }
}
