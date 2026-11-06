import React, { useState, useEffect } from 'react';
import { Grade } from '../../types';
import { useUser } from '../../context/UserContext';
import { MATCH_PAIRS_BY_GRADE } from '../../data/gamesData';
import { playClickSound, playSuccessSound, playErrorSound, playFanfareSound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';
import { RotateCcw, CheckCircle2 } from 'lucide-react';

interface MatchPairsGameProps {
  grade: Grade;
  onBack: () => void;
}

export const MatchPairsGame: React.FC<MatchPairsGameProps> = ({ grade, onBack }) => {
  const { addStars, incrementGamesCount } = useUser();
  const rawPairs = MATCH_PAIRS_BY_GRADE[grade];

  const [leftItems, setLeftItems] = useState<{ id: string; text: string; matched: boolean }[]>([]);
  const [rightItems, setRightItems] = useState<{ id: string; text: string; matched: boolean }[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [isWon, setIsWon] = useState(false);

  const initGame = () => {
    const left = rawPairs.map((p, idx) => ({
      id: `pair_${idx}`,
      text: p.left,
      matched: false,
    })).sort(() => Math.random() - 0.5);

    const right = rawPairs.map((p, idx) => ({
      id: `pair_${idx}`,
      text: p.right,
      matched: false,
    })).sort(() => Math.random() - 0.5);

    setLeftItems(left);
    setRightItems(right);
    setSelectedLeft(null);
    setSelectedRight(null);
    setIsWon(false);
  };

  useEffect(() => {
    initGame();
  }, [grade]);

  // When both left and right are selected, evaluate match
  const checkMatch = (leftId: string, rightId: string) => {
    if (leftId === rightId) {
      // Correct match!
      playSuccessSound();
      setLeftItems((prev) =>
        prev.map((item) => (item.id === leftId ? { ...item, matched: true } : item))
      );
      setRightItems((prev) =>
        prev.map((item) => (item.id === rightId ? { ...item, matched: true } : item))
      );

      setSelectedLeft(null);
      setSelectedRight(null);

      // Check if all matched
      setTimeout(() => {
        setLeftItems((currentLeft) => {
          const allDone = currentLeft.every((i) => i.matched);
          if (allDone) {
            setIsWon(true);
            incrementGamesCount();
            addStars(20, 'Barcha juftliklarni to\'g\'ri moslashtirdingiz! +20 ⭐');
            playFanfareSound();
            try {
              confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.5 },
              });
            } catch {
              // ignore
            }
          }
          return currentLeft;
        });
      }, 200);
    } else {
      // Incorrect match
      playErrorSound();
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 600);
    }
  };

  const handleLeftClick = (id: string) => {
    playClickSound();
    setSelectedLeft(id);
    if (selectedRight) {
      checkMatch(id, selectedRight);
    }
  };

  const handleRightClick = (id: string) => {
    playClickSound();
    setSelectedRight(id);
    if (selectedLeft) {
      checkMatch(selectedLeft, id);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm max-w-xl mx-auto space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { playClickSound(); onBack(); }}
          className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          ← O'yinlarga qaytish
        </button>

        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
          {grade}-sinf moslashtirish
        </span>
      </div>

      <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-3.5 text-center text-xs sm:text-sm text-emerald-950">
        💡 <strong>Qoida:</strong> Chap ustundan bitta elementni, keyin o'ng ustundan unga mos keladiganini tanlang!
      </div>

      {/* Two columns */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 pt-1">
        {/* Left Column */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
            Birinchi ustun
          </h4>
          {leftItems.map((item) => {
            const isSelected = selectedLeft === item.id;
            return (
              <button
                key={item.id}
                disabled={item.matched}
                onClick={() => handleLeftClick(item.id)}
                className={`w-full min-h-[58px] p-3 rounded-2xl border-2 text-xs sm:text-sm font-bold text-left transition-all active:scale-95 cursor-pointer flex items-center justify-between ${
                  item.matched
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-900 opacity-60 line-through'
                    : isSelected
                    ? 'bg-amber-100 border-amber-500 text-amber-950 ring-2 ring-amber-300 scale-[1.02]'
                    : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-800 shadow-2xs'
                }`}
              >
                <span>{item.text}</span>
                {item.matched && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-2.5">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center">
            Mos keluvchi ustun
          </h4>
          {rightItems.map((item) => {
            const isSelected = selectedRight === item.id;
            return (
              <button
                key={item.id}
                disabled={item.matched}
                onClick={() => handleRightClick(item.id)}
                className={`w-full min-h-[58px] p-3 rounded-2xl border-2 text-xs sm:text-sm font-bold text-left transition-all active:scale-95 cursor-pointer flex items-center justify-between ${
                  item.matched
                    ? 'bg-emerald-100 border-emerald-400 text-emerald-900 opacity-60 line-through'
                    : isSelected
                    ? 'bg-amber-100 border-amber-500 text-amber-950 ring-2 ring-amber-300 scale-[1.02]'
                    : 'bg-white border-slate-200 hover:border-emerald-300 text-slate-800 shadow-2xs'
                }`}
              >
                <span>{item.text}</span>
                {item.matched && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Won Message */}
      {isWon && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 text-center space-y-2 animate-pop">
          <div className="text-3xl">🎉</div>
          <h3 className="font-display font-bold text-lg text-emerald-950">
            Ajoyib diqqat! Barcha juftliklar mos tushdi!
          </h3>
          <div className="inline-flex items-center gap-1.5 bg-white border border-emerald-300 px-4 py-1 rounded-full text-emerald-900 font-bold text-xs sm:text-sm">
            ⭐ +20 Yulduzcha berildi!
          </div>
          <div className="pt-2">
            <button
              onClick={initGame}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm inline-flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Qaytadan o'ynash</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
