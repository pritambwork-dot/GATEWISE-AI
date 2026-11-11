import SwiftUI

public struct AppHeader: View {
    public let title: String
    public let subtitle: String
    public let statusBadgeText: String
    public let isOnline: Bool
    
    public init(
        title: String,
        subtitle: String,
        statusBadgeText: String = "LIVE",
        isOnline: Bool = true
    ) {
        self.title = title
        self.subtitle = subtitle
        self.statusBadgeText = statusBadgeText
        self.isOnline = isOnline
    }
    
    public var body: some View {
        HStack(spacing: 12) {
            ZStack {
                Circle()
                    .fill(ColorTokens.brandLightGreen)
                    .frame(width: 40, height: 40)
                Image(systemName: "shield.checkered")
                    .font(.system(size: 18))
                    .foregroundColor(ColorTokens.brandDeep)
            }
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(TypographyTokens.headline)
                    .foregroundColor(ColorTokens.textPrimary)
                Text(subtitle)
                    .font(TypographyTokens.footnote)
                    .foregroundColor(ColorTokens.textSecondary)
            }
            
            Spacer()
            
            StatusBadge(
                text: statusBadgeText,
                status: isOnline ? .success : .error,
                showPulseDot: true
            )
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(ColorTokens.surface.opacity(0.95))
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
        .overlay {
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .stroke(ColorTokens.borderSubtle, lineWidth: 1)
        }
        .padding(.horizontal, 16)
    }
}
