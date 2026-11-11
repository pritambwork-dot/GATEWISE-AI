import SwiftUI

public struct StatusBadge: View {
    public enum StatusType {
        case success
        case warning
        case error
        case info
        case neutral
        
        var color: Color {
            switch self {
            case .success: return ColorTokens.statusSuccess
            case .warning: return ColorTokens.statusWarning
            case .error: return ColorTokens.statusError
            case .info: return ColorTokens.statusInfo
            case .neutral: return ColorTokens.textSecondary
            }
        }
    }
    
    public let text: String
    public let status: StatusType
    public let showPulseDot: Bool
    
    public init(text: String, status: StatusType = .success, showPulseDot: Bool = true) {
        self.text = text
        self.status = status
        self.showPulseDot = showPulseDot
    }
    
    public var body: some View {
        HStack(spacing: 6) {
            if showPulseDot {
                Circle()
                    .fill(status.color)
                    .frame(width: 6, height: 6)
            }
            Text(text)
                .font(TypographyTokens.caption2)
                .foregroundColor(status.color)
        }
        .padding(.horizontal, 10)
        .padding(.vertical, 4)
        .background(status.color.opacity(0.10))
        .clipShape(Capsule())
        .overlay {
            Capsule()
                .stroke(status.color.opacity(0.25), lineWidth: 1)
        }
    }
}
