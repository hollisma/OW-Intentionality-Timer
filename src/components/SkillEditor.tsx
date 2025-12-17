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
      onChange={(val) => onUpdate({ name: val, tts: `Focus: ${val}` })} 
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
      className='w-full py-2 border-2 border-slate-700 hover:border-emerald-600 text-slate-400 hover:text-emerald-500 font-bold uppercase text-xs rounded-xl transition-all disabled:opacity-50'
    >
      Save Changes to List
    </button>
    <button 
      onClick={onDelete}
      className='w-full text-[10px] text-slate-600 hover:text-red-500 uppercase font-bold transition-colors'
    >
      Delete Selected Skill
    </button>
  </div>
);