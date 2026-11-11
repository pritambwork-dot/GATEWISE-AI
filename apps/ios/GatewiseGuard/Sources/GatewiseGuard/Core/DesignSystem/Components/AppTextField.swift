import SwiftUI

public struct AppTextField: View {
    public let label: String
    public let placeholder: String
    @Binding public var text: String
    public let iconName: String?
    public var isSecure: Bool = false
    
    public init(
        label: String,
        placeholder: String,
        text: Binding<String>,
        iconName: String? = nil,
        isSecure: Bool = false
    ) {
        self.label = label
        self.placeholder = placeholder
        self._text = text
        self.iconName = iconName
        self.isSecure = isSecure
    }
    
    public var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(label)
                .font(TypographyTokens.caption2)
                .foregroundColor(ColorTokens.textSecondary)
            
            HStack(spacing: 10) {
                if let iconName {
                    Image(systemName: iconName)
                        .font(.system(size: 16))
                        .foregroundColor(ColorTokens.textSecondary)
                }
                
                if isSecure {
                    SecureField(placeholder, text: $text)
                        .font(TypographyTokens.body)
                } else {
                    TextField(placeholder, text: $text)
                        .font(TypographyTokens.body)
                }
            }
            .padding(.horizontal, 14)
            .frame(height: 48)
            .background(ColorTokens.surfaceSecondary.opacity(0.6))
            .clipShape(ShapeTokens.inputShape())
            .overlay {
                ShapeTokens.inputShape()
                    .stroke(ColorTokens.borderSubtle, lineWidth: 1)
            }
        }
    }
}
