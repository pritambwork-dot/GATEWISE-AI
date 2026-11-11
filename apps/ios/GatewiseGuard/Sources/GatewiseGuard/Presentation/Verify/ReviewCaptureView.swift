import SwiftUI

public struct ReviewCaptureView: View {
    @Environment(\.dismiss) private var dismiss
    public let onProceed: () -> Void
    public let onRetake: () -> Void
    
    public init(onProceed: @escaping () -> Void, onRetake: @escaping () -> Void) {
        self.onProceed = onProceed
        self.onRetake = onRetake
    }
    
    public var body: some View {
        ScrollView {
            VStack(spacing: 16) {
                // Photo Frame Card
                ZStack(alignment: .topLeading) {
                    RoundedRectangle(cornerRadius: 20, style: .continuous)
                        .fill(GatewiseColors.surfaceSecondary)
                        .frame(height: 380)
                        .overlay(
                            VStack(spacing: 12) {
                                Image(systemName: "person.crop.rectangle.fill")
                                    .font(.system(size: 64))
                                    .foregroundColor(GatewiseColors.primary.opacity(0.4))
                                Text("High-Resolution Captured Frame")
                                    .font(GatewiseTypography.captionBold)
                                    .foregroundColor(GatewiseColors.textSecondary)
                            }
                        )
                        .overlay(
                            RoundedRectangle(cornerRadius: 20, style: .continuous)
                                .stroke(GatewiseColors.borderSubtle, lineWidth: 1.5)
                        )
                    
                    // Tag Badge
                    Text("STATION FRAME CAPTURE")
                        .font(GatewiseTypography.badge)
                        .foregroundColor(.white)
                        .padding(.horizontal, 10)
                        .padding(.vertical, 5)
                        .background(GatewiseColors.deep.opacity(0.85))
                        .clipShape(Capsule())
                        .padding(14)
                }
                .padding(.horizontal, 16)
                .padding(.top, 16)
                
                // Pre-Analysis Quality Card
                GatewiseCard(padding: 16) {
                    VStack(alignment: .leading, spacing: 12) {
                        HStack(spacing: 6) {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundColor(GatewiseColors.success)
                            Text("Pre-Analysis Quality Check Passed")
                                .font(GatewiseTypography.captionBold)
                                .foregroundColor(GatewiseColors.textPrimary)
                        }
                        
                        HStack(spacing: 0) {
                            qualityItem(value: "94.8", label: "Focus Sharpness", color: GatewiseColors.textPrimary)
                            Divider().frame(height: 30)
                            qualityItem(value: "91%", label: "Ambient Light", color: GatewiseColors.textPrimary)
                            Divider().frame(height: 30)
                            qualityItem(value: "PASS", label: "Orientation", color: GatewiseColors.primary)
                        }
                        .padding(.vertical, 8)
                        .background(GatewiseColors.surfaceSecondary.opacity(0.6))
                        .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                        
                        Text("Subject facial features are sharply defined with sufficient contrast. Ready for vector embedding extraction.")
                            .font(GatewiseTypography.caption)
                            .foregroundColor(GatewiseColors.textSecondary)
                            .lineSpacing(2)
                    }
                }
                .padding(.horizontal, 16)
                
                // Actions
                VStack(spacing: 10) {
                    GatewisePrimaryButton(
                        title: "Analyze & Verify Subject",
                        iconName: "fingerprint"
                    ) {
                        onProceed()
                    }
                    
                    GatewiseSecondaryButton(
                        title: "Retake Photo",
                        iconName: GatewiseIcons.cameraFlip,
                        style: .soft
                    ) {
                        onRetake()
                    }
                }
                .padding(.horizontal, 16)
                
                // Privacy Notice
                HStack(spacing: 6) {
                    Image(systemName: GatewiseIcons.shield)
                        .font(.system(size: 12))
                        .foregroundColor(GatewiseColors.textMuted)
                    Text("Temporary frame is held in volatile memory. Discarded immediately after verification.")
                        .font(GatewiseTypography.caption)
                        .foregroundColor(GatewiseColors.textMuted)
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 24)
            }
        }
        .background(GatewiseColors.background)
    }
    
    private func qualityItem(value: String, label: String, color: Color) -> some View {
        VStack(spacing: 2) {
            Text(value)
                .font(.system(size: 16, weight: .bold))
                .foregroundColor(color)
            Text(label)
                .font(GatewiseTypography.caption)
                .foregroundColor(GatewiseColors.textSecondary)
        }
        .frame(maxWidth: .infinity)
    }
}
