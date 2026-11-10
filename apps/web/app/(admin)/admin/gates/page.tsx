export default function GatesAdminPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-gatewise-text">Gate Posts & Operational Stations</h1>
      <p className="text-xs text-gatewise-secondary">
        Station definitions, gate operating windows, and terminal hardware status.
      </p>
      <div className="p-6 rounded-2xl bg-white border border-gatewise-border text-xs text-gatewise-secondary">
        Gate post management module configured. Connects to <code>/api/v1/gates/</code>.
      </div>
    </div>
  );
}
