import { type Skill } from '../types/Skill';
import { type SkillStorage } from './SkillStorage';

const STORAGE_KEY = 'ow-practice-skills';

export class LocalStorageSkillStorage implements SkillStorage {
  async getAll(): Promise<Skill[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return [];
      }
      return JSON.parse(stored) as Skill[];
    } catch (error) {
      console.error('Error loading skills from localStorage:', error);
      return [];
    }
  }

  async save(skill: Skill): Promise<void> {
    const skills = await this.getAll();
    const existingIndex = skills.findIndex(s => s.id === skill.id);
    
    if (existingIndex >= 0) {
      skills[existingIndex] = skill;
    } else {
      skills.unshift(skill);
    }
    
    await this.saveAll(skills);
  }

  async delete(id: string): Promise<void> {
    const skills = await this.getAll();
    const filtered = skills.filter(s => s.id !== id);
    await this.saveAll(filtered);
  }

  async saveAll(skills: Skill[]): Promise<void> {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(skills));
    } catch (error) {
      console.error('Error saving skills to localStorage:', error);
      throw error;
    }
  }
}

