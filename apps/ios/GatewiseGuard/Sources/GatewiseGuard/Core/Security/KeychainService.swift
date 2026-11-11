import Foundation
import Security

public protocol KeychainServiceProtocol: Sendable {
    func save(key: String, value: String) throws
    func get(key: String) -> String?
    func delete(key: String) throws
    func clearAll() throws
}

public final class KeychainService: KeychainServiceProtocol {
    public static let shared = KeychainService()
    
    private let serviceName = "com.gatewiseai.guard.keychain"
    
    public init() {}
    
    public func save(key: String, value: String) throws {
        guard let data = value.data(using: .utf8) else { return }
        
        // Remove existing item if present
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: serviceName,
            kSecAttrAccount as String: key
        ]
        SecItemDelete(query as CFDictionary)
        
        // Add new item
        let attributes: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: serviceName,
            kSecAttrAccount as String: key,
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleAfterFirstUnlockThisDeviceOnly
        ]
        
        let status = SecItemAdd(attributes as CFDictionary, nil)
        guard status == errSecSuccess else {
            throw KeychainError.saveFailed(status: status)
        }
    }
    
    public func get(key: String) -> String? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: serviceName,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]
        
        var dataTypeRef: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &dataTypeRef)
        
        guard status == errSecSuccess, let data = dataTypeRef as? Data else {
            return nil
        }
        
        return String(data: data, encoding: .utf8)
    }
    
    public func delete(key: String) throws {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: serviceName,
            kSecAttrAccount as String: key
        ]
        let status = SecItemDelete(query as CFDictionary)
        guard status == errSecSuccess || status == errSecItemNotFound else {
            throw KeychainError.deleteFailed(status: status)
        }
    }
    
    public func clearAll() throws {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: serviceName
        ]
        let status = SecItemDelete(query as CFDictionary)
        guard status == errSecSuccess || status == errSecItemNotFound else {
            throw KeychainError.deleteFailed(status: status)
        }
    }
}

public enum KeychainError: Error, LocalizedError {
    case saveFailed(status: OSStatus)
    case deleteFailed(status: OSStatus)
    
    public var errorDescription: String? {
        switch self {
        case .saveFailed(let status):
            return "Failed to save item to Keychain (status: \(status))"
        case .deleteFailed(let status):
            return "Failed to delete item from Keychain (status: \(status))"
        }
    }
}
