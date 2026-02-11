import { type Skill } from '../types/Skill';
import { getHeroNames, getRoleNames, toTagDisplayCase } from '../logic/skillSelectors';
import { DeleteButton } from './ui/DeleteButton';

interface SkillListCardProps {
  skill: Skill;
  isActive: boolean; 
  index: number;
  onSelect: (skill: Skill) => void;
  onDelete?: (skill: Skill) => void;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDragEnd: () => void;
}

export const SkillListCard = ({ skill, isActive, index, onSelect, onDelete, onDragStart, onDragOver, onDragEnd }: SkillListCardProps) => {
  const roleNames = getRoleNames(skill.roleIds);
  const heroNames = getHeroNames(skill.heroIds);

	return (
		<div
      draggable
      onDragStart={(e) => {
        onDragStart(index);
        e.dataTransfer.effectAllowed = 'move';
      }}
      onDragOver={(e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        onDragOver(index);
      }}
      onDragEnd={onDragEnd}
      className={`group flex items-center rounded-xl border-2 transition-all ${
        isActive 
          ? 'border-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(234,88,12,0.1)]' 
          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
      }`}
    >
      {/* Drag Handle */}
      <div 
        className='cursor-grab active:cursor-grabbing pl-3 flex-shrink-0'
        onClick={(e) => e.stopPropagation()}
      >
        <svg 
          className={`w-4 h-4 ${isActive ? 'text-orange-400 group-hover:text-orange-300' : 'text-slate-500 group-hover:text-slate-400'}`}
          fill='currentColor' 
          viewBox='0 0 24 24'
        >
          <path d='M9 5h2v2H9V5zm0 6h2v2H9v-2zm0 6h2v2H9v-2zm4-12h2v2h-2V5zm0 6h2v2h-2v-2zm0 6h2v2h-2v-2z' />
        </svg>
      </div>
      
      {/* Card Content */}
      <button
        type='button'
        onClick={() => onSelect(skill)}
        className='flex-1 text-left transition-all transform p-3'
      >
        <div className='flex justify-between items-start gap-2'>
          <div className='flex-1 min-w-0'>
            <div className='flex items-center gap-2 flex-wrap'>
              <span className={`font-bold uppercase tracking-tight ${
                isActive ? 'text-orange-500' : 'text-slate-300'
              }`}>
                {skill.name}
              </span>
              {skill.isPreset && (
                <span className='text-[10px] px-1.5 py-0.5 bg-slate-700 text-slate-300 rounded uppercase font-bold'>
                  Preset
                </span>
              )}
            </div>
            {(roleNames.length > 0 || heroNames.length > 0 || skill.tags.length > 0) && (
              <div className='flex items-center gap-2 mt-1 flex-wrap'>
                {roleNames.map(roleName => (
                  <span 
                    key={roleName}
                    className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                      isActive 
                        ? 'bg-orange-500/20 text-orange-300' 
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {roleName}
                  </span>
                ))}
                {heroNames.map(heroName => (
                  <span 
                    key={heroName}
                    className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                      isActive 
                        ? 'bg-orange-500/20 text-orange-300' 
                        : 'bg-slate-700 text-slate-400'
                    }`}
                  >
                    {heroName}
                  </span>
                ))}
                {skill.tags
                  .filter((tag, i, arr) => arr.findIndex(t => t.toLowerCase() === tag.toLowerCase()) === i)
                  .map(tag => (
                  <span 
                    key={tag.toLowerCase()}
                    className={`text-[10px] px-1.5 py-0.5 rounded uppercase font-bold ${
                      isActive 
                        ? 'bg-orange-500/20 text-orange-300' 
                        : 'bg-slate-700/80 text-slate-400'
                    }`}
                  >
                    #{toTagDisplayCase(tag)}
                  </span>
                ))}
              </div>
            )}
            <p className={`text-sm mt-1 leading-relaxed ${
                isActive ? 'text-orange-300' : 'text-slate-400'
              }`}>
              {skill.description}
            </p>
          </div>
          <span className={`text-[10px] font-mono flex-shrink-0 ${
            isActive ? 'text-orange-300' : 'text-slate-400'
          }`}>
            {skill.interval}s
          </span>
        </div>
      </button>

      {onDelete && (
        <DeleteButton
          onClick={() => onDelete(skill)}
          ariaLabel={`Delete ${skill.name}`}
        />
      )}
    </div>
	)
}