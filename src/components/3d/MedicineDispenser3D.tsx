import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useDashboard } from '../../context/DashboardContext';
import { Camera, Scale, RotateCw, CheckCircle2, AlertTriangle, ShieldCheck, Cpu } from 'lucide-react';

export const MedicineDispenser3D: React.FC<{ selectedSlotIndex?: number; onSelectSlot?: (index: number) => void }> = ({
  selectedSlotIndex = 1,
  onSelectSlot
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { medications, verifyMedication } = useDashboard();
  const [activeSlot, setActiveSlot] = useState<number>(selectedSlotIndex);

  const activeMed = medications.find(m => m.compartmentIndex === activeSlot) || medications[0];

  useEffect(() => {
    setActiveSlot(selectedSlotIndex);
  }, [selectedSlotIndex]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 360;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 4, 7.5);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x0a192f, 2.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 2.0);
    dirLight.position.set(5, 10, 7);
    scene.add(dirLight);

    const pointLight = new THREE.PointLight(0x10b981, 3, 12);
    pointLight.position.set(0, 2, 2);
    scene.add(pointLight);

    // Main Carousel Group
    const dispenserGroup = new THREE.Group();
    scene.add(dispenserGroup);

    // 1. Base Plate & HX711 Load Cell Base
    const baseGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.5, 32);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.8,
      roughness: 0.3
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = -1.4;
    dispenserGroup.add(base);

    // Glowing base ring
    const baseRingGeo = new THREE.TorusGeometry(2.45, 0.04, 16, 64);
    const baseRingMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const baseRing = new THREE.Mesh(baseRingGeo, baseRingMat);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.y = -1.15;
    dispenserGroup.add(baseRing);

    // 2. Rotating Carousel Cylinder with 4 Compartments
    const carouselGroup = new THREE.Group();
    dispenserGroup.add(carouselGroup);

    const carouselGeo = new THREE.CylinderGeometry(2.1, 2.1, 1.6, 32);
    const carouselMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b,
      metalness: 0.6,
      roughness: 0.4
    });
    const carouselBody = new THREE.Mesh(carouselGeo, carouselMat);
    carouselGroup.add(carouselBody);

    // 4 Chamber Segments & Visual Pills
    const chamberColors = [0x38bdf8, 0xfbbf24, 0x34d399, 0xa78bfa];
    const chamberMeshes: THREE.Mesh[] = [];

    for (let i = 0; i < 4; i++) {
      const angle = (i * Math.PI) / 2;
      const x = Math.cos(angle) * 1.35;
      const z = Math.sin(angle) * 1.35;

      // Chamber transparent acrylic pocket
      const pocketGeo = new THREE.BoxGeometry(0.9, 0.8, 0.9);
      const pocketMat = new THREE.MeshPhysicalMaterial({
        color: chamberColors[i],
        transparent: true,
        opacity: 0.45,
        roughness: 0.1,
        transmission: 0.6
      });
      const pocket = new THREE.Mesh(pocketGeo, pocketMat);
      pocket.position.set(x, 0.3, z);
      pocket.rotation.y = -angle;
      carouselGroup.add(pocket);

      // Pill geometry inside pocket
      const pillGeo = new THREE.CapsuleGeometry(0.18, 0.35, 12, 16);
      const pillMat = new THREE.MeshStandardMaterial({
        color: chamberColors[i],
        roughness: 0.2
      });
      const pill = new THREE.Mesh(pillGeo, pillMat);
      pill.rotation.z = Math.PI / 3;
      pill.position.set(x, 0.3, z);
      carouselGroup.add(pill);

      // Chamber LED status indicator dot
      const ledGeo = new THREE.SphereGeometry(0.1, 16, 16);
      const ledMat = new THREE.MeshBasicMaterial({
        color: i === 1 ? 0xfbbf24 : 0x10b981
      });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(Math.cos(angle) * 2.05, 0.6, Math.sin(angle) * 2.05);
      carouselGroup.add(led);

      chamberMeshes.push(pocket);
    }

    // 3. Top Cover & ESP32-CAM Optical Vision Dome
    const topCapGeo = new THREE.CylinderGeometry(2.3, 2.3, 0.4, 32);
    const topCapMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      metalness: 0.85,
      roughness: 0.2
    });
    const topCap = new THREE.Mesh(topCapGeo, topCapMat);
    topCap.position.y = 1.0;
    dispenserGroup.add(topCap);

    // ESP32-CAM Turret Housing
    const camHousingGeo = new THREE.CylinderGeometry(0.6, 0.7, 0.6, 24);
    const camHousingMat = new THREE.MeshStandardMaterial({
      color: 0x334155,
      metalness: 0.9,
      roughness: 0.1
    });
    const camHousing = new THREE.Mesh(camHousingGeo, camHousingMat);
    camHousing.position.set(0, 1.4, 0.8);
    dispenserGroup.add(camHousing);

    // Camera Lens Aperture
    const lensGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const lensMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4 });
    const lens = new THREE.Mesh(lensGeo, lensMat);
    lens.position.set(0, 1.4, 1.12);
    dispenserGroup.add(lens);

    // Camera Vision Ring (Flash LED)
    const ringGeo = new THREE.TorusGeometry(0.35, 0.03, 16, 32);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const camRing = new THREE.Mesh(ringGeo, ringMat);
    camRing.position.set(0, 1.4, 1.1);
    dispenserGroup.add(camRing);

    // Target rotation angle based on activeSlot (1: Morning, 2: Afternoon, 3: Evening, 4: Night)
    // 0 rad brings slot 1 forward
    let targetRotationY = ((activeSlot - 1) * -Math.PI) / 2;

    // Mouse tilt interaction
    const onMouseMove = (e: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      dispenserGroup.rotation.x = -y * 0.25;
      dispenserGroup.rotation.z = x * 0.15;
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

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Smooth rotate carousel to active compartment angle
      targetRotationY = ((activeSlot - 1) * -Math.PI) / 2;
      carouselGroup.rotation.y += (targetRotationY - carouselGroup.rotation.y) * 0.08;

      // Floating gentle hover
      dispenserGroup.position.y = Math.sin(elapsed * 1.5) * 0.08;

      // Pulse camera ring
      camRing.scale.setScalar(1 + Math.sin(elapsed * 4) * 0.08);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      domElement.removeEventListener('mousemove', onMouseMove);
      renderer.dispose();
    };
  }, [activeSlot]);

  const handleSlotClick = (index: number) => {
    setActiveSlot(index);
    if (onSelectSlot) {
      onSelectSlot(index);
    }
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden glass-panel border border-cyan-500/20 p-4">
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* 3D Canvas Viewport */}
        <div className="relative w-full lg:w-3/5 h-[340px] flex items-center justify-center">
          <div ref={mountRef} className="w-full h-full cursor-grab" />

          {/* Top HUD */}
          <div className="absolute top-2 left-2 flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60 text-xs font-mono text-cyan-300">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            ESP32-CAM + HX711 LOAD CELL
          </div>

          <div className="absolute bottom-2 right-2 text-[11px] font-mono text-slate-400 bg-slate-950/80 px-2.5 py-1 rounded border border-slate-800">
            Click compartment tab below to rotate carousel
          </div>
        </div>

        {/* Compartment Selector & Verification Telemetry */}
        <div className="w-full lg:w-2/5 flex flex-col gap-3">
          <div className="text-xs font-mono text-cyan-400 tracking-wider uppercase">
            Carousel Compartments
          </div>

          {/* 4 Compartment Buttons */}
          <div className="grid grid-cols-2 gap-2">
            {medications.map((med) => {
              const isSelected = activeSlot === med.compartmentIndex;
              const isVer = med.status === 'verified';
              const isMiss = med.status === 'missed';

              return (
                <button
                  key={med.id}
                  onClick={() => handleSlotClick(med.compartmentIndex)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-cyan-950/50 border-cyan-400 shadow-md shadow-cyan-500/10'
                      : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-400">Slot {med.compartmentIndex}</span>
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      isVer ? 'bg-emerald-500/20 text-emerald-300' : isMiss ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {med.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-white mt-1 truncate">{med.scheduledTime}</div>
                  <div className="text-[11px] text-slate-300 truncate">{med.name}</div>
                </button>
              );
            })}
          </div>

          {/* Verification Telemetry Breakdown Card */}
          {activeMed && (
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-700/60 flex flex-col gap-2.5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-cyan-400" />
                  Dual Verification Pipeline
                </span>
                <span className="text-[11px] font-mono text-cyan-300">
                  {activeMed.verificationMethod}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                    <Camera className="w-3.5 h-3.5 text-cyan-400" />
                    Camera Match
                  </div>
                  <div className="text-sm font-mono font-bold text-white mt-0.5">
                    {activeMed.cameraConfidence > 0 ? `${activeMed.cameraConfidence}%` : 'Pending'}
                  </div>
                  <div className="text-[10px] text-emerald-400">
                    {activeMed.cameraConfidence > 0 ? 'Pill Detected ✓' : 'Awaiting Tray Access'}
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-slate-950/50 border border-slate-800">
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                    <Scale className="w-3.5 h-3.5 text-cyan-400" />
                    HX711 Load Cell
                  </div>
                  <div className="text-sm font-mono font-bold text-white mt-0.5">
                    {activeMed.observedWeightGrams.toFixed(2)}g / {activeMed.expectedWeightGrams.toFixed(2)}g
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Δ Weight Precision
                  </div>
                </div>
              </div>

              {activeMed.status !== 'verified' && (
                <button
                  onClick={() => verifyMedication(activeMed.id)}
                  className="w-full mt-1 py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30 transition"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Simulate Verification Now (Demo)
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
