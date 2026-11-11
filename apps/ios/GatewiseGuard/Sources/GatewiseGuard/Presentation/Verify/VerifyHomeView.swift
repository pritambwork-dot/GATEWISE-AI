import SwiftUI

public struct VerifyHomeView: View {
    @Environment(AppState.self) private var appState
    @State private var showingCamera: Bool = false
    @State private var showingReview: Bool = false
    @State private var showingProcessing: Bool = false
    @State private var showingResult: Bool = false
    
    public init() {}
    
    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    // Pinned Station Telemetry
                    StationTelemetryHeader(
                        stationName: appState.assignedGate?.name ?? "Main Campus Gate · Post 02",
                        officerName: appState.currentUser?.fullName ?? "Officer Ramesh Verma"
                    )
                    .padding(.top, 8)
                    
                    // START VERIFICATION HERO CTA
                    Button(action: {
                        appState.resetVerification()
                        showingCamera = true
                    }) {
                        VStack(alignment: .leading, spacing: 14) {
                            HStack(spacing: 14) {
                                ZStack {
                                    Circle()
                                        .fill(Color.white.opacity(0.2))
                                        .frame(width: 54, height: 54)
                                    Image(systemName: GatewiseIcons.camera)
                                        .font(.system(size: 24, weight: .bold))
                                        .foregroundColor(.white)
                                }
                                
                                VStack(alignment: .leading, spacing: 3) {
                                    Text("START VERIFICATION")
                                        .font(GatewiseTypography.headline)
                                        .foregroundColor(.white)
                                        .tracking(0.8)
                                    Text("Single-shot face scan · Tap to open camera")
                                        .font(GatewiseTypography.caption)
                                        .foregroundColor(Color.white.opacity(0.85))
                                }
                                
                                Spacer()
                                
                                Image(systemName: "chevron.right")
                                    .font(.system(size: 16, weight: .bold))
                                    .foregroundColor(.white)
                            }
                            
                            Divider()
                                .background(Color.white.opacity(0.2))
                            
                            HStack(spacing: 6) {
                                Image(systemName: "shield.lefthalf.filled")
                                    .font(.system(size: 12))
                                    .foregroundColor(GatewiseColors.mint)
                                Text("Ephemeral RAM processing · Zero video recording · Privacy compliant")
                                    .font(GatewiseTypography.caption)
                                    .foregroundColor(GatewiseColors.mint)
                            }
                        }
                        .padding(18)
                        .background(
                            LinearGradient(
                                colors: [GatewiseColors.deep, GatewiseColors.primary],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .clipShape(RoundedRectangle(cornerRadius: 18, style: .continuous))
                        .shadow(color: GatewiseColors.deep.opacity(0.2), radius: 10, x: 0, y: 4)
                    }
                    .padding(.horizontal, 16)
                    
                    // 7-STATE VERIFICATION SIMULATOR
                    GatewiseCard(padding: 16) {
                        VStack(alignment: .leading, spacing: 12) {
                            HStack(spacing: 6) {
                                Image(systemName: "flask.fill")
                                    .foregroundColor(GatewiseColors.deep)
                                Text("7-STATE VERIFICATION SIMULATOR")
                                    .font(GatewiseTypography.captionBold)
                                    .foregroundColor(GatewiseColors.deep)
                            }
                            
                            Text("Select any institutional state to test matching, clearance, and guard decisions:")
                                .font(GatewiseTypography.caption)
                                .foregroundColor(GatewiseColors.textSecondary)
                            
                            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 10) {
                                simButton(title: "State A: Authorized", stateKey: "STATE_A", outcome: .verifiedAuthorized)
                                simButton(title: "State B: Expired", stateKey: "STATE_B", outcome: .authorizationExpired)
                                simButton(title: "State C: Potential 78%", stateKey: "STATE_C", outcome: .potentialMatch)
                                simButton(title: "State D: Unknown", stateKey: "STATE_D", outcome: .unknownPerson)
                                simButton(title: "State E: Low Quality", stateKey: "STATE_E", outcome: .imageQualityInsufficient)
                                simButton(title: "State G: Offline Standby", stateKey: "STATE_G", outcome: .serviceUnavailable)
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                    
                    // TODAY'S STATION METRICS
                    GatewiseCard(padding: 16) {
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Today's Station Telemetry")
                                .font(GatewiseTypography.cardTitle)
                                .foregroundColor(GatewiseColors.textPrimary)
                            
                            HStack(spacing: 12) {
                                metricTile(number: "148", label: "Total Scans", color: GatewiseColors.textPrimary)
                                metricTile(number: "139", label: "Authorized", color: GatewiseColors.primary)
                                metricTile(number: "7", label: "Denied", color: GatewiseColors.error)
                                metricTile(number: "2", label: "Referrals", color: GatewiseColors.warning)
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                    
                    // STANDARD OPERATING PROCEDURES SUMMARY
                    GatewiseCard(padding: 16) {
                        VStack(alignment: .leading, spacing: 8) {
                            HStack(spacing: 6) {
                                Image(systemName: "doc.text.fill")
                                    .foregroundColor(GatewiseColors.deep)
                                Text("Station Standard Operating Procedures")
                                    .font(GatewiseTypography.captionBold)
                                    .foregroundColor(GatewiseColors.deep)
                            }
                            
                            Text("1. Standby at active barrier post. Verify subject face matches live camera frame.\n2. In cases of Potential Match (70–89%), inspect physical government or institutional ID.\n3. Direct all unregistered visitors to Desk A for pass generation.\n4. Decisions are digitally sealed and non-repudiable.")
                                .font(GatewiseTypography.caption)
                                .foregroundColor(GatewiseColors.textSecondary)
                                .lineSpacing(3)
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 24)
                }
            }
            .background(GatewiseColors.background)
            .navigationTitle("Verify Terminal")
            .inlineNavigationBarTitle()
            .sheet(isPresented: $showingCamera) {
                CameraCaptureView(onPhotoCaptured: {
                    showingCamera = false
                    showingReview = true
                })
            }
            .sheet(isPresented: $showingReview) {
                ReviewCaptureView(
                    onProceed: {
                        showingReview = false
                        showingProcessing = true
                    },
                    onRetake: {
                        showingReview = false
                        showingCamera = true
                    }
                )
            }
            .sheet(isPresented: $showingProcessing) {
                ProcessingView(onComplete: {
                    showingProcessing = false
                    showingResult = true
                })
            }
            .sheet(isPresented: $showingResult) {
                VerificationResultView()
            }
        }
    }
    
    private func simButton(title: String, stateKey: String, outcome: VerificationOutcome) -> some View {
        Button(action: {
            appState.selectedMockState = stateKey
            appState.resetVerification()
            showingCamera = true
        }) {
            VStack(alignment: .leading, spacing: 4) {
                StatusBadgeView(outcome: outcome)
                Text(title)
                    .font(GatewiseTypography.captionBold)
                    .foregroundColor(GatewiseColors.textPrimary)
                    .lineLimit(1)
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(10)
            .background(GatewiseColors.surfaceSecondary.opacity(0.8))
            .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 10, style: .continuous)
                    .stroke(appState.selectedMockState == stateKey ? GatewiseColors.primary : GatewiseColors.borderSubtle, lineWidth: 1.5)
            )
        }
    }
    
    private func metricTile(number: String, label: String, color: Color) -> some View {
        VStack(spacing: 2) {
            Text(number)
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(color)
            Text(label)
                .font(GatewiseTypography.caption)
                .foregroundColor(GatewiseColors.textSecondary)
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 8)
        .background(GatewiseColors.surfaceSecondary.opacity(0.5))
        .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
    }
}
