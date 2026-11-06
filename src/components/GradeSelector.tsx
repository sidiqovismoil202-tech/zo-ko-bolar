import React from 'react';
import { Grade } from '../types';
import { playClickSound } from '../services/soundEffects';

interface GradeSelectorProps {
  currentGrade: Grade;
  onSelectGrade: (grade: Grade) => void;
}

interface GradeMeta {
  grade: Grade;
  label: string;
  sublabel: string;
  badge: string;
  activeBg: string;
  activeBorder: string;
  activeRing: string;
  accentColor: string;
  icon: string;
}

const GRADES: GradeMeta[] = [
  {
    grade: 1,
    label: '1-sinf',
    sublabel: 'Kichkintoy bilimdon',
    badge: 'Sanash & Harflar',
    activeBg: 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md shadow-orange-200',
    activeBorder: 'border-orange-500',
    activeRing: 'ring-orange-300',
    accentColor: 'text-amber-600',
    icon: '🐣',
  },
  {
    grade: 2,
    label: '2-sinf',
    sublabel: 'Qiziquvchan o\'quvchi',
    badge: '100 gacha sonlar & Ertaklar',
    activeBg: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-200',
    activeBorder: 'border-emerald-500',
    activeRing: 'ring-emerald-300',
    accentColor: 'text-emerald-600',
    icon: '🌱',
  },
  {
    grade: 3,
    label: '3-sinf',
    sublabel: 'Mohir izlanuvchi',
    badge: 'Ko\'paytirish & So\'zlar',
    activeBg: 'bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-200',
    activeBorder: 'border-blue-500',
    activeRing: 'ring-blue-300',
    accentColor: 'text-blue-600',
    icon: '🚀',
  },
  {
    grade: 4,
    label: '4-sinf',
    sublabel: 'Zukko mutafakkir',
    badge: 'Yuzalar & Buyuk tariximiz',
    activeBg: 'bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-md shadow-purple-200',
    activeBorder: 'border-purple-500',
    activeRing: 'ring-purple-300',
    accentColor: 'text-purple-600',
    icon: '💡',
  },
  {
    grade: 5,
    label: '5-sinf',
    sublabel: 'Katta chempion',
    badge: 'Kasrlar & Koinot sirlari',
    activeBg: 'bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-md shadow-rose-200',
    activeBorder: 'border-rose-500',
    activeRing: 'ring-rose-300',
    accentColor: 'text-rose-600',
    icon: '👑',
  },
];

export const GradeSelector: React.FC<GradeSelectorProps> = ({ currentGrade, onSelectGrade }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2.5">
        <h2 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2">
          <span>🎒 Sinfni tanlang:</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
            Hozir: {currentGrade}-sinf
          </span>
        </h2>
        <span className="text-xs text-slate-500 hidden sm:inline">
          Darslar va o'yinlar sinfga moslashadi
        </span>
      </div>

      {/* Big accessible grade buttons, responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 sm:gap-3">
        {GRADES.map((item) => {
          const isActive = currentGrade === item.grade;
          return (
            <button
              key={item.grade}
              onClick={() => {
                playClickSound();
                onSelectGrade(item.grade);
              }}
              className={`relative text-left p-3 sm:p-3.5 rounded-2xl border-2 transition-all duration-200 active:scale-95 cursor-pointer flex flex-col justify-between ${
                isActive
                  ? `${item.activeBg} ${item.activeBorder} ring-2 ${item.activeRing} scale-[1.02]`
                  : 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 shadow-2xs hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-2xl sm:text-3xl ${isActive ? 'scale-110' : ''} transition-transform`}>
                  {item.icon}
                </span>
                <span
                  className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full ${
                    isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.grade}
                </span>
              </div>

              <div>
                <div className={`font-display text-base sm:text-lg font-bold leading-tight ${isActive ? 'text-white' : 'text-slate-900'}`}>
                  {item.label}
                </div>
                <div className={`text-[11px] font-medium leading-tight line-clamp-1 mt-0.5 ${isActive ? 'text-white/90' : 'text-slate-500'}`}>
                  {item.badge}
                </div>
              </div>

              {isActive && (
                <div className="absolute -top-1.5 -right-1.5 bg-yellow-400 text-slate-900 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shadow-xs">
                  ✓
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
