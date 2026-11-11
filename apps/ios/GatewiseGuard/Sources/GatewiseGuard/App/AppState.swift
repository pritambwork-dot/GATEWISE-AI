import SwiftUI
import Observation

public enum AppTab: Hashable, Sendable {
    case verify
    case activity
    case visitors
    case profile
    case adminDashboard
}

public enum AppMode: String, CaseIterable, Sendable {
    case guardTerminal = "Guard Terminal"
    case commandCentre = "Command Centre"
}

@Observable
@MainActor
public final class AppState {
    public var isAuthenticated: Bool = false
    public var hasCompletedOnboarding: Bool = false
    public var currentUser: UserProfile? = nil
    public var assignedGate: GateStation? = nil
    public var activeTab: AppTab = .verify
    public var appMode: AppMode = .guardTerminal
    public var isDemonstrationMode: Bool = true
    
    // Feature Coordinators
    public var currentVerification: VerificationResult? = nil
    public var processingStep: Int = 0
    public var isProcessing: Bool = false
    public var lastDecisionEvent: VerificationEvent? = nil
    public var selectedMockState: String = "STATE_A"
    
    // Dependencies
    private let authRepo: AuthRepositoryProtocol
    private let verificationRepo: VerificationRepositoryProtocol
    private let visitorRepo: VisitorRepositoryProtocol
    private let activityRepo: ActivityRepositoryProtocol
    private let cryptoService: CryptoServiceProtocol
    private let keychainService: KeychainServiceProtocol
    
    public init(
        authRepo: AuthRepositoryProtocol = RemoteAuthRepository(apiClient: GatewiseAPIClient(), keychainService: KeychainService.shared),
        verificationRepo: VerificationRepositoryProtocol = RemoteVerificationRepository(apiClient: GatewiseAPIClient()),
        visitorRepo: VisitorRepositoryProtocol = RemoteVisitorRepository(apiClient: GatewiseAPIClient()),
        activityRepo: ActivityRepositoryProtocol = RemoteActivityRepository(apiClient: GatewiseAPIClient()),
        cryptoService: CryptoServiceProtocol = CryptoService.shared,
        keychainService: KeychainServiceProtocol = KeychainService.shared
    ) {
        self.authRepo = authRepo
        self.verificationRepo = verificationRepo
        self.visitorRepo = visitorRepo
        self.activityRepo = activityRepo
        self.cryptoService = cryptoService
        self.keychainService = keychainService
        
        // Check if onboarding completed previously
        if let completed = keychainService.get(key: "gatewise_onboarding_completed"), completed == "true" {
            self.hasCompletedOnboarding = true
        }
    }
    
    public func completeOnboarding() {
        try? keychainService.save(key: "gatewise_onboarding_completed", value: "true")
        self.hasCompletedOnboarding = true
    }
    
    public func resetOnboarding() {
        try? keychainService.delete(key: "gatewise_onboarding_completed")
        self.hasCompletedOnboarding = false
    }
    
    public func login(employeeId: String, password: String) async throws {
        let authResponse = try await authRepo.login(employeeId: employeeId, password: password)
        self.currentUser = authResponse.user
        self.assignedGate = authResponse.assignedGate
        self.isAuthenticated = true
    }
    
    public func logout() async {
        try? await authRepo.logout()
        self.isAuthenticated = false
        self.currentUser = nil
        self.assignedGate = nil
        self.currentVerification = nil
    }
    
    public func runVerification(stateKey: String? = nil) async {
        isProcessing = true
        processingStep = 0
        
        let targetKey = stateKey ?? selectedMockState
        
        // Progress through the pipeline steps
        for step in 1...5 {
            try? await Task.sleep(nanoseconds: 120_000_000)
            processingStep = step
        }
        
        self.currentVerification = verificationRepo.getMockStateResult(stateKey: targetKey)
        isProcessing = false
    }
    
    public func commitDecision(action: GuardDecisionAction, notes: String?) async -> VerificationEvent {
        let eventId = "EVT-\(UUID().uuidString.prefix(8).uppercased())"
        let timestamp = ISO8601DateFormatter().string(from: Date())
        let guardId = currentUser?.employeeId ?? "SEC-G014"
        let gateId = assignedGate?.id ?? "gate-post-02"
        
        let signature = cryptoService.generateDecisionSignature(
            eventId: eventId,
            guardId: guardId,
            gateId: gateId,
            decision: action.rawValue,
            timestamp: timestamp,
            salt: "GATEWISE_INSTITUTIONAL_PEPPER_2026"
        )
        
        let event = VerificationEvent(
            id: eventId,
            gateId: gateId,
            gateName: assignedGate?.name ?? "Main Campus Gate · Post 02",
            officerId: guardId,
            officerName: currentUser?.fullName ?? "Officer Ramesh Verma",
            personName: currentVerification?.candidate?.personName ?? "Unregistered Individual",
            personId: currentVerification?.candidate?.personId,
            personCategory: currentVerification?.candidate?.category,
            outcome: currentVerification?.outcome ?? .verifiedAuthorized,
            decision: action,
            signature: signature,
            notes: notes,
            timestamp: timestamp
        )
        
        self.lastDecisionEvent = event
        return event
    }
    
    public func resetVerification() {
        self.currentVerification = nil
        self.lastDecisionEvent = nil
        self.processingStep = 0
        self.isProcessing = false
    }
}
