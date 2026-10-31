import React from 'react';
import { SmartwatchPart } from '../types.ts';
import { CATEGORIES } from '../data/partsData.ts';
import { playSound } from '../utils/audio.ts';
import {
  Cpu,
  Layers,
  Zap,
  Activity,
  ChevronLeft,
  ChevronRight,
  Camera,
  Share2,
  Check,
} from 'lucide-react';

interface PartInspectorProps {
  part: SmartwatchPart;
  onSelectPart: (num: number) => void;
  language: 'hi' | 'en';
  onOpenPhotoStudio: () => void;
}

export const PartInspector: React.FC<PartInspectorProps> = ({
  part,
  onSelectPart,
  language,
  onOpenPhotoStudio,
}) => {
  const [copied, setCopied] = React.useState(false);
  const category = CATEGORIES.find((c) => c.id === part.group);

  const handlePrev = () => {
    playSound.click();
    const prev = part.num > 1 ? part.num - 1 : 45;
    onSelectPart(prev);
  };

  const handleNext = () => {
    playSound.click();
    const next = part.num < 45 ? part.num + 1 : 1;
    onSelectPart(next);
  };

  const handleCopySpecs = () => {
    playSound.click();
    const text = `YASHU PUDO 4G - Part #${part.num}: ${part.name} (${part.role}) | Specs: ${part.specs || 'N/A'}`;
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-[780px] bg-gradient-to-b from-[#09121d] to-[#04080e] border border-[#00f0ff]/50 rounded-2xl p-5 shadow-[0_0_25px_rgba(0,240,255,0.15)] relative overflow-hidden">
      {/* Background Accent Glow */}
      <div
        className="absolute -top-20 -right-20 w-44 h-44 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ backgroundColor: category?.color || '#00f0ff' }}
      />

      {/* Top Header: Part #, Navigation, and Category */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1a2b3c]">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-xl flex items-center justify-center font-orbitron text-lg font-black text-black shadow-md"
            style={{ backgroundColor: category?.color || '#00f0ff' }}
          >
            #{part.num}
          </div>
          <div>
            <h2 className="font-orbitron text-lg sm:text-xl font-black text-white tracking-wide flex items-center gap-2">
              <span>{language === 'hi' ? part.nameHi : part.name}</span>
            </h2>
            <div className="flex items-center gap-2 mt-0.5">
              <span
                className="text-[10px] font-mono-tech px-2 py-0.5 rounded-sm font-bold uppercase tracking-wider"
                style={{
                  backgroundColor: `${category?.color}22`,
                  color: category?.color,
                  border: `1px solid ${category?.color}66`,
                }}
              >
                {language === 'hi' ? category?.titleHi : category?.titleEn}
              </span>
              <span className="text-[11px] font-mono-tech text-[#94a3b8]">
                {language === 'hi' ? part.roleHi : part.role}
              </span>
            </div>
          </div>
        </div>

        {/* Prev / Next Buttons */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            onClick={handlePrev}
            className="p-2 rounded-lg bg-[#0b1624] border border-[#1e3044] text-[#cbd5e1] hover:text-[#00f0ff] hover:border-[#00f0ff] transition-colors"
            title="Previous Component (पिछला पार्ट)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="font-mono-tech text-xs text-[#64748b] px-1">
            {part.num} / 45
          </span>
          <button
            onClick={handleNext}
            className="p-2 rounded-lg bg-[#0b1624] border border-[#1e3044] text-[#cbd5e1] hover:text-[#00f0ff] hover:border-[#00f0ff] transition-colors"
            title="Next Component (अगला पार्ट)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Description Content */}
      <div className="my-4">
        <p className="font-rajdhani text-[15px] sm:text-[16px] text-[#e2e8f0] leading-relaxed">
          {language === 'hi' ? part.descHi : part.desc}
        </p>
      </div>

      {/* Specifications & Pinouts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2 pb-4 text-xs font-mono-tech">
        {part.specs && (
          <div className="bg-[#050b12] border border-[#162536] rounded-xl p-2.5 flex items-start gap-2.5">
            <Cpu className="w-4 h-4 text-[#10b981] mt-0.5 shrink-0" />
            <div>
              <div className="text-[10px] text-[#64748b] uppercase tracking-wider">
                {language === 'hi' ? 'हार्डवेयर स्पेसिफिकेशन' : 'Hardware Specs'}
              </div>
              <div className="text-[#cbd5e1] font-semibold mt-0.5 break-words">
                {part.specs}
              </div>
            </div>
          </div>
        )}

        {part.voltageOrPin && (
          <div className="bg-[#050b12] border border-[#162536] rounded-xl p-2.5 flex items-start gap-2.5">
            <Zap className="w-4 h-4 text-[#f59e0b] mt-0.5 shrink-0" />
            <div>
              <div className="text-[10px] text-[#64748b] uppercase tracking-wider">
                {language === 'hi' ? 'वोल्टेज / पिन सिग्नल' : 'Voltage / Signal Rail'}
              </div>
              <div className="text-[#cbd5e1] font-semibold mt-0.5 break-words">
                {part.voltageOrPin}
              </div>
            </div>
          </div>
        )}

        <div className="bg-[#050b12] border border-[#162536] rounded-xl p-2.5 flex items-start gap-2.5">
          <Layers className="w-4 h-4 text-[#00f0ff] mt-0.5 shrink-0" />
          <div>
            <div className="text-[10px] text-[#64748b] uppercase tracking-wider">
              {language === 'hi' ? '3D लेयर असेंबली' : '3D Layer Level'}
            </div>
            <div className="text-[#cbd5e1] font-semibold mt-0.5">
              {part.layerIndex === 4 && (language === 'hi' ? 'लेयर 1: AMOLED स्क्रीन' : 'Layer 1: Display Glass')}
              {part.layerIndex === 3 && (language === 'hi' ? 'लेयर 2: 180° कैमरा मॉड्यूल' : 'Layer 2: 180° Camera')}
              {part.layerIndex === 2 && (language === 'hi' ? 'लेयर 3: मदरबोर्ड पीसीबी' : 'Layer 3: Motherboard PCB')}
              {part.layerIndex === 1 && (language === 'hi' ? 'लेयर 4: बैटरी और वाइब्रेटर' : 'Layer 4: Battery & Motor')}
              {part.layerIndex === 0 && (language === 'hi' ? 'लेयर 5: चेसिस और सेंसर' : 'Layer 5: Titanium Chassis')}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons: Download Photo of this part / Copy Specs */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#1a2b3c]">
        <div className="flex items-center gap-2 text-xs font-mono-tech text-[#94a3b8]">
          <Activity className="w-3.5 h-3.5 text-[#10b981]" />
          <span>Status: Verified Component (पार्ट सत्यापित)</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopySpecs}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0d1825] border border-[#1e3044] text-xs font-rajdhani font-semibold text-[#cbd5e1] hover:text-white transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : language === 'hi' ? 'स्पेक्स कॉपी करें' : 'Copy Specs'}</span>
          </button>

          <button
            onClick={() => {
              playSound.click();
              onOpenPhotoStudio();
            }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#ff5500] to-[#ff2a00] text-black font-orbitron font-extrabold text-xs shadow-[0_0_15px_rgba(255,85,0,0.4)] hover:brightness-110 active:scale-95 transition-all"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? '📸 इसकी फोटो बनाएं' : '📸 Render Photo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
