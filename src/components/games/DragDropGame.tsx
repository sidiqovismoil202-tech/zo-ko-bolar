import React, { useState, useEffect } from 'react';
import { Grade } from '../../types';
import { useUser } from '../../context/UserContext';
import { DRAG_DROP_BY_GRADE } from '../../data/gamesData';
import { playClickSound, playSuccessSound, playErrorSound, playFanfareSound } from '../../services/soundEffects';
import confetti from 'canvas-confetti';
import { RotateCcw, CheckCircle2, Inbox } from 'lucide-react';

interface DragDropGameProps {
  grade: Grade;
  onBack: () => void;
}

interface ItemState {
  id: string;
  name: string;
  emoji: string;
  categoryId: string;
  placedCategoryId: string | null;
}

export const DragDropGame: React.FC<DragDropGameProps> = ({ grade, onBack }) => {
  const { addStars, incrementGamesCount } = useUser();
  const config = DRAG_DROP_BY_GRADE[grade];

  const [items, setItems] = useState<ItemState[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [isWon, setIsWon] = useState(false);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const initGame = () => {
    const initialItems = config.items.map((i) => ({
      ...i,
      placedCategoryId: null,
    })).sort(() => Math.random() - 0.5);

    setItems(initialItems);
    setSelectedItemId(null);
    setDraggedItemId(null);
    setIsWon(false);
  };

  useEffect(() => {
    initGame();
  }, [grade]);

  // Handle placing an item into a category basket
  const handlePlaceItem = (itemId: string, targetCatId: string) => {
    const item = items.find((i) => i.id === itemId);
    if (!item || item.placedCategoryId) return;

    if (item.categoryId === targetCatId) {
      // Correct!
      playSuccessSound();
      const updated = items.map((i) =>
        i.id === itemId ? { ...i, placedCategoryId: targetCatId } : i
      );
      setItems(updated);
      setSelectedItemId(null);
      setDraggedItemId(null);

      // Check win condition
      const allDone = updated.every((i) => i.placedCategoryId !== null);
      if (allDone) {
        setIsWon(true);
        incrementGamesCount();
        addStars(25, 'Barcha elementlarni to\'g\'ri saraladingiz! +25 ⭐');
        playFanfareSound();
        try {
          confetti({
            particleCount: 85,
            spread: 70,
            origin: { y: 0.5 },
          });
        } catch {
          // ignore
        }
      }
    } else {
      // Wrong placement
      playErrorSound();
      setSelectedItemId(null);
      setDraggedItemId(null);
    }
  };

  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggedItemId(id);
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, catId: string) => {
    e.preventDefault();
    const id = e.dataTransfer.getData('text/plain') || draggedItemId;
    if (id) {
      handlePlaceItem(id, catId);
    }
  };

  const unplacedItems = items.filter((i) => !i.placedCategoryId);

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm max-w-2xl mx-auto space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { playClickSound(); onBack(); }}
          className="text-xs sm:text-sm font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
        >
          ← O'yinlarga qaytish
        </button>

        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-cyan-50 text-cyan-800 border border-cyan-200">
          {grade}-sinf • Saralash
        </span>
      </div>

      {/* Instruction */}
      <div className="bg-cyan-50/70 border border-cyan-200 rounded-2xl p-3.5 text-center space-y-1">
        <h3 className="font-display font-bold text-base text-cyan-950">
          {config.title}
        </h3>
        <p className="text-xs sm:text-sm text-cyan-900">
          {config.instruction}
        </p>
        <span className="text-[11px] text-cyan-700 font-semibold block">
          (Telefonlarda: avval buyumni bosing, so'ngra mos savatchani bosing)
        </span>
      </div>

      {/* Unplaced Items Pool */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500">
          <span>Joylashtiriladigan buyumlar:</span>
          <span>Qoldi: {unplacedItems.length} ta</span>
        </div>

        {unplacedItems.length > 0 ? (
          <div className="flex flex-wrap items-center justify-center gap-2 p-3 bg-slate-50 border border-slate-200 rounded-2xl min-h-[76px]">
            {unplacedItems.map((item) => {
              const isSelected = selectedItemId === item.id;
              return (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onClick={() => {
                    playClickSound();
                    setSelectedItemId(isSelected ? null : item.id);
                  }}
                  className={`px-3.5 py-2 rounded-2xl border-2 flex items-center gap-2 text-xs sm:text-sm font-bold cursor-grab active:cursor-grabbing transition-all active:scale-95 shadow-2xs select-none ${
                    isSelected
                      ? 'bg-amber-100 border-amber-500 text-amber-950 ring-2 ring-amber-300 scale-105'
                      : 'bg-white border-slate-300 hover:border-cyan-400 text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xl">{item.emoji}</span>
                  <span>{item.name}</span>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-center text-xs sm:text-sm text-emerald-800 font-bold flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Barcha buyumlar o'z o'rniga joylashtirildi!</span>
          </div>
        )}
      </div>

      {/* Category Baskets */}
      <div className={`grid gap-3 pt-2 ${
        config.categories.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-1 sm:grid-cols-2'
      }`}>
        {config.categories.map((cat) => {
          const placedInCat = items.filter((i) => i.placedCategoryId === cat.id);
          const isTarget = selectedItemId !== null;

          return (
            <div
              key={cat.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, cat.id)}
              onClick={() => {
                if (selectedItemId) {
                  handlePlaceItem(selectedItemId, cat.id);
                }
              }}
              className={`rounded-2xl border-2 p-3.5 transition-all flex flex-col justify-between min-h-[140px] ${cat.color} ${
                isTarget ? 'border-dashed ring-2 ring-cyan-300 cursor-pointer hover:brightness-95' : ''
              }`}
            >
              {/* Category Header */}
              <div className="flex items-center justify-between pb-2 border-b border-black/10">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{cat.emoji}</span>
                  <span className="font-display font-bold text-xs sm:text-sm">
                    {cat.name}
                  </span>
                </div>
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-white/70">
                  {placedInCat.length}
                </span>
              </div>

              {/* Items in this basket */}
              <div className="flex flex-wrap gap-1.5 py-2 flex-1 items-start content-start">
                {placedInCat.map((item) => (
                  <span
                    key={item.id}
                    className="inline-flex items-center gap-1 bg-white/90 border border-black/10 px-2.5 py-1 rounded-xl text-xs font-bold text-slate-800 shadow-2xs animate-pop"
                  >
                    <span>{item.emoji}</span>
                    <span>{item.name}</span>
                  </span>
                ))}

                {placedInCat.length === 0 && (
                  <span className="text-xs opacity-60 italic self-center mx-auto py-2">
                    Savatcha bo'sh...
                  </span>
                )}
              </div>

              {selectedItemId && (
                <div className="text-center text-[11px] font-bold py-1 bg-white/60 rounded-lg">
                  Joylashtirish uchun bosing 👆
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Won Card */}
      {isWon && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-5 text-center space-y-3 animate-pop">
          <div className="text-4xl">🌟 🏆</div>
          <h3 className="font-display font-bold text-xl text-emerald-950">
            Mukammal! Barcha narsalar to'g'ri saralandi!
          </h3>
          <p className="text-xs sm:text-sm text-emerald-900">
            Siz har bir buyumni o'z savatiga adashmasdan joylashtirdingiz.
          </p>
          <div className="inline-flex items-center gap-1.5 bg-white border border-emerald-300 px-4 py-1.5 rounded-full text-emerald-900 font-bold text-sm">
            ⭐ +25 Yulduzcha olindi!
          </div>

          <div className="pt-2 flex justify-center gap-2">
            <button
              onClick={initGame}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer"
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
