import React, { useEffect, useRef } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  ShieldAlert, 
  Volume2, 
  VolumeX, 
  PhoneCall, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Activity,
  AlertOctagon,
  UserCheck
} from 'lucide-react';

export const EmergencyModal: React.FC = () => {
  const { 
    isEmergencyActive, 
    emergencyTimer, 
    cancelEmergency, 
    isBuzzerActive, 
    toggleBuzzer,
    selectedPatient,
    telemetry
  } = useDashboard();

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);

  // Web Audio buzzer sound synthesis
  useEffect(() => {
    if (isEmergencyActive && isBuzzerActive) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const ctx = new AudioContextClass();
          audioCtxRef.current = ctx;

          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(880, ctx.currentTime); // 880Hz alert tone

          // Pulsing volume
          gain.gain.setValueAtTime(0.08, ctx.currentTime);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start();
          oscRef.current = osc;
        }
      } catch (e) {
        console.warn('AudioContext prevented by autoplay policy', e);
      }
    } else {
      if (oscRef.current) {
        try {
          oscRef.current.stop();
          oscRef.current.disconnect();
        } catch (e) {}
        oscRef.current = null;
      }
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
        audioCtxRef.current = null;
      }
    }

    return () => {
      if (oscRef.current) {
        try { oscRef.current.stop(); } catch (e) {}
      }
      if (audioCtxRef.current) {
        try { audioCtxRef.current.close(); } catch (e) {}
      }
    };
  }, [isEmergencyActive, isBuzzerActive]);

  if (!isEmergencyActive) return null;

  // Escalation stages based on emergencyTimer seconds
  const stageBuzzer = true;
  const stagePush = emergencyTimer >= 5;
  const stageSMS = emergencyTimer >= 15;
  const stageCall = emergencyTimer >= 30;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-xl animate-fadeIn">
      {/* Red Glowing Alert Card */}
      <div className="relative w-full max-w-2xl rounded-3xl glass-panel-danger border-2 border-red-500/90 p-6 shadow-[0_0_80px_rgba(239,68,68,0.5)] flex flex-col gap-5">
        {/* Header Alert Ribbon */}
        <div className="flex items-center justify-between border-b border-red-500/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/50 animate-bounce">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-red-500 text-white px-2 py-0.5 rounded">
                  DEMO MODE CRITICAL
                </span>
                <span className="text-xs font-mono text-red-300">
                  Elapsed: {emergencyTimer}s
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-0.5">
                FALL EVENT DETECTED
              </h2>
            </div>
          </div>

          {/* Buzzer Mute Toggle */}
          <button
            onClick={toggleBuzzer}
            className={`p-2.5 rounded-xl border transition flex items-center gap-1.5 text-xs font-mono font-bold ${
              isBuzzerActive
                ? 'bg-red-600/40 text-red-200 border-red-400'
                : 'bg-slate-900/80 text-slate-400 border-slate-700'
            }`}
          >
            {isBuzzerActive ? <Volume2 className="w-4 h-4 text-red-300" /> : <VolumeX className="w-4 h-4" />}
            <span>{isBuzzerActive ? 'Buzzer Mute' : 'Muted'}</span>
          </button>
        </div>

        {/* Resident & Sensor Impact Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Patient Card */}
          <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 flex items-center gap-3">
            <img
              src={selectedPatient.avatar}
              alt={selectedPatient.name}
              className="w-12 h-12 rounded-xl object-cover border-2 border-red-400"
            />
            <div>
              <div className="text-sm font-bold text-white">{selectedPatient.name} ({selectedPatient.age}y)</div>
              <div className="text-xs text-red-200 font-mono">Location: Living Room</div>
              <div className="text-[11px] text-red-300">Emergency: {selectedPatient.emergencyContact.phone}</div>
            </div>
          </div>

          {/* Sensor Evidence */}
          <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 flex flex-col justify-between">
            <div className="text-[11px] font-mono text-red-300 uppercase">IMU Impact Evidence</div>
            <div className="grid grid-cols-3 gap-2 mt-1 text-center font-mono">
              <div className="p-1.5 rounded-lg bg-red-900/60 border border-red-700/50">
                <div className="text-[10px] text-red-300">Peak Acc</div>
                <div className="text-sm font-bold text-white">3.82 G</div>
              </div>
              <div className="p-1.5 rounded-lg bg-red-900/60 border border-red-700/50">
                <div className="text-[10px] text-red-300">Gyro</div>
                <div className="text-sm font-bold text-white">310°/s</div>
              </div>
              <div className="p-1.5 rounded-lg bg-red-900/60 border border-red-700/50">
                <div className="text-[10px] text-red-300">Confidence</div>
                <div className="text-sm font-bold text-white">96%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Escalation Pipeline Progress */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-red-500/30">
          <div className="text-xs font-mono text-red-300 uppercase tracking-wider mb-2.5 flex items-center justify-between">
            <span>Automated Escalation Pipeline</span>
            <span className="text-[11px] text-slate-400">Escalates every 15s</span>
          </div>

          <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono">
            {/* Stage 1 */}
            <div className={`p-2 rounded-xl border flex flex-col items-center gap-1 ${
              stageBuzzer ? 'bg-red-500/20 border-red-400 text-red-200' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
              <span className="font-bold">1. Buzzer</span>
              <span className="text-[10px]">Active</span>
            </div>

            {/* Stage 2 */}
            <div className={`p-2 rounded-xl border flex flex-col items-center gap-1 ${
              stagePush ? 'bg-red-500/20 border-red-400 text-red-200' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              <div className={`w-2 h-2 rounded-full ${stagePush ? 'bg-red-400' : 'bg-slate-700'}`}></div>
              <span className="font-bold">2. Push App</span>
              <span className="text-[10px]">{stagePush ? 'Delivered' : 'Queued (5s)'}</span>
            </div>

            {/* Stage 3 */}
            <div className={`p-2 rounded-xl border flex flex-col items-center gap-1 ${
              stageSMS ? 'bg-red-500/20 border-red-400 text-red-200' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              <div className={`w-2 h-2 rounded-full ${stageSMS ? 'bg-red-400' : 'bg-slate-700'}`}></div>
              <span className="font-bold">3. SMS Family</span>
              <span className="text-[10px]">{stageSMS ? 'Dispatched' : 'Queued (15s)'}</span>
            </div>

            {/* Stage 4 */}
            <div className={`p-2 rounded-xl border flex flex-col items-center gap-1 ${
              stageCall ? 'bg-red-500/20 border-red-400 text-red-200' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              <div className={`w-2 h-2 rounded-full ${stageCall ? 'bg-red-400 animate-pulse' : 'bg-slate-700'}`}></div>
              <span className="font-bold">4. Voice Call</span>
              <span className="text-[10px]">{stageCall ? 'Dialing' : 'Queued (30s)'}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={cancelEmergency}
            className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/40 transition active:scale-98"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>I am with Resident • Mark Safe & Resolved</span>
          </button>

          <button
            onClick={cancelEmergency}
            className="w-full sm:w-auto py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono font-semibold transition"
          >
            False Alarm / Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};
