import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { MedicineDispenser3D } from '../components/3d/MedicineDispenser3D';
import { CircularGauge } from '../components/charts/CircularGauge';
import { MedicationWeeklyChart } from '../components/charts/MedicationWeeklyChart';
import { 
  Pill, 
  Camera, 
  Scale, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Sliders, 
  BellRing,
  RotateCw,
  Sparkles
} from 'lucide-react';

export const MedicationPage: React.FC = () => {
  const { medications, verifyMedication, activeScenario } = useDashboard();
  const [selectedSlot, setSelectedSlot] = useState<number>(1);

  const [reminderAudioEnabled, setReminderAudioEnabled] = useState(true);
  const [gracePeriodMinutes, setGracePeriodMinutes] = useState(45);
  const [escalationDelayMinutes, setEscalationDelayMinutes] = useState(15);

  const adherenceRate = activeScenario === 'missed_medication' ? 75 : 94;

  return (
    <div className="space-y-6 animate-fadeIn pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl glass-panel border border-cyan-500/20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <Pill className="w-5 h-5 text-emerald-400" />
              SMART MEDICATION VERIFICATION
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              ESP32-CAM + HX711 LOAD CELL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 font-mono">
            Optical pill recognition + high-precision gravimetric load-cell verification
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => verifyMedication('med-02')}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition active:scale-95"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Verify Slot 2 Dose (Demo)</span>
          </button>
        </div>
      </div>

      {/* 3D Smart Medicine Dispenser Hero Area */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            3D Smart Carousel Dispenser (ESP32-CAM RX-3)
          </span>
          <span className="text-[11px] font-mono text-slate-400">
            Click compartment tab to rotate carousel to that slot
          </span>
        </div>
        <MedicineDispenser3D selectedSlotIndex={selectedSlot} onSelectSlot={setSelectedSlot} />
      </div>

      {/* Adherence Gauge & Dual Verification Telemetry Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Adherence Rate Circular Gauge */}
        <div className="p-6 rounded-2xl glass-panel border border-cyan-500/20 flex flex-col items-center justify-center text-center">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 font-bold">
            Medication Adherence
          </div>

          <CircularGauge
            value={adherenceRate}
            max={100}
            size={180}
            strokeWidth={14}
            label={adherenceRate > 90 ? 'EXCELLENT' : 'ATTENTION'}
            sublabel="27 / 29 DOSES"
            colorScheme={adherenceRate > 90 ? 'emerald' : 'amber'}
          />

          <div className="mt-4 text-xs font-mono text-slate-400">
            Consistent morning & evening adherence over 30 days
          </div>
        </div>

        {/* Weekly Adherence Bar Graph */}
        <div className="lg:col-span-2">
          <MedicationWeeklyChart />
        </div>
      </div>

      {/* Medication Schedule Table */}
      <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
              Daily Prescription Schedule & Verification Pipeline
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Patient: <strong className="text-white">Meena Rao</strong>
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 text-[11px] uppercase tracking-wider">
                <th className="pb-3 font-semibold">Slot / Medicine</th>
                <th className="pb-3 font-semibold">Scheduled Time</th>
                <th className="pb-3 font-semibold">Status</th>
                <th className="pb-3 font-semibold">Camera Match</th>
                <th className="pb-3 font-semibold">HX711 Weight (Exp / Obs)</th>
                <th className="pb-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {medications.map((med) => {
                const isVer = med.status === 'verified';
                const isMiss = med.status === 'missed';

                return (
                  <tr key={med.id} className="hover:bg-slate-900/40 transition">
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: med.pillColor }}
                        />
                        <div>
                          <div className="font-bold text-white text-xs">{med.name}</div>
                          <div className="text-[10px] text-slate-400 font-sans">{med.dosage} • Slot {med.compartmentIndex}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <div className="text-white font-bold">{med.scheduledTime}</div>
                      <div className="text-[10px] text-slate-400">{med.timeWindow}</div>
                    </td>

                    <td className="py-3.5">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                        isVer ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : isMiss ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}>
                        {med.status}
                      </span>
                    </td>

                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-slate-200">
                          {med.cameraConfidence > 0 ? `${med.cameraConfidence}% (Match ✓)` : 'Waiting'}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Scale className="w-3.5 h-3.5 text-cyan-400" />
                        <span className="text-slate-200">
                          {med.expectedWeightGrams.toFixed(2)}g / {med.observedWeightGrams.toFixed(2)}g
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 text-right">
                      {isVer ? (
                        <span className="text-emerald-400 text-[11px] font-bold flex items-center justify-end gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </span>
                      ) : (
                        <button
                          onClick={() => verifyMedication(med.id)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] transition shadow-sm"
                        >
                          Verify Now
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hardware Dispenser Controls & Escalation Timing */}
      <div className="p-5 rounded-2xl glass-panel border border-cyan-500/20">
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider">
            Smart Dispenser Servo & Reminder Settings
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          {/* Setting 1: Chime */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BellRing className="w-4 h-4 text-cyan-400" />
              <div>
                <div className="font-bold text-white">Audio Reminder Chime</div>
                <div className="text-[10px] text-slate-400">Pleasant tone at dosage time</div>
              </div>
            </div>
            <button
              onClick={() => setReminderAudioEnabled(!reminderAudioEnabled)}
              className={`w-10 h-6 rounded-full transition-colors relative ${reminderAudioEnabled ? 'bg-cyan-500' : 'bg-slate-700'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${reminderAudioEnabled ? 'right-1' : 'left-1'}`} />
            </button>
          </div>

          {/* Setting 2: Grace Period */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-400">Grace Period Window:</span>
              <span className="text-cyan-300 font-bold">{gracePeriodMinutes} mins</span>
            </div>
            <input
              type="range"
              min="15"
              max="90"
              step="15"
              value={gracePeriodMinutes}
              onChange={(e) => setGracePeriodMinutes(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>

          {/* Setting 3: Escalation Delay */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-slate-400">SMS Escalation Delay:</span>
              <span className="text-cyan-300 font-bold">{escalationDelayMinutes} mins</span>
            </div>
            <input
              type="range"
              min="5"
              max="60"
              step="5"
              value={escalationDelayMinutes}
              onChange={(e) => setEscalationDelayMinutes(Number(e.target.value))}
              className="w-full accent-cyan-400"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
