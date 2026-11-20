'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CyberneticCoreCanvasProps {
  theme: 'dark' | 'light';
}

// Refined ambient 3D particle starfield across the entire page so it complements
// rather than competes with the Hero 3D Reactor sculpture.
export default function CyberneticCoreCanvas({ theme }: CyberneticCoreCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const matsRef = useRef<{
    starMat?: THREE.PointsMaterial;
    accentMat?: THREE.PointsMaterial;
  }>({});

  useEffect(() => {
    const isLight = theme === 'light';
    if (matsRef.current.starMat) {
      matsRef.current.starMat.color.setHex(isLight ? 0x0f172a : 0xf4f4f0);
      matsRef.current.starMat.opacity = isLight ? 0.16 : 0.28;
    }
    if (matsRef.current.accentMat) {
      matsRef.current.accentMat.color.setHex(isLight ? 0x65a30d : 0xc8ff3d);
      matsRef.current.accentMat.opacity = isLight ? 0.25 : 0.42;
    }
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 900;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
        powerPreference: 'high-performance',
      });
    } catch {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 12;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const isLightInit = document.documentElement.dataset.theme === 'light';
    const field = new THREE.Group();
    scene.add(field);

    const count = isMobile ? 120 : 280;
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 26;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 18;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const starMat = new THREE.PointsMaterial({
      size: 0.032,
      color: isLightInit ? 0x0f172a : 0xf4f4f0,
      transparent: true,
      opacity: isLightInit ? 0.16 : 0.28,
    });
    field.add(new THREE.Points(geo, starMat));

    const accentCount = isMobile ? 28 : 65;
    const accentPos = new Float32Array(accentCount * 3);
    for (let i = 0; i < accentCount; i++) {
      accentPos[i * 3] = (Math.random() - 0.5) * 24;
      accentPos[i * 3 + 1] = (Math.random() - 0.5) * 16;
      accentPos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    const accentGeo = new THREE.BufferGeometry();
    accentGeo.setAttribute('position', new THREE.BufferAttribute(accentPos, 3));
    const accentMat = new THREE.PointsMaterial({
      size: 0.045,
      color: isLightInit ? 0x65a30d : 0xc8ff3d,
      transparent: true,
      opacity: isLightInit ? 0.25 : 0.42,
    });
    field.add(new THREE.Points(accentGeo, accentMat));

    matsRef.current = { starMat, accentMat };

    let mouseX = 0;
    let mouseY = 0;
    const onPointerMove = (e: PointerEvent) => {
      mouseX = (e.clientX / window.innerWidth) * 2 - 1;
      mouseY = -((e.clientY / window.innerHeight) * 2 - 1);
    };

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('resize', onResize, { passive: true });

    let rafId = 0;
    const render = () => {
      rafId = requestAnimationFrame(render);
      if (document.hidden) return;
      const s = prefersReduced ? 0.1 : 1;
      field.rotation.y += 0.00025 * s;
      field.rotation.x += (mouseY * 0.06 - field.rotation.x) * 0.02;
      field.position.x += (mouseX * 0.35 - field.position.x) * 0.02;
      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('resize', onResize);
      geo.dispose();
      accentGeo.dispose();
      starMat.dispose();
      accentMat.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id="webgl"
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full opacity-90"
    />
  );
}
