import { type Skill } from '../types/Skill';

interface SkillListCardProps {
  skill: Skill;
  isActive: boolean; 
  index: number;
  onSelect: (skill: Skill) => void;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDragEnd: () => void;
}

export const SkillListCard = ({ skill, isActive, index, onSelect, onDragStart, onDragOver, onDragEnd }: SkillListCardProps) => {
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
        className='flex-1 text-left transition-all transform'
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
    </div>
	)
}