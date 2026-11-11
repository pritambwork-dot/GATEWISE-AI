import Foundation

public actor GatewiseAPIClient {
    private let baseURL: URL
    private let session: URLSession
    private var authToken: String?
    
    public init(
        baseURL: URL = URL(string: "http://localhost:8000/api/v1")!,
        session: URLSession = .shared
    ) {
        self.baseURL = baseURL
        self.session = session
    }
    
    public func setAuthToken(_ token: String?) {
        self.authToken = token
    }
    
    public func execute<T: Decodable & Sendable>(endpoint: APIEndpoint) async throws -> T {
        var components = URLComponents(url: baseURL.appendingPathComponent(endpoint.path), resolvingAgainstBaseURL: true)
        if let queryItems = endpoint.queryItems, !queryItems.isEmpty {
            components?.queryItems = queryItems
        }
        
        guard let url = components?.url else {
            throw NetworkError.invalidURL
        }
        
        var request = URLRequest(url: url)
        request.httpMethod = endpoint.method.rawValue
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("application/json", forHTTPHeaderField: "Accept")
        
        if let token = authToken {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
        
        for (headerKey, headerValue) in endpoint.headers {
            request.setValue(headerValue, forHTTPHeaderField: headerKey)
        }
        
        if let body = endpoint.body {
            request.httpBody = body
        }
        
        let (data, response) = try await session.data(for: request)
        
        guard let httpResponse = response as? HTTPURLResponse else {
            throw NetworkError.invalidResponse
        }
        
        switch httpResponse.statusCode {
        case 200...299:
            do {
                let decoder = JSONDecoder()
                decoder.keyDecodingStrategy = .convertFromSnakeCase
                decoder.dateDecodingStrategy = .iso8601
                return try decoder.decode(T.self, from: data)
            } catch {
                throw NetworkError.decodingError(error.localizedDescription)
            }
        case 401:
            throw NetworkError.unauthorized
        case 403:
            throw NetworkError.forbidden
        case 404:
            throw NetworkError.notFound
        default:
            let serverMsg = String(data: data, encoding: .utf8)
            throw NetworkError.serverError(statusCode: httpResponse.statusCode, message: serverMsg)
        }
    }
}
