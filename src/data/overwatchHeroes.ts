import type { HeroMeta, RoleMeta } from '../types/Skill';

export const ROLES: RoleMeta[] = [
  { id: 'tank', name: 'Tank' },
  { id: 'damage', name: 'Damage' },
  { id: 'support', name: 'Support' },
];

// Minimal hero list for now; can be extended later.
export const HEROES: HeroMeta[] = [
  { id: 'dva', name: 'D.Va', roleId: 'tank' },
  { id: 'rein', name: 'Reinhardt', roleId: 'tank' },
  { id: 'winston', name: 'Winston', roleId: 'tank' },
  { id: 'tracer', name: 'Tracer', roleId: 'damage' },
  { id: 'soldier-76', name: 'Soldier: 76', roleId: 'damage' },
  { id: 'sojourn', name: 'Sojourn', roleId: 'damage' },
  { id: 'ana', name: 'Ana', roleId: 'support' },
  { id: 'mercy', name: 'Mercy', roleId: 'support' },
  { id: 'kiriko', name: 'Kiriko', roleId: 'support' },
];

