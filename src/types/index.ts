export type Severity = 'critical' | 'warning' | 'resolved' | 'info';
export type IncidentType = 'fall' | 'mobility' | 'medication' | 'device';
export type DeviceType = 'wristband' | 'dispenser' | 'hub' | 'cloud' | 'backend';
export type ConnectionStatus = 'online' | 'offline' | 'warning' | 'syncing';
export type DemoScenario = 'normal' | 'mobility_decline' | 'fall_detection' | 'missed_medication' | 'device_offline';
export type NavigationTab = 'overview' | 'monitoring' | 'mobility' | 'medication' | 'alerts' | 'devices';

export interface ElderlyPerson {
  id: string;
  name: string;
  age: number;
  gender: string;
  room: string;
  avatar: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  primaryDoctor: string;
  medicalConditions: string[];
  baselineMobilityScore: number;
  currentMobilityScore: number;
  medicationAdherence: number;
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

export interface MedicationCompartment {
  id: string;
  name: string;
  dosage: string;
  scheduledTime: string; // e.g. '08:00 AM'
  timeWindow: string; // e.g. '07:30 - 08:30 AM'
  status: 'verified' | 'pending' | 'missed' | 'dispensed';
  verificationMethod: 'Camera + Weight' | 'Camera Only' | 'Weight Only' | 'Pending';
  cameraConfidence: number; // %
  expectedWeightGrams: number;
  observedWeightGrams: number;
  compartmentIndex: number; // 1 to 4
  instructions: string;
  pillColor: string;
  verifiedAt?: string;
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
    weightDeltaG?: number;
    snapshotUrl?: string;
  };
  caregiverResponse: string;
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
    cameraHealth?: 'Optimal' | 'Degraded' | 'Error';
    loadCellHealth?: 'Optimal' | 'Degraded' | 'Error';
    servoHealth?: 'Optimal' | 'Degraded' | 'Error';
    networkLatencyMs: number;
    packetLossPct: number;
  };
}

export interface RecentEvent {
  id: string;
  time: string;
  title: string;
  type: 'medication' | 'movement' | 'alert' | 'system';
  icon: string;
  badgeColor: string;
}
