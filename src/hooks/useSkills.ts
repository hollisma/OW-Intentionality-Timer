import { useState, useEffect } from 'react';
import { type Skill } from '../types/Skill';
import { type SkillStorage } from '../storage/SkillStorage';
import { createSkillWithDefaults } from '../logic/skillDefaults';

export const useSkills = (storage: SkillStorage, initialData: Skill[]) => {
  const [skills, setSkills] = useState<Skill[]>(initialData);
  const [activeSkill, setActiveSkill] = useState<Skill | null>(initialData.length > 0 ? initialData[0] : null);
  const [isLoading, setIsLoading] = useState(true);

  // Load skills from storage on mount
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const storedSkills = await storage.getAll();
        const visibleSkills = storedSkills.filter(s => !s.isArchived);

        if (storedSkills.length === 0) {
          // No persisted data: use initial presets and save them
          const safeInitialData = Array.isArray(initialData) && initialData.length > 0 ? initialData : [];
          setSkills(safeInitialData);
          setActiveSkill(safeInitialData.length > 0 ? safeInitialData[0] : null);
          if (safeInitialData.length > 0) {
            try {
              await storage.saveAll(safeInitialData);
            } catch (saveError) {
              console.error('Error saving initial skills:', saveError);
            }
          }
        } else if (visibleSkills.length > 0) {
          // Has stored skills with at least one visible
          setSkills(storedSkills);
          setActiveSkill(visibleSkills[0]);
        } else {
          // All skills archived: keep stored data, do NOT overwrite with presets (P0 data loss fix)
          setSkills(storedSkills);
          setActiveSkill(null);
        }
      } catch (error) {
        console.error('Error loading skills:', error);
        const safeInitialData = Array.isArray(initialData) && initialData.length > 0 ? initialData : [];
        setSkills(safeInitialData);
        setActiveSkill(safeInitialData.length > 0 ? safeInitialData[0] : null);
      } finally {
        setIsLoading(false);
      }
    };

    loadSkills();
  }, [storage, initialData]);

  // Save skills to storage whenever they change
  useEffect(() => {
    if (!isLoading) {
      storage.saveAll(skills).catch(error => {
        console.error('Error saving skills:', error);
        // If storage quota is exceeded or other error, log but don't crash the app
        // The app should remain functional even if saving fails
      });
    }
  }, [skills, storage, isLoading]);

  const addSkill = () => {
    const newSkill: Skill = createSkillWithDefaults({
      description: 'New Description',
    });
    setSkills([newSkill, ...skills]);
    setActiveSkill(newSkill);
  };

  const saveSkill = (updatedSkill: Skill) => {
    const withUpdatedTimestamp: Skill = {
      ...updatedSkill,
      updatedAt: new Date().toISOString(),
    };

    setSkills(prev => {
      const exists = prev.some(s => s.id === withUpdatedTimestamp.id);
      if (exists) {
        return prev.map(s => s.id === withUpdatedTimestamp.id ? withUpdatedTimestamp : s);
      } else {
        return [withUpdatedTimestamp, ...prev];
      }
    });
  };

  const deleteSkill = async (id: string) => {
    const now = new Date().toISOString();
    const archivedSkills = skills.map(s =>
      s.id === id ? { ...s, isArchived: true, updatedAt: now } : s
    );
    setSkills(archivedSkills);

    try {
      await storage.delete(id);
    } catch (error) {
      console.error('Error deleting skill:', error);
      // Continue anyway - skill is already archived in state
    }

    // If we deleted the active skill, switch to another visible skill
    if (activeSkill?.id === id) {
      const nextActive = archivedSkills.find(s => !s.isArchived);
      setActiveSkill(nextActive ?? null);
    }
  };

  const restoreSkill = (skillToRestore: Skill) => {
    const restoredSkill = { ...skillToRestore, isArchived: false, updatedAt: new Date().toISOString() };
    setSkills(prev => {
      const exists = prev.some(s => s.id === restoredSkill.id);
      if (!exists) return [restoredSkill, ...prev];
      return prev.map(s => (s.id === restoredSkill.id ? restoredSkill : s));
    });
    setActiveSkill(restoredSkill);
  };

  const resetSkills = async () => {
    const safeInitialData = Array.isArray(initialData) && initialData.length > 0 ? initialData : [];
    setSkills(safeInitialData);
    if (safeInitialData.length > 0) {
      setActiveSkill(safeInitialData[0]);
    }
    
    try {
      await storage.saveAll(safeInitialData);
    } catch (error) {
      console.error('Error resetting skills:', error);
      // Continue anyway - skills are reset in state even if save fails
    }
  };

  const reorderSkill = (startIndex: number, endIndex: number) => {
    const result = Array.from(skills);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setSkills(result);
  };

  const visibleSkills = skills.filter(s => !s.isArchived);

  return { skills: visibleSkills, activeSkill, setActiveSkill, addSkill, saveSkill, deleteSkill, restoreSkill, resetSkills, reorderSkill, isLoading };
};