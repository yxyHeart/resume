import { createContext, useContext, useReducer, useEffect, type Dispatch, type ReactNode } from 'react';
import type { ResumeData, SectionKey } from '../types';
import { resumeReducer, initialResumeData } from './reducer';

type ResumeAction = Parameters<typeof resumeReducer>[1];

const STORAGE_KEY = 'resume-data';

function dedupeIds(data: ResumeData): ResumeData {
  const sections: SectionKey[] = ['education', 'work', 'projects', 'skills'];
  const seen = new Set<string>();
  for (const sec of sections) {
    data[sec] = data[sec].map((item) => {
      if (seen.has(item.id)) {
        const newId = crypto.randomUUID();
        seen.add(newId);
        return { ...item, id: newId };
      }
      seen.add(item.id);
      return item;
    });
  }
  return data;
}

function loadFromStorage(): ResumeData | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return dedupeIds(JSON.parse(raw) as ResumeData);
  } catch { /* ignore */ }
  return null;
}

function saveToStorage(data: ResumeData) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch { /* ignore */ }
}

const ResumeStateContext = createContext<ResumeData>(initialResumeData);
const ResumeDispatchContext = createContext<Dispatch<ResumeAction>>(() => {});

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(resumeReducer, undefined, () => {
    return loadFromStorage() ?? initialResumeData;
  });

  useEffect(() => {
    saveToStorage(state);
  }, [state]);

  return (
    <ResumeStateContext.Provider value={state}>
      <ResumeDispatchContext.Provider value={dispatch}>
        {children}
      </ResumeDispatchContext.Provider>
    </ResumeStateContext.Provider>
  );
}

export function useResumeState() {
  return useContext(ResumeStateContext);
}

export function useResumeDispatch() {
  return useContext(ResumeDispatchContext);
}
