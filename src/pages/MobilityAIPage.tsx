import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { CircularGauge } from '../components/charts/CircularGauge';
import { MobilityTrendChart } from '../components/charts/MobilityTrendChart';
import { 
  BrainCircuit, 
  Sparkles, 
  TrendingDown, 
  TrendingUp, 
  Footprints, 
  Clock, 
  Activity, 
  ShieldCheck, 
  AlertTriangle,
  ArrowRight,
  Info,
  CheckCircle2
} from 'lucide-react';

export const MobilityAIPage: React.FC = () => {
  const { mobilityMetrics, activeScenario } = useDashboard();

  const isDecline = activeScenario === 'mobility_decline';

  const anomalyStages = [
    { title: 'Learned Baseline', value: '28 / 100', desc: 'Normalized 30-day gait profile', status: 'completed' },
    { title: 'Minor Deviation', value: '+4.2%', desc: 'Slight cadence deceleration', status: isDecline ? 'active' : 'stable' },
    { title: 'Increasing Deviation', value: '+18.6%', desc: 'Asymmetric stride variability', status: isDecline ? 'warning' : 'stable' },
    { title: 'Current State', value: isDecline ? '74 / 100 (HIGH)' : '32 / 100 (LOW)', desc: isDecline ? 'Caregiver review recommended' : 'Stable within tolerance', status: isDecline ? 'critical' : 'optimal' }
  ];

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header & Prominent Medical Disclaimer Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-cyan-400" />
              AI MOBILITY INTELLIGENCE
            </h1>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Longitudinal gait pattern modeling, musculoskeletal fatigue prediction & fall prevention
          </p>
        </div>

        {/* Mandatory Medical Disclaimer Badge */}
        <div className="px-3.5 py-1.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 text-xs font-mono font-bold flex items-center gap-2 shadow-sm">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>AI DECISION SUPPORT — NOT A MEDICAL DIAGNOSIS</span>
        </div>
      </div>

      {/* Hero Section: Large Circular Gauge & AI Insight Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1 Col: Large Circular Mobility Risk Score */}
        <div className="p-6 rounded-2xl glass-panel-glow border border-cyan-500/30 flex flex-col items-center justify-center text-center">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 font-bold">
            Aggregated Mobility Risk
          </div>

          <CircularGauge
            value={mobilityMetrics.riskScore}
            max={100}
            size={190}
            strokeWidth={14}
            label={mobilityMetrics.riskLevel}
            sublabel="AI GAIT INDEX"
            colorScheme={mobilityMetrics.riskScore < 40 ? 'emerald' : mobilityMetrics.riskScore < 70 ? 'amber' : 'red'}
          />

          <div className="mt-4 text-xs font-mono text-slate-400 max-w-xs leading-relaxed">
            {mobilityMetrics.riskScore < 40
              ? 'Low probability of fall or instability. Musculoskeletal cadence within healthy range.'
              : 'Elevated gait hesitation and slow transitions detected.'}
          </div>
        </div>

        {/* Right 2 Cols: AI Insight Glassmorphism Panel */}
        <div className="lg:col-span-2 p-6 rounded-2xl glass-panel border border-cyan-500/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-sm font-bold font-mono text-white uppercase tracking-wider">
                  Edge AI Predictive Synthesis
                </h3>
              </div>
              <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold ${
                isDecline ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {isDecline ? 'ATTENTION RECOMMENDED' : 'BASELINE CONGRUENT'}
              </span>
            </div>

            <div className={`mt-4 p-4 rounded-xl border ${
              isDecline
                ? 'bg-amber-950/40 border-amber-500/40 text-amber-100'
                : 'bg-slate-900/70 border-slate-800 text-slate-200'
            }`}>
              <div className="text-sm font-semibold flex items-center gap-2 mb-1 text-white">
                {isDecline ? <AlertTriangle className="w-4 h-4 text-amber-400" /> : <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                {isDecline
                  ? 'Mobility decline detected over the last 5 days.'
                  : 'Mobility remains close to the personal baseline. No significant decline detected.'}
              </div>
              <p className="text-xs opacity-90 leading-relaxed">
                {isDecline
                  ? 'The predictive model observed a 26% decrease in natural step cadence and an increase in sit-to-stand transition latency (avg 8.2s vs 4.1s baseline). Early signs of knee stiffness or muscle fatigue.'
                  : 'Gait symmetry index is 94.2%. Stride length and swing phase duration match the learned 30-day baseline model established for Meena Rao.'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-slate-800 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 text-[10px]">Personal Baseline Calibration</span>
              <div className="text-white font-bold mt-0.5">Established over 30 days (240k steps)</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-slate-400 text-[10px]">AI Prediction Confidence</span>
              <div className="text-cyan-300 font-bold mt-0.5">{mobilityMetrics.aiConfidence}% (ResNet + LSTM)</div>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Key Mobility Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1 */}
        <div className="p-4 rounded-2xl glass-card border border-cyan-500/20">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Step Cadence</div>
          <div className="text-lg font-extrabold font-mono text-white mt-1">
            {mobilityMetrics.stepCadence}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">steps/min</div>
        </div>

        {/* Metric 2 */}
        <div className="p-4 rounded-2xl glass-card border border-cyan-500/20">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Stride Variability</div>
          <div className={`text-lg font-extrabold font-mono mt-1 ${isDecline ? 'text-amber-400' : 'text-emerald-400'}`}>
            {mobilityMetrics.strideVariability}%
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Target: &lt;10%</div>
        </div>

        {/* Metric 3 */}
        <div className="p-4 rounded-2xl glass-card border border-cyan-500/20">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Activity Duration</div>
          <div className="text-lg font-extrabold font-mono text-white mt-1">
            4h 12m
          </div>
          <div className="text-[10px] text-slate-400 font-mono">252 mins active</div>
        </div>

        {/* Metric 4 */}
        <div className="p-4 rounded-2xl glass-card border border-cyan-500/20">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Sit-to-Stand</div>
          <div className="text-lg font-extrabold font-mono text-white mt-1">
            {mobilityMetrics.sitToStandCount}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">Transitions today</div>
        </div>

        {/* Metric 5 */}
        <div className="p-4 rounded-2xl glass-card border border-cyan-500/20">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Mobility Trend</div>
          <div className={`text-lg font-extrabold font-mono mt-1 ${isDecline ? 'text-amber-400' : 'text-emerald-400'}`}>
            {mobilityMetrics.mobilityTrend}
          </div>
          <div className="text-[10px] text-slate-400 font-mono">7-Day Trajectory</div>
        </div>

        {/* Metric 6 */}
        <div className="p-4 rounded-2xl glass-card border border-cyan-500/20">
          <div className="text-[10px] font-mono text-slate-400 uppercase">AI Confidence</div>
          <div className="text-lg font-extrabold font-mono text-cyan-300 mt-1">
            {mobilityMetrics.aiConfidence}%
          </div>
          <div className="text-[10px] text-slate-400 font-mono">High Precision</div>
        </div>
      </div>

      {/* Large Multi-line Trajectory Chart */}
      <MobilityTrendChart />

      {/* Anomaly Progression Pipeline */}
      <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20">
        <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Activity className="w-4 h-4" />
          Anomaly Detection Progression Pipeline
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {anomalyStages.map((stage, idx) => (
            <div
              key={stage.title}
              className={`p-3.5 rounded-xl border relative ${
                stage.status === 'critical'
                  ? 'bg-red-950/40 border-red-500/50'
                  : stage.status === 'warning'
                  ? 'bg-amber-950/40 border-amber-500/50'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-slate-400">Step 0{idx + 1}</span>
                <span className={`font-bold ${
                  stage.status === 'critical' ? 'text-red-400' : stage.status === 'warning' ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {stage.value}
                </span>
              </div>
              <div className="text-xs font-bold text-white mt-1">{stage.title}</div>
              <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{stage.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
