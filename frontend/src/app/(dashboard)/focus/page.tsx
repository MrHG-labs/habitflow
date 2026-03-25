'use client';

import { usePomodoroStore } from '@/stores/pomodoroStore';
import { useI18nStore } from '@/stores/i18nStore';
import { useState } from 'react';

export default function FocusPage() {
  const { t } = useI18nStore();
  const { 
    timeLeft, 
    isRunning, 
    mode, 
    startTimer, 
    pauseTimer, 
    resetTimer, 
    updateConfig,
    focusDuration,
    breakDuration
  } = usePomodoroStore();

  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [fMin, setFMin] = useState(focusDuration / 60);
  const [bMin, setBMin] = useState(breakDuration / 60);

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  // Calculate percentage for circular progress
  const total = mode === 'focus' ? focusDuration : breakDuration;
  const percentage = (timeLeft / total) * 100;
  
  // Minimal CSS trick for circular progress without heavy SVG
  const conicGradient = `conic-gradient(${mode === 'focus' ? 'var(--accent)' : 'var(--app-primary)'} ${percentage}%, var(--border) ${percentage}%)`;

  const handleSaveConfig = () => {
    updateConfig(fMin, bMin);
    setIsConfigOpen(false);
  };

  const handleRequestNotifications = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
         alert("Notificaciones activadas con éxito");
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10 flex flex-col items-center">
      <header className="w-full">
        <h1 className="text-3xl font-extrabold text-app-primary tracking-tight">
          {t('focus.title')}
        </h1>
        <p className="text-app-secondary mt-1">{t('focus.subtitle')}</p>
      </header>

      {/* Main Focus Control */}
      <div 
        className="card w-full max-w-md p-8 rounded-[2rem] shadow-lg flex flex-col items-center justify-center transition-all"
        style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
      >
        <div className="mb-6 flex gap-4 w-full">
           <div className={`flex-1 text-center py-2 rounded-xl font-bold transition-all ${mode === 'focus' ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300' : 'text-app-secondary'}`}>{t('focus.work')}</div>
           <div className={`flex-1 text-center py-2 rounded-xl font-bold transition-all ${mode === 'break' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'text-app-secondary'}`}>{t('focus.break')}</div>
        </div>

        {/* Circular Timer Ring */}
        <div 
          className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full flex items-center justify-center shadow-inner"
          style={{ background: conicGradient, transition: 'background 1s linear' }}
        >
           {/* Inner circle mask */}
           <div 
             className="absolute w-[92%] h-[92%] rounded-full flex flex-col items-center justify-center"
             style={{ backgroundColor: 'var(--bg-card)' }}
           >
              <span className="text-6xl sm:text-7xl font-black tabular-nums tracking-tight text-app-primary z-10" style={{ fontVariantNumeric: 'tabular-nums' }}>
                 {minutes}:{seconds}
              </span>
           </div>
        </div>

        <div className="mt-10 flex items-center gap-4 w-full justify-center">
           {!isRunning ? (
             <button 
               onClick={startTimer}
               className="flex-1 py-4 bg-app-primary text-white rounded-2xl font-bold text-lg hover:opacity-90 active:scale-95 transition-all shadow-md"
               style={{ backgroundColor: 'var(--accent)' }}
             >
               {t('focus.start')}
             </button>
           ) : (
             <button 
               onClick={pauseTimer}
               className="flex-1 py-4 bg-amber-500 text-white rounded-2xl font-bold text-lg hover:bg-amber-600 active:scale-95 transition-all shadow-md"
             >
               {t('focus.pause')}
             </button>
           )}
           <button 
             onClick={resetTimer}
             className="flex-none p-4 rounded-2xl font-bold hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 transition-all border"
             style={{ borderColor: 'var(--border)', color: 'var(--app-secondary)' }}
             title="Reiniciar"
           >
             🔄
           </button>
        </div>
      </div>

      <button className="text-sm underline text-app-secondary hover:text-app-primary mt-4" onClick={() => setIsConfigOpen(!isConfigOpen)}>
        {t('focus.config')}
      </button>

      {/* Config Panel */}
      {isConfigOpen && (
        <div className="card w-full max-w-md p-6 rounded-2xl shadow-sm animate-slide-up" style={{ backgroundColor: 'var(--bg-app)', border: '1px solid var(--border)' }}>
          <h3 className="font-bold text-app-primary mb-4">{t('focus.settings')}</h3>
          <div className="flex justify-center gap-6 mt-2">
             <div className="flex flex-col items-center">
               <label className="text-[10px] uppercase tracking-wider font-bold text-app-muted mb-2">{t('focus.workMin')}</label>
               <input 
                type="number" 
                min={1} 
                max={99}
                value={fMin} 
                onChange={e => setFMin(Number(e.target.value))} 
                className="w-20 p-3 text-center border-2 rounded-2xl bg-white dark:bg-slate-800 text-app-primary font-bold focus:outline-none focus:border-accent transition-all shadow-sm" 
                style={{ borderColor: 'var(--border)' }} 
               />
             </div>
             <div className="flex flex-col items-center">
               <label className="text-[10px] uppercase tracking-wider font-bold text-app-muted mb-2">{t('focus.breakMin')}</label>
               <input 
                type="number" 
                min={1} 
                max={60}
                value={bMin} 
                onChange={e => setBMin(Number(e.target.value))} 
                className="w-20 p-3 text-center border-2 rounded-2xl bg-white dark:bg-slate-800 text-app-primary font-bold focus:outline-none focus:border-accent transition-all shadow-sm" 
                style={{ borderColor: 'var(--border)' }} 
               />
             </div>
          </div>
          <button 
            onClick={handleSaveConfig}
            className="w-full mt-4 py-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 font-bold rounded-lg hover:opacity-80 transition-all"
          >
            {t('focus.save')}
          </button>

          <button onClick={handleRequestNotifications} className="w-full mt-2 py-2 border rounded-lg text-sm text-app-secondary hover:bg-black/5 dark:hover:bg-white/5" style={{ borderColor: 'var(--border)' }}>
            {t('focus.notifications')}
          </button>
        </div>
      )}
    </div>
  );
}
