import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useDashboard } from '../../context/DashboardContext';
import { Cpu, Zap, Wifi, BatteryCharging, Heart, Activity } from 'lucide-react';

export const Wristband3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { isEmergencyActive, telemetry } = useDashboard();
  const [selectedComponent, setSelectedComponent] = useState<string>('MPU6050 IMU');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 360;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 3, 7.5);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.5);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.0);
    dirLight1.position.set(5, 8, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x6366f1, 1.5);
    dirLight2.position.set(-5, -2, -3);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(isEmergencyActive ? 0xef4444 : 0x06b6d4, 4, 10);
    pointLight.position.set(0, 0.5, 2);
    scene.add(pointLight);

    // Main Wristband Group
    const wristbandGroup = new THREE.Group();
    scene.add(wristbandGroup);

    // 1. Strap (Curved Torus segment)
    const strapGeo = new THREE.TorusGeometry(2.2, 0.35, 24, 60, Math.PI * 1.85);
    const strapMat = new THREE.MeshStandardMaterial({
      color: 0x0b1320,
      roughness: 0.7,
      metalness: 0.1
    });
    const strap = new THREE.Mesh(strapGeo, strapMat);
    strap.rotation.x = Math.PI / 2;
    wristbandGroup.add(strap);

    // 2. Center Dial / Sensor Body (Beveled rectangle)
    const caseGeo = new THREE.BoxGeometry(1.6, 2.2, 0.6);
    const caseMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.85,
      roughness: 0.25
    });
    const watchCase = new THREE.Mesh(caseGeo, caseMat);
    watchCase.position.set(0, 0, 2.2);
    wristbandGroup.add(watchCase);

    // Metal chamfer bezel
    const bezelGeo = new THREE.BoxGeometry(1.4, 2.0, 0.65);
    const bezelMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.9,
      roughness: 0.1
    });
    const bezel = new THREE.Mesh(bezelGeo, bezelMat);
    bezel.position.set(0, 0, 2.2);
    wristbandGroup.add(bezel);

    // 3. Curved OLED Screen Texture using Dynamic 2D Canvas
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 360;
    const ctx = canvas.getContext('2d')!;

    const updateScreenTexture = () => {
      ctx.fillStyle = '#020617';
      ctx.fillRect(0, 0, 256, 360);

      // Cyber Grid / Border
      ctx.strokeStyle = isEmergencyActive ? '#ef4444' : '#06b6d4';
      ctx.lineWidth = 4;
      ctx.strokeRect(8, 8, 240, 344);

      if (isEmergencyActive) {
        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 24px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('! FALL DETECTED !', 128, 50);

        ctx.fillStyle = '#f87171';
        ctx.font = 'bold 36px monospace';
        ctx.fillText('EMERGENCY', 128, 120);

        ctx.fillStyle = '#ffffff';
        ctx.font = '16px monospace';
        ctx.fillText('BUZZER ACTIVE', 128, 170);
        ctx.fillText('CALLING CAREGIVER', 128, 200);

        ctx.fillStyle = '#fca5a5';
        ctx.font = 'bold 20px monospace';
        ctx.fillText('3.82G IMPACT', 128, 270);
      } else {
        // Status bar
        ctx.fillStyle = '#06b6d4';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('SENTINEL-W1', 20, 36);

        ctx.textAlign = 'right';
        ctx.fillStyle = '#34d399';
        ctx.fillText(`${telemetry.batteryLevel}%`, 236, 36);

        // Heart rate
        ctx.fillStyle = '#f43f5e';
        ctx.font = 'bold 32px monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`♥ ${telemetry.heartRate}`, 128, 100);
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('HEART RATE (BPM)', 128, 122);

        // Gait / Motion
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 24px monospace';
        ctx.fillText('84 STEPS/M', 128, 175);
        ctx.font = '12px sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('NORMAL GAIT CADENCE', 128, 195);

        // MPU6050 6-Axis indicator
        ctx.fillStyle = '#0ea5e9';
        ctx.font = 'bold 14px monospace';
        ctx.fillText(`IMU: X:${telemetry.accX} Y:${telemetry.accY}`, 128, 245);
        ctx.fillText(`BLE: STRONG (-58dBm)`, 128, 270);

        // Green optical status
        ctx.fillStyle = '#10b981';
        ctx.font = '13px monospace';
        ctx.fillText('● SYSTEM NORMAL', 128, 315);
      }
    };

    updateScreenTexture();
    const screenTexture = new THREE.CanvasTexture(canvas);
    screenTexture.needsUpdate = true;

    const screenGeo = new THREE.PlaneGeometry(1.2, 1.8);
    const screenMat = new THREE.MeshBasicMaterial({
      map: screenTexture,
      transparent: true
    });
    const screenMesh = new THREE.Mesh(screenGeo, screenMat);
    screenMesh.position.set(0, 0, 2.53);
    wristbandGroup.add(screenMesh);

    // 4. Underside Optical Sensor Array (PPG Sensor LEDs)
    const ppgGeo = new THREE.CylinderGeometry(0.3, 0.3, 0.1, 16);
    const ppgMat = new THREE.MeshBasicMaterial({ color: 0x10b981 });
    const ppg = new THREE.Mesh(ppgGeo, ppgMat);
    ppg.rotation.x = Math.PI / 2;
    ppg.position.set(0, 0, 1.88);
    wristbandGroup.add(ppg);

    // Interactive Raycasting for component highlights
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Mouse tilt interaction
      wristbandGroup.rotation.y = mouse.x * 0.6;
      wristbandGroup.rotation.x = -mouse.y * 0.4;
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousemove', onMouseMove);

    // Resize
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height || 360;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    // Animation loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Continuous slow rotation
      wristbandGroup.rotation.z = Math.sin(elapsed * 0.8) * 0.1;
      wristbandGroup.position.y = Math.sin(elapsed * 1.5) * 0.15;

      // Update screen texture on each frame
      updateScreenTexture();
      screenTexture.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      domElement.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
    };
  }, [isEmergencyActive, telemetry]);

  const components = [
    {
      name: 'MPU6050 IMU',
      desc: '6-Axis Gyroscope + Accelerometer with 50Hz continuous sampling for gait anomaly and fall detection.',
      icon: Activity,
      stat: '50 Hz Sampling'
    },
    {
      name: 'ESP32-S3 MCU',
      desc: 'Dual-core Xtensa LX7 processor running edge AI anomaly filters with low-power deep sleep modes.',
      icon: Cpu,
      stat: '240 MHz Edge AI'
    },
    {
      name: 'PPG Heart Rate Sensor',
      desc: 'Dual-wavelength optical photoplethysmography monitoring resting pulse and sudden exertion spikes.',
      icon: Heart,
      stat: 'Continuous Pulse'
    },
    {
      name: 'BLE 5.2 Transceiver',
      desc: 'Low-latency encrypted telemetry pipe transmitting to Home Hub Gateway up to 35 meters.',
      icon: Wifi,
      stat: '-58 dBm RSSI'
    }
  ];

  return (
    <div className="relative w-full rounded-2xl overflow-hidden glass-panel border border-cyan-500/20 p-4">
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* 3D Canvas Area */}
        <div className="relative w-full lg:w-3/5 h-[340px] flex items-center justify-center">
          <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

          {/* Floating HUD status */}
          <div className="absolute top-2 left-2 flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60 text-xs font-mono text-cyan-300">
            <span className={`w-2 h-2 rounded-full ${isEmergencyActive ? 'bg-red-500 animate-ping' : 'bg-emerald-400 animate-pulse'}`}></span>
            {isEmergencyActive ? 'CRITICAL EVENT' : '3D HARDWARE VIEW'}
          </div>

          <div className="absolute bottom-2 right-2 text-[11px] font-mono text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800">
            Drag / move cursor to inspect angles
          </div>
        </div>

        {/* Hardware Architecture Breakdown */}
        <div className="w-full lg:w-2/5 flex flex-col gap-2.5">
          <div className="text-xs font-mono text-cyan-400 tracking-wider uppercase mb-1">
            Integrated Hardware Telemetry
          </div>

          {components.map((comp) => {
            const Icon = comp.icon;
            const isSelected = selectedComponent === comp.name;
            return (
              <button
                key={comp.name}
                onClick={() => setSelectedComponent(comp.name)}
                className={`w-full text-left p-3 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-cyan-950/40 border-cyan-400/50 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-cyan-500/20 text-cyan-300' : 'bg-slate-800 text-slate-400'}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-semibold text-white">{comp.name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-cyan-300 border border-slate-700">
                    {comp.stat}
                  </span>
                </div>
                <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
                  {comp.desc}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
