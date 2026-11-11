import Foundation

public final class MockAuthRepository: AuthRepositoryProtocol {
    public init() {}
    
    public func login(employeeId: String, password: String) async throws -> AuthResponse {
        try await Task.sleep(nanoseconds: 50_000_000) // 50ms realistic delay
        if employeeId.trimmingCharacters(in: .whitespaces).uppercased() == "SEC-G014" || !employeeId.isEmpty {
            return AuthResponse(
                token: "mock-jwt-token-\(UUID().uuidString)",
                user: MockDataFixtures.sampleGuard,
                assignedGate: MockDataFixtures.sampleGate,
                shiftName: "Shift A (Morning 06:00 – 14:00)"
            )
        } else {
            throw NetworkError.custom("Invalid Employee ID or station password.")
        }
    }
    
    public func logout() async throws {
        try await Task.sleep(nanoseconds: 20_000_000)
    }
    
    public func verifySession() async throws -> UserProfile? {
        return MockDataFixtures.sampleGuard
    }
}

public final class MockVerificationRepository: @unchecked Sendable, VerificationRepositoryProtocol {
    public var selectedMockStateKey: String = "STATE_A"
    
    public init() {}
    
    public func verifyPhoto(gateId: String, imageBase64: String) async throws -> VerificationResult {
        try await Task.sleep(nanoseconds: 60_000_000) // 60ms simulated tensor pipeline
        return getMockStateResult(stateKey: selectedMockStateKey)
    }
    
    public func commitDecision(
        verificationId: String,
        gateId: String,
        action: GuardDecisionAction,
        notes: String?,
        signature: String
    ) async throws -> VerificationEvent {
        try await Task.sleep(nanoseconds: 30_000_000)
        let state = getMockStateResult(stateKey: selectedMockStateKey)
        return VerificationEvent(
            id: "EVT-\(UUID().uuidString.prefix(8))",
            gateId: gateId,
            gateName: MockDataFixtures.sampleGate.name,
            officerId: MockDataFixtures.sampleGuard.employeeId,
            officerName: MockDataFixtures.sampleGuard.fullName,
            personName: state.candidate?.personName ?? "Unregistered Individual",
            personId: state.candidate?.personId,
            personCategory: state.candidate?.category,
            outcome: state.outcome,
            decision: action,
            signature: signature,
            notes: notes,
            timestamp: ISO8601DateFormatter().string(from: Date())
        )
    }
    
    public func getMockStateResult(stateKey: String) -> VerificationResult {
        switch stateKey {
        case "STATE_A":
            return MockDataFixtures.stateA
        case "STATE_B":
            return MockDataFixtures.stateB
        case "STATE_C":
            return MockDataFixtures.stateC
        case "STATE_D":
            return MockDataFixtures.stateD
        case "STATE_E":
            return MockDataFixtures.stateE
        case "STATE_G":
            return MockDataFixtures.stateG
        default:
            return MockDataFixtures.stateA
        }
    }
}

public final class MockVisitorRepository: @unchecked Sendable, VisitorRepositoryProtocol {
    private var visitors: [VisitorPass] = MockDataFixtures.sampleVisitors
    
    public init() {}
    
    public func registerVisitor(
        visitorName: String,
        phone: String,
        idType: String,
        idNumber: String,
        hostName: String,
        hostDepartment: String,
        purpose: String,
        gateId: String
    ) async throws -> VisitorPass {
        try await Task.sleep(nanoseconds: 40_000_000)
        let newPass = VisitorPass(
            id: UUID().uuidString,
            passCode: "PASS-\(Int.random(in: 1000...9999))",
            visitorName: visitorName,
            phone: phone,
            idType: idType,
            idNumber: idNumber,
            hostName: hostName,
            hostDepartment: hostDepartment,
            purpose: purpose,
            gateId: gateId,
            status: "CHECKED_IN"
        )
        visitors.insert(newPass, at: 0)
        return newPass
    }
    
    public func checkoutVisitor(passId: String) async throws -> VisitorPass {
        try await Task.sleep(nanoseconds: 30_000_000)
        if let idx = visitors.firstIndex(where: { $0.id == passId || $0.passCode == passId }) {
            let updated = VisitorPass(
                id: visitors[idx].id,
                passCode: visitors[idx].passCode,
                visitorName: visitors[idx].visitorName,
                phone: visitors[idx].phone,
                idType: visitors[idx].idType,
                idNumber: visitors[idx].idNumber,
                hostName: visitors[idx].hostName,
                hostDepartment: visitors[idx].hostDepartment,
                purpose: visitors[idx].purpose,
                gateId: visitors[idx].gateId,
                status: "CHECKED_OUT",
                checkInTime: visitors[idx].checkInTime,
                checkOutTime: ISO8601DateFormatter().string(from: Date())
            )
            visitors[idx] = updated
            return updated
        }
        throw NetworkError.custom("Visitor pass not found.")
    }
    
    public func getActiveVisitors(gateId: String) async throws -> [VisitorPass] {
        return visitors
    }
}

public final class MockActivityRepository: ActivityRepositoryProtocol {
    public init() {}
    
    public func getRecentEvents(gateId: String, limit: Int) async throws -> [VerificationEvent] {
        try await Task.sleep(nanoseconds: 30_000_000)
        return MockDataFixtures.sampleEvents
    }
    
    public func querySopAssistant(query: String) async throws -> String {
        try await Task.sleep(nanoseconds: 80_000_000)
        let q = query.lowercased()
        if q.contains("vehicle") || q.contains("car") || q.contains("truck") {
            return MockDataFixtures.sopAnswers["vehicle"]!
        } else if q.contains("vip") || q.contains("convoy") || q.contains("minister") {
            return MockDataFixtures.sopAnswers["vip"]!
        } else if q.contains("expired") || q.contains("alumni") || q.contains("card") {
            return MockDataFixtures.sopAnswers["expired"]!
        } else {
            return MockDataFixtures.sopAnswers["default"]!
        }
    }
    
    public func getTerminalDiagnostics() async throws -> TerminalHealth {
        return TerminalHealth()
    }
}
