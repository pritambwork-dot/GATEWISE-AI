import SwiftUI

public struct GuardProfileView: View {
    @Environment(AppState.self) private var appState
    @State private var sopQuery: String = ""
    @State private var sopAnswer: String? = nil
    @State private var isQueryingSop: Bool = false
    @State private var showingSignOutDialog: Bool = false
    
    public init() {}
    
    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    // Officer Identity Card
                    GatewiseCard(padding: 16) {
                        HStack(spacing: 14) {
                            ZStack {
                                Circle()
                                    .fill(GatewiseColors.lightGreen)
                                    .frame(width: 60, height: 60)
                                Text("RV")
                                    .font(.system(size: 22, weight: .bold))
                                    .foregroundColor(GatewiseColors.deep)
                            }
                            
                            VStack(alignment: .leading, spacing: 3) {
                                Text(appState.currentUser?.fullName ?? "Officer Ramesh Verma")
                                    .font(GatewiseTypography.sectionTitle)
                                    .foregroundColor(GatewiseColors.textPrimary)
                                
                                HStack(spacing: 6) {
                                    Text("SECURITY_GUARD")
                                        .font(GatewiseTypography.badge)
                                        .foregroundColor(GatewiseColors.deep)
                                        .padding(.horizontal, 6)
                                        .padding(.vertical, 2)
                                        .background(GatewiseColors.surfaceSecondary)
                                        .clipShape(Capsule())
                                    
                                    Text(appState.currentUser?.employeeId ?? "SEC-G014")
                                        .font(GatewiseTypography.badge)
                                        .foregroundColor(GatewiseColors.primary)
                                }
                                
                                Text(appState.assignedGate?.name ?? "Main Campus Gate · Post 02")
                                    .font(GatewiseTypography.caption)
                                    .foregroundColor(GatewiseColors.textSecondary)
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 16)
                    
                    // Diagnostics Card
                    GatewiseCard(padding: 16) {
                        VStack(alignment: .leading, spacing: 10) {
                            HStack(spacing: 6) {
                                Image(systemName: GatewiseIcons.diagnostics)
                                    .foregroundColor(GatewiseColors.deep)
                                Text("Terminal Diagnostics & Hardware Telemetry")
                                    .font(GatewiseTypography.captionBold)
                                    .foregroundColor(GatewiseColors.deep)
                            }
                            
                            Divider()
                            
                            diagnosticRow(label: "Battery & Power", value: "92% · Docked DC Charging")
                            diagnosticRow(label: "Cluster Latency", value: "38 ms to Security Core")
                            diagnosticRow(label: "Offline Sync Buffer", value: "0 Pending · Live Synchronized")
                            diagnosticRow(label: "Inference Model", value: "SFace-128D + YuNet (FastAPI Core)")
                            diagnosticRow(label: "App Build", value: "v1.0.0 (Build 120 · Native iOS 26)")
                        }
                    }
                    .padding(.horizontal, 16)
                    
                    // AI SOP Operational Assistant
                    GatewiseCard(padding: 16) {
                        VStack(alignment: .leading, spacing: 12) {
                            HStack(spacing: 6) {
                                Image(systemName: GatewiseIcons.sopAssistant)
                                    .foregroundColor(GatewiseColors.deep)
                                Text("AI SOP Operational Assistant")
                                    .font(GatewiseTypography.captionBold)
                                    .foregroundColor(GatewiseColors.deep)
                            }
                            
                            Text("Instant guidance on physical gate protocols, unlisted vehicles, and VIP convoys.")
                                .font(GatewiseTypography.caption)
                                .foregroundColor(GatewiseColors.textSecondary)
                            
                            // Preset Query Pills
                            HStack(spacing: 8) {
                                presetPill(title: "Vehicle Protocol", query: "Unregistered vehicle arrival")
                                presetPill(title: "VIP Convoy", query: "VIP convoy arrival")
                                presetPill(title: "Expired Card", query: "Expired card presented")
                            }
                            
                            // Search input
                            HStack(spacing: 8) {
                                TextField("Ask protocol question...", text: $sopQuery)
                                    .font(GatewiseTypography.body)
                                
                                Button(action: { askSop(query: sopQuery) }) {
                                    if isQueryingSop {
                                        ProgressView().scaleEffect(0.7)
                                    } else {
                                        Image(systemName: "arrow.up.circle.fill")
                                            .font(.system(size: 24))
                                            .foregroundColor(GatewiseColors.primary)
                                    }
                                }
                                .disabled(sopQuery.isEmpty || isQueryingSop)
                            }
                            .padding(.horizontal, 12)
                            .frame(height: 44)
                            .background(GatewiseColors.surfaceSecondary)
                            .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                            
                            if let answer = sopAnswer {
                                VStack(alignment: .leading, spacing: 4) {
                                    HStack(spacing: 4) {
                                        Image(systemName: "shield.checkmark.fill")
                                            .font(.system(size: 11))
                                            .foregroundColor(GatewiseColors.primary)
                                        Text("IIM Sambalpur SOP Guidance")
                                            .font(GatewiseTypography.captionBold)
                                            .foregroundColor(GatewiseColors.primary)
                                    }
                                    Text(answer)
                                        .font(GatewiseTypography.caption)
                                        .foregroundColor(GatewiseColors.textPrimary)
                                        .lineSpacing(2)
                                }
                                .padding(10)
                                .background(GatewiseColors.lightGreen.opacity(0.5))
                                .clipShape(RoundedRectangle(cornerRadius: 8, style: .continuous))
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                    
                    // Operational Preferences
                    GatewiseCard(padding: 16) {
                        VStack(spacing: 12) {
                            Button(action: {
                                appState.resetOnboarding()
                            }) {
                                HStack {
                                    Image(systemName: "book.fill")
                                        .foregroundColor(GatewiseColors.deep)
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text("Replay Institutional Briefing")
                                            .font(GatewiseTypography.bodyMedium)
                                            .foregroundColor(GatewiseColors.textPrimary)
                                        Text("Review 5-step terminal protocols and privacy safeguards")
                                            .font(GatewiseTypography.caption)
                                            .foregroundColor(GatewiseColors.textSecondary)
                                    }
                                    Spacer()
                                    Image(systemName: "chevron.right")
                                        .foregroundColor(GatewiseColors.textMuted)
                                }
                            }
                            
                            Divider()
                            
                            Toggle(isOn: Bindable(appState).isDemonstrationMode) {
                                VStack(alignment: .leading, spacing: 2) {
                                    Text("Offline Demonstration Mode")
                                        .font(GatewiseTypography.bodyMedium)
                                        .foregroundColor(GatewiseColors.textPrimary)
                                    Text("Forces deterministic fixtures for audits and presentations")
                                        .font(GatewiseTypography.caption)
                                        .foregroundColor(GatewiseColors.textSecondary)
                                }
                            }
                            .tint(GatewiseColors.primary)
                        }
                    }
                    .padding(.horizontal, 16)
                    
                    // Sign Out Button
                    GatewiseSecondaryButton(
                        title: "Sign Out & Relieve Station",
                        iconName: GatewiseIcons.logOut,
                        style: .outline
                    ) {
                        showingSignOutDialog = true
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 24)
                }
            }
            .background(GatewiseColors.background)
            .navigationTitle("Station Profile")
            .inlineNavigationBarTitle()
            .confirmationDialog(
                "Sign Out of Terminal?",
                isPresented: $showingSignOutDialog,
                titleVisibility: .visible
            ) {
                Button("Confirm Sign Out", role: .destructive) {
                    Task {
                        await appState.logout()
                    }
                }
                Button("Cancel", role: .cancel) {}
            } message: {
                Text("This will conclude your shift at Post 02 and unlock the station for the relieving officer.")
            }
        }
    }
    
    private func diagnosticRow(label: String, value: String) -> some View {
        HStack {
            Text(label)
                .font(GatewiseTypography.caption)
                .foregroundColor(GatewiseColors.textSecondary)
            Spacer()
            Text(value)
                .font(GatewiseTypography.captionBold)
                .foregroundColor(GatewiseColors.textPrimary)
        }
        .padding(.vertical, 2)
    }
    
    private func presetPill(title: String, query: String) -> some View {
        Button(action: {
            sopQuery = query
            askSop(query: query)
        }) {
            Text(title)
                .font(GatewiseTypography.badge)
                .foregroundColor(GatewiseColors.deep)
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(GatewiseColors.surfaceSecondary)
                .clipShape(Capsule())
                .overlay(Capsule().stroke(GatewiseColors.borderSubtle, lineWidth: 1))
        }
    }
    
    private func askSop(query: String) {
        isQueryingSop = true
        sopAnswer = nil
        Task {
            try? await Task.sleep(nanoseconds: 100_000_000)
            let q = query.lowercased()
            if q.contains("vehicle") || q.contains("car") {
                sopAnswer = MockDataFixtures.sopAnswers["vehicle"]
            } else if q.contains("vip") || q.contains("convoy") {
                sopAnswer = MockDataFixtures.sopAnswers["vip"]
            } else if q.contains("expired") || q.contains("card") {
                sopAnswer = MockDataFixtures.sopAnswers["expired"]
            } else {
                sopAnswer = MockDataFixtures.sopAnswers["default"]
            }
            isQueryingSop = false
        }
    }
}
