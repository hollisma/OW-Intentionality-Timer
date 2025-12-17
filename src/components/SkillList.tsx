import type { Skill } from '../types/Skill';

interface SkillListProps {
  skills: Skill[]; 
  activeId: string; 
  onSelect: (skill: Skill) => void;
}

export const SkillList = ({ skills, activeId, onSelect }: SkillListProps) => {
  return (
    <div className='flex flex-col gap-3 mt-8'>
      <h3 className='text-slate-400 font-bold uppercase text-sm tracking-[0.2em] mb-2'>
        Skills List
      </h3>
      
      {skills.map((skill) => (
        <button
          key={skill.id}
          type='button'
          onClick={() => onSelect(skill)}
          className={`group p-4 rounded-xl border-2 text-left transition-all transform active:scale-[0.98] ${
            activeId === skill.id 
              ? 'border-orange-500 bg-orange-500/10 shadow-[0_0_15px_rgba(234,88,12,0.1)]' 
              : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
          }`}
        >
          <div className='flex justify-between items-center'>
            <span className={`font-bold uppercase tracking-tight ${
              activeId === skill.id ? 'text-orange-500' : 'text-slate-300'
            }`}>
              {skill.name}
            </span>
            <span className={`text-[10px] font-mono ${
              activeId === skill.id ? 'text-orange-300' : 'text-slate-400'
            }`}>
              {skill.interval}s
            </span>
          </div>
          <div className={`text-sm mt-1 leading-relaxed ${
              activeId === skill.id ? 'text-orange-300' : 'text-slate-400'
            }`}>
            {skill.description}
          </div>
        </button>
      ))}
    </div>
  );
};
