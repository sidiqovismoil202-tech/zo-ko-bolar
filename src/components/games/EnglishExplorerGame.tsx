import React, { useState } from 'react';
import { Grade } from '../../types';
import { useUser } from '../../context/UserContext';
import { ENGLISH_WORDS_BY_GRADE } from '../../data/gamesData';
import { playClickSound, playSuccessSound, playErrorSound, playFanfareSound, speakEnglish } from '../../services/soundEffects';
import confetti from 'canvas-confetti';
import { Volume2, CheckCircle2, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

interface EnglishExplorerGameProps {
  grade: Grade;
  onBack: () => void;
}

export const EnglishExplorerGame: React.FC<EnglishExplorerGameProps> = ({ grade, onBack }) => {
  const { addStars, incrementGamesCount } = useUser();
  const wordList = ENGLISH_WORDS_BY_GRADE[grade];

  const [mode, setMode] = useState<'learn' | 'quiz'>('learn');
  const [currentWordIdx, setCurrentWordIdx] = useState(0);

  // Quiz mode state
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  const word = wordList[currentWordIdx];

  const handleSpeak = (text: string) => {
    playClickSound();
    speakEnglish(text);
  };

  const handleNextLearn = () => {
    playClickSound();
    if (currentWordIdx < wordList.length - 1) {
      setCurrentWordIdx((prev) => prev + 1);
    } else {
      // Completed learning round, invite to quiz
      setMode('quiz');
      setQuizIdx(0);
      setQuizScore(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setIsQuizComplete(false);
      addStars(10, 'Yangi inglizcha so\'zlarni o\'rgandingiz! +10 ⭐');
    }
  };

  const handlePrevLearn = () => {
    playClickSound();
    if (currentWordIdx > 0) {
      setCurrentWordIdx((prev) => prev - 1);
    }
  };

  // Generate quiz options for current quiz question
  const currentQuizWord = wordList[quizIdx];
  const generateQuizOptions = () => {
    if (!currentQuizWord) return [];
    const correct = currentQuizWord.english;
    const others = wordList
      .filter((w) => w.english !== correct)
      .map((w) => w.english);

    const shuffledOthers = [...others].sort(() => Math.random() - 0.5).slice(0, 3);
    return [correct, ...shuffledOthers].sort(() => Math.random() - 0.5);
  };

  const [currentOptions, setCurrentOptions] = useState<string[]>(() => {
    const list = ENGLISH_WORDS_BY_GRADE[grade];
    const correct = list[0]?.english;
    const others = list.filter((w) => w.english !== correct).map((w) => w.english);
    return [correct, ...others.slice(0, 3)].sort(() => Math.random() - 0.5);
  });

  const handleQuizAnswer = (opt: string) => {
    if (isAnswered) return;
    setSelectedAnswer(opt);
    setIsAnswered(true);

    if (opt === currentQuizWord.english) {
      playSuccessSound();
      speakEnglish(opt);
      setQuizScore((s) => s + 1);
      try {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    } else {
      playErrorSound();
    }
  };

  const handleNextQuizQuestion = () => {
    playClickSound();
    if (quizIdx < wordList.length - 1) {
      const next = quizIdx + 1;
      setQuizIdx(next);
      setSelectedAnswer(null);
      setIsAnswered(false);

      // generate options for next
      const correct = wordList[next].english;
      const others = wordList.filter((w) => w.english !== correct).map((w) => w.english);
      setCurrentOptions([correct, ...others.slice(0, 3)].sort(() => Math.random() - 0.5));
    } else {
      // Quiz finished
      setIsQuizComplete(true);
      incrementGamesCount();
      const starsEarned = quizScore * 5;
      addStars(starsEarned, `Ingliz tili testi tugadi! +${starsEarned} ⭐`);
      if (quizScore >= 4) {
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

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl text-xs font-bold">
          <button
            onClick={() => { playClickSound(); setMode('learn'); }}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              mode === 'learn' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
            }`}
          >
            📖 O'rganish
          </button>
          <button
            onClick={() => {
              playClickSound();
              setMode('quiz');
              setQuizIdx(0);
              setQuizScore(0);
              setSelectedAnswer(null);
              setIsAnswered(false);
              setIsQuizComplete(false);
              const correct = wordList[0].english;
              const others = wordList.filter((w) => w.english !== correct).map((w) => w.english);
              setCurrentOptions([correct, ...others.slice(0, 3)].sort(() => Math.random() - 0.5));
            }}
            className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
              mode === 'quiz' ? 'bg-white text-indigo-700 shadow-2xs' : 'text-slate-600'
            }`}
          >
            🎯 Mini-Test
          </button>
        </div>
      </div>

      {mode === 'learn' && word && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>So'z {currentWordIdx + 1} / {wordList.length}</span>
            <span className="text-purple-600 bg-purple-50 px-2 py-0.5 rounded-full border border-purple-200">
              {grade}-sinf lug'ati
            </span>
          </div>

          {/* Flashcard */}
          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 border-2 border-purple-200 rounded-3xl p-6 sm:p-8 text-center space-y-3 shadow-inner">
            <span className="text-6xl sm:text-7xl block animate-bounce">
              {word.emoji}
            </span>

            <div className="flex items-center justify-center gap-2">
              <h3 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900">
                {word.english}
              </h3>
              <button
                onClick={() => handleSpeak(word.english)}
                className="w-10 h-10 rounded-full bg-purple-600 hover:bg-purple-700 active:scale-90 text-white flex items-center justify-center shadow-md shadow-purple-200 cursor-pointer transition-all"
                title="Talaffuzni eshitish"
              >
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <div className="text-lg sm:text-xl font-bold text-purple-900 bg-white/80 border border-purple-200 rounded-2xl py-2 px-4 inline-block">
              🇺🇿 {word.uzbek}
            </div>

            <p className="text-xs sm:text-sm text-slate-600 italic pt-1">
              "{word.example}"
            </p>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between pt-2">
            <button
              disabled={currentWordIdx === 0}
              onClick={handlePrevLearn}
              className={`px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm transition-colors ${
                currentWordIdx > 0
                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-800 cursor-pointer'
                  : 'text-slate-300 cursor-not-allowed'
              }`}
            >
              ← Oldingi so'z
            </button>

            <button
              onClick={() => handleSpeak(word.english)}
              className="px-3 py-2 rounded-xl border border-purple-200 bg-purple-50 text-purple-700 font-semibold text-xs flex items-center gap-1.5 hover:bg-purple-100 cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Ovozli eshitish</span>
            </button>

            <button
              onClick={handleNextLearn}
              className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-indigo-200 cursor-pointer"
            >
              <span>{currentWordIdx < wordList.length - 1 ? 'Keyingi so\'z' : 'Testga o\'tish'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {mode === 'quiz' && !isQuizComplete && currentQuizWord && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Savol {quizIdx + 1} / {wordList.length}</span>
            <span className="text-amber-600 font-extrabold">⭐ Ball: {quizScore}</span>
          </div>

          {/* Quiz Question Box */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-3xl p-6 text-center space-y-2">
            <span className="text-5xl block">{currentQuizWord.emoji}</span>
            <span className="text-xs uppercase font-extrabold tracking-widest text-indigo-700">
              Bu nima deb aytiladi?
            </span>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900">
              "{currentQuizWord.uzbek}"
            </h3>
          </div>

          {/* 4 Choices */}
          <div className="grid grid-cols-2 gap-2.5">
            {currentOptions.map((opt, idx) => {
              const isSelected = selectedAnswer === opt;
              const isCorrect = opt === currentQuizWord.english;

              let style = 'bg-white border-slate-200 hover:border-purple-300 text-slate-900';
              if (isAnswered) {
                if (isCorrect) {
                  style = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-200';
                } else if (isSelected) {
                  style = 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-200';
                } else {
                  style = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleQuizAnswer(opt)}
                  className={`min-h-[58px] p-3 rounded-2xl border-2 text-base sm:text-lg font-bold flex items-center justify-center transition-all active:scale-95 cursor-pointer ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div className="pt-2 animate-pop">
              <button
                onClick={handleNextQuizQuestion}
                className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm sm:text-base shadow-md shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{quizIdx < wordList.length - 1 ? 'Keyingi savol' : 'Natijani ko\'rish'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {mode === 'quiz' && isQuizComplete && (
        <div className="text-center py-6 space-y-3">
          <div className="text-5xl">🇬🇧 🎉</div>
          <h3 className="font-display font-bold text-2xl text-slate-900">
            English Master yakunlandi!
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Siz {wordList.length} ta so'zdan <strong>{quizScore}</strong> tasini to'g'ri topdingiz!
          </p>
          <div className="inline-flex items-center gap-1.5 bg-purple-50 border border-purple-300 px-4 py-1.5 rounded-full text-purple-900 font-bold text-sm">
            ⭐ +{quizScore * 5} Yulduzcha to'plandi!
          </div>

          <div className="flex justify-center gap-2 pt-3">
            <button
              onClick={() => {
                setMode('learn');
                setCurrentWordIdx(0);
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Qaytadan o'rganish</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
