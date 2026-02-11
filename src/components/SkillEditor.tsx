import { type Skill, type RoleId, type HeroId } from '../types/Skill';
import { InputGroup } from './ui/InputGroup';
import { ROLES, HEROES } from '../data/overwatchHeroes';
import { chipBase, chipSelected, chipUnselected } from '../styles/chipStyles';

interface SkillEditorProps {
  skill: Skill;
  isActive: boolean;
  onUpdate: (updates: Partial<Skill>) => void;
  onDelete: () => void;
}

export const SkillEditor = ({ skill, isActive, onUpdate, onDelete }: SkillEditorProps) => {
  const toggleRole = (roleId: RoleId) => {
    const newRoleIds = skill.roleIds.includes(roleId)
      ? skill.roleIds.filter(id => id !== roleId)
      : [...skill.roleIds, roleId];
    
    // Remove heroes that don't belong to any selected role
    const heroesInSelectedRoles = HEROES
      .filter(hero => newRoleIds.includes(hero.roleId))
      .map(hero => hero.id);
    const newHeroIds = skill.heroIds.filter(heroId => heroesInSelectedRoles.includes(heroId));
    
    onUpdate({ roleIds: newRoleIds, heroIds: newHeroIds });
  };

  const toggleHero = (heroId: HeroId) => {
    const newHeroIds = skill.heroIds.includes(heroId)
      ? skill.heroIds.filter(id => id !== heroId)
      : [...skill.heroIds, heroId];
    onUpdate({ heroIds: newHeroIds });
  };

  // Get heroes that belong to at least one selected role, or all heroes if no roles selected
  const availableHeroes = skill.roleIds.length > 0
    ? HEROES.filter(h => skill.roleIds.includes(h.roleId))
    : HEROES;

  return (
    <div className='space-y-4'>
      <InputGroup 
        label='Skill Name' 
        value={skill.name} 
        onChange={(val) => onUpdate({ name: val })} 
      />
      <InputGroup 
        label='TTS Text' 
        value={skill.tts} 
        onChange={(val) => onUpdate({ tts: val })} 
      />
      <InputGroup 
        label='Interval (Seconds)' 
        type='number' 
        value={skill.interval} 
        onChange={(val) => onUpdate({ interval: Math.max(1, parseInt(val) || 1) })} 
      />
      <InputGroup 
        label='Description' 
        type='textarea'
        value={skill.description} 
        onChange={(val) => onUpdate({ description: val })} 
      />
      
      {/* Role Selection — pill-style chips */}
      <div className='flex flex-col gap-2'>
        <label className='text-xs font-bold text-slate-400 uppercase tracking-wider'>
          Roles
        </label>
        <div className='bg-slate-950/50 border border-slate-700/60 rounded-xl p-2.5'>
          <div className='flex flex-wrap gap-2'>
            {ROLES.map(role => (
              <button
                key={role.id}
                type='button'
                onClick={() => !isActive && toggleRole(role.id)}
                disabled={isActive}
                className={`${chipBase} ${
                  skill.roleIds.includes(role.id) ? chipSelected : chipUnselected
                }`}
              >
                {role.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Selection — scrollable container with custom scrollbar */}
      <div className='flex flex-col gap-2'>
        <label className='text-xs font-bold text-slate-400 uppercase tracking-wider'>
          Heroes {skill.roleIds.length > 0 && (
            <span className='text-slate-500 font-normal normal-case'>
              — {skill.roleIds.map(r => ROLES.find(role => role.id === r)?.name).join(', ')}
            </span>
          )}
        </label>
        <div className='bg-slate-950/50 border border-slate-700/60 rounded-xl p-2.5'>
          <div className='flex flex-wrap gap-2 max-h-28 overflow-y-auto overflow-x-hidden scrollbar-app pr-1'>
            {availableHeroes.map(hero => (
              <button
                key={hero.id}
                type='button'
                onClick={() => !isActive && toggleHero(hero.id)}
                disabled={isActive}
                className={`${chipBase} ${
                  skill.heroIds.includes(hero.id) ? chipSelected : chipUnselected
                }`}
              >
                {hero.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button 
        onClick={onDelete}
        disabled={isActive}
        className='w-full text-red-200/70 uppercase font-bold transition-all hover:text-red-400/80 disabled:opacity-50'
      >
        Delete Selected Skill
      </button>
    </div>
  );
};