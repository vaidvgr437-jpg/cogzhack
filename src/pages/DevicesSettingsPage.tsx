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
  WifiOff,
  Trash2,
  Plus,
  Users,
  UserMinus,
  PhoneCall,
  MessageSquare,
  Bell,
  Clock,
  Settings,
  Send
} from 'lucide-react';
import { DemoScenario } from '../types';

export const DevicesSettingsPage: React.FC = () => {
  const { 
    devices, 
    selectedPatient, 
    setSelectedPatient,
    patientsList,
    openDeletePatientModal,
    navigateTo,
    addToast,
    activeScenario, 
    setScenario, 
    simulateFallEvent,
    dispatchConfig,
    updateDispatchConfig,
    setIsDispatchSettingsOpen,
    triggerTestSms,
    dispatchedSmsList
  } = useDashboard();

  const [mobileInput, setMobileInput] = useState(dispatchConfig.mobileNumber);
  const [contactNameInput, setContactNameInput] = useState(dispatchConfig.contactName);
  const [relationInput, setRelationInput] = useState(dispatchConfig.relation);

  const runDeviceDiagnostics = (deviceId: string) => {
    addToast('Diagnostic Signal Sent', `Pinged device ${deviceId}. Packet loss 0%, RF link verified.`, 'success');
  };

  const handleSaveMobileSettings = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileInput.trim()) {
      addToast('Invalid Phone Number', 'Please enter a valid emergency contact number.', 'error');
      return;
    }
    updateDispatchConfig({
      mobileNumber: mobileInput.trim(),
      contactName: contactNameInput.trim() || 'Primary Caregiver',
      relation: relationInput.trim() || 'Family / Physician'
    });
    addToast(
      'Emergency Mobile Number Saved',
      `Registered ${mobileInput.trim()} for automated fall event alerts (Push, SMS, Voice Call).`,
      'success'
    );
  };

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
      id: 'device_offline',
      title: 'Device Offline Test',
      desc: 'Smart Wristband BLE link dropped; hub triggers ping recovery.',
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
              <div className="text-slate-400 text-[11px]">Active Fall Mode Escalation Stages:</div>
              <div className="space-y-2 text-[11px]">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Bell className="w-3.5 h-3.5 text-cyan-400" />
                    Push Notification
                  </span>
                  <span className="font-bold text-cyan-300">
                    {dispatchConfig.pushEnabled ? `${dispatchConfig.pushDelaySeconds}s delay` : 'Disabled'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                    Emergency SMS
                  </span>
                  <span className="font-bold text-emerald-300">
                    {dispatchConfig.smsEnabled ? `${dispatchConfig.smsDelaySeconds}s delay` : 'Disabled'}
                  </span>
                </div>

                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <PhoneCall className="w-3.5 h-3.5 text-red-400" />
                    Voice Call Dispatch
                  </span>
                  <span className="font-bold text-red-300">
                    {dispatchConfig.callEnabled ? `${dispatchConfig.callDelaySeconds}s delay` : 'Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Emergency Mobile Registration & Escalation Pipeline */}
        <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                  Emergency Mobile Registration & Escalation
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setIsDispatchSettingsOpen(true)}
                className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 underline underline-offset-2"
              >
                <Settings className="w-3 h-3" />
                <span>Adjust Timings</span>
              </button>
            </div>

            {/* Mobile Registration Form */}
            <form onSubmit={handleSaveMobileSettings} className="mt-3 space-y-3">
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">
                  Registered Emergency Mobile Number:
                </label>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    value={mobileInput}
                    onChange={(e) => setMobileInput(e.target.value)}
                    placeholder="+1 (555) 911-0422"
                    className="flex-1 px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-cyan-400 text-white font-mono text-xs outline-none transition"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-xs transition"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-0.5">Contact Name:</label>
                  <input
                    type="text"
                    value={contactNameInput}
                    onChange={(e) => setContactNameInput(e.target.value)}
                    placeholder="Caregiver Name"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-white font-mono text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-0.5">Relationship:</label>
                  <input
                    type="text"
                    value={relationInput}
                    onChange={(e) => setRelationInput(e.target.value)}
                    placeholder="e.g., Family / Doctor"
                    className="w-full px-2.5 py-1.5 rounded-lg bg-slate-950/80 border border-slate-800 text-white font-mono text-xs outline-none"
                  />
                </div>
              </div>
            </form>
          </div>

          {/* Action & Simulation Controls */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <div className="text-slate-400 text-[10px] font-mono uppercase">
              Pipeline Verification Tools:
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={triggerTestSms}
                className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-cyan-300 font-mono text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Send className="w-3.5 h-3.5 text-cyan-400" />
                <span>Test Direct SMS</span>
              </button>

              <button
                type="button"
                onClick={simulateFallEvent}
                className="py-2 px-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-600/30 transition active:scale-95"
              >
                <Flame className="w-3.5 h-3.5" />
                <span>Test Fall Event Mode</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enrolled Residents & Patient Profile Management */}
      <div className="p-5 sm:p-6 rounded-2xl glass-panel border border-cyan-500/20 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                Enrolled Residents & Active Profiles
                <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {patientsList.length} Active
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Manage assigned elderly residents, switch active telemonitoring view, or unbind profiles
              </p>
            </div>
          </div>

          <button
            id="settings-add-patient-btn"
            type="button"
            onClick={() => navigateTo('/patient/setup')}
            className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center gap-2 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Enroll New Resident</span>
          </button>
        </div>

        {/* Residents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {patientsList.map((patient) => {
            const isSelected = selectedPatient.id === patient.id;

            return (
              <div
                key={patient.id}
                className={`p-4 rounded-2xl border transition flex flex-col justify-between gap-4 ${
                  isSelected
                    ? 'border-cyan-400 bg-cyan-950/30 shadow-lg shadow-cyan-500/10'
                    : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={patient.avatar}
                        alt={patient.name}
                        className="w-12 h-12 rounded-xl object-cover border border-cyan-500/30 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-white truncate">{patient.name}</h4>
                          <span className="text-xs font-mono text-slate-400 shrink-0">({patient.age}y)</span>
                        </div>
                        <p className="text-xs font-mono text-cyan-400 truncate">{patient.room}</p>
                      </div>
                    </div>

                    {isSelected ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shrink-0">
                        ACTIVE
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedPatient(patient)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-mono text-slate-400 hover:text-cyan-300 bg-slate-800 hover:bg-slate-700 transition shrink-0"
                      >
                        Select
                      </button>
                    )}
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1 text-xs font-mono text-slate-400">
                    <div className="flex justify-between items-center text-[11px]">
                      <span>Doctor:</span>
                      <span className="text-slate-300 truncate max-w-[160px]">{patient.primaryDoctor}</span>
                    </div>
                    <div className="flex justify-between items-center text-[11px]">
                      <span>Emergency:</span>
                      <span className="text-slate-300 truncate max-w-[160px]">
                        {patient.emergencyContact.name} ({patient.emergencyContact.phone})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center gap-2 pt-2">
                  {!isSelected && (
                    <button
                      type="button"
                      onClick={() => setSelectedPatient(patient)}
                      className="flex-1 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold transition text-center"
                    >
                      Set Active
                    </button>
                  )}
                  
                  <button
                    type="button"
                    title={`Remove ${patient.name}`}
                    onClick={() => openDeletePatientModal(patient)}
                    className={`py-1.5 px-3 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/20 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition ${
                      isSelected ? 'w-full' : ''
                    }`}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove Resident</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
