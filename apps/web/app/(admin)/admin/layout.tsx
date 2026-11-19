'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutGrid, Activity, Shield, CheckCircle2, FileText,
  Users, Image as ImageIcon, Plus, UserCheck, Car, BarChart3,
  UserCog, DoorClosed, Bell, Plug, Settings, Search, HelpCircle,
  X, PanelLeftClose, PanelLeft, LogOut, ExternalLink, ChevronDown,
  Monitor, ChevronRight, Sparkles, Command
} from 'lucide-react';
import { AuthProvider, useAuth } from '@/lib/contexts/auth-context';
import { LogoMark } from '@/components/aura/primitives/LogoMark';

interface NavSubItem { href: string; label: string; paramTab?: string; badge?: string; }
interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  badge?: string;
  subItems?: NavSubItem[];
}
interface NavGroup { title: string; items: NavItem[]; }

const NAV_GROUPS: NavGroup[] = [
  {
    title: 'OPERATIONS',
    items: [
      { href: '/admin', label: 'Overview', icon: LayoutGrid, iconColor: 'text-[#3B82F6]' },
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
      { href: '/admin/visitors', label: 'Visitor Passes', icon: UserCheck, iconColor: 'text-[#F97316]' },
      { href: '/admin/vehicles', label: 'Campus Vehicles', icon: Car, iconColor: 'text-[#3B82F6]' },
      { href: '/admin/analytics', label: 'Reports & Analytics', icon: BarChart3, iconColor: 'text-[#A855F7]' },
    ],
  },
  {
    title: 'SYSTEM ARCHITECTURE',
    items: [
      { href: '/admin/access', label: 'Access Control', icon: UserCog, iconColor: 'text-[#64748B]' },
      { href: '/admin/gates', label: 'Gates & Perimeter', icon: DoorClosed, iconColor: 'text-[#0D9488]' },
      { href: '/admin/notifications', label: 'Notifications', icon: Bell, iconColor: 'text-[#EAB308]', badge: '3' },
      { href: '/admin/integrations', label: 'Edge Integrations', icon: Plug, iconColor: 'text-[#6366F1]' },
      {
        href: '/admin/settings',
        label: 'System Settings',
        icon: Settings,
        iconColor: 'text-[#94A3B8]',
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
        className="fixed inset-0 z-[9999] flex flex-col items-center justify-center text-center px-8"
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 50% 50%, #16307F 0%, #0B1330 55%, #070B1A 100%)',
        }}
      >
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-[#2F5BFF]/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-56 h-56 bg-[#12B5A6]/15 blur-[80px] rounded-full pointer-events-none" />
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ ...gentleSpring, delay: 0.1 }}
          className="relative z-10 flex flex-col items-center gap-5 max-w-sm"
        >
          <div className="w-16 h-16 rounded-2xl bg-[#2F5BFF] flex items-center justify-center shadow-[0_0_40px_rgba(47,91,255,0.4)]">
            <LogoMark className="w-10 h-10" />
          </div>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
            <Monitor className="w-7 h-7 text-[#12B5A6]" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Desktop &amp; Laptop Optimized</h1>
            <p className="text-sm text-white/60 leading-relaxed">
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
              className="w-full py-2.5 px-4 rounded-xl bg-white text-black font-bold text-xs hover:bg-white/90 active:scale-95 transition-all shadow-md cursor-pointer"
            >
              Continue to Command Centre
            </button>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full text-xs text-white/60 font-mono" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="w-2 h-2 rounded-full bg-[#12B5A6] animate-pulse" />
            IIM Sambalpur Security Desk
          </div>
        </motion.div>
      </motion.div>
    );
  }

  return <>{children}</>;
}

/* ── Apple-Style Nav Item Row ────────────────────────────────── */
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
        className="relative flex items-center gap-2.5 px-2.5 py-1.5 rounded-[10px] text-[12px] font-medium transition-all group outline-none"
      >
        {/* Apple macOS active selection pill */}
        {isActive && (
          <motion.div
            layoutId="apple-sidebar-active-pill"
            className="absolute inset-0 rounded-[10px]"
            style={{
              background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.28) 0%, rgba(37, 99, 235, 0.20) 100%)',
              border: '1px solid rgba(96, 165, 250, 0.35)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 2px 8px rgba(37, 99, 235, 0.22)',
            }}
            transition={appleSpring}
          />
        )}

        {/* Hover highlight */}
        {!isActive && (
          <div className="absolute inset-0 rounded-[10px] bg-white/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
        )}

        {/* Icon with Apple SF-style vibrancy */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative z-10 w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-transform duration-150"
          style={
            isActive
              ? { background: 'rgba(59, 130, 246, 0.25)', boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)' }
              : { background: 'rgba(255, 255, 255, 0.04)' }
          }
        >
          <Icon
            className={`w-[13px] h-[13px] transition-colors ${
              isActive ? 'text-[#60A5FA]' : item.iconColor || 'text-white/50 group-hover:text-white/80'
            }`}
          />
        </motion.div>

        {/* Label */}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -4 }}
              transition={{ duration: 0.15 }}
              className={`relative z-10 truncate ${
                isActive ? 'text-white font-semibold' : 'text-white/65 group-hover:text-white/95'
              }`}
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>

        {/* Badge / Indicator */}
        {!collapsed && item.badge && (
          <span
            className={`relative z-10 ml-auto px-1.5 py-0.5 rounded-full text-[9px] font-mono font-bold leading-none ${
              item.badge === 'LIVE'
                ? 'bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30 animate-pulse'
                : 'bg-white/10 text-white/70'
            }`}
          >
            {item.badge}
          </span>
        )}

        {/* Sub-item chevron */}
        {!collapsed && item.subItems && isParentActive && !item.badge && (
          <ChevronRight
            className={`relative z-10 w-3 h-3 ml-auto text-white/30 transition-transform duration-200 ${
              isParentActive ? 'rotate-90 text-white/60' : ''
            }`}
          />
        )}
      </Link>

      {/* Sub-items with Apple macOS indentation */}
      <AnimatePresence>
        {!collapsed && item.subItems && isParentActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="pl-7 pr-2 overflow-hidden space-y-0.5 pt-0.5"
          >
            {item.subItems.map((sub) => {
              const isSubActive = currentTab === sub.paramTab;
              return (
                <Link
                  key={sub.href}
                  href={sub.href}
                  className={`relative flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-[11px] transition-all group ${
                    isSubActive ? 'text-[#14B8A6] font-semibold' : 'text-white/45 hover:text-white/85'
                  }`}
                >
                  {isSubActive && (
                    <motion.div
                      layoutId="apple-sidebar-sub-pill"
                      className="absolute inset-0 rounded-lg"
                      style={{
                        background: 'rgba(20, 184, 166, 0.14)',
                        border: '1px solid rgba(20, 184, 166, 0.25)',
                      }}
                      transition={appleSpring}
                    />
                  )}
                  <span className="relative z-10 w-1 h-1 rounded-full bg-current opacity-60 shrink-0" />
                  <span className="relative z-10 truncate">{sub.label}</span>
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Admin Shell ─────────────────────────────────────────────── */
function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = searchParams?.get('tab') || '';
  const router = useRouter();
  const { user, logout } = useAuth();

  const [collapsed, setCollapsed] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');
  const userRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setUserOpen(false);
    setNotifOpen(false);
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
      <div
        className="min-h-screen flex font-sans antialiased overflow-hidden text-white selection:bg-[#2F5BFF]/30"
        style={{
          background: 'linear-gradient(135deg, #070B1A 0%, #080E24 45%, #0A1333 100%)',
        }}
      >
        {/* Global ambient lighting */}
        <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-[650px] h-[650px] bg-[#2F5BFF]/12 blur-[160px] rounded-full" />
          <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-[#12B5A6]/8 blur-[180px] rounded-full" />
          <div className="absolute -bottom-40 left-1/3 w-[550px] h-[550px] bg-[#3B82F6]/6 blur-[150px] rounded-full" />
        </div>

        {/* ════════════════════════════════════════════════════════
            APPLE macOS SONOMA / SEQUOIA SIDEBAR
        ════════════════════════════════════════════════════════ */}
        <motion.aside
          animate={{ width: collapsed ? 76 : 260 }}
          transition={smoothSpring}
          className="relative z-30 flex flex-col shrink-0 overflow-hidden select-none"
          style={{
            background: 'rgba(10, 14, 28, 0.78)',
            backdropFilter: 'blur(45px) saturate(190%)',
            WebkitBackdropFilter: 'blur(45px) saturate(190%)',
            borderRight: '1px solid rgba(255, 255, 255, 0.075)',
            boxShadow: 'inset -1px 0 0 rgba(255, 255, 255, 0.02)',
          }}
        >
          {/* Top hairline reflection */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />

          {/* 1. macOS Window Traffic Lights Header */}
          <div
            className="h-14 px-4 flex items-center justify-between shrink-0"
            style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
          >
            {/* Traffic Lights */}
            <div className="flex items-center gap-2 group/lights">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/50 flex items-center justify-center text-[8px] text-black/60 opacity-90 group-hover/lights:opacity-100 transition-opacity shadow-xs" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/50 flex items-center justify-center text-[8px] text-black/60 opacity-90 group-hover/lights:opacity-100 transition-opacity shadow-xs" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB29]/50 flex items-center justify-center text-[8px] text-black/60 opacity-90 group-hover/lights:opacity-100 transition-opacity shadow-xs" />
            </div>

            {/* Sidebar toggle icon */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.94 }}
              onClick={() => setCollapsed(!collapsed)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white/40 hover:text-white/90 hover:bg-white/5 transition-all cursor-pointer"
              title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {collapsed ? <PanelLeft className="w-3.5 h-3.5" /> : <PanelLeftClose className="w-3.5 h-3.5" />}
            </motion.button>
          </div>

          {/* 2. Brand Identity Tile */}
          <div className="px-4 py-3 shrink-0">
            <Link
              href="/admin"
              className="flex items-center gap-3 p-2 rounded-xl transition-all hover:bg-white/[0.04] group"
            >
              <motion.div
                whileHover={{ rotate: 5, scale: 1.05 }}
                transition={appleSpring}
                className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2F5BFF] to-[#12B5A6] flex items-center justify-center shadow-[0_0_20px_rgba(47,91,255,0.4)] shrink-0"
              >
                <LogoMark className="w-5 h-5 text-white" />
              </motion.div>
              <AnimatePresence initial={false}>
                {!collapsed && (
                  <motion.div
                    initial={{ opacity: 0, x: -6 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -6 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col min-w-0 leading-tight"
                  >
                    <span className="text-[13px] font-extrabold text-white tracking-tight flex items-center">
                      GATEWISE
                      <span className="text-[#14B8A6] ml-1 font-black text-xs">AI</span>
                    </span>
                    <span className="text-[10px] text-white/40 font-mono tracking-tight truncate">
                      IIM Sambalpur Console
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </Link>
          </div>

          {/* 3. Navigation Groups */}
          <div
            className="flex-1 overflow-y-auto px-2.5 py-1 space-y-4"
            style={{ scrollbarWidth: 'none' }}
          >
            {NAV_GROUPS.map((group, gi) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...gentleSpring, delay: gi * 0.04 }}
                className="space-y-0.5"
              >
                <AnimatePresence initial={false}>
                  {!collapsed && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="px-2.5 pb-1 text-[9px] font-mono font-bold tracking-[0.14em] uppercase text-white/28 select-none"
                    >
                      {group.title}
                    </motion.div>
                  )}
                </AnimatePresence>

                {group.items.map((item) => (
                  <AppleNavItemRow
                    key={item.href}
                    item={item}
                    collapsed={collapsed}
                    pathname={pathname}
                    currentTab={currentTab}
                  />
                ))}
              </motion.div>
            ))}
          </div>

          {/* 4. Apple-Style Bottom Profile & System Status */}
          <div
            className="p-2.5 shrink-0"
            style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }}
          >
            <AnimatePresence initial={false}>
              {!collapsed && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-2"
                >
                  <div
                    className="p-2.5 rounded-xl flex items-center justify-between gap-2.5"
                    style={{
                      background: 'rgba(255, 255, 255, 0.035)',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                    }}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="relative">
                        <span className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#2F5BFF] to-[#14B8A6] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                          {(user?.full_name?.[0] || 'A').toUpperCase()}
                        </span>
                        <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-[#10B981] ring-2 ring-[#0A0E1C]" />
                      </div>
                      <div className="min-w-0 leading-tight">
                        <div className="text-[11px] font-semibold text-white/90 truncate">
                          {user?.full_name || 'Administrator'}
                        </div>
                        <div className="text-[9px] text-[#14B8A6] font-mono truncate">
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
                      className="w-6 h-6 rounded-lg hover:bg-rose-500/20 text-white/40 hover:text-rose-400 flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3 h-3" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quick status line */}
            <div className="flex items-center justify-between px-2 text-[10px] text-white/35 font-mono">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
                <span>Node Active</span>
              </span>
              <span className="text-white/20">mTLS 1.3</span>
            </div>
          </div>
        </motion.aside>

        {/* ════════════════════════════════════════════════════════
            MAIN WORKSPACE
        ════════════════════════════════════════════════════════ */}
        <div className="flex-1 flex flex-col min-w-0 relative z-10">
          {/* Apple-grade Translucent Top Header */}
          <header
            className="h-14 px-6 flex items-center justify-between gap-4 sticky top-0 z-20 shrink-0"
            style={{
              background: 'rgba(8, 12, 26, 0.72)',
              backdropFilter: 'blur(30px) saturate(180%)',
              WebkitBackdropFilter: 'blur(30px) saturate(180%)',
              borderBottom: '1px solid rgba(255, 255, 255, 0.065)',
            }}
          >
            {/* Top Hairline reflection */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/12 to-transparent pointer-events-none" />

            {/* Breadcrumb with SF-style breadcrumb animation */}
            <motion.div
              key={pathname + currentTab}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="flex items-center gap-2 min-w-0"
            >
              <span className="text-[11px] font-mono text-white/35 uppercase tracking-wider">{bc.section}</span>
              <span className="text-white/20 text-xs">/</span>
              <span className="text-[13px] font-bold text-white tracking-tight truncate">{bc.page}</span>
            </motion.div>

            {/* Spotlight Search Input */}
            <div className="flex-1 max-w-sm mx-4">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-white/30 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  value={searchVal}
                  onChange={(e) => setSearchVal(e.target.value)}
                  placeholder="Spotlight search (gates, guards, events)…"
                  className="w-full pl-8 pr-8 py-1.5 rounded-xl text-[12px] text-white/85 placeholder:text-white/25 outline-none transition-all"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    backdropFilter: 'blur(10px)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.borderColor = 'rgba(59, 130, 246, 0.45)';
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.15)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                />
                <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono text-white/30 border border-white/10 px-1 rounded">
                  ⌘K
                </span>
              </div>
            </div>

            {/* Right Tools */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Institution Pill */}
              <span
                className="hidden lg:inline-flex items-center gap-1.5 text-[11px] font-mono font-medium text-white/70 px-2.5 py-1 rounded-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.07)',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                IIM Sambalpur
              </span>

              {/* Notification Bell */}
              <div ref={notifRef} className="relative">
                <motion.button
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white/50 hover:text-white transition-colors relative cursor-pointer"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                  }}
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#3B82F6] shadow-[0_0_8px_rgba(59,130,246,0.9)]" />
                </motion.button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -6 }}
                      transition={appleSpring}
                      className="absolute right-0 mt-2 w-72 rounded-2xl p-4 space-y-3 z-50"
                      style={{
                        background: 'rgba(10, 14, 28, 0.96)',
                        backdropFilter: 'blur(30px)',
                        WebkitBackdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
                      }}
                    >
                      <div className="flex items-center justify-between pb-2" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.07)' }}>
                        <span className="text-[12px] font-semibold text-white/90">IIM Sambalpur Alerts</span>
                        <div className="flex items-center gap-2">
                          <Link href="/admin/notifications" className="text-[11px] text-[#14B8A6] font-medium hover:underline">
                            View all
                          </Link>
                          <button onClick={() => setNotifOpen(false)} className="text-white/40 hover:text-white cursor-pointer">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                      <div className="p-3 rounded-xl space-y-1" style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.07)' }}>
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                          <span className="text-[11px] font-semibold text-white/90">Main Gate 01 Online</span>
                        </div>
                        <p className="text-[10px] text-white/45 pl-3.5">Sub-300ms verification active. HMAC signed.</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Help & Support */}
              <motion.div whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }}>
                <Link
                  href="/admin/settings?tab=help"
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white/50 hover:text-white transition-colors cursor-pointer"
                  style={{
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.07)',
                  }}
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </Link>
              </motion.div>

              {/* User Dropdown */}
              <div ref={userRef} className="relative">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setUserOpen(!userOpen)}
                  className="flex items-center gap-2 pl-1 pr-2.5 py-1 rounded-full cursor-pointer transition-colors"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                  }}
                >
                  <span className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#2F5BFF] to-[#14B8A6] text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
                    {(user?.full_name?.[0] || 'A').toUpperCase()}
                  </span>
                  <span className="hidden sm:block text-[11px] font-semibold text-white/80">
                    {user?.full_name?.split(' ')[0] || 'Admin'}
                  </span>
                  <ChevronDown className="w-3 h-3 text-white/35" />
                </motion.button>

                <AnimatePresence>
                  {userOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -6 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -6 }}
                      transition={appleSpring}
                      className="absolute right-0 mt-2 w-56 rounded-2xl p-2 z-50"
                      style={{
                        background: 'rgba(10, 14, 28, 0.96)',
                        backdropFilter: 'blur(30px)',
                        WebkitBackdropFilter: 'blur(30px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.7)',
                      }}
                    >
                      <div className="px-3 py-2.5" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.07)' }}>
                        <div className="text-[12px] font-semibold text-white/90">{user?.full_name || 'Administrator'}</div>
                        <div className="text-[10px] text-white/40 truncate font-mono">{user?.email || 'admin@iimsambalpur.ac.in'}</div>
                        <span
                          className="inline-block mt-1.5 text-[9px] font-mono px-2 py-0.5 rounded-full font-bold text-[#14B8A6]"
                          style={{ background: 'rgba(20, 184, 166, 0.15)', border: '1px solid rgba(20, 184, 166, 0.25)' }}
                        >
                          IIM Sambalpur Security Officer
                        </span>
                      </div>

                      <div className="py-1 space-y-0.5">
                        <Link
                          href="/admin/settings"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <Settings className="w-3.5 h-3.5" />
                          <span>System Preferences</span>
                        </Link>
                        <Link
                          href="/"
                          target="_blank"
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>View Public Site</span>
                        </Link>
                      </div>

                      <div className="pt-1" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.07)' }}>
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            router.push('/admin/login');
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[11px] font-semibold text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </header>

          {/* PAGE CONTENT CONTAINER with Apple fluid page transition */}
          <motion.main
            key={pathname + currentTab}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 p-6 sm:p-8 max-w-[1540px] w-full mx-auto space-y-6"
          >
            {children}
          </motion.main>
        </div>
      </div>
    </DesktopOnlyGate>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <React.Suspense fallback={<div className="min-h-screen bg-[#070B1A]" />}>
        <AdminShell>{children}</AdminShell>
      </React.Suspense>
    </AuthProvider>
  );
}
