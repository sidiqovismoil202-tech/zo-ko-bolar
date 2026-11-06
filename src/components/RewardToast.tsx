import React, { useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { Sparkles } from 'lucide-react';

export const RewardToast: React.FC = () => {
  const { recentReward, clearReward } = useUser();

  useEffect(() => {
    if (recentReward) {
      const timer = setTimeout(() => {
        clearReward();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [recentReward, clearReward]);

  if (!recentReward) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-pop">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 border border-amber-300">
        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
          ⭐
        </div>
        <div>
          <span className="font-extrabold text-sm sm:text-base leading-tight block">
            +{recentReward.stars} Yulduzcha!
          </span>
          <span className="text-xs text-amber-100 font-medium leading-tight">
            {recentReward.text}
          </span>
        </div>
      </div>
    </div>
  );
};
