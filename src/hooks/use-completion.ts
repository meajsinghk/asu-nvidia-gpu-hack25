import { useState, useEffect, useCallback } from 'react';

const COMPLETION_STORAGE_KEY = 'gpuModuleCompletion';

type UseCompletionReturn = {
  completedModules: Set<string>;
  isCompleted: (moduleId: string) => boolean;
  markAsCompleted: (moduleId: string) => void;
  resetCompletion: () => void;
};

export function useCompletion(): UseCompletionReturn {
  const [completedModules, setCompletedModules] = useState<Set<string>>(new Set());

  useEffect(() => {
    // This effect runs only on the client, where localStorage is available.
    try {
      const storedCompletions = localStorage.getItem(COMPLETION_STORAGE_KEY);
      if (storedCompletions) {
        setCompletedModules(new Set(JSON.parse(storedCompletions)));
      }
    } catch (error) {
      console.error("Failed to load completion progress from localStorage", error);
    }
  }, []);

  const updateLocalStorage = (newCompletions: Set<string>) => {
    try {
        localStorage.setItem(COMPLETION_STORAGE_KEY, JSON.stringify(Array.from(newCompletions)));
    } catch (error) {
        console.error("Failed to save completion progress to localStorage", error);
    }
  };

  const markAsCompleted = useCallback((moduleId: string) => {
    setCompletedModules(prev => {
      const newSet = new Set(prev);
      newSet.add(moduleId);
      updateLocalStorage(newSet);
      return newSet;
    });
  }, []);

  const isCompleted = useCallback((moduleId: string) => {
    return completedModules.has(moduleId);
  }, [completedModules]);

  const resetCompletion = useCallback(() => {
    const newSet = new Set<string>();
    setCompletedModules(newSet);
    updateLocalStorage(newSet);
  }, []);

  return { completedModules, isCompleted, markAsCompleted, resetCompletion };
}
