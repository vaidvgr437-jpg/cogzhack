import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { IncidentDetailDrawer } from '../components/cards/IncidentDetailDrawer';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Flame, 
  Activity, 
  Pill, 
  Cpu, 
  Clock, 
  MapPin, 
  ChevronRight, 
  Filter, 
  ArrowRight,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { IncidentType, Severity } from '../types';

export const AlertsIncidentsPage: React.FC = () => {
  const { 
    alerts, 
    selectedIncident, 
    setSelectedIncident, 
    isEmergencyActive, 
    simulateFallEvent, 
    cancelEmergency 
  } = useDashboard();

  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  const criticalCount = alerts.filter(a => a.severity === 'critical' && !a.isResolved).length;
  const warningCount = alerts.filter(a => a.severity === 'warning' && !a.isResolved).length;
  const resolvedCount = alerts.filter(a => a.isResolved).length;

  const filteredAlerts = alerts.filter(a => {
    if (filterType !== 'all' && a.type !== filterType) return false;
    if (filterSeverity !== 'all' && a.severity !== filterSeverity) return false;
    return true;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400" />
              INCIDENT COMMAND & ALERT ESCALATION
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Automated sensor audit trail, emergency escalation stages, and caregiver verification logs
          </p>
        </div>

        <div className="flex items-center gap-2">
          {!isEmergencyActive ? (
            <button
              onClick={simulateFallEvent}
              className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold shadow-md shadow-red-600/30 flex items-center gap-1.5 transition active:scale-95"
            >
              <Flame className="w-4 h-4" />
              <span>Trigger Fall Test (Demo)</span>
            </button>
          ) : (
            <button
              onClick={cancelEmergency}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition active:scale-95"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Acknowledge All Emergencies</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 Status KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Critical */}
        <div
          onClick={() => { setFilterSeverity('critical'); setFilterType('all'); }}
          className={`p-5 rounded-2xl glass-card border cursor-pointer flex items-center justify-between transition ${
            criticalCount > 0 ? 'border-red-500/60 bg-red-950/40 shadow-lg shadow-red-500/10' : 'border-slate-800'
          }`}
        >
          <div>
            <div className="text-xs font-mono text-red-400 font-bold uppercase">Critical Active</div>
            <div className="text-3xl font-extrabold font-mono text-white mt-1">
              {criticalCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Immediate intervention required</div>
          </div>
          <div className="p-3 rounded-2xl bg-red-500/20 text-red-400">
            <Flame className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        {/* Warning */}
        <div
          onClick={() => { setFilterSeverity('warning'); setFilterType('all'); }}
          className={`p-5 rounded-2xl glass-card border cursor-pointer flex items-center justify-between transition ${
            warningCount > 0 ? 'border-amber-500/50 bg-amber-950/30' : 'border-slate-800'
          }`}
        >
          <div>
            <div className="text-xs font-mono text-amber-400 font-bold uppercase">Warning Active</div>
            <div className="text-3xl font-extrabold font-mono text-white mt-1">
              {warningCount}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Mobility / medication deviations</div>
          </div>
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>

        {/* Resolved */}
        <div
          onClick={() => { setFilterSeverity('resolved'); setFilterType('all'); }}
          className="p-5 rounded-2xl glass-card border border-emerald-500/30 cursor-pointer flex items-center justify-between"
        >
          <div>
            <div className="text-xs font-mono text-emerald-400 font-bold uppercase">Resolved Total</div>
            <div className="text-3xl font-extrabold font-mono text-white mt-1">
              {resolvedCount + 15}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Caregiver verified safe</div>
          </div>
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Escalation Architecture Pipeline Infographic */}
      <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20">
        <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Automated Emergency Escalation Pipeline
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-900/80 border border-red-500/40 flex flex-col justify-between">
            <span className="text-[10px] text-red-400 font-bold">1. FALL DETECTION</span>
            <span className="text-xs text-white font-bold mt-1">3.4g+ IMU Deceleration</span>
            <span className="text-[10px] text-slate-400">Wristband Edge Filter</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 flex flex-col justify-between">
            <span className="text-[10px] text-cyan-400 font-bold">2. LOCAL BUZZER</span>
            <span className="text-xs text-white font-bold mt-1">0 - 15 Seconds</span>
            <span className="text-[10px] text-slate-400">Audible Alarm on Band</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 flex flex-col justify-between">
            <span className="text-[10px] text-blue-400 font-bold">3. PUSH NOTIFICATION</span>
            <span className="text-xs text-white font-bold mt-1">At 15 Seconds</span>
            <span className="text-[10px] text-slate-400">Caregiver Dashboard App</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700 flex flex-col justify-between">
            <span className="text-[10px] text-purple-400 font-bold">4. SMS TO FAMILY</span>
            <span className="text-xs text-white font-bold mt-1">At 30 Seconds</span>
            <span className="text-[10px] text-slate-400">Ananya Rao (+91 98450)</span>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/80 border border-red-500/40 flex flex-col justify-between">
            <span className="text-[10px] text-rose-400 font-bold">5. VOICE DISPATCH</span>
            <span className="text-xs text-white font-bold mt-1">At 45+ Seconds</span>
            <span className="text-[10px] text-slate-400">Automated Call Escalation</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl glass-panel border border-slate-800">
        {/* Category Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { id: 'all', label: 'All Incidents' },
            { id: 'fall', label: 'Falls', icon: Flame },
            { id: 'mobility', label: 'Mobility', icon: Activity },
            { id: 'medication', label: 'Medication', icon: Pill },
            { id: 'device', label: 'Hardware', icon: Cpu }
          ].map((tab) => {
            const Icon = tab.icon;
            const isSel = filterType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition ${
                  isSel
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Severity Filter */}
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-slate-500 text-[11px]">Severity:</span>
          {['all', 'critical', 'warning', 'resolved'].map((sev) => (
            <button
              key={sev}
              onClick={() => setFilterSeverity(sev)}
              className={`px-2 py-1 rounded-lg uppercase text-[10px] font-bold transition ${
                filterSeverity === sev
                  ? 'bg-slate-700 text-white border border-slate-600'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Incident List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="p-12 text-center text-xs font-mono text-slate-400 glass-panel rounded-2xl">
            No incident records found matching current filters.
          </div>
        ) : (
          filteredAlerts.map((incident) => {
            const isCrit = incident.severity === 'critical';
            const isWarn = incident.severity === 'warning';
            const isRes = incident.isResolved;

            return (
              <div
                key={incident.id}
                onClick={() => setSelectedIncident(incident)}
                className={`p-4 rounded-2xl glass-card border cursor-pointer transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isCrit && !isRes
                    ? 'border-red-500/60 bg-red-950/30 hover:border-red-400'
                    : isWarn && !isRes
                    ? 'border-amber-500/40 bg-amber-950/20 hover:border-amber-400'
                    : 'border-slate-800/80 hover:border-cyan-500/30'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                    isCrit && !isRes
                      ? 'bg-red-600/30 text-red-400 border border-red-500/50 animate-pulse'
                      : isWarn && !isRes
                      ? 'bg-amber-600/20 text-amber-400 border border-amber-500/40'
                      : 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40'
                  }`}>
                    {incident.type === 'fall' ? <Flame className="w-5 h-5" /> : incident.type === 'medication' ? <Pill className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        isCrit && !isRes ? 'bg-red-500 text-white' : isWarn && !isRes ? 'bg-amber-500 text-slate-950' : 'bg-emerald-600 text-white'
                      }`}>
                        {isRes ? 'RESOLVED' : incident.severity}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{incident.timeFormatted}</span>
                      <span className="text-xs font-mono text-slate-500">•</span>
                      <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {incident.location}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-white mt-1 leading-snug">
                      {incident.title}
                    </h4>

                    <p className="text-xs text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                      {incident.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                  <div className="text-left sm:text-right font-mono">
                    <div className="text-[10px] text-slate-400">Confidence</div>
                    <div className="text-xs font-bold text-cyan-300">{incident.confidence}% Match</div>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-cyan-400 transition">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Slide-over Detail Drawer */}
      <IncidentDetailDrawer />
    </div>
  );
};
