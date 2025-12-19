import { useState } from 'react';
import { type Skill } from '../types/Skill';

export const useSkills = (initialData: Skill[]) => {
  const [skills, setSkills] = useState<Skill[]>(initialData);
  const [activeSkill, setActiveSkill] = useState<Skill>(initialData[0]);

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

  const deleteSkill = (id: string) => {
    const filtered = skills.filter(s => s.id !== id);
    setSkills(filtered);
    if (activeSkill.id === id && filtered.length > 0) {
      setActiveSkill(filtered[0]);
    }
  };

  return { skills, activeSkill, setActiveSkill, addSkill, saveSkill, deleteSkill };
};