import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { DemoScenario } from '../../types';
import {
  Search,
  Bell,
  Radio,
  Clock,
  ChevronDown,
  User,
  ShieldAlert,
  Flame,
  Menu,
  CheckCircle2,
  AlertTriangle,
  WifiOff,
  Activity
} from 'lucide-react';

interface TopHeaderProps {
  onToggleMobileSidebar: () => void;
}

export const TopHeader: React.FC<TopHeaderProps> = ({ onToggleMobileSidebar }) => {
  const {
    selectedPatient,
    setSelectedPatient,
    patientsList,
    systemTime,
    lastSyncSecondsAgo,
    activeScenario,
    setScenario,
    alerts,
    isEmergencyActive,
    simulateFallEvent,
    setIsSearchOpen,
    isNotificationCenterOpen,
    setIsNotificationCenterOpen
  } = useDashboard();

  const [isPatientDropdownOpen, setIsPatientDropdownOpen] = useState(false);

  const unreadAlerts = alerts.filter(a => !a.isResolved);

  const scenarios: { id: DemoScenario; label: string; icon: any; color: string }[] = [
    { id: 'normal', label: 'Normal Day', icon: CheckCircle2, color: 'text-emerald-400' },
    { id: 'mobility_decline', label: 'Mobility Decline', icon: Activity, color: 'text-amber-400' },
    { id: 'fall_detection', label: 'Fall Event', icon: Flame, color: 'text-red-400' },
    { id: 'missed_medication', label: 'Missed Med', icon: AlertTriangle, color: 'text-amber-300' },
    { id: 'device_offline', label: 'Device Offline', icon: WifiOff, color: 'text-slate-400' }
  ];

  return (
    <header className="sticky top-0 z-30 flex flex-col bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
      {/* Primary Top Bar */}
      <div className="h-16 px-4 lg:px-6 flex items-center justify-between gap-4">
        {/* Left: Mobile Menu Toggle & Greetings */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileSidebar}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-800"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold text-slate-200">
                Good afternoon, <span className="text-white font-bold">Rahul</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                Senior Caregiver
              </span>
            </div>

            {/* Subtitle / Status */}
            <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
              <span className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${isEmergencyActive ? 'bg-red-500 animate-ping' : 'bg-emerald-400 animate-pulse'}`}></span>
                <span className={isEmergencyActive ? 'text-red-400 font-bold' : 'text-emerald-400'}>
                  {isEmergencyActive ? 'CRITICAL FALL ALERT' : 'SYSTEM NORMAL'}
                </span>
              </span>
              <span className="hidden md:inline text-slate-600">•</span>
              <span className="hidden md:flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                Synced {lastSyncSecondsAgo}s ago
              </span>
            </div>
          </div>
        </div>

        {/* Center: Elderly Person Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsPatientDropdownOpen(!isPatientDropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800/80 border border-cyan-500/30 text-xs text-white shadow-sm transition"
          >
            <img
              src={selectedPatient.avatar}
              alt={selectedPatient.name}
              className="w-6 h-6 rounded-lg object-cover border border-cyan-400/40"
            />
            <div className="flex flex-col text-left">
              <span className="font-bold leading-tight">{selectedPatient.name}</span>
              <span className="text-[10px] font-mono text-cyan-400 leading-tight">{selectedPatient.room}</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
          </button>

          {/* Dropdown Menu */}
          {isPatientDropdownOpen && (
            <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900/95 border border-cyan-500/30 backdrop-blur-xl shadow-2xl p-2 z-50 animate-fadeIn">
              <div className="px-3 py-1.5 text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-slate-800">
                Assigned Elderly Residents
              </div>
              <div className="space-y-1 mt-1">
                {patientsList.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedPatient(p);
                      setIsPatientDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left text-xs transition ${
                      selectedPatient.id === p.id
                        ? 'bg-cyan-500/20 text-cyan-200 font-bold border border-cyan-500/40'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <img src={p.avatar} alt={p.name} className="w-7 h-7 rounded-lg object-cover" />
                    <div className="flex flex-col overflow-hidden">
                      <span className="truncate">{p.name} ({p.age}y)</span>
                      <span className="text-[10px] font-mono text-slate-400 truncate">{p.room}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Actions: Clock, Search, Notification Bell, Emergency Trigger */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Live System Clock */}
          <div className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs font-mono text-slate-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            <span>{systemTime}</span>
          </div>

          {/* Global Search Button (Cmd+K) */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs text-slate-400 border border-slate-800 hover:border-slate-700 transition"
            title="Search dashboard (Cmd+K)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Search...</span>
            <kbd className="hidden md:inline px-1.5 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-400">
              ⌘K
            </kbd>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setIsNotificationCenterOpen(!isNotificationCenterOpen)}
              className="relative p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800 transition"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadAlerts.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-mono font-bold text-white shadow-sm">
                  {unreadAlerts.length}
                </span>
              )}
            </button>
          </div>

          {/* Emergency SOS Button */}
          <button
            onClick={simulateFallEvent}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold font-mono shadow-md shadow-red-600/30 transition active:scale-95"
          >
            <ShieldAlert className="w-4 h-4" />
            <span>SOS</span>
          </button>
        </div>
      </div>

      {/* Global Scenario Selector Bar */}
      <div className="px-4 lg:px-6 py-2 bg-slate-900/60 border-t border-slate-800/60 flex items-center justify-between gap-2 overflow-x-auto">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            DEMO SCENARIOS:
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            const isActive = activeScenario === sc.id;

            return (
              <button
                key={sc.id}
                onClick={() => setScenario(sc.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/50 shadow-sm shadow-cyan-500/10'
                    : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${sc.color}`} />
                <span>{sc.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
