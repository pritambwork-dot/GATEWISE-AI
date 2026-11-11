import Foundation

public enum NetworkError: Error, LocalizedError, Sendable {
    case invalidURL
    case invalidResponse
    case unauthorized
    case forbidden
    case notFound
    case serverError(statusCode: Int, message: String?)
    case decodingError(String)
    case offline
    case custom(String)
    
    public var errorDescription: String? {
        switch self {
        case .invalidURL:
            return "Invalid API Endpoint URL."
        case .invalidResponse:
            return "Unexpected server response."
        case .unauthorized:
            return "Session expired or invalid credentials. Please sign in again."
        case .forbidden:
            return "Access denied for this gate terminal."
        case .notFound:
            return "Requested resource was not found."
        case .serverError(let code, let msg):
            return msg ?? "Server encountered an error (HTTP \(code))."
        case .decodingError(let details):
            return "Data formatting error: \(details)"
        case .offline:
            return "Network connection unavailable. Offline fallback active."
        case .custom(let message):
            return message
        }
    }
}

public enum HTTPMethod: String, Sendable {
    case get = "GET"
    case post = "POST"
    case put = "PUT"
    case delete = "DELETE"
}

public struct APIEndpoint: Sendable {
    public let path: String
    public let method: HTTPMethod
    public let headers: [String: String]
    public let queryItems: [URLQueryItem]?
    public let body: Data?
    
    public init(
        path: String,
        method: HTTPMethod = .get,
        headers: [String: String] = [:],
        queryItems: [URLQueryItem]? = nil,
        body: Data? = nil
    ) {
        self.path = path
        self.method = method
        self.headers = headers
        self.queryItems = queryItems
        self.body = body
    }
}
