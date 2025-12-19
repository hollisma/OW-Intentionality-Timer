import { type Skill } from '../types/Skill';

export interface SkillStorage {
  getAll(): Promise<Skill[]>;
  save(skill: Skill): Promise<void>;
  delete(id: string): Promise<void>;
  saveAll(skills: Skill[]): Promise<void>;
}

