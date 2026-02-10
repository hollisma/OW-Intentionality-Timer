import { useState, useMemo } from 'react';
import type { Skill, RoleId, HeroId } from '../types/Skill';
import { filterAndSortSkills, type SkillSortKey } from '../logic/skillSelectors';

export function useSkillFilters(skills: Skill[]) {
  const [selectedRoleIds, setSelectedRoleIds] = useState<RoleId[]>([]);
  const [selectedHeroIds, setSelectedHeroIds] = useState<HeroId[]>([]);
  const [sortBy, setSortBy] = useState<SkillSortKey>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Filter and sort skills (memoized for performance)
  const filteredAndSortedSkills = useMemo(() => {
    return filterAndSortSkills(
      skills,
      {
        roleIds: selectedRoleIds.length > 0 ? selectedRoleIds : undefined,
        heroIds: selectedHeroIds.length > 0 ? selectedHeroIds : undefined,
      },
      sortBy,
      sortDirection
    );
  }, [skills, selectedRoleIds, selectedHeroIds, sortBy, sortDirection]);

  const handleSortChange = (newSortBy: SkillSortKey, newDirection: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortDirection(newDirection);
  };

  const clearFilters = () => {
    setSelectedRoleIds([]);
    setSelectedHeroIds([]);
  };

  return {
    selectedRoleIds,
    selectedHeroIds,
    sortBy,
    sortDirection,
    filteredAndSortedSkills,
    setSelectedRoleIds,
    setSelectedHeroIds,
    handleSortChange,
    clearFilters,
  };
}
