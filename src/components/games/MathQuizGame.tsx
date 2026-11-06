import React, { useState, useEffect, useCallback } from 'react';
import { Grade } from '../../types';
import { useUser } from '../../context/UserContext';
import { playClickSound, playSuccessSound, playErrorSound, playFanfareSound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';
import { Zap, RotateCcw, CheckCircle2, ArrowRight } from 'lucide-react';

interface MathQuizGameProps {
  grade: Grade;
  onBack: () => void;
}

interface Question {
  expression: string;
  answer: number | string;
  options: (number | string)[];
}

export const MathQuizGame: React.FC<MathQuizGameProps> = ({ grade, onBack }) => {
  const { addStars, incrementGamesCount } = useUser();
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  const TOTAL_QUESTIONS = 8;

  // Generate math question tailored to grade
  const generateQuestion = useCallback((): Question => {
    let expr = '';
    let ans: number | string = 0;
    const distractors: (number | string)[] = [];

    if (grade === 1) {
      // 1-sinf: 1 to 10
      const isAdd = Math.random() > 0.4;
      if (isAdd) {
        const a = Math.floor(Math.random() * 6) + 1;
        const b = Math.floor(Math.random() * (10 - a)) + 1;
        expr = `${a} + ${b}`;
        ans = a + b;
      } else {
        const a = Math.floor(Math.random() * 6) + 5; // 5..10
        const b = Math.floor(Math.random() * a) + 1;
        expr = `${a} - ${b}`;
        ans = a - b;
      }
    } else if (grade === 2) {
      // 2-sinf: up to 100
      const isAdd = Math.random() > 0.5;
      if (isAdd) {
        const a = Math.floor(Math.random() * 40) + 10;
        const b = Math.floor(Math.random() * 40) + 10;
        expr = `${a} + ${b}`;
        ans = a + b;
      } else {
        const a = Math.floor(Math.random() * 50) + 30;
        const b = Math.floor(Math.random() * 25) + 5;
        expr = `${a} - ${b}`;
        ans = a - b;
      }
    } else if (grade === 3) {
      // 3-sinf: multiplication & division tables
      const isMult = Math.random() > 0.4;
      if (isMult) {
        const a = Math.floor(Math.random() * 8) + 2;
        const b = Math.floor(Math.random() * 8) + 2;
        expr = `${a} × ${b}`;
        ans = a * b;
      } else {
        const b = Math.floor(Math.random() * 7) + 2;
        const quotient = Math.floor(Math.random() * 8) + 2;
        const a = b * quotient;
        expr = `${a} ÷ ${b}`;
        ans = quotient;
      }
    } else if (grade === 4) {
      // 4-sinf: larger numbers & combinations
      const op = Math.random();
      if (op < 0.33) {
        const a = (Math.floor(Math.random() * 50) + 10) * 10;
        const b = (Math.floor(Math.random() * 40) + 10) * 10;
        expr = `${a} + ${b}`;
        ans = a + b;
      } else if (op < 0.66) {
        const a = Math.floor(Math.random() * 15) + 11;
        const b = Math.floor(Math.random() * 6) + 3;
        expr = `${a} × ${b}`;
        ans = a * b;
      } else {
        const b = 5;
        const a = (Math.floor(Math.random() * 15) + 5) * b;
        expr = `${a} ÷ ${b}`;
        ans = a / b;
      }
    } else {
      // 5-sinf: fractions & advanced mental math
      const type = Math.random();
      if (type < 0.4) {
        // Simple fractions: 1/4 + 2/4 = 3/4
        const denom = [4, 5, 8][Math.floor(Math.random() * 3)];
        const num1 = Math.floor(Math.random() * (denom - 2)) + 1;
        const num2 = Math.floor(Math.random() * (denom - num1)) + 1;
        expr = `${num1}/${denom} + ${num2}/${denom}`;
        ans = `${num1 + num2}/${denom}`;
        distractors.push(`${Math.max(1, num1 + num2 - 1)}/${denom}`);
        distractors.push(`${num1 + num2 + 1}/${denom}`);
        distractors.push(`${num1 + num2}/${denom * 2}`);
      } else {
        const squares = [11, 12, 13, 14, 15, 20, 25];
        const a = squares[Math.floor(Math.random() * squares.length)];
        expr = `${a} × ${a}`;
        ans = a * a;
      }
    }

    // Generate options
    const options: (number | string)[] = [ans];
    while (options.length < 4) {
      let candidate: number | string;
      if (distractors.length > 0) {
        candidate = distractors.pop()!;
      } else if (typeof ans === 'number') {
        const delta = Math.floor(Math.random() * 7) + 1;
        candidate = Math.random() > 0.5 ? ans + delta : Math.max(1, ans - delta);
      } else {
        candidate = ans;
      }

      if (!options.includes(candidate)) {
        options.push(candidate);
      }
    }

    // Shuffle options
    options.sort(() => Math.random() - 0.5);

    return { expression: expr, answer: ans, options };
  }, [grade]);

  // Init question
  useEffect(() => {
    setCurrentQuestion(generateQuestion());
  }, [generateQuestion]);

  const handleSelectOption = (opt: number | string) => {
    if (isAnswered || !currentQuestion) return;
    setSelectedAnswer(opt);
    setIsAnswered(true);

    if (opt === currentQuestion.answer) {
      playSuccessSound();
      setScore((prev) => prev + 1);
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > bestStreak) setBestStreak(newStreak);

      try {
        confetti({
          particleCount: 25,
          spread: 45,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    } else {
      playErrorSound();
      setStreak(0);
    }
  };

  const handleNext = () => {
    playClickSound();
    if (questionNumber < TOTAL_QUESTIONS) {
      setQuestionNumber((prev) => prev + 1);
      setCurrentQuestion(generateQuestion());
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Game finished
      setIsGameOver(true);
      incrementGamesCount();
      const earnedStars = score * 5 + (bestStreak >= 3 ? 10 : 0);
      addStars(earnedStars, `Matematik viktorina yakunlandi! +${earnedStars} ⭐`);
      if (score >= 6) {
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
    }
  };

  const handleRestart = () => {
    playClickSound();
    setScore(0);
    setStreak(0);
    setQuestionNumber(1);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsGameOver(false);
    setCurrentQuestion(generateQuestion());
  };

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm max-w-xl mx-auto space-y-5">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { playClickSound(); onBack(); }}
          className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
        >
          ← O'yinlarga qaytish
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            {grade}-sinf darajasi
          </span>
          {streak >= 2 && (
            <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 flex items-center gap-1 animate-bounce">
              <Zap className="w-3 h-3 fill-slate-900" /> {streak}x combo!
            </span>
          )}
        </div>
      </div>

      {!isGameOver && currentQuestion ? (
        <div className="space-y-5">
          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold text-slate-500">
              <span>Savol: {questionNumber} / {TOTAL_QUESTIONS}</span>
              <span className="text-amber-600 font-extrabold">⭐ To'g'ri: {score}</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-300"
                style={{ width: `${(questionNumber / TOTAL_QUESTIONS) * 100}%` }}
              />
            </div>
          </div>

          {/* Big Problem Box */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-3xl p-6 sm:p-8 text-center shadow-inner">
            <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600">
              Tezkor hisoblang
            </span>
            <div className="font-display font-extrabold text-4xl sm:text-5xl text-slate-900 mt-2 tracking-wider">
              {currentQuestion.expression} = ?
            </div>
          </div>

          {/* 4 Large Choice Buttons */}
          <div className="grid grid-cols-2 gap-3">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedAnswer === opt;
              const isCorrect = opt === currentQuestion.answer;

              let style = 'bg-white border-slate-200 hover:border-blue-300 text-slate-900';
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
                  onClick={() => handleSelectOption(opt)}
                  className={`min-h-[64px] rounded-2xl border-2 text-xl sm:text-2xl font-bold flex items-center justify-center transition-all active:scale-95 cursor-pointer ${style}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Bottom Next Button */}
          {isAnswered && (
            <div className="pt-2 animate-pop">
              <button
                onClick={handleNext}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-base shadow-md shadow-blue-200 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>
                  {questionNumber < TOTAL_QUESTIONS ? 'Keyingi misol' : 'Natijani ko\'rish'}
                </span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Game Over Screen */
        <div className="text-center py-6 space-y-4">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-orange-500 text-white flex items-center justify-center text-4xl shadow-lg shadow-orange-200">
            {score >= 6 ? '🏆' : '⭐'}
          </div>

          <h3 className="font-display font-bold text-2xl text-slate-900">
            {score >= 6 ? 'Super Matematik!' : 'Yaxshi natija!'}
          </h3>

          <p className="text-slate-600 text-sm">
            Siz {TOTAL_QUESTIONS} ta misoldan <strong>{score}</strong> tasini to'g'ri yechdingiz!
          </p>

          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-300 px-5 py-2 rounded-2xl">
            <span className="text-xl">⭐</span>
            <span className="font-bold text-amber-900 text-sm sm:text-base">
              +{score * 5 + (bestStreak >= 3 ? 10 : 0)} Yulduzcha yutib oldingiz!
            </span>
          </div>

          <div className="flex items-center justify-center gap-3 pt-3">
            <button
              onClick={handleRestart}
              className="px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 font-semibold text-xs sm:text-sm text-slate-700 flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Qaytadan o'ynash</span>
            </button>

            <button
              onClick={() => { playClickSound(); onBack(); }}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm cursor-pointer"
            >
              O'yinlar ro'yxatiga qaytish
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
