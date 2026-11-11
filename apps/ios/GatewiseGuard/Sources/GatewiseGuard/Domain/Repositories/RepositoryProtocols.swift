import Foundation

public protocol AuthRepositoryProtocol: Sendable {
    func login(employeeId: String, password: String) async throws -> AuthResponse
    func logout() async throws
    func verifySession() async throws -> UserProfile?
}

public protocol VerificationRepositoryProtocol: Sendable {
    func verifyPhoto(gateId: String, imageBase64: String) async throws -> VerificationResult
    func commitDecision(
        verificationId: String,
        gateId: String,
        action: GuardDecisionAction,
        notes: String?,
        signature: String
    ) async throws -> VerificationEvent
    func getMockStateResult(stateKey: String) -> VerificationResult
}

public protocol VisitorRepositoryProtocol: Sendable {
    func registerVisitor(
        visitorName: String,
        phone: String,
        idType: String,
        idNumber: String,
        hostName: String,
        hostDepartment: String,
        purpose: String,
        gateId: String
    ) async throws -> VisitorPass
    
    func checkoutVisitor(passId: String) async throws -> VisitorPass
    func getActiveVisitors(gateId: String) async throws -> [VisitorPass]
}

public protocol ActivityRepositoryProtocol: Sendable {
    func getRecentEvents(gateId: String, limit: Int) async throws -> [VerificationEvent]
    func querySopAssistant(query: String) async throws -> String
    func getTerminalDiagnostics() async throws -> TerminalHealth
}
