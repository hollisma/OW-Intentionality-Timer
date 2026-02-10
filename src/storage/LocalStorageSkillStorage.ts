import { type Skill } from '../types/Skill';
import { type SkillStorage } from './SkillStorage';
import { createSkillWithDefaults } from '../logic/skillDefaults';

const SCHEMA_KEY = 'owPractice.schemaVersion';
const SKILLS_KEY = 'owPractice.v1.skills';
const CURRENT_SCHEMA_VERSION = '1';

export class LocalStorageSkillStorage implements SkillStorage {
  async getAll(): Promise<Skill[]> {
    try {
      const schema = localStorage.getItem(SCHEMA_KEY);
      if (schema !== CURRENT_SCHEMA_VERSION) {
        return [];
      }

      const stored = localStorage.getItem(SKILLS_KEY);
      if (!stored) {
        return [];
      }
      const parsed = JSON.parse(stored) as Partial<Skill>[];
      return parsed.map(createSkillWithDefaults);
    } catch (error) {
      console.error('Error loading skills from localStorage:', error);
      return [];
    }
  }

  async save(skill: Skill): Promise<void> {
    const skills = await this.getAll();
    const existingIndex = skills.findIndex((s) => s.id === skill.id);

    if (existingIndex >= 0) {
      skills[existingIndex] = skill;
    } else {
      skills.unshift(skill);
    }

    await this.saveAll(skills);
  }

  async delete(id: string): Promise<void> {
    // V1.0 uses soft-delete via isArchived; this method keeps compatibility with
    // the interface but marks the skill as archived instead of hard-deleting it.
    const skills = await this.getAll();
    const updated = skills.map((s) =>
      s.id === id ? { ...s, isArchived: true, updatedAt: new Date().toISOString() } : s
    );
    await this.saveAll(updated);
  }

  async saveAll(skills: Skill[]): Promise<void> {
    try {
      localStorage.setItem(SCHEMA_KEY, CURRENT_SCHEMA_VERSION);
      localStorage.setItem(SKILLS_KEY, JSON.stringify(skills));
    } catch (error) {
      console.error('Error saving skills to localStorage:', error);
      throw error;
    }
  }
}

