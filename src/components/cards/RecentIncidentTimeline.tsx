import React, { useState, useMemo } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { AlertIncident, Severity } from '../../types';
import { 
  Clock, 
  Flame, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  MapPin, 
  Activity, 
  ChevronRight, 
  ArrowRight, 
  CornerDownRight, 
  Radio, 
  Zap, 
  Filter, 
  Volume2, 
  RotateCcw,
  Check,
  Eye,
  Calendar,
  Layers,
  ArrowUpRight,
  ShieldCheck
} from 'lucide-react';

interface RecentIncidentTimelineProps {
  onSelectIncident?: (incident: AlertIncident) => void;
  className?: string;
}

export const RecentIncidentTimeline: React.FC<RecentIncidentTimelineProps> = ({ 
  onSelectIncident,
  className = '' 
}) => {
  const { 
    alerts, 
    setSelectedIncident, 
    resolveAlert, 
    simulateFallEvent,
    addToast 
  } = useDashboard();

  const [severityFilter, setSeverityFilter] = useState<'all' | 'critical' | 'warning' | 'resolved'>('all');
  const [showResolved, setShowResolved] = useState<boolean>(true);
  const [expandedResponseId, setExpandedResponseId] = useState<string | null>(null);

  // Extract and filter fall incidents
  const fallIncidents = useMemo(() => {
    return alerts
      .filter(a => a.type === 'fall')
      .filter(a => {
        if (!showResolved && a.isResolved) return false;
        if (severityFilter === 'all') return true;
        if (severityFilter === 'resolved') return a.isResolved;
        if (severityFilter === 'critical') return a.severity === 'critical';
        if (severityFilter === 'warning') return a.severity === 'warning';
        return true;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [alerts, severityFilter, showResolved]);

  // Statistics for timeline summary
  const totalFalls = alerts.filter(a => a.type === 'fall').length;
  const activeFalls = alerts.filter(a => a.type === 'fall' && !a.isResolved).length;
  const criticalFalls = alerts.filter(a => a.type === 'fall' && a.severity === 'critical').length;

  const handleIncidentClick = (incident: AlertIncident) => {
    setSelectedIncident(incident);
    if (onSelectIncident) {
      onSelectIncident(incident);
    }
  };

  const handleQuickResolve = (e: React.MouseEvent, incident: AlertIncident) => {
    e.stopPropagation();
    resolveAlert(incident.id, 'Resolved via Recent Incident Timeline protocol verification.');
    addToast('Incident Resolved', `Fall incident at ${incident.location} marked as verified and resolved.`, 'success');
  };

  // Helper to retrieve or format the AI-recommended response
  const getAIResponse = (incident: AlertIncident) => {
    if (incident.aiRecommendedResponse && typeof incident.aiRecommendedResponse === 'object') {
      return incident.aiRecommendedResponse;
    }

    // Default intelligent fall response based on severity & sensor data
    const isCrit = incident.severity === 'critical';
    const peakG = incident.sensorEvidence?.peakAccelerationG || 3.0;

    if (isCrit) {
      return {
        action: `Initiate immediate 2-way audio prompt through Sentinel Hub. Peak deceleration of ${peakG}G exceeds safety threshold. Request vocal confirmation of alertness.`,
        protocol: 'Acute Deceleration Fall Protocol (Level 1 Emergency)',
        priority: 'IMMEDIATE' as const,
        targetTime: '< 30 seconds',
        steps: [
          'Sound 85dB pulse tone on wristband speaker',
          'Open two-way intercom audio channel via Sentinel Hub',
          'Evaluate posture recovery telemetry; dispatch EMS if no vocal response within 45s'
        ]
      };
    }

    return {
      action: 'Conduct routine physical stability check, inspect pathway lighting, and document balance deviation in physical therapy logs.',
      protocol: 'Moderate Deceleration & Balance Recovery Protocol',
      priority: 'HIGH' as const,
      targetTime: '< 3 minutes',
      steps: [
        'Perform gait assessment with on-duty nursing staff',
        'Verify walking aid placement and clear ambient obstructions',
        'Re-calibrate wristband MPU6050 zero-velocity threshold'
      ]
    };
  };

  const formatIncidentTimestamp = (timestampStr: string, formattedFallback?: string) => {
    try {
      const date = new Date(timestampStr);
      if (isNaN(date.getTime())) return formattedFallback || timestampStr;
      
      const time = date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit',
        hour12: true 
      });
      const monthDay = date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      return { time, monthDay };
    } catch {
      return { time: formattedFallback || 'Recent', monthDay: 'Recorded' };
    }
  };

  return (
    <div id="recent-incident-timeline-component" className={`space-y-4 ${className}`}>
      {/* Component Header & Filter Bar */}
      <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-cyan-500/20 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-500/10 text-red-400 border border-red-500/30 shadow-md shadow-red-500/10 shrink-0">
              <Clock className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  RECENT INCIDENT TIMELINE
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-500/15 text-red-300 border border-red-500/30">
                  Fall Telemetry Audit
                </span>
                {activeFalls > 0 && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-600 text-white animate-pulse flex items-center gap-1">
                    <Flame className="w-3 h-3" />
                    {activeFalls} ACTIVE FALL{activeFalls > 1 ? 'S' : ''}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                Visual chronological audit of fall detection events, impact severity levels, and automated AI clinical decision responses
              </p>
            </div>
          </div>

          {/* Quick Metrics & Trigger Demo Fall Button */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              id="timeline-simulate-fall-btn"
              type="button"
              onClick={simulateFallEvent}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-mono font-bold shadow-lg shadow-red-600/30 border border-red-500/40 flex items-center gap-1.5 transition active:scale-95"
              title="Trigger simulated fall event to test live timeline updates"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Simulate Fall Event</span>
            </button>
          </div>
        </div>

        {/* Filter Controls & View Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800/80 text-xs font-mono">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-400 text-[11px] flex items-center gap-1 mr-1">
              <Filter className="w-3 h-3 text-cyan-400" /> Severity Filter:
            </span>
            {[
              { id: 'all', label: `All Falls (${totalFalls})` },
              { id: 'critical', label: `Critical (${criticalFalls})` },
              { id: 'warning', label: 'Warnings' },
              { id: 'resolved', label: 'Resolved' }
            ].map(item => (
              <button
                key={item.id}
                id={`timeline-filter-${item.id}`}
                onClick={() => setSeverityFilter(item.id as any)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                  severityFilter === item.id
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 text-slate-300 cursor-pointer text-xs select-none">
              <input
                type="checkbox"
                checked={showResolved}
                onChange={(e) => setShowResolved(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-500"
              />
              <span className="text-slate-400 text-[11px]">Include Verified Resolved History</span>
            </label>
          </div>
        </div>
      </div>

      {/* Main Chronological Timeline Container */}
      <div className="relative p-4 sm:p-6 rounded-2xl glass-panel border border-slate-800/90 shadow-xl overflow-hidden">
        {/* Subtle Background Glow Accent */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-600/5 rounded-full blur-3xl pointer-events-none" />

        {fallIncidents.length === 0 ? (
          <div className="py-16 text-center space-y-3 font-mono">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-white">No Fall Incidents Matching Filter</div>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Wristband inertial measurement sensors report steady gait cadence. Trigger a simulated test to observe real-time timeline visualization.
            </p>
            <button
              type="button"
              onClick={simulateFallEvent}
              className="mt-2 px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-300 border border-red-500/40 text-xs font-mono font-bold inline-flex items-center gap-1.5 transition"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Simulate Fall Event Now</span>
            </button>
          </div>
        ) : (
          <div className="relative">
            {/* Continuous Vertical Timeline Rail Line */}
            <div className="absolute top-4 bottom-4 left-4 sm:left-6 w-0.5 bg-gradient-to-b from-red-500 via-amber-500 to-emerald-500/40" />

            {/* Timeline Items */}
            <div className="space-y-6">
              {fallIncidents.map((incident, index) => {
                const isCrit = incident.severity === 'critical';
                const isWarn = incident.severity === 'warning';
                const isRes = incident.isResolved;
                const aiResponse = getAIResponse(incident);
                const isExpanded = expandedResponseId === incident.id;
                const dateObj = formatIncidentTimestamp(incident.timestamp, incident.timeFormatted);

                return (
                  <div 
                    key={incident.id} 
                    id={`timeline-incident-${incident.id}`}
                    className="relative pl-10 sm:pl-14 group transition-all"
                  >
                    {/* Glowing Timeline Node Dot */}
                    <div 
                      className={`absolute left-2 sm:left-4 top-4 -translate-x-1/2 w-5 h-5 rounded-full border-2 flex items-center justify-center z-10 transition-transform group-hover:scale-125 ${
                        isCrit && !isRes
                          ? 'bg-red-600 border-red-400 shadow-lg shadow-red-500/50 ring-4 ring-red-500/20'
                          : isWarn && !isRes
                          ? 'bg-amber-500 border-amber-300 shadow-md shadow-amber-500/30'
                          : 'bg-emerald-600 border-emerald-400 shadow-md shadow-emerald-500/20'
                      }`}
                    >
                      {isRes ? (
                        <Check className="w-2.5 h-2.5 text-white stroke-[3]" />
                      ) : isCrit ? (
                        <Flame className="w-2.5 h-2.5 text-white animate-pulse" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>

                    {/* Timeline Event Card */}
                    <div 
                      onClick={() => handleIncidentClick(incident)}
                      className={`p-4 sm:p-5 rounded-2xl glass-card border cursor-pointer transition-all duration-200 hover:shadow-2xl ${
                        isCrit && !isRes
                          ? 'border-red-500/50 bg-red-950/25 hover:border-red-400 shadow-lg shadow-red-500/5'
                          : isWarn && !isRes
                          ? 'border-amber-500/40 bg-amber-950/20 hover:border-amber-400'
                          : 'border-slate-800/80 bg-slate-900/60 hover:border-cyan-500/40'
                      }`}
                    >
                      {/* Top Bar: Timestamps & Severity Badges */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-slate-800/80">
                        <div className="flex items-center gap-2.5 flex-wrap">
                          {/* Severity Badge */}
                          <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 ${
                            isCrit && !isRes
                              ? 'bg-red-600 text-white shadow-sm shadow-red-600/40 animate-pulse'
                              : isWarn && !isRes
                              ? 'bg-amber-500 text-slate-950 font-extrabold'
                              : 'bg-emerald-600/90 text-white'
                          }`}>
                            {isRes ? (
                              <>
                                <CheckCircle2 className="w-3 h-3" />
                                RESOLVED
                              </>
                            ) : isCrit ? (
                              <>
                                <Flame className="w-3 h-3" />
                                CRITICAL FALL
                              </>
                            ) : (
                              <>
                                <AlertTriangle className="w-3 h-3" />
                                WARNING (STUMBLE)
                              </>
                            )}
                          </span>

                          {/* Fall Detection Flag */}
                          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                            IMU Decel Trigger
                          </span>

                          {/* Location Pin */}
                          <span className="text-xs font-mono text-cyan-400 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-cyan-400" />
                            {incident.location}
                          </span>
                        </div>

                        {/* Visual Timestamp Block */}
                        <div className="flex items-center gap-2 font-mono text-xs text-slate-300 shrink-0">
                          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/80 border border-slate-800 text-slate-300">
                            <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                            <span className="font-bold text-white">
                              {typeof dateObj === 'object' ? dateObj.time : dateObj}
                            </span>
                            <span className="text-slate-500">•</span>
                            <span className="text-[11px] text-slate-400">
                              {typeof dateObj === 'object' ? dateObj.monthDay : incident.timeFormatted}
                            </span>
                          </div>

                          {/* Detail Drawer Arrow */}
                          <div className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition">
                            <ChevronRight className="w-3.5 h-3.5" />
                          </div>
                        </div>
                      </div>

                      {/* Incident Title & Description */}
                      <div className="mt-3">
                        <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                          {incident.title}
                          {index === 0 && (
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              LATEST EVENT
                            </span>
                          )}
                        </h3>
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                          {incident.description}
                        </p>
                      </div>

                      {/* Sensor Evidence Pills */}
                      <div className="mt-3 flex items-center gap-2 flex-wrap font-mono text-[11px]">
                        <div className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-1.5 text-slate-300">
                          <Zap className="w-3 h-3 text-red-400" />
                          <span>Peak Decel:</span>
                          <strong className="text-white">{incident.sensorEvidence?.peakAccelerationG}g</strong>
                        </div>
                        <div className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-1.5 text-slate-300">
                          <Activity className="w-3 h-3 text-amber-400" />
                          <span>Angular Velocity:</span>
                          <strong className="text-white">{incident.sensorEvidence?.rotationRateDegS}°/s</strong>
                        </div>
                        <div className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-1.5 text-slate-300">
                          <Clock className="w-3 h-3 text-cyan-400" />
                          <span>Impact Duration:</span>
                          <strong className="text-white">{incident.sensorEvidence?.impactDurationMs}ms</strong>
                        </div>
                        <div className="px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 flex items-center gap-1.5 text-slate-400">
                          <Radio className="w-3 h-3 text-blue-400" />
                          <span className="truncate max-w-[150px]">{incident.device}</span>
                        </div>
                        <div className="ml-auto text-[10px] text-slate-400">
                          AI Confidence: <strong className="text-cyan-300">{incident.confidence}%</strong>
                        </div>
                      </div>

                      {/* Immediate AI-Recommended Response Container */}
                      <div 
                        className={`mt-4 p-3.5 sm:p-4 rounded-xl border relative transition-all ${
                          isCrit && !isRes
                            ? 'bg-gradient-to-br from-red-950/40 to-slate-900/90 border-red-500/40 shadow-md shadow-red-950/50'
                            : isWarn && !isRes
                            ? 'bg-gradient-to-br from-amber-950/30 to-slate-900/90 border-amber-500/30'
                            : 'bg-slate-950/70 border-cyan-500/20'
                        }`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* AI Header */}
                        <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-800/60 flex-wrap">
                          <div className="flex items-center gap-2">
                            <div className="p-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                            </div>
                            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-cyan-300">
                              Immediate AI-Recommended Response
                            </span>
                          </div>

                          <div className="flex items-center gap-2 font-mono text-[10px]">
                            <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                              aiResponse.priority === 'IMMEDIATE'
                                ? 'bg-red-600 text-white'
                                : 'bg-amber-500 text-slate-950'
                            }`}>
                              {aiResponse.priority}
                            </span>
                            <span className="text-cyan-400 font-bold">
                              SLA: {aiResponse.targetTime}
                            </span>
                          </div>
                        </div>

                        {/* Action Text */}
                        <div className="mt-2 text-xs text-white font-medium leading-relaxed flex items-start gap-2">
                          <CornerDownRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                          <p className="flex-1">
                            {aiResponse.action}
                          </p>
                        </div>

                        {/* Recommended Clinical Protocol Steps */}
                        {aiResponse.steps && aiResponse.steps.length > 0 && (
                          <div className="mt-2.5 pt-2 border-t border-slate-800/60">
                            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
                              <span className="text-slate-300 font-semibold">{aiResponse.protocol}</span>
                              <button
                                type="button"
                                onClick={() => setExpandedResponseId(isExpanded ? null : incident.id)}
                                className="text-cyan-400 hover:text-cyan-300 underline text-[10px]"
                              >
                                {isExpanded ? 'Collapse Checklist' : `View Protocol Steps (${aiResponse.steps.length})`}
                              </button>
                            </div>

                            {isExpanded && (
                              <div className="mt-2 space-y-1.5 animate-fadeIn">
                                {aiResponse.steps.map((step, sIdx) => (
                                  <div 
                                    key={sIdx}
                                    className="flex items-start gap-2 p-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-[11px] font-mono text-slate-300"
                                  >
                                    <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center justify-center text-[9px] font-bold shrink-0 mt-0.5">
                                      {sIdx + 1}
                                    </span>
                                    <span>{step}</span>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Quick Interactive Actions */}
                        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                          <div className="text-[10px] font-mono text-slate-400">
                            Caregiver Status: <span className="text-slate-300">{incident.caregiverResponse || 'Pending triage'}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            {!isRes && (
                              <button
                                type="button"
                                onClick={(e) => handleQuickResolve(e, incident)}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold flex items-center gap-1 transition"
                              >
                                <Check className="w-3 h-3" />
                                <span>Verify Safe & Resolve</span>
                              </button>
                            )}

                            <button
                              type="button"
                              onClick={() => handleIncidentClick(incident)}
                              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-mono font-bold flex items-center gap-1 transition"
                            >
                              <Eye className="w-3 h-3 text-cyan-400" />
                              <span>Inspect Sensor Graphs</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
