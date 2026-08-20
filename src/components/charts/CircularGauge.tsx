import React from 'react';

interface CircularGaugeProps {
  value: number; // 0 to 100
  max?: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
  sublabel?: string;
  colorScheme?: 'cyan' | 'emerald' | 'amber' | 'red' | 'dynamic';
}

export const CircularGauge: React.FC<CircularGaugeProps> = ({
  value,
  max = 100,
  size = 180,
  strokeWidth = 14,
  label,
  sublabel,
  colorScheme = 'dynamic'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const strokeDashoffset = circumference - (pct / 100) * circumference;

  let strokeColor = '#06b6d4';
  let glowClass = 'glow-cyan';

  if (colorScheme === 'dynamic') {
    if (value < 40) {
      strokeColor = '#10b981'; // green / low risk
      glowClass = 'glow-emerald';
    } else if (value < 70) {
      strokeColor = '#f59e0b'; // amber / moderate
      glowClass = 'glow-amber';
    } else {
      strokeColor = '#ef4444'; // red / high risk
      glowClass = 'glow-red';
    }
  } else if (colorScheme === 'cyan') {
    strokeColor = '#06b6d4';
  } else if (colorScheme === 'emerald') {
    strokeColor = '#10b981';
  } else if (colorScheme === 'amber') {
    strokeColor = '#f59e0b';
  } else if (colorScheme === 'red') {
    strokeColor = '#ef4444';
  }

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#1e293b"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray="6 4"
        />

        {/* Progress Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.8s ease-in-out, stroke 0.5s ease',
            filter: `drop-shadow(0 0 8px ${strokeColor}80)`
          }}
        />
      </svg>

      {/* Center Label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
        <div className={`text-3xl font-mono font-extrabold text-white tracking-tight ${glowClass}`}>
          {value}
          <span className="text-xs text-slate-400 font-normal ml-0.5">/{max}</span>
        </div>
        {label && (
          <div className="text-xs font-bold font-mono text-slate-200 mt-0.5">
            {label}
          </div>
        )}
        {sublabel && (
          <div className="text-[10px] text-slate-400 font-mono">
            {sublabel}
          </div>
        )}
      </div>
    </div>
  );
};
