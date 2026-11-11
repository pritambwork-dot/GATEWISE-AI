// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "GatewiseGuard",
    defaultLocalization: "en",
    platforms: [
        .iOS(.v17),
        .macOS(.v14)
    ],
    products: [
        .library(
            name: "GatewiseGuard",
            targets: ["GatewiseGuard"]
        ),
        .executable(
            name: "GatewiseGuardRunner",
            targets: ["GatewiseGuardRunner"]
        ),
    ],
    dependencies: [],
    targets: [
        .target(
            name: "GatewiseGuard",
            dependencies: [],
            path: "Sources/GatewiseGuard",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency")
            ]
        ),
        .executableTarget(
            name: "GatewiseGuardRunner",
            dependencies: ["GatewiseGuard"],
            path: "Sources/GatewiseGuardRunner",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency")
            ]
        ),
    ]
)
