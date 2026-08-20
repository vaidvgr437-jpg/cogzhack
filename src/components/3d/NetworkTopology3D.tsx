import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useDashboard } from '../../context/DashboardContext';
import { Network, Server, Cpu, Wifi, Radio, Shield, Database } from 'lucide-react';

export const NetworkTopology3D: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const { devices, isEmergencyActive } = useDashboard();
  const [selectedNode, setSelectedNode] = useState<string>('Home Hub Gateway');

  const nodesInfo = [
    {
      id: 'wristband',
      name: 'Smart Wristband (ESP32-S3)',
      protocol: 'BLE 5.2 (AES-128)',
      frequency: '50 Hz IMU Telemetry',
      topic: 'sentinel/telemetry/wristband',
      status: devices.find(d => d.type === 'wristband')?.status || 'online',
      desc: 'Edge filtering on Xtensa dual-core processor with local threshold triggers.'
    },
    {
      id: 'dispenser',
      name: 'Medicine Dispenser (ESP32-CAM)',
      protocol: 'Wi-Fi 802.11 b/g/n + MQTT',
      frequency: 'Event-driven + Scheduled Window',
      topic: 'sentinel/medication/verify',
      status: 'online',
      desc: 'Dual verification via OV2640 camera image feature extraction & HX711 load cell.'
    },
    {
      id: 'hub',
      name: 'Home Hub Gateway',
      protocol: 'MQTT / WebSockets over TLS',
      frequency: 'Continuous Stream (8ms latency)',
      topic: 'sentinel/gateway/broker',
      status: 'online',
      desc: 'Aggregates multi-room BLE beacons, runs local fallback buzzer, uplinks to Cloud.'
    },
    {
      id: 'cloud',
      name: 'FastAPI Cloud Engine',
      protocol: 'REST / WSS / gRPC',
      frequency: 'Sub-second AI Inference',
      topic: 'sentinel/ai/mobility_score',
      status: 'online',
      desc: 'Hosts Transformer & LSTM gait models, historical time-series analytics, and notification routers.'
    },
    {
      id: 'caregiver',
      name: 'Caregiver Command Dashboard',
      protocol: 'Encrypted WebSockets (WSS)',
      frequency: 'Real-Time Sync (<10ms)',
      topic: 'sentinel/client/telemetry',
      status: 'online',
      desc: 'Instant decision-support dashboard, 3D digital twin visualizer, and escalation triggers.'
    }
  ];

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 340;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 5, 12);
    camera.lookAt(0, 0, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.5);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0x38bdf8, 2);
    dirLight.position.set(5, 10, 8);
    scene.add(dirLight);

    // Topology Node Positions
    // Hub in center (0, 0, 0)
    // Wristband left (-4, 0, 1)
    // Dispenser bottom-left (-3, -2, -1)
    // Cloud top-right (3, 2, -1)
    // Caregiver far-right (4.5, -1, 1)
    const nodePositions = {
      hub: new THREE.Vector3(0, 0, 0),
      wristband: new THREE.Vector3(-4, 0.5, 1),
      dispenser: new THREE.Vector3(-3, -2, -1),
      cloud: new THREE.Vector3(2.8, 1.8, -1),
      caregiver: new THREE.Vector3(4.6, -1.2, 1)
    };

    const nodeColors = {
      hub: 0x0284c7,
      wristband: isEmergencyActive ? 0xef4444 : 0x06b6d4,
      dispenser: 0x10b981,
      cloud: 0x818cf8,
      caregiver: 0x38bdf8
    };

    const nodeMeshes: { [key: string]: THREE.Mesh } = {};

    // Create Nodes
    Object.entries(nodePositions).forEach(([key, pos]) => {
      const isHub = key === 'hub';
      const geo = isHub ? new THREE.IcosahedronGeometry(0.8, 1) : new THREE.SphereGeometry(0.55, 24, 24);
      const mat = new THREE.MeshStandardMaterial({
        color: nodeColors[key as keyof typeof nodeColors],
        emissive: nodeColors[key as keyof typeof nodeColors],
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.copy(pos);
      scene.add(mesh);
      nodeMeshes[key] = mesh;

      // Glow halo ring
      const ringGeo = new THREE.RingGeometry(0.7, 0.85, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: nodeColors[key as keyof typeof nodeColors],
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.position.copy(pos);
      ring.position.z -= 0.05;
      scene.add(ring);
    });

    // Spline Links between Nodes
    const links = [
      { from: nodePositions.wristband, to: nodePositions.hub, color: isEmergencyActive ? 0xef4444 : 0x06b6d4 },
      { from: nodePositions.dispenser, to: nodePositions.hub, color: 0x10b981 },
      { from: nodePositions.hub, to: nodePositions.cloud, color: 0x818cf8 },
      { from: nodePositions.cloud, to: nodePositions.caregiver, color: 0x38bdf8 }
    ];

    const curves: THREE.QuadraticBezierCurve3[] = [];
    const particles: THREE.Mesh[] = [];

    links.forEach(link => {
      const mid = new THREE.Vector3().addVectors(link.from, link.to).multiplyScalar(0.5);
      mid.y += 1.0; // arch curve

      const curve = new THREE.QuadraticBezierCurve3(link.from, mid, link.to);
      curves.push(curve);

      const points = curve.getPoints(40);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(points);
      const lineMat = new THREE.LineBasicMaterial({ color: link.color, transparent: true, opacity: 0.5 });
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);

      // Packet
      const pGeo = new THREE.SphereGeometry(0.12, 8, 8);
      const pMat = new THREE.MeshBasicMaterial({ color: link.color });
      const p = new THREE.Mesh(pGeo, pMat);
      scene.add(p);
      particles.push(p);
    });

    // Resize
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const w = entry.contentRect.width;
        const h = entry.contentRect.height || 340;
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

      // Rotate Hub mesh
      if (nodeMeshes.hub) {
        nodeMeshes.hub.rotation.y = elapsed * 0.5;
        nodeMeshes.hub.rotation.x = elapsed * 0.3;
      }

      // Animate packet pulses along curves
      curves.forEach((curve, i) => {
        const t = (elapsed * 0.7 + i * 0.25) % 1;
        if (particles[i]) {
          particles[i].position.copy(curve.getPoint(t));
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, [devices, isEmergencyActive]);

  return (
    <div className="relative w-full rounded-2xl overflow-hidden glass-panel border border-cyan-500/20 p-4">
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* 3D Topology Canvas */}
        <div className="relative w-full lg:w-3/5 h-[320px] flex items-center justify-center">
          <div ref={mountRef} className="w-full h-full" />

          {/* Top Label */}
          <div className="absolute top-2 left-2 flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900/80 border border-slate-700/60 text-xs font-mono text-cyan-300">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            3D IOT MESH TOPOLOGY
          </div>

          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px] font-mono text-slate-400 bg-slate-950/80 px-3 py-1 rounded border border-slate-800">
            <span>Latency: 8ms</span>
            <span>MQTT Broker: Connected</span>
            <span>Packet Loss: 0.0%</span>
          </div>
        </div>

        {/* Node Specs List */}
        <div className="w-full lg:w-2/5 flex flex-col gap-2">
          <div className="text-xs font-mono text-cyan-400 tracking-wider uppercase mb-1">
            Active IoT Node Channels
          </div>

          {nodesInfo.map((node) => {
            const isSelected = selectedNode === node.name;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node.name)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                  isSelected
                    ? 'bg-cyan-950/50 border-cyan-400 shadow-md shadow-cyan-500/10'
                    : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-semibold text-white">{node.name}</span>
                  </div>
                  <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800">
                    {node.protocol.split(' ')[0]}
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1">
                  Topic: <span className="text-slate-300">{node.topic}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
