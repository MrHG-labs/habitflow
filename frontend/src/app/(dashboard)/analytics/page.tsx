'use client';

import { useMemo } from 'react';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useI18nStore } from '@/stores/i18nStore';
import {
  PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis
} from 'recharts';

const CATEGORY_COLORS: Record<string, string> = {
  health: '#22c55e',
  work: '#3b82f6',
  personal: '#8b5cf6',
  other: '#f97316',
};

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalytics();
  const { t, language } = useI18nStore();

  // 1. Process category data with colors and translations
  const categoryData = useMemo(() => {
    if (!data?.categories) return [];
    return data.categories.map((c) => ({
      name: t(`categories.${c.category}`),
      value: c.value,
      color: CATEGORY_COLORS[c.category] || '#6b7280',
    }));
  }, [data, t, language]);

  // 2. Process days of week data
  const dowData = useMemo(() => {
    if (!data?.days_of_week) return [];
    return data.days_of_week.map((d) => ({
      name: t(`analytics.days.${d.day}`),
      count: d.count,
    }));
  }, [data, t, language]);

  // 3. Process heatmap data
  // Build a fast UI grid dynamically
  const heatmapGrid = useMemo(() => {
    if (!data?.heatmap) return { grid: [], maxCount: 0 };
    const countsMap = new Map<string, number>();
    let max = 0;

    data.heatmap.forEach(h => {
      countsMap.set(h.date, h.count);
      if (h.count > max) max = h.count;
    });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const weeks = [];
    const DAYS_TOTAL = 364; // ~52 weeks
    let currentDay = new Date(today);
    currentDay.setDate(today.getDate() - DAYS_TOTAL);

    // Adjust to start on a Monday
    const currentDayOfWeek = currentDay.getDay() || 7;
    currentDay.setDate(currentDay.getDate() - (currentDayOfWeek - 1));

    let currentWeek: { date: Date; dateStr: string; count: number }[] = [];

    // We recreate the grid until today
    while (currentDay <= today) {
      if (currentDay.getDay() === 1 && currentWeek.length > 0) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
      const yyyy = currentDay.getFullYear();
      const mm = String(currentDay.getMonth() + 1).padStart(2, '0');
      const dd = String(currentDay.getDate()).padStart(2, '0');
      const ds = `${yyyy}-${mm}-${dd}`;

      currentWeek.push({
        date: new Date(currentDay),
        dateStr: ds,
        count: countsMap.get(ds) || 0
      });

      currentDay.setDate(currentDay.getDate() + 1);
    }
    if (currentWeek.length > 0) weeks.push(currentWeek);

    return { grid: weeks, maxCount: max || 1 };
  }, [data]);


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Helper to color the heatmap grid cell
  const getHeatmapColor = (count: number, maxCount: number) => {
    if (count === 0) return 'var(--bg-card)';
    // Interpolate opacity/lightness between 0.3 and 1 for the base green #22c55e
    const ratio = Math.max(0.3, count / maxCount);
    return `rgba(34, 197, 94, ${ratio})`;
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <header>
        <h1 className="text-3xl font-extrabold text-app-primary tracking-tight">
          {t('analytics.title')}
        </h1>
        <p className="text-app-secondary mt-1">{t('analytics.subtitle')}</p>
      </header>

      {/* Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* 1. Heatmap (Spans full width on large screens) */}
        <div
          className="card p-6 rounded-2xl shadow-sm lg:col-span-2 overflow-hidden overflow-x-auto"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <h2 className="text-lg font-bold text-app-primary mb-4">{t('analytics.heatmap')}</h2>

          {heatmapGrid.maxCount === 0 && data?.heatmap.length === 0 ? (
            <p className="text-app-muted text-sm italic py-4">{t('analytics.heatmapEmpty')}</p>
          ) : (
            <div className="min-w-max sm:min-w-0 w-full">
              <div className="grid grid-cols-[repeat(20,minmax(0,1fr))] sm:flex sm:flex-row sm:flex-nowrap gap-[3px] sm:gap-[3px] w-full">
                {heatmapGrid.grid.map((week, i) => (
                  <div key={i} className="contents sm:flex sm:flex-col sm:gap-[3px]">
                    {/* Fill empty slots at start of week if it's the first trailing week */}
                    {week.length < 7 && i === 0 && Array.from({ length: 7 - week.length }).map((_, ei) => (
                      <div key={`e-${ei}`} className="w-full aspect-square sm:aspect-auto sm:w-3 sm:h-3 rounded-[2px] opacity-0" />
                    ))}

                    {week.map((day) => (
                      <div
                        key={day.dateStr}
                        className="w-full aspect-square sm:aspect-auto sm:w-3 sm:h-3 flex-shrink-0 rounded-[2px] transition-transform hover:scale-125 hover:z-10"
                        title={`${day.dateStr}: ${day.count} hábitos`}
                        style={{
                          backgroundColor: getHeatmapColor(day.count, heatmapGrid.maxCount),
                          border: day.count === 0 ? '1px solid var(--border)' : 'none',
                        }}
                      />
                    ))}

                    {/* Fill empty slots at end of week if it's the last trailing week */}
                    {week.length < 7 && i === heatmapGrid.grid.length - 1 && Array.from({ length: 7 - week.length }).map((_, ei) => (
                      <div key={`d-${ei}`} className="w-full aspect-square sm:aspect-auto sm:w-3 sm:h-3 rounded-[2px] opacity-0" />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 2. Category Pie Chart */}
        <div
          className="card p-6 rounded-2xl shadow-sm flex flex-col items-center"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <h2 className="text-lg font-bold text-app-primary mb-2 self-start">{t('analytics.categories')}</h2>

          <div className="w-full h-64 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                  itemStyle={{ fontWeight: 600 }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap gap-4 justify-center mt-4">
            {categoryData.map((c) => (
              <div key={c.name} className="flex items-center gap-2 text-sm text-app-secondary">
                <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: c.color }} />
                {c.name}
              </div>
            ))}
          </div>
        </div>

        {/* 3. Days of the week Bar Chart */}
        <div
          className="card p-6 rounded-2xl shadow-sm flex flex-col"
          style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)' }}
        >
          <h2 className="text-lg font-bold text-app-primary mb-4">{t('analytics.daysOfWeek')}</h2>

          <div className="w-full h-64 mt-4 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dowData}>
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12, fill: 'var(--text-muted)' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val: string) => val.substring(0, 3)} // e.g. "Mon"
                />
                <YAxis hide />
                <RechartsTooltip
                  cursor={{ fill: 'var(--bg-app)', opacity: 0.5 }}
                  contentStyle={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                />
                <Bar
                  dataKey="count"
                  fill="var(--accent)"
                  radius={[6, 6, 6, 6]}
                  name="Hábitos"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
