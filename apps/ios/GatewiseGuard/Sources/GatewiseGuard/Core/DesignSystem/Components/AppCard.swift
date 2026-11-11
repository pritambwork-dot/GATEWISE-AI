import SwiftUI

public struct AppCard<Content: View>: View {
    public let padding: CGFloat
    public let content: Content
    
    public init(padding: CGFloat = 16, @ViewBuilder content: () -> Content) {
        self.padding = padding
        self.content = content()
    }
    
    public var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            content
        }
        .padding(padding)
        .background(ColorTokens.surface)
        .clipShape(ShapeTokens.cardShape())
        .overlay {
            ShapeTokens.cardShape()
                .stroke(ColorTokens.borderSubtle, lineWidth: 1)
        }
        .shadow(color: ColorTokens.brandDeep.opacity(0.04), radius: 8, x: 0, y: 3)
    }
}
