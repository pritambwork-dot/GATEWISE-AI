import XCTest
@testable import GatewiseGuard
import Foundation

final class GatewiseGuardTests: XCTestCase {
    
    func testCryptoSignature() {
        let crypto = CryptoService.shared
        let sig = crypto.generateDecisionSignature(
            eventId: "EVT-TEST-001",
            guardId: "SEC-G014",
            gateId: "gate-post-02",
            decision: "GRANT_ENTRY",
            timestamp: "2026-11-11T06:00:00Z",
            salt: "GATEWISE_TEST_SALT"
        )
        
        XCTAssertEqual(sig.count, 64)
        XCTAssertNotNil(sig.range(of: "^[0-9a-f]{64}$", options: .regularExpression))
    }
    
    func testSha256Hex() {
        let crypto = CryptoService.shared
        let hash = crypto.sha256Hex(data: Data("GATEWISE_AI".utf8))
        XCTAssertEqual(hash.count, 64)
    }
    
    func testVerificationStates() {
        let stateA = MockDataFixtures.stateA
        XCTAssertEqual(stateA.outcome, .verifiedAuthorized)
        XCTAssertNotNil(stateA.candidate)
        XCTAssertGreaterThanOrEqual(stateA.candidate!.similarityScore, 0.90)
        XCTAssertEqual(stateA.authorization!.isAuthorized, true)
        
        let stateB = MockDataFixtures.stateB
        XCTAssertEqual(stateB.outcome, .authorizationExpired)
        XCTAssertEqual(stateB.authorization!.isAuthorized, false)
        
        let stateC = MockDataFixtures.stateC
        XCTAssertEqual(stateC.outcome, .potentialMatch)
        XCTAssertGreaterThanOrEqual(stateC.candidate!.similarityScore, 0.70)
        XCTAssertLessThan(stateC.candidate!.similarityScore, 0.90)
        
        let stateD = MockDataFixtures.stateD
        XCTAssertEqual(stateD.outcome, .unknownPerson)
        XCTAssertNil(stateD.candidate)
        
        let stateE = MockDataFixtures.stateE
        XCTAssertEqual(stateE.outcome, .imageQualityInsufficient)
        XCTAssertEqual(stateE.faceDetected, false)
        
        let stateG = MockDataFixtures.stateG
        XCTAssertEqual(stateG.outcome, .serviceUnavailable)
    }
    
    func testAuthRepository() async throws {
        let repo = MockAuthRepository()
        let res = try await repo.login(employeeId: "SEC-G014", password: "guard123")
        XCTAssertEqual(res.user.employeeId, "SEC-G014")
        XCTAssertEqual(res.assignedGate.code, "GATE-MAIN-02")
        XCTAssertFalse(res.token.isEmpty)
    }
    
    func testVisitorPassLifecycle() async throws {
        let repo = MockVisitorRepository()
        let newPass = try await repo.registerVisitor(
            visitorName: "Test Visitor",
            phone: "+91 99999 88888",
            idType: "Aadhaar Card",
            idNumber: "123456789012",
            hostName: "Prof. Host",
            hostDepartment: "Management",
            purpose: "Meeting",
            gateId: "gate-post-02"
        )
        
        XCTAssertEqual(newPass.status, "CHECKED_IN")
        XCTAssertTrue(newPass.passCode.hasPrefix("PASS-"))
        
        let checkedOut = try await repo.checkoutVisitor(passId: newPass.id)
        XCTAssertEqual(checkedOut.status, "CHECKED_OUT")
        XCTAssertNotNil(checkedOut.checkOutTime)
    }
    
    func testSopAssistant() async throws {
        let repo = MockActivityRepository()
        let vehicleAnswer = try await repo.querySopAssistant(query: "Unregistered delivery vehicle")
        XCTAssertTrue(vehicleAnswer.contains("Holding Bay B"))
        
        let vipAnswer = try await repo.querySopAssistant(query: "VIP convoy arrival")
        XCTAssertTrue(vipAnswer.contains("Faculty Block Forecourt"))
    }
}
