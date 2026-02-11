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
  createSkillWithDefaults({
    id: 'tp-then-suzu',
    name: 'TP then Suzu',
    description: "Use Swift Step to your teammate, then Suzu to save them. Prioritize TP before Suzu so you're in position to cleanse.",
    tts: 'TP then Suzu',
    interval: 45,
    heroIds: ['kiriko'],
    roleIds: ['support'],
    isPreset: true,
  }),
  createSkillWithDefaults({
    id: 'engage-with-team',
    name: 'Engage with team',
    description: "Before engaging, check that your team is ready and together. Don't push in alone—wait for your team to be in position so everyone engages together.",
    tts: 'Engage with team',
    interval: 30,
    roleIds: ['tank'],
    isPreset: true,
  }),
];

