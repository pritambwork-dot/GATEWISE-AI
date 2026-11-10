export default function SettingsAdminPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-gatewise-text">Institutional System Settings</h1>
      <p className="text-xs text-gatewise-secondary">
        Biometric matching thresholds, audit retention windows, and encryption parameters.
      </p>
      <div className="p-6 rounded-2xl bg-white border border-gatewise-border text-xs text-gatewise-secondary">
        Configuration settings configured. Auto-match confidence threshold: 90%; Candidate threshold: 70%.
      </div>
    </div>
  );
}
