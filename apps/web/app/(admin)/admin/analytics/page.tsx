export default function AnalyticsAdminPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-extrabold text-gatewise-text">Campus Security Analytics</h1>
      <p className="text-xs text-gatewise-secondary">
        Hourly campus inflow dynamics, exception distributions, and auto-match confidence metrics.
      </p>
      <div className="p-6 rounded-2xl bg-white border border-gatewise-border text-xs text-gatewise-secondary">
        Analytics module configured. Connects to <code>/api/v1/analytics/dashboard</code>.
      </div>
    </div>
  );
}
