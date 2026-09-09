import React from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { 
  UserMinus, 
  Trash2, 
  AlertTriangle, 
  X, 
  Watch, 
  Radio, 
  CheckCircle2, 
  ShieldAlert,
  Phone
} from 'lucide-react';

export const RemovePatientModal: React.FC = () => {
  const { 
    patientToDelete, 
    closeDeletePatientModal, 
    removePatient,
    patientsList
  } = useDashboard();

  if (!patientToDelete) return null;

  const isOnlyPatient = patientsList.length <= 1;

  const handleConfirm = () => {
    removePatient(patientToDelete.id);
    closeDeletePatientModal();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn"
      onClick={closeDeletePatientModal}
    >
      <div 
        id="remove-patient-modal"
        className="w-full max-w-lg rounded-3xl glass-panel border border-red-500/40 shadow-2xl p-6 sm:p-7 relative overflow-hidden bg-slate-900/95"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-red-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 flex items-center justify-center shadow-lg shadow-red-500/10 shrink-0">
              <UserMinus className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-red-500/15 text-red-300 border border-red-500/30">
                  Resident Management
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight mt-1">
                Remove Patient
              </h2>
            </div>
          </div>

          <button
            id="close-remove-modal-btn"
            type="button"
            onClick={closeDeletePatientModal}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Cancel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patient Snapshot Card */}
        <div className="my-5 p-4 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-4 relative z-10">
          <div className="relative shrink-0">
            <img 
              src={patientToDelete.avatar} 
              alt={patientToDelete.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-red-400/40 shadow-md" 
            />
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-700 border-2 border-slate-900 flex items-center justify-center text-[9px] text-white">
              ✕
            </span>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-white truncate">
                {patientToDelete.name}
              </h3>
              <span className="text-xs font-mono text-slate-400">
                ({patientToDelete.age}y • {patientToDelete.gender || 'Resident'})
              </span>
            </div>
            
            <p className="text-xs text-cyan-400 font-mono mt-0.5 truncate">
              {patientToDelete.room}
            </p>

            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2 font-mono truncate">
              <Phone className="w-3 h-3 text-slate-500 shrink-0" />
              <span>Emergency Contact: {patientToDelete.emergencyContact.name} ({patientToDelete.emergencyContact.phone})</span>
            </div>
          </div>
        </div>

        {/* Hardware Devices Disconnection Notice */}
        <div className="mb-5 p-3.5 rounded-xl bg-slate-950/40 border border-slate-800 text-xs text-slate-300 relative z-10 space-y-2">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block">
            Hardware Unbinding & Telemetry Impact
          </span>
          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center gap-1.5 text-slate-300">
              <Watch className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span className="truncate">Smart Wristband</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center gap-1.5 text-slate-300">
              <Radio className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="truncate">Home Hub</span>
            </div>
          </div>
        </div>

        {/* Confirmation Warning Notice */}
        <div className="p-3.5 rounded-2xl bg-red-950/30 border border-red-500/30 text-xs text-red-200 flex items-start gap-3 relative z-10">
          <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <p className="font-semibold text-red-300">
              Are you sure you want to remove this resident?
            </p>
            <p className="text-[11px] text-red-300/80 mt-1">
              Active fall detection telemetry, emergency dispatch pipeline, and gait baseline analytics will be halted for this profile.
              {isOnlyPatient && (
                <span className="block mt-1 text-amber-300 font-semibold">
                  Note: This is your currently registered resident. You can add another resident at any time.
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 relative z-10">
          <button
            id="cancel-remove-patient-btn"
            type="button"
            onClick={closeDeletePatientModal}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-bold border border-slate-700 transition"
          >
            Cancel
          </button>

          <button
            id="confirm-remove-patient-btn"
            type="button"
            onClick={handleConfirm}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-mono font-bold shadow-lg shadow-red-600/30 border border-red-500/50 flex items-center justify-center gap-2 transition active:scale-98"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Confirm & Remove</span>
          </button>
        </div>
      </div>
    </div>
  );
};
