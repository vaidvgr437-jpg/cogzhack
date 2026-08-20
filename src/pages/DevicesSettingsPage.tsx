import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { NetworkTopology3D } from '../components/3d/NetworkTopology3D';
import { 
  Cpu, 
  Wifi, 
  BatteryCharging, 
  Radio, 
  RefreshCw, 
  Sliders, 
  Phone, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  Layers,
  Flame,
  Zap,
  Activity,
  WifiOff
} from 'lucide-react';
import { DemoScenario } from '../types';

export const DevicesSettingsPage: React.FC = () => {
  const { 
    devices, 
    runDeviceDiagnostics, 
    selectedPatient, 
    activeScenario, 
    setScenario, 
    simulateFallEvent 
  } = useDashboard();

  const [fallSensitivity, setFallSensitivity] = useState<'low' | 'medium' | 'high'>('medium');
  const [pushEnabled, setPushEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(true);
  const [voiceCallEnabled, setVoiceCallEnabled] = useState(true);

  const scenarios: { id: DemoScenario; title: string; desc: string; icon: any; color: string }[] = [
    {
      id: 'normal',
      title: 'Normal Day',
      desc: 'All sensors online, 94% adherence, normal cadence (84 spm).',
      icon: CheckCircle2,
      color: 'text-emerald-400 border-emerald-500/40 bg-emerald-950/20'
    },
    {
      id: 'mobility_decline',
      title: 'Mobility Decline',
      desc: 'Gait variability rises to 18.6%, cadence drops to 62 spm.',
      icon: Activity,
      color: 'text-amber-400 border-amber-500/40 bg-amber-950/20'
    },
    {
      id: 'fall_detection',
      title: 'Fall Detection Trigger',
      desc: '3.82g deceleration spike, active buzzer, automatic 4-stage escalation.',
      icon: Flame,
      color: 'text-red-400 border-red-500/40 bg-red-950/20'
    },
    {
      id: 'missed_medication',
      title: 'Missed Medication',
      desc: 'Afternoon dosage untouched after 45-min grace period.',
      icon: AlertTriangle,
      color: 'text-amber-300 border-amber-500/40 bg-amber-950/20'
    },
    {
      id: 'device_offline',
      title: 'Device Offline Test',
      desc: 'Medicine Dispenser Wi-Fi disconnected; hub triggers ping recovery.',
      icon: WifiOff,
      color: 'text-slate-400 border-slate-700 bg-slate-900/40'
    }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Cpu className="w-5 h-5 text-cyan-400" />
              HARDWARE TOPOLOGY & SYSTEM CONFIGURATION
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            BLE 5.2 / MQTT mesh network diagnostics, edge thresholds, and demo scenario controller
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 animate-pulse" />
            MQTT Broker: 192.168.1.100 (Online)
          </span>
        </div>
      </div>

      {/* 3D Network Mesh Visualizer */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            3D IoT Hardware Topology (Home Mesh)
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Interactive Node Map • Click on nodes to run remote diagnostics
          </span>
        </div>
        <NetworkTopology3D />
      </div>

      {/* Connected IoT Hardware Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {devices.map((device) => {
          const isOnline = device.status === 'online';

          return (
            <div
              key={device.id}
              className={`p-5 rounded-2xl glass-card border flex flex-col justify-between transition ${
                isOnline ? 'border-cyan-500/20' : 'border-red-500/40 bg-red-950/20'
              }`}
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400">
                      <Cpu className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-white leading-snug">{device.name}</h4>
                      <span className="text-[10px] font-mono text-slate-400">{device.type}</span>
                    </div>
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                    isOnline ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
                  }`}>
                    {device.status}
                  </span>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-2 mt-4 text-xs font-mono">
                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-850">
                    <span className="text-slate-400 text-[10px] flex items-center gap-1">
                      <Wifi className="w-3 h-3 text-cyan-400" /> RSSI / Conn
                    </span>
                    <span className="text-white font-bold block mt-0.5">{device.rssi} dBm ({device.connection})</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-850">
                    <span className="text-slate-400 text-[10px] flex items-center gap-1">
                      <BatteryCharging className="w-3 h-3 text-emerald-400" /> Battery
                    </span>
                    <span className="text-emerald-300 font-bold block mt-0.5">
                      {device.batteryLevel ? `${device.batteryLevel}%` : 'AC Line Powered'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-850 col-span-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Firmware:</span>
                      <span className="text-cyan-300">{device.firmware}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px] mt-1">
                      <span className="text-slate-400">Heartbeat:</span>
                      <span className="text-slate-300">{device.lastHeartbeat}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action */}
              <button
                onClick={() => runDeviceDiagnostics(device.id)}
                className="mt-4 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center gap-2 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Run Hardware Diagnostics
              </button>
            </div>
          );
        })}
      </div>

      {/* Demo Scenario Controller (Comprehensive presentation tool) */}
      <div className="p-5 rounded-2xl glass-panel-glow border border-cyan-500/30">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
            <div>
              <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
                Interactive Demo Scenario Injector
              </h3>
              <p className="text-xs text-slate-400">
                Switch real-time system simulation state for investor and stakeholder walkthroughs
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            Current: {activeScenario.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {scenarios.map((sc) => {
            const Icon = sc.icon;
            const isSel = activeScenario === sc.id;

            return (
              <div
                key={sc.id}
                onClick={() => setScenario(sc.id)}
                className={`p-4 rounded-xl border cursor-pointer flex flex-col justify-between gap-2 transition ${
                  isSel
                    ? 'border-cyan-400 bg-cyan-950/40 shadow-lg shadow-cyan-500/20'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <Icon className="w-5 h-5 text-cyan-400" />
                    {isSel && <span className="text-[10px] font-mono font-bold text-cyan-300">ACTIVE</span>}
                  </div>
                  <h5 className="text-xs font-bold text-white mt-2">{sc.title}</h5>
                  <p className="text-[11px] text-slate-400 mt-1 leading-snug">{sc.desc}</p>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setScenario(sc.id);
                  }}
                  className={`mt-2 w-full py-1.5 rounded-lg text-[11px] font-mono font-bold ${
                    isSel ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {isSel ? 'Running Scenario' : 'Trigger Scenario'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Alert Escalation & Emergency Contact Configuration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Edge Fall Detection Sensitivity */}
        <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20 space-y-4">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Edge Sensor Algorithm Tuning
            </h3>
          </div>

          <div className="space-y-3 text-xs font-mono">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-400">Fall Detection Sensitivity:</span>
                <span className="text-cyan-300 font-bold uppercase">{fallSensitivity} (3.4g Threshold)</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {(['low', 'medium', 'high'] as const).map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setFallSensitivity(lvl)}
                    className={`py-2 rounded-xl text-center capitalize transition ${
                      fallSensitivity === lvl
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/50'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="text-slate-400 text-[11px]">Active Notification Channels:</div>
              <div className="space-y-1.5">
                <label className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 cursor-pointer">
                  <span>Caregiver App Push Notifications</span>
                  <input
                    type="checkbox"
                    checked={pushEnabled}
                    onChange={(e) => setPushEnabled(e.target.checked)}
                    className="accent-cyan-400 w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 cursor-pointer">
                  <span>Emergency Family SMS Alerts</span>
                  <input
                    type="checkbox"
                    checked={smsEnabled}
                    onChange={(e) => setSmsEnabled(e.target.checked)}
                    className="accent-cyan-400 w-4 h-4"
                  />
                </label>

                <label className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 cursor-pointer">
                  <span>Automated Voice Escalation (45s+)</span>
                  <input
                    type="checkbox"
                    checked={voiceCallEnabled}
                    onChange={(e) => setVoiceCallEnabled(e.target.checked)}
                    className="accent-cyan-400 w-4 h-4"
                  />
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Emergency Contact Card */}
        <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20 space-y-4">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-400" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Emergency Contact Routing
            </h3>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-lg font-mono">
              AR
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-white">{selectedPatient.emergencyContact.name}</h4>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Primary ({selectedPatient.emergencyContact.relation})
                </span>
              </div>
              <div className="text-xs font-mono text-cyan-300 mt-1">
                {selectedPatient.emergencyContact.phone}
              </div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono text-slate-300 leading-relaxed">
            <div className="text-slate-400 text-[10px] uppercase mb-1">Escalation Routing Rule:</div>
            If buzzer is not cancelled within 30 seconds, SMS and automated voice messages are routed directly to <strong className="text-white">Ananya Rao</strong> and secondary caregiver Rahul.
          </div>
        </div>
      </div>
    </div>
  );
};
