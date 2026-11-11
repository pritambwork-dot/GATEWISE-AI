import SwiftUI

public struct AppButton: View {
    public enum Style {
        case primary
        case secondary
        case destructive
        case outline
    }
    
    public let title: String
    public let iconName: String?
    public let style: Style
    public let isLoading: Bool
    public let action: () -> Void
    
    public init(
        title: String,
        iconName: String? = nil,
        style: Style = .primary,
        isLoading: Bool = false,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.iconName = iconName
        self.style = style
        self.isLoading = isLoading
        self.action = action
    }
    
    public var body: some View {
        Button(action: {
            HapticTokens.tapMedium()
            action()
        }) {
            HStack(spacing: 8) {
                if isLoading {
                    ProgressView()
                        .tint(style == .primary || style == .destructive ? .white : ColorTokens.brandPrimary)
                } else {
                    if let iconName {
                        Image(systemName: iconName)
                            .font(.system(size: 15, weight: .bold))
                    }
                    Text(title)
                        .font(TypographyTokens.headline)
                }
            }
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .background(backgroundColor)
            .foregroundColor(foregroundColor)
            .clipShape(ShapeTokens.buttonShape())
            .overlay {
                ShapeTokens.buttonShape()
                    .stroke(borderColor, lineWidth: style == .outline ? 1.5 : 0)
            }
            .shadow(color: shadowColor, radius: 6, x: 0, y: 3)
        }
        .disabled(isLoading)
    }
    
    private var backgroundColor: Color {
        switch style {
        case .primary:
            return ColorTokens.brandPrimary
        case .secondary:
            return ColorTokens.surfaceSecondary
        case .destructive:
            return ColorTokens.statusError
        case .outline:
            return Color.clear
        }
    }
    
    private var foregroundColor: Color {
        switch style {
        case .primary, .destructive:
            return .white
        case .secondary, .outline:
            return ColorTokens.brandDeep
        }
    }
    
    private var borderColor: Color {
        switch style {
        case .outline:
            return ColorTokens.borderMedium
        default:
            return Color.clear
        }
    }
    
    private var shadowColor: Color {
        switch style {
        case .primary:
            return ColorTokens.brandDeep.opacity(0.18)
        case .destructive:
            return ColorTokens.statusError.opacity(0.2)
        default:
            return Color.clear
        }
    }
}
