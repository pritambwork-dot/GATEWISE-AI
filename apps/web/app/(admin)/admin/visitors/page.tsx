export default function VisitorsAdminPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-gatewise-text">Visitor Passes & Campus Access</h1>
      <p className="text-xs text-gatewise-secondary">
        Manage pre-approved visitor passes, on-campus check-ins, and departures.
      </p>
      <div className="p-6 rounded-2xl bg-white border border-gatewise-border text-xs text-gatewise-secondary">
        Visitor management module configured. Connects to <code>/api/v1/visitors/</code>.
      </div>
    </div>
  );
}
