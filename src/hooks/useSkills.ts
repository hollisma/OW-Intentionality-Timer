import { useState, useEffect } from 'react';
import { type Skill } from '../types/Skill';
import { type SkillStorage } from '../storage/SkillStorage';

export const useSkills = (storage: SkillStorage, initialData: Skill[]) => {
  const [skills, setSkills] = useState<Skill[]>(initialData);
  const [activeSkill, setActiveSkill] = useState<Skill>(initialData[0]);
  const [isLoading, setIsLoading] = useState(true);

  // Load skills from storage on mount
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const storedSkills = await storage.getAll();
        if (storedSkills.length > 0) {
          setSkills(storedSkills);
          setActiveSkill(storedSkills[0]);
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
    const newSkill: Skill = {
      id: crypto.randomUUID(),
      name: 'New Focus',
      description: 'New Description',
      tts: 'New Focus',
      interval: 60,
    };
    setSkills([newSkill, ...skills]);
    setActiveSkill(newSkill);
  };

  const saveSkill = (updatedSkill: Skill) => {
    setSkills(prev => {
      const exists = prev.some(s => s.id === updatedSkill.id);
      if (exists) {
        return prev.map(s => s.id === updatedSkill.id ? updatedSkill : s);
      } else {
        return [updatedSkill, ...prev];
      }
    });
  };

  const deleteSkill = async (id: string) => {
    const filtered = skills.filter(s => s.id !== id);
    setSkills(filtered);
    
    try {
      await storage.delete(id);
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
    
    if (activeSkill.id === id && filtered.length > 0) {
      setActiveSkill(filtered[0]);
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

  return { skills, activeSkill, setActiveSkill, addSkill, saveSkill, deleteSkill, resetSkills, isLoading };
};