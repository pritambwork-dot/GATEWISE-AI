import Foundation

public struct SupabaseConfiguration: Sendable {
    public let url: URL
    public let anonKey: String
    
    public init(
        url: URL = URL(string: "http://localhost:8000")!,
        anonKey: String = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.gatewise_anon"
    ) {
        self.url = url
        self.anonKey = anonKey
    }
}

public actor SupabaseManager {
    public static let shared = SupabaseManager()
    
    private let config: SupabaseConfiguration
    private var authToken: String?
    
    public init(config: SupabaseConfiguration = SupabaseConfiguration()) {
        self.config = config
    }
    
    public func setSessionToken(_ token: String?) {
        self.authToken = token
    }
    
    public func getSessionToken() -> String? {
        return authToken
    }
    
    public func getBaseURL() -> URL {
        return config.url
    }
}

public actor AuthManager {
    public static let shared = AuthManager()
    private let keychain: KeychainServiceProtocol
    
    public init(keychain: KeychainServiceProtocol = KeychainService.shared) {
        self.keychain = keychain
    }
    
    public func restoreSession() -> String? {
        keychain.get(key: "gatewise_auth_token")
    }
    
    public func persistSession(token: String) throws {
        try keychain.save(key: "gatewise_auth_token", value: token)
    }
    
    public func clearSession() throws {
        try keychain.delete(key: "gatewise_auth_token")
    }
}

public actor RealtimeManager {
    public static let shared = RealtimeManager()
    private var activeChannels: Set<String> = []
    
    public init() {}
    
    public func subscribe(channel: String, onEvent: @escaping @Sendable (String) -> Void) {
        activeChannels.insert(channel)
    }
    
    public func unsubscribe(channel: String) {
        activeChannels.remove(channel)
    }
    
    public func getSubscribedChannels() -> [String] {
        Array(activeChannels)
    }
}

public actor StorageManager {
    public static let shared = StorageManager()
    
    public init() {}
    
    public func getPublicURL(bucket: String, path: String) -> URL? {
        URL(string: "http://localhost:8000/storage/v1/object/public/\(bucket)/\(path)")
    }
    
    public func upload(bucket: String, path: String, data: Data) async throws -> String {
        return "storage/\(bucket)/\(path)"
    }
}
