import type { Skill, RoleId, HeroId, CategoryId, TagId } from '../types/Skill';
import { HEROES } from '../data/overwatchHeroes';

export interface SkillFilterCriteria {
  roleIds?: RoleId[];
  heroIds?: HeroId[];
  categoryIds?: CategoryId[];
  tagIds?: TagId[];
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

  // Filter by role (skill must have at least one matching role)
  if (criteria.roleIds && criteria.roleIds.length > 0) {
    filtered = filtered.filter(skill => 
      skill.roleIds.length > 0 && skill.roleIds.some(roleId => criteria.roleIds!.includes(roleId))
    );
  }

  // Filter by hero (skill must have at least one matching hero)
  if (criteria.heroIds && criteria.heroIds.length > 0) {
    filtered = filtered.filter(skill => 
      skill.heroIds.length > 0 && skill.heroIds.some(heroId => criteria.heroIds!.includes(heroId))
    );
  }

  // Filter by category
  if (criteria.categoryIds && criteria.categoryIds.length > 0) {
    filtered = filtered.filter(skill =>
      skill.categoryIds.some(catId => criteria.categoryIds!.includes(catId))
    );
  }

  // Filter by tag
  if (criteria.tagIds && criteria.tagIds.length > 0) {
    filtered = filtered.filter(skill =>
      skill.tagIds.some(tagId => criteria.tagIds!.includes(tagId))
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
