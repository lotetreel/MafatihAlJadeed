import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface CompletionContextType {
  completedItems: Set<string>;
  toggleComplete: (id: string) => void;
  isCompleted: (id: string) => boolean;
  clearAll: () => void;
  getCompletionStats: () => { total: number; completed: number; percentage: number };
}

const CompletionContext = createContext<CompletionContextType | undefined>(undefined);

export function CompletionProvider({ children }: { children: ReactNode }) {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  const toggleComplete = useCallback((id: string) => {
    setCompletedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const isCompleted = useCallback((id: string) => {
    return completedItems.has(id);
  }, [completedItems]);

  const clearAll = useCallback(() => {
    setCompletedItems(new Set());
  }, []);

  const getCompletionStats = useCallback(() => {
    const completed = completedItems.size;
    // Total duas + aamal (6 + 6 = 12)
    const total = 12;
    const percentage = Math.round((completed / total) * 100);
    return { total, completed, percentage };
  }, [completedItems]);

  return (
    <CompletionContext.Provider
      value={{
        completedItems,
        toggleComplete,
        isCompleted,
        clearAll,
        getCompletionStats,
      }}
    >
      {children}
    </CompletionContext.Provider>
  );
}

export function useCompletion() {
  const context = useContext(CompletionContext);
  if (context === undefined) {
    throw new Error('useCompletion must be used within a CompletionProvider');
  }
  return context;
}
