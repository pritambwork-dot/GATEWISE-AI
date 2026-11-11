import SwiftUI

// MARK: - AppButton
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
            #if os(iOS)
            let generator = UIImpactFeedbackGenerator(style: .medium)
            generator.impactOccurred()
            #endif
            action()
        }) {
            HStack(spacing: 8) {
                if isLoading {
                    ProgressView()
                        .tint(style == .primary || style == .destructive ? .white : GatewiseColors.primary)
                } else {
                    if let iconName {
                        Image(systemName: iconName)
                            .font(.system(size: 15, weight: .bold))
                    }
                    Text(title)
                        .font(GatewiseTypography.headline)
                }
            }
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .background(backgroundColor)
            .foregroundColor(foregroundColor)
            .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .stroke(borderColor, lineWidth: style == .outline ? 1.5 : 0)
            )
            .shadow(color: shadowColor, radius: 6, x: 0, y: 3)
        }
        .disabled(isLoading)
    }
    
    private var backgroundColor: Color {
        switch style {
        case .primary:
            return GatewiseColors.primary
        case .secondary:
            return GatewiseColors.surfaceSecondary
        case .destructive:
            return GatewiseColors.error
        case .outline:
            return Color.clear
        }
    }
    
    private var foregroundColor: Color {
        switch style {
        case .primary, .destructive:
            return .white
        case .secondary, .outline:
            return GatewiseColors.deep
        }
    }
    
    private var borderColor: Color {
        switch style {
        case .outline:
            return GatewiseColors.borderMedium
        default:
            return Color.clear
        }
    }
    
    private var shadowColor: Color {
        switch style {
        case .primary:
            return GatewiseColors.deep.opacity(0.18)
        case .destructive:
            return GatewiseColors.error.opacity(0.2)
        default:
            return Color.clear
        }
    }
}

// MARK: - AppTextField
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
                .font(GatewiseTypography.captionBold)
                .foregroundColor(GatewiseColors.textSecondary)
            
            HStack(spacing: 10) {
                if let iconName {
                    Image(systemName: iconName)
                        .font(.system(size: 16))
                        .foregroundColor(GatewiseColors.textSecondary)
                }
                
                if isSecure {
                    SecureField(placeholder, text: $text)
                        .font(GatewiseTypography.body)
                } else {
                    TextField(placeholder, text: $text)
                        .font(GatewiseTypography.body)
                }
            }
            .padding(.horizontal, 14)
            .frame(height: 48)
            .background(GatewiseColors.surfaceSecondary.opacity(0.6))
            .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 12, style: .continuous)
                    .stroke(GatewiseColors.borderSubtle, lineWidth: 1)
            )
        }
    }
}

// MARK: - AppCard
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
        .background(GatewiseColors.surface)
        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 18, style: .continuous)
                .stroke(GatewiseColors.borderSubtle, lineWidth: 1)
        )
        .shadow(color: GatewiseColors.deep.opacity(0.04), radius: 8, x: 0, y: 3)
    }
}

// MARK: - GlassControl (Liquid Glass for Controls)
public struct GlassControl<Content: View>: View {
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
        .overlay(
            Capsule()
                .stroke(GatewiseColors.glassBorder, lineWidth: 1)
        )
        .shadow(color: Color.black.opacity(0.12), radius: 8, x: 0, y: 3)
    }
}

// MARK: - AppHeader (Station Telemetry Banner)
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
                    .fill(GatewiseColors.lightGreen)
                    .frame(width: 40, height: 40)
                Image(systemName: GatewiseIcons.station)
                    .font(.system(size: 18))
                    .foregroundColor(GatewiseColors.deep)
            }
            
            VStack(alignment: .leading, spacing: 2) {
                Text(title)
                    .font(GatewiseTypography.headline)
                    .foregroundColor(GatewiseColors.textPrimary)
                Text(subtitle)
                    .font(GatewiseTypography.caption)
                    .foregroundColor(GatewiseColors.textSecondary)
            }
            
            Spacer()
            
            GlassControl {
                Circle()
                    .fill(isOnline ? GatewiseColors.primary : GatewiseColors.error)
                    .frame(width: 7, height: 7)
                Text(statusBadgeText)
                    .font(GatewiseTypography.badge)
                    .foregroundColor(GatewiseColors.deep)
            }
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(GatewiseColors.surface.opacity(0.95))
        .clipShape(RoundedRectangle(cornerRadius: 16, style: .continuous))
        .overlay(
            RoundedRectangle(cornerRadius: 16, style: .continuous)
                .stroke(GatewiseColors.borderSubtle, lineWidth: 1)
        )
        .padding(.horizontal, 16)
    }
}

// MARK: - LoadingView
public struct LoadingView: View {
    public let message: String
    
    public init(message: String = "Loading terminal telemetry...") {
        self.message = message
    }
    
    public var body: some View {
        VStack(spacing: 14) {
            ProgressView()
                .scaleEffect(1.2)
                .tint(GatewiseColors.primary)
            Text(message)
                .font(GatewiseTypography.caption)
                .foregroundColor(GatewiseColors.textSecondary)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(GatewiseColors.background)
    }
}

// MARK: - ErrorView
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
                .foregroundColor(GatewiseColors.error)
            
            Text("Connection Anomaly")
                .font(GatewiseTypography.sectionTitle)
                .foregroundColor(GatewiseColors.textPrimary)
            
            Text(message)
                .font(GatewiseTypography.body)
                .foregroundColor(GatewiseColors.textSecondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)
            
            AppButton(title: "Retry Connection", iconName: "arrow.clockwise", style: .outline) {
                onRetry()
            }
            .frame(maxWidth: 220)
        }
        .padding(24)
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(GatewiseColors.background)
    }
}

// MARK: - EmptyStateView
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
                .foregroundColor(GatewiseColors.textMuted)
            
            Text(title)
                .font(GatewiseTypography.cardTitle)
                .foregroundColor(GatewiseColors.textPrimary)
            
            Text(description)
                .font(GatewiseTypography.caption)
                .foregroundColor(GatewiseColors.textSecondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 32)
            
            if let actionTitle, let action {
                Button(action: action) {
                    Text(actionTitle)
                        .font(GatewiseTypography.captionBold)
                        .foregroundColor(GatewiseColors.primary)
                }
                .padding(.top, 4)
            }
        }
        .padding(32)
        .frame(maxWidth: .infinity)
    }
}
