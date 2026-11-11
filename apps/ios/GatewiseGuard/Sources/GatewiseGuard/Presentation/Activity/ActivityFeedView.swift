import SwiftUI

public struct ActivityFeedView: View {
    @Environment(AppState.self) private var appState
    @State private var events: [VerificationEvent] = MockDataFixtures.sampleEvents
    @State private var searchText: String = ""
    @State private var selectedFilter: String = "ALL"
    @State private var selectedEvent: VerificationEvent? = nil
    
    public init() {}
    
    private var filteredEvents: [VerificationEvent] {
        events.filter { event in
            let matchesSearch = searchText.isEmpty ||
                (event.personName?.localizedCaseInsensitiveContains(searchText) ?? false) ||
                (event.personId?.localizedCaseInsensitiveContains(searchText) ?? false) ||
                event.decision.title.localizedCaseInsensitiveContains(searchText)
            
            guard matchesSearch else { return false }
            
            switch selectedFilter {
            case "AUTHORIZED":
                return event.decision == .grantEntry
            case "DENIED":
                return event.decision == .denyEntry
            case "REVIEW":
                return event.decision == .escalateToAdmin || event.decision == .referToVisitorDesk
            default:
                return true
            }
        }
    }
    
    public var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Search Bar
                HStack(spacing: 8) {
                    Image(systemName: GatewiseIcons.search)
                        .foregroundColor(GatewiseColors.textSecondary)
                    TextField("Search subject name, ID, or action...", text: $searchText)
                        .font(GatewiseTypography.body)
                    if !searchText.isEmpty {
                        Button(action: { searchText = "" }) {
                            Image(systemName: "xmark.circle.fill")
                                .foregroundColor(GatewiseColors.textMuted)
                        }
                    }
                }
                .padding(.horizontal, 14)
                .frame(height: 44)
                .background(GatewiseColors.surfaceSecondary)
                .clipShape(RoundedRectangle(cornerRadius: 12, style: .continuous))
                .padding(.horizontal, 16)
                .padding(.top, 12)
                
                // Category Filter Pills
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        filterPill(title: "All Events", filter: "ALL")
                        filterPill(title: "Authorized (Admitted)", filter: "AUTHORIZED")
                        filterPill(title: "Denied", filter: "DENIED")
                        filterPill(title: "Referrals & Reviews", filter: "REVIEW")
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 10)
                }
                
                // Events List
                List {
                    ForEach(filteredEvents) { event in
                        Button(action: { selectedEvent = event }) {
                            eventRow(event: event)
                        }
                        .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
                        .listRowSeparator(.hidden)
                        .listRowBackground(Color.clear)
                    }
                }
                .listStyle(.plain)
                .refreshable {
                    // Pull to refresh simulated
                    try? await Task.sleep(nanoseconds: 300_000_000)
                }
            }
            .background(GatewiseColors.background)
            .navigationTitle("Activity History")
            .inlineNavigationBarTitle()
            .sheet(item: $selectedEvent) { event in
                EventDetailSheet(event: event)
            }
        }
    }
    
    private func filterPill(title: String, filter: String) -> some View {
        Button(action: { selectedFilter = filter }) {
            Text(title)
                .font(GatewiseTypography.captionBold)
                .foregroundColor(selectedFilter == filter ? .white : GatewiseColors.textSecondary)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(selectedFilter == filter ? GatewiseColors.primary : GatewiseColors.surface)
                .clipShape(Capsule())
                .overlay(Capsule().stroke(selectedFilter == filter ? Color.clear : GatewiseColors.borderSubtle, lineWidth: 1))
        }
    }
    
    private func eventRow(event: VerificationEvent) -> some View {
        GatewiseCard(padding: 14) {
            VStack(alignment: .leading, spacing: 10) {
                HStack {
                    ZStack {
                        Circle()
                            .fill(GatewiseColors.lightGreen)
                            .frame(width: 36, height: 36)
                        Image(systemName: "person.fill")
                            .font(.system(size: 16))
                            .foregroundColor(GatewiseColors.deep)
                    }
                    
                    VStack(alignment: .leading, spacing: 2) {
                        Text(event.personName ?? "Unregistered Individual")
                            .font(GatewiseTypography.headline)
                            .foregroundColor(GatewiseColors.textPrimary)
                        Text("\(event.personId ?? "N/A") · \(event.personCategory ?? "VISITOR")")
                            .font(GatewiseTypography.caption)
                            .foregroundColor(GatewiseColors.textSecondary)
                    }
                    
                    Spacer()
                    
                    Text(event.timestamp)
                        .font(GatewiseTypography.caption)
                        .foregroundColor(GatewiseColors.textMuted)
                }
                
                Divider()
                
                HStack {
                    StatusBadgeView(outcome: event.outcome)
                    Spacer()
                    HStack(spacing: 4) {
                        Image(systemName: event.decision.iconName)
                            .font(.system(size: 13))
                        Text(event.decision.title)
                            .font(GatewiseTypography.captionBold)
                    }
                    .foregroundColor(GatewiseColors.deep)
                }
            }
        }
    }
}

private struct EventDetailSheet: View {
    @Environment(\.dismiss) private var dismiss
    let event: VerificationEvent
    
    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 16) {
                    GatewiseCard(padding: 16) {
                        VStack(alignment: .leading, spacing: 12) {
                            Text(event.personName ?? "Unregistered Individual")
                                .font(GatewiseTypography.sectionTitle)
                                .foregroundColor(GatewiseColors.textPrimary)
                            
                            HStack {
                                StatusBadgeView(outcome: event.outcome)
                                Spacer()
                                Text(event.timestamp)
                                    .font(GatewiseTypography.caption)
                                    .foregroundColor(GatewiseColors.textSecondary)
                            }
                            
                            Divider()
                            
                            detailItem(label: "Station Gate", value: event.gateName)
                            detailItem(label: "Recording Officer", value: "\(event.officerName) (\(event.officerId))")
                            detailItem(label: "Decision Committed", value: event.decision.title)
                            if let notes = event.notes {
                                detailItem(label: "Officer Remarks", value: notes)
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                    
                    // Sealed Signature Card
                    CryptographicSealCard(signature: event.signature, timestamp: event.timestamp)
                        .padding(.horizontal, 16)
                }
                .padding(.top, 16)
            }
            .background(GatewiseColors.background)
            .navigationTitle("Event Verification Record")
            .inlineNavigationBarTitle()
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") { dismiss() }
                }
            }
        }
    }
    
    private func detailItem(label: String, value: String) -> some View {
        VStack(alignment: .leading, spacing: 2) {
            Text(label)
                .font(GatewiseTypography.captionBold)
                .foregroundColor(GatewiseColors.textSecondary)
            Text(value)
                .font(GatewiseTypography.body)
                .foregroundColor(GatewiseColors.textPrimary)
        }
    }
}
