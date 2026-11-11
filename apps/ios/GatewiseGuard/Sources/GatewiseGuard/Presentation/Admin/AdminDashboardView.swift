import SwiftUI

public struct AdminDashboardView: View {
    @Environment(AppState.self) private var appState
    @State private var totalScans: Int = 148
    @State private var authorizedCount: Int = 139
    @State private var denialCount: Int = 7
    @State private var activeGates: Int = 4
    
    public init() {}
    
    public var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 16) {
                    // Header Telemetry Badge
                    HStack {
                        VStack(alignment: .leading, spacing: 2) {
                            Text("CENTRAL SECURITY COMMAND")
                                .font(GatewiseTypography.badge)
                                .foregroundColor(GatewiseColors.deep)
                            Text("Campus Real-Time Telemetry")
                                .font(GatewiseTypography.sectionTitle)
                                .foregroundColor(GatewiseColors.textPrimary)
                        }
                        Spacer()
                        HStack(spacing: 6) {
                            Circle().fill(GatewiseColors.primary).frame(width: 8, height: 8)
                            Text("LIVE FEED")
                                .font(GatewiseTypography.badge)
                                .foregroundColor(GatewiseColors.primary)
                        }
                        .padding(.horizontal, 10)
                        .padding(.vertical, 4)
                        .background(GatewiseColors.lightGreen)
                        .clipShape(Capsule())
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 16)
                    
                    // High-Level KPI Matrix
                    LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                        kpiCard(title: "Total Verifications", value: "\(totalScans)", subtitle: "Past 12 Hours", tint: GatewiseColors.textPrimary)
                        kpiCard(title: "Pass Rate", value: "93.9%", subtitle: "\(authorizedCount) Admitted", tint: GatewiseColors.primary)
                        kpiCard(title: "Active Gate Posts", value: "\(activeGates) / 4", subtitle: "All Relays Healthy", tint: GatewiseColors.deep)
                        kpiCard(title: "Flagged Incidents", value: "\(denialCount)", subtitle: "Requires Review", tint: GatewiseColors.error)
                    }
                    .padding(.horizontal, 16)
                    
                    // Station Relay Telemetry
                    GatewiseCard(padding: 16) {
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Physical Gate Barrier Status")
                                .font(GatewiseTypography.cardTitle)
                                .foregroundColor(GatewiseColors.textPrimary)
                            
                            stationRow(code: "GATE-MAIN-02", name: "Main Campus Gate · Post 02", guardName: "Officer Ramesh Verma", status: "LOCKED & ACTIVE")
                            Divider()
                            stationRow(code: "GATE-NORTH-01", name: "North Pedestrian Turnstile", guardName: "Officer Sunita Roy", status: "LOCKED & ACTIVE")
                            Divider()
                            stationRow(code: "GATE-SOUTH-03", name: "South Logistics Bay", guardName: "Officer Alok Das", status: "STANDBY")
                        }
                    }
                    .padding(.horizontal, 16)
                    
                    // Recent Live Activity Stream
                    GatewiseCard(padding: 16) {
                        VStack(alignment: .leading, spacing: 10) {
                            Text("Recent Gatehouse Admissions")
                                .font(GatewiseTypography.cardTitle)
                                .foregroundColor(GatewiseColors.textPrimary)
                            
                            ForEach(MockDataFixtures.sampleEvents) { evt in
                                HStack {
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text(evt.personName ?? "Unknown")
                                            .font(GatewiseTypography.headline)
                                            .foregroundColor(GatewiseColors.textPrimary)
                                        Text("\(evt.gateName) · \(evt.timestamp)")
                                            .font(GatewiseTypography.caption)
                                            .foregroundColor(GatewiseColors.textSecondary)
                                    }
                                    Spacer()
                                    StatusBadgeView(outcome: evt.outcome)
                                }
                                .padding(.vertical, 4)
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.bottom, 24)
                }
            }
            .background(GatewiseColors.background)
            .navigationTitle("Command Centre")
            .inlineNavigationBarTitle()
        }
    }
    
    private func kpiCard(title: String, value: String, subtitle: String, tint: Color) -> some View {
        GatewiseCard(padding: 14) {
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(GatewiseTypography.caption)
                    .foregroundColor(GatewiseColors.textSecondary)
                Text(value)
                    .font(.system(size: 24, weight: .bold))
                    .foregroundColor(tint)
                Text(subtitle)
                    .font(GatewiseTypography.caption)
                    .foregroundColor(GatewiseColors.textMuted)
            }
        }
    }
    
    private func stationRow(code: String, name: String, guardName: String, status: String) -> some View {
        HStack {
            VStack(alignment: .leading, spacing: 2) {
                Text(name)
                    .font(GatewiseTypography.headline)
                    .foregroundColor(GatewiseColors.textPrimary)
                Text("Assigned: \(guardName) · Code: \(code)")
                    .font(GatewiseTypography.caption)
                    .foregroundColor(GatewiseColors.textSecondary)
            }
            Spacer()
            Text(status)
                .font(GatewiseTypography.badge)
                .foregroundColor(status.contains("ACTIVE") ? GatewiseColors.primary : GatewiseColors.warning)
                .padding(.horizontal, 8)
                .padding(.vertical, 4)
                .background(GatewiseColors.surfaceSecondary)
                .clipShape(Capsule())
        }
    }
}
