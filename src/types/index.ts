export type Severity = 'critical' | 'warning' | 'resolved' | 'info';
export type IncidentType = 'fall' | 'mobility' | 'device';
export type DeviceType = 'wristband' | 'hub' | 'cloud' | 'backend';
export type ConnectionStatus = 'online' | 'offline' | 'warning' | 'syncing';
export type DemoScenario = 'normal' | 'mobility_decline' | 'fall_detection' | 'device_offline';
export type NavigationTab = 'overview' | 'monitoring' | 'mobility' | 'alerts' | 'devices';

export interface ElderlyPerson {
  id: string;
  name: string;
  preferredName?: string;
  dateOfBirth?: string;
  age: number;
  gender: string;
  room: string;
  avatar: string;
  phoneNumber?: string;
  emailAddress?: string;
  address?: string;
  primaryCaregiver?: {
    name: string;
    phone: string;
    relationship?: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  primaryDoctor: string;
  medicalConditions: string[];
  mobilityStatus?: 'Independent' | 'Assisted' | 'Limited Mobility';
  careNotes?: string;
  monitoringStatus?: string;
  connectedDevices?: {
    wristbandId?: string;
    wristbandConnected?: boolean;
    hubId?: string;
    hubConnected?: boolean;
  };
  baselineMobilityScore: number;
  currentMobilityScore: number;
}

export interface MobilityMetrics {
  riskScore: number; // 0-100 (lower is better, <40 Low, 40-70 Moderate, >70 High)
  riskLevel: 'Low Risk' | 'Moderate Risk' | 'High Risk';
  stepCadence: number; // steps/min
  strideVariability: number; // %
  dailySteps: number;
  dailyStepGoal: number;
  activityDurationMinutes: number;
  sitToStandCount: number;
  mobilityTrend: 'Improving' | 'Stable' | 'Minor Decline' | 'Critical Decline';
  aiConfidence: number; // %
  lastAssessmentTime: string;
}

export interface SensorTelemetry {
  timestamp: number;
  accX: number;
  accY: number;
  accZ: number;
  gyroX: number;
  gyroY: number;
  gyroZ: number;
  intensity: number; // 0-100
  gaitState: 'WALKING' | 'STANDING' | 'SITTING' | 'RESTING' | 'FALL_DETECTED';
  heartRate: number; // bpm
  batteryLevel: number;
  rssi: number; // dBm
}

export interface AlertIncident {
  id: string;
  title: string;
  description: string;
  severity: Severity;
  type: IncidentType;
  timestamp: string;
  timeFormatted: string;
  location: string;
  device: string;
  confidence: number;
  sensorEvidence: {
    peakAccelerationG: number;
    rotationRateDegS: number;
    impactDurationMs: number;
    snapshotUrl?: string;
  };
  caregiverResponse: string;
  aiRecommendedResponse?: {
    action: string;
    protocol: string;
    priority: 'IMMEDIATE' | 'HIGH' | 'MODERATE' | 'STANDARD';
    targetTime: string;
    steps?: string[];
  };
  notificationStatus: string;
  escalationStages: {
    buzzer: boolean;
    push: boolean;
    sms: boolean;
    call: boolean;
  };
  isResolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
  notes?: string;
}

export interface IoTDevice {
  id: string;
  name: string;
  type: DeviceType;
  model: string;
  status: ConnectionStatus;
  battery: number;
  signalStrength: number; // 0-100%
  lastSync: string;
  ipAddress: string;
  macAddress: string;
  firmwareVersion: string;
  diagnostics: {
    sensorHealth: 'Optimal' | 'Degraded' | 'Error';
    networkLatencyMs: number;
    packetLossPct: number;
  };
}

export interface RecentEvent {
  id: string;
  time: string;
  title: string;
  type: 'movement' | 'alert' | 'system';
  icon: string;
  badgeColor: string;
}

export interface EmergencyDispatchConfig {
  mobileNumber: string;
  contactName: string;
  relation: string;
  countryCode: string;
  pushEnabled: boolean;
  smsEnabled: boolean;
  callEnabled: boolean;
  // Escalation timing delays (in seconds) for Fall Event Mode
  pushDelaySeconds: number; // e.g. 0 (instant)
  smsDelaySeconds: number;  // e.g. 10 (dispatches SMS at 10s)
  callDelaySeconds: number; // e.g. 25 (initiates phone call at 25s)
  autoCallVoice: boolean;   // Text-to-speech voice read-out on call
}

export interface DispatchedSms {
  id: string;
  timestamp: string;
  recipientNumber: string;
  recipientName: string;
  message: string;
  status: 'SENT' | 'DELIVERED' | 'ACKNOWLEDGED';
  incidentId?: string;
  peakAccelerationG?: number;
  location?: string;
}

export interface ActiveCallState {
  status: 'idle' | 'calling' | 'connected' | 'ended';
  caller: string;
  recipientNumber: string;
  recipientName: string;
  startedAt?: number;
  durationSeconds: number;
  speechTranscript: string;
  isMuted: boolean;
  residentName: string;
  location: string;
  peakG: number;
}
