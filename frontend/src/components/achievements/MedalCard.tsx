'use client';

import { Achievement } from '@/types/achievement';
import { useI18nStore } from '@/stores/i18nStore';

interface MedalCardProps {
  achievement: Achievement;
  index: number;
}

const MEDAL_STYLES: Record<string, { 
    icon: string; 
    color: string; 
    gradient: string; 
    shadow: string; 
    border: string;
    descriptionKey: string;
}> = {
  Flame: { 
    icon: '🔥', 
    color: '#f97316', 
    gradient: 'from-orange-400 to-red-500', 
    shadow: 'shadow-orange-500/20', 
    border: 'border-orange-200',
    descriptionKey: 'achievements.milestoneFlame'
  },
  Bronze: { 
    icon: '🥉', 
    color: '#d97706', 
    gradient: 'from-amber-600 to-amber-900', 
    shadow: 'shadow-amber-900/20', 
    border: 'border-amber-200',
    descriptionKey: 'achievements.milestoneBronze'
  },
  Silver: { 
    icon: '🥈', 
    color: '#94a3b8', 
    gradient: 'from-slate-300 to-slate-500', 
    shadow: 'shadow-slate-400/20', 
    border: 'border-slate-200',
    descriptionKey: 'achievements.milestoneSilver'
  },
  Gold: { 
    icon: '🥇', 
    color: '#eab308', 
    gradient: 'from-yellow-300 to-yellow-600', 
    shadow: 'shadow-yellow-500/20', 
    border: 'border-yellow-200',
    descriptionKey: 'achievements.milestoneGold'
  },
  Diamond: { 
    icon: '💎', 
    color: '#06b6d4', 
    gradient: 'from-cyan-300 to-blue-500', 
    shadow: 'shadow-cyan-400/20', 
    border: 'border-cyan-200',
    descriptionKey: 'achievements.milestoneDiamond'
  },
};

export default function MedalCard({ achievement, index }: MedalCardProps) {
  const { t } = useI18nStore();
  const style = MEDAL_STYLES[achievement.medal_type] ?? MEDAL_STYLES.Bronze;
  
  const grantedDate = new Date(achievement.granted_at).toLocaleDateString();

  return (
    <div 
      className={`relative group card p-6 flex flex-col items-center text-center gap-4 transition-all duration-300 hover:scale-[1.03] hover:shadow-xl ${style.shadow} animate-fade-in-up`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Glow effect */}
      <div className={`absolute -inset-0.5 bg-gradient-to-r ${style.gradient} rounded-3xl blur opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
      
      {/* Icon Container */}
      <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${style.gradient} flex items-center justify-center text-4xl shadow-inner relative z-10`}>
        <span className="drop-shadow-md select-none">{style.icon}</span>
        {/* Shine effect */}
        <div className="absolute inset-0 rounded-full opacity-30 group-hover:animate-pulse" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.4) 0%, transparent 50%, rgba(0,0,0,0.1) 100%)' }} />
      </div>

      <div className="relative z-10 space-y-1">
        <h3 className="font-bold text-lg text-app-primary">
          {achievement.habit_name_snapshot}
        </h3>
        <p className="text-sm font-semibold" style={{ color: style.color }}>
          {t(style.descriptionKey as any, { days: achievement.milestone_days })}
        </p>
        <div className="pt-2 flex flex-col items-center gap-2">
            <span className="text-[10px] uppercase tracking-widest text-app-muted font-bold">
                {achievement.medal_type} Tier
            </span>
            <span className="text-[9px] text-app-muted opacity-60">
                Obtenido: {grantedDate}
            </span>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-2 right-2 text-xl opacity-10 flex items-center gap-1 grayscale group-hover:grayscale-0 transition-all duration-500">
          {achievement.habit_icon_snapshot}
      </div>
    </div>
  );
}
