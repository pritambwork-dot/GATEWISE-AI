import SwiftUI

public struct EmptyStateView: View {
    public let title: String
    public let description: String
    public let actionTitle: String?
    public let action: (() -> Void)?
    
    public init(
        title: String,
        description: String,
        actionTitle: String? = nil,
        action: (() -> Void)? = nil
    ) {
        self.title = title
        self.description = description
        self.actionTitle = actionTitle
        self.action = action
    }
    
    public var body: some View {
        VStack(spacing: 12) {
            Image(systemName: "tray.fill")
                .font(.system(size: 38))
                .foregroundColor(ColorTokens.textMuted)
            
            Text(title)
                .font(TypographyTokens.headline)
                .foregroundColor(ColorTokens.textPrimary)
            
            Text(description)
                .font(TypographyTokens.subheadline)
                .foregroundColor(ColorTokens.textSecondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)
            
            if let actionTitle, let action {
                Button(action: action) {
                    Text(actionTitle)
                        .font(TypographyTokens.caption1)
                        .foregroundColor(ColorTokens.brandPrimary)
                }
                .padding(.top, 4)
            }
        }
        .padding(32)
        .frame(maxWidth: .infinity)
    }
}
