import React, { useState, useEffect, useRef } from 'react';
import { PhotoLayout, PhotoResolution, SmartwatchPart } from '../types.ts';
import { generateTeardownPhoto } from '../utils/canvasRenderer.ts';
import { playSound } from '../utils/audio.ts';
import {
  Download,
  Copy,
  Check,
  X,
  Layers,
  Sparkles,
  Camera,
  Maximize2,
  FileImage,
} from 'lucide-react';

interface PhotoStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePart: SmartwatchPart;
  language: 'hi' | 'en';
}

export const PhotoStudioModal: React.FC<PhotoStudioModalProps> = ({
  isOpen,
  onClose,
  activePart,
  language,
}) => {
  const [layout, setLayout] = useState<PhotoLayout>('exploded');
  const [resolution, setResolution] = useState<PhotoResolution>('1080p');
  const [photoLang, setPhotoLang] = useState<'hi' | 'en'>(language);
  const [showCallouts, setShowCallouts] = useState(true);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const previewCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Generate / re-render canvas photo whenever options change
  useEffect(() => {
    if (!isOpen) return;

    setIsGenerating(true);
    const timer = setTimeout(() => {
      try {
        const canvas = generateTeardownPhoto({
          layout,
          resolution,
          language: photoLang,
          showCallouts,
          activePartNum: activePart.num,
        });
        previewCanvasRef.current = canvas;
        setPreviewUrl(canvas.toDataURL('image/png'));
      } catch (err) {
        console.error('Photo generation failed:', err);
      } finally {
        setIsGenerating(false);
      }
    }, 60);

    return () => clearTimeout(timer);
  }, [isOpen, layout, resolution, photoLang, showCallouts, activePart.num]);

  if (!isOpen) return null;

  const handleDownload = () => {
    playSound.shutter();
    if (!previewCanvasRef.current) return;

    previewCanvasRef.current.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `YASHU-PUDO-4G-Teardown-Architecture-${layout}-${resolution}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    }, 'image/png');
  };

  const handleCopyClipboard = async () => {
    playSound.shutter();
    if (!previewCanvasRef.current) return;

    try {
      previewCanvasRef.current.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([
          new ClipboardItem({ 'image/png': blob }),
        ]);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }, 'image/png');
    } catch (err) {
      console.warn('Clipboard copy not supported directly, falling back:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#070e17] border border-[#00f0ff]/50 rounded-2xl shadow-[0_0_50px_rgba(0,240,255,0.25)] flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-[#1b2b3d] flex items-center justify-between bg-[#0b1624]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#ff5500] text-black flex items-center justify-center font-orbitron font-black shadow-md">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-orbitron text-base sm:text-lg font-black text-white flex items-center gap-2">
                <span>{language === 'hi' ? '4G स्मार्टवॉच टीयरडाउन फोटो स्टूडियो' : '4G Smartwatch Teardown Photo Studio'}</span>
                <span className="text-[10px] font-mono-tech px-2 py-0.5 rounded bg-[#00f0ff]/20 text-[#00f0ff] border border-[#00f0ff]/40">
                  UHD RENDER
                </span>
              </h3>
              <p className="font-mono-tech text-xs text-[#94a3b8]">
                {language === 'hi'
                  ? 'हाई-रेज़ोल्यूशन आर्किटेक्चर फोटो एक्सपोर्ट और डाउनलोड करें'
                  : 'High-Resolution architectural teardown photo export & download'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playSound.click();
              onClose();
            }}
            className="w-9 h-9 rounded-lg bg-[#142335] text-[#94a3b8] hover:text-white hover:bg-[#1f3550] flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body: Settings on left/top, High-res Photo Preview on right */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Controls Column */}
          <div className="lg:col-span-4 space-y-4">
            {/* Layout Style */}
            <div className="bg-[#0b1420] border border-[#1a293b] rounded-xl p-3.5 space-y-2">
              <label className="text-xs font-orbitron font-bold text-[#ff5500] uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'फोटो लेआउट' : 'Photo Layout'}</span>
              </label>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    playSound.click();
                    setLayout('exploded');
                  }}
                  className={`p-2.5 rounded-lg text-left text-xs font-rajdhani font-bold border transition-all ${
                    layout === 'exploded'
                      ? 'bg-[#16273c] border-[#00f0ff] text-[#00f0ff] shadow-sm'
                      : 'bg-[#060b12] border-[#182739] text-[#94a3b8] hover:text-white'
                  }`}
                >
                  <div className="text-white font-semibold">
                    {language === 'hi' ? '💥 एक्सप्लोडेड व्यू' : '💥 Exploded 3D'}
                  </div>
                  <div className="text-[10px] text-[#64748b] font-mono-tech mt-0.5">
                    16:9 Landscape
                  </div>
                </button>

                <button
                  onClick={() => {
                    playSound.click();
                    setLayout('poster');
                  }}
                  className={`p-2.5 rounded-lg text-left text-xs font-rajdhani font-bold border transition-all ${
                    layout === 'poster'
                      ? 'bg-[#16273c] border-[#00f0ff] text-[#00f0ff] shadow-sm'
                      : 'bg-[#060b12] border-[#182739] text-[#94a3b8] hover:text-white'
                  }`}
                >
                  <div className="text-white font-semibold">
                    {language === 'hi' ? '📜 वर्टिकल पोस्टर' : '📜 Teardown Poster'}
                  </div>
                  <div className="text-[10px] text-[#64748b] font-mono-tech mt-0.5">
                    3:4 Portrait
                  </div>
                </button>
              </div>
            </div>

            {/* Resolution Selector */}
            <div className="bg-[#0b1420] border border-[#1a293b] rounded-xl p-3.5 space-y-2">
              <label className="text-xs font-orbitron font-bold text-[#10b981] uppercase tracking-wider flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'फोटो क्वालिटी / रेज़ोल्यूशन' : 'Photo Resolution'}</span>
              </label>

              <div className="grid grid-cols-3 gap-2 font-mono-tech text-xs">
                {(['1080p', '2k', '4k'] as PhotoResolution[]).map((res) => (
                  <button
                    key={res}
                    onClick={() => {
                      playSound.click();
                      setResolution(res);
                    }}
                    className={`py-2 px-1 rounded-lg text-center font-bold border transition-all ${
                      resolution === res
                        ? 'bg-[#10b981] text-black border-[#10b981] shadow-sm'
                        : 'bg-[#060b12] border-[#182739] text-[#cbd5e1] hover:text-white'
                    }`}
                  >
                    {res.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Language & Callouts Toggle */}
            <div className="bg-[#0b1420] border border-[#1a293b] rounded-xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-rajdhani font-semibold text-[#cbd5e1]">
                  {language === 'hi' ? 'फोटो की भाषा (Text Language)' : 'Text Language'}
                </span>
                <div className="flex gap-1 bg-[#060b12] p-1 rounded-lg border border-[#182739]">
                  <button
                    onClick={() => setPhotoLang('hi')}
                    className={`px-2.5 py-0.5 rounded text-xs font-bold font-rajdhani ${
                      photoLang === 'hi'
                        ? 'bg-[#ff5500] text-black'
                        : 'text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    हिंदी
                  </button>
                  <button
                    onClick={() => setPhotoLang('en')}
                    className={`px-2.5 py-0.5 rounded text-xs font-bold font-rajdhani ${
                      photoLang === 'en'
                        ? 'bg-[#ff5500] text-black'
                        : 'text-[#94a3b8] hover:text-white'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#182739]">
                <span className="text-xs font-rajdhani font-semibold text-[#cbd5e1]">
                  {language === 'hi' ? 'हार्डवेयर लेबल व तीर (Callout Lines)' : 'Hardware Callouts'}
                </span>
                <button
                  onClick={() => setShowCallouts((p) => !p)}
                  className={`w-11 h-6 rounded-full transition-colors relative flex items-center px-0.5 ${
                    showCallouts ? 'bg-[#00f0ff]' : 'bg-[#1e2e42]'
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-full bg-black shadow-md transition-transform ${
                      showCallouts ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Quick Export Actions */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleDownload}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff5500] via-[#ff4400] to-[#ff2a00] text-black font-orbitron font-black text-sm shadow-[0_0_25px_rgba(255,85,0,0.5)] flex items-center justify-center gap-2 hover:brightness-110 active:scale-[0.98] transition-all"
              >
                {downloadSuccess ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>{language === 'hi' ? 'फोटो डाउनलोड हो गई!' : 'Photo Downloaded!'}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>
                      {language === 'hi'
                        ? `फोटो डाउनलोड करें (${resolution.toUpperCase()})`
                        : `Download Photo (${resolution.toUpperCase()})`}
                    </span>
                  </>
                )}
              </button>

              <button
                onClick={handleCopyClipboard}
                className="w-full py-2.5 px-4 rounded-xl bg-[#0f1d2d] border border-[#1f3752] text-[#00f0ff] font-rajdhani font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#162a40] transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-[#10b981]" />
                    <span>{language === 'hi' ? 'क्लिपबोर्ड में कॉपी हो गई!' : 'Copied to Clipboard!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>
                      {language === 'hi'
                        ? 'फोटो कॉपी करें (WhatsApp/शेयर करने के लिए)'
                        : 'Copy Photo (Share directly)'}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Photo Render Preview Column */}
          <div className="lg:col-span-8 flex flex-col items-center justify-center bg-[#03060a] border border-[#162536] rounded-xl p-3 min-h-[380px] relative overflow-hidden group">
            {isGenerating ? (
              <div className="flex flex-col items-center gap-3 text-center">
                <div className="w-10 h-10 border-3 border-[#00f0ff] border-t-transparent rounded-full animate-spin" />
                <span className="font-mono-tech text-xs text-[#00f0ff]">
                  {language === 'hi' ? 'हाई-रेज़ोल्यूशन फोटो रेंडर हो रही है...' : 'Rendering UHD Teardown Photo...'}
                </span>
              </div>
            ) : previewUrl ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img
                  src={previewUrl}
                  alt="YASHU PUDO 4G Smartwatch Teardown Architecture Photo"
                  referrerPolicy="no-referrer"
                  className="max-h-[520px] w-auto object-contain rounded-lg shadow-2xl border border-[#1b2b3d]"
                />

                {/* Floating Preview Badge */}
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/75 border border-[#00f0ff]/50 text-[#00f0ff] font-mono-tech text-[10px] flex items-center gap-1.5 shadow-lg">
                  <FileImage className="w-3.5 h-3.5" />
                  <span>PNG • {resolution.toUpperCase()}</span>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 border-t border-[#1b2b3d] bg-[#0b1624] flex items-center justify-between text-xs font-mono-tech text-[#64748b]">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#ff5500]" />
            <span>YASHU PUDO LJ939 4G Ultra Smartwatch • 45 Hardware Components</span>
          </span>
          <span className="text-[#94a3b8]">Ready to Save / Print / Share</span>
        </div>
      </div>
    </div>
  );
};
