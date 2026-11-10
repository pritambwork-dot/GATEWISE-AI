export default function PeopleAdminPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-gatewise-text">Institutional Campus Directory</h1>
      <p className="text-xs text-gatewise-secondary">
        Directory of enrolled students, faculty members, administrative staff, and contractors.
      </p>
      <div className="p-6 rounded-2xl bg-white border border-gatewise-border text-xs text-gatewise-secondary">
        Campus directory module configured. Connects to <code>/api/v1/identities/</code>.
      </div>
    </div>
  );
}
