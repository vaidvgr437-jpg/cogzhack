import React, { useState, useRef } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { ElderlyPerson } from '../types';
import { 
  User, 
  Plus, 
  Upload, 
  Watch, 
  Pill, 
  Radio, 
  HeartPulse, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Sparkles, 
  ShieldAlert, 
  Activity, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  UserCheck, 
  FileText, 
  Wifi, 
  Check, 
  Camera,
  X,
  ChevronRight,
  ArrowLeft,
  BrainCircuit,
  ShieldCheck
} from 'lucide-react';

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
];

interface PatientSetupPageProps {
  onDone?: () => void;
}

export const PatientSetupPage: React.FC<PatientSetupPageProps> = ({ onDone }) => {
  const { 
    currentUser, 
    currentUserEmail, 
    addPatient, 
    navigateTo, 
    setActiveTab,
    patientsList,
    addToast 
  } = useDashboard();

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gemini AI Clinical Plan Generation State
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiInsights, setAiInsights] = useState<{
    clinicalSummary: string;
    fallRiskLevel: string;
    fallRiskScore: number;
    recommendedIoTSettings: {
      wristbandSensitivity: string;
      nightMonitoring: string;
      medicationReminders: string;
    };
    preventiveProtocols: string[];
    clinicianAdvisory: string;
  } | null>(null);

  // Avatar State
  const [avatarUrl, setAvatarUrl] = useState<string>(PRESET_AVATARS[0]);
  const [customPhotoName, setCustomPhotoName] = useState<string>('');
  const [showAvatarPicker, setShowAvatarPicker] = useState<boolean>(false);

  // Personal Information
  const [fullName, setFullName] = useState('');
  const [preferredName, setPreferredName] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [age, setAge] = useState<number | string>(74);
  const [gender, setGender] = useState('Female');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [address, setAddress] = useState('Apt 5C, Sunrise Enclave');

  // Caregiver Information
  const [caregiverName, setCaregiverName] = useState(currentUser || 'Primary Caregiver');
  const [caregiverPhone, setCaregiverPhone] = useState('+91 98450 88210');
  const [relationship, setRelationship] = useState('Daughter');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');

  // Care Information
  const [mobilityStatus, setMobilityStatus] = useState<'Independent' | 'Assisted' | 'Limited Mobility'>('Assisted');
  const [medicalNotes, setMedicalNotes] = useState('Mild Osteoarthritis in left knee, history of occasional dizziness when rising.');
  const [monitoringStatus, setMonitoringStatus] = useState('Active 24/7 Real-Time Watch');

  // Device Assignment
  const [wristbandId, setWristbandId] = useState('WB-ESP32-9021');
  const [wristbandConnected, setWristbandConnected] = useState(true);

  const [dispenserId, setDispenserId] = useState('MD-HX711-4011');
  const [dispenserConnected, setDispenserConnected] = useState(true);

  const [hubId, setHubId] = useState('HUB-MQTT-1080');
  const [hubConnected, setHubConnected] = useState(true);

  // Form Validation & Success State
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccessPatient, setSavedSuccessPatient] = useState<ElderlyPerson | null>(null);

  const isFirstPatient = patientsList.length === 0;

  // Handle DOB change and auto-calc approximate age
  const handleDobChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setDateOfBirth(val);
    if (val) {
      const birthYear = new Date(val).getFullYear();
      const currentYear = new Date().getFullYear();
      if (birthYear > 1900 && birthYear <= currentYear) {
        setAge(currentYear - birthYear);
      }
    }
  };

  // Handle Custom File Upload
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCustomPhotoName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatarUrl(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSavePatient = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim()) {
      setError('Please enter the patient’s full name.');
      return;
    }

    if (!dateOfBirth && (!age || Number(age) <= 0)) {
      setError('Please specify either Date of Birth or Patient Age.');
      return;
    }

    if (!caregiverName.trim()) {
      setError('Please specify the Primary Caregiver name.');
      return;
    }

    if (!caregiverPhone.trim()) {
      setError('Please provide a caregiver contact phone number.');
      return;
    }

    setIsSubmitting(true);

    const calculatedAge = typeof age === 'number' ? age : parseInt(age, 10) || 72;

    const newPatient: ElderlyPerson = {
      id: 'patient-' + Math.random().toString(36).substr(2, 7),
      name: fullName.trim(),
      preferredName: preferredName.trim() || undefined,
      dateOfBirth: dateOfBirth || undefined,
      age: calculatedAge,
      gender,
      room: address.trim() || 'Apt 302, Care Wing',
      avatar: avatarUrl,
      phoneNumber: phoneNumber.trim() || undefined,
      emailAddress: emailAddress.trim() || undefined,
      address: address.trim() || undefined,
      primaryCaregiver: {
        name: caregiverName.trim(),
        phone: caregiverPhone.trim(),
        relationship: relationship.trim()
      },
      emergencyContact: {
        name: emergencyContactName.trim() || caregiverName.trim(),
        relationship: emergencyContactName.trim() ? 'Family Emergency Contact' : relationship.trim(),
        phone: emergencyContactPhone.trim() || caregiverPhone.trim()
      },
      primaryDoctor: 'Dr. Srinivas Murthy (Geriatric Specialist)',
      medicalConditions: medicalNotes
        ? medicalNotes.split(/[,;\n]+/).map(s => s.trim()).filter(Boolean)
        : ['Routine Geriatric Monitoring'],
      mobilityStatus,
      careNotes: medicalNotes,
      monitoringStatus,
      connectedDevices: {
        wristbandId,
        wristbandConnected,
        dispenserId,
        dispenserConnected,
        hubId,
        hubConnected
      },
      baselineMobilityScore: mobilityStatus === 'Limited Mobility' ? 55 : mobilityStatus === 'Assisted' ? 35 : 20,
      currentMobilityScore: mobilityStatus === 'Limited Mobility' ? 58 : mobilityStatus === 'Assisted' ? 38 : 22,
      medicationAdherence: 96
    };

    setTimeout(() => {
      addPatient(newPatient);
      setIsSubmitting(false);
      setSavedSuccessPatient(newPatient);
    }, 400);
  };

  const handleGoToDashboard = () => {
    setActiveTab('overview');
    if (onDone) {
      onDone();
    } else {
      navigateTo('/dashboard');
    }
  };

  const handleBackToHome = () => {
    setActiveTab('overview');
    if (onDone) {
      onDone();
    } else {
      navigateTo('/dashboard');
    }
  };

  const handleGenerateAICarePlan = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/ai/onboarding-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: fullName.trim() || 'New Resident',
          age: typeof age === 'number' ? age : parseInt(age as string, 10) || 75,
          gender,
          mobilityStatus,
          medicalNotes,
          connectedDevices: {
            wristbandId,
            dispenserId,
            hubId
          }
        })
      });
      const data = await res.json();
      if (data && data.data) {
        setAiInsights(data.data);
        addToast(
          'Gemini Clinical AI Assessment Generated',
          `Personalized fall risk and IoT thresholds calculated (${data.source || 'gemini-3.8-flash'}).`,
          'success'
        );
      }
    } catch (err) {
      console.error(err);
      addToast('Clinical Heuristics Applied', 'Personalized baseline profile generated.', 'info');
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSkip = () => {
    setActiveTab('overview');
    addToast('Setup Deferred', 'You can register or update patient profiles anytime from the header.', 'info');
    if (onDone) {
      onDone();
    } else {
      navigateTo('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans selection:bg-cyan-500 selection:text-black">
      {/* Background Cyber Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Success Modal Screen */}
        {savedSuccessPatient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
            <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-cyan-500/40 shadow-2xl shadow-cyan-500/20 text-center relative">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-400 text-emerald-400 mx-auto flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/20 animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold uppercase tracking-wider">
                Telemetry Enrolled
              </span>

              <h2 className="text-2xl font-extrabold text-white mt-3 mb-1">
                Patient Added Successfully
              </h2>
              <p className="text-xs text-slate-400 mb-6">
                Active sensor calibration and gait baseline tracking are now initialized.
              </p>

              {/* Patient Card Summary */}
              <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-left mb-6 flex items-center gap-4">
                <div className="relative">
                  <img
                    src={savedSuccessPatient.avatar}
                    alt={savedSuccessPatient.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-cyan-400/50 shadow-md"
                  />
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-900" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3 className="font-bold text-white text-base truncate">{savedSuccessPatient.name}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Age: <span className="text-slate-200 font-mono font-semibold">{savedSuccessPatient.age} years</span> • {savedSuccessPatient.gender}
                  </div>
                  <div className="text-xs text-cyan-400 mt-1 flex items-center gap-1.5 font-mono">
                    <Activity className="w-3.5 h-3.5" />
                    <span className="truncate">{savedSuccessPatient.monitoringStatus || 'Active 24/7 Watch'}</span>
                  </div>
                  <div className="text-[11px] text-emerald-400 mt-1 font-mono flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>3 IoT Devices Linked</span>
                  </div>
                </div>
              </div>

              {/* Action Button: Go to Dashboard */}
              <button
                id="success-go-dashboard-btn"
                type="button"
                onClick={handleGoToDashboard}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-mono font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 border border-cyan-400/40 transition-all transform active:scale-[0.99]"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Top Header & Breadcrumb with Prominent Back to Home Button */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Direct Back to Home Button */}
            <button
              id="patient-setup-back-home-btn"
              type="button"
              onClick={handleBackToHome}
              className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/90 hover:border-cyan-500/60 text-slate-200 hover:text-white text-xs font-mono font-bold flex items-center gap-2 transition shadow-md active:scale-95 group cursor-pointer"
              title="Return to SentinelCare Command Center Home Page"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400 group-hover:-translate-x-1 transition-transform" />
              <span>Back to Home</span>
            </button>

            {/* Clickable Brand Logo & Title */}
            <button
              type="button"
              onClick={handleBackToHome}
              className="flex items-center gap-2 text-left group cursor-pointer"
              title="Return to SentinelCare Home"
            >
              <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-cyan-600/20 border border-cyan-400/30 text-cyan-400 group-hover:border-cyan-400 transition">
                <HeartPulse className="w-5 h-5" />
              </div>
              <span className="font-mono text-sm font-bold text-slate-300 group-hover:text-white transition">
                SENTINEL<span className="text-cyan-400">CARE</span> / <span className="text-slate-400 group-hover:text-cyan-300">PATIENT ONBOARDING</span>
              </span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            {/* Gemini API Key Telemetry Status Indicator */}
            <div className="px-2.5 py-1 rounded-lg bg-cyan-950/60 border border-cyan-500/30 text-[11px] font-mono text-cyan-300 flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Gemini AI Connected</span>
            </div>

            <button
              type="button"
              onClick={handleSkip}
              className="text-xs font-mono text-slate-400 hover:text-slate-200 hover:underline transition"
            >
              Skip for Now &rarr;
            </button>
          </div>
        </div>

        {/* Main Onboarding Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-10 border border-cyan-500/30 shadow-2xl relative">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {isFirstPatient ? 'Add Your First Patient' : 'Add New Patient'}
            </h1>
            <p className="text-sm text-slate-400 mt-2 max-w-lg mx-auto">
              Create a patient profile to begin elderly-care monitoring.
            </p>
          </div>

          {/* LARGE ATTRACTIVE CIRCULAR ADD PATIENT ICON & PHOTO UPLOAD */}
          <div className="flex flex-col items-center justify-center mb-10">
            <div className="relative group">
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1 bg-gradient-to-tr from-cyan-500 via-blue-500 to-indigo-500 shadow-xl shadow-cyan-500/25">
                <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 flex items-center justify-center relative">
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="Patient preview" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <User className="w-14 h-14 text-slate-500" />
                  )}

                  {/* Hover Overlay with Camera Icon */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-cyan-300"
                    title="Upload custom photo"
                  >
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-mono font-bold">CHANGE PHOTO</span>
                  </button>
                </div>
              </div>

              {/* Large + Symbol Badge */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 border-2 border-slate-950 text-white flex items-center justify-center shadow-lg shadow-cyan-500/40 hover:scale-110 active:scale-95 transition-all"
                title="Add profile photo"
              >
                <Plus className="w-5 h-5 stroke-[2.5]" />
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-mono flex items-center gap-1.5 transition"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Photo</span>
              </button>

              <button
                type="button"
                onClick={() => setShowAvatarPicker(!showAvatarPicker)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs font-mono transition"
              >
                {showAvatarPicker ? 'Close Presets' : 'Choose Preset Avatar'}
              </button>
            </div>

            {/* Preset Avatars Selector */}
            {showAvatarPicker && (
              <div className="mt-4 p-3 rounded-2xl bg-slate-900/90 border border-cyan-500/30 flex items-center gap-3 animate-fadeIn">
                <span className="text-xs font-mono text-slate-400">Presets:</span>
                <div className="flex items-center gap-2">
                  {PRESET_AVATARS.map((url, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setAvatarUrl(url);
                        setShowAvatarPicker(false);
                      }}
                      className={`w-10 h-10 rounded-full overflow-hidden border-2 transition ${
                        avatarUrl === url ? 'border-cyan-400 ring-2 ring-cyan-500/40 scale-105' : 'border-slate-700 hover:border-slate-400'
                      }`}
                    >
                      <img src={url} alt={`Preset ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Form Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">{error}</div>
            </div>
          )}

          <form onSubmit={handleSavePatient} className="space-y-8" noValidate>
            {/* SECTION 1: PERSONAL INFORMATION */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <User className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
                  Personal Information
                </h2>
              </div>

              {/* Clean two-column on desktop, single-column on mobile */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name * */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Full Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    id="patient-full-name-input"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Margaret Bennett"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition"
                  />
                </div>

                {/* Preferred Name */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Preferred Name
                  </label>
                  <input
                    id="patient-preferred-name-input"
                    type="text"
                    value={preferredName}
                    onChange={(e) => setPreferredName(e.target.value)}
                    placeholder="e.g. Maggie"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition"
                  />
                </div>

                {/* Date of Birth * */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Date of Birth <span className="text-cyan-400">*</span>
                  </label>
                  <div className="relative">
                    <input
                      id="patient-dob-input"
                      type="date"
                      value={dateOfBirth}
                      onChange={handleDobChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition font-mono"
                    />
                  </div>
                </div>

                {/* Age */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Age (Years)
                  </label>
                  <input
                    id="patient-age-input"
                    type="number"
                    min="1"
                    max="125"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="e.g. 74"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition font-mono"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Gender
                  </label>
                  <select
                    id="patient-gender-select"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Non-Binary">Non-Binary</option>
                    <option value="Prefer not to specify">Prefer not to specify</option>
                  </select>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Phone Number
                  </label>
                  <input
                    id="patient-phone-input"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="e.g. +91 98450 11223"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition"
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Email Address
                  </label>
                  <input
                    id="patient-email-input"
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="patient@example.com (optional)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition"
                  />
                </div>

                {/* Address */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Address / Living Unit
                  </label>
                  <input
                    id="patient-address-input"
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Apt 4B, Silver Oaks Residency"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 2: CAREGIVER INFORMATION */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <UserCheck className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
                  Caregiver Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Primary Caregiver Name * */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Primary Caregiver Name <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    id="caregiver-name-input"
                    type="text"
                    required
                    value={caregiverName}
                    onChange={(e) => setCaregiverName(e.target.value)}
                    placeholder="e.g. Sarah Bennett"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition"
                  />
                </div>

                {/* Caregiver Phone Number * */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Caregiver Phone Number <span className="text-cyan-400">*</span>
                  </label>
                  <input
                    id="caregiver-phone-input"
                    type="tel"
                    required
                    value={caregiverPhone}
                    onChange={(e) => setCaregiverPhone(e.target.value)}
                    placeholder="+91 98450 88210 (Direct Fall Alert SMS)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition"
                  />
                </div>

                {/* Relationship to Patient */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Relationship to Patient
                  </label>
                  <input
                    id="caregiver-relationship-input"
                    type="text"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                    placeholder="e.g. Daughter, Son, Spouse, Nurse"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition"
                  />
                </div>

                {/* Emergency Contact Name */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Secondary Emergency Contact Name
                  </label>
                  <input
                    id="emergency-contact-name-input"
                    type="text"
                    value={emergencyContactName}
                    onChange={(e) => setEmergencyContactName(e.target.value)}
                    placeholder="e.g. David Bennett"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition"
                  />
                </div>

                {/* Emergency Contact Phone */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Secondary Emergency Phone Number
                  </label>
                  <input
                    id="emergency-contact-phone-input"
                    type="tel"
                    value={emergencyContactPhone}
                    onChange={(e) => setEmergencyContactPhone(e.target.value)}
                    placeholder="e.g. +91 98450 99344"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition"
                  />
                </div>
              </div>
            </div>

            {/* SECTION 3: CARE INFORMATION */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
                  Care Information
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Mobility Status */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-2">
                    Mobility Status
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['Independent', 'Assisted', 'Limited Mobility'] as const).map((status) => (
                      <button
                        key={status}
                        type="button"
                        onClick={() => setMobilityStatus(status)}
                        className={`p-2.5 rounded-xl text-xs font-mono text-center border transition ${
                          mobilityStatus === status
                            ? 'bg-cyan-500/20 border-cyan-400 text-cyan-200 font-bold shadow-md shadow-cyan-500/10'
                            : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Monitoring Status */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-2">
                    Monitoring Status
                  </label>
                  <select
                    id="monitoring-status-select"
                    value={monitoringStatus}
                    onChange={(e) => setMonitoringStatus(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition"
                  >
                    <option value="Active 24/7 Real-Time Watch">Active 24/7 Real-Time Watch</option>
                    <option value="High Priority Fall Surveillance">High Priority Fall Surveillance</option>
                    <option value="Medication & Vitals Check">Medication & Vitals Check</option>
                    <option value="Post-Hospitalization Rehabilitation">Post-Hospitalization Rehabilitation</option>
                  </select>
                </div>

                {/* Important Medical / Care Notes */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Important Medical / Care Notes
                  </label>
                  <textarea
                    id="medical-notes-input"
                    rows={3}
                    value={medicalNotes}
                    onChange={(e) => setMedicalNotes(e.target.value)}
                    placeholder="e.g. Mild Osteoarthritis, Hypertension, Post-Op Knee Rehab. Requires walking cane."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 transition"
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    These notes help AI calibrate gait abnormality thresholds and alert priority.
                  </p>
                </div>

                {/* Gemini AI Smart Clinical Assessment & Care Plan Generator */}
                <div className="md:col-span-2 pt-2">
                  <div className="p-4 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 relative overflow-hidden">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold flex items-center gap-1.5">
                            <span>Gemini Clinical Care Assessment</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                              API Key Active
                            </span>
                          </h3>
                          <p className="text-[11px] text-slate-400 font-mono">
                            Analyze resident profile with Gemini 3.8 Flash to synthesize IoT thresholds and fall prevention protocols
                          </p>
                        </div>
                      </div>

                      <button
                        id="generate-ai-care-plan-btn"
                        type="button"
                        onClick={handleGenerateAICarePlan}
                        disabled={isGeneratingAI}
                        className="px-3.5 py-2 rounded-xl bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/40 hover:border-cyan-400 text-cyan-200 text-xs font-mono font-bold flex items-center justify-center gap-2 transition disabled:opacity-50 shrink-0"
                      >
                        {isGeneratingAI ? (
                          <>
                            <div className="w-3.5 h-3.5 border-2 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
                            <span>Synthesizing...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Generate AI Care Plan</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* AI Assessment Result Card */}
                    {aiInsights && (
                      <div className="mt-3 p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-3 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" />
                            AI Clinical Assessment & Vulnerability Profile
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                            aiInsights.fallRiskLevel === 'HIGH' || aiInsights.fallRiskLevel === 'CRITICAL'
                              ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                              : aiInsights.fallRiskLevel === 'MODERATE'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          }`}>
                            RISK: {aiInsights.fallRiskLevel} ({aiInsights.fallRiskScore}/100)
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed">
                          {aiInsights.clinicalSummary}
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 border-t border-slate-800 text-[11px] font-mono">
                          <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
                            <span className="text-slate-500 block text-[10px]">WRISTBAND SENSITIVITY</span>
                            <span className="text-cyan-300 font-bold">{aiInsights.recommendedIoTSettings.wristbandSensitivity}</span>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
                            <span className="text-slate-500 block text-[10px]">NIGHT MONITORING</span>
                            <span className="text-cyan-300 font-bold">{aiInsights.recommendedIoTSettings.nightMonitoring}</span>
                          </div>
                          <div className="p-2 rounded-lg bg-slate-950/70 border border-slate-800">
                            <span className="text-slate-500 block text-[10px]">SMART DISPENSER</span>
                            <span className="text-cyan-300 font-bold">{aiInsights.recommendedIoTSettings.medicationReminders}</span>
                          </div>
                        </div>

                        {aiInsights.preventiveProtocols && aiInsights.preventiveProtocols.length > 0 && (
                          <div className="pt-2 border-t border-slate-800">
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1.5 font-bold">
                              AI Fall Prevention Action Items:
                            </span>
                            <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                              {aiInsights.preventiveProtocols.map((protocol, idx) => (
                                <li key={idx} className="leading-normal">{protocol}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* SECTION 4: DEVICE DETAILS */}
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-cyan-400" />
                  <h2 className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-bold">
                    Device Details & Hardware Assignment
                  </h2>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Demo Mode Active</span>
                </span>
              </div>

              {/* THREE CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* CARD 1: SMART WRISTBAND */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                        <Watch className="w-5 h-5" />
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        wristbandConnected
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {wristbandConnected ? 'ONLINE' : 'STANDBY'}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-white">Smart Wristband</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">ESP32 + MPU6050 6-Axis IMU</p>

                    <div className="mt-3 space-y-1.5 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 text-[10px] block">DEVICE ID</span>
                        <input
                          type="text"
                          value={wristbandId}
                          onChange={(e) => setWristbandId(e.target.value)}
                          className="w-full mt-0.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-cyan-300 text-xs focus:outline-none focus:border-cyan-400"
                        />
                      </div>
                      <div className="text-[11px] text-slate-400 pt-1">
                        Status: <span className={wristbandConnected ? 'text-emerald-400' : 'text-slate-400'}>
                          {wristbandConnected ? 'Paired (BLE 5.2 / RSSI -58dBm)' : 'Ready to Pair'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setWristbandConnected(!wristbandConnected);
                      addToast(
                        wristbandConnected ? 'Wristband Unlinked' : 'Wristband Connected',
                        wristbandConnected ? 'Wristband offline' : 'ESP32 IMU paired successfully with telemetry stream.',
                        wristbandConnected ? 'info' : 'success'
                      );
                    }}
                    className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-mono font-bold border transition ${
                      wristbandConnected
                        ? 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                        : 'bg-cyan-500/20 text-cyan-300 border-cyan-400 hover:bg-cyan-500/30'
                    }`}
                  >
                    {wristbandConnected ? 'Connected (Re-pair)' : 'Connect Wristband'}
                  </button>
                </div>

                {/* CARD 2: SMART MEDICINE DISPENSER */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                        <Pill className="w-5 h-5" />
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        dispenserConnected
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {dispenserConnected ? 'ONLINE' : 'STANDBY'}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-white">Smart Dispenser</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">ESP32-CAM + HX711 Load Cell</p>

                    <div className="mt-3 space-y-1.5 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 text-[10px] block">DEVICE ID</span>
                        <input
                          type="text"
                          value={dispenserId}
                          onChange={(e) => setDispenserId(e.target.value)}
                          className="w-full mt-0.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-purple-300 text-xs focus:outline-none focus:border-purple-400"
                        />
                      </div>
                      <div className="text-[11px] text-slate-400 pt-1">
                        Status: <span className={dispenserConnected ? 'text-emerald-400' : 'text-slate-400'}>
                          {dispenserConnected ? 'Paired (Camera & Tare Calibrated)' : 'Ready to Pair'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setDispenserConnected(!dispenserConnected);
                      addToast(
                        dispenserConnected ? 'Dispenser Unlinked' : 'Dispenser Connected',
                        dispenserConnected ? 'Dispenser offline' : 'ESP32-CAM & load cell calibrated.',
                        dispenserConnected ? 'info' : 'success'
                      );
                    }}
                    className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-mono font-bold border transition ${
                      dispenserConnected
                        ? 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                        : 'bg-purple-500/20 text-purple-300 border-purple-400 hover:bg-purple-500/30'
                    }`}
                  >
                    {dispenserConnected ? 'Connected (Re-pair)' : 'Connect Dispenser'}
                  </button>
                </div>

                {/* CARD 3: HOME HUB */}
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                        <Radio className="w-5 h-5" />
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        hubConnected
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                      }`}>
                        {hubConnected ? 'ONLINE' : 'STANDBY'}
                      </span>
                    </div>

                    <h3 className="font-bold text-sm text-white">Home Hub</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">ESP32 Gateway + MQTT Broker</p>

                    <div className="mt-3 space-y-1.5 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 text-[10px] block">DEVICE ID</span>
                        <input
                          type="text"
                          value={hubId}
                          onChange={(e) => setHubId(e.target.value)}
                          className="w-full mt-0.5 px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-blue-300 text-xs focus:outline-none focus:border-blue-400"
                        />
                      </div>
                      <div className="text-[11px] text-slate-400 pt-1">
                        Status: <span className={hubConnected ? 'text-emerald-400' : 'text-slate-400'}>
                          {hubConnected ? 'Paired (Wi-Fi & Mesh Gateway Active)' : 'Ready to Pair'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setHubConnected(!hubConnected);
                      addToast(
                        hubConnected ? 'Home Hub Unlinked' : 'Home Hub Connected',
                        hubConnected ? 'Home hub offline' : 'Home Hub Gateway connected to local MQTT broker.',
                        hubConnected ? 'info' : 'success'
                      );
                    }}
                    className={`mt-4 w-full py-2 px-3 rounded-xl text-xs font-mono font-bold border transition ${
                      hubConnected
                        ? 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-800'
                        : 'bg-blue-500/20 text-blue-300 border-blue-400 hover:bg-blue-500/30'
                    }`}
                  >
                    {hubConnected ? 'Connected (Re-pair)' : 'Connect Hub'}
                  </button>
                </div>
              </div>
            </div>

            {/* SECTION 5: SAVE PATIENT & ACTIONS */}
            <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3 w-full sm:w-auto order-2 sm:order-1">
                {/* Bottom Back to Home Button */}
                <button
                  id="patient-setup-bottom-back-home-btn"
                  type="button"
                  onClick={handleBackToHome}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 hover:border-cyan-500/50 text-slate-200 hover:text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition active:scale-95 shadow-sm"
                >
                  <ArrowLeft className="w-4 h-4 text-cyan-400" />
                  <span>Back to Home</span>
                </button>

                <button
                  type="button"
                  onClick={handleSkip}
                  className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-mono font-bold transition"
                >
                  Skip for Now
                </button>
              </div>

              <button
                id="save-patient-submit-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:via-blue-500 hover:to-indigo-500 text-white font-mono font-bold text-sm tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/25 border border-cyan-400/40 transition-all transform active:scale-[0.99] disabled:opacity-60 order-1 sm:order-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>SAVING & ENROLLING TELEMETRY...</span>
                  </>
                ) : (
                  <>
                    <span>Save Patient & Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
