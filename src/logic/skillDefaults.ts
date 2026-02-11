import type { Skill } from '../types/Skill';

// Shared factory for creating a Skill with sensible defaults.
// Used by storage (when hydrating) and by hooks when creating new skills.
export const createSkillWithDefaults = (partial: Partial<Skill> = {}): Skill => {
  const now = new Date().toISOString();
  return {
    id: partial.id ?? crypto.randomUUID(),
    gameId: partial.gameId ?? 'overwatch',
    name: partial.name ?? 'New Focus',
    description: partial.description ?? '',
    tts: partial.tts ?? partial.name ?? 'New Focus',
    interval: Math.max(1, partial.interval ?? 60),
    heroIds: partial.heroIds ?? [],
    roleIds: partial.roleIds ?? [],
    categoryIds: partial.categoryIds ?? [],
    tagIds: partial.tagIds ?? [],
    isPreset: partial.isPreset ?? false,
    isArchived: partial.isArchived ?? false,
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  };
};

