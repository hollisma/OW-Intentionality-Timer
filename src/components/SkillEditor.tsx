import { type Skill } from '../types/Skill';
import { InputGroup } from './InputGroup';

interface SkillEditorProps {
  skill: Skill;
  isActive: boolean;
  onUpdate: (updates: Partial<Skill>) => void;
  onSave: () => void;
  onDelete: () => void;
}

export const SkillEditor = ({ skill, isActive, onUpdate, onSave, onDelete }: SkillEditorProps) => (
  <div className='space-y-4'>
    <InputGroup 
      label='Skill Name' 
      value={skill.name} 
      onChange={(val) => onUpdate({ name: val, tts: `${val}` })} 
    />
    <InputGroup 
      label='Interval (Seconds)' 
      type='number' 
      value={skill.interval} 
      onChange={(val) => onUpdate({ interval: parseInt(val) || 0 })} 
    />
    <button 
      onClick={onSave}
      disabled={isActive}
      className='w-full text-emerald-200/70 uppercase font-bold transition-all hover:text-emerald-500 disabled:opacity-50'
    >
      Save Changes to List
    </button>
    <button 
      onClick={onDelete}
      className='w-full text-red-200/70 uppercase font-bold transition-all hover:text-red-400/80 disabled:opacity-50'
    >
      Delete Selected Skill
    </button>
  </div>
);