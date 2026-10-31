import React, { useState, useMemo } from 'react';
import { SmartwatchPart, PartCategory } from '../types.ts';
import { CATEGORIES, PARTS_DATA } from '../data/partsData.ts';
import { playSound } from '../utils/audio.ts';
import { Search, SlidersHorizontal, CheckCircle2 } from 'lucide-react';

interface PartsGridProps {
  activePartNum: number;
  onSelectPart: (num: number) => void;
  language: 'hi' | 'en';
}

export const PartsGrid: React.FC<PartsGridProps> = ({
  activePartNum,
  onSelectPart,
  language,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<PartCategory | 'all'>('all');

  const filteredParts = useMemo(() => {
    return PARTS_DATA.filter((part) => {
      // Category check
      if (selectedCategory !== 'all' && part.group !== selectedCategory) {
        return false;
      }

      // Search query check
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      const numMatch = part.num.toString() === q || `#${part.num}` === q;
      const nameMatch =
        part.name.toLowerCase().includes(q) ||
        part.nameHi.toLowerCase().includes(q) ||
        part.role.toLowerCase().includes(q) ||
        part.roleHi.toLowerCase().includes(q) ||
        (part.specs && part.specs.toLowerCase().includes(q));

      return numMatch || nameMatch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="w-full max-w-[780px] space-y-4">
      {/* Search and Category Filters Bar */}
      <div className="bg-[#0b121b] border border-[#1b293a] rounded-xl p-3 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-[#64748b] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              language === 'hi'
                ? 'पार्ट खोजें (उदा: CPU, 34, कैमरा, SIM)...'
                : 'Search component (e.g. CPU, 34, Battery)...'
            }
            className="w-full bg-[#05090f] border border-[#1e2f42] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-[#64748b] focus:outline-none focus:border-[#00f0ff] font-mono-tech transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-[#64748b] hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills Slider */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => {
              playSound.click();
              setSelectedCategory('all');
            }}
            className={`px-2.5 py-1 rounded-md text-xs font-rajdhani font-bold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#ff5500] text-black shadow-sm'
                : 'bg-[#0f1926] text-[#94a3b8] hover:text-white border border-[#1e2e42]'
            }`}
          >
            {language === 'hi' ? 'सभी 45 पार्ट्स' : 'All 45 Parts'}
          </button>

          {CATEGORIES.map((cat) => {
            const isCatActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  playSound.click();
                  setSelectedCategory(cat.id);
                }}
                className={`px-2 py-1 rounded-md text-xs font-rajdhani font-semibold whitespace-nowrap flex items-center gap-1 transition-all ${
                  isCatActive
                    ? 'text-black shadow-sm font-bold'
                    : 'bg-[#0f1926] text-[#94a3b8] hover:text-white border border-[#1e2e42]'
                }`}
                style={isCatActive ? { backgroundColor: cat.color } : undefined}
              >
                <span>{language === 'hi' ? cat.titleHi.split(' ')[0] : cat.titleEn.split(' ')[0]}</span>
                <span className="text-[10px] font-mono-tech opacity-75">
                  ({cat.count})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Grid of Part Chips */}
      {selectedCategory === 'all' && !searchQuery ? (
        // Categorized View
        <div className="space-y-4">
          {CATEGORIES.map((cat) => {
            const catParts = PARTS_DATA.filter((p) => p.group === cat.id);
            return (
              <div
                key={cat.id}
                className="bg-[#09111b] border border-[#182638] rounded-2xl overflow-hidden shadow-sm"
              >
                {/* Category Header */}
                <div
                  className="px-4 py-2.5 flex items-center justify-between border-b border-[#182638] bg-[#0d1724]"
                  style={{ borderLeft: `4px solid ${cat.color}` }}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-orbitron text-xs sm:text-sm font-bold tracking-wide text-white">
                      {language === 'hi' ? cat.titleHi : cat.titleEn}
                    </span>
                    <span className="font-mono-tech text-[11px] text-[#94a3b8]">
                      ({cat.range})
                    </span>
                  </div>
                  <span
                    className="font-mono-tech text-[10px] px-2 py-0.5 rounded-full font-bold"
                    style={{
                      backgroundColor: `${cat.color}22`,
                      color: cat.color,
                      border: `1px solid ${cat.color}55`,
                    }}
                  >
                    {catParts.length} {language === 'hi' ? 'पार्ट्स' : 'Units'}
                  </span>
                </div>

                {/* Parts in this Category */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 p-3">
                  {catParts.map((part) => {
                    const isSelected = part.num === activePartNum;
                    return (
                      <div
                        key={part.num}
                        onClick={() => {
                          playSound.selectPart();
                          onSelectPart(part.num);
                        }}
                        className={`group p-2.5 rounded-xl cursor-pointer border transition-all duration-200 flex items-center gap-3 ${
                          isSelected
                            ? 'bg-[#152336] border-[#ff5500] shadow-[0_0_15px_rgba(255,85,0,0.3)] translate-x-0.5'
                            : 'bg-[#060b12] border-[#162334] hover:border-[#00f0ff]/60 hover:bg-[#0c1624]'
                        }`}
                      >
                        <div
                          className={`w-7 h-7 rounded-lg font-orbitron text-xs font-black flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                            isSelected
                              ? 'bg-[#ff5500] text-black shadow-md'
                              : 'bg-[#131f2f] text-[#f59e0b]'
                          }`}
                        >
                          {part.num}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div
                            className={`font-rajdhani text-[13px] font-bold truncate leading-tight transition-colors ${
                              isSelected
                                ? 'text-[#ff5500]'
                                : 'text-[#e2e8f0] group-hover:text-white'
                            }`}
                          >
                            {language === 'hi' ? part.nameHi : part.name}
                          </div>
                          <div className="font-mono-tech text-[10px] text-[#94a3b8] truncate">
                            {language === 'hi' ? part.roleHi : part.role}
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-[#ff5500] shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        // Filtered Flat Grid
        <div className="bg-[#09111b] border border-[#182638] rounded-2xl p-3 shadow-sm">
          <div className="flex items-center justify-between px-1 pb-2 mb-2 border-b border-[#182638]">
            <span className="font-mono-tech text-xs text-[#94a3b8] flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span>
                {language === 'hi'
                  ? `मिले हुए पार्ट्स (${filteredParts.length} / 45)`
                  : `Filtered Components (${filteredParts.length} / 45)`}
              </span>
            </span>
          </div>

          {filteredParts.length === 0 ? (
            <div className="text-center py-10 font-mono-tech text-xs text-[#64748b]">
              {language === 'hi'
                ? 'कोई पार्ट नहीं मिला। कृपया दूसरा नाम या नंबर खोजें।'
                : 'No components found. Try searching another term or ID.'}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {filteredParts.map((part) => {
                const isSelected = part.num === activePartNum;
                const cat = CATEGORIES.find((c) => c.id === part.group);
                return (
                  <div
                    key={part.num}
                    onClick={() => {
                      playSound.selectPart();
                      onSelectPart(part.num);
                    }}
                    className={`group p-2.5 rounded-xl cursor-pointer border transition-all duration-200 flex items-center gap-3 ${
                      isSelected
                        ? 'bg-[#152336] border-[#ff5500] shadow-[0_0_15px_rgba(255,85,0,0.3)]'
                        : 'bg-[#060b12] border-[#162334] hover:border-[#00f0ff]/60 hover:bg-[#0c1624]'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg font-orbitron text-xs font-black flex items-center justify-center shrink-0 ${
                        isSelected
                          ? 'bg-[#ff5500] text-black shadow-md'
                          : 'text-black'
                      }`}
                      style={!isSelected ? { backgroundColor: cat?.color || '#f59e0b' } : undefined}
                    >
                      {part.num}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div
                        className={`font-rajdhani text-[13px] font-bold truncate leading-tight ${
                          isSelected ? 'text-[#ff5500]' : 'text-[#e2e8f0]'
                        }`}
                      >
                        {language === 'hi' ? part.nameHi : part.name}
                      </div>
                      <div className="font-mono-tech text-[10px] text-[#94a3b8] truncate">
                        {language === 'hi' ? part.roleHi : part.role}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
