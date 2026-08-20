import React, { useState, useEffect } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Wristband3D } from '../components/3d/Wristband3D';
import { RealtimeOscilloscope } from '../components/charts/RealtimeOscilloscope';
import { 
  Activity, 
  Radio, 
  BatteryCharging, 
  Wifi, 
  Flame, 
  Zap, 
  Clock, 
  Footprints, 
  Heart, 
  Volume2, 
  VolumeX, 
  AlertTriangle,
  RotateCcw,
  ShieldCheck
} from 'lucide-react';

export const LiveMonitoringPage: React.FC = () => {
  const { 
    telemetry, 
    isEmergencyActive, 
    simulateFallEvent, 
    cancelEmergency, 
    isBuzzerActive, 
    toggleBuzzer,
    emergencyTimer
  } = useDashboard();

  // Live real-time event logs stream
  const [liveLogs, setLiveLogs] = useState<{ id: string; time: string; text: string; state: string }[]>([
    { id: '1', time: '10:48:12', text: '50Hz IMU stream active • Low noise', state: 'normal' },
    { id: '2', time: '10:48:18', text: 'Gait cadence stable at 84 steps/min', state: 'normal' },
    { id: '3', time: '10:48:22', text: 'Activity intensity moderate (38%)', state: 'normal' },
    { id: '4', time: '10:48:30', text: 'Resting pulse verified at 74 bpm', state: 'normal' },
  ]);

  // Append new log item periodically
  useEffect(() => {
    const logInterval = setInterval(() => {
      const now = new Date();
      const timeStr = now.toTimeString().split(' ')[0];

      if (isEmergencyActive) {
        setLiveLogs(prev => [
          {
            id: String(Date.now()),
            time: timeStr,
            text: `CRITICAL: Deceleration spike of ${telemetry.accX}g detected • Buzzer sounding`,
            state: 'critical'
          },
          ...prev.slice(0, 7)
        ]);
      } else {
        const samplePhrases = [
          `Normal gait detected (${telemetry.intensity}% intensity)`,
          `BLE 5.2 beacon packet verified (-58 dBm RSSI)`,
          `Sit-to-stand posture filter verified normal`,
          `Continuous 6-axis sampling running at 50Hz`,
          `Heart rate steady at ${telemetry.heartRate} bpm`
        ];
        const randomPhrase = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];
        setLiveLogs(prev => [
          {
            id: String(Date.now()),
            time: timeStr,
            text: randomPhrase,
            state: 'normal'
          },
          ...prev.slice(0, 7)
        ]);
      }
    }, 3000);

    return () => clearInterval(logInterval);
  }, [isEmergencyActive, telemetry]);

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight">
              LIVE SENSOR MONITORING
            </h1>
            <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-mono text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              🟢 SYSTEM ONLINE • 50HZ STREAM
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Direct telemetry pipe from ESP32-S3 wristband with MPU6050 6-Axis IMU
          </p>
        </div>

        {/* Demo Simulation Action Button */}
        <div className="flex items-center gap-2.5">
          {!isEmergencyActive ? (
            <button
              onClick={simulateFallEvent}
              className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold shadow-lg shadow-red-600/30 flex items-center gap-2 transition active:scale-95"
            >
              <Flame className="w-4 h-4 text-white animate-pulse" />
              <span>Simulate Fall Event (Demo Mode)</span>
            </button>
          ) : (
            <button
              onClick={cancelEmergency}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Acknowledge & Clear Fall Alert</span>
            </button>
          )}
        </div>
      </div>

      {/* Emergency Active Warning Banner */}
      {isEmergencyActive && (
        <div className="p-4 rounded-2xl glass-panel-danger border border-red-500/80 flex items-center justify-between gap-4 animate-pulse">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-red-600 text-white">
              <AlertTriangle className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="text-xs font-mono text-red-300 font-bold">EMERGENCY STATE ACTIVE • DEMO SIMULATION</div>
              <div className="text-sm font-bold text-white">
                Fall Impact (3.82g) • Buzzer Active ({emergencyTimer}s elapsed)
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleBuzzer}
              className="px-3 py-1.5 rounded-lg bg-red-900/60 border border-red-500/50 text-xs font-mono text-white flex items-center gap-1.5"
            >
              {isBuzzerActive ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              {isBuzzerActive ? 'Mute Tone' : 'Unmute'}
            </button>
            <button
              onClick={cancelEmergency}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-mono text-white font-bold"
            >
              Resolve
            </button>
          </div>
        </div>
      )}

      {/* Real-time Oscilloscope Waveforms */}
      <RealtimeOscilloscope />

      {/* 3D Smart Wristband Model & Live Hardware Specs */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5" />
            3D Smart Wristband Visualizer (ESP32-S3 + MPU6050)
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            BLE 5.2 • 87% Battery • Live Curved OLED HUD
          </span>
        </div>
        <Wristband3D />
      </div>

      {/* Real-Time Activity Indicator & Event Stream Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Real-Time Activity Status */}
        <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-400 uppercase">Live Gait State</span>
              <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                isEmergencyActive ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'
              }`}>
                {isEmergencyActive ? 'IMPACT DETECTED' : 'NORMAL'}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400">
                <Footprints className="w-8 h-8" />
              </div>
              <div>
                <div className="text-xl font-extrabold text-white tracking-tight font-mono">
                  {isEmergencyActive ? 'FALL INCLINE' : 'WALKING'}
                </div>
                <div className="text-xs text-slate-400 font-mono">
                  Current Cadence: <strong className="text-cyan-300">84 steps/min</strong>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-800 text-xs font-mono">
            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-850">
              <span className="text-slate-400 text-[10px]">Movement Intensity</span>
              <div className="text-sm font-bold text-cyan-300 mt-0.5">{telemetry.intensity}% (NORMAL)</div>
            </div>

            <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-850">
              <span className="text-slate-400 text-[10px]">Heart Rate</span>
              <div className="text-sm font-bold text-rose-400 mt-0.5 flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" /> {telemetry.heartRate} bpm
              </div>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Real-Time Event Stream Log */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-panel border border-cyan-500/20 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Real-Time MQTT Telemetry Stream (Live Packets)
              </h3>
            </div>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
              Topic: sentinel/telemetry/wristband
            </span>
          </div>

          {/* Scrolling Stream Items */}
          <div className="space-y-2 max-h-[190px] overflow-y-auto pr-1 font-mono text-xs">
            {liveLogs.map((log) => (
              <div
                key={log.id}
                className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 ${
                  log.state === 'critical'
                    ? 'bg-red-950/50 border-red-500/50 text-red-200'
                    : 'bg-slate-900/60 border-slate-800 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${
                    log.state === 'critical' ? 'bg-red-500 animate-ping' : 'bg-cyan-400'
                  }`} />
                  <span className="leading-snug">{log.text}</span>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0">{log.time}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span>Buffer: 25 frames • Sampling rate: 50Hz</span>
            <span className="text-emerald-400">● 0 Dropped Packets</span>
          </div>
        </div>
      </div>
    </div>
  );
};
