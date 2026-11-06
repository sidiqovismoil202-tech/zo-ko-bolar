import React, { createContext, useContext, useState, useEffect } from 'react';
import { Grade, UserProfile } from '../types';
import { BADGES } from '../data/gamesData';
import { playFanfareSound, playSuccessSound } from '../services/soundEffects';
import confetti from 'canvas-confetti';

interface UserContextType {
  user: UserProfile;
  setGrade: (grade: Grade) => void;
  updateProfile: (name: string, avatar: string) => void;
  addStars: (amount: number, reason?: string) => void;
  completeLesson: (lessonId: string) => void;
  completeQuiz: (lessonId: string, score: number) => void;
  incrementGamesCount: () => void;
  resetProgress: () => void;
  recentReward: { text: string; stars: number } | null;
  clearReward: () => void;
}

const STORAGE_KEY = 'zukko_bolalar_user_profile_v1';

const defaultProfile: UserProfile = {
  name: 'Bilimdon',
  avatar: '🦉',
  grade: 1,
  stars: 20, // initial welcome stars!
  completedLessons: [],
  completedQuizzes: [],
  unlockedBadges: [],
  gamesPlayed: 0,
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    if (typeof window === 'undefined') return defaultProfile;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...defaultProfile, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return defaultProfile;
  });

  const [recentReward, setRecentReward] = useState<{ text: string; stars: number } | null>(null);

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  // Check badges when stars change
  useEffect(() => {
    BADGES.forEach((b) => {
      if (user.stars >= b.requiredStars && !user.unlockedBadges.includes(b.id)) {
        setUser((prev) => ({
          ...prev,
          unlockedBadges: [...prev.unlockedBadges, b.id],
        }));
        playFanfareSound();
        try {
          confetti({
            particleCount: 70,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {
          // ignore
        }
      }
    });
  }, [user.stars, user.unlockedBadges]);

  const setGrade = (grade: Grade) => {
    setUser((prev) => ({ ...prev, grade }));
  };

  const updateProfile = (name: string, avatar: string) => {
    setUser((prev) => ({ ...prev, name: name.trim() || 'Bilimdon', avatar }));
  };

  const addStars = (amount: number, reason: string = 'Barakalla!') => {
    setUser((prev) => ({
      ...prev,
      stars: prev.stars + amount,
    }));
    setRecentReward({ text: reason, stars: amount });
    playSuccessSound();
  };

  const clearReward = () => setRecentReward(null);

  const completeLesson = (lessonId: string) => {
    if (!user.completedLessons.includes(lessonId)) {
      setUser((prev) => ({
        ...prev,
        completedLessons: [...prev.completedLessons, lessonId],
        stars: prev.stars + 10,
      }));
      setRecentReward({ text: 'Darsni o\'qidingiz! 🎉', stars: 10 });
      playSuccessSound();
    }
  };

  const completeQuiz = (lessonId: string, score: number) => {
    const isNew = !user.completedQuizzes.includes(lessonId);
    const starReward = score * 5; // 5 stars per correct answer

    setUser((prev) => ({
      ...prev,
      completedQuizzes: isNew ? [...prev.completedQuizzes, lessonId] : prev.completedQuizzes,
      stars: prev.stars + starReward,
    }));

    setRecentReward({
      text: score >= 4 ? 'Ajoyib natija! 🌟' : 'Test yakunlandi! 👏',
      stars: starReward,
    });

    if (score >= 4) {
      playFanfareSound();
    } else {
      playSuccessSound();
    }
  };

  const incrementGamesCount = () => {
    setUser((prev) => ({
      ...prev,
      gamesPlayed: prev.gamesPlayed + 1,
    }));
  };

  const resetProgress = () => {
    setUser({ ...defaultProfile });
    localStorage.removeItem(STORAGE_KEY);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setGrade,
        updateProfile,
        addStars,
        completeLesson,
        completeQuiz,
        incrementGamesCount,
        resetProgress,
        recentReward,
        clearReward,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
