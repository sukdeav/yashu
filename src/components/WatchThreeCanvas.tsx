import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { PARTS_DATA } from '../data/partsData.ts';
import { playSound } from '../utils/audio.ts';
import { Camera, ZoomIn, ZoomOut, RefreshCw, Tag } from 'lucide-react';

interface WatchThreeCanvasProps {
  activePartNum: number;
  onSelectPart: (num: number) => void;
  isExploded: boolean;
  explosionFactor: number;
  isAutoSpinning: boolean;
  showLabels: boolean;
  labelMode?: 'all' | 'selected' | 'none';
  onToggleLabels?: () => void;
  language: 'hi' | 'en';
}

export const WatchThreeCanvas: React.FC<WatchThreeCanvasProps> = ({
  activePartNum,
  onSelectPart,
  isExploded,
  explosionFactor,
  isAutoSpinning,
  showLabels,
  labelMode = 'all',
  onToggleLabels,
  language,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const watchGroupRef = useRef<THREE.Group | null>(null);
  const partsMeshesRef = useRef<THREE.Mesh[]>([]);
  const numberSpritesRef = useRef<THREE.Sprite[]>([]);
  const nameSpritesRef = useRef<THREE.Sprite[]>([]);
  const [cameraAngle, setCameraAngle] = useState<number>(0);
  const [isCapturing, setIsCapturing] = useState<boolean>(false);

  const GC = ['#ff9a1f', '#22e07a', '#c084fc', '#38bdf8', '#22d3ee', '#fbbf24'];
  const getGroupIndex = (i: number) => (i < 15 ? 0 : i < 19 ? 1 : i < 24 ? 2 : i < 28 ? 3 : i < 33 ? 4 : 5);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth || 700;
    const height = container.clientHeight || 520;

    // Detect software GL
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 1. Scene with deep cyber vignette
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x04070b);
    sceneRef.current = scene;

    // 2. Camera with isometric angle matching realistic photo
    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(7.5, 7.0, 11.5);
    cameraRef.current = camera;

    // 3. Renderer with high performance & preserveDrawingBuffer
    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true,
    });
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.replaceChildren(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 4;
    controls.maxDistance = 30;
    controls.target.set(0, 0.2, 0);
    controlsRef.current = controls;

    // 5. Studio Environment Map for metallic reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // Studio Lighting Rig
    scene.add(new THREE.HemisphereLight(0xffffff, 0x111e2e, 0.8));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.4);
    keyLight.position.set(6, 12, 8);
    keyLight.castShadow = !isSoftwareGl;
    scene.add(keyLight);

    const cyanRim = new THREE.PointLight(0x00f0ff, 1.8, 30);
    cyanRim.position.set(-6, 3, 5);
    scene.add(cyanRim);

    const orangeRim = new THREE.PointLight(0xff7700, 2.0, 30);
    orangeRim.position.set(6, -2, -5);
    scene.add(orangeRim);

    const greenUnderglow = new THREE.PointLight(0x10b981, 2.5, 12);
    greenUnderglow.position.set(0, -1.8, 0);
    scene.add(greenUnderglow);

    // Subtle dark floor grid
    const grid = new THREE.GridHelper(30, 30, 0x0f2838, 0x071520);
    grid.position.y = -4.5;
    scene.add(grid);

    // Watch Group
    const watchGroup = new THREE.Group();
    scene.add(watchGroup);
    watchGroupRef.current = watchGroup;

    // Helper functions for realistic geometries & textures
    const PI = Math.PI;
    function sh(w: number, d: number, r: number) {
      const s = new THREE.Shape();
      const x = -w / 2;
      const y = -d / 2;
      s.moveTo(x + r, y);
      s.lineTo(x + w - r, y);
      s.quadraticCurveTo(x + w, y, x + w, y + r);
      s.lineTo(x + w, y + d - r);
      s.quadraticCurveTo(x + w, y + d, x + w - r, y + d);
      s.lineTo(x + r, y + d);
      s.quadraticCurveTo(x, y + d, x, y + d - r);
      s.lineTo(x, y + r);
      s.quadraticCurveTo(x, y, x + r, y);
      return s;
    }

    function rr(w: number, d: number, h: number, r: number, hole?: number[]) {
      const s = sh(w, d, r);
      if (hole) s.holes.push(sh(hole[0], hole[1], hole[2]));
      const g = new THREE.ExtrudeGeometry(s, { depth: h, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.04, bevelThickness: 0.04, curveSegments: 16 });
      g.rotateX(-PI / 2);
      g.translate(0, -h / 2, 0);
      return g;
    }

    // High quality PBR materials
    const M_METAL = (c: number, r: number = 0.25, m: number = 0.85) =>
      new THREE.MeshStandardMaterial({ color: c, metalness: m, roughness: r });
    const B = (w: number, h: number, d: number) => new THREE.BoxGeometry(w, h, d);
    const C = (r: number, h: number) => new THREE.CylinderGeometry(r, r, h, 36);

    const P: THREE.Mesh[] = [];
    const S: THREE.Sprite[] = [];
    const NS: THREE.Sprite[] = [];

    function addPart(
      i: number,
      geo: THREE.BufferGeometry,
      mat: THREE.Material,
      basePos: [number, number, number],
      explPos: [number, number, number],
      rot?: [number, number, number]
    ) {
      const m = new THREE.Mesh(geo, mat);
      m.position.set(basePos[0], basePos[1], basePos[2]);
      if (rot) m.rotation.set(rot[0], rot[1], rot[2]);
      m.userData = {
        b: new THREE.Vector3(...basePos),
        o: new THREE.Vector3(...explPos),
        r: m.rotation.clone(),
        i: i,
      };
      watchGroup.add(m);

      if (i >= 0 && i < 45) {
        P[i] = m;
        // Sprite
        const spr = createNumberSprite(i + 1, GC[getGroupIndex(i)]);
        spr.userData.i = i;
        S[i] = spr;
        watchGroup.add(spr);

        const short = PARTS_DATA[i]?.shortName || `Part ${i + 1}`;
        const nspr = createNameSprite(`${i + 1} ${short}`, GC[getGroupIndex(i)]);
        nspr.userData.i = i;
        NS[i] = nspr;
        watchGroup.add(nspr);
      }
      return m;
    }

    function createNumberSprite(n: number, col: string) {
      const c = document.createElement('canvas');
      c.width = c.height = 64;
      const x = c.getContext('2d')!;
      x.fillStyle = col;
      x.beginPath();
      x.arc(32, 32, 28, 0, Math.PI * 2);
      x.fill();
      x.strokeStyle = '#ffffff';
      x.lineWidth = 3;
      x.stroke();
      x.fillStyle = '#04070b';
      x.font = 'bold 30px Arial';
      x.textAlign = 'center';
      x.textBaseline = 'middle';
      x.fillText(String(n), 32, 34);

      const spr = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: new THREE.CanvasTexture(c),
          depthTest: false,
          transparent: true,
        })
      );
      spr.scale.set(0.45, 0.45, 1);
      spr.renderOrder = 20;
      return spr;
    }

    function createNameSprite(t: string, col: string) {
      const c = document.createElement('canvas');
      c.width = 256;
      c.height = 72;
      const x = c.getContext('2d')!;
      x.fillStyle = 'rgba(7, 13, 22, 0.92)';
      x.fillRect(4, 4, 248, 64);
      x.strokeStyle = col;
      x.lineWidth = 4;
      x.strokeRect(4, 4, 248, 64);
      x.fillStyle = '#ffffff';
      x.font = 'bold 32px Arial';
      x.textAlign = 'center';
      x.textBaseline = 'middle';
      x.fillText(t, 128, 38);

      const s = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: new THREE.CanvasTexture(c),
          depthTest: false,
          transparent: true,
        })
      );
      s.scale.set(1.2, 0.34, 1);
      s.renderOrder = 19;
      return s;
    }

    // Hyper-Realistic Vibrant AMOLED Watch Face Texture (Matching Image 1 & 2)
    function createRealisticScreenTexture() {
      const c = document.createElement('canvas');
      c.width = 768;
      c.height = 920;
      const x = c.getContext('2d')!;

      // 1. Deep Rich AMOLED Base with subtle cyber blue radial gradient
      const bgGrad = x.createRadialGradient(384, 460, 40, 384, 460, 480);
      bgGrad.addColorStop(0, '#0a1628');
      bgGrad.addColorStop(0.65, '#030813');
      bgGrad.addColorStop(1, '#010307');
      x.fillStyle = bgGrad;
      x.fillRect(0, 0, 768, 920);

      // Subtle high-tech radial grid lines
      x.strokeStyle = 'rgba(0, 234, 255, 0.08)';
      x.lineWidth = 1.5;
      for (let r = 80; r < 400; r += 70) {
        x.beginPath();
        x.arc(384, 460, r, 0, Math.PI * 2);
        x.stroke();
      }

      // 2. Bezel Edge Accent - Glowing Cyan Bezel Frame
      x.strokeStyle = '#00f0ff';
      x.lineWidth = 14;
      x.strokeRect(22, 22, 724, 876);

      // Outer Glow Rim
      x.strokeStyle = 'rgba(0, 240, 255, 0.45)';
      x.lineWidth = 6;
      x.strokeRect(10, 10, 748, 900);

      // 3. Top Status Bar: 4G VoLTE, Wi-Fi, Battery, Yashu OS
      x.fillStyle = '#00f0ff';
      x.font = 'bold 26px Arial';
      x.textAlign = 'left';
      x.fillText('●●●● 4G VoLTE', 46, 75);

      x.fillStyle = '#94a3b8';
      x.font = 'bold 20px Arial';
      x.textAlign = 'center';
      x.fillText('YASHU OS 2.0', 384, 75);

      x.fillStyle = '#fbbf24';
      x.font = 'bold 26px Arial';
      x.textAlign = 'right';
      x.fillText('⚡ 98%', 722, 75);

      // Date Header
      x.fillStyle = '#ffa31a';
      x.font = 'bold 28px Arial';
      x.textAlign = 'center';
      x.fillText('WEDNESDAY, 24 OCT', 384, 140);

      // 4. Vibrant Multi-Color Speedometer / Activity Gauge Arc (Matching Image 1)
      const centerX = 384;
      const centerY = 460;
      const radius = 240;

      // Outer radial tick marks
      x.save();
      x.translate(centerX, centerY);
      for (let a = -135; a <= 135; a += 9) {
        const rad = (a * Math.PI) / 180;
        const x1 = Math.cos(rad) * (radius + 28);
        const y1 = Math.sin(rad) * (radius + 28);
        const x2 = Math.cos(rad) * (radius + (a % 45 === 0 ? 44 : 36));
        const y2 = Math.sin(rad) * (radius + (a % 45 === 0 ? 44 : 36));
        x.strokeStyle = a % 45 === 0 ? '#00f0ff' : 'rgba(255, 255, 255, 0.4)';
        x.lineWidth = a % 45 === 0 ? 4 : 2;
        x.beginPath();
        x.moveTo(x1, y1);
        x.lineTo(x2, y2);
        x.stroke();
      }
      x.restore();

      // Thick Glowing Gradient Arc: Cyan -> Sky Blue -> Electric Purple -> Neon Magenta -> Hot Pink -> Amber
      const arcGrad = x.createLinearGradient(
        centerX - radius,
        centerY + radius * 0.4,
        centerX + radius,
        centerY - radius * 0.8
      );
      arcGrad.addColorStop(0.0, '#00f0ff'); // Electric Cyan
      arcGrad.addColorStop(0.2, '#38bdf8'); // Sky Blue
      arcGrad.addColorStop(0.45, '#818cf8'); // Indigo
      arcGrad.addColorStop(0.65, '#c084fc'); // Purple
      arcGrad.addColorStop(0.85, '#f43f5e'); // Neon Pink / Rose
      arcGrad.addColorStop(1.0, '#ff9a1f'); // Warm Amber Gold

      x.beginPath();
      x.arc(centerX, centerY, radius, 0.76 * Math.PI, 2.24 * Math.PI, false);
      x.strokeStyle = arcGrad;
      x.lineWidth = 44;
      x.lineCap = 'round';
      x.shadowColor = 'rgba(0, 240, 255, 0.7)';
      x.shadowBlur = 24;
      x.stroke();

      // Inner neon accent arc
      x.shadowBlur = 0;
      x.beginPath();
      x.arc(centerX, centerY, radius - 34, 0.8 * Math.PI, 2.2 * Math.PI, false);
      x.strokeStyle = 'rgba(0, 240, 255, 0.35)';
      x.lineWidth = 4;
      x.stroke();

      // 5. Giant White Digital Clock: 10:48 (Crisp, Ultra-Bold, Pristine White)
      x.shadowColor = 'rgba(0, 0, 0, 0.9)';
      x.shadowBlur = 25;
      x.fillStyle = '#ffffff';
      x.font = '900 170px Arial, sans-serif';
      x.textAlign = 'center';
      x.textBaseline = 'middle';
      x.fillText('10:48', centerX, centerY - 25);

      // 6. Glowing Cyan 4G VOLTE AMOLED Badge
      x.shadowColor = 'rgba(0, 240, 255, 0.85)';
      x.shadowBlur = 18;
      x.fillStyle = '#00f0ff';
      x.font = 'bold 36px Arial, sans-serif';
      x.fillText('4G VOLTE AMOLED', centerX, centerY + 80);

      // Cyan pill badge border around subtitle
      x.strokeStyle = '#00f0ff';
      x.lineWidth = 3;
      x.strokeRect(centerX - 195, centerY + 52, 390, 56);

      // 7. Bottom Fitness & Telemetry Stats (Vivid Red, Green, Orange)
      x.shadowBlur = 0;
      // Heart Rate Pill
      x.fillStyle = '#1e1b4b';
      x.fillRect(70, 770, 180, 52);
      x.strokeStyle = '#ef4444';
      x.lineWidth = 2;
      x.strokeRect(70, 770, 180, 52);
      x.fillStyle = '#ef4444';
      x.font = 'bold 22px Arial';
      x.textAlign = 'center';
      x.fillText('♥ 78 BPM', 160, 803);

      // Steps Pill
      x.fillStyle = '#064e3b';
      x.fillRect(270, 770, 228, 52);
      x.strokeStyle = '#10b981';
      x.lineWidth = 2;
      x.strokeRect(270, 770, 228, 52);
      x.fillStyle = '#34d399';
      x.font = 'bold 22px Arial';
      x.textAlign = 'center';
      x.fillText('👟 8,420 STEPS', 384, 803);

      // Calorie Pill
      x.fillStyle = '#451a03';
      x.fillRect(518, 770, 180, 52);
      x.strokeStyle = '#f97316';
      x.lineWidth = 2;
      x.strokeRect(518, 770, 180, 52);
      x.fillStyle = '#fb923c';
      x.font = 'bold 22px Arial';
      x.textAlign = 'center';
      x.fillText('🔥 485 KCAL', 608, 803);

      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      return tex;
    }

    // High-Tech Capacitive Touch Digitizer Grid Texture for Part 26
    function createCapacitiveTouchTexture() {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 620;
      const x = c.getContext('2d')!;

      // Clear transparent base
      x.clearRect(0, 0, 512, 620);

      // Sleek subtle cyan border
      x.strokeStyle = 'rgba(0, 234, 255, 0.4)';
      x.lineWidth = 4;
      x.strokeRect(12, 12, 488, 596);

      // Micro capacitive ITO diamond sensor grid
      x.strokeStyle = 'rgba(0, 234, 255, 0.16)';
      x.lineWidth = 1;
      for (let i = 24; i < 500; i += 28) {
        x.beginPath();
        x.moveTo(i, 20);
        x.lineTo(i, 600);
        x.stroke();
      }
      for (let j = 24; j < 600; j += 28) {
        x.beginPath();
        x.moveTo(20, j);
        x.lineTo(492, j);
        x.stroke();
      }

      // Sensor node intersection dots
      x.fillStyle = 'rgba(0, 240, 255, 0.4)';
      for (let i = 24; i < 500; i += 56) {
        for (let j = 24; j < 600; j += 56) {
          x.fillRect(i - 1.5, j - 1.5, 3, 3);
        }
      }

      // Copper/Gold flex contact busbars at bottom
      x.fillStyle = 'rgba(245, 158, 11, 0.75)';
      for (let b = 40; b < 470; b += 22) {
        x.fillRect(b, 590, 12, 18);
      }

      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    }

    // Realistic Emerald Green PCB with Gold Traces
    function createPcbTexture() {
      const c = document.createElement('canvas');
      c.width = 512;
      c.height = 512;
      const x = c.getContext('2d')!;

      // Deep vibrant emerald green
      x.fillStyle = '#044a2b';
      x.fillRect(0, 0, 512, 512);

      // Grid of micro vias
      x.fillStyle = 'rgba(16, 185, 129, 0.25)';
      for (let vx = 16; vx < 500; vx += 24) {
        for (let vy = 16; vy < 500; vy += 24) {
          x.fillRect(vx, vy, 2, 2);
        }
      }

      // Shimmering Golden copper traces
      x.strokeStyle = '#f59e0b';
      x.lineWidth = 3;
      for (let i = 24; i < 490; i += 36) {
        x.beginPath();
        x.moveTo(i, 20);
        x.lineTo(i + 15, 140);
        x.lineTo(i + 35, 260);
        x.stroke();

        x.beginPath();
        x.arc(i + 35, 260, 4, 0, Math.PI * 2);
        x.fillStyle = '#fbbf24';
        x.fill();
      }

      // Gold Edge Connectors along the top and bottom
      x.fillStyle = '#fbbf24';
      for (let j = 18; j < 490; j += 18) {
        x.fillRect(j, 488, 11, 20);
        x.fillRect(j, 4, 11, 20);
      }

      // Solder pads in silver/gold
      x.fillStyle = '#d4d4d8';
      for (let p = 50; p < 460; p += 60) {
        x.fillRect(p, 360, 16, 24);
      }

      const tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      return tex;
    }

    // ==============================================================
    // BUILD 45 PARTS WITH HYPER-REALISTIC MESHES & MATERIALS
    // ==============================================================

    // Layer 0: Titanium Outer Chassis (Dark Space Grey Metallic + Lugs)
    const chassisMesh = addPart(
      -1,
      rr(4.2, 4.8, 0.65, 0.85),
      M_METAL(0x1e2733, 0.25, 0.9),
      [0, -1.0, 0],
      [0, -3.8, 0]
    );

    // Orange Knurled Rotary Crown Button (#20, index 19)
    const crownMat = new THREE.MeshStandardMaterial({
      color: 0xff6600,
      metalness: 0.85,
      roughness: 0.2,
      emissive: 0xff4400,
      emissiveIntensity: 0.45,
    });
    const crownMesh = addPart(
      19,
      C(0.38, 0.55),
      crownMat,
      [2.35, -0.9, -0.4],
      [2.6, -2.8, -0.4],
      [0, 0, PI / 2]
    );
    // Knurled ridges on crown
    const knurlRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.38, 0.05, 8, 32),
      M_METAL(0xff9900, 0.2, 0.9)
    );
    crownMesh.add(knurlRing);

    // Optical PPG Heart Rate Sensor Pod (#28, index 28)
    const ppgPod = addPart(
      28,
      C(0.85, 0.18),
      M_METAL(0x0a0f16, 0.15, 0.95),
      [0, -1.25, 0],
      [0, -4.2, 0]
    );
    // 4 Glowing Emerald Green LEDs inside sensor pod
    [[0.32, 0.32], [-0.32, 0.32], [0.32, -0.32], [-0.32, -0.32]].forEach((coords) => {
      const led = new THREE.Mesh(
        C(0.12, 0.1),
        new THREE.MeshStandardMaterial({
          color: 0x10b981,
          emissive: 0x22ff66,
          emissiveIntensity: 2.5,
        })
      );
      led.position.set(coords[0], 0.08, coords[1]);
      ppgPod.add(led);
    });

    // 29: SpO2, 30: LED, 31: Receiver, 32: Charging Contacts
    addPart(29, C(0.22, 0.12), new THREE.MeshStandardMaterial({ color: 0xdc2626, emissive: 0xdc2626, emissiveIntensity: 0.8 }), [-0.95, -1.25, -0.9], [-0.95, -4.2, -0.9]);
    addPart(30, C(0.18, 0.12), new THREE.MeshStandardMaterial({ color: 0x22c55e, emissive: 0x22c55e, emissiveIntensity: 1.0 }), [0.95, -1.25, -0.9], [0.95, -4.2, -0.9]);
    addPart(31, C(0.22, 0.12), M_METAL(0x94a3b8), [-0.95, -1.25, 0.9], [-0.95, -4.2, 0.9]);
    addPart(32, B(0.4, 0.08, 0.9), M_METAL(0xf59e0b, 0.1, 0.95), [1.5, -1.25, 0], [1.5, -4.2, 0]);

    // Layer 1: 1000mAh Lithium Battery Pack (#34, index 33)
    const battMat = new THREE.MeshStandardMaterial({
      color: 0x242e3b,
      metalness: 0.75,
      roughness: 0.3,
    });
    const battMesh = addPart(
      33,
      rr(3.3, 3.0, 0.42, 0.25),
      battMat,
      [0, -0.45, 0.1],
      [0, -1.9, 0.1]
    );

    // Realistic Battery Decal with golden foil corner
    const battCanvas = document.createElement('canvas');
    battCanvas.width = 320;
    battCanvas.height = 260;
    const bx = battCanvas.getContext('2d')!;
    bx.fillStyle = '#1b232e';
    bx.fillRect(0, 0, 320, 260);

    // Golden foil bevel accent
    bx.fillStyle = '#f59e0b';
    bx.beginPath();
    bx.moveTo(0, 260);
    bx.lineTo(320, 260);
    bx.lineTo(320, 230);
    bx.lineTo(0, 245);
    bx.fill();

    bx.fillStyle = '#ffffff';
    bx.font = 'bold 44px Arial';
    bx.textAlign = 'center';
    bx.fillText('1000mAh', 160, 95);
    bx.fillText('Battery', 160, 145);

    bx.fillStyle = '#fb923c';
    bx.font = 'bold 26px Arial';
    bx.fillText('3.8V HIGH GAIN', 160, 195);

    const battDecal = new THREE.Mesh(
      new THREE.PlaneGeometry(3.0, 2.6),
      new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(battCanvas) })
    );
    battDecal.rotation.x = -PI / 2;
    battDecal.position.y = 0.22;
    battMesh.add(battDecal);

    // 34: Coin Vibration Motor
    addPart(34, C(0.35, 0.4), M_METAL(0xd1d5db, 0.2, 0.9), [-1.2, -0.4, -1.6], [-1.2, -1.9, -1.6]);
    addPart(35, B(3.2, 0.05, 0.1), M_METAL(0xf59e0b), [0, 0.05, -2.1], [0, -0.8, -2.1]);
    addPart(36, B(3.2, 0.05, 0.1), M_METAL(0x22d3ee), [0, 0.05, 2.1], [0, -0.8, 2.1]);
    addPart(37, B(0.1, 0.05, 3.2), M_METAL(0xa3e635), [1.8, 0.05, 0], [1.8, -0.8, 0]);

    // Layer 2: Green Motherboard PCB (#39, index 38)
    const pcbMat = new THREE.MeshStandardMaterial({
      color: 0x05663b,
      emissive: 0x023b21,
      emissiveIntensity: 0.4,
      metalness: 0.35,
      roughness: 0.25,
    });
    const pcbMesh = addPart(
      38,
      rr(3.6, 4.3, 0.1, 0.35),
      pcbMat,
      [0, 0.15, 0],
      [0, 0.2, 0]
    );

    // Dedicated high-resolution gold circuit top face decal
    const pcbCircuitPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.5, 4.2),
      new THREE.MeshBasicMaterial({
        map: createPcbTexture(),
        transparent: true,
        opacity: 0.96,
        side: THREE.DoubleSide,
      })
    );
    pcbCircuitPlane.rotation.x = -PI / 2;
    pcbCircuitPlane.position.y = 0.055;
    pcbMesh.add(pcbCircuitPlane);

    // Motherboard Microchips (0 to 14)
    for (let i = 0; i < 15; i++) {
      const r = Math.floor(i / 5);
      const c = i % 5;
      const isCpu = i === 0;

      const chipMesh = addPart(
        i,
        B(isCpu ? 0.95 : 0.42 + (i % 3) * 0.08, 0.15, isCpu ? 0.95 : 0.38 + (i % 2) * 0.1),
        new THREE.MeshStandardMaterial({
          color: isCpu ? 0x0a0f0d : 0x1a2634,
          metalness: 0.85,
          roughness: 0.2,
          emissive: isCpu ? 0x3d2700 : 0x000000,
        }),
        [(c - 2) * 0.68, 0.28, (r - 1) * 1.05 + 0.1],
        [(c - 2) * 0.55, 1.8 + r * 0.4, (r - 1) * 0.55]
      );

      // CPU Decal: LJ939 4G SOC with gold border (like in Image 2!)
      if (isCpu) {
        const cpuCanvas = document.createElement('canvas');
        cpuCanvas.width = 256;
        cpuCanvas.height = 256;
        const cx = cpuCanvas.getContext('2d')!;
        cx.fillStyle = '#080c0a';
        cx.fillRect(0, 0, 256, 256);
        cx.strokeStyle = '#f59e0b';
        cx.lineWidth = 10;
        cx.strokeRect(8, 8, 240, 240);

        // Gold corner pin
        cx.fillStyle = '#f59e0b';
        cx.beginPath();
        cx.arc(28, 28, 8, 0, Math.PI * 2);
        cx.fill();

        cx.fillStyle = '#ffffff';
        cx.font = 'bold 52px Arial';
        cx.textAlign = 'center';
        cx.fillText('LJ939', 128, 120);

        cx.fillStyle = '#f59e0b';
        cx.font = 'bold 36px Arial';
        cx.fillText('4G SOC', 128, 180);

        const cpuDecalMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(0.85, 0.85),
          new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(cpuCanvas) })
        );
        cpuDecalMesh.rotation.x = -PI / 2;
        cpuDecalMesh.position.y = 0.08;
        chipMesh.add(cpuDecalMesh);
      }
    }

    // Left components (15 to 18)
    for (let j = 0; j < 4; j++) {
      addPart(15 + j, B(0.35, 0.25, 0.65), M_METAL(0x475569), [-2.05, 0.1, -1.3 + j * 0.9], [-2.8, -0.6, 0]);
    }

    // Right components (19 to 24)
    // 180° Rotatable HD Camera Module (#22, index 21)
    const camBase = addPart(
      21,
      C(0.55, 0.45),
      M_METAL(0x181e26, 0.15, 0.9),
      [1.9, 0.8, -1.2],
      [2.5, 2.2, -1.2]
    );
    // Gold/Orange camera rim
    const camGoldRim = new THREE.Mesh(
      new THREE.TorusGeometry(0.55, 0.08, 12, 36),
      M_METAL(0xff7700, 0.15, 0.95)
    );
    camGoldRim.rotation.x = PI / 2;
    camBase.add(camGoldRim);

    // Blue optical lens with anti-reflective sapphire glint
    const lensMesh = new THREE.Mesh(
      C(0.42, 0.12),
      new THREE.MeshPhysicalMaterial({
        color: 0x0284c7,
        emissive: 0x0369a1,
        emissiveIntensity: 0.6,
        roughness: 0.05,
        metalness: 0.2,
        clearcoat: 1.0,
      })
    );
    lensMesh.position.y = 0.22;
    camBase.add(lensMesh);

    // Pupil
    const pupilMesh = new THREE.Mesh(
      C(0.18, 0.14),
      M_METAL(0x02060b, 0.1, 0.9)
    );
    pupilMesh.position.y = 0.25;
    camBase.add(pupilMesh);

    // 20, 22, 23: Other Right parts
    addPart(20, C(0.16, 0.3), M_METAL(0x94a3b8), [2.1, 0.1, 0.2], [2.7, 0.8, 0]);
    addPart(22, B(0.5, 0.04, 0.7), M_METAL(0xea580c), [1.9, 0.1, 1.1], [2.6, 0.8, 0.8]);
    addPart(23, B(0.5, 0.04, 0.7), M_METAL(0xea580c), [1.9, 0.4, -0.6], [2.6, 1.8, -0.6]);

    // ==============================================================
    // TOP SIDE: DISPLAY ASSEMBLY (24 to 27) - VIBRANT COLORFUL & UNOBSTRUCTED
    // ==============================================================

    // 24: 2.02" AMOLED Screen Plate (#25, index 24)
    const displayPlate = addPart(
      24,
      rr(3.85, 4.55, 0.08, 0.65),
      M_METAL(0x151b24, 0.2, 0.9),
      [0, 0.9, 0],
      [0, 3.4, 0]
    );

    // Cyan glowing chamfer rim around active display area
    const displayBezelRim = new THREE.Mesh(
      new THREE.PlaneGeometry(3.6, 4.3),
      new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide })
    );
    displayBezelRim.rotation.x = -PI / 2;
    displayBezelRim.position.y = 0.082;
    displayPlate.add(displayBezelRim);

    // AMOLED Watchface Screen (Proud at y=0.086 with toneMapped: false for pure bright colors!)
    const screenFace = new THREE.Mesh(
      new THREE.PlaneGeometry(3.54, 4.24),
      new THREE.MeshBasicMaterial({
        map: createRealisticScreenTexture(),
        side: THREE.FrontSide,
        toneMapped: false,
      })
    );
    screenFace.rotation.x = -PI / 2;
    screenFace.position.y = 0.086;
    screenFace.renderOrder = 10;
    displayPlate.add(screenFace);

    // 25: Display Curved Glass Armor (#26, index 25) - SAPPHIRE CRYSTAL BEVELED FRAME WITH CLEAR APERTURE
    // Center is open hole [3.45, 4.15, 0.5] so it never blankets or greys-out the colorful dial underneath!
    const glassFrame = addPart(
      25,
      rr(4.0, 4.7, 0.05, 0.75, [3.45, 4.15, 0.5]),
      new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        transparent: true,
        opacity: 0.35,
        roughness: 0.08,
        metalness: 0.25,
        depthWrite: false,
      }),
      [0, 0.94, 0],
      [0, 5.2, 0]
    );

    // Ultra-clear center sapphire pane with faint glint (depthWrite: false, 100% visible dial!)
    const clearGlassPane = new THREE.Mesh(
      new THREE.PlaneGeometry(3.5, 4.2),
      new THREE.MeshBasicMaterial({
        color: 0xbae6fd,
        transparent: true,
        opacity: 0.06,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
    );
    clearGlassPane.rotation.x = -PI / 2;
    clearGlassPane.position.y = 0.025;
    glassFrame.add(clearGlassPane);

    // 26: Touch Panel Digitizer (#27, index 26) - CAPACITIVE TOUCH MATRIX WITH HIGH TRANSPARENCY
    const touchMat = new THREE.MeshBasicMaterial({
      map: createCapacitiveTouchTexture(),
      transparent: true,
      opacity: 0.55,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    addPart(
      26,
      new THREE.PlaneGeometry(3.6, 4.3),
      touchMat,
      [0, 0.92, 0],
      [0, 4.3, 0],
      [-PI / 2, 0, 0]
    );

    // 27: Display Ribbon Flex Cable (#28, index 27)
    addPart(27, B(1.1, 0.04, 0.8), M_METAL(0xf97316), [0, 0.75, 2.1], [0, 2.8, 0.8]);

    // Internal SMD Components (39 to 44)
    const compColors = [0xd1d5db, 0xb45309, 0x1e293b, 0x064e3b, 0xe2e8f0, 0xd97706];
    for (let k = 0; k < 6; k++) {
      addPart(
        39 + k,
        B(0.24, 0.14, 0.18),
        M_METAL(compColors[k]),
        [-1.0 + k * 0.42, 0.22, 1.2 - (k % 2) * 0.4],
        [-0.9 + k * 0.38, 1.2 + (k % 3) * 0.3, 0.7]
      );
    }

    partsMeshesRef.current = P;
    numberSpritesRef.current = S;
    nameSpritesRef.current = NS;

    // Raycaster for part selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handlePointerDown = (event: MouseEvent) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(P, true);

      if (intersects.length > 0) {
        let obj: THREE.Object3D | null = intersects[0].object;
        while (obj && obj !== watchGroup && obj.userData.i === undefined) {
          obj = obj.parent;
        }
        if (obj && obj.userData.i !== undefined) {
          const partIndex = obj.userData.i;
          playSound.selectPart();
          onSelectPart(partIndex + 1);
        }
      }
    };

    renderer.domElement.addEventListener('pointerdown', handlePointerDown);

    // Render Animation Loop
    let animationFrameId = 0;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();

      const azimuth = Math.round(((controls.getAzimuthalAngle() * 180) / Math.PI + 360) % 360);
      setCameraAngle(azimuth);

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !renderer || !camera) return;
      const w = containerRef.current.clientWidth;
      const h = containerRef.current.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.dispose();
    };
  }, []);

  // Update exploded distance
  useEffect(() => {
    const P = partsMeshesRef.current;
    const S = numberSpritesRef.current;
    const NS = nameSpritesRef.current;
    if (!P.length) return;

    const t = isExploded ? explosionFactor : 0;

    P.forEach((m, idx) => {
      if (!m || !m.userData.b || !m.userData.o) return;
      m.position.lerpVectors(m.userData.b, m.userData.o, t);

      if (S[idx]) {
        S[idx].position.copy(m.position);
        S[idx].position.y += 0.45;
      }
      if (NS[idx]) {
        NS[idx].position.copy(m.position);
        NS[idx].position.y += 0.9;
      }
    });
  }, [isExploded, explosionFactor]);

  // Auto-Spin
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = isAutoSpinning;
      controlsRef.current.autoRotateSpeed = 2.5;
    }
  }, [isAutoSpinning]);

  // Labels & Tags visibility (हटाना व लगाना)
  useEffect(() => {
    const S = numberSpritesRef.current;
    const NS = nameSpritesRef.current;
    const activeIdx = activePartNum - 1;

    S.forEach((spr, idx) => {
      if (!spr) return;
      if (!showLabels || labelMode === 'none') {
        spr.visible = false;
      } else if (labelMode === 'selected') {
        spr.visible = idx === activeIdx;
      } else {
        spr.visible = true;
      }
    });

    NS.forEach((nspr, idx) => {
      if (!nspr) return;
      if (!showLabels || labelMode === 'none') {
        nspr.visible = false;
      } else if (labelMode === 'selected') {
        nspr.visible = idx === activeIdx;
      } else {
        nspr.visible = true;
      }
    });
  }, [showLabels, labelMode, activePartNum]);

  // Emissive highlight on selected part
  useEffect(() => {
    const P = partsMeshesRef.current;
    const idx = activePartNum - 1;

    P.forEach((m, i) => {
      if (!m) return;
      const mat = m.material as THREE.MeshStandardMaterial;
      if (mat && mat.emissive) {
        if (i === idx) {
          if (i === 38) {
            // PCB (#39): Keep deep emerald green glowing, never turn peach!
            mat.emissive.set(0x05b871);
            mat.emissiveIntensity = 0.8;
          } else if (i === 24) {
            // Display Screen (#25): Crisp cyan glow
            mat.emissive.set(0x00eaff);
            mat.emissiveIntensity = 0.6;
          } else if (i === 25) {
            // Display Glass (#26): Sapphire cyan glow
            mat.emissive.set(0x00f0ff);
            mat.emissiveIntensity = 0.6;
          } else if (i === 21) {
            // Camera (#22): Sapphire blue glow
            mat.emissive.set(0x0284c7);
            mat.emissiveIntensity = 0.8;
          } else if (i === 33) {
            // Battery (#34): Warm gold accent
            mat.emissive.set(0xf59e0b);
            mat.emissiveIntensity = 0.5;
          } else {
            mat.emissive.set(0xff5500);
            mat.emissiveIntensity = 0.9;
          }
        } else {
          // Restore default authentic colors
          if (i === 0) {
            mat.emissive.set(0x3d2700);
            mat.emissiveIntensity = 0.4;
          } else if (i === 38) {
            // PCB default emerald green
            mat.emissive.set(0x023b21);
            mat.emissiveIntensity = 0.4;
          } else if (i === 28) {
            // PPG sensor default emerald glow
            mat.emissive.set(0x00ff88);
            mat.emissiveIntensity = 0.7;
          } else if (i === 19) {
            // Crown button default orange
            mat.emissive.set(0xff4400);
            mat.emissiveIntensity = 0.45;
          } else {
            mat.emissive.set(0x000000);
            mat.emissiveIntensity = 0;
          }
        }
      }
    });
  }, [activePartNum]);

  // Direct 3D Snapshot download
  const handleDownloadSnapshot = useCallback(() => {
    playSound.shutter();
    setIsCapturing(true);

    const renderer = rendererRef.current;
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (!renderer || !scene || !camera) {
      setIsCapturing(false);
      return;
    }

    renderer.render(scene, camera);
    const rawDataUrl = renderer.domElement.toDataURL('image/png');

    const canvas = document.createElement('canvas');
    canvas.width = renderer.domElement.width;
    canvas.height = renderer.domElement.height;
    const ctx = canvas.getContext('2d')!;

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0);

      // Cyber watermark
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${Math.max(16, canvas.width / 50)}px Arial`;
      ctx.fillText('YASHU PUDO 4G ULTRA SMARTWATCH', 24, 38);

      ctx.fillStyle = '#ff9a1f';
      ctx.font = `bold ${Math.max(13, canvas.width / 65)}px Arial`;
      ctx.fillText('45 HARDWARE PARTS TEARDOWN ARCHITECTURE', 24, 62);

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `YASHU-PUDO-3D-Realtime-Part${activePartNum}.png`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setIsCapturing(false);
      }, 'image/png');
    };
    img.src = rawDataUrl;
  }, [activePartNum]);

  const handleResetCamera = () => {
    playSound.click();
    if (controlsRef.current && cameraRef.current) {
      cameraRef.current.position.set(7.5, 7.0, 11.5);
      controlsRef.current.target.set(0, 0.2, 0);
      controlsRef.current.update();
    }
  };

  const handleZoom = (delta: number) => {
    playSound.click();
    if (controlsRef.current && cameraRef.current) {
      cameraRef.current.position.multiplyScalar(delta);
      controlsRef.current.update();
    }
  };

  return (
    <div className="relative w-full h-[460px] sm:h-[500px] bg-gradient-to-b from-[#060c14] via-[#04070b] to-[#020408] rounded-2xl overflow-hidden select-none border border-[#16445b]/80 group">
      <div ref={containerRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Floating 3D Navigation Controls */}
      <div className="absolute right-3 top-3 flex flex-col gap-1.5 bg-[#0b1522]/90 border border-[#16445b] p-1 rounded-xl shadow-lg z-10">
        <button
          onClick={onToggleLabels}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            showLabels
              ? 'bg-[#00eaff] text-black shadow-sm'
              : 'text-[#94a3b8] hover:text-[#00eaff] hover:bg-[#162a3d]'
          }`}
          title={showLabels ? '🏷 1-45 टैग हटाएं (Hide Tags)' : '🏷 1-45 टैग लगाएं (Show Tags)'}
        >
          <Tag className="w-4 h-4" />
        </button>
        <button
          onClick={handleDownloadSnapshot}
          disabled={isCapturing}
          className="p-1.5 rounded-lg text-[#ffa31a] hover:bg-[#162a3d] transition-colors cursor-pointer"
          title="Take 3D Snapshot"
        >
          <Camera className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(0.85)}
          className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#00eaff] hover:bg-[#162a3d] transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleZoom(1.15)}
          className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#00eaff] hover:bg-[#162a3d] transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetCamera}
          className="p-1.5 rounded-lg text-[#94a3b8] hover:text-[#00eaff] hover:bg-[#162a3d] transition-colors"
          title="Reset Camera"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute bottom-2 inset-x-0 text-center pointer-events-none">
        <span className="font-mono-tech text-[10px] text-[#91b7c8] bg-black/70 px-3 py-0.5 rounded-full border border-[#16445b]/60">
          {language === 'hi'
            ? 'पार्ट चुनें = बाहर आकर 360° घूमेगा | ड्रैग = घुमाएं | पिंच = ज़ूम'
            : 'Select part = Focus | Drag = Orbit 360° | Scroll = Zoom'}
        </span>
      </div>
    </div>
  );
};
