import { useCallback } from 'react';
import type { Skill } from '../types/Skill';

/**
 * Handles reordering skills when filters are active.
 * Maps filtered list indices back to the full skills array indices.
 */
export function useSkillReorder(
  allSkills: Skill[],
  filteredSkills: Skill[],
  reorderSkill: (startIndex: number, endIndex: number) => void,
  hasActiveFilters: boolean
) {
  const handleReorder = useCallback(
    (startIndex: number, endIndex: number) => {
      // Only allow reordering if no filters are active (to avoid index mismatches)
      if (hasActiveFilters) {
        return;
      }

      // Map filtered indices back to original skill IDs, then reorder in full list
      const draggedSkill = filteredSkills[startIndex];
      const targetSkill = filteredSkills[endIndex];
      
      if (!draggedSkill || !targetSkill) {
        return;
      }

      const draggedIndexInFull = allSkills.findIndex(s => s.id === draggedSkill.id);
      const targetIndexInFull = allSkills.findIndex(s => s.id === targetSkill.id);
      
      if (draggedIndexInFull >= 0 && targetIndexInFull >= 0) {
        reorderSkill(draggedIndexInFull, targetIndexInFull);
      }
    },
    [allSkills, filteredSkills, reorderSkill, hasActiveFilters]
  );

  return handleReorder;
}
