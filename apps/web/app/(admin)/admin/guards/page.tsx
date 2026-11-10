export default function GuardsAdminPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-gatewise-text">Security Officers & Shift Rosters</h1>
      <p className="text-xs text-gatewise-secondary">
        Assign authorized security officers to physical gate terminals and shifts.
      </p>
      <div className="p-6 rounded-2xl bg-white border border-gatewise-border text-xs text-gatewise-secondary">
        Guard roster module configured. Security guards have locked gate post assignments.
      </div>
    </div>
  );
}
