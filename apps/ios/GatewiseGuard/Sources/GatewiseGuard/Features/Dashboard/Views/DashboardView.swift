import SwiftUI
import Observation

@Observable
@MainActor
public final class DashboardViewModel {
    public var telemetry: DashboardModel? = nil
    public var isLoading: Bool = false
    public var errorMessage: String? = nil
    
    private let activityRepo: ActivityRepositoryProtocol
    
    public init(activityRepo: ActivityRepositoryProtocol = RemoteActivityRepository(apiClient: GatewiseAPIClient())) {
        self.activityRepo = activityRepo
    }
    
    public func loadTelemetry() async {
        self.isLoading = true
        self.errorMessage = nil
        
        do {
            let events = try await activityRepo.getRecentEvents(gateId: "gate-post-02", limit: 20)
            let dto = DashboardTelemetryDTO(
                totalVerifications: 148,
                authorizedAdmissions: 139,
                deniedAccessCount: 7,
                activeGatesCount: 4,
                passRatePercentage: 93.9,
                systemHealthStatus: "HEALTHY",
                recentEvents: []
            )
            var model = DashboardMapper.map(dto: dto)
            if !events.isEmpty {
                model = DashboardModel(
                    totalScans: model.totalScans,
                    authorizedScans: model.authorizedScans,
                    deniedScans: model.deniedScans,
                    activeGates: model.activeGates,
                    passRate: model.passRate,
                    isHealthy: model.isHealthy,
                    events: events
                )
            }
            self.telemetry = model
            self.isLoading = false
        } catch {
            self.isLoading = false
            self.errorMessage = error.localizedDescription
        }
    }
}

public struct DashboardView: View {
    @State private var viewModel = DashboardViewModel()
    
    public init() {}
    
    public var body: some View {
        NavigationStack {
            Group {
                if viewModel.isLoading && viewModel.telemetry == nil {
                    LoadingView(message: "Streaming live station telemetry...")
                } else if let error = viewModel.errorMessage, viewModel.telemetry == nil {
                    ErrorView(message: error) {
                        Task { await viewModel.loadTelemetry() }
                    }
                } else if let data = viewModel.telemetry {
                    ScrollView {
                        VStack(spacing: 16) {
                            // Pinned Header
                            AppHeader(
                                title: "Central Security Command",
                                subtitle: "IIM Sambalpur Campus Gateway",
                                statusBadgeText: data.isHealthy ? "HEALTHY" : "DEGRADED",
                                isOnline: data.isHealthy
                            )
                            .padding(.top, 8)
                            
                            // High-Level KPI Matrix
                            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                                kpiTile(title: "Total Verifications", value: "\(data.totalScans)", subtitle: "Past 12 Hours", tint: GatewiseColors.textPrimary)
                                kpiTile(title: "Pass Rate", value: String(format: "%.1f%%", data.passRate), subtitle: "\(data.authorizedScans) Admitted", tint: GatewiseColors.primary)
                                kpiTile(title: "Active Gate Posts", value: "\(data.activeGates) / 4", subtitle: "All Relays Healthy", tint: GatewiseColors.deep)
                                kpiTile(title: "Flagged Incidents", value: "\(data.deniedScans)", subtitle: "Turn Away / Review", tint: GatewiseColors.error)
                            }
                            .padding(.horizontal, 16)
                            
                            // Physical Gate Stations Status
                            AppCard(padding: 16) {
                                VStack(alignment: .leading, spacing: 12) {
                                    Text("Physical Barrier Relay Telemetry")
                                        .font(GatewiseTypography.cardTitle)
                                        .foregroundColor(GatewiseColors.textPrimary)
                                    
                                    gateStatusRow(code: "GATE-MAIN-02", name: "Main Campus Gate · Post 02", guardName: "Officer Ramesh Verma", status: "LOCKED & ACTIVE")
                                    Divider()
                                    gateStatusRow(code: "GATE-NORTH-01", name: "North Pedestrian Turnstile", guardName: "Officer Sunita Roy", status: "LOCKED & ACTIVE")
                                    Divider()
                                    gateStatusRow(code: "GATE-SOUTH-03", name: "South Logistics Bay", guardName: "Officer Alok Das", status: "STANDBY")
                                }
                            }
                            .padding(.horizontal, 16)
                            
                            // Recent Live Admission Stream
                            AppCard(padding: 16) {
                                VStack(alignment: .leading, spacing: 12) {
                                    HStack {
                                        Text("Recent Gate Admissions")
                                            .font(GatewiseTypography.cardTitle)
                                            .foregroundColor(GatewiseColors.textPrimary)
                                        Spacer()
                                        Text("\(data.events.count) logged")
                                            .font(GatewiseTypography.caption)
                                            .foregroundColor(GatewiseColors.textMuted)
                                    }
                                    
                                    ForEach(data.events) { evt in
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
                    .refreshable {
                        await viewModel.loadTelemetry()
                    }
                } else {
                    EmptyStateView(
                        title: "No Telemetry Data",
                        description: "Tap below to connect to security cluster.",
                        actionTitle: "Connect Telemetry"
                    ) {
                        Task { await viewModel.loadTelemetry() }
                    }
                }
            }
            .background(GatewiseColors.background)
            .navigationTitle("Command Centre")
            .inlineNavigationBarTitle()
            .task {
                await viewModel.loadTelemetry()
            }
        }
    }
    
    private func kpiTile(title: String, value: String, subtitle: String, tint: Color) -> some View {
        AppCard(padding: 14) {
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
    
    private func gateStatusRow(code: String, name: String, guardName: String, status: String) -> some View {
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
