import React, { useState } from 'react';
import { SmartwatchPart } from '../types.ts';
import { playSound } from '../utils/audio.ts';
import { Eye, RotateCcw, Sparkles } from 'lucide-react';

interface Watch3DStageProps {
  isExploded: boolean;
  explosionFactor: number; // 0 to 1
  rotationAngle: number; // 0 to 360
  pitchAngle: number; // e.g. 60
  isAutoSpinning: boolean;
  isXRayMode: boolean;
  activePart: SmartwatchPart;
  onSelectPart: (partNum: number) => void;
  language: 'hi' | 'en';
}

export const Watch3DStage: React.FC<Watch3DStageProps> = ({
  isExploded,
  explosionFactor,
  rotationAngle,
  pitchAngle,
  isAutoSpinning,
  isXRayMode,
  activePart,
  onSelectPart,
  language,
}) => {
  const [cameraFlip, setCameraFlip] = useState<boolean>(false);
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null);

  // Dynamic explosion Z-offsets based on explosionFactor (0 to 1)
  const mult = isExploded ? explosionFactor : 0;
  const zScreen = 185 * mult;
  const zCam = 110 * mult;
  const zPcb = 30 * mult;
  const zBattery = -60 * mult;
  const zChassis = -150 * mult;

  // Active layer detection
  const isScreenActive = activePart.layerIndex === 4;
  const isCamActive = activePart.layerIndex === 3;
  const isPcbActive = activePart.layerIndex === 2;
  const isBatteryActive = activePart.layerIndex === 1;
  const isChassisActive = activePart.layerIndex === 0;

  return (
    <div className="relative w-full max-w-[480px] h-[480px] flex items-center justify-center select-none overflow-visible">
      {/* HUD Background Radar Crosshairs */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-25">
        <div className="w-[380px] h-[380px] rounded-full border border-[#00f0ff]/30 border-dashed animate-[spin_60s_linear_infinite]" />
        <div className="w-[260px] h-[260px] rounded-full border border-[#ff5500]/25" />
        <div className="absolute w-full h-[1px] bg-gradient-to-r from-transparent via-[#00f0ff]/40 to-transparent" />
        <div className="absolute h-full w-[1px] bg-gradient-to-b from-transparent via-[#00f0ff]/40 to-transparent" />
      </div>

      {/* 3D Perspective Stage */}
      <div
        className="w-[320px] h-[380px] flex items-center justify-center perspective-1500"
        style={{ perspectiveOrigin: '50% 50%' }}
      >
        <div
          className={`relative w-[200px] h-[250px] transform-style-3d transition-transform duration-300 ease-out ${
            isAutoSpinning ? 'animate-spin-3d' : ''
          }`}
          style={
            !isAutoSpinning
              ? {
                  transform: `rotateX(${pitchAngle}deg) rotateZ(${rotationAngle}deg)`,
                }
              : undefined
          }
        >
          {/* ============================================================== */}
          {/* LAYER 4: 2.02" AMOLED CURVED DISPLAY (TOP)                     */}
          {/* ============================================================== */}
          <div
            onClick={() => {
              playSound.selectPart();
              onSelectPart(25);
            }}
            onMouseEnter={() => setHoveredLayer(4)}
            onMouseLeave={() => setHoveredLayer(null)}
            className={`absolute inset-0 rounded-[44px] cursor-pointer transition-all duration-700 ease-out flex items-center justify-center ${
              isXRayMode ? 'bg-[#00f0ff]/10 border-2 border-[#00f0ff]/80 backdrop-blur-xs' : 'bg-gradient-to-br from-[#0c2438]/95 via-[#020912]/95 to-[#001726]/95 border-2 border-[#00f0ff]'
            } ${
              isScreenActive || hoveredLayer === 4
                ? 'shadow-[0_0_35px_rgba(0,240,255,0.7)] ring-2 ring-[#00f0ff]'
                : 'shadow-[0_0_20px_rgba(0,240,255,0.25)]'
            }`}
            style={{
              transform: `translateZ(${zScreen}px)`,
              zIndex: 5,
            }}
          >
            {/* Display Bezel Glass */}
            <div className="relative w-[84%] h-[82%] rounded-[30px] bg-black border border-[#1e293b] overflow-hidden flex flex-col items-center justify-between p-3.5 shadow-inner">
              {/* Screen Top Status Bar */}
              <div className="w-full flex items-center justify-between text-[9px] font-mono-tech text-[#00f0ff]">
                <span className="flex items-center gap-1 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                  4G VoLTE
                </span>
                <span className="text-[#f59e0b]">98% ⚡</span>
              </div>

              {/* Digital Clock Display */}
              <div className="text-center my-auto">
                <div className="font-orbitron text-3xl font-black tracking-wider text-white drop-shadow-[0_0_12px_rgba(0,240,255,0.8)]">
                  10:48
                </div>
                <div className="font-mono-tech text-[10px] tracking-widest text-[#00f0ff] uppercase mt-0.5">
                  AMOLED 2.02" HD
                </div>
              </div>

              {/* Screen Bottom Widget */}
              <div className="w-full flex items-center justify-between text-[8.5px] font-mono-tech text-[#94a3b8] border-t border-[#1e293b]/80 pt-1">
                <span className="text-[#10b981]">♥ 76 BPM</span>
                <span>8,420 STEPS</span>
              </div>

              {/* Glass Diagonal Glare */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
            </div>

            {/* Floating Layer Tag */}
            <div className="absolute -top-3 left-4 px-2 py-0.5 rounded bg-[#00f0ff] text-black font-orbitron text-[8px] font-black tracking-wider uppercase shadow-md">
              {language === 'hi' ? 'लेयर 1: स्क्रीन (25-28)' : 'Layer 1: Display (25-28)'}
            </div>
          </div>

          {/* ============================================================== */}
          {/* LAYER 3: 180° ROTATABLE HD CAMERA MODULE                        */}
          {/* ============================================================== */}
          <div
            onClick={() => {
              playSound.selectPart();
              onSelectPart(22);
            }}
            onMouseEnter={() => setHoveredLayer(3)}
            onMouseLeave={() => setHoveredLayer(null)}
            className={`absolute w-[88px] h-[88px] rounded-full top-[80px] left-[56px] cursor-pointer transition-all duration-700 ease-out flex items-center justify-center ${
              isXRayMode ? 'bg-[#ff5500]/15 border-2 border-[#ff5500]' : 'bg-[#0b1320] border-2 border-[#ff5500]'
            } ${
              isCamActive || hoveredLayer === 3
                ? 'shadow-[0_0_35px_rgba(255,85,0,0.8)] ring-2 ring-[#ff5500] scale-105'
                : 'shadow-[0_0_20px_rgba(255,85,0,0.35)]'
            }`}
            style={{
              transform: `translateZ(${zCam}px) rotateY(${cameraFlip ? 180 : 0}deg)`,
              zIndex: 4,
            }}
          >
            {/* Camera Outer Dial Ring */}
            <div className="relative w-[66px] h-[66px] rounded-full bg-gradient-to-br from-[#1e293b] via-[#090e17] to-[#020508] border-2 border-[#ff5500]/80 flex items-center justify-center shadow-lg">
              {/* Camera Lens Elements */}
              <div className="w-[42px] h-[42px] rounded-full bg-[radial-gradient(circle_at_35%_35%,#38bdf8_10%,#0284c7_40%,#031e33_75%,#000000_100%)] border border-[#7dd3fc] flex items-center justify-center shadow-inner">
                {/* Aperture Core */}
                <div className="w-3.5 h-3.5 rounded-full bg-black border border-[#bae6fd]" />
              </div>

              {/* Lens Glint */}
              <div className="absolute top-2.5 left-2.5 w-3 h-3 rounded-full bg-white/40 blur-[1px] pointer-events-none" />
            </div>

            {/* Quick Rotate Camera Toggle Button on layer */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                playSound.click();
                setCameraFlip((prev) => !prev);
              }}
              title="180° Flip Camera"
              className="absolute -right-3 -top-2 w-7 h-7 rounded-full bg-[#ff5500] text-white flex items-center justify-center text-[10px] shadow-lg hover:scale-110 active:scale-95 transition-transform"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Camera Tag */}
            <div className="absolute -bottom-3 px-2 py-0.5 rounded bg-[#ff5500] text-black font-orbitron text-[8px] font-black tracking-wider uppercase whitespace-nowrap shadow-md">
              180° CAM (#22)
            </div>
          </div>

          {/* ============================================================== */}
          {/* LAYER 2: GREEN MULTI-LAYER MOTHERBOARD PCB                     */}
          {/* ============================================================== */}
          <div
            onClick={() => {
              playSound.selectPart();
              onSelectPart(1);
            }}
            onMouseEnter={() => setHoveredLayer(2)}
            onMouseLeave={() => setHoveredLayer(null)}
            className={`absolute inset-0 rounded-[42px] cursor-pointer transition-all duration-700 ease-out flex flex-col items-center justify-center p-4 ${
              isXRayMode
                ? 'bg-[#10b981]/15 border-2 border-[#10b981] backdrop-blur-xs'
                : 'bg-[#032a1e] border-2 border-[#10b981] pcb-grid'
            } ${
              isPcbActive || hoveredLayer === 2
                ? 'shadow-[0_0_35px_rgba(16,185,129,0.7)] ring-2 ring-[#10b981]'
                : 'shadow-[0_0_20px_rgba(16,185,129,0.3)]'
            }`}
            style={{
              transform: `translateZ(${zPcb}px)`,
              zIndex: 3,
            }}
          >
            {/* LJ939 4G Quad Core SOC Processor Chip */}
            <div className="relative bg-[#021f17] border-2 border-[#f59e0b] text-[#f59e0b] px-3 py-2 rounded-lg text-center shadow-[0_0_15px_rgba(245,158,11,0.4)] mb-2">
              {/* Corner gold pin indicator */}
              <div className="absolute top-1 left-1 w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
              <div className="font-orbitron text-[11px] font-extrabold tracking-wider text-white">
                LJ939 4G
              </div>
              <div className="font-mono-tech text-[8px] text-[#f59e0b] tracking-wider">
                QUAD-CORE SOC
              </div>
            </div>

            {/* RAM & ROM IC Chips on PCB */}
            <div className="flex gap-2 w-full justify-center">
              <div className="bg-[#01140e] border border-[#10b981] px-2 py-1 rounded text-center">
                <span className="font-mono-tech text-[8px] text-[#6ee7b7]">RAM IC</span>
              </div>
              <div className="bg-[#01140e] border border-[#10b981] px-2 py-1 rounded text-center">
                <span className="font-mono-tech text-[8px] text-[#6ee7b7]">64GB ROM</span>
              </div>
            </div>

            {/* Circuit Traces & Golden Contact Pads */}
            <div className="mt-2 text-center bg-black/60 px-2 py-1 rounded border border-[#10b981]/40">
              <span className="font-mono-tech text-[8px] text-[#10b981] tracking-widest uppercase">
                4G LTE RF + PMIC + AUDIO IC
              </span>
            </div>

            {/* Layer Tag */}
            <div className="absolute -top-3 left-4 px-2 py-0.5 rounded bg-[#10b981] text-black font-orbitron text-[8px] font-black tracking-wider uppercase shadow-md">
              {language === 'hi' ? 'लेयर 2: मदरबोर्ड (1-15)' : 'Layer 2: Motherboard (1-15)'}
            </div>
          </div>

          {/* ============================================================== */}
          {/* LAYER 1: 1000mAh LI-PO BATTERY & COIN VIBRATOR                 */}
          {/* ============================================================== */}
          <div
            onClick={() => {
              playSound.selectPart();
              onSelectPart(34);
            }}
            onMouseEnter={() => setHoveredLayer(1)}
            onMouseLeave={() => setHoveredLayer(null)}
            className={`absolute inset-0 rounded-[40px] cursor-pointer transition-all duration-700 ease-out flex flex-col items-center justify-center p-3 ${
              isXRayMode ? 'bg-[#334155]/20 border-2 border-[#64748b]' : 'bg-[#141d2b] border-2 border-[#475569]'
            } ${
              isBatteryActive || hoveredLayer === 1
                ? 'shadow-[0_0_30px_rgba(245,158,11,0.6)] ring-2 ring-[#f59e0b]'
                : 'shadow-[0_0_15px_rgba(0,0,0,0.5)]'
            }`}
            style={{
              transform: `translateZ(${zBattery}px)`,
              zIndex: 2,
            }}
          >
            {/* Battery Cell Pouch */}
            <div className="w-[82%] h-[68%] rounded-xl bg-gradient-to-br from-[#1f2937] via-[#0b1018] to-[#04070b] border border-[#475569] flex flex-col items-center justify-center p-2 text-center shadow-lg relative">
              <span className="font-orbitron text-[11px] font-bold text-[#f59e0b] tracking-wider">
                1000mAh
              </span>
              <span className="font-mono-tech text-[8px] text-[#94a3b8] mt-0.5">
                3.8V HIGH GAIN LI-PO
              </span>
              <span className="font-mono-tech text-[7px] text-[#10b981] mt-1 bg-black/50 px-2 py-0.5 rounded">
                SAFE PCM PROTECTION
              </span>

              {/* Battery Polarity Terminals */}
              <div className="absolute -top-1.5 left-4 flex gap-1">
                <span className="w-2.5 h-1.5 bg-[#ef4444] rounded-xs" title="VBAT +" />
                <span className="w-2.5 h-1.5 bg-[#3b82f6] rounded-xs" title="GND -" />
              </div>
            </div>

            {/* Coin Vibration Motor */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                playSound.selectPart();
                onSelectPart(35);
              }}
              title="Coin Vibration Motor (#35)"
              className="absolute bottom-4 right-5 w-7 h-7 rounded-full bg-[#cbd5e1] border-2 border-[#f59e0b] shadow-[0_0_10px_rgba(245,158,11,0.5)] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform"
            >
              <div className="w-2.5 h-2.5 rounded-full bg-[#94a3b8] border border-black/40" />
            </div>

            {/* Layer Tag */}
            <div className="absolute -top-3 left-4 px-2 py-0.5 rounded bg-[#f59e0b] text-black font-orbitron text-[8px] font-black tracking-wider uppercase shadow-md">
              {language === 'hi' ? 'लेयर 3: बैटरी (34-35)' : 'Layer 3: Battery (34-35)'}
            </div>
          </div>

          {/* ============================================================== */}
          {/* LAYER 0: TITANIUM CHASSIS & BIOMETRICS (BOTTOM)                */}
          {/* ============================================================== */}
          <div
            onClick={() => {
              playSound.selectPart();
              onSelectPart(29);
            }}
            onMouseEnter={() => setHoveredLayer(0)}
            onMouseLeave={() => setHoveredLayer(null)}
            className={`absolute inset-0 rounded-[44px] cursor-pointer transition-all duration-700 ease-out flex items-center justify-center ${
              isXRayMode
                ? 'bg-[#1e293b]/20 border-2 border-[#38bdf8]'
                : 'bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#04070e] border-2 border-[#64748b]'
            } ${
              isChassisActive || hoveredLayer === 0
                ? 'shadow-[0_0_35px_rgba(255,85,0,0.6)] ring-2 ring-[#ff5500]'
                : 'shadow-[0_0_18px_rgba(0,0,0,0.6)]'
            }`}
            style={{
              transform: `translateZ(${zChassis}px)`,
              zIndex: 1,
            }}
          >
            {/* Orange Rotary Power Crown Button (Right) */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                playSound.selectPart();
                onSelectPart(20);
              }}
              title="Power Rotary Crown (#20)"
              className="absolute -right-3 top-[50px] w-3.5 h-10 rounded-sm bg-[#ff5500] border border-[#ffaa00] shadow-[0_0_12px_rgba(255,85,0,0.8)] cursor-pointer hover:scale-110 transition-transform"
            />

            {/* SIM Card Tray Eject Slot (Left) */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                playSound.selectPart();
                onSelectPart(17);
              }}
              title="Nano-SIM Slot (#17)"
              className="absolute -left-2.5 top-[60px] w-2.5 h-11 rounded-xs bg-[#64748b] border border-[#94a3b8] cursor-pointer hover:bg-[#94a3b8] transition-colors"
            />

            {/* Optical PPG Heart Rate & SpO2 Sensor Plate (Center Back) */}
            <div className="w-14 h-14 rounded-full bg-black border-2 border-[#10b981] flex items-center justify-center relative shadow-[0_0_15px_rgba(16,185,129,0.3)]">
              {/* Green Optical LEDs */}
              <div className="w-4 h-4 rounded-full bg-[#10b981] shadow-[0_0_12px_#10b981] animate-ping" />
              <div className="absolute w-3 h-3 rounded-full bg-[#10b981]" />
            </div>

            {/* 4-Pin Magnetic Charging Contacts */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                playSound.selectPart();
                onSelectPart(33);
              }}
              title="Magnetic Charging Contacts (#33)"
              className="absolute bottom-5 flex gap-1.5 cursor-pointer bg-black/60 px-2 py-1 rounded border border-[#f59e0b]/40"
            >
              {[1, 2, 3, 4].map((pin) => (
                <div
                  key={pin}
                  className="w-2 h-2 rounded-full bg-[#f59e0b] shadow-[0_0_5px_#f59e0b]"
                />
              ))}
            </div>

            {/* Layer Tag */}
            <div className="absolute -top-3 left-4 px-2 py-0.5 rounded bg-[#475569] text-white font-orbitron text-[8px] font-black tracking-wider uppercase shadow-md">
              {language === 'hi' ? 'लेयर 5: चेसिस और सेंसर (29-33)' : 'Layer 5: Chassis & Sensors (29-33)'}
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Helper Overlay Tags */}
      <div className="absolute bottom-1 left-2 flex items-center gap-1.5 text-[10px] font-mono-tech text-[#94a3b8] bg-black/60 px-2.5 py-1 rounded-md border border-[#1e293b]">
        <Sparkles className="w-3 h-3 text-[#ff5500]" />
        <span>
          {language === 'hi'
            ? 'किसी भी लेयर पर क्लिक करके विवरण देखें'
            : 'Click any layer to inspect component'}
        </span>
      </div>

      {isXRayMode && (
        <div className="absolute top-2 right-2 flex items-center gap-1 text-[10px] font-mono-tech text-[#00f0ff] bg-[#00f0ff]/10 border border-[#00f0ff] px-2 py-0.5 rounded">
          <Eye className="w-3 h-3" />
          <span>X-RAY ACTIVE</span>
        </div>
      )}
    </div>
  );
};
