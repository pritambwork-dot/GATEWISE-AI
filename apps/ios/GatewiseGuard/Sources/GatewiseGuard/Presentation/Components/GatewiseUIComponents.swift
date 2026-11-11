import SwiftUI

// MARK: - Primary Button
public struct GatewisePrimaryButton: View {
    public let title: String
    public let iconName: String?
    public let isLoading: Bool
    public let action: () -> Void
    
    public init(
        title: String,
        iconName: String? = nil,
        isLoading: Bool = false,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.iconName = iconName
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
                        .tint(.white)
                } else {
                    if let iconName {
                        Image(systemName: iconName)
                            .font(.system(size: 16, weight: .bold))
                    }
                    Text(title)
                        .font(GatewiseTypography.headline)
                }
            }
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .background(GatewiseColors.primary)
            .foregroundColor(.white)
            .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
            .shadow(color: GatewiseColors.deep.opacity(0.18), radius: 6, x: 0, y: 3)
        }
        .disabled(isLoading)
    }
}

// MARK: - Secondary Button
public struct GatewiseSecondaryButton: View {
    public enum Style {
        case soft
        case outline
        case ghost
    }
    
    public let title: String
    public let iconName: String?
    public let style: Style
    public let action: () -> Void
    
    public init(
        title: String,
        iconName: String? = nil,
        style: Style = .outline,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.iconName = iconName
        self.style = style
        self.action = action
    }
    
    public var body: some View {
        Button(action: action) {
            HStack(spacing: 8) {
                if let iconName {
                    Image(systemName: iconName)
                        .font(.system(size: 15, weight: .semibold))
                }
                Text(title)
                    .font(GatewiseTypography.bodyMedium)
            }
            .frame(maxWidth: .infinity)
            .frame(height: 48)
            .background(backgroundView)
            .foregroundColor(textColor)
            .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 12, style: .continuous)
                    .stroke(borderColor, lineWidth: style == .outline ? 1.5 : 0)
            )
        }
    }
    
    @ViewBuilder
    private var backgroundView: some View {
        switch style {
        case .soft:
            GatewiseColors.surfaceSecondary
        case .outline, .ghost:
            Color.clear
        }
    }
    
    private var textColor: Color {
        switch style {
        case .soft, .outline:
            return GatewiseColors.deep
        case .ghost:
            return GatewiseColors.textSecondary
        }
    }
    
    private var borderColor: Color {
        switch style {
        case .outline:
            return GatewiseColors.borderMedium
        case .soft, .ghost:
            return Color.clear
        }
    }
}

// MARK: - Surface Card
public struct GatewiseCard<Content: View>: View {
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

// MARK: - Input Field
public struct GatewiseInputField: View {
    public let label: String
    public let placeholder: String
    @Binding public var text: String
    public let iconName: String?
    
    public init(
        label: String,
        placeholder: String,
        text: Binding<String>,
        iconName: String? = nil
    ) {
        self.label = label
        self.placeholder = placeholder
        self._text = text
        self.iconName = iconName
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
                TextField(placeholder, text: $text)
                    .font(GatewiseTypography.body)
                    .foregroundColor(GatewiseColors.textPrimary)
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

// MARK: - Secure Password Field
public struct GatewiseSecureField: View {
    public let label: String
    public let placeholder: String
    @Binding public var text: String
    @State private var isVisible: Bool = false
    
    public init(label: String, placeholder: String, text: Binding<String>) {
        self.label = label
        self.placeholder = placeholder
        self._text = text
    }
    
    public var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(label)
                .font(GatewiseTypography.captionBold)
                .foregroundColor(GatewiseColors.textSecondary)
            
            HStack(spacing: 10) {
                Image(systemName: GatewiseIcons.lock)
                    .font(.system(size: 16))
                    .foregroundColor(GatewiseColors.textSecondary)
                
                if isVisible {
                    TextField(placeholder, text: $text)
                        .font(GatewiseTypography.body)
                } else {
                    SecureField(placeholder, text: $text)
                        .font(GatewiseTypography.body)
                }
                
                Button(action: { isVisible.toggle() }) {
                    Image(systemName: isVisible ? "eye.slash" : "eye")
                        .foregroundColor(GatewiseColors.textSecondary)
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

// MARK: - Station Telemetry Header
public struct StationTelemetryHeader: View {
    public let stationName: String
    public let officerName: String
    public let isConnected: Bool
    
    public init(
        stationName: String = "Main Campus Gate · Post 02",
        officerName: String = "Officer Ramesh Verma",
        isConnected: Bool = true
    ) {
        self.stationName = stationName
        self.officerName = officerName
        self.isConnected = isConnected
    }
    
    public var body: some View {
        HStack(spacing: 12) {
            Image(systemName: GatewiseIcons.station)
                .font(.system(size: 18))
                .foregroundColor(GatewiseColors.deep)
            
            VStack(alignment: .leading, spacing: 2) {
                Text(stationName)
                    .font(GatewiseTypography.headline)
                    .foregroundColor(GatewiseColors.textPrimary)
                
                Text("\(officerName) · Morning Shift")
                    .font(GatewiseTypography.caption)
                    .foregroundColor(GatewiseColors.textSecondary)
            }
            
            Spacer()
            
            HStack(spacing: 5) {
                Circle()
                    .fill(isConnected ? GatewiseColors.primary : GatewiseColors.error)
                    .frame(width: 8, height: 8)
                Text(isConnected ? "CONNECTED" : "OFFLINE")
                    .font(GatewiseTypography.badge)
                    .foregroundColor(GatewiseColors.deep)
            }
            .padding(.horizontal, 10)
            .padding(.vertical, 5)
            .background(GatewiseColors.surfaceSecondary)
            .clipShape(Capsule())
            .overlay(Capsule().stroke(GatewiseColors.borderSubtle, lineWidth: 1))
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 12)
        .background(GatewiseColors.surface.opacity(0.95))
        .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
        .overlay(RoundedRectangle(cornerRadius: 14, style: .continuous).stroke(GatewiseColors.borderSubtle, lineWidth: 1))
        .padding(.horizontal, 16)
    }
}

// MARK: - Status Badge View
public struct StatusBadgeView: View {
    public let outcome: VerificationOutcome
    
    public init(outcome: VerificationOutcome) {
        self.outcome = outcome
    }
    
    public var body: some View {
        HStack(spacing: 5) {
            Image(systemName: iconName)
                .font(.system(size: 11, weight: .bold))
            Text(outcome.displayName)
                .font(GatewiseTypography.badge)
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 5)
        .background(tintColor.opacity(0.12))
        .foregroundColor(tintColor)
        .clipShape(Capsule())
        .overlay(Capsule().stroke(tintColor.opacity(0.25), lineWidth: 1))
    }
    
    private var tintColor: Color {
        switch outcome {
        case .verifiedAuthorized:
            return GatewiseColors.success
        case .authorizationExpired, .identifiedUnauthorized:
            return GatewiseColors.error
        case .potentialMatch, .imageQualityInsufficient:
            return GatewiseColors.warning
        case .unknownPerson, .serviceUnavailable:
            return GatewiseColors.textSecondary
        }
    }
    
    private var iconName: String {
        switch outcome {
        case .verifiedAuthorized:
            return "checkmark.circle.fill"
        case .authorizationExpired, .identifiedUnauthorized:
            return "xmark.octagon.fill"
        case .potentialMatch:
            return "exclamationmark.triangle.fill"
        case .unknownPerson:
            return "questionmark.circle.fill"
        case .imageQualityInsufficient:
            return "camera.badge.ellipsis"
        case .serviceUnavailable:
            return "antenna.radiowaves.left.and.right.slash"
        }
    }
}

// MARK: - Cryptographic Seal Card
public struct CryptographicSealCard: View {
    public let signature: String
    public let timestamp: String
    
    public init(signature: String, timestamp: String) {
        self.signature = signature
        self.timestamp = timestamp
    }
    
    public var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Image(systemName: GatewiseIcons.seal)
                    .foregroundColor(GatewiseColors.primary)
                Text("HMAC-SHA256 Cryptographic Seal")
                    .font(GatewiseTypography.captionBold)
                    .foregroundColor(GatewiseColors.deep)
                Spacer()
                Text("VERIFIED")
                    .font(GatewiseTypography.badge)
                    .foregroundColor(GatewiseColors.primary)
            }
            
            Text(signature)
                .font(GatewiseTypography.monospace)
                .foregroundColor(GatewiseColors.textPrimary)
                .lineLimit(2)
                .textSelection(.enabled)
            
            Text("Sealed at \(timestamp) · Non-repudiation ledger anchored")
                .font(GatewiseTypography.caption)
                .foregroundColor(GatewiseColors.textMuted)
        }
        .padding(14)
        .background(GatewiseColors.lightGreen.opacity(0.5))
        .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
        .overlay(RoundedRectangle(cornerRadius: 12, style: .continuous).stroke(GatewiseColors.mint, lineWidth: 1))
    }
}

// MARK: - Verification Stepper View
public struct VerificationStepperView: View {
    public let steps = [
        "Ingesting single-shot capture frame",
        "Executing YuNet 300x300 face detection",
        "Generating SFace 128D facial vector embedding",
        "Cosine similarity matching against enrollment database",
        "Evaluating institutional clearance rules"
    ]
    public let currentStep: Int
    
    public init(currentStep: Int) {
        self.currentStep = currentStep
    }
    
    public var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            ForEach(0..<steps.count, id: \.self) { index in
                HStack(spacing: 12) {
                    if index < currentStep {
                        Image(systemName: "checkmark.circle.fill")
                            .foregroundColor(GatewiseColors.success)
                            .font(.system(size: 18))
                    } else if index == currentStep {
                        ProgressView()
                            .tint(GatewiseColors.primary)
                            .scaleEffect(0.8)
                    } else {
                        Circle()
                            .stroke(GatewiseColors.borderMedium, lineWidth: 2)
                            .frame(width: 18, height: 18)
                    }
                    
                    Text(steps[index])
                        .font(index == currentStep ? GatewiseTypography.bodyMedium : GatewiseTypography.body)
                        .foregroundColor(index <= currentStep ? GatewiseColors.textPrimary : GatewiseColors.textMuted)
                }
            }
        }
    }
}

// MARK: - Navigation Bar Title Helper
extension View {
    @ViewBuilder
    public func inlineNavigationBarTitle() -> some View {
        #if os(iOS)
        self.navigationBarTitleDisplayMode(.inline)
        #else
        self
        #endif
    }
}
