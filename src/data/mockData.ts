import { 
  ElderlyPerson, 
  MobilityMetrics, 
  MedicationCompartment, 
  AlertIncident, 
  IoTDevice, 
  RecentEvent 
} from '../types';

export const PRIMARY_PATIENT: ElderlyPerson = {
  id: 'patient-01',
  name: 'Meena Rao',
  age: 72,
  gender: 'Female',
  room: 'Apt 4B - Silver Oaks Residency',
  avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
  emergencyContact: {
    name: 'Ananya Rao',
    relationship: 'Daughter',
    phone: '+91 98450 12890'
  },
  primaryDoctor: 'Dr. Srinivas Murthy (Geriatrician)',
  medicalConditions: ['Mild Osteoarthritis', 'Hypertension', 'Post-Op Knee Rehab (2025)'],
  baselineMobilityScore: 28,
  currentMobilityScore: 32,
  medicationAdherence: 94
};

export const PATIENTS_LIST: ElderlyPerson[] = [
  PRIMARY_PATIENT,
  {
    id: 'patient-02',
    name: 'Devaki Sharma',
    age: 78,
    gender: 'Female',
    room: 'Apt 2A - Green Glen',
    avatar: 'https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?w=150&auto=format&fit=crop&q=80',
    emergencyContact: {
      name: 'Vikram Sharma',
      relationship: 'Son',
      phone: '+91 98711 44521'
    },
    primaryDoctor: 'Dr. Priya Sen',
    medicalConditions: ['Type 2 Diabetes', 'Mild Parkinsonism'],
    baselineMobilityScore: 42,
    currentMobilityScore: 45,
    medicationAdherence: 91
  },
  {
    id: 'patient-03',
    name: 'Ramesh Patel',
    age: 81,
    gender: 'Male',
    room: 'Villa 12 - Palm Meadows',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    emergencyContact: {
      name: 'Rohan Patel',
      relationship: 'Son',
      phone: '+91 99201 88345'
    },
    primaryDoctor: 'Dr. Arvind Joshi',
    medicalConditions: ['Cardiac Pacemaker', 'History of Syncope'],
    baselineMobilityScore: 50,
    currentMobilityScore: 58,
    medicationAdherence: 88
  }
];

export const INITIAL_MOBILITY_METRICS: MobilityMetrics = {
  riskScore: 32,
  riskLevel: 'Low Risk',
  stepCadence: 84,
  strideVariability: 8.4,
  dailySteps: 4826,
  dailyStepGoal: 5000,
  activityDurationMinutes: 252, // 4h 12m
  sitToStandCount: 11,
  mobilityTrend: 'Stable',
  aiConfidence: 91,
  lastAssessmentTime: '10:45 AM today'
};

export const INITIAL_MEDICATIONS: MedicationCompartment[] = [
  {
    id: 'med-01',
    name: 'Paracetamol & Telmisartan',
    dosage: '650mg + 40mg',
    scheduledTime: '08:00 AM',
    timeWindow: '07:30 AM - 08:30 AM',
    status: 'verified',
    verificationMethod: 'Camera + Weight',
    cameraConfidence: 98.4,
    expectedWeightGrams: 0.52,
    observedWeightGrams: 0.49,
    compartmentIndex: 1,
    instructions: 'Take with warm water after breakfast',
    pillColor: '#38bdf8',
    verifiedAt: '08:04 AM'
  },
  {
    id: 'med-02',
    name: 'Vitamin D3 & Calcium',
    dosage: '60k IU / 500mg',
    scheduledTime: '01:00 PM',
    timeWindow: '12:30 PM - 01:30 PM',
    status: 'pending',
    verificationMethod: 'Pending',
    cameraConfidence: 0,
    expectedWeightGrams: 0.75,
    observedWeightGrams: 0.00,
    compartmentIndex: 2,
    instructions: 'Take post-lunch with milk or water',
    pillColor: '#fbbf24'
  },
  {
    id: 'med-03',
    name: 'Atorvastatin & Aspirin',
    dosage: '10mg + 75mg',
    scheduledTime: '08:00 PM',
    timeWindow: '07:30 PM - 08:30 PM',
    status: 'verified',
    verificationMethod: 'Camera + Weight',
    cameraConfidence: 96.8,
    expectedWeightGrams: 0.38,
    observedWeightGrams: 0.37,
    compartmentIndex: 3,
    instructions: 'Take before sleep',
    pillColor: '#34d399',
    verifiedAt: 'Yesterday 08:02 PM'
  },
  {
    id: 'med-04',
    name: 'Glucosamine Sulfate',
    dosage: '500mg',
    scheduledTime: '10:00 PM',
    timeWindow: '09:30 PM - 10:30 PM',
    status: 'verified',
    verificationMethod: 'Camera + Weight',
    cameraConfidence: 97.2,
    expectedWeightGrams: 0.60,
    observedWeightGrams: 0.59,
    compartmentIndex: 4,
    instructions: 'Joint health supplement',
    pillColor: '#a78bfa',
    verifiedAt: 'Yesterday 09:58 PM'
  }
];

export const INITIAL_ALERTS: AlertIncident[] = [
  {
    id: 'inc-01',
    title: 'Possible fall event detected & safely stabilized',
    description: 'Sudden deceleration (3.4g) and horizontal orientation detected by wristband in Living Room near balcony threshold. Patient recovered posture within 12 seconds.',
    severity: 'critical',
    type: 'fall',
    timestamp: '2026-08-20T02:34:00',
    timeFormatted: '02:34 PM Today',
    location: 'Living Room / Balcony Threshold',
    device: 'ESP32 Smart Wristband (MPU6050)',
    confidence: 94,
    sensorEvidence: {
      peakAccelerationG: 3.42,
      rotationRateDegS: 284,
      impactDurationMs: 140,
      snapshotUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop&q=80'
    },
    caregiverResponse: 'Caregiver contacted via phone. Patient confirmed stumbling slightly on rug, uninjured.',
    notificationStatus: 'Delivered (Push + SMS)',
    escalationStages: {
      buzzer: true,
      push: true,
      sms: true,
      call: false
    },
    isResolved: false,
    notes: 'Suggested removing small accent rug near living room entrance.'
  },
  {
    id: 'inc-02',
    title: 'Subtle gait cadence deceleration & asymmetry',
    description: 'AI model observed 14% increase in stride variability and 8s delay in sit-to-stand transition over the past 48 hours.',
    severity: 'warning',
    type: 'mobility',
    timestamp: '2026-08-20T11:42:00',
    timeFormatted: '11:42 AM Today',
    location: 'Hallway / Bedroom Transition',
    device: 'AI Mobility Engine v3.2',
    confidence: 88,
    sensorEvidence: {
      peakAccelerationG: 1.15,
      rotationRateDegS: 42,
      impactDurationMs: 0
    },
    caregiverResponse: 'Marked for observation during evening physical therapy check.',
    notificationStatus: 'Delivered (In-App Digest)',
    escalationStages: {
      buzzer: false,
      push: true,
      sms: false,
      call: false
    },
    isResolved: false
  },
  {
    id: 'inc-03',
    title: 'Medication dose verified successfully',
    description: 'Morning Paracetamol + Telmisartan dispensed and verified via ESP32-CAM optical shape matching and HX711 0.49g weight verification.',
    severity: 'resolved',
    type: 'medication',
    timestamp: '2026-08-20T08:04:12',
    timeFormatted: '08:04 AM Today',
    location: 'Smart Dispenser Station (Kitchen)',
    device: 'ESP32-CAM Smart Dispenser',
    confidence: 98,
    sensorEvidence: {
      peakAccelerationG: 0,
      rotationRateDegS: 0,
      impactDurationMs: 0,
      weightDeltaG: 0.49
    },
    caregiverResponse: 'System Auto-Verified',
    notificationStatus: 'Logged',
    escalationStages: {
      buzzer: false,
      push: false,
      sms: false,
      call: false
    },
    isResolved: true,
    resolvedAt: '08:04 AM'
  },
  {
    id: 'inc-04',
    title: 'Scheduled afternoon dose verification window open',
    description: 'Vitamin D3 & Calcium ready in Compartment 2.',
    severity: 'info',
    type: 'medication',
    timestamp: '2026-08-19T13:00:00',
    timeFormatted: 'Yesterday 01:00 PM',
    location: 'Smart Dispenser Station',
    device: 'ESP32-CAM Smart Dispenser',
    confidence: 96,
    sensorEvidence: {
      peakAccelerationG: 0,
      rotationRateDegS: 0,
      impactDurationMs: 0,
      weightDeltaG: 0.74
    },
    caregiverResponse: 'Dispensed on schedule',
    notificationStatus: 'Delivered',
    escalationStages: {
      buzzer: false,
      push: true,
      sms: false,
      call: false
    },
    isResolved: true,
    resolvedAt: 'Yesterday 01:06 PM'
  }
];

export const INITIAL_DEVICES: IoTDevice[] = [
  {
    id: 'dev-01',
    name: 'Smart Wristband Sentinel-W1',
    type: 'wristband',
    model: 'ESP32-S3 + MPU6050 6-Axis IMU + PPG',
    status: 'online',
    battery: 87,
    signalStrength: 94,
    lastSync: '10 seconds ago',
    ipAddress: '192.168.1.142 (BLE Bridge)',
    macAddress: 'E4:65:B8:21:49:10',
    firmwareVersion: 'v2.4.1-rc3',
    diagnostics: {
      sensorHealth: 'Optimal',
      networkLatencyMs: 14,
      packetLossPct: 0.1
    }
  },
  {
    id: 'dev-02',
    name: 'Smart Medicine Dispenser RX-3',
    type: 'dispenser',
    model: 'ESP32-CAM + HX711 Load Cell + MG996R Servo',
    status: 'online',
    battery: 100, // AC Powered
    signalStrength: 98,
    lastSync: '2 minutes ago',
    ipAddress: '192.168.1.145',
    macAddress: '3C:71:BF:88:12:0A',
    firmwareVersion: 'v1.9.0',
    diagnostics: {
      sensorHealth: 'Optimal',
      cameraHealth: 'Optimal',
      loadCellHealth: 'Optimal',
      servoHealth: 'Optimal',
      networkLatencyMs: 18,
      packetLossPct: 0.0
    }
  },
  {
    id: 'dev-03',
    name: 'SentinelCare Home Hub Gateway',
    type: 'hub',
    model: 'Dual-Band BLE 5.2 / Wi-Fi 6 Edge Gateway',
    status: 'online',
    battery: 100,
    signalStrength: 100,
    lastSync: 'Continuous Live Stream',
    ipAddress: '192.168.1.1',
    macAddress: 'A0:B7:65:CC:EE:01',
    firmwareVersion: 'v3.1.2-edge',
    diagnostics: {
      sensorHealth: 'Optimal',
      networkLatencyMs: 8,
      packetLossPct: 0.0
    }
  }
];

export const INITIAL_RECENT_EVENTS: RecentEvent[] = [
  {
    id: 'ev-1',
    time: '10:42 AM',
    title: 'Medication verified via dual camera & load cell',
    type: 'medication',
    icon: 'Pill',
    badgeColor: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
  },
  {
    id: 'ev-2',
    time: '10:15 AM',
    title: 'Normal walking session in living corridor (84 steps/min)',
    type: 'movement',
    icon: 'Footprints',
    badgeColor: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20'
  },
  {
    id: 'ev-3',
    time: '09:30 AM',
    title: 'Morning wake-up & sit-to-stand posture transition',
    type: 'movement',
    icon: 'Activity',
    badgeColor: 'text-blue-400 bg-blue-500/10 border-blue-500/20'
  },
  {
    id: 'ev-4',
    time: '08:00 AM',
    title: 'Morning medication reminder chime acknowledged',
    type: 'medication',
    icon: 'Bell',
    badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/20'
  },
  {
    id: 'ev-5',
    time: '07:15 AM',
    title: 'Wristband synced 7.4 hrs restful sleep cycle',
    type: 'system',
    icon: 'Moon',
    badgeColor: 'text-purple-400 bg-purple-500/10 border-purple-500/20'
  }
];

// 30-day historical time-series data for mobility & baseline
export const generateMobilityTimeSeries = (days: number = 30) => {
  const data = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    
    // baseline is around 28-30
    const baseline = 28 + Math.sin(i * 0.1) * 1.5;
    
    // current trajectory: normal around 30-34, slight rise on last 4 days for demo flexibility
    const variation = Math.sin(i * 0.35) * 4 + (Math.random() * 2 - 1);
    const score = Math.round(baseline + 3 + variation);
    const steps = Math.round(4400 + Math.sin(i * 0.4) * 600 + Math.random() * 300);
    const cadence = Math.round(82 + Math.sin(i * 0.2) * 5);
    const variability = +(7.8 + Math.abs(Math.sin(i * 0.3) * 1.4)).toFixed(1);
    const sitToStand = Math.round(11 + (Math.random() * 3 - 1.5));
    
    // predicted trajectory for future projections
    const predicted = Math.round(baseline + 2 + Math.cos(i * 0.2) * 2);

    data.push({
      date: dateStr,
      baseline: Math.round(baseline),
      current: score,
      predicted: predicted,
      steps: steps,
      cadence: cadence,
      variability: variability,
      sitToStand: sitToStand
    });
  }
  return data;
};

export const WEEKLY_MEDICATION_DATA = [
  { day: 'Mon', scheduled: 4, verified: 4, rate: 100 },
  { day: 'Tue', scheduled: 4, verified: 4, rate: 100 },
  { day: 'Wed', scheduled: 4, verified: 3, rate: 75 },
  { day: 'Thu', scheduled: 4, verified: 4, rate: 100 },
  { day: 'Fri', scheduled: 4, verified: 4, rate: 100 },
  { day: 'Sat', scheduled: 4, verified: 4, rate: 100 },
  { day: 'Sun', scheduled: 4, verified: 4, rate: 100 },
];
