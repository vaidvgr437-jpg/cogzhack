import { 
  ElderlyPerson, 
  MobilityMetrics, 
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
  currentMobilityScore: 32
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
    currentMobilityScore: 45
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
    currentMobilityScore: 58
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

export const INITIAL_ALERTS: AlertIncident[] = [
  {
    id: 'inc-01',
    title: 'Acute Fall Event & Deceleration Trigger',
    description: 'Sudden deceleration (3.42g) and horizontal orientation detected by wristband in Living Room near balcony threshold. Patient recovered posture within 12 seconds.',
    severity: 'critical',
    type: 'fall',
    timestamp: '2026-08-20T14:34:00',
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
    aiRecommendedResponse: {
      action: 'Initiate immediate 2-way audio prompt through Sentinel Hub. Verify posture stabilization and request vocal confirmation of comfort.',
      protocol: 'Acute Deceleration Protocol (Alpha-Fall Trigger > 3.0g)',
      priority: 'IMMEDIATE',
      targetTime: '< 30 seconds',
      steps: [
        'Sound 85dB alert pulse on wristband to assess resident awareness',
        'Open two-way intercom audio channel through Living Room Hub',
        'Confirm standing stability; if unacknowledged within 45s, escalate to emergency contact'
      ]
    },
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
    id: 'inc-fall-02',
    title: 'Bedside Nighttime Tilt & Sudden Stumble',
    description: '2.84g lateral acceleration spike recorded at 03:18 AM during transfer from bed to walking frame. Posture recovered after 8 seconds.',
    severity: 'warning',
    type: 'fall',
    timestamp: '2026-08-20T03:18:22',
    timeFormatted: '03:18 AM Today',
    location: 'Master Bedroom / Bedside',
    device: 'ESP32 Smart Wristband (MPU6050)',
    confidence: 89,
    sensorEvidence: {
      peakAccelerationG: 2.84,
      rotationRateDegS: 215,
      impactDurationMs: 95
    },
    caregiverResponse: 'Night caregiver dispatched; assisted resident back to bed safely.',
    aiRecommendedResponse: {
      action: 'Check nocturnal ambient lighting pathway and inspect bedside motion sensor calibration to eliminate low-light disorientation.',
      protocol: 'Nocturnal Sit-to-Stand Deviation Protocol (Night Transfer)',
      priority: 'HIGH',
      targetTime: '< 2 minutes',
      steps: [
        'Verify nightlight illumination along the pathway from bed to bathroom',
        'Confirm walking frame proximity within reach of bedside edge',
        'Review orthostatic blood pressure check with attending physician'
      ]
    },
    notificationStatus: 'Delivered (Night Alert Mode)',
    escalationStages: {
      buzzer: true,
      push: true,
      sms: false,
      call: false
    },
    isResolved: true,
    resolvedAt: '03:24 AM'
  },
  {
    id: 'inc-fall-03',
    title: 'Bathroom Wet Zone Slip & Grip Bar Catch',
    description: '3.15g rotational angular velocity spike with rapid vertical axis displacement. Resident grabbed grab bar, preventing full recumbent impact.',
    severity: 'warning',
    type: 'fall',
    timestamp: '2026-08-19T18:45:00',
    timeFormatted: 'Yesterday 06:45 PM',
    location: 'Bathroom / Shower Entrance',
    device: 'ESP32 Smart Wristband (MPU6050)',
    confidence: 91,
    sensorEvidence: {
      peakAccelerationG: 3.15,
      rotationRateDegS: 260,
      impactDurationMs: 120
    },
    caregiverResponse: 'Checked resident condition. Floor dried and non-slip rubber mat repositioned.',
    aiRecommendedResponse: {
      action: 'Inspect bathroom moisture barrier, ensure non-slip textured mat is firmly anchored, and evaluate anti-skid socks.',
      protocol: 'Wet Zone Slip Mitigation Protocol (Bathroom)',
      priority: 'HIGH',
      targetTime: '< 5 minutes',
      steps: [
        'Inspect suction grip on bathroom anti-slip safety mat',
        'Check resident footwear traction suitability',
        'Log event to physical therapy fall risk assessment record'
      ]
    },
    notificationStatus: 'Delivered (Push + Caregiver Log)',
    escalationStages: {
      buzzer: true,
      push: true,
      sms: false,
      call: false
    },
    isResolved: true,
    resolvedAt: 'Yesterday 06:52 PM'
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
