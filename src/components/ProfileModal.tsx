import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { BADGES, getRankByStars } from '../data/gamesData';
import { playClickSound, playSuccessSound } from '../services/soundEffects';
import { X, Check, Award, Star, User, RotateCcw } from 'lucide-react';

interface ProfileModalProps {
  onClose: () => void;
}

const AVATARS = ['🦉', '🦁', '🐰', '🚀', '👧', '👦', '🦄', '🐼', '🦊', '🐯'];

export const ProfileModal: React.FC<ProfileModalProps> = ({ onClose }) => {
  const { user, updateProfile, resetProgress } = useUser();
  const [name, setName] = useState(user.name);
  const [selectedAvatar, setSelectedAvatar] = useState(user.avatar);
  const [isSaved, setIsSaved] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const rank = getRankByStars(user.stars);
  const progressPercent = Math.min(100, Math.round((user.stars / rank.nextLevel) * 100));

  const handleSave = () => {
    playSuccessSound();
    updateProfile(name, selectedAvatar);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 600);
  };

  const handleReset = () => {
    resetProgress();
    setShowConfirmReset(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-indigo-50">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center text-2xl shadow-xs">
              {selectedAvatar}
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-slate-900">
                O'quvchi Profili
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {rank.title} {rank.emoji}
              </p>
            </div>
          </div>

          <button
            onClick={() => { playClickSound(); onClose(); }}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center active:scale-90 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Level & Stars card */}
          <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs uppercase font-extrabold tracking-wider text-amber-200">
                  Umumiy to'plangan yulduzlar
                </span>
                <div className="font-display font-black text-3xl sm:text-4xl flex items-center gap-2 mt-0.5">
                  <span>⭐ {user.stars}</span>
                </div>
              </div>
              <span className="text-4xl sm:text-5xl">{rank.emoji}</span>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-amber-100">
                <span>Daraja: {rank.title}</span>
                <span>Keyingi bosqich: {rank.nextLevel} ⭐</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-white h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          {/* Edit Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Ismingiz:
            </label>
            <div className="relative">
              <input
                type="text"
                value={name}
                maxLength={20}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ismingizni yozing..."
                className="w-full px-4 py-2.5 sm:py-3 rounded-2xl border-2 border-slate-200 focus:border-indigo-500 focus:outline-hidden text-sm sm:text-base font-bold text-slate-800 transition-colors"
              />
              <User className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Choose Avatar */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Sevimli qahramoningizni tanlang:
            </label>
            <div className="grid grid-cols-5 gap-2">
              {AVATARS.map((av) => (
                <button
                  key={av}
                  onClick={() => {
                    playClickSound();
                    setSelectedAvatar(av);
                  }}
                  className={`aspect-square rounded-2xl text-2xl sm:text-3xl flex items-center justify-center border-2 transition-all active:scale-90 cursor-pointer ${
                    selectedAvatar === av
                      ? 'bg-indigo-50 border-indigo-600 ring-2 ring-indigo-200 scale-105 shadow-xs'
                      : 'bg-slate-50 border-slate-200 hover:border-slate-300'
                  }`}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>

          {/* Stats summary */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
              <span className="text-xs text-slate-500 font-semibold block">Darslar</span>
              <span className="font-display font-bold text-lg text-slate-900 tabular-nums">
                {user.completedLessons.length}
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
              <span className="text-xs text-slate-500 font-semibold block">Testlar</span>
              <span className="font-display font-bold text-lg text-slate-900 tabular-nums">
                {user.completedQuizzes.length}
              </span>
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3">
              <span className="text-xs text-slate-500 font-semibold block">O'yinlar</span>
              <span className="font-display font-bold text-lg text-slate-900 tabular-nums">
                {user.gamesPlayed}
              </span>
            </div>
          </div>

          {/* Reset progress */}
          <div className="pt-2 border-t border-slate-100">
            {!showConfirmReset ? (
              <button
                onClick={() => setShowConfirmReset(true)}
                className="text-xs text-slate-400 hover:text-rose-600 font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Natijalarni qaytadan boshlash</span>
              </button>
            ) : (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3 text-xs text-rose-900 space-y-2">
                <p className="font-bold">Haqiqatan ham barcha to'plangan yulduzlarni o'chirmoqchimisiz?</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleReset}
                    className="px-3 py-1.5 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 cursor-pointer"
                  >
                    Ha, tozalash
                  </button>
                  <button
                    onClick={() => setShowConfirmReset(false)}
                    className="px-3 py-1.5 bg-white border border-rose-300 text-rose-800 rounded-xl font-semibold cursor-pointer"
                  >
                    Bekor qilish
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
          <button
            onClick={() => { playClickSound(); onClose(); }}
            className="px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
          >
            Yopish
          </button>

          <button
            onClick={handleSave}
            className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-200 flex items-center gap-1.5 cursor-pointer"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saqlandi!</span>
              </>
            ) : (
              <span>Saqlash</span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
