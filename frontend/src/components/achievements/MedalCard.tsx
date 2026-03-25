'use client';

import { Achievement } from '@/types/achievement';
import { useI18nStore } from '@/stores/i18nStore';
import EvolutiveMedal from './EvolutiveMedal';

interface MedalCardProps {
  achievement: Achievement;
  index: number;
}

const MEDAL_STYLES: Record<string, { 
    color: string; 
    gradient: string; 
    shadow: string; 
    border: string;
    descriptionKey: string;
}> = {
  Bronze: { 
    color: '#b57a58', 
    gradient: 'from-[#b57a58] to-[#8c533c]', 
    shadow: 'shadow-[#b57a58]/10', 
    border: 'border-[#b57a58]/20',
    descriptionKey: 'achievements.milestoneBronze'
  },
  Silver: { 
    color: '#94a3b8', 
    gradient: 'from-slate-300 to-slate-500', 
    shadow: 'shadow-slate-400/10', 
    border: 'border-slate-200',
    descriptionKey: 'achievements.milestoneSilver'
  },
  Gold: { 
    color: '#eab308', 
    gradient: 'from-yellow-300 to-yellow-600', 
    shadow: 'shadow-yellow-500/10', 
    border: 'border-yellow-200',
    descriptionKey: 'achievements.milestoneGold'
  },
  Platinum: { 
    color: '#475569', 
    gradient: 'from-slate-400 to-slate-700', 
    shadow: 'shadow-slate-600/10', 
    border: 'border-slate-300',
    descriptionKey: 'achievements.milestonePlatinum'
  },
  Diamond: { 
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
      
      {/* Evolutive Medal Container */}
      <div className="relative z-10">
        <EvolutiveMedal tier={achievement.medal_type as any} size={100} />
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
