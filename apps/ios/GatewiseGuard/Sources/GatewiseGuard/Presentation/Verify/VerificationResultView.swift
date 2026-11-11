import SwiftUI

public struct VerificationResultView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(AppState.self) private var appState
    @State private var showingDecisionView: Bool = false
    
    public init() {}
    
    public var body: some View {
        NavigationStack {
            ScrollView {
                if let result = appState.currentVerification {
                    VStack(spacing: 16) {
                        // Main Result Card
                        GatewiseCard(padding: 16) {
                            VStack(alignment: .leading, spacing: 14) {
                                // Status Header
                                HStack {
                                    StatusBadgeView(outcome: result.outcome)
                                    Spacer()
                                    if let cand = result.candidate {
                                        Text(String(format: "%.1f%% Match", cand.similarityScore * 100))
                                            .font(GatewiseTypography.captionBold)
                                            .foregroundColor(GatewiseColors.primary)
                                            .padding(.horizontal, 8)
                                            .padding(.vertical, 4)
                                            .background(GatewiseColors.lightGreen)
                                            .clipShape(Capsule())
                                    }
                                }
                                
                                Divider()
                                
                                // Subject Info
                                HStack(spacing: 14) {
                                    ZStack {
                                        Circle()
                                            .fill(GatewiseColors.lightGreen)
                                            .frame(width: 56, height: 56)
                                        Image(systemName: "person.fill")
                                            .font(.system(size: 26))
                                            .foregroundColor(GatewiseColors.primary)
                                    }
                                    
                                    VStack(alignment: .leading, spacing: 3) {
                                        Text(result.candidate?.personName ?? "Unregistered Subject")
                                            .font(GatewiseTypography.sectionTitle)
                                            .foregroundColor(GatewiseColors.textPrimary)
                                        
                                        Text(result.candidate?.personId ?? "No Matching Record")
                                            .font(GatewiseTypography.captionBold)
                                            .foregroundColor(GatewiseColors.deep)
                                        
                                        Text(result.candidate?.department ?? "Security Station Walk-in")
                                            .font(GatewiseTypography.caption)
                                            .foregroundColor(GatewiseColors.textSecondary)
                                    }
                                }
                                
                                Divider()
                                
                                // Institutional Clearance Status
                                VStack(alignment: .leading, spacing: 6) {
                                    Text("Institutional Clearance Evaluation")
                                        .font(GatewiseTypography.captionBold)
                                        .foregroundColor(GatewiseColors.textSecondary)
                                    
                                    HStack {
                                        Image(systemName: result.authorization?.isAuthorized == true ? "checkmark.seal.fill" : "exclamationmark.octagon.fill")
                                            .foregroundColor(result.authorization?.isAuthorized == true ? GatewiseColors.success : GatewiseColors.error)
                                        
                                        Text(result.authorization?.clearanceLevel ?? "UNAUTHORIZED_UNKNOWN")
                                            .font(GatewiseTypography.headline)
                                            .foregroundColor(GatewiseColors.textPrimary)
                                    }
                                    
                                    if let reason = result.authorization?.restrictionReason {
                                        Text(reason)
                                            .font(GatewiseTypography.caption)
                                            .foregroundColor(GatewiseColors.error)
                                            .padding(8)
                                            .background(GatewiseColors.error.opacity(0.08))
                                            .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
                                    }
                                }
                            }
                        }
                        .padding(.horizontal, 16)
                        .padding(.top, 16)
                        
                        // Decision Action CTA
                        VStack(spacing: 10) {
                            GatewisePrimaryButton(
                                title: "RECORD GUARD DECISION",
                                iconName: "checkmark.seal"
                            ) {
                                showingDecisionView = true
                            }
                            
                            GatewiseSecondaryButton(title: "Discard & Return to Post", style: .ghost) {
                                appState.resetVerification()
                                dismiss()
                            }
                        }
                        .padding(.horizontal, 16)
                        .padding(.bottom, 24)
                    }
                } else {
                    ContentUnavailableView(
                        "No Active Verification",
                        systemImage: "viewfinder",
                        description: Text("Start a new verification from the verify terminal.")
                    )
                }
            }
            .background(GatewiseColors.background)
            .navigationTitle("Verification Result")
            .inlineNavigationBarTitle()
            .sheet(isPresented: $showingDecisionView) {
                RecordDecisionView(onFinished: {
                    dismiss()
                })
            }
        }
    }
}
