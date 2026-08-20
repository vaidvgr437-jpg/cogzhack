import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { generateMobilityTimeSeries } from '../../data/mockData';
import { useDashboard } from '../../context/DashboardContext';
import { TrendingDown, TrendingUp, Info } from 'lucide-react';

export const MobilityTrendChart: React.FC = () => {
  const [timeRange, setTimeRange] = useState<number>(30);
  const { activeScenario } = useDashboard();

  const data = useMemo(() => {
    const raw = generateMobilityTimeSeries(timeRange);
    if (activeScenario === 'mobility_decline') {
      // Modify last 5 days to show marked decline
      return raw.map((item, idx) => {
        if (idx >= raw.length - 5) {
          const delta = (idx - (raw.length - 5) + 1) * 8;
          return {
            ...item,
            current: Math.min(85, item.current + delta),
            cadence: Math.max(55, item.cadence - delta),
            variability: +(item.variability + delta * 0.4).toFixed(1)
          };
        }
        return item;
      });
    }
    return raw;
  }, [timeRange, activeScenario]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-3 rounded-xl bg-slate-900/95 border border-cyan-500/40 backdrop-blur-md shadow-xl text-xs font-mono">
          <div className="text-white font-bold mb-1.5">{label}</div>
          <div className="flex items-center gap-2 text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Current Risk Score: {payload[0]?.value} / 100</span>
          </div>
          <div className="flex items-center gap-2 text-blue-400">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
            <span>Learned Baseline: {payload[1]?.value} / 100</span>
          </div>
          <div className="flex items-center gap-2 text-purple-400">
            <span className="w-2 h-2 rounded-full bg-purple-500"></span>
            <span>AI Forecast: {payload[2]?.value} / 100</span>
          </div>
          {payload[0]?.payload?.cadence && (
            <div className="mt-2 pt-1.5 border-t border-slate-800 text-[11px] text-slate-400">
              Cadence: <span className="text-white font-bold">{payload[0].payload.cadence} spm</span> • Variability: <span className="text-white font-bold">{payload[0].payload.variability}%</span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full glass-card p-5 rounded-2xl border border-cyan-500/20 flex flex-col gap-4">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>Mobility Trajectory & Anomaly Projection</span>
            {activeScenario === 'mobility_decline' ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> DEVIATION DETECTED (+18.6%)
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                <TrendingDown className="w-3 h-3" /> STABLE GAIT
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Learned individual baseline vs real-time 6-axis IMU features
          </p>
        </div>

        {/* Time range switch buttons */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900/80 border border-slate-800 text-xs font-mono">
          {[
            { label: '7 DAYS', days: 7 },
            { label: '30 DAYS', days: 30 },
            { label: '90 DAYS', days: 90 }
          ].map((btn) => (
            <button
              key={btn.days}
              onClick={() => setTimeRange(btn.days)}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                timeRange === btn.days
                  ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-[280px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="currentGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="baselineGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.6} />
            <XAxis
              dataKey="date"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#334155' }}
              domain={[10, 90]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace', paddingBottom: '12px' }}
            />
            <Area
              type="monotone"
              dataKey="current"
              name="Current Score"
              stroke="#06b6d4"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#currentGrad)"
            />
            <Area
              type="monotone"
              dataKey="baseline"
              name="Learned Baseline"
              stroke="#3b82f6"
              strokeDasharray="4 4"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#baselineGrad)"
            />
            <Area
              type="monotone"
              dataKey="predicted"
              name="AI Prediction"
              stroke="#a855f7"
              strokeDasharray="2 2"
              strokeWidth={2}
              fill="transparent"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-2 pt-2 border-t border-slate-800/80">
        <span className="flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          Lower score indicates healthier, more stable gait.
        </span>
        <span>Sampling: 50Hz ESP32 Stream • Normalized Daily</span>
      </div>
    </div>
  );
};
