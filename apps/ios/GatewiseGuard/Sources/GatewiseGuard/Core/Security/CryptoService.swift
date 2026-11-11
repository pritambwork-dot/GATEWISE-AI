import Foundation
import CryptoKit

public protocol CryptoServiceProtocol: Sendable {
    func generateDecisionSignature(
        eventId: String,
        guardId: String,
        gateId: String,
        decision: String,
        timestamp: String,
        salt: String
    ) -> String
    
    func sha256Hex(data: Data) -> String
}

public final class CryptoService: CryptoServiceProtocol {
    public static let shared = CryptoService()
    
    public init() {}
    
    public func generateDecisionSignature(
        eventId: String,
        guardId: String,
        gateId: String,
        decision: String,
        timestamp: String,
        salt: String
    ) -> String {
        let payload = "\(eventId)|\(guardId)|\(gateId)|\(decision)|\(timestamp)"
        let key = SymmetricKey(data: Data(salt.utf8))
        let signature = HMAC<SHA256>.authenticationCode(for: Data(payload.utf8), using: key)
        return signature.map { String(format: "%02hhx", $0) }.joined()
    }
    
    public func sha256Hex(data: Data) -> String {
        let digest = SHA256.hash(data: data)
        return digest.map { String(format: "%02hhx", $0) }.joined()
    }
}
