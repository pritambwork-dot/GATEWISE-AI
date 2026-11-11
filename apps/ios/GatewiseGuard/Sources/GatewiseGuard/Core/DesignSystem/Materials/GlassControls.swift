import SwiftUI

public struct LiquidGlassPill<Content: View>: View {
    public let content: Content
    
    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    public var body: some View {
        HStack(spacing: 8) {
            content
        }
        .padding(.horizontal, 14)
        .padding(.vertical, 8)
        .background(.ultraThinMaterial)
        .clipShape(Capsule())
        .overlay {
            Capsule()
                .stroke(ColorTokens.glassBorder, lineWidth: 1)
        }
        .shadow(color: Color.black.opacity(0.08), radius: 6, x: 0, y: 2)
    }
}

public struct LiquidGlassBar<Content: View>: View {
    public let content: Content
    
    public init(@ViewBuilder content: () -> Content) {
        self.content = content()
    }
    
    public var body: some View {
        HStack {
            content
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 10)
        .background(.ultraThinMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 22, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 22, style: .continuous)
                .stroke(ColorTokens.glassBorder, lineWidth: 1)
        }
        .shadow(color: Color.black.opacity(0.12), radius: 12, x: 0, y: 4)
    }
}
