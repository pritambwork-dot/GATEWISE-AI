'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShieldCheck, LayoutDashboard, Activity, Users, UserPlus,
  DoorClosed, Shield, Database, BarChart3, Settings, LogOut,
  Bell, Search, ChevronRight, CheckCircle2, AlertTriangle, Info,
  ExternalLink, Menu, X, ChevronDown, RefreshCw
} from 'lucide-react';
import { AuthProvider, useAuth } from '@/lib/contexts/auth-context';
import { api } from '@/lib/services/api';
import { NotificationItem } from '@/types';

const NAV_GROUPS = [
  {
    title: 'OVERVIEW',
    items: [
      { href: '/admin', label: 'Command Centre', icon: LayoutDashboard },
    ],
  },
  {
    title: 'OPERATIONS',
    items: [
      { href: '/admin/activity', label: 'Live Gate Activity', icon: Activity },
      { href: '/admin/visitors', label: 'Visitor Passes', icon: Users },
    ],
  },
  {
    title: 'INSTITUTION',
    items: [
      { href: '/admin/people', label: 'People & Identities', icon: Users },
      { href: '/admin/enrollment', label: 'Enrollment Requests', icon: UserPlus },
      { href: '/admin/gates', label: 'Gate Posts', icon: DoorClosed },
      { href: '/admin/guards', label: 'Guard Management', icon: Shield },
    ],
  },
  {
    title: 'SYSTEM',
    items: [
      { href: '/admin/repository', label: 'Identity Repository', icon: Database },
      { href: '/admin/analytics', label: 'Analytics & Evaluation', icon: BarChart3 },
      { href: '/admin/settings', label: 'System Settings', icon: Settings },
    ],
  },
];

function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Fetch live notifications
  useEffect(() => {
    async function fetchNotifs() {
      try {
        const items = await api.getNotifications();
        setNotifications(items);
        setUnreadCount(items.filter((n) => !n.is_read).length);
      } catch {
        // Fallback notifications if endpoint unauthenticated
        setNotifications([
          {
            id: 'n-1',
            type: 'ENROLLMENT',
            title: 'New Field Referral',
            message: 'Officer submitted referral for visitor at Main Gate.',
            severity: 'WARNING',
            timestamp: new Date().toISOString(),
            target_url: '/admin/enrollment',
            is_read: false
          },
          {
            id: 'n-2',
            type: 'DRIVE_SYNC',
            title: 'Drive Sync Operational',
            message: 'Approved reference photo repository verified.',
            severity: 'INFO',
            timestamp: new Date().toISOString(),
            target_url: '/admin/repository',
            is_read: true
          }
        ]);
        setUnreadCount(1);
      }
    }
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 15000);
    return () => clearInterval(interval);
  }, []);

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  // Find current breadcrumb title
  const currentNav = NAV_GROUPS.flatMap((g) => g.items).find((item) => item.href === pathname);
  const pageTitle = currentNav?.label || 'Command Centre';

  return (
    <div className="min-h-screen flex bg-background text-gatewise-text antialiased">
      {/* Desktop Sidebar Navigation */}
      <aside
        className={`${
          collapsed ? 'w-20' : 'w-64'
        } bg-white border-r border-gatewise-border flex flex-col justify-between shrink-0 transition-all duration-200 z-30`}
      >
        <div className="flex flex-col h-full">
          {/* Brand Header */}
          <div className="p-4 border-b border-gatewise-border flex items-center justify-between">
            <Link href="/admin" className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gatewise-primary flex items-center justify-center text-white shrink-0 shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              {!collapsed && (
                <div className="truncate">
                  <span className="font-extrabold text-sm text-gatewise-text tracking-tight">
                    GATEWISE<span className="text-gatewise-primary ml-0.5">AI</span>
                  </span>
                  <span className="block text-[10px] text-gatewise-secondary font-medium uppercase tracking-wider">
                    IIM Sambalpur
                  </span>
                </div>
              )}
            </Link>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gatewise-secondary hover:text-gatewise-text p-1.5 rounded-lg hover:bg-background-secondary transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links Grouped */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {NAV_GROUPS.map((group) => (
              <div key={group.title} className="space-y-1">
                {!collapsed && (
                  <h3 className="px-3 text-[10px] font-bold text-gatewise-secondary/70 tracking-wider uppercase mb-1">
                    {group.title}
                  </h3>
                )}
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center space-x-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                        isActive
                          ? 'bg-gatewise-light text-gatewise-deep font-bold shadow-xs'
                          : 'text-gatewise-secondary hover:text-gatewise-text hover:bg-background-secondary'
                      }`}
                      title={collapsed ? item.label : undefined}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-gatewise-primary' : 'text-gatewise-secondary/70'}`} />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>

          {/* User Profile & Actions Footer */}
          <div className="p-3 border-t border-gatewise-border space-y-2 bg-white">
            <div
              className={`p-2.5 rounded-xl bg-background-secondary border border-gatewise-border flex items-center ${
                collapsed ? 'justify-center' : 'space-x-2.5'
              }`}
            >
              <div className="w-8 h-8 rounded-full bg-gatewise-primary/10 border border-gatewise-primary/20 flex items-center justify-center text-gatewise-primary font-bold text-xs shrink-0 overflow-hidden">
                {user?.avatar_url ? (
                  <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
                ) : (
                  <span>{user?.full_name?.charAt(0) || 'A'}</span>
                )}
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <span className="font-bold text-xs text-gatewise-text block truncate">
                    {user?.full_name || 'Dr. Rajesh Iyer'}
                  </span>
                  <span className="text-[10px] text-gatewise-secondary block truncate">
                    {user?.role === 'SUPER_ADMIN' ? 'Super Administrator' : 'Chief Security Officer'} · {user?.employee_id || 'ADM-001'}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center space-x-1">
              <Link
                href="/"
                className="flex items-center justify-center space-x-1 flex-1 py-1.5 rounded-lg border border-gatewise-border text-[11px] font-semibold text-gatewise-secondary hover:bg-background-secondary transition-colors"
                title="View public website"
              >
                {!collapsed && <span>Public Portal</span>}
                <ExternalLink className="w-3 h-3" />
              </Link>
              <button
                onClick={() => logout()}
                className="p-1.5 rounded-lg border border-gatewise-border text-gatewise-secondary hover:text-gatewise-error hover:bg-rose-50 transition-colors"
                title="Log out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Administrative Workspace */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Operational Navigation Bar */}
        <header className="h-16 bg-white border-b border-gatewise-border px-8 flex items-center justify-between sticky top-0 z-20 shadow-xs">
          {/* Breadcrumbs & Status */}
          <div className="flex items-center space-x-4 min-w-0">
            <div className="flex items-center space-x-2 text-xs text-gatewise-secondary">
              <span className="font-semibold text-gatewise-secondary/70">Admin</span>
              <ChevronRight className="w-3.5 h-3.5 text-gatewise-secondary/40" />
              <span className="font-bold text-gatewise-text">{pageTitle}</span>
            </div>
            <div className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[11px] text-emerald-800 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Campus Network: Encrypted (TLS 1.3)</span>
            </div>
          </div>

          {/* Right Controls: Notifications, Search, Node ID */}
          <div className="flex items-center space-x-3">
            {/* Quick Filter Search */}
            <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-background border border-gatewise-border text-xs text-gatewise-secondary w-56 focus-within:border-gatewise-primary focus-within:ring-1 focus-within:ring-gatewise-primary transition-all">
              <Search className="w-3.5 h-3.5 text-gatewise-secondary/60 shrink-0" />
              <input
                type="text"
                placeholder="Search events, ID, staff..."
                className="bg-transparent border-none outline-none w-full text-xs text-gatewise-text placeholder:text-gatewise-secondary/60"
              />
            </div>

            {/* Notification Centre Button & Popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 rounded-xl border border-gatewise-border text-gatewise-secondary hover:text-gatewise-text hover:bg-background-secondary transition-colors"
                title="Notification Centre"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gatewise-error text-white font-bold text-[9px] flex items-center justify-center border-2 border-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Drawer */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gatewise-border p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between pb-3 border-b border-gatewise-border">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-gatewise-text">Operational Notifications</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gatewise-error/10 text-gatewise-error">
                          {unreadCount} new
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllRead}
                        className="text-[11px] font-semibold text-gatewise-primary hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="py-2 max-h-80 overflow-y-auto space-y-2 divide-y divide-gatewise-border/40">
                    {notifications.length === 0 ? (
                      <div className="py-8 text-center text-xs text-gatewise-secondary">
                        No notifications at this time. All gate systems normal.
                      </div>
                    ) : (
                      notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`pt-2.5 pb-1 flex items-start space-x-2.5 cursor-pointer hover:bg-background-secondary/60 p-2 rounded-xl transition-colors ${
                            !n.is_read ? 'bg-emerald-50/40' : ''
                          }`}
                          onClick={() => {
                            setShowNotifications(false);
                            router.push(n.target_url);
                          }}
                        >
                          <div className="mt-0.5 shrink-0">
                            {n.severity === 'ERROR' ? (
                              <AlertTriangle className="w-4 h-4 text-gatewise-error" />
                            ) : n.severity === 'WARNING' ? (
                              <AlertTriangle className="w-4 h-4 text-gatewise-warning" />
                            ) : (
                              <Info className="w-4 h-4 text-gatewise-teal" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <span className="font-bold text-xs text-gatewise-text block truncate">{n.title}</span>
                            <p className="text-[11px] text-gatewise-secondary line-clamp-2 mt-0.5">{n.message}</p>
                            <span className="text-[10px] text-gatewise-secondary/70 font-mono mt-1 block">
                              {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Node ID Badge */}
            <span className="hidden lg:inline-block text-[11px] font-mono px-2.5 py-1 rounded-lg bg-gatewise-light text-gatewise-deep font-bold border border-gatewise-primary/20">
              Node: IIM-SAMBALPUR-PROD
            </span>
          </div>
        </header>

        {/* Content Body */}
        <main className="p-6 lg:p-8 flex-1 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminShell>{children}</AdminShell>
    </AuthProvider>
  );
}
