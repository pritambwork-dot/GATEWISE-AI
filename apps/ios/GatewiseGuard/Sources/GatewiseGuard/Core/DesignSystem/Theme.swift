import SwiftUI

public struct Theme: Sendable {
    public static let current = Theme()
    
    public let colors = ColorTokens.self
    public let typography = TypographyTokens.self
    public let spacing = SpacingTokens.self
    public let motion = MotionTokens.self
    public let shapes = ShapeTokens.self
    
    public init() {}
}
