import { useState, useMemo } from 'react';
import type { Skill, RoleId, HeroId } from '../types/Skill';
import { filterAndSortSkills, getUniqueTags, type SkillSortKey } from '../logic/skillSelectors';

export function useSkillFilters(skills: Skill[]) {
  const [selectedRoleIds, setSelectedRoleIds] = useState<RoleId[]>([]);
  const [selectedHeroIds, setSelectedHeroIds] = useState<HeroId[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<SkillSortKey>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const availableTags = useMemo(() => getUniqueTags(skills), [skills]);

  // Filter and sort skills (memoized for performance)
  const filteredAndSortedSkills = useMemo(() => {
    return filterAndSortSkills(
      skills,
      {
        roleIds: selectedRoleIds.length > 0 ? selectedRoleIds : undefined,
        heroIds: selectedHeroIds.length > 0 ? selectedHeroIds : undefined,
        tags: selectedTags.length > 0 ? selectedTags : undefined,
      },
      sortBy,
      sortDirection
    );
  }, [skills, selectedRoleIds, selectedHeroIds, selectedTags, sortBy, sortDirection]);

  const handleSortChange = (newSortBy: SkillSortKey, newDirection: 'asc' | 'desc') => {
    setSortBy(newSortBy);
    setSortDirection(newDirection);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.some(t => t.toLowerCase() === tag.toLowerCase())
        ? prev.filter(t => t.toLowerCase() !== tag.toLowerCase())
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setSelectedRoleIds([]);
    setSelectedHeroIds([]);
    setSelectedTags([]);
  };

  return {
    selectedRoleIds,
    selectedHeroIds,
    selectedTags,
    availableTags,
    sortBy,
    sortDirection,
    filteredAndSortedSkills,
    setSelectedRoleIds,
    setSelectedHeroIds,
    setSelectedTags,
    toggleTag,
    handleSortChange,
    clearFilters,
  };
}
