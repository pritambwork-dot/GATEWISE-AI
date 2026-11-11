import SwiftUI

public struct CameraCaptureView: View {
    @Environment(\.dismiss) private var dismiss
    @Environment(AppState.self) private var appState
    public let onPhotoCaptured: () -> Void
    
    @State private var isTorchOn: Bool = false
    @State private var isFacingFront: Bool = false
    @State private var isCapturing: Bool = false
    
    public init(onPhotoCaptured: @escaping () -> Void) {
        self.onPhotoCaptured = onPhotoCaptured
    }
    
    public var body: some View {
        ZStack {
            // Viewfinder Simulated / Hardware Surface
            Color.black.ignoresSafeArea()
            
            // Simulated video feed background with ambient grain
            VStack {
                Spacer()
                Image(systemName: "person.fill")
                    .resizable()
                    .scaledToFit()
                    .frame(width: 180, height: 240)
                    .foregroundColor(Color.white.opacity(0.12))
                Spacer()
            }
            
            // Camera Overlay Controls
            VStack {
                // Top Controls Bar
                HStack {
                    Button(action: { dismiss() }) {
                        Image(systemName: GatewiseIcons.close)
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(.white)
                            .frame(width: 44, height: 44)
                            .background(Color.black.opacity(0.6))
                            .clipShape(Circle())
                            .overlay(Circle().stroke(Color.white.opacity(0.2), lineWidth: 1))
                    }
                    
                    Spacer()
                    
                    // Telemetry and Light Meter
                    HStack(spacing: 6) {
                        Circle()
                            .fill(GatewiseColors.primary)
                            .frame(width: 7, height: 7)
                        Text("POST 02 · LIGHT: 91%")
                            .font(GatewiseTypography.badge)
                            .foregroundColor(.white)
                    }
                    .padding(.horizontal, 12)
                    .padding(.vertical, 6)
                    .background(Color.black.opacity(0.65))
                    .clipShape(Capsule())
                    .overlay(Capsule().stroke(Color.white.opacity(0.2), lineWidth: 1))
                    
                    Spacer()
                    
                    Button(action: { isTorchOn.toggle() }) {
                        Image(systemName: isTorchOn ? GatewiseIcons.torchOn : GatewiseIcons.torchOff)
                            .font(.system(size: 16, weight: .bold))
                            .foregroundColor(isTorchOn ? .yellow : .white)
                            .frame(width: 44, height: 44)
                            .background(Color.black.opacity(0.6))
                            .clipShape(Circle())
                            .overlay(Circle().stroke(Color.white.opacity(0.2), lineWidth: 1))
                    }
                }
                .padding(.horizontal, 20)
                .padding(.top, 16)
                
                Spacer()
                
                // Center Reticle Oval with Alignment Brackets
                VStack(spacing: 12) {
                    ZStack {
                        // Oval outline
                        Ellipse()
                            .stroke(Color.white.opacity(0.85), lineWidth: 2)
                            .frame(width: 250, height: 340)
                        
                        // Corner Alignment Brackets
                        VStack {
                            HStack {
                                BracketShape(corner: .topLeft)
                                Spacer()
                                BracketShape(corner: .topRight)
                            }
                            Spacer()
                            HStack {
                                BracketShape(corner: .bottomLeft)
                                Spacer()
                                BracketShape(corner: .bottomRight)
                            }
                        }
                        .frame(width: 260, height: 350)
                        .foregroundColor(GatewiseColors.mint)
                    }
                    
                    // Reticle Label
                    HStack(spacing: 6) {
                        Image(systemName: GatewiseIcons.reticle)
                            .font(.system(size: 12))
                            .foregroundColor(.white)
                        Text("POSITION FACE INSIDE OVAL")
                            .font(GatewiseTypography.badge)
                            .foregroundColor(.white)
                    }
                    .padding(.horizontal, 14)
                    .padding(.vertical, 6)
                    .background(Color.black.opacity(0.65))
                    .clipShape(Capsule())
                    .overlay(Capsule().stroke(Color.white.opacity(0.2), lineWidth: 1))
                }
                
                Spacer()
                
                // Bottom Shutter Dock
                HStack(spacing: 40) {
                    // Test state shortcut
                    Button(action: { triggerCapture() }) {
                        VStack(spacing: 4) {
                            Image(systemName: "flask.fill")
                                .font(.system(size: 20))
                                .foregroundColor(.white)
                            Text("Test State")
                                .font(GatewiseTypography.caption)
                                .foregroundColor(.white)
                        }
                        .frame(width: 60)
                    }
                    
                    // 72dp Circular Shutter Button
                    Button(action: { triggerCapture() }) {
                        ZStack {
                            Circle()
                                .stroke(Color.white, lineWidth: 4)
                                .frame(width: 76, height: 76)
                            Circle()
                                .fill(Color.white)
                                .frame(width: 62, height: 62)
                        }
                    }
                    
                    // Camera Flip
                    Button(action: { isFacingFront.toggle() }) {
                        VStack(spacing: 4) {
                            Image(systemName: GatewiseIcons.cameraFlip)
                                .font(.system(size: 20))
                                .foregroundColor(.white)
                            Text("Flip")
                                .font(GatewiseTypography.caption)
                                .foregroundColor(.white)
                        }
                        .frame(width: 60)
                    }
                }
                .padding(.bottom, 36)
                .padding(.top, 16)
                .frame(maxWidth: .infinity)
                .background(Color.black.opacity(0.45))
            }
        }
    }
    
    private func triggerCapture() {
        #if os(iOS)
        let generator = UIImpactFeedbackGenerator(style: .rigid)
        generator.impactOccurred()
        #endif
        
        onPhotoCaptured()
    }
}

private struct BracketShape: View {
    enum Corner {
        case topLeft, topRight, bottomLeft, bottomRight
    }
    let corner: Corner
    
    var body: some View {
        Path { path in
            switch corner {
            case .topLeft:
                path.move(to: CGPoint(x: 0, y: 20))
                path.addLine(to: CGPoint(x: 0, y: 0))
                path.addLine(to: CGPoint(x: 20, y: 0))
            case .topRight:
                path.move(to: CGPoint(x: 0, y: 0))
                path.addLine(to: CGPoint(x: 20, y: 0))
                path.addLine(to: CGPoint(x: 20, y: 20))
            case .bottomLeft:
                path.move(to: CGPoint(x: 0, y: 0))
                path.addLine(to: CGPoint(x: 0, y: 20))
                path.addLine(to: CGPoint(x: 20, y: 20))
            case .bottomRight:
                path.move(to: CGPoint(x: 20, y: 0))
                path.addLine(to: CGPoint(x: 20, y: 20))
                path.addLine(to: CGPoint(x: 0, y: 20))
            }
        }
        .stroke(style: StrokeStyle(lineWidth: 3.5, lineCap: .round, lineJoin: .round))
        .frame(width: 20, height: 20)
    }
}
