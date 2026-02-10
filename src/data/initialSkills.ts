import type { Skill } from '../types/Skill';
import { createSkillWithDefaults } from '../logic/skillDefaults';

export const INITIAL_SKILLS: Skill[] = [
  createSkillWithDefaults({
    id: 'off-angle',
    name: 'Off Angle',
    description: 'Use off angles to separate enemy resources',
    tts: 'off angles',
    interval: 20,
    isPreset: true,
  }),
  createSkillWithDefaults({
    id: 'target-priority',
    name: 'Target Priority',
    description: 'Focus squishies, not the tank',
    tts: 'target priority',
    interval: 30,
    isPreset: true,
  }),
  createSkillWithDefaults({
    id: 'ult-tracking',
    name: 'Ult Tracking',
    description: 'Think of what ults the enemy has',
    tts: 'ult tracking',
    interval: 45,
    isPreset: true,
  }),
];

