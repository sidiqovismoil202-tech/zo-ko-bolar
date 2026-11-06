import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { getRankByStars } from '../data/gamesData';
import { isSoundOn, toggleSound, playClickSound } from '../services/soundEffects';
import { Volume2, VolumeX, Sparkles, Trophy, BookOpen, Gamepad2, Award } from 'lucide-react';

interface HeaderProps {
  activeTab: 'lessons' | 'games' | 'badges';
  setActiveTab: (tab: 'lessons' | 'games' | 'badges') => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenProfile }) => {
  const { user } = useUser();
  const [sound, setSound] = useState(isSoundOn());
  const rank = getRankByStars(user.stars);

  const handleSoundToggle = () => {
    const updated = toggleSound();
    setSound(updated);
    if (updated) playClickSound();
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-100 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 py-2.5 sm:py-3 flex items-center justify-between gap-3">
        {/* Brand */}
        <div 
          onClick={() => { playClickSound(); setActiveTab('lessons'); }}
          className="flex items-center gap-2 cursor-pointer select-none group"
        >
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white text-xl sm:text-2xl shadow-sm group-hover:scale-105 transition-transform">
            🌟
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-display font-bold text-lg sm:text-xl text-slate-800 tracking-tight">
                Zukko Bolalar
              </span>
              <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full border border-amber-200 hidden sm:inline-block">
                {user.grade}-sinf
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Quvnoq bilim va o'yinlar olami
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-xl">
          <button
            onClick={() => { playClickSound(); setActiveTab('lessons'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'lessons'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Darslar</span>
          </button>

          <button
            onClick={() => { playClickSound(); setActiveTab('games'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'games'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>O'yinlar</span>
          </button>

          <button
            onClick={() => { playClickSound(); setActiveTab('badges'); }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all whitespace-nowrap ${
              activeTab === 'badges'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span className="hidden xs:inline">Yutuqlar</span>
          </button>
        </nav>

        {/* Right Action: Stars & Profile */}
        <div className="flex items-center gap-2">
          {/* Sound Toggle */}
          <button
            onClick={handleSoundToggle}
            aria-label="Ovoz sozlamasi"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center text-slate-600 hover:bg-slate-100 active:scale-95 transition-colors"
          >
            {sound ? <Volume2 className="w-4 h-4 text-emerald-600" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          {/* Stars Pill */}
          <div 
            onClick={onOpenProfile}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-300 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl cursor-pointer hover:border-amber-400 active:scale-95 transition-all shadow-xs"
            title={`${user.stars} yulduzcha to'plangan. Daraja: ${rank.title}`}
          >
            <span className="text-amber-500 text-base sm:text-lg animate-pulse">⭐</span>
            <span className="font-bold text-slate-800 text-xs sm:text-sm tabular-nums">
              {user.stars}
            </span>
          </div>

          {/* Student Profile Avatar */}
          <button
            onClick={() => { playClickSound(); onOpenProfile(); }}
            className="flex items-center gap-1.5 pl-1.5 pr-2 py-1 rounded-xl bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-all text-xs font-semibold text-indigo-900 active:scale-95"
            title="Profil va yutuqlar"
          >
            <span className="text-lg leading-none">{user.avatar}</span>
            <span className="max-w-[70px] truncate hidden md:inline-block">{user.name}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
