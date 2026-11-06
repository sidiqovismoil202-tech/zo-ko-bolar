import React, { useState, useEffect } from 'react';
import { Grade } from '../../types';
import { useUser } from '../../context/UserContext';
import { playClickSound, playCardFlipSound, playSuccessSound, playFanfareSound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';
import { RotateCcw } from 'lucide-react';

interface MemoryGameProps {
  grade: Grade;
  onBack: () => void;
}

interface CardItem {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJI_SETS: Record<Grade, string[]> = {
  1: ['🍎', '🍌', '🦁', '🐶', '🐱', '🍇'], // 6 pairs
  2: ['📚', '✏️', '🎒', '⏰', '🚲', '⚽'], // 6 pairs
  3: ['🚀', '🌈', '🌲', '🐬', '🏆', '🏀'], // 6 pairs
  4: ['🏛️', '🏔️', '🧭', '🔭', '💡', '💎', '⛵', '🎨'], // 8 pairs
  5: ['🪐', '🧬', '⚔️', '📜', '🌋', '🛰️', '🔬', '👑'], // 8 pairs
};

export const MemoryGame: React.FC<MemoryGameProps> = ({ grade, onBack }) => {
  const { addStars, incrementGamesCount } = useUser();
  const [cards, setCards] = useState<CardItem[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [isWon, setIsWon] = useState(false);

  const emojis = EMOJI_SETS[grade];
  const totalPairs = emojis.length;

  const initGame = () => {
    const deck = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, idx) => ({
        id: idx,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));

    setCards(deck);
    setFlippedIndices([]);
    setMoves(0);
    setMatchedPairs(0);
    setIsWon(false);
  };

  useEffect(() => {
    initGame();
  }, [grade]);

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || flippedIndices.length >= 2) {
      return;
    }

    playCardFlipSound();

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves((m) => m + 1);
      const [firstIdx, secondIdx] = newFlipped;
      const firstCard = newCards[firstIdx];
      const secondCard = newCards[secondIdx];

      if (firstCard.emoji === secondCard.emoji) {
        // Matched!
        setTimeout(() => {
          playSuccessSound();
          newCards[firstIdx].isMatched = true;
          newCards[secondIdx].isMatched = true;
          setCards([...newCards]);
          setFlippedIndices([]);
          setMatchedPairs((p) => {
            const updated = p + 1;
            if (updated === totalPairs) {
              // Game won!
              setIsWon(true);
              incrementGamesCount();
              const earnedStars = 25;
              addStars(earnedStars, `Xotira o'yini yakunlandi! +${earnedStars} ⭐`);
              playFanfareSound();
              try {
                confetti({
                  particleCount: 90,
                  spread: 70,
                  origin: { y: 0.5 },
                });
              } catch {
                // ignore
              }
            }
            return updated;
          });
        }, 400);
      } else {
        // Not matched, flip back
        setTimeout(() => {
          newCards[firstIdx].isFlipped = false;
          newCards[secondIdx].isFlipped = false;
          setCards([...newCards]);
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { playClickSound(); onBack(); }}
          className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          ← O'yinlarga qaytish
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
            {grade}-sinf • {totalPairs} juftlik
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
            Urinishlar: {moves}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between text-xs font-bold text-slate-600">
        <span>Topilgan juftliklar: {matchedPairs} / {totalPairs}</span>
        <span className="text-purple-600 font-extrabold">🧠 Xotirani sinang!</span>
      </div>

      {/* Cards Grid */}
      <div className={`grid gap-2.5 sm:gap-3 ${
        totalPairs > 6 ? 'grid-cols-4 sm:grid-cols-4' : 'grid-cols-3 sm:grid-cols-4'
      }`}>
        {cards.map((card, idx) => (
          <button
            key={card.id}
            disabled={card.isFlipped || card.isMatched}
            onClick={() => handleCardClick(idx)}
            className={`aspect-square rounded-2xl flex items-center justify-center text-3xl sm:text-4xl transition-all duration-300 transform active:scale-95 cursor-pointer shadow-xs ${
              card.isMatched
                ? 'bg-emerald-100 border-2 border-emerald-400 scale-95 opacity-90'
                : card.isFlipped
                ? 'bg-white border-2 border-purple-500 rotate-0 shadow-md ring-2 ring-purple-200'
                : 'bg-gradient-to-br from-indigo-500 to-purple-600 border-2 border-indigo-600 text-transparent hover:brightness-105'
            }`}
          >
            {card.isFlipped || card.isMatched ? (
              <span className="animate-pop">{card.emoji}</span>
            ) : (
              <span className="text-2xl text-white/50">❓</span>
            )}
          </button>
        ))}
      </div>

      {/* Win Banner */}
      {isWon && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-300 rounded-2xl p-5 text-center space-y-3 animate-pop">
          <div className="text-4xl">🎉</div>
          <h3 className="font-display font-bold text-xl text-purple-950">
            Barakalla! Barcha juftliklarni topdingiz!
          </h3>
          <p className="text-xs sm:text-sm text-purple-900">
            Siz {moves} ta urinishda barcha kartalarni xotirada saqlab muvaffaqiyatli yakunladingiz.
          </p>
          <div className="inline-flex items-center gap-1.5 bg-white border border-purple-300 px-4 py-1.5 rounded-full text-purple-900 font-bold text-sm">
            ⭐ +25 Yulduzcha olindi!
          </div>

          <div className="pt-2 flex justify-center gap-2">
            <button
              onClick={initGame}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Yana o'ynash</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
