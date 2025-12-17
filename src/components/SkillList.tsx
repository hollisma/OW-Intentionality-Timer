import type { Skill } from '../types/Skill';
import { SkillListCard } from './SkillListCard';

interface SkillListProps {
  skills: Skill[]; 
  activeId: string; 
  onSelect: (skill: Skill) => void;
  onAdd: () => void;
}

export const SkillList = ({ skills, activeId, onSelect, onAdd }: SkillListProps) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h3 className="text-slate-400 font-bold uppercase text-sm tracking-[0.2em]">
          Skills List
        </h3>
        <button 
          onClick={() => onAdd()}
          className="font-bold text-emerald-500 hover:text-emerald-300 hover:bg-emerald-700/20 uppercase"
        >
          + New
        </button>
      </div>
      
      {/* Skill Cards */}
      <div className='flex flex-col gap-3'>
        {skills.map((skill) => (
          <SkillListCard
            key={skill.id}
            skill={skill}
            isActive={activeId === skill.id}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
};
