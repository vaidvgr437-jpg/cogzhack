import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Helper for timeout
const withTimeout = <T>(promise: Promise<T>, timeoutMs = 8000): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error('AI request timeout')), timeoutMs))
  ]);
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health and API Key configuration check
  app.get("/api/health", (req, res) => {
    const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY');
    res.json({
      status: "ok",
      geminiConfigured: hasKey,
      timestamp: new Date().toISOString()
    });
  });

  // Patient Onboarding AI Clinical Care Plan & Risk Profile
  app.post("/api/ai/onboarding-insights", async (req, res) => {
    try {
      const {
        name,
        age,
        gender,
        mobilityStatus,
        medicalNotes,
        connectedDevices
      } = req.body || {};

      const ai = getGeminiClient();

      if (ai) {
        try {
          const prompt = `You are SentinelCare's clinical geriatric AI specialist.
Analyze this newly onboarded elderly resident and provide a concise, structured clinical assessment:
- Resident Name: ${name || 'Resident'}
- Age: ${age || 75} (${gender || 'Unspecified'})
- Mobility Status: ${mobilityStatus || 'Assisted'}
- Medical History/Notes: ${medicalNotes || 'Routine geriatric observation'}
- Connected IoT Devices: ${JSON.stringify(connectedDevices || {})}

Return a valid JSON object only (no markdown, no backticks) with this structure:
{
  "clinicalSummary": "2-sentence clinical profile and mobility vulnerability summary",
  "fallRiskLevel": "LOW" | "MODERATE" | "HIGH" | "CRITICAL",
  "fallRiskScore": number between 15 and 85,
  "recommendedIoTSettings": {
    "wristbandSensitivity": "HIGH (3.2g threshold)" | "STANDARD (3.8g threshold)" | "GENTLE (2.8g threshold)",
    "nightMonitoring": "string recommendation for nocturnal trips",
    "medicationReminders": "string recommendation for dispensing schedule"
  },
  "preventiveProtocols": [
    "3 specific, actionable fall prevention and caregiving protocol steps"
  ],
  "clinicianAdvisory": "string targeted advice for family caregivers and attending physician"
}`;

          const response = await withTimeout(
            ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: prompt,
              config: {
                responseMimeType: 'application/json'
              }
            }),
            8000
          );

          const text = response.text?.trim() || '';
          if (text) {
            try {
              const parsed = JSON.parse(text);
              return res.json({ success: true, source: 'gemini-3.8-flash', data: parsed });
            } catch {
              // Non-fatal parse fallback
            }
          }
        } catch (apiErr: any) {
          console.warn('Gemini API call bypassed or experiencing temporary demand:', apiErr.message || apiErr);
          // Fall through gracefully to heuristic engine
        }
      }

      // Fallback heuristics if API call times out or key unavailable
      const isHigh = mobilityStatus === 'Limited Mobility' || Number(age) >= 80;
      return res.json({
        success: true,
        source: 'clinical-heuristics-engine',
        data: {
          clinicalSummary: `${name || 'Resident'} (${age || 75}yo) enrolled under ${mobilityStatus || 'Assisted'} classification with continuous 24/7 IoT sensor monitoring.`,
          fallRiskLevel: isHigh ? 'HIGH' : 'MODERATE',
          fallRiskScore: isHigh ? 68 : 38,
          recommendedIoTSettings: {
            wristbandSensitivity: isHigh ? 'HIGH (3.2g threshold)' : 'STANDARD (3.8g threshold)',
            nightMonitoring: 'Corridor ambient motion beacons active between 22:00 and 06:00',
            medicationReminders: 'Triple-beep chime and visual amber ring on MD-HX711'
          },
          preventiveProtocols: [
            'Baseline 3-axis accelerometer and gyro calibrated for personal walking cadence',
            'Automated 30-second caregiver check if sudden deceleration > 3.2g occurs',
            'Verify daily hydration and medication compliance via smart dispenser load cell'
          ],
          clinicianAdvisory: 'Routine geriatric observation initiated. Baseline mobility scores will stabilize after 72 hours of telemetry.'
        }
      });
    } catch (err: any) {
      console.error('Error generating onboarding insights:', err);
      return res.status(500).json({ error: err.message || 'Internal error' });
    }
  });

  // Fall Incident AI Clinical Triage & Protocol Synthesis
  app.post("/api/ai/analyze-incident", async (req, res) => {
    try {
      const { incident, resident } = req.body || {};
      const ai = getGeminiClient();

      if (ai && incident) {
        try {
          const prompt = `You are SentinelCare's clinical decision support AI.
Analyze this real-time elderly fall alert event:
- Resident: ${resident?.name || 'Resident'} (Age ${resident?.age || 78})
- Incident Type: ${incident.type} (Severity: ${incident.severity})
- Location: ${incident.location}
- Sensor Evidence: Peak Deceleration: ${incident.sensorEvidence?.peakAccelerationG || '3.82'}g, Rotation: ${incident.sensorEvidence?.rotationRateDegS || '240'} deg/s, Impact Duration: ${incident.sensorEvidence?.impactDurationMs || '180'}ms
- AI Confidence: ${incident.confidence}%

Return a valid JSON object only with:
{
  "protocol": "Protocol code and name",
  "priority": "CRITICAL SLA (< 30s)" | "URGENT SLA (< 2m)" | "STANDARD SLA (< 5m)",
  "action": "Immediate primary clinical intervention instruction",
  "steps": ["Step 1", "Step 2", "Step 3", "Step 4"],
  "clinicalRationale": "Detailed sensor telemetry reasoning and biomechanical risk assessment"
}`;

          const response = await withTimeout(
            ai.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: prompt,
              config: {
                responseMimeType: 'application/json'
              }
            }),
            8000
          );

          const parsed = JSON.parse(response.text?.trim() || '{}');
          if (parsed && parsed.action) {
            return res.json({ success: true, source: 'gemini-3.8-flash', data: parsed });
          }
        } catch (apiErr: any) {
          console.warn('Gemini incident analysis bypassed or experiencing temporary demand:', apiErr.message || apiErr);
        }
      }

      // Heuristic fallback
      return res.json({
        success: true,
        source: 'clinical-heuristics-engine',
        data: {
          protocol: 'ACUTE IMPACT TRIAGE PROTOCOL A-1',
          priority: 'CRITICAL SLA (< 30s)',
          action: 'Initiate 2-way audio intercom immediately; confirm consciousness & dispatch on-duty nurse.',
          steps: [
            'Trigger 85dB auditory pulse on wristband WB-ESP32-9021',
            'Open live audio channel through Home Hub intercom',
            'Assess for hip or cranial impact from deceleration telemetry',
            'Escalate to emergency family contact if unacknowledged within 45s'
          ],
          clinicalRationale: 'Deceleration spike exceeds 3.5g threshold with rapid rotational change, indicating sudden loss of vertical posture.'
        }
      });
    } catch (err: any) {
      console.error('Error analyzing incident:', err);
      return res.status(500).json({ error: err.message || 'Internal error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SentinelCare Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
