import { type Skill } from '../types/Skill';

interface SkillListCardProps {
  skill: Skill;
  isActive: boolean; 
  onSelect: (skill: Skill) => void; 
}

export const SkillListCard = ({ skill, isActive, onSelect }: SkillListCardProps) => {
	return (
		<button
      type='button'
      onClick={() => onSelect(skill)}
      className={`group p-4 rounded-xl border-2 text-left transition-all transform active:scale-[0.98] ${
        isActive 
          ? 'border-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(234,88,12,0.1)]' 
          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
      }`}
    >
      <div className='flex justify-between items-center'>
        <span className={`font-bold uppercase tracking-tight ${
          isActive ? 'text-orange-500' : 'text-slate-300'
        }`}>
          {skill.name}
        </span>
        <span className={`text-[10px] font-mono ${
          isActive ? 'text-orange-300' : 'text-slate-400'
        }`}>
          {skill.interval}s
        </span>
      </div>
      <p className={`text-sm mt-1 leading-relaxed ${
          isActive ? 'text-orange-300' : 'text-slate-400'
        }`}>
        {skill.description}
      </p>
    </button>
	)
}