import { PARTS_DATA, CATEGORIES } from '../data/partsData.ts';
import { PhotoLayout, PhotoResolution } from '../types.ts';

interface RenderOptions {
  layout: PhotoLayout;
  resolution: PhotoResolution;
  language: 'hi' | 'en';
  showCallouts: boolean;
  activePartNum?: number;
  customWatermark?: string;
}

export function generateTeardownPhoto(options: RenderOptions): HTMLCanvasElement {
  const {
    layout = 'exploded',
    resolution = '1080p',
    language = 'hi',
    showCallouts = true,
    activePartNum = 1,
    customWatermark = 'YASHU PUDO 4G ARCHITECTURE',
  } = options;

  let width = 1920;
  let height = 1080;

  if (resolution === '2k') {
    width = 2560;
    height = 1440;
  } else if (resolution === '4k') {
    width = 3840;
    height = 2160;
  }

  if (layout === 'poster') {
    // Vertical poster format (3:4 ratio)
    if (resolution === '1080p') {
      width = 1080;
      height = 1440;
    } else if (resolution === '2k') {
      width = 1440;
      height = 1920;
    } else {
      width = 2160;
      height = 2880;
    }
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  const scale = width / 1920;

  // 1. Deep Space Cyber Background
  const bgGrad = ctx.createRadialGradient(
    width * 0.5,
    height * 0.35,
    50 * scale,
    width * 0.5,
    height * 0.5,
    width * 0.8
  );
  bgGrad.addColorStop(0, '#0c1a2d');
  bgGrad.addColorStop(0.5, '#070f1a');
  bgGrad.addColorStop(1, '#020508');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // 2. High-Tech Blueprint Grid
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.05)';
  ctx.lineWidth = 1 * scale;
  const gridSize = 40 * scale;
  for (let x = 0; x < width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }
  for (let y = 0; y < height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // 3. Cyber Corner Markers
  const markerLen = 30 * scale;
  const pad = 24 * scale;
  ctx.strokeStyle = '#00f0ff';
  ctx.lineWidth = 2 * scale;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(pad, pad + markerLen);
  ctx.lineTo(pad, pad);
  ctx.lineTo(pad + markerLen, pad);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(width - pad - markerLen, pad);
  ctx.lineTo(width - pad, pad);
  ctx.lineTo(width - pad, pad + markerLen);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(pad, height - pad - markerLen);
  ctx.lineTo(pad, height - pad);
  ctx.lineTo(pad + markerLen, height - pad);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(width - pad - markerLen, height - pad);
  ctx.lineTo(width - pad, height - pad);
  ctx.lineTo(width - pad, height - pad - markerLen);
  ctx.stroke();

  // 4. Header & Branding Section
  ctx.save();
  ctx.shadowColor = 'rgba(255, 85, 0, 0.4)';
  ctx.shadowBlur = 15 * scale;
  ctx.font = `900 ${38 * scale}px 'Orbitron', sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.fillText('YASHU ', pad + 15 * scale, pad + 38 * scale);
  const w1 = ctx.measureText('YASHU ').width;
  ctx.fillStyle = '#ff5500';
  ctx.fillText('PUDO', pad + 15 * scale + w1, pad + 38 * scale);
  ctx.restore();

  ctx.font = `600 ${14 * scale}px 'Share Tech Mono', monospace`;
  ctx.fillStyle = '#00f0ff';
  ctx.fillText(
    'LJ939 4G ULTRA SMARTWATCH // FULL 45 HARDWARE TEARDOWN ARCHITECTURE',
    pad + 15 * scale,
    pad + 65 * scale
  );

  // Top right HUD status
  ctx.font = `700 ${12 * scale}px 'Share Tech Mono', monospace`;
  ctx.fillStyle = '#64748b';
  ctx.textAlign = 'right';
  ctx.fillText(
    `SPEC: LJ939 4G-LTE | 1000mAh | 2.02" AMOLED | 180° CAM`,
    width - pad - 15 * scale,
    pad + 35 * scale
  );
  ctx.fillStyle = '#10b981';
  ctx.fillText(
    `● ARCHITECTURE VERIFIED // 45 HARDFLAME MODULES OK`,
    width - pad - 15 * scale,
    pad + 58 * scale
  );
  ctx.textAlign = 'left';

  // 5. Draw Exploded 3D Visual Layers on Canvas
  const centerX = layout === 'poster' ? width * 0.5 : width * 0.44;
  const centerY = layout === 'poster' ? height * 0.44 : height * 0.54;

  const wWatch = 300 * scale;
  const hWatch = 220 * scale;
  const tiltX = 0.5; // isometric pitch

  // Draw layers in order from bottom to top:
  // Layer 0: Titanium Chassis & Sensors (Bottom)
  // Layer 1: 1000mAh Battery & Vibrator
  // Layer 2: Green Motherboard PCB & LJ939 Chipset
  // Layer 3: Rotatable 180° Camera Module
  // Layer 4: 2.02" AMOLED Curved Display (Top)

  const layerOffsets = layout === 'exploded' || layout === 'poster'
    ? [-160 * scale, -70 * scale, 20 * scale, 110 * scale, 190 * scale]
    : [-30 * scale, -15 * scale, 0, 15 * scale, 30 * scale];

  // Function to draw isometric rounded rectangle
  function drawIsoPlate(
    yShift: number,
    fill: string | CanvasGradient,
    border: string,
    w: number = wWatch,
    h: number = hWatch,
    r: number = 48 * scale
  ) {
    ctx.save();
    ctx.translate(centerX, centerY - yShift);
    ctx.scale(1, tiltX);

    ctx.beginPath();
    ctx.roundRect(-w / 2, -h / 2, w, h, r);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.lineWidth = 2.5 * scale;
    ctx.strokeStyle = border;
    ctx.stroke();

    ctx.restore();
  }

  // --- DRAW LAYER 0: Bottom Titanium Chassis ---
  const chassisY = layerOffsets[0];
  const chassisGrad = ctx.createLinearGradient(
    centerX - wWatch / 2,
    centerY - chassisY,
    centerX + wWatch / 2,
    centerY - chassisY + hWatch * tiltX
  );
  chassisGrad.addColorStop(0, '#1a2333');
  chassisGrad.addColorStop(1, '#080d14');
  drawIsoPlate(chassisY, chassisGrad, '#475569');

  // Chassis Details (Rotary Crown, SIM slot, Optical sensor)
  ctx.save();
  ctx.translate(centerX, centerY - chassisY);
  ctx.scale(1, tiltX);

  // Orange Rotary Crown (Right side)
  ctx.fillStyle = '#ff5500';
  ctx.shadowColor = '#ff5500';
  ctx.shadowBlur = 12 * scale;
  ctx.beginPath();
  ctx.roundRect(wWatch / 2 + 2 * scale, -25 * scale, 24 * scale, 50 * scale, 6 * scale);
  ctx.fill();
  ctx.restore();

  // SIM tray (Left side)
  ctx.save();
  ctx.translate(centerX, centerY - chassisY);
  ctx.scale(1, tiltX);
  ctx.fillStyle = '#64748b';
  ctx.beginPath();
  ctx.roundRect(-wWatch / 2 - 14 * scale, -15 * scale, 14 * scale, 45 * scale, 3 * scale);
  ctx.fill();

  // Biometric Heart Rate & SpO2 Sensor Plate (Center back)
  ctx.beginPath();
  ctx.arc(0, 0, 48 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#060a0f';
  ctx.fill();
  ctx.lineWidth = 2 * scale;
  ctx.strokeStyle = '#10b981';
  ctx.stroke();

  // Pulsing Green LED
  ctx.beginPath();
  ctx.arc(0, 0, 16 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#10b981';
  ctx.shadowColor = '#10b981';
  ctx.shadowBlur = 15 * scale;
  ctx.fill();

  // 4 Magnetic Gold Charging Contacts
  const pinSpacing = 16 * scale;
  for (let i = -1.5; i <= 1.5; i++) {
    ctx.beginPath();
    ctx.arc(i * pinSpacing, 65 * scale, 3.5 * scale, 0, Math.PI * 2);
    ctx.fillStyle = '#f59e0b';
    ctx.shadowColor = '#f59e0b';
    ctx.shadowBlur = 4 * scale;
    ctx.fill();
  }
  ctx.restore();

  // --- DRAW LAYER 1: Battery & Vibration Motor ---
  const battY = layerOffsets[1];
  drawIsoPlate(battY, '#111827', '#4b5563', wWatch * 0.95, hWatch * 0.95, 42 * scale);

  ctx.save();
  ctx.translate(centerX, centerY - battY);
  ctx.scale(1, tiltX);

  // Lithium Battery Pouch
  const battGrad = ctx.createLinearGradient(-100 * scale, -50 * scale, 100 * scale, 50 * scale);
  battGrad.addColorStop(0, '#1f2937');
  battGrad.addColorStop(1, '#090d14');
  ctx.beginPath();
  ctx.roundRect(-100 * scale, -55 * scale, 180 * scale, 110 * scale, 16 * scale);
  ctx.fillStyle = battGrad;
  ctx.fill();
  ctx.strokeStyle = '#374151';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Battery Text
  ctx.font = `800 ${11 * scale}px 'Orbitron', sans-serif`;
  ctx.fillStyle = '#f59e0b';
  ctx.fillText('1000mAh 3.8V Li-Po', -80 * scale, -15 * scale);
  ctx.font = `600 ${8.5 * scale}px 'Share Tech Mono', monospace`;
  ctx.fillStyle = '#94a3b8';
  ctx.fillText('YASHU HIGH GAIN CELL', -80 * scale, 5 * scale);
  ctx.fillText('PROTECTED PCM BOARD', -80 * scale, 22 * scale);

  // Coin Vibration Motor
  ctx.beginPath();
  ctx.arc(105 * scale, 25 * scale, 20 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#cbd5e1';
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 8 * scale;
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2 * scale;
  ctx.stroke();
  ctx.restore();

  // --- DRAW LAYER 2: Green Motherboard PCB ---
  const pcbY = layerOffsets[2];
  const pcbGrad = ctx.createLinearGradient(
    centerX - wWatch / 2,
    centerY - pcbY,
    centerX + wWatch / 2,
    centerY - pcbY + hWatch * tiltX
  );
  pcbGrad.addColorStop(0, '#043423');
  pcbGrad.addColorStop(1, '#021e14');
  drawIsoPlate(pcbY, pcbGrad, '#10b981', wWatch * 0.98, hWatch * 0.98, 44 * scale);

  ctx.save();
  ctx.translate(centerX, centerY - pcbY);
  ctx.scale(1, tiltX);

  // Copper traces on PCB
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.45)';
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.moveTo(-110 * scale, -40 * scale);
  ctx.lineTo(-40 * scale, -40 * scale);
  ctx.lineTo(-20 * scale, -10 * scale);
  ctx.moveTo(110 * scale, 40 * scale);
  ctx.lineTo(40 * scale, 40 * scale);
  ctx.lineTo(20 * scale, 10 * scale);
  ctx.stroke();

  // LJ939 4G Processor Chip (Center)
  ctx.beginPath();
  ctx.roundRect(-42 * scale, -42 * scale, 84 * scale, 84 * scale, 8 * scale);
  ctx.fillStyle = '#0a1913';
  ctx.fill();
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2 * scale;
  ctx.shadowColor = 'rgba(245, 158, 11, 0.5)';
  ctx.shadowBlur = 10 * scale;
  ctx.stroke();

  // Chip Gold Corner Pins
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  ctx.arc(-32 * scale, -32 * scale, 3 * scale, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = `800 ${10.5 * scale}px 'Orbitron', sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText('LJ939', 0, -8 * scale);
  ctx.font = `700 ${8 * scale}px 'Share Tech Mono', monospace`;
  ctx.fillStyle = '#f59e0b';
  ctx.fillText('4G LTE SOC', 0, 7 * scale);
  ctx.fillText('QUAD-CORE', 0, 20 * scale);

  // RAM & Flash Chips adjacent
  ctx.fillStyle = '#06130e';
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 1.2 * scale;
  ctx.strokeRect(-95 * scale, -30 * scale, 36 * scale, 60 * scale);
  ctx.fillRect(-95 * scale, -30 * scale, 36 * scale, 60 * scale);

  ctx.strokeRect(60 * scale, -30 * scale, 36 * scale, 60 * scale);
  ctx.fillRect(60 * scale, -30 * scale, 36 * scale, 60 * scale);

  ctx.font = `700 ${7 * scale}px 'Share Tech Mono', monospace`;
  ctx.fillStyle = '#10b981';
  ctx.fillText('eMMC', -77 * scale, 0);
  ctx.fillText('LPDDR', 78 * scale, 0);

  ctx.restore();

  // --- DRAW LAYER 3: 180° Rotatable Camera Module ---
  const camY = layerOffsets[3];
  ctx.save();
  ctx.translate(centerX, centerY - camY);
  ctx.scale(1, tiltX);

  // Camera Outer Ring
  ctx.beginPath();
  ctx.arc(0, 0, 52 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#0b1320';
  ctx.fill();
  ctx.lineWidth = 3 * scale;
  ctx.strokeStyle = '#ff5500';
  ctx.shadowColor = '#ff5500';
  ctx.shadowBlur = 14 * scale;
  ctx.stroke();

  // Camera Optical Lens Glass
  const lensGrad = ctx.createRadialGradient(
    -10 * scale,
    -10 * scale,
    5 * scale,
    0,
    0,
    38 * scale
  );
  lensGrad.addColorStop(0, '#38bdf8');
  lensGrad.addColorStop(0.3, '#0284c7');
  lensGrad.addColorStop(0.7, '#071e33');
  lensGrad.addColorStop(1, '#000000');
  ctx.beginPath();
  ctx.arc(0, 0, 36 * scale, 0, Math.PI * 2);
  ctx.fillStyle = lensGrad;
  ctx.fill();
  ctx.strokeStyle = '#7dd3fc';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Lens Core Pupil
  ctx.beginPath();
  ctx.arc(0, 0, 14 * scale, 0, Math.PI * 2);
  ctx.fillStyle = '#03080e';
  ctx.fill();

  // Camera Rotation Arrows HUD
  ctx.font = `800 ${8.5 * scale}px 'Orbitron', sans-serif`;
  ctx.fillStyle = '#ff5500';
  ctx.fillText('180° FLIP CAM', 0, 64 * scale);
  ctx.restore();

  // --- DRAW LAYER 4: Top 2.02" AMOLED Display Screen ---
  const screenY = layerOffsets[4];
  const screenGrad = ctx.createLinearGradient(
    centerX - wWatch / 2,
    centerY - screenY,
    centerX + wWatch / 2,
    centerY - screenY + hWatch * tiltX
  );
  screenGrad.addColorStop(0, 'rgba(0, 240, 255, 0.35)');
  screenGrad.addColorStop(0.5, 'rgba(11, 22, 38, 0.95)');
  screenGrad.addColorStop(1, 'rgba(0, 240, 255, 0.25)');
  drawIsoPlate(screenY, screenGrad, '#00f0ff', wWatch, hWatch, 48 * scale);

  // Curved Glass Gloss Reflection & Watch Display Interface
  ctx.save();
  ctx.translate(centerX, centerY - screenY);
  ctx.scale(1, tiltX);

  // Black AMOLED Bezel
  ctx.beginPath();
  ctx.roundRect(-wWatch * 0.44, -hWatch * 0.42, wWatch * 0.88, hWatch * 0.84, 32 * scale);
  ctx.fillStyle = '#000205';
  ctx.fill();
  ctx.strokeStyle = '#1e293b';
  ctx.lineWidth = 1.5 * scale;
  ctx.stroke();

  // Screen UI Content: Time 10:48, 4G Volte, Pulse
  ctx.font = `900 ${44 * scale}px 'Orbitron', sans-serif`;
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0, 240, 255, 0.6)';
  ctx.shadowBlur = 12 * scale;
  ctx.textAlign = 'center';
  ctx.fillText('10:48', 0, 5 * scale);

  ctx.font = `700 ${10 * scale}px 'Share Tech Mono', monospace`;
  ctx.fillStyle = '#00f0ff';
  ctx.fillText('4G LTE  ●●●●  VoLTE HD', 0, -28 * scale);

  ctx.font = `600 ${9 * scale}px 'Share Tech Mono', monospace`;
  ctx.fillStyle = '#10b981';
  ctx.fillText('♥ 78 BPM   |   8,420 STEPS', 0, 28 * scale);

  // Screen Glass Diagonal Glare Line
  const glareGrad = ctx.createLinearGradient(-120 * scale, -80 * scale, 80 * scale, 80 * scale);
  glareGrad.addColorStop(0, 'rgba(255,255,255,0.22)');
  glareGrad.addColorStop(0.3, 'rgba(255,255,255,0.02)');
  glareGrad.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = glareGrad;
  ctx.beginPath();
  ctx.roundRect(-wWatch * 0.44, -hWatch * 0.42, wWatch * 0.88, hWatch * 0.84, 32 * scale);
  ctx.fill();
  ctx.restore();

  // 6. Connecting Layer Dotted Alignment Axis Lines
  ctx.save();
  ctx.setLineDash([4 * scale, 6 * scale]);
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.4)';
  ctx.lineWidth = 1.5 * scale;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY - chassisY);
  ctx.lineTo(centerX, centerY - screenY);
  ctx.stroke();

  // Side guide lines
  ctx.beginPath();
  ctx.moveTo(centerX + wWatch / 2, centerY - chassisY);
  ctx.lineTo(centerX + wWatch / 2, centerY - screenY);
  ctx.stroke();
  ctx.restore();

  // 7. Render Interactive Callouts & Hardware Part Indicators
  if (showCallouts) {
    const callouts = [
      {
        partNum: 25,
        title: language === 'hi' ? '2.02" AMOLED स्क्रीन' : '2.02" AMOLED Display',
        sub: language === 'hi' ? '368x448 एचडी कर्व्ड पैनल' : '368x448 HD Curved Glass',
        targetX: centerX - wWatch * 0.35,
        targetY: centerY - screenY,
        calloutX: centerX - wWatch * 0.8,
        calloutY: centerY - screenY - 40 * scale,
        color: '#00f0ff',
      },
      {
        partNum: 22,
        title: language === 'hi' ? '180° रोटेटेबल कैमरा' : '180° Flip Camera',
        sub: language === 'hi' ? '5MP एचडी टेलीस्कोपिक लेंस' : '5MP HD Swivel Barrel',
        targetX: centerX,
        targetY: centerY - camY,
        calloutX: centerX + wWatch * 0.75,
        calloutY: centerY - camY - 20 * scale,
        color: '#ff5500',
      },
      {
        partNum: 1,
        title: language === 'hi' ? 'LJ939 4G सीपीयू' : 'LJ939 4G Quad Processor',
        sub: language === 'hi' ? 'मदरबोर्ड का मुख्य दिमाग' : 'Central Core Computing Engine',
        targetX: centerX,
        targetY: centerY - pcbY,
        calloutX: centerX - wWatch * 0.85,
        calloutY: centerY - pcbY,
        color: '#10b981',
      },
      {
        partNum: 34,
        title: language === 'hi' ? '1000mAh बैटरी' : '1000mAh Li-Po Battery',
        sub: language === 'hi' ? '3.8V हाई-डेंसिटी पावर सेल' : 'High-Density Lithium Cell',
        targetX: centerX - 30 * scale,
        targetY: centerY - battY,
        calloutX: centerX - wWatch * 0.8,
        calloutY: centerY - battY + 25 * scale,
        color: '#f59e0b',
      },
      {
        partNum: 20,
        title: language === 'hi' ? 'पावर रोटरी क्राउन' : 'Rotary Power Crown',
        sub: language === 'hi' ? 'सीएनसी ऑरेंज मेटल बटन' : 'CNC Knurled Switch',
        targetX: centerX + wWatch * 0.52,
        targetY: centerY - chassisY,
        calloutX: centerX + wWatch * 0.8,
        calloutY: centerY - chassisY - 10 * scale,
        color: '#ff5500',
      },
      {
        partNum: 29,
        title: language === 'hi' ? 'बायोमेट्रिक PPG सेंसर' : 'PPG Heart & SpO2 Sensor',
        sub: language === 'hi' ? 'ग्रीन लाइट ऑप्टिकल ट्रैकर' : 'Pulsed Green Optical Array',
        targetX: centerX,
        targetY: centerY - chassisY,
        calloutX: centerX + wWatch * 0.75,
        calloutY: centerY - chassisY + 45 * scale,
        color: '#a855f7',
      },
    ];

    callouts.forEach((c) => {
      const isSelected = c.partNum === activePartNum;
      ctx.save();

      // Pinpoint circle on part
      ctx.beginPath();
      ctx.arc(c.targetX, c.targetY, (isSelected ? 7 : 5) * scale, 0, Math.PI * 2);
      ctx.fillStyle = c.color;
      ctx.shadowColor = c.color;
      ctx.shadowBlur = 10 * scale;
      ctx.fill();

      // Connecting Pointer Line
      ctx.strokeStyle = c.color;
      ctx.lineWidth = (isSelected ? 2.5 : 1.5) * scale;
      ctx.beginPath();
      ctx.moveTo(c.targetX, c.targetY);
      const midX = (c.targetX + c.calloutX) / 2;
      ctx.lineTo(midX, c.calloutY);
      ctx.lineTo(c.calloutX, c.calloutY);
      ctx.stroke();

      // Callout Label Box
      const isRight = c.calloutX > centerX;
      const boxW = 210 * scale;
      const boxH = 46 * scale;
      const boxX = isRight ? c.calloutX : c.calloutX - boxW;
      const boxY = c.calloutY - boxH / 2;

      ctx.beginPath();
      ctx.roundRect(boxX, boxY, boxW, boxH, 6 * scale);
      ctx.fillStyle = 'rgba(7, 13, 22, 0.92)';
      ctx.fill();
      ctx.strokeStyle = isSelected ? '#ffffff' : c.color;
      ctx.lineWidth = (isSelected ? 2 : 1) * scale;
      ctx.stroke();

      // Badge Number
      ctx.fillStyle = c.color;
      ctx.beginPath();
      ctx.roundRect(boxX + 6 * scale, boxY + 8 * scale, 26 * scale, 30 * scale, 4 * scale);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.font = `800 ${11 * scale}px 'Orbitron', sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(`#${c.partNum}`, boxX + 19 * scale, boxY + 27 * scale);

      // Label Text
      ctx.textAlign = 'left';
      ctx.fillStyle = '#ffffff';
      ctx.font = `700 ${11 * scale}px 'Rajdhani', sans-serif`;
      ctx.fillText(c.title, boxX + 38 * scale, boxY + 20 * scale);
      ctx.fillStyle = '#94a3b8';
      ctx.font = `500 ${9.5 * scale}px 'Share Tech Mono', monospace`;
      ctx.fillText(c.sub, boxX + 38 * scale, boxY + 36 * scale);

      ctx.restore();
    });
  }

  // 8. Bottom Information Bar & 45-Parts Index Summary
  if (layout !== 'poster') {
    // Right panel: 45 Parts Inventory Summary
    const rightPanelX = width - 420 * scale;
    const rightPanelY = 110 * scale;
    const rightPanelW = 380 * scale;
    const rightPanelH = height - 160 * scale;

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(rightPanelX, rightPanelY, rightPanelW, rightPanelH, 12 * scale);
    ctx.fillStyle = 'rgba(11, 17, 24, 0.9)';
    ctx.fill();
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1.5 * scale;
    ctx.stroke();

    // Right panel header
    ctx.font = `800 ${14 * scale}px 'Orbitron', sans-serif`;
    ctx.fillStyle = '#ff5500';
    ctx.fillText(
      language === 'hi' ? '45 पार्ट्स स्ट्रक्चरल इंडेक्स' : '45 HARDWARE PARTS INVENTORY',
      rightPanelX + 16 * scale,
      rightPanelY + 32 * scale
    );

    let curY = rightPanelY + 60 * scale;
    CATEGORIES.forEach((cat) => {
      ctx.font = `700 ${11 * scale}px 'Rajdhani', sans-serif`;
      ctx.fillStyle = cat.color;
      ctx.fillText(
        language === 'hi' ? `${cat.titleHi} (${cat.range})` : `${cat.titleEn} (${cat.range})`,
        rightPanelX + 16 * scale,
        curY
      );

      // Mini progress bar / representation
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(rightPanelX + 16 * scale, curY + 6 * scale, rightPanelW - 32 * scale, 4 * scale);
      ctx.fillStyle = cat.color;
      ctx.fillRect(
        rightPanelX + 16 * scale,
        curY + 6 * scale,
        ((rightPanelW - 32 * scale) * cat.count) / 15,
        4 * scale
      );

      curY += 34 * scale;
    });

    // Active Part Details Card inside photo
    const activePart = PARTS_DATA.find((p) => p.num === activePartNum) || PARTS_DATA[0];
    const cardY = curY + 20 * scale;
    ctx.beginPath();
    ctx.roundRect(
      rightPanelX + 14 * scale,
      cardY,
      rightPanelW - 28 * scale,
      rightPanelH - (cardY - rightPanelY) - 16 * scale,
      10 * scale
    );
    ctx.fillStyle = '#060a10';
    ctx.fill();
    ctx.strokeStyle = '#00f0ff';
    ctx.stroke();

    ctx.font = `800 ${13 * scale}px 'Orbitron', sans-serif`;
    ctx.fillStyle = '#00f0ff';
    ctx.fillText(
      `PART #${activePart.num}: ${language === 'hi' ? activePart.nameHi : activePart.name}`,
      rightPanelX + 26 * scale,
      cardY + 30 * scale
    );

    ctx.font = `600 ${11 * scale}px 'Rajdhani', sans-serif`;
    ctx.fillStyle = '#f59e0b';
    ctx.fillText(
      `ROLE: ${language === 'hi' ? activePart.roleHi : activePart.role}`,
      rightPanelX + 26 * scale,
      cardY + 54 * scale
    );

    if (activePart.specs) {
      ctx.font = `500 ${10 * scale}px 'Share Tech Mono', monospace`;
      ctx.fillStyle = '#94a3b8';
      ctx.fillText(
        `SPECS: ${activePart.specs}`,
        rightPanelX + 26 * scale,
        cardY + 76 * scale
      );
    }

    ctx.font = `500 ${11 * scale}px 'Rajdhani', sans-serif`;
    ctx.fillStyle = '#cbd5e1';
    const textDesc = language === 'hi' ? activePart.descHi : activePart.desc;
    wrapText(
      ctx,
      textDesc,
      rightPanelX + 26 * scale,
      cardY + 104 * scale,
      rightPanelW - 52 * scale,
      18 * scale
    );

    ctx.restore();
  }

  // 9. Watermark & Footer Metadata
  ctx.save();
  ctx.font = `700 ${12 * scale}px 'Share Tech Mono', monospace`;
  ctx.fillStyle = '#475569';
  ctx.fillText(
    `ENGINEERED TEARDOWN // ${customWatermark} // ALL RIGHTS RESERVED`,
    pad + 15 * scale,
    height - pad - 10 * scale
  );

  ctx.textAlign = 'right';
  ctx.fillText(
    `RESOLUTION: ${width}x${height}px UHD PHOTO EXPORT`,
    width - pad - 15 * scale,
    height - pad - 10 * scale
  );
  ctx.restore();

  return canvas;
}

// Utility to wrap text on Canvas
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number
) {
  const words = text.split(' ');
  let line = '';

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, y);
      line = words[n] + ' ';
      y += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, y);
}
