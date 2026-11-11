import SwiftUI

public enum ShapeTokens {
    public static let radiusSmall: CGFloat = 8
    public static let radiusMedium: CGFloat = 12
    public static let radiusCard: CGFloat = 18
    public static let radiusModal: CGFloat = 24
    public static let radiusPill: CGFloat = 9999
    
    public static func cardShape() -> RoundedRectangle {
        RoundedRectangle(cornerRadius: radiusCard, style: .continuous)
    }
    
    public static func inputShape() -> RoundedRectangle {
        RoundedRectangle(cornerRadius: radiusMedium, style: .continuous)
    }
    
    public static func buttonShape() -> RoundedRectangle {
        RoundedRectangle(cornerRadius: radiusMedium + 2, style: .continuous)
    }
}
