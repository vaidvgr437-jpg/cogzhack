import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import {
  Phone,
  MessageSquare,
  Bell,
  Clock,
  ShieldAlert,
  CheckCircle2,
  X,
  Sliders,
  Send,
  PhoneCall,
  User,
  Sparkles,
  Zap,
  Info
} from 'lucide-react';

const COUNTRY_CODES = [
  { code: '+1', country: 'US / Canada', flag: '🇺🇸' },
  { code: '+44', country: 'United Kingdom', flag: '🇬🇧' },
  { code: '+91', country: 'India', flag: '🇮🇳' },
  { code: '+61', country: 'Australia', flag: '🇦🇺' },
  { code: '+49', country: 'Germany', flag: '🇩🇪' },
  { code: '+33', country: 'France', flag: '🇫🇷' },
  { code: '+81', country: 'Japan', flag: '🇯🇵' },
  { code: '+65', country: 'Singapore', flag: '🇸🇬' },
  { code: '+971', country: 'UAE', flag: '🇦🇪' }
];

const TIMING_PRESETS = [
  {
    id: 'rapid',
    name: 'Rapid Dispatch (High Risk)',
    badge: 'High Sensitivity',
    description: 'Immediate push, 5s SMS, 15s voice call. Recommended for high-fall-risk residents.',
    push: 0,
    sms: 5,
    call: 15
  },
  {
    id: 'standard',
    name: 'Standard Protocol (Recommended)',
    badge: 'Default Mode',
    description: 'Instant push, 10s SMS, 25s voice call. Gives 10s to cancel false alarms before SMS.',
    push: 0,
    sms: 10,
    call: 25
  },
  {
    id: 'extended',
    name: 'Extended Verification',
    badge: 'Low False Alarm',
    description: 'Instant push, 20s SMS, 45s voice call. Gives caregiver 20s to investigate locally.',
    push: 0,
    sms: 20,
    call: 45
  }
];

export const EmergencyDispatchSettingsModal: React.FC = () => {
  const {
    dispatchConfig,
    updateDispatchConfig,
    isDispatchSettingsOpen,
    setIsDispatchSettingsOpen,
    triggerTestSms,
    triggerTestCall,
    simulateFallEvent,
    addToast
  } = useDashboard();

  const [countryCode, setCountryCode] = useState(dispatchConfig.countryCode || '+1');
  const [phoneRaw, setPhoneRaw] = useState(() => {
    // strip out country code if included
    const cleaned = dispatchConfig.mobileNumber.replace(dispatchConfig.countryCode || '+1', '').trim();
    return cleaned || dispatchConfig.mobileNumber;
  });
  const [contactName, setContactName] = useState(dispatchConfig.contactName || 'Ananya Rao');
  const [relation, setRelation] = useState(dispatchConfig.relation || 'Daughter & Primary Caregiver');
  
  // Channels
  const [pushEnabled, setPushEnabled] = useState(dispatchConfig.pushEnabled);
  const [smsEnabled, setSmsEnabled] = useState(dispatchConfig.smsEnabled);
  const [callEnabled, setCallEnabled] = useState(dispatchConfig.callEnabled);
  const [autoCallVoice, setAutoCallVoice] = useState(dispatchConfig.autoCallVoice);

  // Timings
  const [pushDelay, setPushDelay] = useState(dispatchConfig.pushDelaySeconds);
  const [smsDelay, setSmsDelay] = useState(dispatchConfig.smsDelaySeconds);
  const [callDelay, setCallDelay] = useState(dispatchConfig.callDelaySeconds);

  const [activeTab, setActiveTab] = useState<'number' | 'timing' | 'test'>('number');

  if (!isDispatchSettingsOpen) return null;

  const handleApplyPreset = (preset: typeof TIMING_PRESETS[0]) => {
    setPushDelay(preset.push);
    setSmsDelay(preset.sms);
    setCallDelay(preset.call);
    addToast('Timing Preset Applied', `Set to ${preset.name}: Push ${preset.push}s, SMS ${preset.sms}s, Call ${preset.call}s`, 'info');
  };

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const formattedNumber = phoneRaw.startsWith('+') ? phoneRaw : `${countryCode} ${phoneRaw}`;
    
    updateDispatchConfig({
      countryCode,
      mobileNumber: formattedNumber,
      contactName: contactName.trim() || 'Emergency Contact',
      relation: relation.trim() || 'Primary Caregiver',
      pushEnabled,
      smsEnabled,
      callEnabled,
      autoCallVoice,
      pushDelaySeconds: Number(pushDelay),
      smsDelaySeconds: Math.max(Number(pushDelay), Number(smsDelay)),
      callDelaySeconds: Math.max(Number(smsDelay), Number(callDelay))
    });

    setIsDispatchSettingsOpen(false);
  };

  const handleRequestBrowserPush = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          addToast('Browser Notifications Enabled', 'You will receive desktop push notifications during fall alerts.', 'success');
          new Notification('SentinelCare Notification System Armed', {
            body: 'Desktop notifications are active for emergency fall escalation.',
            icon: '/favicon.ico'
          });
        } else {
          addToast('Notification Permission Denied', 'Browser push permissions were blocked.', 'warning');
        }
      } catch (err) {
        console.error(err);
      }
    } else {
      addToast('Push Not Supported', 'This browser does not support web notification API.', 'info');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <PhoneCall className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Emergency Mobile & Dispatch Routing
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                  Fall Event Mode
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Configure registered mobile number and automated multi-channel escalation timings
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsDispatchSettingsOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-2">
          <button
            onClick={() => setActiveTab('number')}
            className={`pb-2.5 px-3 text-xs font-mono font-bold transition border-b-2 flex items-center gap-2 ${
              activeTab === 'number'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Phone className="w-3.5 h-3.5" />
            <span>1. Registered Mobile Number</span>
          </button>
          <button
            onClick={() => setActiveTab('timing')}
            className={`pb-2.5 px-3 text-xs font-mono font-bold transition border-b-2 flex items-center gap-2 ${
              activeTab === 'timing'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>2. Escalation Timings</span>
          </button>
          <button
            onClick={() => setActiveTab('test')}
            className={`pb-2.5 px-3 text-xs font-mono font-bold transition border-b-2 flex items-center gap-2 ${
              activeTab === 'test'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>3. Live Test & Verification</span>
          </button>
        </div>

        {/* Body Content */}
        <form onSubmit={handleSave} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {activeTab === 'number' && (
            <div className="space-y-5">
              {/* Primary Mobile Number Input */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-400" />
                    Emergency Mobile Phone Number
                  </label>
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Receives Push, SMS & Calls
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5">
                  {/* Country Selector */}
                  <div className="sm:w-44">
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Country / Code</label>
                    <select
                      value={countryCode}
                      onChange={(e) => setCountryCode(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                    >
                      {COUNTRY_CODES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} ({c.country})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Phone Input */}
                  <div className="flex-1">
                    <label className="block text-[10px] font-mono text-slate-400 mb-1">Mobile Number</label>
                    <input
                      id="emergency-mobile-input"
                      type="tel"
                      required
                      value={phoneRaw}
                      onChange={(e) => setPhoneRaw(e.target.value)}
                      placeholder="(555) 942-0199 or 98450-23456"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-cyan-500/40 text-sm font-mono text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 bg-cyan-950/30 p-2.5 rounded-lg border border-cyan-500/20">
                  <Info className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  <span>
                    When a fall event is confirmed, automated alerts will be dispatched sequentially to{' '}
                    <strong className="text-cyan-300 font-bold">{countryCode} {phoneRaw || 'your registered number'}</strong>.
                  </span>
                </div>
              </div>

              {/* Contact Identity Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-1.5">
                  <label className="block text-xs font-mono text-slate-300 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" />
                    Contact Full Name
                  </label>
                  <input
                    type="text"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Ananya Rao"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  />
                  <p className="text-[10px] text-slate-500">Addressed by AI dispatch during voice call.</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-1.5">
                  <label className="block text-xs font-mono text-slate-300">Relationship / Role</label>
                  <input
                    type="text"
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    placeholder="e.g. Daughter & Primary Caregiver"
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                  />
                  <p className="text-[10px] text-slate-500">Determines caregiver escalation priority.</p>
                </div>
              </div>

              {/* Active Notification Channels */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 space-y-3">
                <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Active Fall Escalation Channels
                </h4>

                <div className="space-y-2">
                  <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition">
                    <div className="flex items-center gap-2.5">
                      <Bell className="w-4 h-4 text-cyan-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Push Notifications</div>
                        <div className="text-[10px] text-slate-400">Desktop & Mobile App instant alert push with telemetry payload</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleRequestBrowserPush}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-500/30"
                      >
                        Enable Browser Push
                      </button>
                      <input
                        type="checkbox"
                        checked={pushEnabled}
                        onChange={(e) => setPushEnabled(e.target.checked)}
                        className="accent-cyan-400 w-4 h-4 cursor-pointer"
                      />
                    </div>
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition">
                    <div className="flex items-center gap-2.5">
                      <MessageSquare className="w-4 h-4 text-emerald-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Automated Emergency SMS</div>
                        <div className="text-[10px] text-slate-400">SMS with GPS room location, peak impact G-force, and 1-tap ack link</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={smsEnabled}
                      onChange={(e) => setSmsEnabled(e.target.checked)}
                      className="accent-emerald-400 w-4 h-4 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 cursor-pointer transition">
                    <div className="flex items-center gap-2.5">
                      <PhoneCall className="w-4 h-4 text-red-400" />
                      <div>
                        <div className="text-xs font-bold text-white">Automated AI Voice Phone Call</div>
                        <div className="text-[10px] text-slate-400">Direct carrier dial with synthesized speech and DTMF key options</div>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={callEnabled}
                      onChange={(e) => setCallEnabled(e.target.checked)}
                      className="accent-red-400 w-4 h-4 cursor-pointer"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timing' && (
            <div className="space-y-5">
              {/* Presets */}
              <div>
                <h4 className="text-xs font-mono font-bold text-slate-300 mb-2 uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Quick Escalation Timing Presets
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {TIMING_PRESETS.map((p) => {
                    const isSelected = pushDelay === p.push && smsDelay === p.sms && callDelay === p.call;
                    return (
                      <div
                        key={p.id}
                        onClick={() => handleApplyPreset(p)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition flex flex-col justify-between ${
                          isSelected
                            ? 'bg-cyan-950/40 border-cyan-400 text-white shadow-md shadow-cyan-500/10'
                            : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold">{p.name}</span>
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300">
                              {p.badge}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 leading-tight mb-2.5">{p.description}</p>
                        </div>
                        <div className="text-[10px] font-mono text-cyan-300 flex items-center gap-1.5 pt-2 border-t border-slate-800">
                          <span>Push: {p.push}s</span>
                          <span>•</span>
                          <span>SMS: {p.sms}s</span>
                          <span>•</span>
                          <span>Call: {p.call}s</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Sliders */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-4">
                <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  Custom Fall Event Mode Escalation Timers
                </h4>

                {/* Push Delay */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <Bell className="w-3.5 h-3.5 text-cyan-400" />
                      1. Push Notification Delay:
                    </span>
                    <span className="text-cyan-300 font-bold">
                      {pushDelay === 0 ? '0s (Instantaneous)' : `${pushDelay} seconds`}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="1"
                    value={pushDelay}
                    onChange={(e) => setPushDelay(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>0s (Immediate)</span>
                    <span>5s</span>
                    <span>10s</span>
                  </div>
                </div>

                {/* SMS Delay */}
                <div className="space-y-1.5 pt-3 border-t border-slate-800">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
                      2. Emergency SMS Dispatch Delay:
                    </span>
                    <span className="text-emerald-300 font-bold">{smsDelay} seconds</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="45"
                    step="5"
                    value={smsDelay}
                    onChange={(e) => setSmsDelay(Number(e.target.value))}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>5s (Urgent)</span>
                    <span>10s (Standard)</span>
                    <span>20s</span>
                    <span>45s (Extended)</span>
                  </div>
                </div>

                {/* Call Delay */}
                <div className="space-y-1.5 pt-3 border-t border-slate-800">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-slate-300 flex items-center gap-1.5">
                      <PhoneCall className="w-3.5 h-3.5 text-red-400" />
                      3. Automated Voice Call Escalation Delay:
                    </span>
                    <span className="text-red-300 font-bold">{callDelay} seconds</span>
                  </div>
                  <input
                    type="range"
                    min="15"
                    max="60"
                    step="5"
                    value={callDelay}
                    onChange={(e) => setCallDelay(Number(e.target.value))}
                    className="w-full accent-red-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500">
                    <span>15s (Immediate)</span>
                    <span>25s (Recommended)</span>
                    <span>45s</span>
                    <span>60s (Maximum)</span>
                  </div>
                </div>

                {/* Voice Speech Toggle */}
                <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-white">Synthesize Voice Alert on Call</div>
                    <div className="text-[10px] text-slate-400">Speak resident name, room, and acceleration reading aloud upon call connect</div>
                  </div>
                  <input
                    type="checkbox"
                    checked={autoCallVoice}
                    onChange={(e) => setAutoCallVoice(e.target.checked)}
                    className="accent-cyan-400 w-4 h-4 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'test' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                <h4 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  Carrier & Telephony Integration Tests
                </h4>
                <p className="text-xs text-slate-400">
                  Verify that notifications, SMS carrier messages, and voice calls reach{' '}
                  <span className="text-white font-mono font-bold">{countryCode} {phoneRaw || 'your number'}</span> correctly.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {/* Test SMS Button */}
                  <button
                    type="button"
                    onClick={() => triggerTestSms(`${countryCode} ${phoneRaw}`)}
                    className="p-3.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex flex-col items-center justify-center gap-2 transition"
                  >
                    <Send className="w-5 h-5 text-emerald-400" />
                    <span>Send Test Emergency SMS</span>
                    <span className="text-[10px] text-emerald-400/80 font-normal">Pings {countryCode} {phoneRaw}</span>
                  </button>

                  {/* Test Call Button */}
                  <button
                    type="button"
                    onClick={() => triggerTestCall(`${countryCode} ${phoneRaw}`)}
                    className="p-3.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-mono font-bold flex flex-col items-center justify-center gap-2 transition"
                  >
                    <PhoneCall className="w-5 h-5 text-red-400" />
                    <span>Trigger Test Voice Call</span>
                    <span className="text-[10px] text-red-400/80 font-normal">Launches interactive voice line</span>
                  </button>
                </div>
              </div>

              {/* Full Fall Scenario Trigger */}
              <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="text-xs font-bold text-white flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-red-400" />
                    Simulate Live Fall Event Escalation
                  </h5>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                    Real-time Timeline
                  </span>
                </div>
                <p className="text-xs text-slate-300">
                  Triggers the full fall event mode. The system will activate local buzzer, then automatically push notification (at {pushDelay}s), send SMS to {countryCode} {phoneRaw} (at {smsDelay}s), and initiate automated voice call (at {callDelay}s).
                </p>
                <button
                  type="button"
                  onClick={() => {
                    handleSave();
                    simulateFallEvent();
                  }}
                  className="mt-2 w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition"
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Save Settings & Trigger Fall Scenario</span>
                </button>
              </div>
            </div>
          )}

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
            <div className="text-[11px] font-mono text-slate-400">
              Active Number: <span className="text-cyan-300 font-bold">{countryCode} {phoneRaw}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setIsDispatchSettingsOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition"
              >
                Cancel
              </button>
              <button
                id="save-emergency-number-btn"
                type="submit"
                className="px-5 py-2 rounded-xl text-xs font-mono font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 shadow-md shadow-cyan-400/20 transition flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save & Arm Dispatch Pipeline</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
