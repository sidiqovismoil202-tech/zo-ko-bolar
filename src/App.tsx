import React, { useState, useEffect } from 'react';
import { UserProvider, useUser } from './context/UserContext';
import { Header } from './components/Header';
import { GradeSelector } from './components/GradeSelector';
import { LessonModal } from './components/LessonModal';
import { ProfileModal } from './components/ProfileModal';
import { BadgesView } from './components/BadgesView';
import { RewardToast } from './components/RewardToast';
import { MathQuizGame } from './components/games/MathQuizGame';
import { MemoryGame } from './components/games/MemoryGame';
import { WordPuzzleGame } from './components/games/WordPuzzleGame';
import { MatchPairsGame } from './components/games/MatchPairsGame';
import { EnglishExplorerGame } from './components/games/EnglishExplorerGame';
import { DragDropGame } from './components/games/DragDropGame';
import { SUBJECTS, LESSONS } from './data/curriculumData';
import { GAMES_INFO, getRankByStars } from './data/gamesData';
import { SubjectId, Lesson, GameId } from './types';
import { playClickSound, initSoundPreference } from './services/soundEffects';
import { 
  Sparkles, 
  BookOpen, 
  Gamepad2, 
  CheckCircle2, 
  ArrowRight, 
  Trophy, 
  Clock, 
  GraduationCap, 
  Heart
} from 'lucide-react';

const MainContent: React.FC = () => {
  const { user, setGrade } = useUser();
  const [activeTab, setActiveTab] = useState<'lessons' | 'games' | 'badges'>('lessons');
  const [selectedSubjectId, setSelectedSubjectId] = useState<SubjectId | 'all'>('all');
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [activeGameId, setActiveGameId] = useState<GameId | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    initSoundPreference();
  }, []);

  const rank = getRankByStars(user.stars);

  // Filter lessons by current grade and optional subject filter
  const currentGradeLessons = LESSONS.filter((l) => l.grade === user.grade);
  const displayedLessons = selectedSubjectId === 'all'
    ? currentGradeLessons
    : currentGradeLessons.filter((l) => l.subjectId === selectedSubjectId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50/40 via-sky-50/30 to-indigo-50/40 text-slate-800 flex flex-col">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setActiveGameId(null);
        }}
        onOpenProfile={() => setIsProfileOpen(true)}
      />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-5 sm:py-7 space-y-6 sm:space-y-8">
        
        {/* Playful Hero Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 shadow-md shadow-orange-200/60 p-5 sm:p-7 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-xl z-10 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-xs px-3 py-1 rounded-full text-xs font-bold text-amber-50">
              <Sparkles className="w-3.5 h-3.5 text-yellow-200" />
              <span>O'rganamiz va g'olib bo'lamiz!</span>
            </div>

            <h1 className="font-display font-black text-2xl sm:text-4xl leading-tight">
              Salom, {user.name}! {user.avatar}
            </h1>

            <p className="text-amber-50 text-xs sm:text-base leading-relaxed">
              Bugun qaysi fanni o'rganmoqchisiz? Qiziqarli mini-darslarni o'qing, testlarni topshiring va 6 xil o'yinda o'z bilimingizni sinab ko'ring!
            </p>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 pt-1">
              <button
                onClick={() => {
                  playClickSound();
                  setActiveTab('lessons');
                  setActiveGameId(null);
                }}
                className="px-4 sm:px-5 py-2.5 rounded-2xl bg-white text-orange-600 font-bold text-xs sm:text-sm shadow-sm hover:bg-amber-50 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Darslarni ko'rish</span>
              </button>

              <button
                onClick={() => {
                  playClickSound();
                  setActiveTab('games');
                }}
                className="px-4 sm:px-5 py-2.5 rounded-2xl bg-slate-900/80 hover:bg-slate-900 text-white font-bold text-xs sm:text-sm shadow-sm active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Gamepad2 className="w-4 h-4 text-amber-300" />
                <span>O'yinlarni boshlash</span>
              </button>
            </div>
          </div>

          {/* Hero Banner Visual Asset */}
          <div className="relative w-full max-w-[280px] sm:max-w-[320px] aspect-16/9 rounded-2xl overflow-hidden shadow-lg border-2 border-white/30 shrink-0">
            <img
              src="/src/assets/images/hero_mascot_learning_1793956790917.jpg"
              alt="Quvnoq bilimdon bolalar va boyo'g'li"
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>

        {/* Grade Selection Bar */}
        <section className="bg-white/80 backdrop-blur-xs p-4 sm:p-5 rounded-3xl border border-slate-200/80 shadow-2xs">
          <GradeSelector
            currentGrade={user.grade}
            onSelectGrade={(g) => {
              setGrade(g);
              // Also reset game if one was open
              setActiveGameId(null);
            }}
          />
        </section>

        {/* VIEW 1: LESSONS & SUBJECTS */}
        {activeTab === 'lessons' && (
          <div className="space-y-6">
            {/* Subject Filters */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-base sm:text-lg text-slate-800 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  <span>{user.grade}-sinf Fanlari</span>
                </h3>
                <span className="text-xs text-slate-500">
                  Jami darslar: {currentGradeLessons.length} ta
                </span>
              </div>

              {/* Subject pill buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                <button
                  onClick={() => { playClickSound(); setSelectedSubjectId('all'); }}
                  className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                    selectedSubjectId === 'all'
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <span>🌟 Barcha fanlar</span>
                  <span className="text-[11px] opacity-80">({currentGradeLessons.length})</span>
                </button>

                {SUBJECTS.map((sub) => {
                  const isSelected = selectedSubjectId === sub.id;
                  const count = currentGradeLessons.filter((l) => l.subjectId === sub.id).length;

                  return (
                    <button
                      key={sub.id}
                      onClick={() => { playClickSound(); setSelectedSubjectId(sub.id); }}
                      className={`px-3.5 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <span>{sub.emoji}</span>
                      <span>{sub.name}</span>
                      <span className="text-[11px] opacity-70">({count})</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lessons Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {displayedLessons.map((lesson) => {
                const isCompleted = user.completedLessons.includes(lesson.id);
                const isQuizPassed = user.completedQuizzes.includes(lesson.id);
                const subject = SUBJECTS.find((s) => s.id === lesson.subjectId);

                return (
                  <div
                    key={lesson.id}
                    onClick={() => {
                      playClickSound();
                      setActiveLesson(lesson);
                    }}
                    className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-slate-200 hover:border-indigo-400 hover:shadow-md transition-all active:scale-[0.99] cursor-pointer flex flex-col justify-between space-y-4 group"
                  >
                    <div className="space-y-3">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-3xl sm:text-4xl group-hover:scale-110 transition-transform">
                            {lesson.emoji}
                          </span>
                          <div>
                            <span className="text-[11px] font-bold text-slate-500 block">
                              {subject?.name}
                            </span>
                            <span className="text-[10px] text-slate-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {lesson.readTime}
                            </span>
                          </div>
                        </div>

                        {isQuizPassed ? (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Topshirilgan</span>
                          </span>
                        ) : isCompleted ? (
                          <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            O'qilgan
                          </span>
                        ) : (
                          <span className="text-[11px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full">
                            Yangi dars
                          </span>
                        )}
                      </div>

                      {/* Title & summary */}
                      <div>
                        <h4 className="font-display font-bold text-base sm:text-lg text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight">
                          {lesson.title}
                        </h4>
                        <p className="text-xs text-slate-600 line-clamp-2 mt-1 leading-relaxed">
                          {lesson.summary}
                        </p>
                      </div>
                    </div>

                    {/* Bottom CTA */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
                        ⭐ 5 ta mini-test savoli
                      </span>
                      <span className="w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white flex items-center justify-center transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW 2: INTERACTIVE GAMES */}
        {activeTab === 'games' && (
          <div className="space-y-6">
            {/* If a game is currently open, render that game container */}
            {activeGameId ? (
              <div>
                {activeGameId === 'math_quiz' && (
                  <MathQuizGame grade={user.grade} onBack={() => setActiveGameId(null)} />
                )}
                {activeGameId === 'memory' && (
                  <MemoryGame grade={user.grade} onBack={() => setActiveGameId(null)} />
                )}
                {activeGameId === 'word_puzzle' && (
                  <WordPuzzleGame grade={user.grade} onBack={() => setActiveGameId(null)} />
                )}
                {activeGameId === 'match_pairs' && (
                  <MatchPairsGame grade={user.grade} onBack={() => setActiveGameId(null)} />
                )}
                {activeGameId === 'english_explorer' && (
                  <EnglishExplorerGame grade={user.grade} onBack={() => setActiveGameId(null)} />
                )}
                {activeGameId === 'drag_drop' && (
                  <DragDropGame grade={user.grade} onBack={() => setActiveGameId(null)} />
                )}
              </div>
            ) : (
              /* All 6 Games Showcase */
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-display font-bold text-xl text-slate-900 flex items-center gap-2">
                      <Gamepad2 className="w-6 h-6 text-amber-500" />
                      <span>{user.grade}-sinf Ta'limiy O'yinlari</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                      Har bir o'yin tanlangan sinf bilim darajasiga avtomatik moslashadi
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {GAMES_INFO.map((game) => (
                    <div
                      key={game.id}
                      onClick={() => {
                        playClickSound();
                        setActiveGameId(game.id);
                      }}
                      className="bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-amber-400 hover:shadow-md transition-all active:scale-[0.99] cursor-pointer flex flex-col justify-between space-y-4 group"
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-4xl sm:text-5xl group-hover:scale-110 transition-transform">
                          {game.emoji}
                        </span>
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                          {game.badge}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-display font-bold text-lg text-slate-900 group-hover:text-amber-600 transition-colors">
                          {game.title}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                          {game.subtitle}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500">
                          {user.grade}-sinf vazifalari
                        </span>
                        <button className="px-3.5 py-1.5 rounded-xl bg-amber-500 text-white font-bold text-xs group-hover:bg-amber-600 transition-colors flex items-center gap-1 cursor-pointer">
                          <span>O'ynash</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 3: BADGES & ACHIEVEMENTS */}
        {activeTab === 'badges' && <BadgesView />}

      </main>

      {/* Encouraging Footer */}
      <footer className="mt-auto border-t border-slate-200/80 bg-white/60 py-6 text-center text-xs text-slate-500 space-y-1.5">
        <div className="flex items-center justify-center gap-2">
          <span>🌟 Zukko Bolalar — Boshlang'ich maktab o'quvchilari uchun ta'limiy portal</span>
        </div>
        <p className="text-[11px] text-slate-400">
          Bolalar uchun qulay, o'yin orqali rag'batlantiruvchi va xavfsiz o'quv muhiti
        </p>
      </footer>

      {/* Modals & Toasts */}
      {activeLesson && (
        <LessonModal lesson={activeLesson} onClose={() => setActiveLesson(null)} />
      )}

      {isProfileOpen && (
        <ProfileModal onClose={() => setIsProfileOpen(false)} />
      )}

      <RewardToast />
    </div>
  );
};

export default function App() {
  return (
    <UserProvider>
      <MainContent />
    </UserProvider>
  );
}
