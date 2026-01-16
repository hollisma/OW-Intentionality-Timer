import { type Skill } from '../types/Skill';
import { InputGroup } from './InputGroup';

interface SkillEditorProps {
  skill: Skill;
  isActive: boolean;
  isInList: boolean;
  onUpdate: (updates: Partial<Skill>) => void;
  onSave: () => void;
  onDelete: () => void;
}

export const SkillEditor = ({ skill, isActive, isInList, onUpdate, onSave, onDelete }: SkillEditorProps) => (
  <div className='space-y-4'>
    <InputGroup 
      label='Skill Name (TTS)' 
      value={skill.name} 
      onChange={(val) => onUpdate({ name: val, tts: `${val}` })} 
    />
    <InputGroup 
      label='Interval (Seconds)' 
      type='number' 
      value={skill.interval} 
      onChange={(val) => onUpdate({ interval: parseInt(val) || 0 })} 
    />
    <InputGroup 
      label='Description' 
      type='textarea'
      value={skill.description} 
      onChange={(val) => onUpdate({ description: val })} 
    />
    <button 
      onClick={onSave}
      className='w-full text-emerald-200/70 uppercase font-bold transition-all hover:text-emerald-500 disabled:opacity-50'
    >
      {isInList ? 'Save Changes' : 'Add to List'}
    </button>
    <button 
      onClick={onDelete}
      disabled={isActive}
      className='w-full text-red-200/70 uppercase font-bold transition-all hover:text-red-400/80 disabled:opacity-50'
    >
      Delete Selected Skill
    </button>
  </div>
);