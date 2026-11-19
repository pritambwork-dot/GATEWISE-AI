'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid, Activity, Shield, CheckCircle2, FileText,
  Users, Image as ImageIcon, Plus, UserCheck, Car, BarChart3,
  UserCog, DoorClosed, Bell, Plug, Settings, Search, HelpCircle,
  Menu, X, PanelLeftClose, PanelLeft, LogOut, ExternalLink, ChevronDown,
  Monitor, ChevronRight, Sparkles
} from 'lucide-react';
import { AuthProvider, useAuth } from '@/lib/contexts/auth-context';
import { LogoMark } from '@/components/aura/primitives/LogoMark';

interface NavSubItem {
  href: string;
  label: string;
  paramTab?: string;
  badge?: string;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  badge?: string;
  subItems?: NavSubItem[];
}

interface NavGroup {
  title: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'OPERATIONS',
    items: [
      { href: '/admin', label: 'Overview', icon: LayoutGrid, iconColor: 'text-[#2F5BFF]' },
      { href: '/admin/activity', label: 'Live Operations', icon: Activity, iconColor: 'text-[#10B981]', badge: 'LIVE' },
      {
        href: '/admin/guards',
        label: 'Security Guards',
        icon: Shield,
        iconColor: 'text-[#6366F1]',
        subItems: [{ href: '/admin/guards?tab=analytics', label: 'Session Analytics', paramTab: 'analytics' }],
      },
      { href: '/admin/verification', label: 'Verification Centre', icon: CheckCircle2, iconColor: 'text-[#14B8A6]' },
      { href: '/admin/audit', label: 'Cryptographic Audit', icon: FileText, iconColor: 'text-[#F59E0B]' },
    ],
  },
  {
    title: 'IDENTITY & REGISTRY',
    items: [
      { href: '/admin/people', label: 'Identity Registry', icon: Users, iconColor: 'text-[#8B5CF6]' },
      { href: '/admin/repository', label: 'Photograph Library', icon: ImageIcon, iconColor: 'text-[#EC4899]' },
      {
        href: '/admin/enrollment',
        label: 'Registrations',
        icon: Plus,
        iconColor: 'text-[#06B6D4]',
        subItems: [
          { href: '/admin/enrollment?tab=bulk', label: 'Bulk XLSX Import', paramTab: 'bulk' },
          { href: '/admin/enrollment?tab=approvals', label: 'Approval Queue', paramTab: 'approvals' },
          { href: '/admin/enrollment?tab=model', label: 'Model Enrollment', paramTab: 'model' },
        ],
      },
      { href: '/admin/visitors', label: 'Visitor Passes', icon: UserCheck, iconColor: 'text-[#10B981]' },
      { href: '/admin/vehicles', label: 'Campus Vehicles', icon: Car, iconColor: 'text-[#F97316]' },
      { href: '/admin/analytics', label: 'Reports & Analytics', icon: BarChart3, iconColor: 'text-[#3B82F6]' },
    ],
  },
  {
    title: 'SYSTEM ARCHITECTURE',
    items: [
      { href: '/admin/access', label: 'Access Control', icon: UserCog, iconColor: 'text-[#64748B]' },
      { href: '/admin/gates', label: 'Gates & Perimeter', icon: DoorClosed, iconColor: 'text-[#0EA5E9]' },
      { href: '/admin/notifications', label: 'Notifications', icon: Bell, iconColor: 'text-[#EAB308]' },
      { href: '/admin/integrations', label: 'Edge Integrations', icon: Plug, iconColor: 'text-[#A855F7]' },
      {
        href: '/admin/settings',
        label: 'Settings',
        icon: Settings,
        iconColor: 'text-[#64748B]',
        subItems: [
          { href: '/admin/settings?tab=states', label: 'System States', paramTab: 'states' },
          { href: '/admin/settings?tab=help', label: 'Help & Support', paramTab: 'help' },
        ],
      },
    ],
  },
];

/* ── Apple Spring physics ─────────────────────────────────────── */
const appleSpring = { type: 'spring', stiffness: 500, damping: 35 };
const gentleSpring = { type: 'spring', stiffness: 300, damping: 30 };
const smoothSpring = { type: 'spring', stiffness: 380, damping: 32 };

/* ── Desktop-only gate ───────────────────────────────────────── */
function DesktopOnlyGate({ children }: { children: React.ReactNode }) {
  const [isNarrow, setIsNarrow] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [bypassed, setBypassed] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && sessionStorage.getItem('gatewise_desktop_override') === 'true') {
      setBypassed(true);
    }
    const check = () => {
      // Strict check: Block mobile phones (< 768px or coarse mobile touch phone without desktop screen)
      const isMobileDevice = window.innerWidth < 768 || (/iPhone|iPod|Android.*Mobile|webOS|BlackBerry|IEMobile/i.test(navigator.userAgent) && window.innerWidth < 1024);
      setIsNarrow(isMobileDevice);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!mounted || bypassed) return <>{children}</>;

  if (isNarrow) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center text-center px-8 bg-[#F8FAFC]"
      >
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...gentleSpring, delay: 0.1 }}
          className="relative z-10 flex flex-col items-center gap-5 max-w-sm p-8 rounded-3xl bg-white border border-slate-200/90 shadow-xl"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#2F5BFF] flex items-center justify-center shadow-[0_4px_20px_rgba(47,91,255,0.25)]">
            <LogoMark className="w-10 h-10" />
          </div>
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-slate-100 border border-slate-200 text-[#12B5A6]">
            <Monitor className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Desktop &amp; Laptop Optimized</h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              The GATEWISE AI Command Centre is designed for laptop and computer displays (IIM Sambalpur Security Desk).
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <button
              type="button"
              onClick={() => {
                sessionStorage.setItem('gatewise_desktop_override', 'true');
                setBypassed(true);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-[#2F5BFF] text-white font-bold text-xs hover:bg-[#2549D3] active:scale-95 transition-all shadow-md cursor-pointer"
            >
              Continue to Command Centre
            </button>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] text-slate-600 font-mono bg-slate-100 border border-slate-200">
            <span className="w-2 h-2 rounded-full bg-[#12B5A6] animate-pulse" />
            IIM Sambalpur Security Desk
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return <>{children}</>;
}

/* ── Apple-Style Nav Item Row (Light Theme) ───────────────────── */
function AppleNavItemRow({
  item,
  collapsed,
  pathname,
  currentTab,
}: {
  item: NavItem;
  collapsed: boolean;
  pathname: string;
  currentTab: string;
}) {
  const Icon = item.icon;
  const isExact = pathname === item.href && (!item.subItems || !currentTab);
  const isParentActive = pathname.startsWith(item.href) && (item.href !== '/admin' || pathname === '/admin');
  const isActive = isExact || (isParentActive && !currentTab);

  return (
    <div className="space-y-0.5">
      <Link
        href={item.href}
        title={collapsed ? item.label : undefined}
        className="relative group flex items-center gap-3 px-3 py-2 rounded-xl text-xs transition-colors cursor-pointer select-none"
      >
        {/* Active Pill with Spring */}
        {isActive && (
          <motion.div
            layoutId="apple-active-sidebar-pill"
            transition={appleSpring}
            className="absolute inset-0 rounded-xl bg-[#EBF0FF] border border-[#2F5BFF]/15 shadow-2xs"
          />
        )}

        {/* Hover Highlight when not active */}
        {!isActive && (
          <div className="absolute inset-0 rounded-xl bg-slate-100/0 group-hover:bg-slate-100/80 transition-colors pointer-events-none" />
        )}

        {/* Icon */}
        <div
          className={`relative z-10 w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
            isActive ? 'text-[#2F5BFF]' : 'text-slate-500 group-hover:text-slate-900'
          }`}
        >
          <Icon className="w-4 h-4" />
        </div>

        {/* Label */}
        {!collapsed && (
          <span
            className={`relative z-10 truncate text-xs transition-colors ${
              isActive ? 'font-bold text-[#2F5BFF]' : 'font-medium text-slate-700 group-hover:text-slate-950'
            }`}
          >
            {item.label}
          </span>
        )}

        {/* Optional Badge */}
        {!collapsed && item.badge && (
          <span className="relative z-10 ml-auto px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            {item.badge}
          </span>
        )}
      </Link>

      {/* Sub-items */}
      {!collapsed && item.subItems && isParentActive && (
        <div className="pl-8 pr-2 py-0.5 space-y-0.5">
          {item.subItems.map((sub) => {
            const isSubActive =
              currentTab === sub.paramTab || pathname.includes(sub.paramTab || '---');
            return (
              <Link
                key={sub.href}
                href={sub.href}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] transition-colors ${
                  isSubActive
                    ? 'bg-[#EBF0FF] text-[#2F5BFF] font-bold shadow-2xs'
                    : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100 font-medium'
                }`}
              >
                <span className="truncate">{sub.label}</span>
                {sub.badge && (
                  <span className="text-[9px] font-mono px-1 rounded bg-slate-100 text-slate-600">
                    {sub.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ── Main Layout Component ───────────────────────────────────── */
function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams.get('tab') || '';
  const router = useRouter();
  const { user, logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const userRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUserOpen(false);
    setNotifOpen(false);
    setMobileMenuOpen(false);
  }, [pathname, currentTab]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (pathname === '/admin/login') return <>{children}</>;

  const getBreadcrumbs = () => {
    if (pathname === '/admin') return { section: 'Command Centre', page: 'Overview Desk' };
    if (pathname.startsWith('/admin/activity')) return { section: 'Operations', page: 'Live Operations' };
    if (pathname.startsWith('/admin/guards'))
      return { section: 'Operations', page: currentTab === 'analytics' ? 'Session Analytics' : 'Security Guards' };
    if (pathname.startsWith('/admin/verification')) return { section: 'Operations', page: 'Verification Centre' };
    if (pathname.startsWith('/admin/audit')) return { section: 'Operations', page: 'Cryptographic Audit' };
    if (pathname.startsWith('/admin/people')) return { section: 'Identity', page: 'Identity Registry' };
    if (pathname.startsWith('/admin/repository')) return { section: 'Identity', page: 'Photograph Library' };
    if (pathname.startsWith('/admin/enrollment'))
      return {
        section: 'Identity',
        page:
          currentTab === 'bulk'
            ? 'Bulk XLSX Import'
            : currentTab === 'approvals'
            ? 'Approval Queue'
            : currentTab === 'model'
            ? 'Model Enrollment'
            : 'New Registrations',
      };
    if (pathname.startsWith('/admin/visitors')) return { section: 'Movement', page: 'Visitor Passes' };
    if (pathname.startsWith('/admin/vehicles')) return { section: 'Movement', page: 'Campus Vehicles' };
    if (pathname.startsWith('/admin/analytics')) return { section: 'Insights', page: 'Reports & Analytics' };
    if (pathname.startsWith('/admin/notifications')) return { section: 'Administration', page: 'Notifications' };
    if (pathname.startsWith('/admin/access')) return { section: 'Administration', page: 'Access Control' };
    if (pathname.startsWith('/admin/gates')) return { section: 'Administration', page: 'Gates & Perimeter' };
    if (pathname.startsWith('/admin/integrations')) return { section: 'Administration', page: 'Edge Integrations' };
    if (pathname.startsWith('/admin/settings'))
      return {
        section: 'Administration',
        page: currentTab === 'help' ? 'Help & Support' : currentTab === 'states' ? 'System States' : 'Settings',
      };
    return { section: 'Administration', page: 'Portal' };
  };

  const bc = getBreadcrumbs();

  return (
    <DesktopOnlyGate>
      <div className="min-h-screen flex font-sans antialiased bg-[#F8FAFC] text-slate-900 selection:bg-[#2F5BFF]/20">
        {/* ════════════════════════════════════════════════════════
            APPLE macOS WHITE ENTERPRISE SIDEBAR
        ════════════════════════════════════════════════════════ */}
        <motion.aside
          animate={{ width: collapsed ? 76 : 260 }}
          transition={smoothSpring}
          className="relative z-30 hidden md:flex flex-col shrink-0 bg-white border-r border-slate-200/90 shadow-[1px_0_3px_rgba(0,0,0,0.02)] select-none"
        >
          {/* 1. macOS Window Traffic Lights Header */}
          <div className="h-14 px-4 flex items-center justify-between shrink-0 border-b border-slate-100">
            {/* Traffic Lights */}
            <div className="flex items-center gap-2 group/lights">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/40 flex items-center justify-center shadow-2xs" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/40 flex items-center justify-center shadow-2xs" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/40 flex items-center justify-center shadow-2xs" />
            </div>

            {/* Sidebar toggle icon */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setCollapsed(!collapsed)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-all cursor-pointer"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <PanelLeft className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
            </motion.button>
          </div>

          {/* 2. Brand Identity Tile */}
          <div className="px-3.5 py-3 shrink-0">
            <Link
              href="/admin"
              className="flex items-center gap-3 p-2 rounded-xl transition-all hover:bg-slate-50 group"
            >
              <motion.div
                whileHover={{ rotate: 4, scale: 1.05 }}
                transition={appleSpring}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2F5BFF] to-[#12B5A6] flex items-center justify-center shadow-xs shrink-0"
              >
                <LogoMark className="w-5 h-5 text-white" />
              </motion.div>

              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-[13px] font-extrabold text-slate-900 tracking-tight leading-none">
                      GATEWISE
                    </span>
                    <span className="text-[11px] font-black text-[#12B5A6] leading-none">
                      AI
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-[#2F5BFF] font-semibold tracking-tight truncate mt-1">
                    IIM Sambalpur Console
                  </span>
                </div>
              )}
            </Link>
          </div>

          {/* 3. Scrollable Navigation List */}
          <div className="flex-1 overflow-y-auto px-3 py-2 space-y-5 scrollbar-thin scrollbar-thumb-slate-200">
            {NAV_GROUPS.map((group) => (
              <div key={group.title} className="space-y-1">
                {!collapsed && (
                  <div className="px-3 text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">
                    {group.title}
                  </div>
                )}
                <div className="space-y-0.5">
                  {group.items.map((item) => (
                    <AppleNavItemRow
                      key={item.href}
                      item={item}
                      collapsed={collapsed}
                      pathname={pathname}
                      currentTab={currentTab}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* 4. Bottom User Profile Card */}
          <div className="p-3 border-t border-slate-100 shrink-0">
            <AnimatePresence>
              {!collapsed ? (
                <div className="flex items-center justify-between p-2 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#2F5BFF] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                      {user?.full_name ? user.full_name.charAt(0) : 'R'}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-slate-900 truncate">
                        {user?.full_name || 'Dr. Rajesh Iyer'}
                      </div>
                      <div className="text-[10px] text-[#0F766E] font-mono truncate">
                        IIM Sambalpur Desk
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      router.push('/admin/login');
                    }}
                    title="Sign Out"
                    className="w-7 h-7 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => {
                      logout();
                      router.push('/admin/login');
                    }}
                    title="Sign Out"
                    className="w-9 h-9 rounded-xl hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              )}
            </AnimatePresence>
          </div>
        </motion.aside>

        {/* ════════════════════════════════════════════════════════
            MAIN WORKSPACE AREA
        ════════════════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          {/* Frosted White Header Bar */}
          <header className="h-16 px-4 sm:px-8 border-b border-slate-200/90 bg-white/90 backdrop-blur-xl flex items-center justify-between gap-4 sticky top-0 z-20 shrink-0 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
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
                <div className="text-[11px] text-slate-500 font-medium truncate flex items-center gap-1.5">
                  <span>{bc.section}</span>
                  <ChevronRight className="w-3 h-3 text-slate-400" />
                  <span className="text-slate-900 font-bold">{bc.page}</span>
                </div>
              </div>
            </div>

            {/* Center: Global Search Bar */}
            <div className="flex-1 max-w-md mx-2 sm:mx-6">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Search events, identities, guards, gates..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-100/70 border border-slate-200/80 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:bg-white focus:border-[#2F5BFF] focus:ring-2 focus:ring-[#2F5BFF]/15 transition-all"
                />
              </div>
            </div>

            {/* Right Tools: Telemetry Pills & Dropdowns */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Institution Badge */}
              <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-xs font-mono text-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>IIM Sambalpur Active</span>
              </div>

              {/* Vector Badge */}
              <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/80 text-[11px] font-mono text-slate-700">
                <span>SFace 128-D:</span>
                <span className="text-emerald-700 font-bold">0.984</span>
              </div>

              {/* Notification Bell */}
              <div className="relative" ref={notifRef}>
                <button
                  type="button"
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors relative cursor-pointer"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#2F5BFF]" />
                </button>

                {notifOpen && (
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
                      <div className="font-semibold text-slate-900">Perimeter Verification Active</div>
                      <p className="text-[11px] text-slate-500">IIM Sambalpur 4 gate checkpoints synchronized with HMAC ledger.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Help Button */}
              <Link
                href="/admin/settings?tab=help"
                className="w-9 h-9 rounded-xl border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors cursor-pointer"
                title="Help & Support"
              >
                <HelpCircle className="w-4 h-4" />
              </Link>

              {/* User Avatar Trigger */}
              <div className="relative" ref={userRef}>
                <button
                  type="button"
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full border border-slate-200 hover:bg-slate-100 transition-all cursor-pointer bg-white"
                >
                  <span className="w-7 h-7 rounded-full bg-[#2F5BFF] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {user?.full_name ? user.full_name.charAt(0) : 'R'}
                  </span>
                  <div className="hidden sm:flex flex-col text-left leading-tight">
                    <span className="text-xs font-bold text-slate-900 truncate max-w-[120px]">
                      {user?.full_name || 'Dr. Rajesh Iyer'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {user?.role || 'Admin'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userOpen && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl border border-slate-200 shadow-xl p-2 z-50 animate-in fade-in duration-150">
                    <div className="p-2.5 border-b border-slate-100">
                      <div className="text-xs font-bold text-slate-900">{user?.full_name || 'Dr. Rajesh Iyer'}</div>
                      <div className="text-[11px] text-slate-500 truncate">{user?.email || 'admin.security@iimsambalpur.ac.in'}</div>
                      <span className="inline-block mt-1 text-[9px] font-mono px-2 py-0.5 rounded-full bg-[#EBF0FF] text-[#2F5BFF] font-bold">
                        IIM Sambalpur Desk
                      </span>
                    </div>

                    <div className="py-1">
                      <Link
                        href="/admin/settings"
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <Settings className="w-3.5 h-3.5 text-slate-500" />
                        <span>Settings</span>
                      </Link>
                      <Link
                        href="/"
                        target="_blank"
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                        <span>Open Public Portal</span>
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => {
                          logout();
                          router.push('/admin/login');
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
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

          {/* Main Body Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </DesktopOnlyGate>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <React.Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
        <AdminLayoutContent>{children}</AdminLayoutContent>
      </React.Suspense>
    </AuthProvider>
  );
}
