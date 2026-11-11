import SwiftUI

public extension View {
    func institutionalCardSurface(padding: CGFloat = 16) -> some View {
        self
            .padding(padding)
            .background(ColorTokens.surface)
            .clipShape(ShapeTokens.cardShape())
            .overlay {
                ShapeTokens.cardShape()
                    .stroke(ColorTokens.borderSubtle, lineWidth: 1)
            }
            .shadow(color: ColorTokens.brandDeep.opacity(0.04), radius: 8, x: 0, y: 3)
    }
    
    func materialCardSurface(padding: CGFloat = 16) -> some View {
        self
            .padding(padding)
            .background(
                .regularMaterial,
                in: ShapeTokens.cardShape()
            )
            .overlay {
                ShapeTokens.cardShape()
                    .stroke(ColorTokens.borderSubtle, lineWidth: 1)
            }
    }
}
