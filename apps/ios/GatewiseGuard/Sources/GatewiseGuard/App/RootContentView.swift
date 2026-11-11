import SwiftUI

public struct RootContentView: View {
    @Environment(AppState.self) private var appState
    
    public init() {}
    
    public var body: some View {
        Group {
            if !appState.hasCompletedOnboarding {
                OnboardingView()
            } else if !appState.isAuthenticated {
                LoginView()
            } else {
                TabView(selection: Bindable(appState).activeTab) {
                    VerifyHomeView()
                        .tabItem {
                            Label("Verify", systemImage: GatewiseIcons.camera)
                        }
                        .tag(AppTab.verify)
                    
                    ActivityFeedView()
                        .tabItem {
                            Label("Activity", systemImage: GatewiseIcons.activity)
                        }
                        .tag(AppTab.activity)
                    
                    VisitorListView()
                        .tabItem {
                            Label("Visitors", systemImage: GatewiseIcons.visitors)
                        }
                        .tag(AppTab.visitors)
                    
                    AdminDashboardView()
                        .tabItem {
                            Label("Command", systemImage: "shield.lefthalf.filled")
                        }
                        .tag(AppTab.adminDashboard)
                    
                    GuardProfileView()
                        .tabItem {
                            Label("Profile", systemImage: GatewiseIcons.profile)
                        }
                        .tag(AppTab.profile)
                }
                .tint(GatewiseColors.primary)
            }
        }
    }
}
