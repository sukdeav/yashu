import React, { useState } from 'react';
import { PARTS_DATA } from './data/partsData.ts';
import { SmartwatchPart } from './types.ts';
import { WatchThreeCanvas } from './components/WatchThreeCanvas.tsx';
import { PhotoStudioModal } from './components/PhotoStudioModal.tsx';
import { playSound } from './utils/audio.ts';
import {
  Camera,
  RotateCw,
  Sparkles,
  Download,
  Share2,
  Check,
  Crown,
  Eye,
  EyeOff,
  Layers,
  Tag,
} from 'lucide-react';

export default function App() {
  const [activePartNum, setActivePartNum] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'realistic' | 'three3d'>('realistic');
  const [isExploded, setIsExploded] = useState<boolean>(true);
  const [explosionFactor, setExplosionFactor] = useState<number>(1);
  const [isAutoSpinning, setIsAutoSpinning] = useState<boolean>(false);
  const [rotationAngle, setRotationAngle] = useState<number>(180);
  const [show3dLabels, setShow3dLabels] = useState<boolean>(false); // Labels toggle: Off by default for clean realistic view
  const [labelMode, setLabelMode] = useState<'all' | 'selected' | 'none'>('selected'); // 'all' or 'selected'
  const [showPhotoCallouts, setShowPhotoCallouts] = useState<boolean>(true);
  const [isPhotoStudioOpen, setIsPhotoStudioOpen] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const activePart: SmartwatchPart =
    PARTS_DATA.find((p) => p.num === activePartNum) || PARTS_DATA[0];

  const handleSelectPart = (num: number) => {
    playSound.selectPart();
    setActivePartNum(num);
  };

  const handleToggleExplode = () => {
    playSound.explode();
    setIsExploded((prev) => !prev);
  };

  const handleCopySpecs = () => {
    playSound.click();
    const text = `YASHU PUDO 4G - Part #${activePart.num}: ${activePart.name} (${activePart.nameHi}) - ${activePart.descHi}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMasterPhoto = () => {
    playSound.shutter();
    const a = document.createElement('a');
    a.href = '/assets/aistudio/YASHU_PUDO_Neon_Smartwatch_Teardown_620ffbde.png';
    a.download = 'YASHU_PUDO_4G_Smartwatch_45Parts_Teardown_Architecture.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Grouped parts
  const group1_15 = PARTS_DATA.slice(0, 15);
  const group16_19 = PARTS_DATA.slice(15, 19);
  const group20_24 = PARTS_DATA.slice(19, 24);
  const group25_28 = PARTS_DATA.slice(24, 28);
  const group29_33 = PARTS_DATA.slice(28, 33);
  const group34_45 = PARTS_DATA.slice(33, 45);

  return (
    <div className="min-h-screen w-full bg-[#04070b] text-[#e2e8f0] font-sans flex flex-col items-center justify-between p-2 sm:p-4 select-none">
      {/* ============================================================== */}
      {/* TOP HEADER (MATCHING USER'S IMAGE 2)                           */}
      {/* ============================================================== */}
      <header className="w-full max-w-[1440px] flex items-center justify-between gap-4 py-2 px-3 border-b border-[#142e44] bg-[#07111b]/80 backdrop-blur-md rounded-xl mb-3">
        {/* Left Brand Badge */}
        <div className="flex items-center gap-2">
          <div className="px-3 py-1 rounded-lg bg-[#0b1624] border border-[#1d3c58] text-sm font-black tracking-wider text-white">
            YASHU <span className="text-[#ff5500]">PUDO</span>
          </div>
        </div>

        {/* Center Main Title */}
        <div className="text-center flex-1">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black italic tracking-widest text-white leading-none">
            YASHU <span className="text-[#ffa31a] not-italic">PUDO</span>
          </h1>
          <p className="text-[10px] sm:text-xs text-[#94a3b8] font-mono-tech tracking-wider mt-1 uppercase">
            LJ939 4G SMARTWATCH // 45 PARTS TEARDOWN ARCHITECTURE
          </p>
        </div>

        {/* Right Badge & Quick Photo Action */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border border-[#22d3ee] text-[#22d3ee] font-bold text-xs tracking-wider">
            <span>45 HARDWARE PARTS v2.0</span>
          </div>

          <button
            onClick={handleDownloadMasterPhoto}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#ff9a1f] to-[#ff5500] text-black font-extrabold text-xs shadow-[0_0_15px_rgba(255,154,31,0.5)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>डाउनलोड फोटो</span>
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* 3-COLUMN COCKPIT LAYOUT (LEFT 3 BOXES, CENTER 3D, RIGHT 3 BOXES) */}
      {/* ============================================================== */}
      <div className="w-full max-w-[1440px] grid grid-cols-1 lg:grid-cols-12 gap-3 items-start flex-1">
        
        {/* ------------------------------------------------------------ */}
        {/* LEFT COLUMN: 1. Motherboard, 2. Left Side, 3. Right Side     */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-3 space-y-3">
          {/* Box 1: मदरबोर्ड के 15 मुख्य पार्ट्स (1-15) */}
          <div className="bg-[#0b1420]/95 border border-[#ff9a1f] rounded-xl p-2.5 shadow-[0_0_15px_rgba(255,154,31,0.15)]">
            <h3 className="text-xs sm:text-[13px] font-bold text-[#ff9a1f] pb-1.5 mb-1.5 border-b border-[#251e18] flex items-center justify-between">
              <span>1. मदरबोर्ड के 15 मुख्य पार्ट्स</span>
              <span className="text-[10px] text-[#94a3b8] font-mono-tech">(1–15)</span>
            </h3>
            <div className="space-y-1">
              {group1_15.map((part) => {
                const isSel = part.num === activePartNum;
                return (
                  <button
                    key={part.num}
                    onClick={() => handleSelectPart(part.num)}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-left transition-all cursor-pointer ${
                      isSel
                        ? 'bg-[#ff9a1f] text-black font-bold shadow-md'
                        : 'text-[#e2e8f0] hover:bg-[#122234] hover:text-[#ff9a1f]'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center shrink-0 font-bold ${
                        isSel
                          ? 'bg-black text-[#ff9a1f]'
                          : 'bg-[#ff9a1f] text-black'
                      }`}
                    >
                      {part.num}
                    </span>
                    <span className="text-xs truncate">{part.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Box 2: Left Side (बाईं तरफ) (16-19) */}
          <div className="bg-[#0b1420]/95 border border-[#22e07a] rounded-xl p-2.5 shadow-[0_0_15px_rgba(34,224,122,0.15)]">
            <h3 className="text-xs sm:text-[13px] font-bold text-[#22e07a] pb-1.5 mb-1.5 border-b border-[#142820] flex items-center justify-between">
              <span>2. Left Side (बाईं तरफ)</span>
              <span className="text-[10px] text-[#94a3b8] font-mono-tech">(16–19)</span>
            </h3>
            <div className="space-y-1">
              {group16_19.map((part) => {
                const isSel = part.num === activePartNum;
                return (
                  <button
                    key={part.num}
                    onClick={() => handleSelectPart(part.num)}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-left transition-all cursor-pointer ${
                      isSel
                        ? 'bg-[#22e07a] text-black font-bold shadow-md'
                        : 'text-[#e2e8f0] hover:bg-[#122234] hover:text-[#22e07a]'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center shrink-0 font-bold ${
                        isSel
                          ? 'bg-black text-[#22e07a]'
                          : 'bg-[#ff9a1f] text-black'
                      }`}
                    >
                      {part.num}
                    </span>
                    <span className="text-xs truncate">{part.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Box 3: Right Side (दाईं तरफ) (20-24) */}
          <div className="bg-[#0b1420]/95 border border-[#c084fc] rounded-xl p-2.5 shadow-[0_0_15px_rgba(192,132,252,0.15)]">
            <h3 className="text-xs sm:text-[13px] font-bold text-[#c084fc] pb-1.5 mb-1.5 border-b border-[#241a2f] flex items-center justify-between">
              <span>3. Right Side (दाईं तरफ)</span>
              <span className="text-[10px] text-[#94a3b8] font-mono-tech">(20–24)</span>
            </h3>
            <div className="space-y-1">
              {group20_24.map((part) => {
                const isSel = part.num === activePartNum;
                return (
                  <button
                    key={part.num}
                    onClick={() => handleSelectPart(part.num)}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-left transition-all cursor-pointer ${
                      isSel
                        ? 'bg-[#c084fc] text-black font-bold shadow-md'
                        : 'text-[#e2e8f0] hover:bg-[#122234] hover:text-[#c084fc]'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center shrink-0 font-bold ${
                        isSel
                          ? 'bg-black text-[#c084fc]'
                          : 'bg-[#ff9a1f] text-black'
                      }`}
                    >
                      {part.num}
                    </span>
                    <span className="text-xs truncate">{part.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* CENTER COLUMN: Master Realistic Render & 3D Interactive Stage */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-6 flex flex-col items-center">
          {/* View Mode Switcher Pills */}
          <div className="w-full flex items-center justify-between mb-2 px-1">
            <div className="flex items-center gap-1.5 bg-[#0b1522] p-1 rounded-xl border border-[#16445b]">
              <button
                onClick={() => {
                  playSound.click();
                  setViewMode('realistic');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'realistic'
                    ? 'bg-gradient-to-r from-[#ff9a1f] to-[#ff6600] text-black shadow-md'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>📸 Realistic Master View</span>
              </button>

              <button
                onClick={() => {
                  playSound.click();
                  setViewMode('three3d');
                }}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === 'three3d'
                    ? 'bg-[#00eaff] text-black shadow-md'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>🌐 3D Interactive Orbit</span>
              </button>
            </div>

            <button
              onClick={() => setIsPhotoStudioOpen(true)}
              className="text-xs text-[#00eaff] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#ff9a1f]" />
              <span>4K पोस्टर फोटो</span>
            </button>
          </div>

          {/* STAGE DISPLAY CONTAINER */}
          <div className="w-full relative bg-[#040810] border border-[#143248] rounded-2xl overflow-hidden shadow-2xl flex items-center justify-center min-h-[460px] sm:min-h-[500px]">
            {viewMode === 'realistic' ? (
              // MASTER PHOTO VIEW (MATCHING USER'S IMAGE 2 EXACTLY!)
              <div className="relative w-full h-full flex items-center justify-center p-2 group">
                <img
                  src="/assets/aistudio/YASHU_PUDO_Neon_Smartwatch_Teardown_620ffbde.png"
                  alt="YASHU PUDO 4G Smartwatch Realistic Teardown"
                  className="w-full h-auto max-h-[500px] object-contain rounded-xl drop-shadow-[0_0_30px_rgba(0,234,255,0.2)]"
                />

                {/* Interactive Clickable Hotspot Callout Overlays */}
                {/* #25 Display Screen Hotspot */}
                <button
                  onClick={() => handleSelectPart(25)}
                  className="absolute top-[8%] right-[8%] sm:right-[14%] flex items-center gap-1.5 bg-[#0b1624]/90 border border-[#ff9a1f] px-2.5 py-1 rounded-lg text-left shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  <span className="w-5 h-5 rounded-md bg-[#ff9a1f] text-black font-bold text-[10px] flex items-center justify-center">
                    #25
                  </span>
                  <div>
                    <div className="text-[11px] font-bold text-[#ff9a1f]">Display Screen</div>
                    <div className="text-[9px] text-[#cbd5e1]">AMOLED 2.02 HD Curved</div>
                  </div>
                </button>

                {/* #22 Camera Hotspot */}
                <button
                  onClick={() => handleSelectPart(22)}
                  className="absolute top-[22%] left-[4%] sm:left-[8%] flex items-center gap-1.5 bg-[#0b1624]/90 border border-[#ff9a1f] px-2.5 py-1 rounded-lg text-left shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  <span className="w-5 h-5 rounded-md bg-[#ff9a1f] text-black font-bold text-[10px] flex items-center justify-center">
                    #22
                  </span>
                  <div>
                    <div className="text-[11px] font-bold text-[#ff9a1f]">180° Camera</div>
                    <div className="text-[9px] text-[#cbd5e1]">Rotatable HD Module</div>
                  </div>
                </button>

                {/* #1 CPU Hotspot */}
                <button
                  onClick={() => handleSelectPart(1)}
                  className="absolute top-[32%] right-[4%] sm:right-[8%] flex items-center gap-1.5 bg-[#0b1624]/90 border border-[#ff9a1f] px-2.5 py-1 rounded-lg text-left shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  <span className="w-5 h-5 rounded-md bg-[#ff9a1f] text-black font-bold text-[10px] flex items-center justify-center">
                    #1
                  </span>
                  <div>
                    <div className="text-[11px] font-bold text-[#ff9a1f]">CPU / Processor</div>
                    <div className="text-[9px] text-[#cbd5e1]">LJ939 Quad-Core 4G Chip</div>
                  </div>
                </button>

                {/* #34 Battery Hotspot */}
                <button
                  onClick={() => handleSelectPart(34)}
                  className="absolute bottom-[36%] left-[4%] sm:left-[8%] flex items-center gap-1.5 bg-[#0b1624]/90 border border-[#ff9a1f] px-2.5 py-1 rounded-lg text-left shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  <span className="w-5 h-5 rounded-md bg-[#ff9a1f] text-black font-bold text-[10px] flex items-center justify-center">
                    #34
                  </span>
                  <div>
                    <div className="text-[11px] font-bold text-[#ff9a1f]">Rechargeable Battery</div>
                    <div className="text-[9px] text-[#cbd5e1]">1000mAh 3.8V Li-Po</div>
                  </div>
                </button>

                {/* #29 Heart Rate Sensor Hotspot */}
                <button
                  onClick={() => handleSelectPart(29)}
                  className="absolute bottom-[24%] right-[6%] sm:right-[12%] flex items-center gap-1.5 bg-[#0b1624]/90 border border-[#ff9a1f] px-2.5 py-1 rounded-lg text-left shadow-lg hover:scale-105 transition-all cursor-pointer"
                >
                  <span className="w-5 h-5 rounded-md bg-[#ff9a1f] text-black font-bold text-[10px] flex items-center justify-center">
                    #29
                  </span>
                  <div>
                    <div className="text-[11px] font-bold text-[#ff9a1f]">Heart Rate Sensor</div>
                    <div className="text-[9px] text-[#cbd5e1]">Optical PPG Sensor</div>
                  </div>
                </button>

                {/* Top overlay badge & Callouts Toggle */}
                <div className="absolute top-2 left-2 flex items-center gap-2">
                  <div className="px-2.5 py-1 rounded-md bg-black/75 border border-[#22d3ee]/50 text-[10px] font-mono-tech text-[#22d3ee]">
                    ✨ Master Realistic Render • Click parts to inspect
                  </div>
                  <button
                    onClick={() => {
                      playSound.click();
                      setShowPhotoCallouts(!showPhotoCallouts);
                    }}
                    className="px-2 py-1 rounded-md bg-[#0b1624]/90 border border-[#1d3c58] text-[10px] text-[#cbd5e1] hover:text-[#00eaff] transition-colors cursor-pointer flex items-center gap-1"
                    title={showPhotoCallouts ? 'कॉलआउट्स हटाएं' : 'कॉलआउट्स दिखाएं'}
                  >
                    {showPhotoCallouts ? <EyeOff className="w-3 h-3 text-[#ffa31a]" /> : <Eye className="w-3 h-3 text-[#22e07a]" />}
                    <span>{showPhotoCallouts ? 'कॉलआउट्स हटाएं' : 'कॉलआउट्स लगाएं'}</span>
                  </button>
                </div>
              </div>
            ) : (
              // THREE.JS 3D INTERACTIVE WEBGL ENGINE
              <div className="relative w-full h-full">
                <WatchThreeCanvas
                  activePartNum={activePartNum}
                  onSelectPart={handleSelectPart}
                  isExploded={isExploded}
                  explosionFactor={explosionFactor}
                  isAutoSpinning={isAutoSpinning}
                  showLabels={show3dLabels}
                  labelMode={labelMode}
                  onToggleLabels={() => {
                    playSound.click();
                    setShow3dLabels(!show3dLabels);
                  }}
                  language="hi"
                />

                {/* 3D Stage Tag Mode Selector Banner */}
                <div className="absolute top-2 left-2 flex items-center gap-1.5 z-10">
                  <button
                    onClick={() => {
                      playSound.click();
                      setShow3dLabels(!show3dLabels);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition-all cursor-pointer flex items-center gap-1.5 backdrop-blur-xs ${
                      show3dLabels
                        ? 'bg-[#00eaff] text-[#04070b] border-[#00eaff] shadow-[0_0_12px_rgba(0,234,255,0.4)]'
                        : 'bg-[#0b1522]/90 text-[#94a3b8] border-[#16445b] hover:text-white'
                    }`}
                  >
                    <Tag className="w-3 h-3" />
                    <span>{show3dLabels ? '🏷 1-45 टैग हटाएं (Hide)' : '🏷 1-45 टैग लगाएं (Show)'}</span>
                  </button>

                  {show3dLabels && (
                    <div className="flex items-center gap-1 bg-[#0b1522]/95 border border-[#16445b] p-0.5 rounded-lg text-[10px]">
                      <button
                        onClick={() => {
                          playSound.click();
                          setLabelMode('selected');
                        }}
                        className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                          labelMode === 'selected'
                            ? 'bg-[#ff9a1f] text-black font-bold'
                            : 'text-[#94a3b8] hover:text-white'
                        }`}
                        title="केवल चुने हुए पार्ट का टैग दिखाएं"
                      >
                        🎯 केवल सिलेक्टेड
                      </button>
                      <button
                        onClick={() => {
                          playSound.click();
                          setLabelMode('all');
                        }}
                        className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                          labelMode === 'all'
                            ? 'bg-[#ff9a1f] text-black font-bold'
                            : 'text-[#94a3b8] hover:text-white'
                        }`}
                        title="सभी 45 पार्ट्स के टैग दिखाएं"
                      >
                        🏷 सभी 45
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Controls Bar (Exploded, 360 Spin, Assembled & 1-45 Tags) */}
          <div className="w-full flex flex-wrap items-center justify-center gap-2 my-2.5">
            <button
              onClick={handleToggleExplode}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                isExploded
                  ? 'bg-gradient-to-r from-[#ff5500] to-[#ff2a00] text-black border-[#ff5500] shadow-[0_0_20px_rgba(255,85,0,0.5)]'
                  : 'bg-[#0b1522] text-[#e2e8f0] border-[#ff5500] hover:bg-[#122234]'
              }`}
            >
              <span>💥</span>
              <span>Exploded (अलग करें)</span>
            </button>

            <button
              onClick={() => {
                playSound.click();
                setIsAutoSpinning(!isAutoSpinning);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                isAutoSpinning
                  ? 'bg-gradient-to-r from-[#00eaff] to-[#0099ff] text-black border-[#00eaff] shadow-[0_0_20px_rgba(0,234,255,0.5)]'
                  : 'bg-[#0b1522] text-[#e2e8f0] border-[#00eaff] hover:bg-[#122234]'
              }`}
            >
              <RotateCw className={`w-3.5 h-3.5 ${isAutoSpinning ? 'animate-spin' : ''}`} />
              <span>360° Auto Spin</span>
            </button>

            {/* BUTTON TO REMOVE / ADD 1-45 TAGS (उसको हटाने वाला भी और लगाने वाला भी) */}
            <button
              onClick={() => {
                playSound.click();
                setShow3dLabels(!show3dLabels);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                show3dLabels
                  ? 'bg-[#00eaff] text-[#04070b] border-[#00eaff] shadow-[0_0_15px_rgba(0,234,255,0.4)]'
                  : 'bg-[#0b1522] text-[#e2e8f0] border-[#16445b] hover:border-[#00eaff]'
              }`}
              title={show3dLabels ? '3D में 1 से 45 टैग्स हटाएं' : '3D में 1 से 45 टैग्स लगाएं'}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>
                {show3dLabels
                  ? '🏷 1-45 टैग हटाएं (Hide)'
                  : '🏷 1-45 टैग लगाएं (Show)'}
              </span>
            </button>

            <button
              onClick={() => {
                playSound.explode();
                setIsExploded(false);
              }}
              className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                !isExploded
                  ? 'bg-[#fbbf24] text-black border-[#fbbf24] shadow-[0_0_15px_rgba(251,191,36,0.4)]'
                  : 'bg-[#0b1522] text-[#e2e8f0] border-[#25425c] hover:border-[#fbbf24]'
              }`}
            >
              <span>📦</span>
              <span>Assembled (जोड़ें)</span>
            </button>
          </div>

          {/* 0° to 360° Angle Slider Bar */}
          <div className="w-full max-w-[500px] flex items-center justify-between gap-3 px-3 py-1.5 bg-[#0b1522] border border-[#143248] rounded-xl text-xs font-mono-tech text-[#94a3b8] mb-2">
            <span>0°</span>
            <input
              type="range"
              min="0"
              max="360"
              value={rotationAngle}
              onChange={(e) => setRotationAngle(Number(e.target.value))}
              className="flex-1 accent-[#00eaff] cursor-pointer"
            />
            <span className="text-[#00eaff] font-bold">360°</span>
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* RIGHT COLUMN: 4. Top Side, 5. Bottom Side, 6. Internal Parts */}
        {/* ------------------------------------------------------------ */}
        <div className="lg:col-span-3 space-y-3">
          {/* Box 4: ऊपर की तरफ (Top Side) (25-28) */}
          <div className="bg-[#0b1420]/95 border border-[#38bdf8] rounded-xl p-2.5 shadow-[0_0_15px_rgba(56,189,248,0.15)]">
            <h3 className="text-xs sm:text-[13px] font-bold text-[#38bdf8] pb-1.5 mb-1.5 border-b border-[#122838] flex items-center justify-between">
              <span>4. ऊपर की तरफ (Top Side)</span>
              <span className="text-[10px] text-[#94a3b8] font-mono-tech">(25–28)</span>
            </h3>
            <div className="space-y-1">
              {group25_28.map((part) => {
                const isSel = part.num === activePartNum;
                return (
                  <button
                    key={part.num}
                    onClick={() => handleSelectPart(part.num)}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-left transition-all cursor-pointer ${
                      isSel
                        ? 'bg-[#38bdf8] text-black font-bold shadow-md'
                        : 'text-[#e2e8f0] hover:bg-[#122234] hover:text-[#38bdf8]'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center shrink-0 font-bold ${
                        isSel
                          ? 'bg-black text-[#38bdf8]'
                          : 'bg-[#ff9a1f] text-black'
                      }`}
                    >
                      {part.num}
                    </span>
                    <span className="text-xs truncate">{part.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Box 5: नीचे की तरफ (Bottom Side) (29-33) */}
          <div className="bg-[#0b1420]/95 border border-[#22d3ee] rounded-xl p-2.5 shadow-[0_0_15px_rgba(34,211,238,0.15)]">
            <h3 className="text-xs sm:text-[13px] font-bold text-[#22d3ee] pb-1.5 mb-1.5 border-b border-[#122c36] flex items-center justify-between">
              <span>5. नीचे की तरफ (Bottom Side)</span>
              <span className="text-[10px] text-[#94a3b8] font-mono-tech">(29–33)</span>
            </h3>
            <div className="space-y-1">
              {group29_33.map((part) => {
                const isSel = part.num === activePartNum;
                return (
                  <button
                    key={part.num}
                    onClick={() => handleSelectPart(part.num)}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-left transition-all cursor-pointer ${
                      isSel
                        ? 'bg-[#22d3ee] text-black font-bold shadow-md'
                        : 'text-[#e2e8f0] hover:bg-[#122234] hover:text-[#22d3ee]'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center shrink-0 font-bold ${
                        isSel
                          ? 'bg-black text-[#22d3ee]'
                          : 'bg-[#ff9a1f] text-black'
                      }`}
                    >
                      {part.num}
                    </span>
                    <span className="text-xs truncate">{part.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Box 6: घड़ी के अंदर के अन्य पार्ट्स (34-45) */}
          <div className="bg-[#0b1420]/95 border border-[#fbbf24] rounded-xl p-2.5 shadow-[0_0_15px_rgba(251,191,36,0.15)]">
            <h3 className="text-xs sm:text-[13px] font-bold text-[#fbbf24] pb-1.5 mb-1.5 border-b border-[#2c2414] flex items-center justify-between">
              <span>6. घड़ी के अंदर के अन्य पार्ट्स</span>
              <span className="text-[10px] text-[#94a3b8] font-mono-tech">(34–45)</span>
            </h3>
            <div className="space-y-1">
              {group34_45.map((part) => {
                const isSel = part.num === activePartNum;
                return (
                  <button
                    key={part.num}
                    onClick={() => handleSelectPart(part.num)}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded-md text-left transition-all cursor-pointer ${
                      isSel
                        ? 'bg-[#fbbf24] text-black font-bold shadow-md'
                        : 'text-[#e2e8f0] hover:bg-[#122234] hover:text-[#fbbf24]'
                    }`}
                  >
                    <span
                      className={`w-4 h-4 rounded-full text-[10px] flex items-center justify-center shrink-0 font-bold ${
                        isSel
                          ? 'bg-black text-[#fbbf24]'
                          : 'bg-[#ff9a1f] text-black'
                      }`}
                    >
                      {part.num}
                    </span>
                    <span className="text-xs truncate">{part.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* ============================================================== */}
      {/* BOTTOM FOOTER SECTION (EXACTLY MATCHING IMAGE 2!)              */}
      {/* ============================================================== */}
      <footer className="w-full max-w-[1440px] mt-3 pt-2 grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
        {/* Left: 4G VoLTE Signal Badge */}
        <div className="md:col-span-3 flex items-center gap-3 bg-[#07111c] border border-[#143248] rounded-2xl p-3">
          <div className="text-center font-black tracking-wider">
            <div className="text-[#00eaff] text-xl font-orbitron leading-none">4G</div>
            <div className="text-[10px] text-[#00eaff] font-mono-tech mt-0.5">VoLTE</div>
          </div>
          {/* Signal Bars */}
          <div className="flex items-end gap-1 h-8">
            <span className="w-1.5 h-3 bg-[#00eaff] rounded-xs" />
            <span className="w-1.5 h-4.5 bg-[#00eaff] rounded-xs" />
            <span className="w-1.5 h-6 bg-[#00eaff] rounded-xs" />
            <span className="w-1.5 h-7.5 bg-[#00eaff] rounded-xs animate-pulse" />
          </div>
          <div className="text-[11px] text-[#94a3b8] font-mono-tech leading-tight ml-1">
            HIGH-SPEED<br />CONNECTIVITY
          </div>
        </div>

        {/* Center: Selected Part Info with Glowing Gold LJ939 Chip */}
        <div className="md:col-span-6 flex items-center gap-3 bg-[#07111c] border border-[#22d3ee]/60 rounded-2xl p-3 shadow-[0_0_20px_rgba(34,211,238,0.15)] relative overflow-hidden">
          {/* Gold LJ939 Chip Icon */}
          <div className="relative shrink-0 w-16 h-16 rounded-xl bg-[#0e1610] border-2 border-[#fbbf24] shadow-[0_0_15px_rgba(251,191,36,0.5)] flex flex-col items-center justify-center">
            {/* Top/bottom chip gold pin leads */}
            <div className="absolute -top-1.5 inset-x-2 flex justify-between">
              {[1, 2, 3, 4].map((p) => (
                <span key={p} className="w-1 h-1.5 bg-[#fbbf24] rounded-xs" />
              ))}
            </div>
            <div className="text-white font-extrabold text-[12px] font-orbitron leading-tight">
              LJ939
            </div>
            <div className="text-[#fbbf24] text-[9px] font-mono-tech font-bold">
              4G SOC
            </div>
            <div className="absolute -bottom-1.5 inset-x-2 flex justify-between">
              {[1, 2, 3, 4].map((p) => (
                <span key={p} className="w-1 h-1.5 bg-[#fbbf24] rounded-xs" />
              ))}
            </div>
          </div>

          {/* Details text */}
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h4 className="text-sm sm:text-base font-bold text-[#22d3ee] truncate">
                Part #{activePart.num}: {activePart.name} ({activePart.nameHi})
              </h4>
              <button
                onClick={handleCopySpecs}
                className="text-[10px] text-[#94a3b8] hover:text-[#22d3ee] flex items-center gap-1 cursor-pointer"
              >
                {copied ? <Check className="w-3 h-3 text-[#22e07a]" /> : <Share2 className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'कॉपी'}</span>
              </button>
            </div>
            <p className="text-xs sm:text-[13px] text-[#cbd5e1] leading-snug line-clamp-2 mt-0.5">
              {activePart.descHi}
            </p>
          </div>
        </div>

        {/* Right: SMARTER • FASTER • STRONGER YASHU PUDO with Crown */}
        <div className="md:col-span-3 flex flex-col items-center justify-center text-center bg-[#07111c] border border-[#143248] rounded-2xl p-3">
          <div className="text-[10px] text-[#94a3b8] font-bold tracking-widest uppercase">
            SMARTER • FASTER • STRONGER
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-lg font-black italic tracking-wider text-white">
              YASHU <span className="text-[#ff9a1f] not-italic">PUDO</span>
            </span>
            <Crown className="w-4 h-4 text-[#fbbf24] drop-shadow-[0_0_8px_#fbbf24]" />
          </div>
        </div>
      </footer>

      {/* High-Resolution Photo Studio Modal */}
      <PhotoStudioModal
        isOpen={isPhotoStudioOpen}
        onClose={() => setIsPhotoStudioOpen(false)}
        activePart={activePart}
        language="hi"
      />
    </div>
  );
}
