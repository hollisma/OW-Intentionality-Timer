import { useState } from 'react';
import type { Skill } from '../types/Skill';
import { SkillListCard } from './SkillListCard';

interface SkillListProps {
  skills: Skill[]; 
  activeId: string; 
  onSelect: (skill: Skill) => void;
  onAdd: () => void;
  onReorder: (startIndex: number, endIndex: number) => void;
}

export const SkillList = ({ skills, activeId, onSelect, onAdd, onReorder }: SkillListProps) => {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (index: number) => {
    if (draggedIndex === null) return;
    
    if (index !== draggedIndex) {
      setDragOverIndex(index);
    }
  };

  const handleDragEnd = () => {
    if (draggedIndex !== null && dragOverIndex !== null && draggedIndex !== dragOverIndex) {
      onReorder(draggedIndex, dragOverIndex);
    }
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

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
        {skills.map((skill, index) => (
          <div
            key={skill.id}
            className={dragOverIndex === index && draggedIndex !== index ? 'opacity-50' : ''}
          >
            <SkillListCard
              skill={skill}
              isActive={activeId === skill.id}
              index={index}
              onSelect={onSelect}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
