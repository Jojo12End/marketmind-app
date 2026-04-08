import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserState {
  username: string;
  xp: number;
  level: number;
  streak: number;
  lastActiveDate: string;
  completedLessons: string[];
  masteredTopics: string[];
  totalAnswers: number;
  correctAnswers: number;

  addXp: (amount: number) => void;
  recordAnswer: (correct: boolean) => void;
  completeLesson: (lessonId: string, title?: string) => void;
  updateStreak: () => void;
}

export const useStore = create<UserState>()(
  persist(
    (set, get) => ({
      username: 'Player',
      xp: 0,
      level: 1,
      streak: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      completedLessons: [],
      masteredTopics: [],
      totalAnswers: 0,
      correctAnswers: 0,

      addXp: (amount) => set((state) => {
        const newXp = state.xp + amount;
        const newLevel = Math.floor(newXp / 100) + 1;
        return { xp: newXp, level: newLevel };
      }),
      
      recordAnswer: (correct) => set((state) => ({
        totalAnswers: state.totalAnswers + 1,
        correctAnswers: state.correctAnswers + (correct ? 1 : 0)
      })),

      completeLesson: (lessonId, title) => set((state) => {
        const newCompleted = [...new Set([...state.completedLessons, lessonId])];
        const newMastered = title ? [...new Set([...state.masteredTopics, title])] : state.masteredTopics;
        return { completedLessons: newCompleted, masteredTopics: newMastered };
      }),

      updateStreak: () => set((state) => {
        const today = new Date().toISOString().split('T')[0];
        if (state.lastActiveDate === today) return state; // Already active today

        const lastActive = new Date(state.lastActiveDate);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        const isConsecutive = lastActive.toISOString().split('T')[0] === yesterday.toISOString().split('T')[0];
        
        return {
          streak: isConsecutive ? state.streak + 1 : 1,
          lastActiveDate: today
        };
      }),
    }),
    {
      name: 'marketmind-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
