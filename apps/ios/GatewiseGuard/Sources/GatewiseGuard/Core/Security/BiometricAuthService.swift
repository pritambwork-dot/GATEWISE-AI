import Foundation
import LocalAuthentication

public protocol BiometricAuthServiceProtocol: Sendable {
    func canEvaluateBiometrics() -> Bool
    func authenticateWithFaceID(reason: String) async -> Result<Bool, Error>
}

public final class BiometricAuthService: BiometricAuthServiceProtocol {
    public static let shared = BiometricAuthService()
    
    public init() {}
    
    public func canEvaluateBiometrics() -> Bool {
        let context = LAContext()
        var error: NSError?
        return context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error)
    }
    
    public func authenticateWithFaceID(reason: String) async -> Result<Bool, Error> {
        let context = LAContext()
        context.localizedCancelTitle = "Cancel"
        
        do {
            let success = try await context.evaluatePolicy(
                .deviceOwnerAuthenticationWithBiometrics,
                localizedReason: reason
            )
            return .success(success)
        } catch {
            return .failure(error)
        }
    }
}
