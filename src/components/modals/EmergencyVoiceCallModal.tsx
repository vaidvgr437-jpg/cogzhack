import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import {
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  Volume2,
  ShieldCheck,
  Ambulance,
  Radio,
  Clock,
  User,
  MapPin,
  Flame,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const EmergencyVoiceCallModal: React.FC = () => {
  const {
    activeCallState,
    answerVoiceCall,
    endVoiceCall,
    toggleCallMute,
    cancelEmergency,
    addToast
  } = useDashboard();

  if (activeCallState.status === 'idle') return null;

  const formatDuration = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handleResolveAndEnd = () => {
    cancelEmergency();
    endVoiceCall();
    addToast('Emergency Resolved via Voice Call', 'Caregiver confirmed patient safety. Alert closed.', 'success');
  };

  const handleDispatchAmbulance = () => {
    addToast(
      '🚑 EMS 911 AMBULANCE DISPATCHED',
      `Emergency medical units requested for ${activeCallState.residentName} at ${activeCallState.location}. Priority Level 1.`,
      'error'
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-red-500/40 rounded-3xl shadow-2xl overflow-hidden text-center p-6 space-y-6">
        {/* Subtle Ambient Red Glow */}
        <div className="absolute -top-20 -left-20 w-48 h-48 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Priority Status Badge */}
        <div className="flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/30 animate-pulse">
            <Radio className="w-3.5 h-3.5 text-red-400" />
            AUTOMATED EMERGENCY VOICE LINE • STAGE 4
          </span>
        </div>

        {/* Call Status & Caller Avatar */}
        <div className="space-y-3">
          <div className="relative mx-auto w-24 h-24 rounded-full flex items-center justify-center">
            {/* Animated rings for calling status */}
            {activeCallState.status === 'calling' && (
              <>
                <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                <div className="absolute -inset-2 rounded-full border border-red-500/30 animate-pulse" />
              </>
            )}
            {activeCallState.status === 'connected' && (
              <div className="absolute -inset-2 rounded-full border border-emerald-500/40 animate-pulse" />
            )}
            
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white shadow-xl ${
              activeCallState.status === 'calling'
                ? 'bg-gradient-to-tr from-red-600 to-amber-600 text-white'
                : activeCallState.status === 'connected'
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-600 text-white'
                : 'bg-slate-800 text-slate-400'
            }`}>
              <PhoneCall className={`w-9 h-9 ${activeCallState.status === 'calling' ? 'animate-bounce' : ''}`} />
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-white tracking-wide">
              {activeCallState.recipientName || 'Emergency Caregiver'}
            </h3>
            <p className="text-sm font-mono text-cyan-300 mt-0.5">
              {activeCallState.recipientNumber}
            </p>
            <p className="text-xs font-mono text-slate-400 mt-1">
              {activeCallState.status === 'calling' && 'Dialing Registered Emergency Mobile...'}
              {activeCallState.status === 'connected' && (
                <span className="text-emerald-400 font-bold flex items-center justify-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Call Connected • {formatDuration(activeCallState.durationSeconds)}
                </span>
              )}
              {activeCallState.status === 'ended' && 'Call Disconnected'}
            </p>
          </div>
        </div>

        {/* Telemetry Evidence Brief */}
        <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 text-left space-y-2 text-xs font-mono">
          <div className="flex items-center justify-between text-[11px] text-slate-400">
            <span className="flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-cyan-400" />
              Resident: <strong className="text-white ml-1">{activeCallState.residentName}</strong>
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              {activeCallState.location}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-800/80">
            <span className="text-slate-400 flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-red-400" />
              Impact Force: <strong className="text-red-400 ml-1">3.82 G</strong>
            </span>
            <span className="text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              Alarm: Sounding
            </span>
          </div>
        </div>

        {/* Real-time Voice Dispatch Transcript */}
        <div className="p-3.5 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 text-left space-y-1">
          <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-between">
            <span>AI Voice Broadcast Transcript</span>
            <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans italic">
            "{activeCallState.speechTranscript}"
          </p>
        </div>

        {/* Interactive Controls */}
        <div className="space-y-3 pt-2">
          {activeCallState.status === 'calling' && (
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={endVoiceCall}
                className="flex-1 py-3 px-4 rounded-2xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-mono font-bold flex items-center justify-center gap-2 transition"
              >
                <PhoneOff className="w-4 h-4 text-red-400" />
                <span>Cancel Call</span>
              </button>

              <button
                type="button"
                onClick={answerVoiceCall}
                className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition animate-pulse"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Answer / Connect</span>
              </button>
            </div>
          )}

          {activeCallState.status === 'connected' && (
            <div className="space-y-3">
              {/* Mic / Audio controls */}
              <div className="flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={toggleCallMute}
                  className={`p-3 rounded-2xl border transition flex items-center justify-center gap-2 text-xs font-mono ${
                    activeCallState.isMuted
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                  }`}
                  title={activeCallState.isMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {activeCallState.isMuted ? <MicOff className="w-4 h-4 text-amber-400" /> : <Mic className="w-4 h-4 text-cyan-400" />}
                  <span>{activeCallState.isMuted ? 'Muted' : 'Mic Active'}</span>
                </button>

                {/* Direct carrier dial link */}
                <a
                  href={`tel:${activeCallState.recipientNumber.replace(/[^0-9+]/g, '')}`}
                  className="p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 transition flex items-center justify-center gap-2 text-xs font-mono"
                  title="Direct phone dialer"
                >
                  <PhoneCall className="w-4 h-4 text-cyan-400" />
                  <span>Carrier Dial</span>
                </a>

                {/* Hang Up Button */}
                <button
                  type="button"
                  onClick={endVoiceCall}
                  className="p-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white transition flex items-center justify-center gap-2 text-xs font-mono font-bold"
                  title="Hang up call"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>Hang Up</span>
                </button>
              </div>

              {/* Emergency Resolution Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={handleResolveAndEnd}
                  className="py-2.5 px-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Verify Safe & End Alert</span>
                </button>

                <button
                  type="button"
                  onClick={handleDispatchAmbulance}
                  className="py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition shadow-md shadow-red-600/30"
                >
                  <Ambulance className="w-4 h-4" />
                  <span>Dispatch 911 Ambulance</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
