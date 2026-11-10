import { ShieldCheck, Activity, Users, Database } from 'lucide-react';

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold text-gatewise-text">Institutional Command Centre</h1>
        <p className="text-xs text-gatewise-secondary mt-1">
          Campus security telemetry, active gate monitoring, and identity synchronization status.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-gatewise-border shadow-sm">
          <span className="text-xs font-semibold text-gatewise-secondary">Operational Gates</span>
          <div className="text-2xl font-extrabold text-gatewise-text mt-1">3 / 3</div>
          <span className="text-[10px] text-gatewise-success font-semibold">All posts manned & locked</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gatewise-border shadow-sm">
          <span className="text-xs font-semibold text-gatewise-secondary">Today's Verifications</span>
          <div className="text-2xl font-extrabold text-gatewise-text mt-1">1,264</div>
          <span className="text-[10px] text-gatewise-secondary font-medium">98.4% auto match rate</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gatewise-border shadow-sm">
          <span className="text-xs font-semibold text-gatewise-secondary">Exceptions Logged</span>
          <div className="text-2xl font-extrabold text-gatewise-error mt-1">18</div>
          <span className="text-[10px] text-gatewise-secondary font-medium">Lapsed / expired credentials</span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-gatewise-border shadow-sm">
          <span className="text-xs font-semibold text-gatewise-secondary">Drive Sync Status</span>
          <div className="text-2xl font-extrabold text-gatewise-success mt-1">Synced</div>
          <span className="text-[10px] text-gatewise-secondary font-medium">5 institutional records</span>
        </div>
      </div>

      <div className="p-6 rounded-3xl bg-white border border-gatewise-border shadow-sm">
        <h2 className="text-sm font-bold text-gatewise-text">Command Centre Architecture Initialized</h2>
        <p className="text-xs text-gatewise-secondary mt-1 leading-relaxed">
          The Next.js App Router administrative layout separates public marketing from protected institutional access.
        </p>
      </div>
    </div>
  );
}
