import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { 
  ElderlyPerson, 
  MobilityMetrics, 
  MedicationCompartment, 
  AlertIncident, 
  IoTDevice, 
  RecentEvent,
  SensorTelemetry,
  DemoScenario,
  NavigationTab,
  Severity
} from '../types';
import { 
  PRIMARY_PATIENT, 
  PATIENTS_LIST, 
  INITIAL_MOBILITY_METRICS, 
  INITIAL_MEDICATIONS, 
  INITIAL_ALERTS, 
  INITIAL_DEVICES, 
  INITIAL_RECENT_EVENTS 
} from '../data/mockData';

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: number;
}

interface DashboardContextType {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  selectedPatient: ElderlyPerson;
  setSelectedPatient: (patient: ElderlyPerson) => void;
  patientsList: ElderlyPerson[];
  setPatientsList: React.Dispatch<React.SetStateAction<ElderlyPerson[]>>;
  addPatient: (patient: ElderlyPerson) => void;
  removePatient: (patientId: string) => void;
  patientToDelete: ElderlyPerson | null;
  setPatientToDelete: (patient: ElderlyPerson | null) => void;
  openDeletePatientModal: (patient: ElderlyPerson) => void;
  closeDeletePatientModal: () => void;

  // Routing
  currentRoute: string;
  navigateTo: (route: string) => void;
  
  // Scenario
  activeScenario: DemoScenario;
  setScenario: (scenario: DemoScenario) => void;
  
  // Metrics & State
  mobilityMetrics: MobilityMetrics;
  medications: MedicationCompartment[];
  alerts: AlertIncident[];
  devices: IoTDevice[];
  recentEvents: RecentEvent[];
  telemetry: SensorTelemetry;
  telemetryHistory: SensorTelemetry[];
  
  // Interactive actions
  verifyMedication: (id: string) => void;
  resolveAlert: (id: string, notes?: string) => void;
  simulateFallEvent: () => void;
  cancelEmergency: () => void;
  
  // Emergency State
  isEmergencyActive: boolean;
  emergencyTimer: number; // seconds elapsed
  isBuzzerActive: boolean;
  toggleBuzzer: () => void;
  
  // Selected Details Slideover
  selectedIncident: AlertIncident | null;
  setSelectedIncident: (incident: AlertIncident | null) => void;
  
  // Modals & Popovers
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isNotificationCenterOpen: boolean;
  setIsNotificationCenterOpen: (open: boolean) => void;

  // Authentication
  isAuthenticated: boolean;
  currentUser: string | null;
  currentUserEmail: string | null;
  login: (emailOrUsername: string, password: string) => boolean;
  signup: (fullName: string, email: string, phone: string, password: string) => boolean;
  logout: () => void;
  
  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
  
  // Clock / System Sync
  systemTime: string;
  lastSyncSecondsAgo: number;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavigationTab>('overview');
  
  // Persistent Patients List
  const [patientsList, setPatientsList] = useState<ElderlyPerson[]>(() => {
    try {
      const saved = localStorage.getItem('sentinel_patients');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return PATIENTS_LIST;
  });

  const [selectedPatient, setSelectedPatient] = useState<ElderlyPerson>(() => {
    try {
      const saved = localStorage.getItem('sentinel_patients');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      }
    } catch (e) {
      console.error(e);
    }
    return PRIMARY_PATIENT;
  });

  const [activeScenario, setActiveScenario] = useState<DemoScenario>('normal');
  
  const [mobilityMetrics, setMobilityMetrics] = useState<MobilityMetrics>(INITIAL_MOBILITY_METRICS);
  const [medications, setMedications] = useState<MedicationCompartment[]>(INITIAL_MEDICATIONS);
  const [alerts, setAlerts] = useState<AlertIncident[]>(INITIAL_ALERTS);
  const [devices, setDevices] = useState<IoTDevice[]>(INITIAL_DEVICES);
  const [recentEvents, setRecentEvents] = useState<RecentEvent[]>(INITIAL_RECENT_EVENTS);
  
  // Emergency Fall status
  const [isEmergencyActive, setIsEmergencyActive] = useState<boolean>(false);
  const [emergencyTimer, setEmergencyTimer] = useState<number>(0);
  const [isBuzzerActive, setIsBuzzerActive] = useState<boolean>(false);
  
  // Modals & Panels
  const [selectedIncident, setSelectedIncident] = useState<AlertIncident | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isNotificationCenterOpen, setIsNotificationCenterOpen] = useState<boolean>(false);
  
  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const newToast: ToastMessage = {
      id: 'toast-' + Math.random().toString(36).substr(2, 9),
      title,
      message,
      type,
      timestamp: Date.now()
    };
    setToasts(prev => [newToast, ...prev.slice(0, 4)]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== newToast.id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);
  
  // Authentication State (Default: check localStorage)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('sentinel_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState<string | null>(() => {
    try {
      return localStorage.getItem('sentinel_user') || (localStorage.getItem('sentinel_auth') === 'true' ? 'Rahul Verma' : null);
    } catch {
      return null;
    }
  });

  const [currentUserEmail, setCurrentUserEmail] = useState<string | null>(() => {
    try {
      return localStorage.getItem('sentinel_user_email') || null;
    } catch {
      return null;
    }
  });

  // Routing State
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      if (path === '/patient/setup' || path === '/auth' || path === '/dashboard') {
        return path;
      }
    }
    try {
      return localStorage.getItem('sentinel_auth') === 'true' ? '/dashboard' : '/auth';
    } catch {
      return '/auth';
    }
  });

  const navigateTo = useCallback((route: string) => {
    setCurrentRoute(route);
    if (typeof window !== 'undefined' && window.history && window.history.pushState) {
      window.history.pushState({}, '', route);
    }
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      if (typeof window !== 'undefined') {
        setCurrentRoute(window.location.pathname || '/dashboard');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const addPatient = useCallback((newPatient: ElderlyPerson) => {
    setPatientsList(prev => {
      const updated = [newPatient, ...prev];
      try {
        localStorage.setItem('sentinel_patients', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    setSelectedPatient(newPatient);
    addToast('Patient Registered', `${newPatient.name} has been enrolled in SentinelCare monitoring.`, 'success');
  }, [addToast]);

  const [patientToDelete, setPatientToDelete] = useState<ElderlyPerson | null>(null);

  const openDeletePatientModal = useCallback((patient: ElderlyPerson) => {
    setPatientToDelete(patient);
  }, []);

  const closeDeletePatientModal = useCallback(() => {
    setPatientToDelete(null);
  }, []);

  const removePatient = useCallback((patientId: string) => {
    let removedName = '';
    setPatientsList(prev => {
      const target = prev.find(p => p.id === patientId);
      if (target) {
        removedName = target.name;
      }
      const updated = prev.filter(p => p.id !== patientId);
      try {
        localStorage.setItem('sentinel_patients', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }

      // If removed patient was currently selected, pick first remaining or fallback to PRIMARY_PATIENT
      setSelectedPatient(curr => {
        if (curr.id === patientId) {
          return updated.length > 0 ? updated[0] : PRIMARY_PATIENT;
        }
        return curr;
      });

      return updated;
    });

    if (removedName) {
      addToast('Patient Removed', `${removedName} has been removed from active monitoring.`, 'info');
    } else {
      addToast('Patient Removed', 'Patient has been removed from active monitoring.', 'info');
    }
  }, [addToast]);

  const login = useCallback((emailOrUsername: string, password: string): boolean => {
    const cleanUser = emailOrUsername.trim();
    
    // Check demo credentials (username "1" / password "1", or admin email)
    if (
      (cleanUser === '1' && password === '1') || 
      (cleanUser.toLowerCase() === 'admin@sentinelcare.io' && password === '1') || 
      (cleanUser.toLowerCase() === 'rahul@sentinelcare.io' && password === '1') ||
      (cleanUser.toLowerCase() === 'caregiver@sentinelcare.io' && (password === '1' || password === 'password'))
    ) {
      setIsAuthenticated(true);
      const displayName = cleanUser === '1' ? 'Rahul Verma' : cleanUser.split('@')[0];
      const email = cleanUser === '1' ? 'rahul@sentinelcare.io' : cleanUser;
      setCurrentUser(displayName);
      setCurrentUserEmail(email);
      try {
        localStorage.setItem('sentinel_auth', 'true');
        localStorage.setItem('sentinel_user', displayName);
        localStorage.setItem('sentinel_user_email', email);
      } catch (e) {
        console.error(e);
      }
      addToast('Welcome to SentinelCare', 'Signed in successfully as Senior Caregiver.', 'success');
      navigateTo('/dashboard');
      return true;
    }

    // Check registered accounts in localStorage
    try {
      const savedAccounts = localStorage.getItem('sentinel_registered_accounts');
      if (savedAccounts) {
        const accounts = JSON.parse(savedAccounts);
        const match = accounts.find((acc: any) => 
          (acc.email.toLowerCase() === cleanUser.toLowerCase() || acc.phone === cleanUser) && acc.password === password
        );
        if (match) {
          setIsAuthenticated(true);
          setCurrentUser(match.fullName || match.email.split('@')[0]);
          setCurrentUserEmail(match.email);
          localStorage.setItem('sentinel_auth', 'true');
          localStorage.setItem('sentinel_user', match.fullName);
          localStorage.setItem('sentinel_user_email', match.email);
          addToast('Welcome back', `Signed in as ${match.fullName}.`, 'success');
          navigateTo('/dashboard');
          return true;
        }
      }
    } catch (e) {
      console.error(e);
    }

    return false;
  }, [addToast, navigateTo]);

  const signup = useCallback((fullName: string, email: string, phone: string, password: string): boolean => {
    const cleanName = fullName.trim();
    const cleanEmail = email.trim();
    const cleanPhone = phone.trim();

    if (!cleanName || !cleanEmail || !password) {
      return false;
    }

    try {
      const savedAccounts = localStorage.getItem('sentinel_registered_accounts');
      const accounts = savedAccounts ? JSON.parse(savedAccounts) : [];
      const newAccount = { fullName: cleanName, email: cleanEmail, phone: cleanPhone, password, createdAt: new Date().toISOString() };
      accounts.push(newAccount);
      localStorage.setItem('sentinel_registered_accounts', JSON.stringify(accounts));
      
      setIsAuthenticated(true);
      setCurrentUser(cleanName);
      setCurrentUserEmail(cleanEmail);
      localStorage.setItem('sentinel_auth', 'true');
      localStorage.setItem('sentinel_user', cleanName);
      localStorage.setItem('sentinel_user_email', cleanEmail);
    } catch (e) {
      console.error(e);
      setIsAuthenticated(true);
      setCurrentUser(cleanName);
      setCurrentUserEmail(cleanEmail);
    }

    addToast('Account Created', `Welcome to SentinelCare, ${cleanName}! Please set up your first patient.`, 'success');
    navigateTo('/patient/setup');
    return true;
  }, [addToast, navigateTo]);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentUserEmail(null);
    try {
      localStorage.removeItem('sentinel_auth');
      localStorage.removeItem('sentinel_user');
      localStorage.removeItem('sentinel_user_email');
    } catch (e) {
      console.error(e);
    }
    addToast('Session Ended', 'You have been safely logged out.', 'info');
    navigateTo('/auth');
  }, [addToast, navigateTo]);
  
  // Telemetry buffer
  const [telemetry, setTelemetry] = useState<SensorTelemetry>({
    timestamp: Date.now(),
    accX: 0.04,
    accY: 0.98,
    accZ: 0.15,
    gyroX: 1.2,
    gyroY: -0.8,
    gyroZ: 0.4,
    intensity: 38,
    gaitState: 'WALKING',
    heartRate: 74,
    batteryLevel: 87,
    rssi: -58
  });
  
  const [telemetryHistory, setTelemetryHistory] = useState<SensorTelemetry[]>([]);
  const [systemTime, setSystemTime] = useState<string>('');
  const [lastSyncSecondsAgo, setLastSyncSecondsAgo] = useState<number>(2);

  // System time ticker
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Sync ticker
  useEffect(() => {
    const syncInterval = setInterval(() => {
      setLastSyncSecondsAgo(prev => (prev > 15 ? 1 : prev + 1));
    }, 1000);
    return () => clearInterval(syncInterval);
  }, []);

  // Telemetry generation stream (50Hz wave sampled at 400ms interval for smooth UI chart)
  useEffect(() => {
    let stepCount = 0;
    const streamInterval = setInterval(() => {
      stepCount++;
      const t = Date.now() / 1000;
      
      let newAccX = Math.sin(t * 3.5) * 0.35 + (Math.random() * 0.05 - 0.025);
      let newAccY = 0.98 + Math.cos(t * 3.5) * 0.28 + (Math.random() * 0.05 - 0.025);
      let newAccZ = Math.sin(t * 1.8) * 0.2 + (Math.random() * 0.04 - 0.02);
      let newGyroX = Math.cos(t * 2.5) * 12;
      let newGyroY = Math.sin(t * 2.8) * 15;
      let newGyroZ = Math.cos(t * 3.1) * 8;
      let newIntensity = Math.round(35 + Math.sin(t * 0.5) * 15);
      let newGait: SensorTelemetry['gaitState'] = 'WALKING';

      if (isEmergencyActive) {
        newAccX = (Math.random() * 2 - 1) * 3.2;
        newAccY = 0.12 + (Math.random() * 0.4 - 0.2);
        newAccZ = (Math.random() * 2 - 1) * 2.8;
        newGyroX = (Math.random() * 2 - 1) * 180;
        newGyroY = (Math.random() * 2 - 1) * 220;
        newGyroZ = (Math.random() * 2 - 1) * 140;
        newIntensity = 95;
        newGait = 'FALL_DETECTED';
      } else if (activeScenario === 'mobility_decline') {
        newAccY = 0.88 + Math.cos(t * 2.0) * 0.14;
        newIntensity = 22;
        newGait = 'RESTING';
      }

      const point: SensorTelemetry = {
        timestamp: Date.now(),
        accX: +newAccX.toFixed(3),
        accY: +newAccY.toFixed(3),
        accZ: +newAccZ.toFixed(3),
        gyroX: +newGyroX.toFixed(1),
        gyroY: +newGyroY.toFixed(1),
        gyroZ: +newGyroZ.toFixed(1),
        intensity: newIntensity,
        gaitState: newGait,
        heartRate: isEmergencyActive ? 108 : Math.round(72 + Math.sin(t * 0.2) * 5),
        batteryLevel: activeScenario === 'device_offline' ? 4 : 87,
        rssi: activeScenario === 'device_offline' ? -94 : -58
      };

      setTelemetry(point);
      setTelemetryHistory(prev => {
        const next = [...prev, point];
        return next.length > 25 ? next.slice(next.length - 25) : next;
      });
    }, 400);

    return () => clearInterval(streamInterval);
  }, [isEmergencyActive, activeScenario]);

  // Emergency countdown timer
  useEffect(() => {
    let timerId: any;
    if (isEmergencyActive) {
      timerId = setInterval(() => {
        setEmergencyTimer(t => t + 1);
      }, 1000);
    } else {
      setEmergencyTimer(0);
    }
    return () => clearInterval(timerId);
  }, [isEmergencyActive]);

  // Scenario switch handler
  const setScenario = useCallback((scenario: DemoScenario) => {
    setActiveScenario(scenario);
    
    if (scenario === 'normal') {
      setIsEmergencyActive(false);
      setIsBuzzerActive(false);
      setMobilityMetrics(INITIAL_MOBILITY_METRICS);
      setMedications(INITIAL_MEDICATIONS);
      setAlerts(INITIAL_ALERTS);
      setDevices(INITIAL_DEVICES);
      addToast('Scenario: Normal Day', 'Restored baseline parameters. Person is stable & online.', 'success');
    } 
    else if (scenario === 'mobility_decline') {
      setIsEmergencyActive(false);
      setIsBuzzerActive(false);
      setMobilityMetrics({
        riskScore: 74,
        riskLevel: 'High Risk',
        stepCadence: 62,
        strideVariability: 18.6,
        dailySteps: 2840,
        dailyStepGoal: 5000,
        activityDurationMinutes: 140,
        sitToStandCount: 6,
        mobilityTrend: 'Critical Decline',
        aiConfidence: 94,
        lastAssessmentTime: 'Just now'
      });
      const declineAlert: AlertIncident = {
        id: 'inc-decline-' + Date.now(),
        title: 'Significant Mobility Decline Over 5 Days',
        description: 'Cadence dropped by 26% and stride variability increased from 8.4% to 18.6%. Sit-to-stand transitions indicate musculoskeletal fatigue.',
        severity: 'warning',
        type: 'mobility',
        timestamp: new Date().toISOString(),
        timeFormatted: 'Just now',
        location: 'Bedroom / Living Corridor',
        device: 'AI Mobility Predictive Engine',
        confidence: 94,
        sensorEvidence: {
          peakAccelerationG: 0.82,
          rotationRateDegS: 18,
          impactDurationMs: 0
        },
        caregiverResponse: 'Review requested with geriatric physical therapist.',
        notificationStatus: 'Delivered',
        escalationStages: { buzzer: false, push: true, sms: false, call: false },
        isResolved: false
      };
      setAlerts(prev => [declineAlert, ...prev.filter(a => !a.id.startsWith('inc-decline'))]);
      addToast('Scenario: Mobility Decline', 'AI detected 18.6% stride variability and prolonged inactivity.', 'warning');
    }
    else if (scenario === 'fall_detection') {
      simulateFallEvent();
    }
    else if (scenario === 'missed_medication') {
      setIsEmergencyActive(false);
      setIsBuzzerActive(false);
      setMedications(prev => prev.map(med => {
        if (med.id === 'med-02') {
          return {
            ...med,
            status: 'missed',
            verificationMethod: 'Pending',
            observedWeightGrams: 0.00,
            instructions: 'EXPIRED: 13:00 dose window missed by 45 minutes.'
          };
        }
        return med;
      }));
      const medAlert: AlertIncident = {
        id: 'inc-med-' + Date.now(),
        title: 'Missed Medication: Vitamin D3 & Calcium (13:00)',
        description: 'Dispenser tray was not accessed during the 60-minute scheduled window. Load cell reported 0g change.',
        severity: 'warning',
        type: 'medication',
        timestamp: new Date().toISOString(),
        timeFormatted: '13:45 Today',
        location: 'Smart Dispenser Station',
        device: 'ESP32-CAM Smart Dispenser',
        confidence: 99,
        sensorEvidence: {
          peakAccelerationG: 0,
          rotationRateDegS: 0,
          impactDurationMs: 0,
          weightDeltaG: 0.00
        },
        caregiverResponse: 'Automated SMS reminder dispatched to Meena Rao.',
        notificationStatus: 'Delivered (SMS)',
        escalationStages: { buzzer: true, push: true, sms: true, call: false },
        isResolved: false
      };
      setAlerts(prev => [medAlert, ...prev.filter(a => !a.id.startsWith('inc-med'))]);
      addToast('Scenario: Missed Medication', 'Compartment 2 window closed with no weight delta.', 'warning');
    }
    else if (scenario === 'device_offline') {
      setIsEmergencyActive(false);
      setIsBuzzerActive(false);
      setDevices(prev => prev.map(dev => {
        if (dev.type === 'wristband') {
          return {
            ...dev,
            status: 'offline',
            battery: 4,
            signalStrength: 0,
            lastSync: '14 minutes ago',
            diagnostics: {
              ...dev.diagnostics,
              sensorHealth: 'Error',
              networkLatencyMs: 999,
              packetLossPct: 100
            }
          };
        }
        return dev;
      }));
      const offlineAlert: AlertIncident = {
        id: 'inc-offline-' + Date.now(),
        title: 'Smart Wristband Connection Lost (BLE Gateway Timeout)',
        description: 'No telemetry packets received for 14 minutes. Battery depleted or device out of BLE 5.2 beacon range.',
        severity: 'warning',
        type: 'device',
        timestamp: new Date().toISOString(),
        timeFormatted: 'Just now',
        location: 'Entire Home Zone',
        device: 'Home Hub Gateway (BLE)',
        confidence: 100,
        sensorEvidence: {
          peakAccelerationG: 0,
          rotationRateDegS: 0,
          impactDurationMs: 0
        },
        caregiverResponse: 'Check charger dock or wristband placement.',
        notificationStatus: 'Delivered',
        escalationStages: { buzzer: false, push: true, sms: false, call: false },
        isResolved: false
      };
      setAlerts(prev => [offlineAlert, ...prev.filter(a => !a.id.startsWith('inc-offline'))]);
      addToast('Scenario: Device Offline', 'Wristband heartbeat disconnected. Alert dispatched.', 'error');
    }
  }, [addToast]);

  const simulateFallEvent = useCallback(() => {
    setIsEmergencyActive(true);
    setIsBuzzerActive(true);
    setEmergencyTimer(0);

    const fallIncident: AlertIncident = {
      id: 'fall-' + Date.now(),
      title: 'CRITICAL: Severe Fall Detected in Living Room',
      description: 'Sudden deceleration spike of 3.82g on ESP32-S3 wristband followed by horizontal stillness for >8 seconds. Local buzzer sounded.',
      severity: 'critical',
      type: 'fall',
      timestamp: new Date().toISOString(),
      timeFormatted: 'Just now',
      location: 'Living Room / Main Seating Area',
      device: 'ESP32 Smart Wristband (MPU6050)',
      confidence: 96,
      sensorEvidence: {
        peakAccelerationG: 3.82,
        rotationRateDegS: 310,
        impactDurationMs: 180,
        snapshotUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop&q=80'
      },
      caregiverResponse: 'Emergency workflow initiated. Escalation timer counting.',
      aiRecommendedResponse: {
        action: 'CRITICAL: Initiate instant 2-way audio verification through Sentinel Hub speaker. If no voice acknowledgment within 30s, automatically dispatch EMS and notify emergency contact.',
        protocol: 'Acute Severe Deceleration Protocol (Alpha-EMS Escalation)',
        priority: 'IMMEDIATE',
        targetTime: '< 30 seconds',
        steps: [
          'Sound immediate 85dB pulse buzzer on resident smart wristband',
          'Open live bi-directional speaker channel on Home Hub Gateway',
          'Stream continuous heart rate & ECG telemetry to caregiver console',
          'Dispatch automated voice call to emergency contact Ananya Rao (+91 98450) if unresponsive'
        ]
      },
      notificationStatus: 'Escalating (Buzzer ➔ Push ➔ SMS)',
      escalationStages: {
        buzzer: true,
        push: true,
        sms: true,
        call: true
      },
      isResolved: false
    };

    setAlerts(prev => [fallIncident, ...prev]);
    setSelectedIncident(fallIncident);
    addToast('FALL DETECTED (DEMO)', 'Emergency escalation sequence triggered on wristband & hub.', 'error');
  }, [addToast]);

  const cancelEmergency = useCallback(() => {
    setIsEmergencyActive(false);
    setIsBuzzerActive(false);
    setEmergencyTimer(0);
    setAlerts(prev => prev.map(a => {
      if (a.severity === 'critical' && !a.isResolved) {
        return {
          ...a,
          severity: 'resolved',
          isResolved: true,
          resolvedAt: 'Just now',
          resolvedBy: 'Rahul Verma (Caregiver)',
          notes: 'Caregiver checked on patient. Confirmed patient safe & resting.'
        };
      }
      return a;
    }));
    addToast('Emergency Resolved', 'Caregiver acknowledged and marked patient safe.', 'success');
  }, [addToast]);

  const toggleBuzzer = useCallback(() => {
    setIsBuzzerActive(prev => !prev);
  }, []);

  const verifyMedication = useCallback((id: string) => {
    setMedications(prev => prev.map(med => {
      if (med.id === id) {
        return {
          ...med,
          status: 'verified',
          verificationMethod: 'Camera + Weight',
          cameraConfidence: 98.6,
          observedWeightGrams: med.expectedWeightGrams - 0.02,
          verifiedAt: 'Just now'
        };
      }
      return med;
    }));
    addToast('Medication Verified', 'ESP32-CAM & HX711 confirmed pill count & weight match.', 'success');
  }, [addToast]);

  const resolveAlert = useCallback((id: string, notes?: string) => {
    setAlerts(prev => prev.map(a => {
      if (a.id === id) {
        return {
          ...a,
          severity: 'resolved',
          isResolved: true,
          resolvedAt: 'Just now',
          resolvedBy: 'Rahul Verma (Caregiver)',
          notes: notes || a.notes || 'Manually verified and resolved.'
        };
      }
      return a;
    }));
    if (selectedIncident?.id === id) {
      setSelectedIncident(prev => prev ? { ...prev, isResolved: true, severity: 'resolved', resolvedAt: 'Just now' } : null);
    }
    addToast('Alert Resolved', 'Incident record updated and closed.', 'info');
  }, [addToast, selectedIncident]);

  return (
    <DashboardContext.Provider value={{
      activeTab,
      setActiveTab,
      selectedPatient,
      setSelectedPatient,
      patientsList,
      setPatientsList,
      addPatient,
      removePatient,
      patientToDelete,
      setPatientToDelete,
      openDeletePatientModal,
      closeDeletePatientModal,
      currentRoute,
      navigateTo,
      activeScenario,
      setScenario,
      mobilityMetrics,
      medications,
      alerts,
      devices,
      recentEvents,
      telemetry,
      telemetryHistory,
      verifyMedication,
      resolveAlert,
      simulateFallEvent,
      cancelEmergency,
      isEmergencyActive,
      emergencyTimer,
      isBuzzerActive,
      toggleBuzzer,
      selectedIncident,
      setSelectedIncident,
      isSearchOpen,
      setIsSearchOpen,
      isNotificationCenterOpen,
      setIsNotificationCenterOpen,
      toasts,
      addToast,
      removeToast,
      systemTime,
      lastSyncSecondsAgo,
      isAuthenticated,
      currentUser,
      currentUserEmail,
      login,
      signup,
      logout
    }}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
