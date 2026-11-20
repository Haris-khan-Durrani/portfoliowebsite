'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { AnimatePresence, motion } from 'motion/react';
import {
  ArrowUpRight,
  Box,
  ChevronLeft,
  ChevronRight,
  Infinity as InfinityIcon,
  Layers,
  Move3d,
  Sparkles,
} from 'lucide-react';
import { TOPOLOGY_NODES, type TopologyNode } from '@/data/portfolio';
import { cn } from '@/lib/utils';

type SculptureMode = 'cube' | 'stack' | 'chrome';

interface HeroSculpture3DProps {
  theme: 'dark' | 'light';
  onOpenBlueprint: (slug: string) => void;
}

const MODE_OPTIONS: { id: SculptureMode; label: string; icon: typeof Box }[] = [
  { id: 'cube', label: 'Matrix Cube', icon: Box },
  { id: 'stack', label: 'Glass Stack', icon: Layers },
  { id: 'chrome', label: 'Liquid Chrome', icon: InfinityIcon },
];

function buildStudioEnvironment(renderer: THREE.WebGLRenderer, isLight: boolean) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(isLight ? 0xe8edf5 : 0x05070d);

  // Overhead primary white photography softbox
  const topSoftbox = new THREE.Mesh(
    new THREE.PlaneGeometry(14, 6),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(2.4, 2.5, 2.7), side: THREE.DoubleSide })
  );
  topSoftbox.position.set(0, 7, 1);
  topSoftbox.rotation.x = Math.PI / 2;
  envScene.add(topSoftbox);

  // Right Acid-Lime signature studio rim light panel
  const rightLimePanel = new THREE.Mesh(
    new THREE.PlaneGeometry(9, 10),
    new THREE.MeshBasicMaterial({
      color: isLight ? new THREE.Color(1.4, 2.2, 0.3) : new THREE.Color(2.2, 3.0, 0.55),
      side: THREE.DoubleSide,
    })
  );
  rightLimePanel.position.set(8, 1.5, 2);
  rightLimePanel.rotation.y = -Math.PI / 2;
  envScene.add(rightLimePanel);

  // Left Electric-Cyan studio key light panel
  const leftCyanPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(9, 10),
    new THREE.MeshBasicMaterial({
      color: isLight ? new THREE.Color(0.25, 1.4, 2.3) : new THREE.Color(0.45, 2.1, 3.0),
      side: THREE.DoubleSide,
    })
  );
  leftCyanPanel.position.set(-8, -0.5, 3);
  leftCyanPanel.rotation.y = Math.PI / 2;
  envScene.add(leftCyanPanel);

  // Crisp front-top specular ribbon for chrome highlights
  const frontStrip = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 1.6),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(2.8, 2.8, 2.9), side: THREE.DoubleSide })
  );
  frontStrip.position.set(0, 4.5, 8);
  frontStrip.lookAt(0, 0, 0);
  envScene.add(frontStrip);

  // Subtle rear edge-separation strip
  const backStrip = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 4),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(0.7, 1.2, 1.6), side: THREE.DoubleSide })
  );
  backStrip.position.set(0, -3, -8);
  envScene.add(backStrip);

  const renderTarget = pmrem.fromScene(envScene, 0.035);
  pmrem.dispose();

  // Clean up temporary studio meshes
  envScene.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry.dispose();
      if (obj.material instanceof THREE.Material) obj.material.dispose();
    }
  });

  return renderTarget;
}

function easeInOutCubic(x: number): number {
  return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
}

export function HeroSculpture3D({ theme, onOpenBlueprint }: HeroSculpture3DProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [mode, setMode] = useState<SculptureMode>('cube');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const modeRef = useRef<SculptureMode>(mode);
  modeRef.current = mode;

  const activeNode: TopologyNode = TOPOLOGY_NODES[activeIndex];
  const activeTierRef = useRef(0);
  activeTierRef.current = activeIndex % 4;

  const hoverRef = useRef(false);
  const impulseRef = useRef(0);
  const dragRef = useRef({
    dragging: false,
    lastX: 0,
    lastY: 0,
    rotY: -0.62,
    rotX: 0.42,
    velY: 0,
    velX: 0,
  });

  const switchSystem = (idx: number) => {
    const normalized = (idx + TOPOLOGY_NODES.length) % TOPOLOGY_NODES.length;
    setActiveIndex(normalized);
    impulseRef.current = 1.0;
    dragRef.current.velY += 0.05;
  };

  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isLight = theme === 'light';

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isLight ? 1.08 : 1.24;

    const scene = new THREE.Scene();
    const envTarget = buildStudioEnvironment(renderer, isLight);
    scene.environment = envTarget.texture;

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0.25, 7.6);

    const resize = () => {
      const rect = stage.getBoundingClientRect();
      const w = Math.max(1, rect.width);
      const h = Math.max(1, rect.height);
      camera.aspect = w / h;
      camera.position.z = w < 440 ? 8.8 : 7.5;
      camera.updateProjectionMatrix();
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, w < 520 ? 1.5 : 2));
      renderer.setSize(w, h, false);
    };
    resize();

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(stage);

    // Subtle studio physical lights to complement the HDRI environment map
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(4, 6, 5);
    scene.add(keyLight);

    const limeRimLight = new THREE.PointLight(0xc8ff3d, 22, 16);
    limeRimLight.position.set(4.5, 2.2, 2.5);
    scene.add(limeRimLight);

    const cyanFillLight = new THREE.PointLight(0x38bdf8, 16, 16);
    cyanFillLight.position.set(-4.5, -1.8, 3.0);
    scene.add(cyanFillLight);

    // Master sculpture pivot container (controlled by drag + float)
    const rootPivot = new THREE.Group();
    rootPivot.position.y = 0.28;
    scene.add(rootPivot);

    // Shared Premium PBR Materials
    const darkTitaniumMat = new THREE.MeshPhysicalMaterial({
      color: isLight ? 0x1a2232 : 0x0d1018,
      metalness: 0.92,
      roughness: 0.16,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      envMapIntensity: 1.5,
    });

    const obsidianGlassMat = new THREE.MeshPhysicalMaterial({
      color: isLight ? 0x263147 : 0x141925,
      metalness: 0.85,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      iridescence: 0.45,
      iridescenceIOR: 1.35,
      envMapIntensity: 1.7,
    });

    const limeEmissiveMat = new THREE.MeshStandardMaterial({
      color: 0xc8ff3d,
      emissive: 0xc8ff3d,
      emissiveIntensity: 2.1,
      roughness: 0.2,
      metalness: 0.3,
    });

    const cyanEmissiveMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 1.85,
      roughness: 0.2,
      metalness: 0.3,
    });

    // =========================================================================
    // MODE 1: KINETIC 3x3x3 OBSIDIAN-TITANIUM MATRIX CUBE (DEFAULT SHOWSTOPPER)
    // =========================================================================
    const cubeGroup = new THREE.Group();
    rootPivot.add(cubeGroup);

    const cubieGeo = new RoundedBoxGeometry(0.68, 0.68, 0.68, 4, 0.095);
    const bevelAccentGeo = new THREE.BoxGeometry(0.705, 0.045, 0.705);
    const spacing = 0.76;

    interface CubieRecord {
      mesh: THREE.Group;
      gx: number;
      gy: number;
      gz: number;
      isCore: boolean;
    }

    const cubies: CubieRecord[] = [];
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          const isCore = x === 0 && y === 0 && z === 0;
          const isCorner = Math.abs(x) + Math.abs(y) + Math.abs(z) === 3;
          const isEdgeCenter = Math.abs(x) + Math.abs(y) + Math.abs(z) === 1;

          const holder = new THREE.Group();
          const mat = isCore
            ? limeEmissiveMat
            : isCorner
              ? obsidianGlassMat
              : darkTitaniumMat;

          const boxMesh = new THREE.Mesh(cubieGeo, mat);
          holder.add(boxMesh);

          // Precision illuminated architectural accents on select face-center & corner modules
          if (isEdgeCenter) {
            const strip = new THREE.Mesh(
              bevelAccentGeo,
              y !== 0 ? limeEmissiveMat : cyanEmissiveMat
            );
            if (x !== 0) strip.rotation.z = Math.PI / 2;
            if (z !== 0) strip.rotation.x = Math.PI / 2;
            holder.add(strip);
          }

          holder.position.set(x * spacing, y * spacing, z * spacing);
          cubeGroup.add(holder);
          cubies.push({ mesh: holder, gx: x, gy: y, gz: z, isCore });
        }
      }
    }

    // Inner incandescent core glow light inside the cube matrix
    const coreInnerGlow = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.56, 1),
      limeEmissiveMat
    );
    cubeGroup.add(coreInnerGlow);

    // Kinetic Rubik slice twist state
    const twistPivot = new THREE.Group();
    cubeGroup.add(twistPivot);

    const twistState = {
      active: false,
      axis: 'y' as 'x' | 'y' | 'z',
      layer: 1,
      dir: 1,
      progress: 0,
      cooldown: 1.4,
      affected: [] as CubieRecord[],
    };

    const startSliceTwist = () => {
      if (twistState.active) return;
      const axes: ('x' | 'y' | 'z')[] = ['x', 'y', 'z'];
      const axis = axes[Math.floor(Math.random() * 3)];
      const layer = Math.random() > 0.5 ? 1 : -1;
      const dir = Math.random() > 0.5 ? 1 : -1;

      const affected = cubies.filter((c) => {
        if (axis === 'x') return c.gx === layer;
        if (axis === 'y') return c.gy === layer;
        return c.gz === layer;
      });

      twistPivot.rotation.set(0, 0, 0);
      twistPivot.position.set(0, 0, 0);
      affected.forEach((c) => twistPivot.attach(c.mesh));

      twistState.active = true;
      twistState.axis = axis;
      twistState.layer = layer;
      twistState.dir = dir;
      twistState.progress = 0;
      twistState.affected = affected;
    };

    const finishSliceTwist = () => {
      const angle = (Math.PI / 2) * twistState.dir;
      twistPivot.rotation[twistState.axis] = angle;
      twistPivot.updateMatrixWorld();

      const cos = Math.round(Math.cos(angle));
      const sin = Math.round(Math.sin(angle));

      twistState.affected.forEach((c) => {
        cubeGroup.attach(c.mesh);
        // Update integer grid coordinates cleanly
        const { gx, gy, gz } = c;
        if (twistState.axis === 'x') {
          c.gy = Math.round(gy * cos - gz * sin);
          c.gz = Math.round(gy * sin + gz * cos);
        } else if (twistState.axis === 'y') {
          c.gx = Math.round(gx * cos + gz * sin);
          c.gz = Math.round(-gx * sin + gz * cos);
        } else {
          c.gx = Math.round(gx * cos - gy * sin);
          c.gy = Math.round(gx * sin + gy * cos);
        }
        // Snap orientation to nearest 90° increment so floating-point error never accumulates
        c.mesh.rotation.x = Math.round(c.mesh.rotation.x / (Math.PI / 2)) * (Math.PI / 2);
        c.mesh.rotation.y = Math.round(c.mesh.rotation.y / (Math.PI / 2)) * (Math.PI / 2);
        c.mesh.rotation.z = Math.round(c.mesh.rotation.z / (Math.PI / 2)) * (Math.PI / 2);
      });

      twistPivot.rotation.set(0, 0, 0);
      twistState.active = false;
      twistState.affected = [];
      twistState.cooldown = 2.1;
    };

    // =========================================================================
    // MODE 2: 4-TIER ISOMETRIC EXPLODED ARCHITECTURE GLASS STACK
    // =========================================================================
    const stackGroup = new THREE.Group();
    stackGroup.visible = false;
    rootPivot.add(stackGroup);

    const bladeGeo = new RoundedBoxGeometry(2.55, 0.2, 2.55, 4, 0.06);
    const bladeRimGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(2.58, 0.22, 2.58));
    const chipGeo = new RoundedBoxGeometry(0.42, 0.07, 0.42, 2, 0.02);

    const stackBlades: {
      group: THREE.Group;
      rimMat: THREE.LineBasicMaterial;
      ledMat: THREE.MeshStandardMaterial;
      baseY: number;
    }[] = [];

    for (let i = 0; i < 4; i++) {
      const bladeHolder = new THREE.Group();
      const baseY = (1.5 - i) * 0.72;
      bladeHolder.position.y = baseY;

      const slab = new THREE.Mesh(bladeGeo, i % 2 === 0 ? obsidianGlassMat : darkTitaniumMat);
      bladeHolder.add(slab);

      const rimMat = new THREE.LineBasicMaterial({
        color: i === 0 ? 0xc8ff3d : 0x38bdf8,
        transparent: true,
        opacity: i === 0 ? 0.95 : 0.45,
      });
      const rim = new THREE.LineSegments(bladeRimGeo, rimMat);
      bladeHolder.add(rim);

      // Architectural processor chips & glowing traces on top of each slab
      const ledMat = new THREE.MeshStandardMaterial({
        color: i === 0 ? 0xc8ff3d : 0x38bdf8,
        emissive: i === 0 ? 0xc8ff3d : 0x38bdf8,
        emissiveIntensity: i === 0 ? 2.2 : 0.85,
        roughness: 0.25,
      });

      const chipPositions: [number, number][] = [
        [-0.62, -0.62],
        [0.62, -0.62],
        [-0.62, 0.62],
        [0.62, 0.62],
        [0, 0],
      ];
      chipPositions.forEach(([cx, cz], idx) => {
        const chip = new THREE.Mesh(chipGeo, idx === 4 ? ledMat : darkTitaniumMat);
        chip.position.set(cx, 0.125, cz);
        bladeHolder.add(chip);
      });

      stackGroup.add(bladeHolder);
      stackBlades.push({ group: bladeHolder, rimMat, ledMat, baseY });
    }

    // 4 Vertical Fiber-Optic Data Pillars piercing all 4 architectural blades
    const pillarGeo = new THREE.CylinderGeometry(0.016, 0.016, 3.1, 10);
    const pillarMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.35,
    });
    const pulseBeadGeo = new THREE.SphereGeometry(0.055, 10, 10);
    const pulseBeads: { mesh: THREE.Mesh; offset: number; x: number; z: number }[] = [];

    const corners: [number, number][] = [
      [-1.02, -1.02],
      [1.02, -1.02],
      [-1.02, 1.02],
      [1.02, 1.02],
    ];
    corners.forEach(([px, pz], idx) => {
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(px, 0, pz);
      stackGroup.add(pillar);

      const bead = new THREE.Mesh(
        pulseBeadGeo,
        idx % 2 === 0 ? limeEmissiveMat : cyanEmissiveMat
      );
      bead.position.set(px, 0, pz);
      stackGroup.add(bead);
      pulseBeads.push({ mesh: bead, offset: idx * 0.25, x: px, z: pz });
    });

    // =========================================================================
    // MODE 3: LIQUID-CHROME IRIDESCENT INFINITY SCULPTURE (APPLE / FRAMER STYLE)
    // =========================================================================
    const chromeGroup = new THREE.Group();
    chromeGroup.visible = false;
    rootPivot.add(chromeGroup);

    const knotGeo = new THREE.TorusKnotGeometry(1.12, 0.34, 240, 52, 2, 3);
    const liquidChromeMat = new THREE.MeshPhysicalMaterial({
      color: isLight ? 0xe8eef6 : 0xdbe6f4,
      metalness: 1.0,
      roughness: 0.055,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      iridescence: 1.0,
      iridescenceIOR: 1.48,
      iridescenceThicknessRange: [140, 520],
      envMapIntensity: 1.75,
    });
    const chromeMesh = new THREE.Mesh(knotGeo, liquidChromeMat);
    chromeGroup.add(chromeMesh);

    const haloGeo = new THREE.TorusGeometry(2.15, 0.012, 16, 160);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xc8ff3d,
      transparent: true,
      opacity: 0.45,
    });
    const haloRing = new THREE.Mesh(haloGeo, haloMat);
    haloRing.rotation.x = Math.PI * 0.48;
    chromeGroup.add(haloRing);

    // Pause WebGL when hero is off-screen
    let inView = true;
    const io = new IntersectionObserver(
      (entries) => {
        inView = entries[0]?.isIntersecting ?? true;
      },
      { threshold: 0.02 }
    );
    io.observe(stage);

    let explodeSmooth = 0;
    const clock = new THREE.Clock();
    let rafId = 0;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      if (!inView || document.hidden) return;

      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.getElapsedTime();
      const speed = prefersReduced ? 0.15 : 1;

      // Toggle visible sculpture mode cleanly
      const activeMode = modeRef.current;
      cubeGroup.visible = activeMode === 'cube';
      stackGroup.visible = activeMode === 'stack';
      chromeGroup.visible = activeMode === 'chrome';

      impulseRef.current = Math.max(0, impulseRef.current - dt * 1.9);
      const targetExplode = (hoverRef.current ? 0.14 : 0) + impulseRef.current * 0.24;
      explodeSmooth += (targetExplode - explodeSmooth) * 0.09;

      // Smooth drag rotation + gentle idle drift
      const drag = dragRef.current;
      if (!drag.dragging) {
        drag.rotY += drag.velY + 0.0042 * speed;
        drag.rotX += drag.velX;
        drag.velY *= 0.93;
        drag.velX *= 0.93;
        const targetRestX = activeMode === 'stack' ? 0.54 : 0.36;
        drag.rotX += (targetRestX - drag.rotX) * 0.025;
      }

      rootPivot.rotation.y = drag.rotY;
      rootPivot.rotation.x = THREE.MathUtils.clamp(drag.rotX, -0.75, 0.85);
      rootPivot.position.y = 0.28 + Math.sin(t * 1.15) * 0.09;

      // Animate Mode 1: Kinetic Matrix Cube
      if (activeMode === 'cube') {
        const dynamicSpacing = spacing * (1 + explodeSmooth * 0.65);

        if (!prefersReduced && !drag.dragging) {
          if (twistState.active) {
            twistState.progress += dt * 1.25;
            if (twistState.progress >= 1) {
              finishSliceTwist();
            } else {
              const eased = easeInOutCubic(twistState.progress);
              twistPivot.rotation[twistState.axis] = (Math.PI / 2) * twistState.dir * eased;
            }
          } else {
            twistState.cooldown -= dt;
            if (twistState.cooldown <= 0) {
              startSliceTwist();
            }
          }
        }

        // Smooth radial breathe/explode on non-twisting cubies
        cubies.forEach((c) => {
          if (twistState.active && twistState.affected.includes(c)) return;
          const tx = c.gx * dynamicSpacing;
          const ty = c.gy * dynamicSpacing;
          const tz = c.gz * dynamicSpacing;
          c.mesh.position.x += (tx - c.mesh.position.x) * 0.14;
          c.mesh.position.y += (ty - c.mesh.position.y) * 0.14;
          c.mesh.position.z += (tz - c.mesh.position.z) * 0.14;
        });

        coreInnerGlow.rotation.y = -t * 1.4;
        coreInnerGlow.rotation.x = t * 0.9;
        coreInnerGlow.scale.setScalar(1 + Math.sin(t * 3.2) * 0.06 + impulseRef.current * 0.18);
      }

      // Animate Mode 2: 4-Tier Isometric Architecture Glass Stack
      if (activeMode === 'stack') {
        const spread = 1 + explodeSmooth * 0.95;
        const activeTier = activeTierRef.current;

        stackBlades.forEach((b, i) => {
          const isTierActive = i === activeTier;
          const targetY = b.baseY * spread + (isTierActive ? 0.06 : 0);
          b.group.position.y += (targetY - b.group.position.y) * 0.12;
          b.group.rotation.y = Math.sin(t * 0.8 + i * 0.7) * 0.04;

          b.rimMat.color.setHex(isTierActive ? 0xc8ff3d : 0x38bdf8);
          b.rimMat.opacity = isTierActive ? 0.98 : 0.35;
          b.ledMat.color.setHex(isTierActive ? 0xc8ff3d : 0x38bdf8);
          b.ledMat.emissive.setHex(isTierActive ? 0xc8ff3d : 0x38bdf8);
          b.ledMat.emissiveIntensity = isTierActive ? 2.6 : 0.7;
        });

        pulseBeads.forEach((pb) => {
          const cycle = ((t * 0.55 + pb.offset) % 1) * 2 - 1;
          pb.mesh.position.y = cycle * 1.45 * spread;
        });
      }

      // Animate Mode 3: Liquid Chrome Infinity Knot
      if (activeMode === 'chrome') {
        chromeMesh.rotation.x = t * 0.28 * speed;
        chromeMesh.rotation.z = t * 0.18 * speed;
        chromeMesh.scale.setScalar(1 + explodeSmooth * 0.14);
        haloRing.rotation.z = -t * 0.4 * speed;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      io.disconnect();
      envTarget.dispose();
      cubieGeo.dispose();
      bevelAccentGeo.dispose();
      bladeGeo.dispose();
      bladeRimGeo.dispose();
      chipGeo.dispose();
      pillarGeo.dispose();
      pillarMat.dispose();
      pulseBeadGeo.dispose();
      knotGeo.dispose();
      liquidChromeMat.dispose();
      haloGeo.dispose();
      haloMat.dispose();
      darkTitaniumMat.dispose();
      obsidianGlassMat.dispose();
      limeEmissiveMat.dispose();
      cyanEmissiveMat.dispose();
      stackBlades.forEach((b) => {
        b.rimMat.dispose();
        b.ledMat.dispose();
      });
      renderer.dispose();
    };
  }, [theme]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button, a')) return;
    dragRef.current.dragging = true;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag.dragging) return;
    const dx = e.clientX - drag.lastX;
    const dy = e.clientY - drag.lastY;
    drag.lastX = e.clientX;
    drag.lastY = e.clientY;
    drag.rotY += dx * 0.0085;
    drag.rotX += dy * 0.0065;
    drag.velY = dx * 0.0024;
    drag.velX = dy * 0.0018;
  };

  const handlePointerUp = () => {
    dragRef.current.dragging = false;
    setIsDragging(false);
  };

  return (
    <div
      ref={stageRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={() => {
        hoverRef.current = true;
      }}
      onMouseLeave={() => {
        hoverRef.current = false;
        dragRef.current.dragging = false;
        setIsDragging(false);
      }}
      className={cn(
        'relative h-[400px] w-full select-none touch-pan-y sm:h-[470px] lg:h-[530px] xl:h-[560px]',
        isDragging ? 'cursor-grabbing' : 'cursor-grab'
      )}
    >
      {/* Subtle Studio Volumetric Halo Behind Object */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[43%] h-[290px] w-[290px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(200,255,61,0.16)_0%,rgba(56,189,248,0.1)_44%,transparent_72%)] blur-2xl sm:h-[390px] sm:w-[390px]"
      />

      {/* Full-Stage Frameless Studio PBR Three.js Canvas */}
      <canvas
        ref={canvasRef}
        aria-label="Interactive 3D architectural sculpture — drag to rotate"
        className="absolute inset-0 h-full w-full"
      />

      {/* Top Bar: Minimalist 3D Sculpture Mode Switcher + Drag Cue */}
      <div className="absolute left-0 right-0 top-1 z-30 flex flex-wrap items-center justify-between gap-2 px-1">
        <div
          role="tablist"
          aria-label="Switch 3D hero sculpture object"
          className="inline-flex items-center gap-0.5 rounded-full border border-[var(--line)] bg-[var(--header-bg)] p-1 backdrop-blur-xl"
        >
          {MODE_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const active = mode === opt.id;
            return (
              <button
                key={opt.id}
                role="tab"
                type="button"
                aria-selected={active}
                onClick={() => {
                  setMode(opt.id);
                  impulseRef.current = 0.85;
                }}
                className={cn(
                  'relative inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.08em] transition-colors cursor-pointer sm:px-3',
                  active ? 'text-[#060608]' : 'text-[var(--text-soft)] hover:text-[var(--page-text)]'
                )}
              >
                {active && (
                  <motion.span
                    layoutId="hero-3d-mode-pill"
                    transition={{ type: 'spring', stiffness: 420, damping: 30 }}
                    className="absolute inset-0 rounded-full bg-[var(--acid)]"
                  />
                )}
                <Icon className="relative z-10 h-3 w-3" />
                <span className="relative z-10">{opt.label}</span>
              </button>
            );
          })}
        </div>

        <div className="pointer-events-none hidden items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface-elevated)] px-3 py-1 font-mono text-[9.5px] uppercase tracking-[0.1em] text-[var(--text-faint)] backdrop-blur-md sm:inline-flex">
          <Move3d className="h-3 w-3 text-[var(--acid)]" />
          <span>Drag to Spin</span>
        </div>
      </div>

      {/* Bottom Floating Frosted Glass Spotlight Card */}
      <div className="absolute bottom-0 left-1/2 z-30 w-[min(100%,455px)] -translate-x-1/2">
        <div className="conic-beam overflow-hidden rounded-[22px] border border-[var(--header-border)] bg-[var(--header-bg)] p-3 shadow-[0_24px_64px_-12px_rgba(0,0,0,0.75)] backdrop-blur-2xl sm:p-3.5">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="flex items-center gap-3"
            >
              {activeNode.previewImage && (
                <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-[#07080d] sm:h-[60px] sm:w-[92px]">
                  <Image
                    src={activeNode.previewImage}
                    alt={`${activeNode.name} preview`}
                    fill
                    sizes="96px"
                    priority
                    className="object-cover"
                  />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.14em] text-[var(--acid)]">
                  <Sparkles className="h-2.5 w-2.5 shrink-0" />
                  <span className="truncate">
                    {activeNode.status} · {activeNode.protocol}
                  </span>
                </div>
                <div className="mt-0.5 truncate text-[13.5px] font-extrabold tracking-[-0.015em] text-[var(--page-text)] sm:text-[14.5px]">
                  {activeNode.name}
                </div>
                <div className="truncate font-mono text-[10px] text-[var(--text-soft)]">
                  {activeNode.metric}
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => switchSystem(activeIndex - 1)}
                  aria-label="Previous system"
                  className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--text-soft)] transition-colors hover:border-[var(--acid)] hover:text-[var(--acid)] cursor-pointer"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => switchSystem(activeIndex + 1)}
                  aria-label="Next system"
                  className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--text-soft)] transition-colors hover:border-[var(--acid)] hover:text-[var(--acid)] cursor-pointer"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onOpenBlueprint(activeNode.slug)}
                  aria-label={`Inspect ${activeNode.name} blueprint`}
                  title="Inspect Full Blueprint"
                  className="grid h-8 w-8 place-items-center rounded-full bg-[var(--acid)] text-[#060608] shadow-[0_0_16px_rgba(200,255,61,0.35)] transition-transform hover:scale-105 cursor-pointer"
                >
                  <ArrowUpRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
