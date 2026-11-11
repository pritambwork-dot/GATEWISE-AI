import SwiftUI
import Observation

@Observable
@MainActor
public final class AuthenticationViewModel {
    public var employeeId: String = "SEC-G014"
    public var password: String = "guard123"
    public var isLoading: Bool = false
    public var errorMessage: String? = nil
    public var isStationLocked: Bool = true
    
    private let authRepo: AuthRepositoryProtocol
    private let authManager: AuthManager
    
    public init(
        authRepo: AuthRepositoryProtocol = RemoteAuthRepository(apiClient: GatewiseAPIClient(), keychainService: KeychainService.shared),
        authManager: AuthManager = AuthManager.shared
    ) {
        self.authRepo = authRepo
        self.authManager = authManager
    }
    
    public func signIn() async -> Result<AuthResponse, Error> {
        guard !employeeId.trimmingCharacters(in: .whitespaces).isEmpty,
              !password.trimmingCharacters(in: .whitespaces).isEmpty else {
            self.errorMessage = "Please enter both Employee ID and station password."
            return .failure(NetworkError.custom("Missing credentials"))
        }
        
        self.isLoading = true
        self.errorMessage = nil
        
        do {
            let response = try await authRepo.login(employeeId: employeeId, password: password)
            try await authManager.persistSession(token: response.token)
            self.isLoading = false
            return .success(response)
        } catch {
            self.isLoading = false
            self.errorMessage = error.localizedDescription
            return .failure(error)
        }
    }
    
    public func quickFill() {
        self.employeeId = "SEC-G014"
        self.password = "guard123"
        self.errorMessage = nil
    }
}
