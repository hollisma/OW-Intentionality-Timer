import type { Skill } from '../types/Skill';
import { toTagDisplayCase } from './skillSelectors';

function normalizeTags(tags: string[]): string[] {
  const seen = new Set<string>();
  return tags
    .map(t => toTagDisplayCase(t.trim()))
    .filter(t => {
      if (!t || seen.has(t.toLowerCase())) return false;
      seen.add(t.toLowerCase());
      return true;
    });
}

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
    tags: normalizeTags(partial.tags ?? []),
    isPreset: partial.isPreset ?? false,
    isArchived: partial.isArchived ?? false,
    createdAt: partial.createdAt ?? now,
    updatedAt: partial.updatedAt ?? now,
  };
};

