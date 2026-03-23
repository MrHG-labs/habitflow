'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { translations, Language } from '@/i18n/translations';

interface I18nState {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (path: string, params?: Record<string, string | number>) => string;
}

/**
 * Store to manage application language (i18n).
 * Provides a simple t() function to retrieve translations by dot-notation path.
 */
export const useI18nStore = create<I18nState>()(
  persist(
    (set, get) => ({
      language: 'es', // Default to Spanish as requested
      setLanguage: (language) => set({ language }),
      t: (path, params) => {
        const lang = get().language;
        const keys = path.split('.');
        
        let result: any = translations[lang];
        for (const key of keys) {
          if (result && result[key]) {
            result = result[key];
          } else {
            // Fallback to English if not found in current language
            let fallbackResult: any = translations['en'];
            for (const fKey of keys) {
              if (fallbackResult && fallbackResult[fKey]) {
                fallbackResult = fallbackResult[fKey];
              } else {
                return path; // Return path as debugging hint
              }
            }
            result = fallbackResult;
            break;
          }
        }

        if (typeof result !== 'string') return path;

        // Replace parameters like {name}
        if (params) {
          Object.entries(params).forEach(([key, value]) => {
            result = result.replace(`{${key}}`, String(value));
          });
        }

        return result;
      },
    }),
    {
      name: 'habitflow-i18n',
    }
  )
);
