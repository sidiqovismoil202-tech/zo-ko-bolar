import React, { useState } from 'react';
import { Lesson } from '../types';
import { useUser } from '../context/UserContext';
import { playClickSound, playSuccessSound, playErrorSound, playFanfareSound } from '../services/soundEffects';
import confetti from 'canvas-confetti';
import { X, Sparkles, CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Award, Lightbulb, Clock } from 'lucide-react';

interface LessonModalProps {
  lesson: Lesson;
  onClose: () => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({ lesson, onClose }) => {
  const { user, completeLesson, completeQuiz } = useUser();
  const [mode, setMode] = useState<'read' | 'quiz' | 'result'>('read');
  
  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState<boolean[]>([]);

  const currentQ = lesson.quiz[currentQuestionIndex];
  const isCompleted = user.completedLessons.includes(lesson.id);

  const startQuiz = () => {
    playClickSound();
    completeLesson(lesson.id);
    setMode('quiz');
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setUserAnswers([]);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === currentQ.correctIndex;
    if (isCorrect) {
      playSuccessSound();
      setScore((prev) => prev + 1);
      setUserAnswers((prev) => [...prev, true]);
      try {
        confetti({
          particleCount: 40,
          spread: 55,
          origin: { y: 0.7 },
        });
      } catch {
        // ignore
      }
    } else {
      playErrorSound();
      setUserAnswers((prev) => [...prev, false]);
    }
  };

  const handleNextQuestion = () => {
    playClickSound();
    if (currentQuestionIndex < lesson.quiz.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Quiz finished
      setMode('result');
      const finalScore = score + (selectedOption === currentQ.correctIndex ? 0 : 0);
      completeQuiz(lesson.id, score);
      if (score >= 4) {
        playFanfareSound();
        try {
          confetti({
            particleCount: 100,
            spread: 80,
            origin: { y: 0.5 },
          });
        } catch {
          // ignore
        }
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-100 overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50/50 via-white to-indigo-50/40">
          <div className="flex items-center gap-3">
            <span className="text-3xl sm:text-4xl">{lesson.emoji}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  {lesson.grade}-sinf darsi
                </span>
                <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {lesson.readTime}
                </span>
              </div>
              <h2 className="font-display font-bold text-lg sm:text-xl text-slate-900 leading-tight mt-0.5">
                {lesson.title}
              </h2>
            </div>
          </div>

          <button
            onClick={() => { playClickSound(); onClose(); }}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center active:scale-90 transition-all shrink-0 cursor-pointer"
            aria-label="Yopish"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {mode === 'read' && (
            <div className="space-y-5">
              {/* Summary Callout */}
              <div className="bg-indigo-50/80 border border-indigo-100 rounded-2xl p-4 text-indigo-950">
                <p className="text-sm sm:text-base font-medium leading-relaxed">
                  {lesson.content.introduction}
                </p>
              </div>

              {/* Key learning takeaways */}
              <div className="space-y-3.5">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Darsning asosiy qoidalari</span>
                </h3>

                <div className="grid gap-3">
                  {lesson.content.keyPoints.map((point, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3.5 sm:p-4 hover:border-indigo-200 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl shrink-0 mt-0.5">{point.emoji}</span>
                        <div className="space-y-1">
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                            {point.title}
                          </h4>
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                            {point.description}
                          </p>
                          {point.example && (
                            <div className="mt-2 bg-white/90 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-indigo-900 font-medium">
                              💡 <strong>Misol:</strong> {point.example}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fun Fact */}
              {lesson.content.funFact && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 sm:p-4 flex items-start gap-3 text-amber-950">
                  <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm uppercase tracking-wide text-amber-800">
                      Qiziqarli ma'lumot! 🧐
                    </h4>
                    <p className="text-xs sm:text-sm text-amber-900 mt-0.5">
                      {lesson.content.funFact}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* QUIZ MODE */}
          {mode === 'quiz' && currentQ && (
            <div className="space-y-4">
              {/* Progress Bar & Counter */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                  <span>Savol {currentQuestionIndex + 1} / {lesson.quiz.length}</span>
                  <span className="text-amber-600 flex items-center gap-1">
                    ⭐ Ball: {score} / {currentQuestionIndex + (isAnswered ? 1 : 0)}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-orange-500 h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${((currentQuestionIndex + (isAnswered ? 1 : 0)) / lesson.quiz.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <div className="bg-gradient-to-br from-indigo-50/70 to-blue-50/70 border border-indigo-100 rounded-2xl p-4 sm:p-5">
                <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 leading-snug">
                  {currentQ.question}
                </h3>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, optIdx) => {
                  const isChosen = selectedOption === optIdx;
                  const isCorrect = optIdx === currentQ.correctIndex;

                  let btnStyle = 'bg-white border-slate-200 hover:border-slate-300 text-slate-800 hover:bg-slate-50';

                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold ring-2 ring-emerald-200';
                    } else if (isChosen && !isCorrect) {
                      btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 ring-2 ring-rose-200';
                    } else {
                      btnStyle = 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={optIdx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(optIdx)}
                      className={`w-full min-h-[52px] p-3 sm:p-3.5 rounded-2xl border-2 text-left text-sm sm:text-base font-medium transition-all flex items-center justify-between gap-3 active:scale-[0.99] cursor-pointer ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                          isAnswered && isCorrect
                            ? 'bg-emerald-500 text-white'
                            : isAnswered && isChosen
                            ? 'bg-rose-500 text-white'
                            : 'bg-slate-100 text-slate-600'
                        }`}>
                          {String.fromCharCode(65 + optIdx)}
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isAnswered && isCorrect && (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      {isAnswered && isChosen && !isCorrect && (
                        <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Alert */}
              {isAnswered && (
                <div
                  className={`p-4 rounded-2xl border animate-pop ${
                    selectedOption === currentQ.correctIndex
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    {selectedOption === currentQ.correctIndex ? (
                      <span className="text-2xl">🌟</span>
                    ) : (
                      <span className="text-2xl">💪</span>
                    )}
                    <div>
                      <h4 className="font-bold text-sm">
                        {selectedOption === currentQ.correctIndex
                          ? 'Barakalla! To\'g\'ri javob! (+5 ⭐)'
                          : 'Yana urinib ko\'r! Xafa bo\'lma:'}
                      </h4>
                      <p className="text-xs sm:text-sm mt-0.5 opacity-90">
                        {currentQ.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* RESULT MODE */}
          {mode === 'result' && (
            <div className="text-center py-4 space-y-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center text-4xl sm:text-5xl shadow-lg shadow-amber-200 animate-bounce">
                {score >= 4 ? '🏆' : score >= 2 ? '⭐' : '🌱'}
              </div>

              <div>
                <h3 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
                  {score === 5
                    ? 'A\'lo natija! Mukammal!'
                    : score >= 4
                    ? 'Barakalla, Bilimdon!'
                    : 'Yaxshi harakat!'}
                </h3>
                <p className="text-slate-600 text-sm sm:text-base mt-1">
                  Siz 5 ta savoldan <strong>{score}</strong> tasiga to'g'ri javob berdingiz!
                </p>
              </div>

              {/* Award summary pill */}
              <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-300 px-5 py-2.5 rounded-2xl shadow-xs">
                <span className="text-2xl">⭐</span>
                <span className="font-bold text-amber-900 text-base sm:text-lg">
                  +{score * 5} Yulduzcha qo'shildi!
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                {score >= 4
                  ? 'Siz ushbu dars mavzusini juda yaxshi o\'zlashtirdingiz. Yangi darslarga o\'tishingiz mumkin!'
                  : 'Darsni yana bir bor o\'qib chiqib, testni qaytadan topshirsangiz, barcha savollarni to\'g\'ri yechishingiz mumkin!'}
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          {mode === 'read' ? (
            <>
              <button
                onClick={() => { playClickSound(); onClose(); }}
                className="px-4 py-2.5 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-200 transition-colors cursor-pointer"
              >
                Orqaga
              </button>

              <button
                onClick={startQuiz}
                className="px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm sm:text-base shadow-md shadow-orange-200 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
              >
                <span>Testni boshlash (5 savol)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : mode === 'quiz' ? (
            <>
              <button
                onClick={() => { playClickSound(); setMode('read'); }}
                className="px-4 py-2 text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Darsga qaytish
              </button>

              <button
                disabled={!isAnswered}
                onClick={handleNextQuestion}
                className={`px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 transition-all cursor-pointer ${
                  isAnswered
                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-200 active:scale-95'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <span>
                  {currentQuestionIndex < lesson.quiz.length - 1 ? 'Keyingi savol' : 'Natijani ko\'rish'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            <div className="w-full flex items-center justify-between gap-3">
              <button
                onClick={startQuiz}
                className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-white text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Qayta urinish</span>
              </button>

              <button
                onClick={() => { playClickSound(); onClose(); }}
                className="px-6 py-2.5 sm:py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm sm:text-base shadow-md shadow-emerald-200 active:scale-95 transition-all cursor-pointer"
              >
                Tamomlash ✓
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
