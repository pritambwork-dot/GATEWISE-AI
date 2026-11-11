import SwiftUI

public struct VisitorListView: View {
    @Environment(AppState.self) private var appState
    @State private var visitors: [VisitorPass] = MockDataFixtures.sampleVisitors
    @State private var showingIntake: Bool = false
    
    public init() {}
    
    public var body: some View {
        NavigationStack {
            List {
                Section {
                    Button(action: { showingIntake = true }) {
                        HStack(spacing: 12) {
                            ZStack {
                                Circle()
                                    .fill(GatewiseColors.lightGreen)
                                    .frame(width: 44, height: 44)
                                Image(systemName: "person.badge.plus")
                                    .font(.system(size: 20))
                                    .foregroundColor(GatewiseColors.primary)
                            }
                            
                            VStack(alignment: .leading, spacing: 2) {
                                Text("Register Walk-In Visitor")
                                    .font(GatewiseTypography.headline)
                                    .foregroundColor(GatewiseColors.deep)
                                Text("Issue instant digital gate pass with host verification")
                                    .font(GatewiseTypography.caption)
                                    .foregroundColor(GatewiseColors.textSecondary)
                            }
                            Spacer()
                            Image(systemName: "chevron.right")
                                .foregroundColor(GatewiseColors.deep)
                        }
                        .padding(.vertical, 4)
                    }
                }
                
                Section("Active Passes & Ledger") {
                    ForEach(visitors) { pass in
                        visitorRow(pass: pass)
                    }
                }
            }
            #if os(iOS)
            .listStyle(.insetGrouped)
            #else
            .listStyle(.automatic)
            #endif
            .navigationTitle("Visitor Management")
            .inlineNavigationBarTitle()
            .sheet(isPresented: $showingIntake) {
                VisitorIntakeView(onPassCreated: { newPass in
                    visitors.insert(newPass, at: 0)
                    showingIntake = false
                })
            }
        }
    }
    
    private func visitorRow(pass: VisitorPass) -> some View {
        VStack(alignment: .leading, spacing: 8) {
            HStack {
                Text(pass.visitorName)
                    .font(GatewiseTypography.headline)
                    .foregroundColor(GatewiseColors.textPrimary)
                Spacer()
                Text(pass.passCode)
                    .font(GatewiseTypography.badge)
                    .foregroundColor(GatewiseColors.deep)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 3)
                    .background(GatewiseColors.surfaceSecondary)
                    .clipShape(Capsule())
            }
            
            Text("Host: \(pass.hostName) (\(pass.hostDepartment)) · \(pass.purpose)")
                .font(GatewiseTypography.caption)
                .foregroundColor(GatewiseColors.textSecondary)
            
            HStack {
                Text("Check-In: \(pass.checkInTime)")
                    .font(GatewiseTypography.caption)
                    .foregroundColor(GatewiseColors.textMuted)
                Spacer()
                if pass.status == "CHECKED_IN" {
                    Button(action: {
                        checkoutPass(passId: pass.id)
                    }) {
                        Text("Process Departure")
                            .font(GatewiseTypography.captionBold)
                            .foregroundColor(.white)
                            .padding(.horizontal, 10)
                            .padding(.vertical, 5)
                            .background(GatewiseColors.primary)
                            .clipShape(Capsule())
                    }
                } else {
                    Text("CHECKED OUT")
                        .font(GatewiseTypography.badge)
                        .foregroundColor(GatewiseColors.textMuted)
                }
            }
        }
        .padding(.vertical, 4)
    }
    
    private func checkoutPass(passId: String) {
        if let idx = visitors.firstIndex(where: { $0.id == passId }) {
            visitors[idx] = VisitorPass(
                id: visitors[idx].id,
                passCode: visitors[idx].passCode,
                visitorName: visitors[idx].visitorName,
                phone: visitors[idx].phone,
                idType: visitors[idx].idType,
                idNumber: visitors[idx].idNumber,
                hostName: visitors[idx].hostName,
                hostDepartment: visitors[idx].hostDepartment,
                purpose: visitors[idx].purpose,
                gateId: visitors[idx].gateId,
                status: "CHECKED_OUT",
                checkInTime: visitors[idx].checkInTime,
                checkOutTime: "Now"
            )
        }
    }
}

public struct VisitorIntakeView: View {
    @Environment(\.dismiss) private var dismiss
    public let onPassCreated: (VisitorPass) -> Void
    
    @State private var visitorName: String = ""
    @State private var phone: String = ""
    @State private var idType: String = "Aadhaar Card"
    @State private var idNumber: String = ""
    @State private var hostName: String = ""
    @State private var hostDepartment: String = "Administration"
    @State private var purpose: String = ""
    @State private var isSubmitting: Bool = false
    
    private let idTypes = ["Aadhaar Card", "Driving License", "PAN Card", "Passport"]
    
    public init(onPassCreated: @escaping (VisitorPass) -> Void) {
        self.onPassCreated = onPassCreated
    }
    
    public var body: some View {
        NavigationStack {
            Form {
                Section("Visitor Identification") {
                    TextField("Full Name (e.g. Vikramaditya Das)", text: $visitorName)
                    TextField("Mobile Phone (e.g. +91 98765 43210)", text: $phone)
                    Picker("Government ID Type", selection: $idType) {
                        ForEach(idTypes, id: \.self) { Text($0) }
                    }
                    TextField("ID Document Number", text: $idNumber)
                }
                
                Section("Host Escort & Department") {
                    TextField("Host Faculty / Officer Name", text: $hostName)
                    TextField("Department / Division", text: $hostDepartment)
                    TextField("Visit Purpose (e.g. Guest Lecture, Vendor)", text: $purpose)
                }
                
                Section {
                    GatewisePrimaryButton(
                        title: "Issue Pass & Admit Visitor",
                        iconName: "person.crop.circle.badge.checkmark",
                        isLoading: isSubmitting
                    ) {
                        submitIntake()
                    }
                    .listRowInsets(EdgeInsets())
                    .listRowBackground(Color.clear)
                }
            }
            .navigationTitle("Visitor Intake")
            .inlineNavigationBarTitle()
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") { dismiss() }
                }
            }
        }
    }
    
    private func submitIntake() {
        guard !visitorName.isEmpty && !phone.isEmpty && !idNumber.isEmpty && !hostName.isEmpty else {
            return
        }
        
        isSubmitting = true
        let newPass = VisitorPass(
            id: UUID().uuidString,
            passCode: "PASS-\(Int.random(in: 1000...9999))",
            visitorName: visitorName,
            phone: phone,
            idType: idType,
            idNumber: idNumber,
            hostName: hostName,
            hostDepartment: hostDepartment,
            purpose: purpose.isEmpty ? "General Campus Visit" : purpose,
            gateId: "gate-post-02",
            status: "CHECKED_IN"
        )
        
        onPassCreated(newPass)
        isSubmitting = false
    }
}
