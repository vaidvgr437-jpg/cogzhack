import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { NavigationTab } from '../../types';
import {
  LayoutDashboard,
  Activity,
  BrainCircuit,
  Pill,
  ShieldAlert,
  Cpu,
  Radio,
  ChevronLeft,
  ChevronRight,
  Shield,
  HeartPulse,
  Flame,
  PhoneCall,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const { activeTab, setActiveTab, alerts, isEmergencyActive, simulateFallEvent, selectedPatient } = useDashboard();

  const unresolvedAlertsCount = alerts.filter(a => !a.isResolved && (a.severity === 'critical' || a.severity === 'warning')).length;

  const navItems: { id: NavigationTab; label: string; icon: any; badge?: number; badgeColor?: string }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'monitoring', label: 'Live Monitoring', icon: Activity },
    { id: 'mobility', label: 'Mobility & AI', icon: BrainCircuit },
    { id: 'medication', label: 'Medication', icon: Pill },
    {
      id: 'alerts',
      label: 'Alerts & Incidents',
      icon: ShieldAlert,
      badge: unresolvedAlertsCount > 0 ? unresolvedAlertsCount : undefined,
      badgeColor: isEmergencyActive ? 'bg-red-500 text-white animate-bounce' : 'bg-amber-500 text-slate-950 font-bold'
    },
    { id: 'devices', label: 'Devices & Settings', icon: Cpu }
  ];

  const handleNav = (id: NavigationTab) => {
    setActiveTab(id);
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:static top-0 bottom-0 left-0 z-50 flex flex-col justify-between transition-all duration-300 ease-in-out glass-panel border-r border-slate-800/80 ${
          isMobileOpen ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Top Header / Branding */}
        <div>
          <div className="h-16 flex items-center justify-between px-4 border-b border-slate-800/80">
            <div className="flex items-center gap-3 overflow-hidden cursor-pointer" onClick={() => handleNav('overview')}>
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-blue-600 shadow-lg shadow-cyan-500/30 border border-cyan-400/40 shrink-0">
                <HeartPulse className="w-5 h-5 text-white" />
                <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
                </span>
              </div>

              {!isCollapsed && (
                <div className="flex flex-col">
                  <span className="text-base font-extrabold tracking-tight text-white font-mono flex items-center gap-1">
                    SENTINEL<span className="text-cyan-400">CARE</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                    AI Healthcare IoT
                  </span>
                </div>
              )}
            </div>

            {/* Collapse toggle (Desktop) */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center justify-center w-7 h-7 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/80 border border-transparent hover:border-slate-700 transition"
              title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Active Patient Snapshot Pill */}
          {!isCollapsed && (
            <div className="mx-3 mt-4 p-2.5 rounded-xl bg-slate-900/70 border border-slate-800/80 flex items-center gap-2.5">
              <img
                src={selectedPatient.avatar}
                alt={selectedPatient.name}
                className="w-8 h-8 rounded-lg object-cover border border-cyan-500/30 shrink-0"
              />
              <div className="flex flex-col overflow-hidden">
                <div className="text-xs font-bold text-white truncate flex items-center gap-1.5">
                  <span>{selectedPatient.name}</span>
                  <span className="text-[10px] font-mono text-slate-400">({selectedPatient.age}y)</span>
                </div>
                <div className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  ONLINE • MONITORING
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all relative ${
                    isActive
                      ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/10 text-cyan-300 font-bold border border-cyan-500/40 shadow-md shadow-cyan-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />

                  {!isCollapsed && (
                    <span className="truncate flex-1 text-left">{item.label}</span>
                  )}

                  {item.badge !== undefined && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono shrink-0 ${
                        item.badgeColor || 'bg-cyan-500/20 text-cyan-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-1 rounded-r-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Emergency Button & System Status */}
        <div className="p-3 border-t border-slate-800/80 space-y-2">
          {/* Emergency Fall Simulation Trigger */}
          <button
            onClick={simulateFallEvent}
            className="w-full py-2.5 px-3 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-bold font-mono flex items-center justify-center gap-2 shadow-sm transition hover:shadow-red-500/20 active:scale-98"
            title="Simulate Fall Event"
          >
            <Flame className="w-4 h-4 text-red-400 animate-pulse" />
            {!isCollapsed && <span>SIMULATE FALL (DEMO)</span>}
          </button>

          {/* Quick System Badge */}
          {!isCollapsed && (
            <div className="px-2 py-1.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-[10px] font-mono text-slate-400 flex items-center justify-between">
              <span className="flex items-center gap-1 text-emerald-400">
                <Radio className="w-3 h-3 text-emerald-400" />
                MQTT 8ms
              </span>
              <span>v2.4.1</span>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
