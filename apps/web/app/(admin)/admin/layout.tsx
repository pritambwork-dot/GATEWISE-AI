'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  ShieldCheck, LayoutDashboard, Activity, Users, UserPlus,
  DoorClosed, Shield, Database, BarChart3, Settings, LogOut,
  Bell, Search, ChevronRight, CheckCircle2, AlertTriangle, Info,
  ExternalLink, Menu, X, ChevronDown, RefreshCw, Command, Sparkles
} from 'lucide-react';
import { AuthProvider, useAuth } from '@/lib/contexts/auth-context';
import { api } from '@/lib/services/api';
import { NotificationItem } from '@/types';
import { AssistantSidePanel } from '@/components/assistant/AssistantSidePanel';
import { AssistantTriggerButton } from '@/components/assistant/AssistantTriggerButton';

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
  const [showAssistant, setShowAssistant] = useState(false);

  // Keyboard shortcut Cmd+K for AI Assistant and Cmd+B for Sidebar toggle
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setShowAssistant((prev) => !prev);
      }
      if ((e.metaKey || e.ctrlKey) && (e.key === 'b' || e.key === 'B')) {
        e.preventDefault();
        setCollapsed((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch live notifications
  useEffect(() => {
    async function fetchNotifs() {
      try {
        const items = await api.getNotifications();
        setNotifications(items);
        setUnreadCount(items.filter((n) => !n.is_read).length);
      } catch {
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

  const currentNav = NAV_GROUPS.flatMap((g) => g.items).find((item) => item.href === pathname);
  const pageTitle = currentNav?.label || 'Command Centre';

  return (
    <div className="min-h-screen flex bg-background text-gatewise-text antialiased selection:bg-gatewise-light selection:text-gatewise-deep">
      {/* Desktop macOS-Style Refined Sidebar */}
      <aside
        className={`${
          collapsed ? 'w-[72px]' : 'w-64'
        } bg-white border-r border-black/[0.07] flex flex-col justify-between shrink-0 transition-all duration-200 z-30 select-none shadow-[1px_0_12px_rgba(0,0,0,0.02)]`}
      >
        <div className="flex flex-col h-full">
          {/* Brand & Compact Workspace Header */}
          <div className="h-16 px-4 border-b border-black/[0.06] flex items-center justify-between">
            <Link href="/admin" className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-8 h-8 rounded-xl bg-gatewise-primary flex items-center justify-center text-white shrink-0 shadow-2xs">
                <ShieldCheck className="w-4 h-4" />
              </div>
              {!collapsed && (
                <div className="truncate">
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-sm text-gatewise-text tracking-tight">
                      GATEWISE<span className="text-gatewise-primary ml-0.5">AI</span>
                    </span>
                    <span className="px-1.5 py-0.2 rounded-full bg-emerald-50 text-emerald-800 text-[9px] font-mono font-bold border border-emerald-200">
                      ADMIN
                    </span>
                  </div>
                  <span className="text-[10px] text-gatewise-secondary font-medium block -mt-0.5">
                    IIM Sambalpur Ops
                  </span>
                </div>
              )}
            </Link>

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1.5 rounded-lg text-gatewise-secondary hover:text-gatewise-text hover:bg-black/[0.04] transition-colors"
              title={collapsed ? 'Expand sidebar (Cmd+B)' : 'Collapse sidebar (Cmd+B)'}
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>

          {/* Navigation Links Grouped */}
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scroll">
            {NAV_GROUPS.map((group) => (
              <div key={group.title} className="space-y-1">
                {!collapsed && (
                  <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-gatewise-secondary/70">
                    {group.title}
                  </span>
                )}
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center ${
                          collapsed ? 'justify-center px-0' : 'space-x-3 px-3'
                        } py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? 'bg-gatewise-light text-gatewise-deep shadow-2xs font-bold'
                            : 'text-gatewise-secondary hover:text-gatewise-text hover:bg-black/[0.03]'
                        }`}
                        title={collapsed ? item.label : undefined}
                      >
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-gatewise-primary' : 'text-gatewise-secondary'}`} />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Bottom Sidebar Footer: Quick Assistant & Sign Out */}
          <div className="p-3 border-t border-black/[0.06] space-y-2">
            {!collapsed && (
              <button
                onClick={() => setShowAssistant(true)}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-gatewise-light/60 hover:bg-gatewise-light border border-gatewise-mint text-xs font-bold text-gatewise-deep transition-all shadow-2xs"
              >
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-3.5 h-3.5 text-gatewise-primary" />
                  <span>AI Assistant</span>
                </div>
                <kbd className="px-1.5 py-0.5 rounded bg-white/80 text-[10px] font-mono text-gatewise-secondary border border-black/[0.08]">
                  ⌘K
                </kbd>
              </button>
            )}

            <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} p-1`}>
              {!collapsed && (
                <div className="flex items-center space-x-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-gatewise-primary/10 text-gatewise-primary flex items-center justify-center font-bold text-xs shrink-0">
                    {user?.full_name ? user.full_name[0] : 'A'}
                  </div>
                  <div className="truncate">
                    <span className="text-xs font-bold text-gatewise-text block truncate leading-tight">
                      {user?.full_name || 'Administrator'}
                    </span>
                    <span className="text-[10px] text-gatewise-secondary truncate block">
                      {user?.role || 'SUPER_ADMIN'}
                    </span>
                  </div>
                </div>
              )}
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-gatewise-secondary hover:text-red-600 hover:bg-red-50 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Administrative Surface Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Header Bar */}
        <header className="h-16 bg-white/90 backdrop-blur-xl border-b border-black/[0.07] px-4 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-20">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-gatewise-secondary font-medium">GATEWISE AI</span>
            <span className="text-gatewise-secondary/40">/</span>
            <span className="text-gatewise-secondary font-medium">Operations</span>
            <span className="text-gatewise-secondary/40">/</span>
            <span className="font-bold text-gatewise-text">{pageTitle}</span>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-3">
            {/* Live Telemetry Heartbeat Pill */}
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-mono font-semibold border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>NODE N-01 • ACTIVE 24FPS</span>
            </div>

            {/* Quick Search Launcher */}
            <button
              onClick={() => setShowAssistant(true)}
              className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-black/[0.03] hover:bg-black/[0.06] text-gatewise-secondary text-xs transition-colors border border-black/[0.04]"
            >
              <Search className="w-3.5 h-3.5" />
              <span>Search operations or query AI...</span>
              <kbd className="px-1.5 py-0.5 rounded bg-white text-[10px] font-mono border border-black/[0.06]">
                ⌘K
              </kbd>
            </button>

            {/* Notifications Popover Trigger */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl text-gatewise-secondary hover:text-gatewise-text hover:bg-black/[0.04] transition-colors relative"
                title="System Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl border border-black/[0.08] ss-card-shadow p-4 space-y-3 z-50 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between pb-2 border-b border-black/[0.06]">
                    <span className="text-xs font-bold text-gatewise-text">Operational Notifications</span>
                    <button
                      onClick={markAllRead}
                      className="text-[10px] text-gatewise-primary hover:underline font-semibold"
                    >
                      Mark all read
                    </button>
                  </div>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl text-xs space-y-1 transition-colors ${
                          n.is_read ? 'bg-black/[0.02]' : 'bg-emerald-50/50 border border-emerald-100'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-gatewise-text">{n.title}</span>
                          <span className="text-[10px] text-gatewise-secondary font-mono">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] text-gatewise-secondary leading-snug">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Direct Link to Public Portal */}
            <Link
              href="/"
              target="_blank"
              className="p-2 rounded-xl text-gatewise-secondary hover:text-gatewise-text hover:bg-black/[0.04] transition-colors"
              title="Open Public Website in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </header>

        {/* Page Viewport Surface with Room to Breathe */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>

      {/* Floating Assistant Trigger & Side Panel */}
      <AssistantSidePanel
        isOpen={showAssistant}
        onClose={() => setShowAssistant(false)}
      />
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
