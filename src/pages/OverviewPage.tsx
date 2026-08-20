import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { HomeDigitalTwin3D } from '../components/3d/HomeDigitalTwin3D';
import { MobilityTrendChart } from '../components/charts/MobilityTrendChart';
import { 
  ShieldCheck, 
  Activity, 
  Pill, 
  Flame, 
  Cpu, 
  TrendingDown, 
  TrendingUp, 
  Clock, 
  ArrowUpRight, 
  Footprints, 
  HeartPulse, 
  Sparkles,
  ChevronRight,
  ShieldAlert,
  AlertTriangle
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const { 
    selectedPatient, 
    mobilityMetrics, 
    medications, 
    alerts, 
    devices, 
    recentEvents, 
    setActiveTab, 
    isEmergencyActive,
    activeScenario,
    simulateFallEvent 
  } = useDashboard();

  const verifiedMedsCount = medications.filter(m => m.status === 'verified').length;
  const totalMedsCount = medications.length;
  const fallIncidentsToday = alerts.filter(a => a.type === 'fall' && !a.isResolved).length;
  const onlineDevicesCount = devices.filter(d => d.status === 'online').length;

  const isDecline = activeScenario === 'mobility_decline';

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Top Welcome / Status Hero Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/20">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={selectedPatient.avatar}
              alt={selectedPatient.name}
              className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-400/50 shadow-lg shadow-cyan-500/20"
            />
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-slate-900"></span>
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-white tracking-tight">
                {selectedPatient.name}
              </h1>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                Age {selectedPatient.age}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                isEmergencyActive
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                  : isDecline
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {isEmergencyActive ? '● FALL ALERT' : isDecline ? '● GAIT DEVIATION' : '● STABLE / ONLINE'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1 font-mono">
              {selectedPatient.room} • Doctor: {selectedPatient.primaryDoctor}
            </p>
          </div>
        </div>

        {/* Right CTA / Quick Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('monitoring')}
            className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-mono font-semibold flex items-center gap-1.5 transition"
          >
            <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            Live Oscilloscope
          </button>

          <button
            onClick={simulateFallEvent}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-mono font-bold shadow-md shadow-red-600/30 flex items-center gap-1.5 transition active:scale-95"
          >
            <Flame className="w-3.5 h-3.5" />
            Simulate Fall (Demo)
          </button>
        </div>
      </div>

      {/* Hero 3D Digital Twin Visualization */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            Home IoT 3D Digital Twin • Real-Time Environmental Telemetry
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Interactive Model • Click any device node to open view
          </span>
        </div>
        <HomeDigitalTwin3D />
      </div>

      {/* 4 Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Mobility Risk */}
        <div
          onClick={() => setActiveTab('mobility')}
          className="glass-card p-4 rounded-2xl border border-cyan-500/20 cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Mobility Risk Score</span>
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:scale-110 transition">
              <Activity className="w-4 h-4" />
            </div>
          </div>

          <div className="my-2 flex items-baseline gap-2">
            <span className={`text-2xl font-extrabold font-mono ${
              mobilityMetrics.riskScore < 40 ? 'text-emerald-400' : mobilityMetrics.riskScore < 70 ? 'text-amber-400' : 'text-red-400'
            }`}>
              {mobilityMetrics.riskScore}
            </span>
            <span className="text-xs text-slate-400 font-mono">/ 100</span>
            <span className={`ml-auto text-xs font-bold font-mono px-2 py-0.5 rounded ${
              mobilityMetrics.riskScore < 40 ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'
            }`}>
              {mobilityMetrics.riskLevel}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span>{isDecline ? '+18.6% variability' : 'Normal gait cadence'}</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </div>
        </div>

        {/* KPI 2: Medication Adherence */}
        <div
          onClick={() => setActiveTab('medication')}
          className="glass-card p-4 rounded-2xl border border-cyan-500/20 cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Medication Adherence</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition">
              <Pill className="w-4 h-4" />
            </div>
          </div>

          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono text-emerald-400">
              {activeScenario === 'missed_medication' ? '75%' : '94%'}
            </span>
            <span className="text-xs text-slate-400 font-mono">adherence</span>
            <span className="ml-auto text-xs font-mono text-slate-300">
              {activeScenario === 'missed_medication' ? '3 / 4 verified' : '27 / 29 doses'}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span>Dual Camera + HX711 Load Cell</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </div>
        </div>

        {/* KPI 3: Fall Incidents */}
        <div
          onClick={() => setActiveTab('alerts')}
          className={`glass-card p-4 rounded-2xl border cursor-pointer flex flex-col justify-between group ${
            isEmergencyActive ? 'border-red-500/50 bg-red-950/30' : 'border-cyan-500/20'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">Fall Safety Status</span>
            <div className={`p-1.5 rounded-lg ${isEmergencyActive ? 'bg-red-500/20 text-red-400 animate-bounce' : 'bg-blue-500/10 text-blue-400'}`}>
              <ShieldAlert className="w-4 h-4" />
            </div>
          </div>

          <div className="my-2 flex items-baseline gap-2">
            <span className={`text-2xl font-extrabold font-mono ${isEmergencyActive ? 'text-red-400' : 'text-white'}`}>
              {isEmergencyActive ? '1 INCIDENT' : '0 INCIDENTS'}
            </span>
            <span className="text-xs text-slate-400 font-mono">today</span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span className={isEmergencyActive ? 'text-red-400 font-bold' : 'text-emerald-400'}>
              {isEmergencyActive ? 'Escalation sequence active' : 'MPU6050 6-Axis stable'}
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </div>
        </div>

        {/* KPI 4: Device Health */}
        <div
          onClick={() => setActiveTab('devices')}
          className="glass-card p-4 rounded-2xl border border-cyan-500/20 cursor-pointer flex flex-col justify-between group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400 uppercase">IoT Hardware Mesh</span>
            <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 group-hover:scale-110 transition">
              <Cpu className="w-4 h-4" />
            </div>
          </div>

          <div className="my-2 flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono text-cyan-300">
              {activeScenario === 'device_offline' ? '66%' : '98%'}
            </span>
            <span className="text-xs text-slate-400 font-mono">health</span>
            <span className="ml-auto text-xs font-mono text-emerald-400">
              {activeScenario === 'device_offline' ? '2/3 Connected' : '3/3 Connected'}
            </span>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800">
            <span>BLE 5.2 / Wi-Fi 6 Gateway</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
          </div>
        </div>
      </div>

      {/* Health Snapshot Section: Interactive 7-Day Chart & 5 Metric Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Mobility Trajectory Chart */}
        <div className="lg:col-span-2">
          <MobilityTrendChart />
        </div>

        {/* Right 1 Col: AI Risk Summary & Real-time Metrics Card */}
        <div className="flex flex-col gap-4">
          {/* AI Decision Support Glassmorphism Panel */}
          <div className={`p-4 rounded-2xl glass-panel border flex flex-col justify-between ${
            isEmergencyActive
              ? 'border-red-500/50 bg-red-950/40'
              : isDecline
              ? 'border-amber-500/40 bg-amber-950/30'
              : 'border-cyan-500/30 bg-slate-900/80'
          }`}>
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  AI Risk Assessment
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                  isEmergencyActive
                    ? 'bg-red-500/20 text-red-300'
                    : isDecline
                    ? 'bg-amber-500/20 text-amber-300'
                    : 'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {isEmergencyActive ? 'CRITICAL' : isDecline ? 'AMBER WARNING' : 'GREEN — STABLE'}
                </span>
              </div>

              <p className="text-xs text-slate-200 mt-2 leading-relaxed">
                {isEmergencyActive
                  ? 'Severe deceleration spike (3.82g) detected in Living Room. Immediate caregiver intervention required.'
                  : isDecline
                  ? 'Mobility decline detected over last 5 days. Step cadence slowed to 62 spm with high stride variability (18.6%).'
                  : 'Mobility remains close to personal baseline. No significant decline or gait asymmetry detected.'}
              </p>
            </div>

            <div className="mt-3 pt-3 border-t border-slate-800">
              <div className="text-[11px] font-mono text-slate-400">Next Recommended Action:</div>
              <div className="text-xs font-semibold text-white mt-0.5">
                {isEmergencyActive
                  ? 'Verify patient consciousness & check for hip/wrist impact.'
                  : isDecline
                  ? 'Schedule routine physical therapist gait review.'
                  : 'Continue standard automated 24/7 monitoring.'}
              </div>
            </div>
          </div>

          {/* Real-time Health Snapshot 4 Sub-metrics */}
          <div className="p-4 rounded-2xl glass-panel border border-slate-800 space-y-2.5 text-xs font-mono">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
              Active Gait Telemetry
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-850">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Footprints className="w-3.5 h-3.5 text-cyan-400" /> Daily Steps:
              </span>
              <span className="text-white font-bold">{mobilityMetrics.dailySteps.toLocaleString()} / {mobilityMetrics.dailyStepGoal.toLocaleString()}</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-850">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" /> Step Cadence:
              </span>
              <span className="text-emerald-400 font-bold">{mobilityMetrics.stepCadence} steps/min</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-850">
              <span className="text-slate-400 flex items-center gap-1.5">
                <TrendingDown className="w-3.5 h-3.5 text-purple-400" /> Stride Variability:
              </span>
              <span className="text-purple-300 font-bold">{mobilityMetrics.strideVariability}%</span>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-850">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Active Duration:
              </span>
              <span className="text-amber-300 font-bold">4h 12m</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Timeline */}
      <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Caregiver Event Timeline (Recent 24 Hours)
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('alerts')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
          >
            All Logs <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {recentEvents.map((evt) => (
            <div
              key={evt.id}
              className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between gap-2 hover:border-slate-700 transition"
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">{evt.time}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${evt.badgeColor}`}>
                  {evt.type.toUpperCase()}
                </span>
              </div>
              <p className="text-xs text-slate-200 leading-snug">
                {evt.title}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
