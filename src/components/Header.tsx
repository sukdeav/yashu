import React, { useState } from 'react';
import { Camera, Volume2, VolumeX, Globe } from 'lucide-react';
import { playSound } from '../utils/audio.ts';

interface HeaderProps {
  language: 'hi' | 'en';
  onToggleLanguage: () => void;
  onOpenPhotoStudio: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  language,
  onToggleLanguage,
  onOpenPhotoStudio,
}) => {
  const [soundEnabled, setSoundEnabled] = useState(true);

  const toggleSound = () => {
    if (!soundEnabled) {
      playSound.click();
    }
    setSoundEnabled(!soundEnabled);
  };

  return (
    <header className="w-full max-w-[780px] flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1b2738]">
      {/* Brand & Badge */}
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <span className="font-orbitron text-xl sm:text-2xl font-black tracking-wider text-white">
            YASHU<span className="text-[#ff5500]">PUDO</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#00f0ff]/10 border border-[#00f0ff]/40 text-[#00f0ff] font-mono-tech text-[10px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-ping" />
          <span>45 HARDWARE PARTS v2.0</span>
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2">
        {/* Language Switcher */}
        <button
          onClick={() => {
            playSound.click();
            onToggleLanguage();
          }}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#0c1624] border border-[#1d2d42] text-xs font-rajdhani font-bold text-[#cbd5e1] hover:text-white hover:border-[#00f0ff] transition-colors"
          title="Change Language (भाषा बदलें)"
        >
          <Globe className="w-3.5 h-3.5 text-[#00f0ff]" />
          <span>{language === 'hi' ? 'EN' : 'हिंदी'}</span>
        </button>

        {/* Audio Mute/Unmute */}
        <button
          onClick={toggleSound}
          className="p-1.5 rounded-lg bg-[#0c1624] border border-[#1d2d42] text-[#94a3b8] hover:text-[#00f0ff] transition-colors"
          title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
        >
          {soundEnabled ? (
            <Volume2 className="w-4 h-4 text-[#10b981]" />
          ) : (
            <VolumeX className="w-4 h-4 text-[#64748b]" />
          )}
        </button>

        {/* Main "Photo Banao" Button */}
        <button
          onClick={() => {
            playSound.click();
            onOpenPhotoStudio();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#ff5500] to-[#ff2a00] text-black font-orbitron font-extrabold text-xs shadow-[0_0_15px_rgba(255,85,0,0.5)] hover:brightness-110 active:scale-95 transition-all"
        >
          <Camera className="w-3.5 h-3.5" />
          <span>{language === 'hi' ? '📸 फोटो बनाएं' : '📸 Render Photo'}</span>
        </button>
      </div>
    </header>
  );
};
