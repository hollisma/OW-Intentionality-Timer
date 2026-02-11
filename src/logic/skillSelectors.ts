import type { Skill, RoleId, HeroId } from '../types/Skill';
import { HEROES } from '../data/overwatchHeroes';

export interface SkillFilterCriteria {
  roleIds?: RoleId[];
  heroIds?: HeroId[];
  /** Show skills that have ANY of these tags (case-insensitive) */
  tags?: string[];
  searchQuery?: string;
}

export type SkillSortKey = 'name' | 'role' | 'hero' | 'createdAt';

export function filterAndSortSkills(
  skills: Skill[],
  criteria: SkillFilterCriteria,
  sortKey: SkillSortKey,
  sortDirection: 'asc' | 'desc'
): Skill[] {
  let filtered = [...skills];

  // Filter by role: role-specific skills match role; hero-only skills (no roles) show when hero belongs to selected role
  if (criteria.roleIds && criteria.roleIds.length > 0) {
    filtered = filtered.filter(skill => {
      if (skill.roleIds.length > 0 && skill.roleIds.some(roleId => criteria.roleIds!.includes(roleId))) {
        return true;
      }
      // Hero-only skill: show if any of the skill's heroes belong to a selected role
      if (skill.heroIds.length > 0) {
        return skill.heroIds.some(heroId => {
          const hero = HEROES.find(h => h.id === heroId);
          return hero && criteria.roleIds!.includes(hero.roleId);
        });
      }
      return false;
    });
  }

  // Filter by hero: hero-specific skills must match hero; role-only skills (no heroes) show when role matches
  if (criteria.heroIds && criteria.heroIds.length > 0) {
    filtered = filtered.filter(skill => {
      if (skill.heroIds.length > 0) {
        return skill.heroIds.some(heroId => criteria.heroIds!.includes(heroId));
      }
      // Role-only skill: show if it matches the role filter (applies to whole role)
      return criteria.roleIds && criteria.roleIds.length > 0 &&
        skill.roleIds.some(roleId => criteria.roleIds!.includes(roleId));
    });
  }

  // Filter by tags: show skills that have ANY of the selected tags (case-insensitive)
  if (criteria.tags && criteria.tags.length > 0) {
    const norm = (s: string) => s.toLowerCase().trim();
    const selectedNorm = criteria.tags.map(norm).filter(Boolean);
    filtered = filtered.filter(skill =>
      skill.tags.some(tag => selectedNorm.includes(norm(tag)))
    );
  }

  // Filter by search query
  if (criteria.searchQuery) {
    const query = criteria.searchQuery.toLowerCase();
    filtered = filtered.filter(skill =>
      skill.name.toLowerCase().includes(query) ||
      skill.description.toLowerCase().includes(query) ||
      skill.tts.toLowerCase().includes(query)
    );
  }

  // Sort
  filtered.sort((a, b) => {
    let aVal: string | number;
    let bVal: string | number;

    switch (sortKey) {
      case 'name':
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
        break;
      case 'role':
        // Sort by first role, or empty string if no roles
        aVal = a.roleIds.length > 0 ? a.roleIds[0] : '';
        bVal = b.roleIds.length > 0 ? b.roleIds[0] : '';
        break;
      case 'hero':
        // Sort by first hero, or empty string if no heroes
        aVal = a.heroIds.length > 0 ? a.heroIds[0] : '';
        bVal = b.heroIds.length > 0 ? b.heroIds[0] : '';
        break;
      case 'createdAt':
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
        break;
      default:
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return filtered;
}

// Helper to get hero names by IDs
export function getHeroNames(heroIds: HeroId[]): string[] {
  return heroIds
    .map(id => HEROES.find(h => h.id === id)?.name)
    .filter((name): name is string => name !== undefined);
}

// Helper to get role names by IDs
export function getRoleNames(roleIds: RoleId[]): string[] {
  const roleMap: Record<string, string> = {
    tank: 'Tank',
    damage: 'Damage',
    support: 'Support',
    flex: 'Flex',
  };
  return roleIds.map(id => roleMap[id] ?? id);
}

/** Normalize tag to consistent display form: Title Case (first letter uppercase, rest lowercase) */
export function toTagDisplayCase(tag: string): string {
  const t = tag.trim();
  if (!t) return t;
  return t.charAt(0).toUpperCase() + t.slice(1).toLowerCase();
}

/** Get unique tags used across all skills, sorted alphabetically. Uses Title Case for consistency and dedupes by lowercase. */
export function getUniqueTags(skills: Skill[]): string[] {
  const seen = new Map<string, string>(); // normalized (lowercase) -> display form
  skills.flatMap(s => s.tags).forEach(tag => {
    const t = tag.trim();
    if (!t) return;
    const norm = t.toLowerCase();
    if (!seen.has(norm)) seen.set(norm, toTagDisplayCase(t));
  });
  return [...seen.values()].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
}
