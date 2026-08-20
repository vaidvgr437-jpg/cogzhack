import React, { useState, useEffect } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  Search, 
  X, 
  Activity, 
  Pill, 
  ShieldAlert, 
  Cpu, 
  Heart, 
  BrainCircuit, 
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { NavigationTab } from '../../types';

export const SearchModal: React.FC = () => {
  const { 
    isSearchOpen, 
    setIsSearchOpen, 
    setActiveTab, 
    selectedPatient,
    medications,
    alerts,
    devices
  } = useDashboard();

  const [query, setQuery] = useState('');

  // Keyboard shortcut listener (Cmd+K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  if (!isSearchOpen) return null;

  const quickActions: { label: string; tab: NavigationTab; icon: any; category: string }[] = [
    { label: 'Overview & 3D Digital Twin', tab: 'overview', icon: BrainCircuit, category: 'Navigation' },
    { label: 'Live 50Hz Sensor Oscilloscope', tab: 'monitoring', icon: Activity, category: 'Monitoring' },
    { label: 'AI Mobility Risk & Stride Analytics', tab: 'mobility', icon: Heart, category: 'AI Intelligence' },
    { label: 'Smart Carousel Medicine Dispenser', tab: 'medication', icon: Pill, category: 'Medication' },
    { label: 'Emergency Escalation & Incident Records', tab: 'alerts', icon: ShieldAlert, category: 'Security' },
    { label: 'IoT Mesh Network & Diagnostics', tab: 'devices', icon: Cpu, category: 'Hardware' }
  ];

  const filteredActions = quickActions.filter(a =>
    a.label.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  const filteredMeds = medications.filter(m =>
    m.name.toLowerCase().includes(query.toLowerCase()) ||
    m.scheduledTime.toLowerCase().includes(query.toLowerCase())
  );

  const filteredAlerts = alerts.filter(a =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.location.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectTab = (tab: NavigationTab) => {
    setActiveTab(tab);
    setIsSearchOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl glass-panel-glow border border-cyan-500/40 p-4 shadow-2xl">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-900/90 border border-cyan-500/30">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search telemetry, medicines, incidents, hardware..."
            className="w-full bg-transparent text-sm text-white placeholder-slate-400 focus:outline-none font-mono"
            autoFocus
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results / Quick Navigator */}
        <div className="mt-4 space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          {/* Quick Pages */}
          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider mb-2">
              Command Shortcuts
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredActions.map((act) => {
                const Icon = act.icon;
                return (
                  <button
                    key={act.label}
                    onClick={() => handleSelectTab(act.tab)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-850 border border-slate-800 hover:border-cyan-500/40 text-left transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white">{act.label}</div>
                        <div className="text-[10px] font-mono text-slate-400">{act.category}</div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Matches in Medications */}
          {filteredMeds.length > 0 && query && (
            <div>
              <div className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider mb-2">
                Prescription & Schedule Matches
              </div>
              <div className="space-y-1.5">
                {filteredMeds.map((med) => (
                  <div
                    key={med.id}
                    onClick={() => handleSelectTab('medication')}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 cursor-pointer flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-white">{med.name}</span>
                      <span className="text-slate-400 text-[11px] ml-2">({med.dosage})</span>
                    </div>
                    <span className="font-mono text-cyan-300">{med.scheduledTime}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Matches in Incidents */}
          {filteredAlerts.length > 0 && query && (
            <div>
              <div className="text-[10px] font-mono text-red-400 uppercase tracking-wider mb-2">
                Incident & Alert Matches
              </div>
              <div className="space-y-1.5">
                {filteredAlerts.map((alt) => (
                  <div
                    key={alt.id}
                    onClick={() => handleSelectTab('alerts')}
                    className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-red-500/40 cursor-pointer flex items-center justify-between text-xs"
                  >
                    <span className="font-semibold text-white truncate max-w-[70%]">{alt.title}</span>
                    <span className="font-mono text-slate-400 text-[11px]">{alt.timeFormatted}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Hint */}
        <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>Active Patient: <strong className="text-white">{selectedPatient.name}</strong></span>
          <span>Press ESC or click outside to dismiss</span>
        </div>
      </div>
    </div>
  );
};
