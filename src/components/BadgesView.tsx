import React from 'react';
import { useUser } from '../context/UserContext';
import { BADGES, getRankByStars } from '../data/gamesData';
import { Trophy, CheckCircle2, Lock, Star, Sparkles } from 'lucide-react';

export const BadgesView: React.FC = () => {
  const { user } = useUser();
  const rank = getRankByStars(user.stars);

  return (
    <div className="space-y-6">
      {/* Hero Achievement Card */}
      <div className="bg-gradient-to-br from-amber-400 via-orange-400 to-yellow-500 rounded-3xl p-5 sm:p-6 text-white shadow-md shadow-orange-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4 text-center sm:text-left">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-4xl sm:text-5xl shrink-0">
            {rank.emoji}
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-100">
              Sizning unvoningiz
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl">
              {rank.title}
            </h2>
            <p className="text-xs sm:text-sm text-amber-50 mt-1 max-w-md">
              Har bir o'qilgan dars va o'ynalgan o'yin uchun yulduzlar to'plab, eng yuqori <strong>Super Olim</strong> darajasiga erishing!
            </p>
          </div>
        </div>

        <div className="bg-white/20 backdrop-blur-xs px-5 py-3 rounded-2xl text-center shrink-0">
          <span className="text-xs uppercase font-extrabold text-amber-100 block">Jami Yulduzlar</span>
          <span className="font-display font-black text-3xl tabular-nums">⭐ {user.stars}</span>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg sm:text-xl text-slate-800 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>Yutuqlar va Medallar</span>
          </h3>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
            {user.unlockedBadges.length} / {BADGES.length} ochilgan
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
          {BADGES.map((badge) => {
            const isUnlocked = user.stars >= badge.requiredStars || user.unlockedBadges.includes(badge.id);
            const remaining = Math.max(0, badge.requiredStars - user.stars);

            return (
              <div
                key={badge.id}
                className={`p-4 rounded-3xl border-2 transition-all flex items-start gap-3.5 ${
                  isUnlocked
                    ? 'bg-gradient-to-br from-amber-50/70 to-yellow-50/70 border-amber-300 shadow-xs'
                    : 'bg-slate-50 border-slate-200/80 opacity-60'
                }`}
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-2xs ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-amber-400 to-yellow-500 text-white'
                      : 'bg-slate-200 text-slate-400'
                  }`}
                >
                  {badge.emoji}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 leading-tight">
                      {badge.title}
                    </h4>
                    {isUnlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {badge.description}
                  </p>

                  <div className="pt-1">
                    {isUnlocked ? (
                      <span className="text-[11px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full inline-block">
                        Ochilgan ✓
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-500">
                        Yana <strong>{remaining}</strong> ⭐ kerak
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
