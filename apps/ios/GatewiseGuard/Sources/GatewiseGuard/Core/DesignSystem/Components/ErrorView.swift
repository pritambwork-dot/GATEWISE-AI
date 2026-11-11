import SwiftUI

public struct ErrorView: View {
    public let message: String
    public let onRetry: () -> Void
    
    public init(message: String, onRetry: @escaping () -> Void) {
        self.message = message
        self.onRetry = onRetry
    }
    
    public var body: some View {
        VStack(spacing: 16) {
            Image(systemName: "exclamationmark.triangle.fill")
                .font(.system(size: 44))
                .foregroundColor(ColorTokens.statusError)
            
            Text("Connection Anomaly")
                .font(TypographyTokens.title3)
                .foregroundColor(ColorTokens.textPrimary)
            
            Text(message)
                .font(TypographyTokens.body)
                .foregroundColor(ColorTokens.textSecondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)
            
            AppButton(title: "Retry Connection", iconName: "arrow.clockwise", style: .outline) {
                onRetry()
            }
            .frame(maxWidth: 220)
        }
        .padding(24)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(ColorTokens.canvas)
    }
}
