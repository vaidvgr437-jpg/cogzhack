import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  MapPin, 
  Cpu, 
  Clock, 
  Zap, 
  MessageSquare, 
  PhoneCall, 
  Send,
  Camera,
  Scale
} from 'lucide-react';

export const IncidentDetailDrawer: React.FC = () => {
  const { selectedIncident, setSelectedIncident, resolveAlert } = useDashboard();
  const [resolutionNotes, setResolutionNotes] = useState('');

  if (!selectedIncident) return null;

  const handleResolve = () => {
    resolveAlert(selectedIncident.id, resolutionNotes || 'Resolved by Caregiver via Decision Support Console.');
    setSelectedIncident(null);
  };

  const isCrit = selectedIncident.severity === 'critical';
  const isWarn = selectedIncident.severity === 'warning';
  const isRes = selectedIncident.isResolved;

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setSelectedIncident(null)}
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
      />

      {/* Drawer */}
      <div className="fixed top-0 bottom-0 right-0 z-50 w-full max-w-lg glass-panel border-l border-cyan-500/30 p-6 overflow-y-auto shadow-2xl flex flex-col justify-between animate-fadeIn">
        <div className="space-y-5">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${
                isCrit ? 'bg-red-500/20 text-red-400 border border-red-500/40' : isWarn ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              }`}>
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    isCrit ? 'bg-red-600 text-white' : isWarn ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
                  }`}>
                    {selectedIncident.severity}
                  </span>
                  <span className="text-xs font-mono text-cyan-400">
                    AI Confidence: {selectedIncident.confidence}%
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1 leading-snug">
                  {selectedIncident.title}
                </h3>
              </div>
            </div>

            <button
              onClick={() => setSelectedIncident(null)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Description */}
          <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-200 leading-relaxed">
            {selectedIncident.description}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 text-[10px] flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" /> Timestamp
              </span>
              <span className="text-white font-bold block mt-1">{selectedIncident.timeFormatted}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <span className="text-slate-400 text-[10px] flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Location
              </span>
              <span className="text-white font-bold block mt-1">{selectedIncident.location}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 col-span-2">
              <span className="text-slate-400 text-[10px] flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-purple-400" /> Originating IoT Sensor Node
              </span>
              <span className="text-cyan-300 font-bold block mt-1">{selectedIncident.device}</span>
            </div>
          </div>

          {/* Sensor Evidence Breakdown */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-cyan-500/20">
            <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              Hardware Telemetry Evidence
            </div>

            <div className="grid grid-cols-3 gap-2 text-center font-mono">
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">Peak Acc</div>
                <div className="text-xs font-bold text-white mt-0.5">{selectedIncident.sensorEvidence.peakAccelerationG} G</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">Rotation</div>
                <div className="text-xs font-bold text-white mt-0.5">{selectedIncident.sensorEvidence.rotationRateDegS}°/s</div>
              </div>
              <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <div className="text-[10px] text-slate-400">Impact Duration</div>
                <div className="text-xs font-bold text-white mt-0.5">{selectedIncident.sensorEvidence.impactDurationMs} ms</div>
              </div>
            </div>

            {selectedIncident.sensorEvidence.weightDeltaG !== undefined && (
              <div className="mt-2.5 p-2 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400 flex items-center gap-1">
                  <Scale className="w-3.5 h-3.5 text-emerald-400" /> HX711 Load Cell Delta:
                </span>
                <span className="text-emerald-400 font-bold">{selectedIncident.sensorEvidence.weightDeltaG}g</span>
              </div>
            )}
          </div>

          {/* Escalation Stage Progression */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">
              Escalation Audit Trail
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div className="flex items-center justify-between p-1.5 rounded bg-slate-950/60">
                <span>1. Local ESP32 Buzzer</span>
                <span className={selectedIncident.escalationStages.buzzer ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {selectedIncident.escalationStages.buzzer ? 'Triggered ✓' : 'Bypassed'}
                </span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-slate-950/60">
                <span>2. In-App Push Notification</span>
                <span className={selectedIncident.escalationStages.push ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {selectedIncident.escalationStages.push ? 'Delivered ✓' : 'Queued'}
                </span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-slate-950/60">
                <span>3. SMS Alert (Family Contact)</span>
                <span className={selectedIncident.escalationStages.sms ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
                  {selectedIncident.escalationStages.sms ? 'Sent ✓' : 'N/A'}
                </span>
              </div>
              <div className="flex items-center justify-between p-1.5 rounded bg-slate-950/60">
                <span>4. Automated Voice Escalation</span>
                <span className={selectedIncident.escalationStages.call ? 'text-red-400 font-bold' : 'text-slate-500'}>
                  {selectedIncident.escalationStages.call ? 'Dialed' : 'Not Required'}
                </span>
              </div>
            </div>
          </div>

          {/* Resolution & Caregiver Notes */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
              Caregiver Observation & Resolution Log
            </label>
            <textarea
              rows={3}
              value={resolutionNotes}
              onChange={(e) => setResolutionNotes(e.target.value)}
              placeholder="Enter resolution notes, patient condition check, or physician follow-up instructions..."
              className="w-full p-3 rounded-xl bg-slate-900/90 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-sans"
              defaultValue={selectedIncident.notes}
            />
          </div>
        </div>

        {/* Action Button Footer */}
        <div className="pt-4 border-t border-slate-800 flex items-center gap-2">
          {!isRes ? (
            <button
              onClick={handleResolve}
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition active:scale-98"
            >
              <CheckCircle2 className="w-4 h-4" />
              Acknowledge & Mark Incident Resolved
            </button>
          ) : (
            <div className="w-full py-2.5 rounded-xl bg-slate-900 border border-emerald-500/30 text-emerald-300 text-xs font-mono text-center flex items-center justify-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Resolved on {selectedIncident.resolvedAt || 'Today'}
            </div>
          )}
        </div>
      </div>
    </>
  );
};
