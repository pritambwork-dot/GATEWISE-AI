'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

interface Campus3DViewProps {
  className?: string;
  showControls?: boolean;
  interactive?: boolean;
}

export default function Campus3DView({
  className = '',
  showControls = true,
  interactive = true,
}: Campus3DViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webGLSupported, setWebGLSupported] = useState<boolean | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeCheckpoint, setActiveCheckpoint] = useState<'GATE-01' | 'GATE-02'>('GATE-01');

  useEffect(() => {
    // Check WebGL availability
    try {
      const canvas = document.createElement('canvas');
      const isSupported = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
      );
      setWebGLSupported(isSupported);
      if (!isSupported) return;
    } catch {
      setWebGLSupported(false);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    // Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf4f8f5);
    scene.fog = new THREE.FogExp2(0xf4f8f5, 0.015);

    // Camera
    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(28, 22, 34);
    camera.lookAt(0, 2, 0);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // Lighting (Soft Daylight)
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0xc7e7d8, 0.85);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 1.2);
    dirLight.position.set(30, 45, 20);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 100;
    dirLight.shadow.camera.left = -30;
    dirLight.shadow.camera.right = 30;
    dirLight.shadow.camera.top = 30;
    dirLight.shadow.camera.bottom = -30;
    scene.add(dirLight);

    const ambientLight = new THREE.AmbientLight(0xdcf1e6, 0.4);
    scene.add(ambientLight);

    // Group for entire campus
    const campusGroup = new THREE.Group();
    scene.add(campusGroup);

    // 1. Campus Ground & Lawns
    const groundGeo = new THREE.PlaneGeometry(90, 90);
    const groundMat = new THREE.MeshLambertMaterial({ color: 0xebf2ec });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    campusGroup.add(ground);

    // 2. Entrance Road & Security Checkpoint Ingress
    const roadGeo = new THREE.PlaneGeometry(14, 80);
    const roadMat = new THREE.MeshLambertMaterial({ color: 0x223028 });
    const road = new THREE.Mesh(roadGeo, roadMat);
    road.rotation.x = -Math.PI / 2;
    road.position.set(0, 0.02, 0);
    road.receiveShadow = true;
    campusGroup.add(road);

    // Road Divider & Markings
    for (let z = -35; z <= 35; z += 6) {
      const lineGeo = new THREE.PlaneGeometry(0.35, 3);
      const lineMat = new THREE.MeshBasicMaterial({ color: 0xc7e7d8 });
      const line = new THREE.Mesh(lineGeo, lineMat);
      line.rotation.x = -Math.PI / 2;
      line.position.set(0, 0.04, z);
      campusGroup.add(line);
    }

    // 3. Security Perimeter Portal Arch (GATE-01)
    const archGroup = new THREE.Group();
    archGroup.position.set(0, 0, 5);

    // Left Column
    const colGeo = new THREE.BoxGeometry(1.6, 7, 2);
    const colMat = new THREE.MeshLambertMaterial({ color: 0x176346 });
    const leftCol = new THREE.Mesh(colGeo, colMat);
    leftCol.position.set(-8, 3.5, 0);
    leftCol.castShadow = true;
    archGroup.add(leftCol);

    // Right Column
    const rightCol = new THREE.Mesh(colGeo, colMat);
    rightCol.position.set(8, 3.5, 0);
    rightCol.castShadow = true;
    archGroup.add(rightCol);

    // Overhead Header Beam
    const beamGeo = new THREE.BoxGeometry(18, 1.8, 2.4);
    const beamMat = new THREE.MeshLambertMaterial({ color: 0x23865d });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.set(0, 7.2, 0);
    beam.castShadow = true;
    archGroup.add(beam);

    // Active Verification Status Beacon
    const beaconGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.6, 16);
    const beaconMat = new THREE.MeshBasicMaterial({ color: 0x26865e });
    const beacon = new THREE.Mesh(beaconGeo, beaconMat);
    beacon.position.set(0, 8.4, 0);
    archGroup.add(beacon);

    // Guard Security Kiosk (Checkpoint Booth)
    const kioskGeo = new THREE.BoxGeometry(3.2, 4.5, 4);
    const kioskMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const kiosk = new THREE.Mesh(kioskGeo, kioskMat);
    kiosk.position.set(-5, 2.25, 0);
    kiosk.castShadow = true;
    kiosk.receiveShadow = true;
    archGroup.add(kiosk);

    // Kiosk Glass Ribbon
    const glassGeo = new THREE.BoxGeometry(3.3, 1.6, 3.8);
    const glassMat = new THREE.MeshLambertMaterial({ color: 0x3a9b8b, transparent: true, opacity: 0.7 });
    const kioskGlass = new THREE.Mesh(glassGeo, glassMat);
    kioskGlass.position.set(-5, 2.8, 0);
    archGroup.add(kioskGlass);

    // Automatic Access Barrier
    const barrierGeo = new THREE.CylinderGeometry(0.12, 0.12, 6, 8);
    const barrierMat = new THREE.MeshLambertMaterial({ color: 0xc85b57 });
    const barrier = new THREE.Mesh(barrierGeo, barrierMat);
    barrier.rotation.z = Math.PI / 2;
    barrier.position.set(3, 1.2, 0);
    archGroup.add(barrier);

    campusGroup.add(archGroup);

    // 4. Institutional Academic & Research Pavilions
    // Main Academic Hall (Left background)
    const bldg1Geo = new THREE.BoxGeometry(16, 12, 22);
    const bldgMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const bldg1 = new THREE.Mesh(bldg1Geo, bldgMat);
    bldg1.position.set(-22, 6, -14);
    bldg1.castShadow = true;
    bldg1.receiveShadow = true;
    campusGroup.add(bldg1);

    // Glass facade ribbon on Building 1
    const bldg1GlassGeo = new THREE.BoxGeometry(16.2, 8, 18);
    const bldg1Glass = new THREE.Mesh(bldg1GlassGeo, glassMat);
    bldg1Glass.position.set(-22, 6, -14);
    campusGroup.add(bldg1Glass);

    // Management & Research Block (Right background)
    const bldg2Geo = new THREE.BoxGeometry(14, 15, 18);
    const bldgMat2 = new THREE.MeshLambertMaterial({ color: 0xedf4ef });
    const bldg2 = new THREE.Mesh(bldg2Geo, bldgMat2);
    bldg2.position.set(22, 7.5, -16);
    bldg2.castShadow = true;
    bldg2.receiveShadow = true;
    campusGroup.add(bldg2);

    // Central Clock / Administrative Tower
    const towerGeo = new THREE.BoxGeometry(6, 20, 6);
    const towerMat = new THREE.MeshLambertMaterial({ color: 0x176346 });
    const tower = new THREE.Mesh(towerGeo, towerMat);
    tower.position.set(-10, 10, -25);
    tower.castShadow = true;
    campusGroup.add(tower);

    // 5. Stylized Trees & Landscaping
    const createTree = (x: number, z: number, scale = 1) => {
      const tree = new THREE.Group();
      tree.position.set(x, 0, z);

      const trunkGeo = new THREE.CylinderGeometry(0.3 * scale, 0.4 * scale, 2.5 * scale, 6);
      const trunkMat = new THREE.MeshLambertMaterial({ color: 0x5a483a });
      const trunk = new THREE.Mesh(trunkGeo, trunkMat);
      trunk.position.y = 1.25 * scale;
      trunk.castShadow = true;
      tree.add(trunk);

      const foliageGeo = new THREE.ConeGeometry(2 * scale, 4 * scale, 7);
      const foliageMat = new THREE.MeshLambertMaterial({ color: 0x23865d });
      const foliage = new THREE.Mesh(foliageGeo, foliageMat);
      foliage.position.y = 4 * scale;
      foliage.castShadow = true;
      tree.add(foliage);

      return tree;
    };

    const treePositions = [
      [-10, 15, 1.2], [-14, 12, 1.0], [-12, 2, 0.9], [-11, -8, 1.1],
      [10, 15, 1.1], [13, 11, 0.9], [12, -2, 1.2], [14, -10, 1.0],
      [-5, -20, 1.3], [7, -22, 1.1], [25, 5, 1.4], [-25, 20, 1.2]
    ];
    treePositions.forEach(([x, z, s]) => campusGroup.add(createTree(x, z, s)));

    // 6. Ingress Vehicle Model (Campus Transport)
    const carGroup = new THREE.Group();
    const carBodyGeo = new THREE.BoxGeometry(2.4, 1.5, 4.2);
    const carMat = new THREE.MeshLambertMaterial({ color: 0x3a9b8b });
    const carBody = new THREE.Mesh(carBodyGeo, carMat);
    carBody.position.y = 1.1;
    carBody.castShadow = true;
    carGroup.add(carBody);

    const carCabinGeo = new THREE.BoxGeometry(2.1, 1.1, 2.2);
    const carCabinMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    const carCabin = new THREE.Mesh(carCabinGeo, carCabinMat);
    carCabin.position.set(0, 2.1, -0.4);
    carGroup.add(carCabin);

    carGroup.position.set(3, 0, 18);
    campusGroup.add(carGroup);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
    };

    if (interactive) {
      container.addEventListener('mousemove', handleMouseMove);
    }

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Gentle auto-rotation
      targetX += (mouseX * 0.15 - targetX) * 0.05;
      targetY += (mouseY * 0.1 - targetY) * 0.05;

      campusGroup.rotation.y = Math.sin(elapsedTime * 0.15) * 0.08 + targetX;
      camera.position.y = 22 + targetY * 4;

      // Pulse security beacon
      const beaconScale = 1 + Math.sin(elapsedTime * 3) * 0.15;
      beacon.scale.set(beaconScale, beaconScale, beaconScale);

      // Subtle barrier animation
      barrier.rotation.y = Math.sin(elapsedTime * 0.5) * 0.05;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (interactive) {
        container.removeEventListener('mousemove', handleMouseMove);
      }
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [interactive]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full h-full min-h-[380px] rounded-3xl overflow-hidden ${className}`}
    >
      {/* Fallback when WebGL is unavailable */}
      {webGLSupported === false && (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 bg-gradient-to-b from-gatewise-light/40 to-white text-center">
          <div className="w-16 h-16 rounded-2xl bg-gatewise-light border border-gatewise-mint flex items-center justify-center text-gatewise-primary mb-4 shadow-sm">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h4 className="font-extrabold text-base text-gatewise-text">GATEWISE AI Campus Perimeter</h4>
          <p className="text-xs text-gatewise-secondary max-w-sm mt-1">
            Artistic daylight rendering of campus gate checkpoints, security booths, and administrative pavilions.
          </p>
        </div>
      )}

      {/* Floating HUD Telemetry Badge */}
      {showControls && (
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-gatewise-border shadow-xs flex items-center space-x-2 text-[11px] font-bold text-gatewise-text pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Perimeter Checkpoint 01 · Active Telemetry</span>
          </div>

          <div className="hidden sm:flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/80 backdrop-blur-sm border border-gatewise-border text-[10px] text-gatewise-secondary font-mono pointer-events-auto">
            <span>Drag to inspect 3D campus</span>
          </div>
        </div>
      )}
    </div>
  );
}
