import SwiftUI

public enum GuardTab: String, CaseIterable, Identifiable, Sendable {
    case verify = "Verify"
    case visitors = "Visitors"
    case activity = "Activity"
    case profile = "Profile"
    case admin = "Command"
    
    public var id: String { rawValue }
    
    public var iconName: String {
        switch self {
        case .verify: return "viewfinder"
        case .visitors: return "person.badge.shield.checkmark"
        case .activity: return "clock.arrow.circlepath"
        case .profile: return "shield.lefthalf.filled"
        case .admin: return "building.columns.fill"
        }
    }
}

public struct AppTabBar: View {
    @Binding public var selectedTab: GuardTab
    public let showAdminTab: Bool
    
    public init(selectedTab: Binding<GuardTab>, showAdminTab: Bool = false) {
        self._selectedTab = selectedTab
        self.showAdminTab = showAdminTab
    }
    
    public var body: some View {
        HStack(spacing: 0) {
            ForEach(availableTabs, id: \.self) { tab in
                let isSelected = selectedTab == tab
                
                Button {
                    HapticTokens.selection()
                    withAnimation(MotionTokens.snappy) {
                        selectedTab = tab
                    }
                } label: {
                    VStack(spacing: 4) {
                        Image(systemName: tab.iconName)
                            .font(.system(size: isSelected ? 19 : 17, weight: isSelected ? .bold : .regular))
                            .foregroundColor(isSelected ? ColorTokens.brandPrimary : ColorTokens.textSecondary)
                        
                        Text(tab.rawValue)
                            .font(TypographyTokens.caption2)
                            .foregroundColor(isSelected ? ColorTokens.brandPrimary : ColorTokens.textSecondary)
                    }
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 8)
                }
            }
        }
        .padding(.horizontal, 8)
        .padding(.vertical, 6)
        .background(.ultraThinMaterial)
        .clipShape(Capsule())
        .overlay {
            Capsule()
                .stroke(ColorTokens.glassBorder, lineWidth: 1)
        }
        .shadow(color: Color.black.opacity(0.12), radius: 14, x: 0, y: 5)
        .padding(.horizontal, 24)
        .padding(.bottom, 8)
    }
    
    private var availableTabs: [GuardTab] {
        if showAdminTab {
            return GuardTab.allCases
        }
        return GuardTab.allCases.filter { $0 != .admin }
    }
}
