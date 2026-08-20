import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Cell
} from 'recharts';
import { WEEKLY_MEDICATION_DATA } from '../../data/mockData';

export const MedicationWeeklyChart: React.FC = () => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="p-2.5 rounded-xl bg-slate-900/95 border border-cyan-500/40 backdrop-blur-md shadow-xl text-xs font-mono">
          <div className="text-white font-bold mb-1">{label}</div>
          <div className="text-emerald-400">Verified: {d.verified} / {d.scheduled} Doses</div>
          <div className="text-slate-300">Adherence Rate: {d.rate}%</div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full glass-card p-4 rounded-2xl border border-cyan-500/20">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="text-xs font-bold font-mono text-white uppercase tracking-wider">
            7-Day Dose Verification Log
          </h4>
          <p className="text-[11px] text-slate-400">Camera + load cell confirmation rate</p>
        </div>
        <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
          96.4% AVG
        </span>
      </div>

      <div className="w-full h-[160px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={WEEKLY_MEDICATION_DATA} margin={{ top: 10, right: 0, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.5} vertical={false} />
            <XAxis dataKey="day" stroke="#64748b" fontSize={11} tickLine={false} axisLine={{ stroke: '#334155' }} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={{ stroke: '#334155' }} domain={[0, 100]} />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(56, 189, 248, 0.05)' }} />
            <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
              {WEEKLY_MEDICATION_DATA.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={entry.rate === 100 ? '#10b981' : '#f59e0b'}
                  style={{ filter: `drop-shadow(0 0 4px ${entry.rate === 100 ? '#10b98160' : '#f59e0b60'})` }}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
