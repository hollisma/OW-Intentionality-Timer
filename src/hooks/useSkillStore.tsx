import { createContext, useContext, type ReactNode } from 'react';
import { useSkills } from './useSkills';
import { LocalStorageSkillStorage } from '../storage/LocalStorageSkillStorage';
import { INITIAL_SKILLS } from '../data/initialSkills';

const storage = new LocalStorageSkillStorage();

type SkillStoreValue = ReturnType<typeof useSkills>;

const SkillStoreContext = createContext<SkillStoreValue | undefined>(undefined);

export const SkillStoreProvider = ({ children }: { children: ReactNode }) => {
  const value = useSkills(storage, INITIAL_SKILLS);
  return (
    <SkillStoreContext.Provider value={value}>
      {children}
    </SkillStoreContext.Provider>
  );
};

export const useSkillStore = (): SkillStoreValue => {
  const ctx = useContext(SkillStoreContext);
  if (!ctx) {
    throw new Error('useSkillStore must be used within a SkillStoreProvider');
  }
  return ctx;
};

