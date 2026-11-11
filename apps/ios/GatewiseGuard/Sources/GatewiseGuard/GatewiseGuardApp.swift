import SwiftUI

public struct GatewiseGuardApp: App {
    @State private var appState = AppState()
    
    public init() {}
    
    public var body: some Scene {
        WindowGroup {
            RootContentView()
                .environment(appState)
                .preferredColorScheme(.light)
        }
    }
}
