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
  UserCheck,
  Settings,
  MessageSquare
} from 'lucide-react';

export const EmergencyModal: React.FC = () => {
  const { 
    isEmergencyActive, 
    emergencyTimer, 
    cancelEmergency, 
    isBuzzerActive, 
    toggleBuzzer,
    selectedPatient,
    telemetry,
    dispatchConfig,
    setIsDispatchSettingsOpen,
    dispatchedSmsList,
    activeCallState
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

  // Escalation stages based on emergencyTimer vs dynamic dispatchConfig
  const stageBuzzer = isBuzzerActive;
  const stagePush = emergencyTimer >= dispatchConfig.pushDelaySeconds;
  const stageSMS = emergencyTimer >= dispatchConfig.smsDelaySeconds;
  const stageCall = emergencyTimer >= dispatchConfig.callDelaySeconds;

  const latestDispatchedSms = dispatchedSmsList.length > 0 ? dispatchedSmsList[0] : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-red-950/80 backdrop-blur-xl animate-fadeIn overflow-y-auto">
      {/* Red Glowing Alert Card */}
      <div className="relative w-full max-w-2xl rounded-3xl glass-panel-danger border-2 border-red-500/90 p-5 sm:p-6 shadow-[0_0_80px_rgba(239,68,68,0.5)] flex flex-col gap-4 sm:gap-5 my-auto">
        {/* Header Alert Ribbon */}
        <div className="flex items-center justify-between border-b border-red-500/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/50 animate-bounce">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-red-500 text-white px-2 py-0.5 rounded">
                  FALL EVENT MODE ACTIVE
                </span>
                <span className="text-xs font-mono text-red-300 font-bold">
                  Elapsed: {emergencyTimer}s
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-0.5">
                FALL EVENT DETECTED
              </h2>
            </div>
          </div>

          {/* Buzzer Mute & Dispatch Settings */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDispatchSettingsOpen(true)}
              className="p-2.5 rounded-xl border border-red-500/40 bg-red-950/40 hover:bg-red-900/60 text-red-200 transition flex items-center gap-1.5 text-xs font-mono"
              title="Configure registered mobile & escalation timing"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </button>

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
        </div>

        {/* Registered Mobile Target Banner */}
        <div className="p-3 rounded-2xl bg-slate-950/70 border border-red-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold">
              <PhoneCall className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-slate-400 uppercase">Registered Mobile Escalation Target</div>
              <div className="text-xs sm:text-sm font-bold font-mono text-cyan-300 flex items-center gap-2">
                <span>{dispatchConfig.mobileNumber}</span>
                <span className="text-[10px] font-normal text-slate-300 font-sans">({dispatchConfig.contactName} • {dispatchConfig.relation})</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsDispatchSettingsOpen(true)}
            className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold self-start sm:self-center transition"
          >
            Edit Mobile / Timers
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
              <div className="text-xs text-red-200 font-mono">Location: {selectedPatient.room || 'Living Room'}</div>
              <div className="text-[11px] text-red-300">Room Status: Distress Alarm Active</div>
            </div>
          </div>

          {/* Sensor Evidence */}
          <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/30 flex flex-col justify-between">
            <div className="text-[11px] font-mono text-red-300 uppercase">Edge IMU Fall Deceleration</div>
            <div className="grid grid-cols-3 gap-2 mt-1 text-center font-mono">
              <div className="p-1.5 rounded-lg bg-red-900/60 border border-red-700/50">
                <div className="text-[10px] text-red-300">Peak Acc</div>
                <div className="text-sm font-bold text-white">3.82 G</div>
              </div>
              <div className="p-1.5 rounded-lg bg-red-900/60 border border-red-700/50">
                <div className="text-[10px] text-red-300">Gyro Rate</div>
                <div className="text-sm font-bold text-white">310°/s</div>
              </div>
              <div className="p-1.5 rounded-lg bg-red-900/60 border border-red-700/50">
                <div className="text-[10px] text-red-300">Confidence</div>
                <div className="text-sm font-bold text-white">96%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Escalation Pipeline Progress */}
        <div className="p-4 rounded-2xl bg-slate-950/70 border border-red-500/30 space-y-2.5">
          <div className="text-xs font-mono text-red-300 uppercase tracking-wider flex items-center justify-between">
            <span>Automated Escalation Pipeline (Fall Event Mode)</span>
            <span className="text-[11px] text-cyan-300 font-bold">
              Target: {dispatchConfig.mobileNumber}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono">
            {/* Stage 1: Buzzer */}
            <div className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition ${
              stageBuzzer ? 'bg-red-500/20 border-red-400 text-red-200' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}>
              <div className="w-2 h-2 rounded-full bg-red-500 animate-ping"></div>
              <span className="font-bold">1. Buzzer Alarm</span>
              <span className="text-[10px]">{isBuzzerActive ? 'Sounding' : 'Muted'}</span>
            </div>

            {/* Stage 2: Push App */}
            <div className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition ${
              stagePush ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${stagePush ? 'bg-emerald-400' : 'bg-slate-700'}`}></div>
              <span className="font-bold">2. Push Alert</span>
              <span className="text-[10px]">
                {stagePush ? 'Delivered ✓' : `In ${Math.max(0, dispatchConfig.pushDelaySeconds - emergencyTimer)}s`}
              </span>
            </div>

            {/* Stage 3: SMS */}
            <div className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition ${
              stageSMS ? 'bg-emerald-500/20 border-emerald-400 text-emerald-200' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${stageSMS ? 'bg-emerald-400' : 'bg-slate-700'}`}></div>
              <span className="font-bold">3. Emergency SMS</span>
              <span className="text-[10px]">
                {stageSMS ? 'Dispatched ✓' : `In ${Math.max(0, dispatchConfig.smsDelaySeconds - emergencyTimer)}s`}
              </span>
            </div>

            {/* Stage 4: Voice Call */}
            <div className={`p-2.5 rounded-xl border flex flex-col items-center gap-1 transition ${
              stageCall ? 'bg-red-500/20 border-red-400 text-red-200 shadow-md shadow-red-500/20' : 'bg-slate-900 border-slate-800 text-slate-400'
            }`}>
              <div className={`w-2 h-2 rounded-full ${stageCall ? 'bg-red-400 animate-pulse' : 'bg-slate-700'}`}></div>
              <span className="font-bold">4. Voice Call</span>
              <span className="text-[10px]">
                {stageCall ? (activeCallState.status === 'connected' ? 'Connected 🟢' : 'Dialing 📞') : `In ${Math.max(0, dispatchConfig.callDelaySeconds - emergencyTimer)}s`}
              </span>
            </div>
          </div>
        </div>

        {/* Live SMS & Call Status Feed if triggered */}
        {stageSMS && latestDispatchedSms && (
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-emerald-500/30 text-xs font-mono space-y-1.5 animate-fadeIn">
            <div className="flex items-center justify-between text-emerald-400 font-bold">
              <span className="flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5" />
                SMS Transmitted to {latestDispatchedSms.recipientNumber}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-[10px] text-emerald-300 border border-emerald-500/30">
                Carrier Delivered • {latestDispatchedSms.timestamp}
              </span>
            </div>
            <p className="text-[11px] text-slate-300 bg-slate-900/90 p-2.5 rounded-xl border border-slate-800 leading-relaxed font-sans">
              "{latestDispatchedSms.message}"
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-1">
          <button
            onClick={cancelEmergency}
            className="w-full sm:flex-1 py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/40 transition active:scale-98"
          >
            <CheckCircle2 className="w-5 h-5" />
            <span>I am with Resident • Mark Safe & Resolved</span>
          </button>

          <button
            onClick={cancelEmergency}
            className="w-full sm:w-auto py-3.5 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono font-semibold transition"
          >
            False Alarm / Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

