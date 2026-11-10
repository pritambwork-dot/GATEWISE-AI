import Link from 'next/link';
import {
  ShieldCheck, LayoutDashboard, Activity, Users, UserPlus,
  DoorClosed, Shield, Database, BarChart3, Settings, LogOut
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/admin', label: 'Command Centre', icon: LayoutDashboard },
  { href: '/admin/activity', label: 'Event Audit Log', icon: Activity },
  { href: '/admin/people', label: 'Campus Directory', icon: Users },
  { href: '/admin/enrollment', label: 'Enrollment Referrals', icon: UserPlus },
  { href: '/admin/visitors', label: 'Visitor Passes', icon: Users },
  { href: '/admin/gates', label: 'Gate Posts', icon: DoorClosed },
  { href: '/admin/guards', label: 'Guards on Duty', icon: Shield },
  { href: '/admin/repository', label: 'Drive Sync', icon: Database },
  { href: '/admin/analytics', label: 'Campus Analytics', icon: BarChart3 },
  { href: '/admin/settings', label: 'System Settings', icon: Settings },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white border-r border-gatewise-border flex flex-col justify-between shrink-0">
        <div className="p-5 space-y-6">
          <Link href="/admin" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gatewise-primary flex items-center justify-center text-white font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm text-gatewise-text tracking-tight">GATEWISE<span className="text-gatewise-primary ml-0.5">AI</span></span>
              <span className="block text-[10px] text-gatewise-secondary font-medium">Command Centre</span>
            </div>
          </Link>

          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-gatewise-secondary hover:text-gatewise-text hover:bg-background-secondary transition-colors"
                >
                  <Icon className="w-4 h-4 text-gatewise-muted" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gatewise-border space-y-2">
          <div className="p-2.5 rounded-xl bg-background-secondary border border-gatewise-border text-[11px] space-y-0.5">
            <span className="font-semibold text-gatewise-text block">Dr. Rajesh Iyer</span>
            <span className="text-gatewise-secondary block">Chief Security Officer · ADM-001</span>
          </div>

          <Link
            href="/"
            className="flex items-center justify-center space-x-1.5 w-full py-2 rounded-xl border border-gatewise-border text-xs font-semibold text-gatewise-secondary hover:bg-background-secondary transition-colors"
          >
            <span>Exit to Public Portal</span>
          </Link>
        </div>
      </aside>

      {/* Main Administrative Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 bg-white border-b border-gatewise-border px-8 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-gatewise-success animate-pulse"></span>
            <span className="text-xs font-semibold text-gatewise-text">Institutional Network: Active & Encrypted</span>
          </div>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-gatewise-light text-gatewise-deep font-bold border border-gatewise-primary/20">
            Node: IIM-SAMBALPUR-PROD
          </span>
        </header>

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
