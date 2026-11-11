import SwiftUI

public struct RecordDecisionView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(AppState.self) private var appState
    public let onFinished: () -> Void
    
    @State private var selectedAction: GuardDecisionAction = .grantEntry
    @State private var notes: String = ""
    @State private var isSubmitting: Bool = false
    @State private var showingConfirmDialog: Bool = false
    @State private var committedEvent: VerificationEvent? = nil
    
    public init(onFinished: @escaping () -> Void) {
        self.onFinished = onFinished
    }
    
    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    if let event = committedEvent {
                        // Sealed Confirmation View
                        GatewiseCard(padding: 20) {
                            VStack(spacing: 16) {
                                ZStack {
                                    Circle()
                                        .fill(GatewiseColors.lightGreen)
                                        .frame(width: 68, height: 68)
                                    Image(systemName: "checkmark.seal.fill")
                                        .font(.system(size: 34))
                                        .foregroundColor(GatewiseColors.primary)
                                }
                                
                                Text("Decision Logged & Sealed")
                                    .font(GatewiseTypography.sectionTitle)
                                    .foregroundColor(GatewiseColors.deep)
                                
                                Text("Recorded by \(event.officerName) at \(event.gateName)")
                                    .font(GatewiseTypography.caption)
                                    .foregroundColor(GatewiseColors.textSecondary)
                                
                                CryptographicSealCard(
                                    signature: event.signature,
                                    timestamp: event.timestamp
                                )
                                
                                Text("This decision is cryptographically anchored in the institutional gate log and synchronized with Central Security Command.")
                                    .font(GatewiseTypography.caption)
                                    .foregroundColor(GatewiseColors.textMuted)
                                    .multilineTextAlignment(.center)
                                
                                GatewisePrimaryButton(title: "Return to Terminal") {
                                    appState.resetVerification()
                                    dismiss()
                                    onFinished()
                                }
                            }
                        }
                        .padding(16)
                    } else {
                        // Action Selection Form
                        VStack(alignment: .leading, spacing: 14) {
                            Text("Select Sovereign Guard Action")
                                .font(GatewiseTypography.captionBold)
                                .foregroundColor(GatewiseColors.textSecondary)
                                .padding(.horizontal, 16)
                            
                            VStack(spacing: 10) {
                                ForEach(GuardDecisionAction.allCases, id: \.self) { action in
                                    actionCard(action: action)
                                }
                            }
                            .padding(.horizontal, 16)
                            
                            // Notes Input Field
                            GatewiseCard(padding: 14) {
                                GatewiseInputField(
                                    label: "Officer Remarks / Exception Notes (Optional)",
                                    placeholder: "e.g. Physical badge inspected, vehicle escort cleared...",
                                    text: $notes,
                                    iconName: "square.and.pencil"
                                )
                            }
                            .padding(.horizontal, 16)
                            
                            // Commit Button
                            GatewisePrimaryButton(
                                title: "Commit & Cryptographically Seal",
                                iconName: "lock.shield",
                                isLoading: isSubmitting
                            ) {
                                showingConfirmDialog = true
                            }
                            .padding(.horizontal, 16)
                            .padding(.bottom, 24)
                        }
                        .padding(.top, 16)
                    }
                }
            }
            .background(GatewiseColors.background)
            .navigationTitle("Record Decision")
            .inlineNavigationBarTitle()
            .toolbar {
                if committedEvent == nil {
                    ToolbarItem(placement: .cancellationAction) {
                        Button("Cancel") { dismiss() }
                    }
                }
            }
            .confirmationDialog(
                "Confirm Guard Decision?",
                isPresented: $showingConfirmDialog,
                titleVisibility: .visible
            ) {
                Button("Confirm & Seal \(selectedAction.title)") {
                    commitDecision()
                }
                Button("Review", role: .cancel) {}
            } message: {
                Text("This action will open or lock the gate and generate a non-repudiation cryptographic signature.")
            }
        }
    }
    
    private func actionCard(action: GuardDecisionAction) -> some View {
        Button(action: {
            selectedAction = action
            #if os(iOS)
            let generator = UIImpactFeedbackGenerator(style: .light)
            generator.impactOccurred()
            #endif
        }) {
            HStack(spacing: 14) {
                Image(systemName: action.iconName)
                    .font(.system(size: 24))
                    .foregroundColor(iconColor(for: action))
                    .frame(width: 40)
                
                VStack(alignment: .leading, spacing: 2) {
                    Text(action.title)
                        .font(GatewiseTypography.headline)
                        .foregroundColor(GatewiseColors.textPrimary)
                    Text(action.subtitle)
                        .font(GatewiseTypography.caption)
                        .foregroundColor(GatewiseColors.textSecondary)
                }
                
                Spacer()
                
                if selectedAction == action {
                    Image(systemName: "checkmark.circle.fill")
                        .foregroundColor(GatewiseColors.primary)
                }
            }
            .padding(14)
            .background(GatewiseColors.surface)
            .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
            .overlay(
                RoundedRectangle(cornerRadius: 14, style: .continuous)
                    .stroke(selectedAction == action ? GatewiseColors.primary : GatewiseColors.borderSubtle, lineWidth: selectedAction == action ? 2 : 1)
            )
        }
    }
    
    private func iconColor(for action: GuardDecisionAction) -> Color {
        switch action {
        case .grantEntry:
            return GatewiseColors.primary
        case .denyEntry:
            return GatewiseColors.error
        case .escalateToAdmin:
            return GatewiseColors.warning
        case .referToVisitorDesk:
            return GatewiseColors.deep
        }
    }
    
    private func commitDecision() {
        isSubmitting = true
        Task {
            let event = await appState.commitDecision(action: selectedAction, notes: notes.isEmpty ? nil : notes)
            self.committedEvent = event
            isSubmitting = false
        }
    }
}
