import { type RoleId, type HeroId } from '../types/Skill';
import { ROLES, HEROES } from '../data/overwatchHeroes';
import type { SkillSortKey } from '../logic/skillSelectors';

interface SkillFiltersPanelProps {
  selectedRoleIds: RoleId[];
  selectedHeroIds: HeroId[];
  sortBy: SkillSortKey;
  sortDirection: 'asc' | 'desc';
  onRoleFilterChange: (roleIds: RoleId[]) => void;
  onHeroFilterChange: (heroIds: HeroId[]) => void;
  onSortChange: (sortBy: SkillSortKey, direction: 'asc' | 'desc') => void;
}

export const SkillFiltersPanel = ({
  selectedRoleIds,
  selectedHeroIds,
  sortBy,
  sortDirection,
  onRoleFilterChange,
  onHeroFilterChange,
  onSortChange,
}: SkillFiltersPanelProps) => {
  const toggleRole = (roleId: RoleId) => {
    if (selectedRoleIds.includes(roleId)) {
      const newRoleIds = selectedRoleIds.filter(id => id !== roleId);
      onRoleFilterChange(newRoleIds);
      // Clear hero filters when no roles are selected (fix: heroes not visible when roles unselected)
      if (newRoleIds.length === 0) {
        onHeroFilterChange([]);
      } else {
        // Also clear heroes that don't belong to any selected role
        const heroesInSelectedRoles = HEROES
          .filter(hero => newRoleIds.includes(hero.roleId))
          .map(hero => hero.id);
        onHeroFilterChange(selectedHeroIds.filter(heroId => heroesInSelectedRoles.includes(heroId)));
      }
    } else {
      onRoleFilterChange([...selectedRoleIds, roleId]);
    }
  };

  const toggleHero = (heroId: HeroId) => {
    if (selectedHeroIds.includes(heroId)) {
      onHeroFilterChange(selectedHeroIds.filter(id => id !== heroId));
    } else {
      onHeroFilterChange([...selectedHeroIds, heroId]);
    }
  };

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h3 className='text-slate-400 font-bold uppercase text-sm tracking-[0.2em]'>
          Filters
        </h3>
      </div>

      {/* Role Filters */}
      <div className='flex flex-col gap-2'>
        <label className='text-xs font-bold text-slate-400 uppercase tracking-wider'>
          Roles
        </label>
        <div className='flex flex-wrap gap-2'>
          {ROLES.map(role => (
            <button
              key={role.id}
              onClick={() => toggleRole(role.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                selectedRoleIds.includes(role.id)
                  ? 'bg-orange-500 text-white'
                  : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
              }`}
            >
              {role.name}
            </button>
          ))}
        </div>
      </div>

      {/* Hero Filters */}
      {selectedRoleIds.length > 0 && (
        <div className='flex flex-col gap-2'>
          <label className='text-xs font-bold text-slate-400 uppercase tracking-wider'>
            Heroes
          </label>
          <div className='flex flex-wrap gap-2'>
            {HEROES
              .filter(hero => selectedRoleIds.includes(hero.roleId))
              .map(hero => (
                <button
                  key={hero.id}
                  onClick={() => toggleHero(hero.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                    selectedHeroIds.includes(hero.id)
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  }`}
                >
                  {hero.name}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Sort Options */}
      <div className='flex flex-col gap-2'>
        <label className='text-xs font-bold text-slate-400 uppercase tracking-wider'>
          Sort By
        </label>
        <div className='flex items-center gap-2'>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value as SkillSortKey, sortDirection)}
            className='bg-slate-950 border border-slate-700 rounded-lg p-2 text-white text-xs focus:border-orange-500 outline-none transition shadow-inner flex-1'
          >
            <option value='name'>Name</option>
            <option value='role'>Role</option>
            <option value='hero'>Hero</option>
            <option value='createdAt'>Created</option>
          </select>
          <button
            onClick={() => onSortChange(sortBy, sortDirection === 'asc' ? 'desc' : 'asc')}
            className='px-3 py-2 bg-slate-700 text-slate-300 rounded-lg text-xs font-bold uppercase hover:bg-slate-600 transition'
            title={sortDirection === 'asc' ? 'Ascending' : 'Descending'}
          >
            {sortDirection === 'asc' ? '↑' : '↓'}
          </button>
        </div>
      </div>
    </div>
  );
};
