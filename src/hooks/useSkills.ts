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
    setSkills(prev => prev.map(s => s.id === updatedSkill.id ? updatedSkill : s));
  };

  const deleteSkill = (id: string) => {
    const filtered = skills.filter(s => s.id !== id);
    setSkills(filtered);
    if (activeSkill.id === id) setActiveSkill(filtered[0] || initialData[0]);
  };

  return { skills, activeSkill, setActiveSkill, addSkill, saveSkill, deleteSkill };
};