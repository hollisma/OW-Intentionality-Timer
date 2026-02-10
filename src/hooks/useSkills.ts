import { useState, useEffect } from 'react';
import { type Skill } from '../types/Skill';
import { type SkillStorage } from '../storage/SkillStorage';
import { createSkillWithDefaults } from '../logic/skillDefaults';

export const useSkills = (storage: SkillStorage, initialData: Skill[]) => {
  const [skills, setSkills] = useState<Skill[]>(initialData);
  const [activeSkill, setActiveSkill] = useState<Skill>(initialData[0]);
  const [isLoading, setIsLoading] = useState(true);

  // Load skills from storage on mount
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const storedSkills = await storage.getAll();
        const visibleSkills = storedSkills.filter(s => !s.isArchived);

        if (visibleSkills.length > 0) {
          setSkills(storedSkills);
          setActiveSkill(visibleSkills[0]);
        } else {
          // If no stored skills, use initial data and save it
          setSkills(initialData);
          setActiveSkill(initialData[0]);
          await storage.saveAll(initialData);
        }
      } catch (error) {
        console.error('Error loading skills:', error);
        // Fallback to initial data on error
        setSkills(initialData);
        setActiveSkill(initialData[0]);
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
    }

    if (activeSkill.id === id) {
      const nextActive = archivedSkills.find(s => !s.isArchived);
      if (nextActive) {
        setActiveSkill(nextActive);
      }
    }
  };

  const resetSkills = async () => {
    setSkills(initialData);
    setActiveSkill(initialData[0]);
    
    try {
      await storage.saveAll(initialData);
    } catch (error) {
      console.error('Error resetting skills:', error);
    }
  };

  const reorderSkill = (startIndex: number, endIndex: number) => {
    const result = Array.from(skills);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    setSkills(result);
  };

  const visibleSkills = skills.filter(s => !s.isArchived);

  return { skills: visibleSkills, activeSkill, setActiveSkill, addSkill, saveSkill, deleteSkill, resetSkills, reorderSkill, isLoading };
};