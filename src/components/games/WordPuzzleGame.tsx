import React, { useState, useEffect } from 'react';
import { Grade } from '../../types';
import { useUser } from '../../context/UserContext';
import { WORD_PUZZLES_BY_GRADE } from '../../data/gamesData';
import { playClickSound, playSuccessSound, playErrorSound, playFanfareSound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';
import { RotateCcw, Lightbulb, CheckCircle2, Delete, ArrowRight } from 'lucide-react';

interface WordPuzzleGameProps {
  grade: Grade;
  onBack: () => void;
}

interface LetterTile {
  id: string;
  letter: string;
  used: boolean;
}

export const WordPuzzleGame: React.FC<WordPuzzleGameProps> = ({ grade, onBack }) => {
  const { addStars, incrementGamesCount } = useUser();
  const wordList = WORD_PUZZLES_BY_GRADE[grade];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [tiles, setTiles] = useState<LetterTile[]>([]);
  const [placedLetters, setPlacedLetters] = useState<LetterTile[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [completedWordsCount, setCompletedWordsCount] = useState(0);

  const currentItem = wordList[currentIndex];

  const setupWord = (itemIndex: number) => {
    const wordObj = wordList[itemIndex];
    const letters = wordObj.word.split('');
    const scrambled = [...letters]
      .sort(() => Math.random() - 0.5)
      .map((letter, idx) => ({
        id: `${letter}_${idx}_${Date.now()}`,
        letter,
        used: false,
      }));

    setTiles(scrambled);
    setPlacedLetters([]);
    setShowHint(false);
    setIsSuccess(false);
    setIsWrong(false);
  };

  useEffect(() => {
    setCurrentIndex(0);
    setCompletedWordsCount(0);
    setupWord(0);
  }, [grade]);

  const handleTileClick = (tile: LetterTile) => {
    if (tile.used || isSuccess) return;
    playClickSound();

    // Mark as used in available tiles
    setTiles((prev) =>
      prev.map((t) => (t.id === tile.id ? { ...t, used: true } : t))
    );

    const newPlaced = [...placedLetters, tile];
    setPlacedLetters(newPlaced);

    // Check if word is complete
    if (newPlaced.length === currentItem.word.length) {
      const assembledWord = newPlaced.map((t) => t.letter).join('');
      if (assembledWord === currentItem.word) {
        // Correct word!
        setIsSuccess(true);
        setIsWrong(false);
        playSuccessSound();
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      } else {
        // Wrong assembly
        setIsWrong(true);
        playErrorSound();
      }
    }
  };

  const handleRemovePlaced = (tile: LetterTile) => {
    if (isSuccess) return;
    playClickSound();
    setIsWrong(false);

    // Remove from placed
    setPlacedLetters((prev) => prev.filter((t) => t.id !== tile.id));

    // Restore to available
    setTiles((prev) =>
      prev.map((t) => (t.id === tile.id ? { ...t, used: false } : t))
    );
  };

  const handleResetWord = () => {
    playClickSound();
    setupWord(currentIndex);
  };

  const handleNextWord = () => {
    playClickSound();
    const newCount = completedWordsCount + 1;
    setCompletedWordsCount(newCount);
    addStars(10, `So'zni to'g'ri topdingiz! +10 ⭐`);

    if (currentIndex < wordList.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setupWord(nextIdx);
    } else {
      // Completed all words in this grade!
      incrementGamesCount();
      addStars(15, `Barcha so'zlarni yig'dingiz! +15 ⭐`);
      playFanfareSound();
      try {
        confetti({
          particleCount: 90,
          spread: 75,
          origin: { y: 0.5 },
        });
      } catch {
        // ignore
      }
    }
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm max-w-xl mx-auto space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { playClickSound(); onBack(); }}
          className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          ← O'yinlarga qaytish
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200">
            {grade}-sinf • So'z {currentIndex + 1} / {wordList.length}
          </span>
        </div>
      </div>

      {/* Target Word Boxes (Empty slots) */}
      <div className="bg-amber-50/60 border-2 border-amber-200 rounded-3xl p-5 text-center space-y-3">
        <div className="flex items-center justify-center gap-2">
          <span className="text-3xl">{currentItem.emoji}</span>
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">
            Harflardan so'z yasang
          </span>
        </div>

        {/* Word slots */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          {Array.from({ length: currentItem.word.length }).map((_, idx) => {
            const placed = placedLetters[idx];
            return (
              <button
                key={idx}
                disabled={!placed || isSuccess}
                onClick={() => placed && handleRemovePlaced(placed)}
                className={`w-11 h-12 sm:w-13 sm:h-14 rounded-2xl border-2 text-xl sm:text-2xl font-display font-bold flex items-center justify-center transition-all ${
                  isSuccess
                    ? 'bg-emerald-500 text-white border-emerald-600 shadow-md animate-pop'
                    : isWrong && placed
                    ? 'bg-rose-50 text-rose-700 border-rose-400'
                    : placed
                    ? 'bg-white text-slate-900 border-amber-400 shadow-xs active:scale-95 cursor-pointer'
                    : 'bg-white/70 border-dashed border-amber-300 text-transparent'
                }`}
              >
                {placed ? placed.letter : ''}
              </button>
            );
          })}
        </div>

        {/* Hint text if toggled */}
        {showHint ? (
          <div className="text-xs sm:text-sm font-medium text-amber-900 bg-amber-100/70 border border-amber-200 rounded-xl px-3 py-1.5 mt-2 inline-block">
            💡 <strong>Yordam:</strong> {currentItem.hint}
          </div>
        ) : (
          <button
            onClick={() => { playClickSound(); setShowHint(true); }}
            className="text-xs text-amber-700 hover:text-amber-900 font-semibold underline cursor-pointer inline-flex items-center gap-1 mt-1"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Maslahat (Yordam)</span>
          </button>
        )}
      </div>

      {/* Available Letter Tiles */}
      <div className="space-y-2">
        <p className="text-center text-xs font-bold text-slate-500 uppercase tracking-wider">
          Harflarni ketma-ket bosing:
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {tiles.map((tile) => (
            <button
              key={tile.id}
              disabled={tile.used || isSuccess}
              onClick={() => handleTileClick(tile)}
              className={`w-12 h-13 sm:w-14 sm:h-15 rounded-2xl border-2 font-display text-xl sm:text-2xl font-bold flex items-center justify-center transition-all active:scale-95 ${
                tile.used
                  ? 'bg-slate-100 border-slate-200 text-slate-300 opacity-40 cursor-not-allowed'
                  : 'bg-white border-slate-300 hover:border-amber-400 text-slate-900 shadow-xs hover:shadow-sm cursor-pointer'
              }`}
            >
              {tile.letter}
            </button>
          ))}
        </div>
      </div>

      {/* Action Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          disabled={placedLetters.length === 0 || isSuccess}
          onClick={handleResetWord}
          className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-colors ${
            placedLetters.length > 0 && !isSuccess
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer'
              : 'text-slate-300 cursor-not-allowed'
          }`}
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Qaytarish</span>
        </button>

        {isSuccess && (
          <button
            onClick={handleNextWord}
            className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-emerald-200 animate-pop cursor-pointer"
          >
            <span>{currentIndex < wordList.length - 1 ? 'Keyingi so\'z' : 'Barcha so\'zlar topildi!'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Success banner */}
      {isSuccess && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 text-center text-emerald-900 text-xs sm:text-sm font-bold flex items-center justify-center gap-2 animate-pop">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Barakalla! To'g'ri yig'dingiz: "{currentItem.word}" (+10 ⭐)</span>
        </div>
      )}
    </div>
  );
};
