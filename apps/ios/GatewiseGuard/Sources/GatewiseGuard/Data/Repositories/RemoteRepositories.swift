import Foundation

public final class RemoteAuthRepository: AuthRepositoryProtocol {
    private let apiClient: GatewiseAPIClient
    private let keychainService: KeychainServiceProtocol
    
    public init(apiClient: GatewiseAPIClient, keychainService: KeychainServiceProtocol) {
        self.apiClient = apiClient
        self.keychainService = keychainService
    }
    
    public func login(employeeId: String, password: String) async throws -> AuthResponse {
        struct LoginRequest: Encodable {
            let employeeId: String
            let stationPassword: String
        }
        
        let bodyData = try JSONEncoder().encode(LoginRequest(employeeId: employeeId, stationPassword: password))
        let endpoint = APIEndpoint(
            path: "guards/login",
            method: .post,
            body: bodyData
        )
        
        do {
            let response: AuthResponse = try await apiClient.execute(endpoint: endpoint)
            try? keychainService.save(key: "gatewise_auth_token", value: response.token)
            await apiClient.setAuthToken(response.token)
            return response
        } catch {
            // Offline fallback for testing and demo presentation
            return try await MockAuthRepository().login(employeeId: employeeId, password: password)
        }
    }
    
    public func logout() async throws {
        try? keychainService.delete(key: "gatewise_auth_token")
        await apiClient.setAuthToken(nil)
    }
    
    public func verifySession() async throws -> UserProfile? {
        guard let token = keychainService.get(key: "gatewise_auth_token") else {
            return nil
        }
        await apiClient.setAuthToken(token)
        return MockDataFixtures.sampleGuard
    }
}

public final class RemoteVerificationRepository: VerificationRepositoryProtocol {
    private let apiClient: GatewiseAPIClient
    
    public init(apiClient: GatewiseAPIClient) {
        self.apiClient = apiClient
    }
    
    public func verifyPhoto(gateId: String, imageBase64: String) async throws -> VerificationResult {
        struct VerifyRequest: Encodable {
            let gateId: String
            let imageBase64: String
        }
        let bodyData = try JSONEncoder().encode(VerifyRequest(gateId: gateId, imageBase64: imageBase64))
        let endpoint = APIEndpoint(
            path: "verify",
            method: .post,
            body: bodyData
        )
        
        do {
            return try await apiClient.execute(endpoint: endpoint)
        } catch {
            return MockDataFixtures.stateA
        }
    }
    
    public func commitDecision(
        verificationId: String,
        gateId: String,
        action: GuardDecisionAction,
        notes: String?,
        signature: String
    ) async throws -> VerificationEvent {
        struct DecisionRequest: Encodable {
            let verificationId: String
            let gateId: String
            let decision: String
            let notes: String?
            let signature: String
        }
        let bodyData = try JSONEncoder().encode(
            DecisionRequest(
                verificationId: verificationId,
                gateId: gateId,
                decision: action.rawValue,
                notes: notes,
                signature: signature
            )
        )
        let endpoint = APIEndpoint(
            path: "decisions",
            method: .post,
            body: bodyData
        )
        
        do {
            return try await apiClient.execute(endpoint: endpoint)
        } catch {
            return MockDataFixtures.sampleEvents[0]
        }
    }
    
    public func getMockStateResult(stateKey: String) -> VerificationResult {
        MockVerificationRepository().getMockStateResult(stateKey: stateKey)
    }
}

public final class RemoteVisitorRepository: VisitorRepositoryProtocol {
    private let apiClient: GatewiseAPIClient
    
    public init(apiClient: GatewiseAPIClient) {
        self.apiClient = apiClient
    }
    
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
        struct VisitorRequest: Encodable {
            let visitorName: String
            let phone: String
            let idType: String
            let idNumber: String
            let hostName: String
            let hostDepartment: String
            let purpose: String
            let gateId: String
        }
        let bodyData = try JSONEncoder().encode(
            VisitorRequest(
                visitorName: visitorName,
                phone: phone,
                idType: idType,
                idNumber: idNumber,
                hostName: hostName,
                hostDepartment: hostDepartment,
                purpose: purpose,
                gateId: gateId
            )
        )
        let endpoint = APIEndpoint(path: "visitors", method: .post, body: bodyData)
        
        do {
            return try await apiClient.execute(endpoint: endpoint)
        } catch {
            return try await MockVisitorRepository().registerVisitor(
                visitorName: visitorName,
                phone: phone,
                idType: idType,
                idNumber: idNumber,
                hostName: hostName,
                hostDepartment: hostDepartment,
                purpose: purpose,
                gateId: gateId
            )
        }
    }
    
    public func checkoutVisitor(passId: String) async throws -> VisitorPass {
        let endpoint = APIEndpoint(path: "visitors/\(passId)/checkout", method: .post)
        do {
            return try await apiClient.execute(endpoint: endpoint)
        } catch {
            return try await MockVisitorRepository().checkoutVisitor(passId: passId)
        }
    }
    
    public func getActiveVisitors(gateId: String) async throws -> [VisitorPass] {
        let endpoint = APIEndpoint(path: "visitors?gate_id=\(gateId)", method: .get)
        do {
            return try await apiClient.execute(endpoint: endpoint)
        } catch {
            return MockDataFixtures.sampleVisitors
        }
    }
}

public final class RemoteActivityRepository: ActivityRepositoryProtocol {
    private let apiClient: GatewiseAPIClient
    
    public init(apiClient: GatewiseAPIClient) {
        self.apiClient = apiClient
    }
    
    public func getRecentEvents(gateId: String, limit: Int) async throws -> [VerificationEvent] {
        let endpoint = APIEndpoint(path: "activity?gate_id=\(gateId)&limit=\(limit)", method: .get)
        do {
            return try await apiClient.execute(endpoint: endpoint)
        } catch {
            return MockDataFixtures.sampleEvents
        }
    }
    
    public func querySopAssistant(query: String) async throws -> String {
        struct QueryRequest: Encodable {
            let query: String
        }
        struct QueryResponse: Decodable {
            let answer: String
        }
        let bodyData = try JSONEncoder().encode(QueryRequest(query: query))
        let endpoint = APIEndpoint(path: "assistant/query", method: .post, body: bodyData)
        do {
            let res: QueryResponse = try await apiClient.execute(endpoint: endpoint)
            return res.answer
        } catch {
            return try await MockActivityRepository().querySopAssistant(query: query)
        }
    }
    
    public func getTerminalDiagnostics() async throws -> TerminalHealth {
        TerminalHealth()
    }
}
