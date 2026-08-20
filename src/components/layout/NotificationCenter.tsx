import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  Bell, 
  ShieldAlert, 
  CheckCircle2, 
  X, 
  Activity, 
  Pill, 
  WifiOff, 
  ChevronRight 
} from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const { 
    isNotificationCenterOpen, 
    setIsNotificationCenterOpen, 
    alerts, 
    setSelectedIncident, 
    setActiveTab 
  } = useDashboard();

  if (!isNotificationCenterOpen) return null;

  const handleIncidentClick = (incident: any) => {
    setSelectedIncident(incident);
    setActiveTab('alerts');
    setIsNotificationCenterOpen(false);
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setIsNotificationCenterOpen(false)}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      />

      {/* Popover Card */}
      <div className="fixed top-18 right-4 lg:right-6 w-96 max-w-[calc(100vw-2rem)] z-50 rounded-2xl glass-panel border border-cyan-500/30 p-4 shadow-2xl animate-fadeIn">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Caregiver Notifications
            </h3>
          </div>
          <button
            onClick={() => setIsNotificationCenterOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
          {alerts.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-400 font-mono">
              No recent notifications
            </div>
          ) : (
            alerts.slice(0, 6).map((alert) => {
              const isCrit = alert.severity === 'critical';
              const isWarn = alert.severity === 'warning';

              return (
                <div
                  key={alert.id}
                  onClick={() => handleIncidentClick(alert)}
                  className={`p-3 rounded-xl border transition cursor-pointer ${
                    isCrit
                      ? 'bg-red-950/40 border-red-500/40 hover:border-red-400'
                      : isWarn
                      ? 'bg-amber-950/30 border-amber-500/30 hover:border-amber-400'
                      : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${isCrit ? 'bg-red-500 animate-ping' : isWarn ? 'bg-amber-400' : 'bg-emerald-400'}`} />
                      <span className="text-xs font-bold text-white leading-snug">{alert.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">{alert.timeFormatted}</span>
                  </div>

                  <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                    {alert.description}
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-800/80 text-[10px] font-mono text-cyan-400">
                    <span>{alert.device}</span>
                    <span className="flex items-center gap-1">
                      Details <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* View All Button */}
        <div className="mt-3 pt-2 border-t border-slate-800 text-center">
          <button
            onClick={() => {
              setActiveTab('alerts');
              setIsNotificationCenterOpen(false);
            }}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300 font-semibold"
          >
            View All Incident Records →
          </button>
        </div>
      </div>
    </>
  );
};
