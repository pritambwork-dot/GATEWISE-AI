import SwiftUI

public struct ProcessingView: View {
    @Environment(AppState.self) private var appState
    public let onComplete: () -> Void
    
    public init(onComplete: @escaping () -> Void) {
        self.onComplete = onComplete
    }
    
    public var body: some View {
        VStack(spacing: 24) {
            Spacer()
            
            // Header Spinner
            VStack(spacing: 12) {
                ZStack {
                    Circle()
                        .fill(GatewiseColors.lightGreen)
                        .frame(width: 72, height: 72)
                    Image(systemName: "viewfinder")
                        .font(.system(size: 34))
                        .foregroundColor(GatewiseColors.primary)
                }
                
                Text("Analyzing Facial Biometrics")
                    .font(GatewiseTypography.sectionTitle)
                    .foregroundColor(GatewiseColors.textPrimary)
                
                Text("Executing on-device & station cluster clearance verification pipeline")
                    .font(GatewiseTypography.body)
                    .foregroundColor(GatewiseColors.textSecondary)
                    .multilineTextAlignment(.center)
                    .padding(.horizontal, 24)
            }
            
            // Stepper Card
            GatewiseCard(padding: 20) {
                VerificationStepperView(currentStep: appState.processingStep)
            }
            .padding(.horizontal, 20)
            
            Spacer()
            
            GatewiseSecondaryButton(title: "Cancel Verification", style: .ghost) {
                appState.resetVerification()
            }
            .padding(.horizontal, 24)
            .padding(.bottom, 24)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(GatewiseColors.background)
        .task {
            await appState.runVerification()
            try? await Task.sleep(nanoseconds: 200_000_000)
            onComplete()
        }
    }
}
