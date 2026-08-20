import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useDashboard } from '../../context/DashboardContext';
import { Layers, Maximize2, RotateCcw, Activity, Wifi, ShieldAlert, Pill } from 'lucide-react';

export const HomeDigitalTwin3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { setActiveTab, isEmergencyActive, activeScenario } = useDashboard();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [activeZone, setActiveZone] = useState<string>('Living Room');

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 420;

    // Scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070b14, 0.035);

    // Camera (Isometric Orthographic style or perspective)
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(16, 18, 20);
    camera.lookAt(0, 1, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Ambient & Directional Lights
    const ambientLight = new THREE.AmbientLight(0x0d2149, 1.8);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 1.4);
    dirLight.position.set(15, 25, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);

    const cyanPoint = new THREE.PointLight(0x06b6d4, 3, 25);
    cyanPoint.position.set(0, 4, 0);
    scene.add(cyanPoint);

    const redEmergencyPoint = new THREE.PointLight(0xef4444, isEmergencyActive ? 6 : 0, 30);
    redEmergencyPoint.position.set(-2, 3, 2);
    scene.add(redEmergencyPoint);

    // Floor Base & Grid
    const floorGeo = new THREE.BoxGeometry(20, 0.4, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0x081326,
      roughness: 0.8,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Grid Overlay
    const gridHelper = new THREE.GridHelper(20, 20, 0x0ea5e9, 0x1e293b);
    gridHelper.position.y = 0.02;
    scene.add(gridHelper);

    // Room Layout Walls (Translucent futuristic glass walls)
    const wallMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      transparent: true,
      opacity: 0.18,
      roughness: 0.1,
      metalness: 0.1,
      transmission: 0.7,
      ior: 1.2
    });

    const wallBorderMaterial = new THREE.LineBasicMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.4 });

    const createRoom = (x: number, z: number, w: number, d: number, name: string) => {
      // Room floor pad
      const padGeo = new THREE.PlaneGeometry(w - 0.2, d - 0.2);
      const padMat = new THREE.MeshBasicMaterial({
        color: name === 'Living Room' ? 0x0c2548 : name === 'Bedroom' ? 0x0f172a : 0x082f49,
        side: THREE.DoubleSide
      });
      const pad = new THREE.Mesh(padGeo, padMat);
      pad.rotation.x = -Math.PI / 2;
      pad.position.set(x, 0.05, z);
      scene.add(pad);

      // Low glass partition
      const wallH = 1.6;
      const wallGeo = new THREE.BoxGeometry(w, wallH, 0.1);
      const wall = new THREE.Mesh(wallGeo, wallMaterial);
      wall.position.set(x, wallH / 2, z - d / 2);
      scene.add(wall);

      const wallEdges = new THREE.EdgesGeometry(wallGeo);
      const wallLine = new THREE.LineSegments(wallEdges, wallBorderMaterial);
      wallLine.position.copy(wall.position);
      scene.add(wallLine);
    };

    // Rooms: Living Room (Center-Left), Bedroom (Back-Right), Kitchen/Med Area (Front-Right), Hallway
    createRoom(-3, 1, 10, 10, 'Living Room');
    createRoom(4.5, -3, 8, 8, 'Bedroom');
    createRoom(4.5, 4.5, 8, 5.5, 'Medicine Area');

    // Furniture primitives for 3D realism
    // Bed in Bedroom
    const bedGeo = new THREE.BoxGeometry(4, 1.2, 3);
    const bedMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.5 });
    const bed = new THREE.Mesh(bedGeo, bedMat);
    bed.position.set(5.5, 0.6, -4);
    scene.add(bed);

    // Sofa in Living Room
    const sofaGeo = new THREE.BoxGeometry(4.5, 1, 2);
    const sofaMat = new THREE.MeshStandardMaterial({ color: 0x1e3a5f });
    const sofa = new THREE.Mesh(sofaGeo, sofaMat);
    sofa.position.set(-3.5, 0.5, 0.5);
    scene.add(sofa);

    // Interactive IoT Device Nodes
    const interactiveObjects: { mesh: THREE.Mesh; type: string; id: string; targetTab: any }[] = [];

    // 1. Wearable Node (Where the patient is currently in living room)
    const wearableGroup = new THREE.Group();
    wearableGroup.position.set(-2, 1.4, 2);

    const wearableGeo = new THREE.SphereGeometry(0.5, 32, 32);
    const wearableMat = new THREE.MeshStandardMaterial({
      color: isEmergencyActive ? 0xef4444 : 0x06b6d4,
      emissive: isEmergencyActive ? 0xff0000 : 0x0891b2,
      emissiveIntensity: 0.8,
      metalness: 0.8,
      roughness: 0.2
    });
    const wearableMesh = new THREE.Mesh(wearableGeo, wearableMat);
    wearableGroup.add(wearableMesh);

    // Ring beacon
    const ringGeo = new THREE.RingGeometry(0.7, 0.85, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: isEmergencyActive ? 0xef4444 : 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = -0.3;
    wearableGroup.add(ring);
    scene.add(wearableGroup);
    interactiveObjects.push({ mesh: wearableMesh, type: 'wearable', id: 'ESP32 Smart Wristband (Meena Rao)', targetTab: 'monitoring' });

    // 2. Home Hub Node (Central table)
    const hubGroup = new THREE.Group();
    hubGroup.position.set(0.5, 1.2, -1);
    const hubGeo = new THREE.CylinderGeometry(0.5, 0.6, 0.7, 16);
    const hubMat = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.5,
      metalness: 0.9,
      roughness: 0.1
    });
    const hubMesh = new THREE.Mesh(hubGeo, hubMat);
    hubGroup.add(hubMesh);
    scene.add(hubGroup);
    interactiveObjects.push({ mesh: hubMesh, type: 'hub', id: 'Home Hub BLE Gateway', targetTab: 'devices' });

    // 3. Smart Medicine Dispenser Node (In Medicine Area)
    const medGroup = new THREE.Group();
    medGroup.position.set(4.5, 1.3, 4.5);
    const medGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.8, 24);
    const medMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x059669,
      emissiveIntensity: 0.6,
      metalness: 0.5,
      roughness: 0.3
    });
    const medMesh = new THREE.Mesh(medGeo, medMat);
    medGroup.add(medMesh);
    scene.add(medGroup);
    interactiveObjects.push({ mesh: medMesh, type: 'dispenser', id: 'ESP32-CAM Medicine Dispenser', targetTab: 'medication' });

    // 4. Cloud Gateway Floating Node
    const cloudGroup = new THREE.Group();
    cloudGroup.position.set(0, 6.5, 0);
    const cloudGeo = new THREE.OctahedronGeometry(0.6);
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0x818cf8,
      emissive: 0x6366f1,
      emissiveIntensity: 0.7,
      wireframe: true
    });
    const cloudMesh = new THREE.Mesh(cloudGeo, cloudMat);
    cloudGroup.add(cloudMesh);
    scene.add(cloudGroup);
    interactiveObjects.push({ mesh: cloudMesh, type: 'cloud', id: 'FastAPI Cloud MQTT Broker', targetTab: 'devices' });

    // Connectivity Bezier Curves & Animated Particles
    // Path 1: Wearable -> Hub
    const curve1 = new THREE.QuadraticBezierCurve3(
      wearableGroup.position,
      new THREE.Vector3(-0.8, 2.8, 0.5),
      hubGroup.position
    );

    // Path 2: Dispenser -> Hub
    const curve2 = new THREE.QuadraticBezierCurve3(
      medGroup.position,
      new THREE.Vector3(2.5, 2.5, 1.8),
      hubGroup.position
    );

    // Path 3: Hub -> Cloud
    const curve3 = new THREE.QuadraticBezierCurve3(
      hubGroup.position,
      new THREE.Vector3(0.2, 3.8, -0.5),
      cloudGroup.position
    );

    const createPathLine = (curve: THREE.QuadraticBezierCurve3, color: number) => {
      const points = curve.getPoints(50);
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: color,
        transparent: true,
        opacity: 0.45
      });
      return new THREE.Line(geometry, material);
    };

    scene.add(createPathLine(curve1, isEmergencyActive ? 0xef4444 : 0x38bdf8));
    scene.add(createPathLine(curve2, 0x10b981));
    scene.add(createPathLine(curve3, 0x818cf8));

    // Particle Packets
    const particleGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const p1Mat = new THREE.MeshBasicMaterial({ color: isEmergencyActive ? 0xff3333 : 0x00f0ff });
    const p2Mat = new THREE.MeshBasicMaterial({ color: 0x34d399 });
    const p3Mat = new THREE.MeshBasicMaterial({ color: 0xa5b4fc });

    const p1 = new THREE.Mesh(particleGeo, p1Mat);
    const p2 = new THREE.Mesh(particleGeo, p2Mat);
    const p3 = new THREE.Mesh(particleGeo, p3Mat);
    scene.add(p1);
    scene.add(p2);
    scene.add(p3);

    // Raycasting for Interactivity & Hover
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseMove = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      // Slight camera parallax
      camera.position.x = 16 + mouse.x * 1.5;
      camera.position.y = 18 + mouse.y * 1.2;
      camera.lookAt(0, 1, 0);

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects.map(o => o.mesh));
      if (intersects.length > 0) {
        const found = interactiveObjects.find(o => o.mesh === intersects[0].object);
        if (found) {
          setHoveredNode(found.id);
          document.body.style.cursor = 'pointer';
        }
      } else {
        setHoveredNode(null);
        document.body.style.cursor = 'default';
      }
    };

    const onClick = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(interactiveObjects.map(o => o.mesh));
      if (intersects.length > 0) {
        const found = interactiveObjects.find(o => o.mesh === intersects[0].object);
        if (found) {
          setActiveTab(found.targetTab);
        }
      }
    };

    const domElement = renderer.domElement;
    domElement.addEventListener('mousemove', onMouseMove);
    domElement.addEventListener('click', onClick);

    // Resize Observer
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height || 420;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Animate Cloud rotation & breathing
      cloudGroup.rotation.y = elapsedTime * 0.4;
      cloudGroup.position.y = 6.5 + Math.sin(elapsedTime * 1.5) * 0.2;

      // Animate Packets along curves
      const t1 = (elapsedTime * 0.7) % 1;
      const t2 = (elapsedTime * 0.5) % 1;
      const t3 = (elapsedTime * 0.9) % 1;

      p1.position.copy(curve1.getPoint(t1));
      p2.position.copy(curve2.getPoint(t2));
      p3.position.copy(curve3.getPoint(t3));

      // Animate Wearable beacon
      ring.rotation.z = elapsedTime * 2;
      const scale = 1 + Math.sin(elapsedTime * 3) * 0.25;
      ring.scale.set(scale, scale, scale);

      if (isEmergencyActive) {
        redEmergencyPoint.intensity = 4 + Math.sin(elapsedTime * 8) * 3;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      domElement.removeEventListener('mousemove', onMouseMove);
      domElement.removeEventListener('click', onClick);
      renderer.dispose();
      document.body.style.cursor = 'default';
    };
  }, [isEmergencyActive, activeScenario, setActiveTab]);

  return (
    <div className="relative w-full h-[400px] sm:h-[460px] rounded-2xl overflow-hidden glass-panel border border-cyan-500/20 shadow-2xl">
      {/* 3D Canvas Mount */}
      <div ref={mountRef} className="w-full h-full" />

      {/* Top Overlay HUD */}
      <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 text-xs font-mono text-cyan-300">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          3D DIGITAL TWIN • LIVE HOME STATE
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-slate-900/80 backdrop-blur-md border border-slate-700/60 text-xs text-slate-300 font-mono flex items-center gap-1.5">
          <span className="text-slate-400">ZONE:</span>
          <span className="text-emerald-400 font-semibold">{isEmergencyActive ? 'LIVING ROOM (ALERT)' : 'LIVING ROOM (ACTIVE)'}</span>
        </div>
      </div>

      {/* Hovered Node Tooltip HUD */}
      {hoveredNode && (
        <div className="absolute top-4 right-4 z-20 px-3.5 py-2 rounded-xl bg-cyan-950/90 backdrop-blur-lg border border-cyan-400/50 shadow-lg shadow-cyan-500/20 text-xs text-cyan-200 animate-fadeIn pointer-events-none flex items-center gap-2">
          <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />
          <span>Click to inspect: <strong className="text-white font-mono">{hoveredNode}</strong></span>
        </div>
      )}

      {/* Connectivity Flow Legend at Bottom */}
      <div className="absolute bottom-3 left-4 right-4 flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-950/70 backdrop-blur-md border border-slate-800 text-[11px] text-slate-300 font-mono">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-sm shadow-cyan-400/80"></span>
            <span>Wearable (ESP32)</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
            <span>Home Hub (BLE 5.2)</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400"></span>
            <span>FastAPI Cloud</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span>Caregiver App</span>
          </div>
        </div>

        <div className="text-slate-400 hidden md:block">
          Interactive 3D • Click any node to open page
        </div>
      </div>
    </div>
  );
};
