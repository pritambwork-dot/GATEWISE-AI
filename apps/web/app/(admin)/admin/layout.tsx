'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  LayoutGrid, Activity, Shield, CheckCircle2, FileText,
  Users, Image as ImageIcon, Plus, UserCheck, Car, BarChart3,
  UserCog, DoorClosed, Bell, Plug, Settings, Search, HelpCircle,
  Menu, X, PanelLeftClose, PanelLeft, LogOut, ExternalLink, ChevronDown
} from 'lucide-react';
import { AuthProvider, useAuth } from '@/lib/contexts/auth-context';
import { LogoMark } from '@/components/aura/primitives/LogoMark';

interface NavSubItem {
  href: string;
  label: string;
  paramTab?: string;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  subItems?: NavSubItem[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'MAIN',
    items: [
      { href: '/admin', label: 'Overview', icon: LayoutGrid },
      { href: '/admin/activity', label: 'Live Operations', icon: Activity },
      {
        href: '/admin/guards',
        label: 'Security Guards',
        icon: Shield,
        subItems: [
          { href: '/admin/guards?tab=analytics', label: 'Session Analytics', paramTab: 'analytics' },
        ],
      },
      { href: '/admin/verification', label: 'Verification Centre', icon: CheckCircle2 },
      { href: '/admin/audit', label: 'Activity & Audit Logs', icon: FileText },
      { href: '/admin/people', label: 'Identity Registry', icon: Users },
      { href: '/admin/repository', label: 'Photograph Library', icon: ImageIcon },
      {
        href: '/admin/enrollment',
        label: 'New Registrations',
        icon: Plus,
        subItems: [
          { href: '/admin/enrollment?tab=bulk', label: 'Bulk XLSX Import', paramTab: 'bulk' },
          { href: '/admin/enrollment?tab=approvals', label: 'Registration Approval', paramTab: 'approvals' },
          { href: '/admin/enrollment?tab=model', label: 'Model Enrollment', paramTab: 'model' },
        ],
      },
      { href: '/admin/visitors', label: 'Visitors', icon: UserCheck },
      { href: '/admin/vehicles', label: 'Campus Vehicles', icon: Car },
      { href: '/admin/analytics', label: 'Reports & Analytics', icon: BarChart3 },
    ],
  },
  {
    title: 'ADMINISTRATION',
    items: [
      { href: '/admin/access', label: 'Access Management', icon: UserCog },
      { href: '/admin/gates', label: 'Gates & Checkpoints', icon: DoorClosed },
      { href: '/admin/notifications', label: 'Notifications', icon: Bell },
      { href: '/admin/integrations', label: 'Integrations', icon: Plug },
      {
        href: '/admin/settings',
        label: 'Settings',
        icon: Settings,
        subItems: [
          { href: '/admin/settings?tab=states', label: 'System States', paramTab: 'states' },
          { href: '/admin/settings?tab=help', label: 'Help & Support', paramTab: 'help' },
        ],
      },
    ],
  },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get('tab') || '';
  const router = useRouter();
  const { user, logout } = useAuth();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [pathname, currentTab]);

  // If on login page, render children cleanly without shell
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  // Compute breadcrumbs
  const getBreadcrumbs = () => {
    if (pathname === '/admin') {
      return { section: 'Overview', page: 'Institution Overview' };
    }
    if (pathname.startsWith('/admin/activity')) {
      return { section: 'Operations / Live Operations Centre', page: 'Live Operations Centre' };
    }
    if (pathname.startsWith('/admin/guards')) {
      if (currentTab === 'analytics') {
        return { section: 'Operations / Security Guards / Guard session analytics', page: 'Guard session analytics' };
      }
      return { section: 'Operations / Security Guards', page: 'Security Guards' };
    }
    if (pathname.startsWith('/admin/verification')) {
      return { section: 'Operations / Verification Centre / Verification event', page: 'Verification event' };
    }
    if (pathname.startsWith('/admin/audit')) {
      return { section: 'Operations / Activity & audit logs', page: 'Activity & audit logs' };
    }
    if (pathname.startsWith('/admin/people')) {
      return { section: 'Identity / Identity Registry', page: 'Identity Registry' };
    }
    if (pathname.startsWith('/admin/repository')) {
      return { section: 'Identity / Photograph & Identity Library', page: 'Photograph & Identity Library' };
    }
    if (pathname.startsWith('/admin/enrollment')) {
      if (currentTab === 'bulk') {
        return { section: 'Identity / New Registrations / Bulk registration and XLSX import', page: 'Bulk registration and XLSX import' };
      }
      if (currentTab === 'approvals') {
        return { section: 'Identity / New Registrations / Registration approval', page: 'Registration approval' };
      }
      if (currentTab === 'model') {
        return { section: 'Identity / New Registrations / Model enrollment', page: 'Model enrollment' };
      }
      return { section: 'Identity / New registration', page: 'New registration' };
    }
    if (pathname.startsWith('/admin/visitors')) {
      return { section: 'Movement / Visitor management', page: 'Visitor management' };
    }
    if (pathname.startsWith('/admin/vehicles')) {
      return { section: 'Movement / Campus vehicles', page: 'Campus vehicles' };
    }
    if (pathname.startsWith('/admin/analytics')) {
      return { section: 'Insights / Reports & analytics', page: 'Reports & analytics' };
    }
    if (pathname.startsWith('/admin/notifications')) {
      return { section: 'Administration / Notifications & alerts', page: 'Notifications & alerts' };
    }
    if (pathname.startsWith('/admin/access')) {
      return { section: 'Administration / Access management', page: 'Access management' };
    }
    if (pathname.startsWith('/admin/gates')) {
      return { section: 'Administration / Gates & checkpoints', page: 'Gates & checkpoints' };
    }
    if (pathname.startsWith('/admin/integrations')) {
      return { section: 'Administration / Integrations & system status', page: 'Integrations & system status' };
    }
    if (pathname.startsWith('/admin/settings')) {
      if (currentTab === 'states') {
        return { section: 'Administration / Settings / System states & dialogs', page: 'System states & dialogs' };
      }
      if (currentTab === 'help') {
        return { section: 'Administration / Settings / Help & support', page: 'Help & support' };
      }
      return { section: 'Administration / Settings', page: 'Settings' };
    }
    return { section: 'Administration', page: 'Portal' };
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="min-h-screen flex bg-[#F7F8FA] text-slate-900 font-sans antialiased">
      {/* 1. DESKTOP SIDEBAR */}
      <aside
        className={`${
          sidebarCollapsed ? 'w-[76px]' : 'w-64'
        } hidden md:flex flex-col bg-white border-r border-slate-200/90 shrink-0 transition-all duration-200 z-30 select-none`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <Link href="/admin" className="flex items-center gap-2.5">
            <LogoMark className="w-8 h-8 shrink-0" />
            {!sidebarCollapsed && (
              <span className="text-base font-bold text-slate-950 tracking-tight flex items-center">
                GATEWISE
                <span className="text-[#12B5A6] ml-1 font-extrabold text-sm">AI</span>
              </span>
            )}
          </Link>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.title} className="space-y-1">
              {!sidebarCollapsed && (
                <div className="px-3 text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                  {group.title}
                </div>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isExact = pathname === item.href && (!item.subItems || !currentTab);
                  const isParentActive =
                    pathname.startsWith(item.href) &&
                    (item.href !== '/admin' || pathname === '/admin');

                  return (
                    <div key={item.href} className="space-y-0.5">
                      <Link
                        href={item.href}
                        title={sidebarCollapsed ? item.label : undefined}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors ${
                          isExact
                            ? 'bg-[#EBF0FF] text-[#2F5BFF] font-bold shadow-2xs'
                            : isParentActive && !currentTab
                            ? 'bg-[#EBF0FF]/60 text-[#2F5BFF] font-semibold'
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950 font-medium'
                        }`}
                      >
                        <Icon
                          className={`w-4 h-4 shrink-0 ${
                            isExact || (isParentActive && !currentTab)
                              ? 'text-[#2F5BFF]'
                              : 'text-slate-500'
                          }`}
                        />
                        {!sidebarCollapsed && (
                          <span className="truncate">{item.label}</span>
                        )}
                      </Link>

                      {/* Sub-items */}
                      {!sidebarCollapsed && item.subItems && isParentActive && (
                        <div className="pl-6 pr-2 py-0.5 space-y-0.5">
                          {item.subItems.map((sub) => {
                            const isSubActive =
                              currentTab === sub.paramTab ||
                              pathname.includes(sub.paramTab || '---');

                            return (
                              <Link
                                key={sub.href}
                                href={sub.href}
                                className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition-colors ${
                                  isSubActive
                                    ? 'bg-[#EBF0FF] text-[#2F5BFF] font-bold'
                                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100/70 font-medium'
                                }`}
                              >
                                <span className="text-[10px] text-slate-400">•</span>
                                <span className="truncate">{sub.label}</span>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-slate-100 space-y-2 shrink-0">
          <button
            type="button"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-950 transition-colors cursor-pointer"
          >
            {sidebarCollapsed ? (
              <PanelLeft className="w-4 h-4 text-slate-500" />
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4 text-slate-500" />
                <span className="text-xs">Collapse sidebar</span>
              </>
            )}
          </button>

          {!sidebarCollapsed && (
            <p className="px-2 text-[10px] text-slate-400 leading-normal">
              Menu shows only modules your role can access. Unconfigured modules stay hidden in production.
            </p>
          )}
        </div>
      </aside>

      {/* 2. MOBILE DRAWER OVERLAY */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 md:hidden animate-in fade-in"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-72 h-full bg-white flex flex-col p-4 space-y-4 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <LogoMark className="w-7 h-7" />
                <span className="font-bold text-slate-900">GATEWISE AI</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileMenuOpen(false)}
                className="p-1 rounded-lg text-slate-500 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4">
              {NAV_GROUPS.map((group) => (
                <div key={group.title} className="space-y-1">
                  <div className="px-2 text-[10px] font-mono font-bold text-slate-400 uppercase">
                    {group.title}
                  </div>
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                          isActive
                            ? 'bg-[#EBF0FF] text-[#2F5BFF]'
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. MAIN WORKSPACE */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* TOP BAR */}
        <header className="h-16 px-4 sm:px-8 border-b border-slate-200/90 bg-white flex items-center justify-between gap-4 sticky top-0 z-20 shrink-0">
          {/* Left: Mobile Toggle & Breadcrumbs */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 -ml-2 rounded-xl text-slate-600 hover:bg-slate-100 md:hidden cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="min-w-0 hidden sm:block">
              <div className="text-[11px] text-slate-500 font-medium truncate">
                {breadcrumbs.section}
              </div>
              <div className="text-sm font-bold text-slate-900 truncate">
                {breadcrumbs.page}
              </div>
            </div>
          </div>

          {/* Center: Global Search Bar */}
          <div className="flex-1 max-w-md mx-2 sm:mx-6">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search events, people, guards, gates"
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100/70 border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#2F5BFF] focus:ring-1 focus:ring-[#2F5BFF] transition-all"
              />
            </div>
          </div>

          {/* Right Tools: Institution Name, Notifications, Help, User Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Institution Badge */}
            <span className="hidden lg:inline text-xs font-semibold text-slate-600 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200/80">
              [Institution name]
            </span>

            {/* Notification Bell */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#2F5BFF]" />
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 space-y-3 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-900">Notifications &amp; Alerts</span>
                    <Link
                      href="/admin/notifications"
                      className="text-[11px] text-[#2F5BFF] font-semibold hover:underline"
                    >
                      View all
                    </Link>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-600 space-y-1">
                    <div className="font-semibold text-slate-900">Authentication Service Healthy</div>
                    <p className="text-[11px] text-slate-500">Node N-01 connected. Cryptographic HMAC active.</p>
                  </div>
                </div>
              )}
            </div>

            {/* Help Question Mark */}
            <Link
              href="/admin/settings?tab=help"
              className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
              title="Help & Support"
            >
              <HelpCircle className="w-4 h-4" />
            </Link>

            {/* User Avatar Badge: [A] [Administrator] [Role] */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <span className="w-7 h-7 rounded-full bg-[#2F5BFF] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                  A
                </span>
                <div className="hidden sm:flex flex-col text-left leading-tight">
                  <span className="text-xs font-bold text-slate-900">[Administrator]</span>
                  <span className="text-[10px] text-slate-500">[Role]</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in duration-150">
                  <div className="p-2.5 border-b border-slate-100">
                    <div className="text-xs font-bold text-slate-900">{user?.full_name || 'Administrator'}</div>
                    <div className="text-[11px] text-slate-500 truncate">{user?.email || 'admin@institution.edu'}</div>
                    <span className="inline-block mt-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#EBF0FF] text-[#2F5BFF] font-bold">
                      {user?.role || 'Campus Admin'}
                    </span>
                  </div>

                  <div className="py-1">
                    <Link
                      href="/admin/settings"
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <Settings className="w-3.5 h-3.5 text-slate-500" />
                      <span>Settings &amp; Preferences</span>
                    </Link>
                    <Link
                      href="/"
                      target="_blank"
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                      <span>Open Public Site</span>
                    </Link>
                  </div>

                  <div className="pt-1 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        router.push('/admin/login');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER */}
        <main className="flex-1 p-4 sm:p-8 max-w-[1500px] w-full mx-auto space-y-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <React.Suspense fallback={<div className="min-h-screen bg-[#F7F8FA]" />}>
        <AdminShell>{children}</AdminShell>
      </React.Suspense>
    </AuthProvider>
  );
}
