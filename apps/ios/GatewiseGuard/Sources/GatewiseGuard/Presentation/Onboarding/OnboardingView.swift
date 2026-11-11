import SwiftUI

public struct OnboardingView: View {
    @Environment(AppState.self) private var appState
    @State private var currentStep: Int = 0
    
    private struct Slide: Identifiable {
        let id: Int
        let badge: String
        let icon: String
        let title: String
        let subtitle: String
        let description: String
        let points: [String]
    }
    
    private let slides: [Slide] = [
        Slide(
            id: 0,
            badge: "INSTITUTIONAL ACCESS",
            icon: GatewiseIcons.shield,
            title: "GATEWISE Guard Terminal",
            subtitle: "Institutional Security & Facial Verification",
            description: "Engineered for campus security personnel, GATEWISE Guard provides sovereign, high-precision access verification at physical gate posts.",
            points: [
                "Individual officer authentication with shift audit trails",
                "Direct gate lock pairing preventing unauthorized station takeover",
                "Sovereign human-in-the-loop decision authority at all times"
            ]
        ),
        Slide(
            id: 1,
            badge: "STATION CONTEXT",
            icon: GatewiseIcons.station,
            title: "Assigned Gate Operations",
            subtitle: "Main Campus Gate · Post 02",
            description: "Every verification event is cryptographically sealed to your active station and shift schedule, ensuring institutional non-repudiation.",
            points: [
                "Real-time connection with Central Security Command Centre",
                "Instant pass/fail telemetry and anomaly alerts",
                "Automatic fallback to offline local cache if network degrades"
            ]
        ),
        Slide(
            id: 2,
            badge: "COMPUTER VISION",
            icon: GatewiseIcons.biometric,
            title: "Manual Still-Image Verification",
            subtitle: "Single-Shot High Precision Matching",
            description: "GATEWISE uses single-shot manual captures rather than continuous video streams. Face detection and cosine similarity matching run server-side.",
            points: [
                "Subject positions face within the high-contrast oval guide",
                "Dual YuNet 300x300 detection + SFace 128D embedding models",
                "Strict decoupling: Identity match score vs institutional clearance"
            ]
        ),
        Slide(
            id: 3,
            badge: "INTAKE PROTOCOL",
            icon: GatewiseIcons.visitors,
            title: "Visitor & Escort Registry",
            subtitle: "Rapid Walk-in Intake & Departure Logging",
            description: "Process guest admissions effortlessly with government ID recording, host department verification, and unique cryptographic visitor passes.",
            points: [
                "Sub-minute visitor intake with phone & photo capture",
                "Host officer verification and purpose categorization",
                "Single-tap departure checkout at any exit terminal"
            ]
        ),
        Slide(
            id: 4,
            badge: "PRIVACY & INTEGRITY",
            icon: GatewiseIcons.lock,
            title: "Privacy Safeguards & Security",
            subtitle: "Zero Public Storage · Ephemeral RAM Processing",
            description: "Institutional biometrics are strictly protected. Photos are never saved to the device camera roll and audio recording is permanently disabled.",
            points: [
                "No microphone or location permissions required",
                "Biometric captures are deleted immediately after verification",
                "HMAC-SHA256 digital signature seals every guard decision"
            ]
        )
    ]
    
    public init() {}
    
    public var body: some View {
        VStack(spacing: 0) {
            // Header Bar
            HStack {
                Text("STEP \(currentStep + 1) OF \(slides.count)")
                    .font(GatewiseTypography.badge)
                    .foregroundColor(GatewiseColors.deep)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 5)
                    .background(GatewiseColors.surfaceSecondary)
                    .clipShape(Capsule())
                
                Spacer()
                
                if currentStep < slides.count - 1 {
                    Button("Skip Orientation") {
                        appState.completeOnboarding()
                    }
                    .font(GatewiseTypography.captionBold)
                    .foregroundColor(GatewiseColors.textSecondary)
                }
            }
            .padding(.horizontal, 24)
            .padding(.top, 16)
            
            Spacer()
            
            // Slide Content
            let currentSlide = slides[currentStep]
            VStack(spacing: 16) {
                ZStack {
                    Circle()
                        .fill(GatewiseColors.lightGreen)
                        .frame(width: 88, height: 88)
                    Image(systemName: currentSlide.icon)
                        .font(.system(size: 42))
                        .foregroundColor(GatewiseColors.primary)
                }
                .shadow(color: GatewiseColors.deep.opacity(0.08), radius: 6, x: 0, y: 2)
                
                Text(currentSlide.badge)
                    .font(GatewiseTypography.badge)
                    .foregroundColor(GatewiseColors.deep)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 4)
                    .background(GatewiseColors.surface)
                    .clipShape(Capsule())
                    .overlay(Capsule().stroke(GatewiseColors.borderMedium, lineWidth: 1))
                
                Text(currentSlide.title)
                    .font(GatewiseTypography.sectionTitle)
                    .foregroundColor(GatewiseColors.textPrimary)
                    .multilineTextAlignment(.center)
                
                Text(currentSlide.subtitle)
                    .font(GatewiseTypography.bodyMedium)
                    .foregroundColor(GatewiseColors.primary)
                    .multilineTextAlignment(.center)
                
                Text(currentSlide.description)
                    .font(GatewiseTypography.body)
                    .foregroundColor(GatewiseColors.textSecondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 16)
                
                // Key Points List
                VStack(alignment: .leading, spacing: 8) {
                    ForEach(currentSlide.points, id: \.self) { pt in
                        HStack(alignment: .top, spacing: 8) {
                            Image(systemName: "checkmark.circle.fill")
                                .font(.system(size: 14))
                                .foregroundColor(GatewiseColors.primary)
                                .padding(.top, 2)
                            Text(pt)
                                .font(GatewiseTypography.body)
                                .foregroundColor(GatewiseColors.textPrimary)
                        }
                    }
                }
                .padding(14)
                .background(GatewiseColors.surface)
                .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
                .overlay(RoundedRectangle(cornerRadius: 14, style: .continuous).stroke(GatewiseColors.borderSubtle, lineWidth: 1))
                .padding(.horizontal, 16)
            }
            .padding(.horizontal, 16)
            
            Spacer()
            
            // Footer Navigation
            VStack(spacing: 16) {
                // Page Dots
                HStack(spacing: 6) {
                    ForEach(0..<slides.count, id: \.self) { idx in
                        Capsule()
                            .fill(idx == currentStep ? GatewiseColors.primary : GatewiseColors.borderMedium)
                            .frame(width: idx == currentStep ? 24 : 6, height: 6)
                            .animation(.spring(response: 0.3), value: currentStep)
                    }
                }
                
                // Buttons
                HStack(spacing: 12) {
                    if currentStep > 0 {
                        GatewiseSecondaryButton(title: "Back", style: .outline) {
                            withAnimation {
                                currentStep -= 1
                            }
                        }
                        .frame(maxWidth: 120)
                    }
                    
                    GatewisePrimaryButton(
                        title: currentStep == slides.count - 1 ? "Complete & Proceed" : "Continue",
                        iconName: currentStep == slides.count - 1 ? "checkmark.circle" : "arrow.right"
                    ) {
                        if currentStep == slides.count - 1 {
                            appState.completeOnboarding()
                        } else {
                            withAnimation {
                                currentStep += 1
                            }
                        }
                    }
                }
            }
            .padding(24)
            .background(GatewiseColors.surface)
            .overlay(Rectangle().frame(height: 1).foregroundColor(GatewiseColors.borderSubtle), alignment: .top)
        }
        .background(GatewiseColors.background)
    }
}
