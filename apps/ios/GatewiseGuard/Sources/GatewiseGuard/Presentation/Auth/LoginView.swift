import SwiftUI

public struct LoginView: View {
    @Environment(AppState.self) private var appState
    @State private var employeeId: String = "SEC-G014"
    @State private var password: String = "guard123"
    @State private var isLoading: Bool = false
    @State private var errorMessage: String? = nil
    
    public init() {}
    
    public var body: some View {
        ScrollView {
            VStack(spacing: 20) {
                // Brand Header
                VStack(spacing: 8) {
                    ZStack {
                        Circle()
                            .fill(GatewiseColors.lightGreen)
                            .frame(width: 72, height: 72)
                        Image(systemName: GatewiseIcons.shield)
                            .font(.system(size: 34))
                            .foregroundColor(GatewiseColors.primary)
                    }
                    .shadow(color: GatewiseColors.deep.opacity(0.1), radius: 6, x: 0, y: 2)
                    
                    Text("GATEWISE AI")
                        .font(GatewiseTypography.displayTitle)
                        .foregroundColor(GatewiseColors.deep)
                        .tracking(1.0)
                    
                    Text("Institutional Gate Verification · IIM Sambalpur")
                        .font(GatewiseTypography.caption)
                        .foregroundColor(GatewiseColors.textSecondary)
                    
                    HStack(spacing: 6) {
                        Image(systemName: "mappin.and.ellipse")
                            .font(.system(size: 12))
                            .foregroundColor(GatewiseColors.deep)
                        Text("Main Campus Gate · Post 02")
                            .font(GatewiseTypography.badge)
                            .foregroundColor(GatewiseColors.deep)
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 5)
                    .background(GatewiseColors.surfaceSecondary)
                    .clipShape(Capsule())
                    .overlay(Capsule().stroke(GatewiseColors.borderSubtle, lineWidth: 1))
                }
                .padding(.top, 24)
                
                // Login Card
                GatewiseCard(padding: 20) {
                    VStack(alignment: .leading, spacing: 16) {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("Guard Terminal Sign-In")
                                .font(GatewiseTypography.cardTitle)
                                .foregroundColor(GatewiseColors.textPrimary)
                            Text("Enter assigned officer credentials to unlock gate terminal.")
                                .font(GatewiseTypography.caption)
                                .foregroundColor(GatewiseColors.textSecondary)
                        }
                        
                        if let errorMessage {
                            HStack(spacing: 8) {
                                Image(systemName: "exclamationmark.circle.fill")
                                    .foregroundColor(GatewiseColors.error)
                                Text(errorMessage)
                                    .font(GatewiseTypography.caption)
                                    .foregroundColor(GatewiseColors.error)
                            }
                            .padding(10)
                            .background(GatewiseColors.error.opacity(0.08))
                            .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))
                        }
                        
                        GatewiseInputField(
                            label: "Guard Employee ID",
                            placeholder: "e.g. SEC-G014",
                            text: $employeeId,
                            iconName: "person.text.rectangle"
                        )
                        
                        GatewiseSecureField(
                            label: "Station Password",
                            placeholder: "••••••••",
                            text: $password
                        )
                        
                        GatewisePrimaryButton(
                            title: "Authenticate & Lock Gate",
                            iconName: "lock.open.fill",
                            isLoading: isLoading
                        ) {
                            handleSignIn()
                        }
                        
                        // Quick Fill Officer Ramesh Credentials
                        Button(action: {
                            employeeId = "SEC-G014"
                            password = "guard123"
                            errorMessage = nil
                        }) {
                            HStack(spacing: 6) {
                                Image(systemName: "sparkles")
                                    .font(.system(size: 13))
                                Text("Quick-Fill Officer Ramesh (SEC-G014)")
                                    .font(GatewiseTypography.captionBold)
                            }
                            .foregroundColor(GatewiseColors.deep)
                            .frame(maxWidth: .infinity)
                            .padding(.top, 4)
                        }
                    }
                }
                .padding(.horizontal, 16)
                
                // Security Notice Card
                HStack(alignment: .top, spacing: 10) {
                    Image(systemName: GatewiseIcons.lock)
                        .foregroundColor(GatewiseColors.textSecondary)
                        .font(.system(size: 14))
                        .padding(.top, 2)
                    Text("Officers cannot create or approve permanent identities. Single-shot camera scans only. Zero video recording or permanent biometric storage.")
                        .font(GatewiseTypography.caption)
                        .foregroundColor(GatewiseColors.textSecondary)
                        .lineSpacing(2)
                }
                .padding(14)
                .background(GatewiseColors.surfaceSecondary)
                .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                .padding(.horizontal, 16)
                
                // Support Footer
                VStack(spacing: 2) {
                    Text("Need terminal assistance? Contact Command Centre")
                        .font(GatewiseTypography.caption)
                        .foregroundColor(GatewiseColors.textMuted)
                    Text("Ext: 4401 · security-ops@gatewise.ac.in")
                        .font(GatewiseTypography.captionBold)
                        .foregroundColor(GatewiseColors.deep)
                }
                .padding(.top, 12)
                .padding(.bottom, 32)
            }
        }
        .background(GatewiseColors.background)
    }
    
    private func handleSignIn() {
        guard !employeeId.isEmpty && !password.isEmpty else {
            errorMessage = "Please enter Employee ID and station password."
            return
        }
        
        isLoading = true
        errorMessage = nil
        
        Task {
            do {
                try await appState.login(employeeId: employeeId, password: password)
            } catch {
                errorMessage = error.localizedDescription
            }
            isLoading = false
        }
    }
}
