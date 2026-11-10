import React from 'react';
import { ShieldCheck, Download, LayoutDashboard, Database, Activity, UserPlus, Users, ArrowRight, Smartphone } from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (val: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, isAdminLoggedIn, setIsAdminLoggedIn }) => {
  const isPublic = ['home', 'download', 'security'].includes(currentTab);

  return (
    <header className="sticky top-0 z-50 bg-background/90 backdrop-blur-md border-b border-gatewise-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Institution Badge */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setCurrentTab('home')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gatewise-primary to-gatewise-deep flex items-center justify-center text-white shadow-sm ring-1 ring-gatewise-primary/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg text-gatewise-text tracking-tight">GATEWISE<span className="text-gatewise-primary ml-1">AI</span></span>
                <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-gatewise-light text-gatewise-deep border border-gatewise-primary/20">
                  v1.0.0
                </span>
              </div>
              <p className="text-[11px] text-gatewise-secondary font-medium leading-none">IIM Sambalpur Campus Security</p>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {isPublic ? (
              <>
                <button
                  onClick={() => setCurrentTab('home')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'home'
                      ? 'bg-gatewise-light text-gatewise-deep'
                      : 'text-gatewise-secondary hover:text-gatewise-text hover:bg-gatewise-border/40'
                  }`}
                >
                  Overview
                </button>
                <button
                  onClick={() => setCurrentTab('download')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    currentTab === 'download'
                      ? 'bg-gatewise-light text-gatewise-deep'
                      : 'text-gatewise-secondary hover:text-gatewise-text hover:bg-gatewise-border/40'
                  }`}
                >
                  <Download className="w-4 h-4" />
                  <span>Guard APK Release</span>
                </button>
                <button
                  onClick={() => setCurrentTab('security')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    currentTab === 'security'
                      ? 'bg-gatewise-light text-gatewise-deep'
                      : 'text-gatewise-secondary hover:text-gatewise-text hover:bg-gatewise-border/40'
                  }`}
                >
                  Privacy & Cryptography
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setCurrentTab('admin-dashboard')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    currentTab === 'admin-dashboard'
                      ? 'bg-gatewise-light text-gatewise-deep'
                      : 'text-gatewise-secondary hover:text-gatewise-text hover:bg-gatewise-border/40'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Command Centre</span>
                </button>
                <button
                  onClick={() => setCurrentTab('admin-activity')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    currentTab === 'admin-activity'
                      ? 'bg-gatewise-light text-gatewise-deep'
                      : 'text-gatewise-secondary hover:text-gatewise-text hover:bg-gatewise-border/40'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>Live Event Audit</span>
                </button>
                <button
                  onClick={() => setCurrentTab('admin-repository')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    currentTab === 'admin-repository'
                      ? 'bg-gatewise-light text-gatewise-deep'
                      : 'text-gatewise-secondary hover:text-gatewise-text hover:bg-gatewise-border/40'
                  }`}
                >
                  <Database className="w-4 h-4" />
                  <span>Drive Sync</span>
                </button>
                <button
                  onClick={() => setCurrentTab('admin-visitors')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    currentTab === 'admin-visitors'
                      ? 'bg-gatewise-light text-gatewise-deep'
                      : 'text-gatewise-secondary hover:text-gatewise-text hover:bg-gatewise-border/40'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Visitors</span>
                </button>
                <button
                  onClick={() => setCurrentTab('admin-enrollment')}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    currentTab === 'admin-enrollment'
                      ? 'bg-gatewise-light text-gatewise-deep'
                      : 'text-gatewise-secondary hover:text-gatewise-text hover:bg-gatewise-border/40'
                  }`}
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Referrals Queue</span>
                </button>
              </>
            )}
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center space-x-3">
            {/* Guard Mobile Experience Toggle */}
            <button
              onClick={() => setCurrentTab('guard-mobile')}
              className={`hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wide border transition-all ${
                currentTab === 'guard-mobile'
                  ? 'bg-gatewise-deep text-white border-gatewise-deep'
                  : 'bg-white text-gatewise-deep border-gatewise-borderMedium hover:bg-gatewise-light/40 shadow-sm'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>Guard Terminal</span>
            </button>

            {isPublic ? (
              <button
                onClick={() => {
                  if (isAdminLoggedIn) {
                    setCurrentTab('admin-dashboard');
                  } else {
                    setCurrentTab('admin-login');
                  }
                }}
                className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-sm font-medium text-white bg-gatewise-primary hover:bg-gatewise-deep transition-all shadow-sm"
              >
                <span>Admin Portal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentTab('home')}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-gatewise-secondary hover:text-gatewise-text border border-gatewise-border hover:bg-white"
                >
                  Public Site
                </button>
                <button
                  onClick={() => {
                    setIsAdminLoggedIn(false);
                    setCurrentTab('home');
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-gatewise-error hover:bg-red-50 border border-red-200"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
