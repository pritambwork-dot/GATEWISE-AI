import SwiftUI

public struct LoadingView: View {
    public let message: String
    
    public init(message: String = "Loading terminal telemetry...") {
        self.message = message
    }
    
    public var body: some View {
        VStack(spacing: 14) {
            ProgressView()
                .scaleEffect(1.2)
                .tint(ColorTokens.brandPrimary)
            Text(message)
                .font(TypographyTokens.footnote)
                .foregroundColor(ColorTokens.textSecondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(ColorTokens.canvas)
    }
}
