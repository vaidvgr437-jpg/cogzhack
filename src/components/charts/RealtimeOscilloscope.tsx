import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { Activity, Zap } from 'lucide-react';

export const RealtimeOscilloscope: React.FC = () => {
  const { telemetryHistory, telemetry, isEmergencyActive } = useDashboard();

  // Width & height for SVG canvas
  const svgWidth = 600;
  const svgHeight = 180;
  const padding = 20;

  // Scale data points to SVG coordinates
  // Acc values typically range from -2g to +2g (or -4g to +4g during falls)
  const maxRange = isEmergencyActive ? 4.0 : 2.0;

  const pointsAccX = telemetryHistory.map((pt, i) => {
    const x = padding + (i / (telemetryHistory.length - 1 || 1)) * (svgWidth - padding * 2);
    const y = (svgHeight / 2) - (pt.accX / maxRange) * (svgHeight / 2 - padding);
    return `${x},${Math.max(padding, Math.min(svgHeight - padding, y))}`;
  }).join(' ');

  const pointsAccY = telemetryHistory.map((pt, i) => {
    const x = padding + (i / (telemetryHistory.length - 1 || 1)) * (svgWidth - padding * 2);
    const y = (svgHeight / 2) - (pt.accY / maxRange) * (svgHeight / 2 - padding);
    return `${x},${Math.max(padding, Math.min(svgHeight - padding, y))}`;
  }).join(' ');

  const pointsAccZ = telemetryHistory.map((pt, i) => {
    const x = padding + (i / (telemetryHistory.length - 1 || 1)) * (svgWidth - padding * 2);
    const y = (svgHeight / 2) - (pt.accZ / maxRange) * (svgHeight / 2 - padding);
    return `${x},${Math.max(padding, Math.min(svgHeight - padding, y))}`;
  }).join(' ');

  return (
    <div className="w-full glass-card p-4 rounded-2xl border border-cyan-500/20">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            ESP32-S3 / MPU6050 50Hz Real-Time Sensor Stream
          </span>
        </div>

        {/* Legend Channels */}
        <div className="flex items-center gap-3 text-[11px] font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400"></span>
            <span className="text-cyan-300">Acc X ({telemetry.accX}g)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400"></span>
            <span className="text-emerald-300">Acc Y ({telemetry.accY}g)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-1 rounded-full bg-purple-400 shadow-sm shadow-purple-400"></span>
            <span className="text-purple-300">Acc Z ({telemetry.accZ}g)</span>
          </div>
        </div>
      </div>

      {/* SVG Oscilloscope Waveform Display */}
      <div className="relative w-full h-[180px] bg-slate-950/80 rounded-xl overflow-hidden border border-slate-800 cyber-grid-dense flex items-center justify-center">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full preserve-3d"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="cyanGlow" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Center Zero Reference Line */}
          <line
            x1="0"
            y1={svgHeight / 2}
            x2={svgWidth}
            y2={svgHeight / 2}
            stroke="#1e293b"
            strokeDasharray="4 4"
            strokeWidth="1.5"
          />

          {/* Waveform Polylines */}
          {telemetryHistory.length > 1 && (
            <>
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsAccX}
                filter="drop-shadow(0 0 4px rgba(6, 182, 212, 0.8))"
              />
              <polyline
                fill="none"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsAccY}
                filter="drop-shadow(0 0 4px rgba(16, 185, 129, 0.8))"
              />
              <polyline
                fill="none"
                stroke="#a855f7"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsAccZ}
                filter="drop-shadow(0 0 4px rgba(168, 85, 247, 0.8))"
              />
            </>
          )}
        </svg>

        {/* Real-time scanline line animation */}
        <div className="absolute top-0 bottom-0 w-[2px] bg-cyan-400/80 shadow-[0_0_12px_#38bdf8] right-4 animate-pulse"></div>

        {/* Live Fall spike overlay if emergency is active */}
        {isEmergencyActive && (
          <div className="absolute inset-0 bg-red-950/40 border-2 border-red-500/80 backdrop-blur-[2px] flex items-center justify-center pointer-events-none animate-pulse">
            <div className="px-4 py-1.5 rounded-lg bg-red-600/90 text-white font-mono text-xs font-bold tracking-widest uppercase shadow-lg shadow-red-600/50 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              IMPACT ANOMALY TRIGGERED • 3.82G SPIKE
            </div>
          </div>
        )}
      </div>

      {/* Gyroscope 3-Axis mini indicators below */}
      <div className="grid grid-cols-3 gap-2 mt-3 text-xs font-mono">
        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">Gyro X:</span>
          <span className="text-cyan-400 font-bold">{telemetry.gyroX}°/s</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">Gyro Y:</span>
          <span className="text-emerald-400 font-bold">{telemetry.gyroY}°/s</span>
        </div>
        <div className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">Gyro Z:</span>
          <span className="text-purple-400 font-bold">{telemetry.gyroZ}°/s</span>
        </div>
      </div>
    </div>
  );
};
