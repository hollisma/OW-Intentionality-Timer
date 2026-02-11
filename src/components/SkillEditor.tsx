import { useState, useRef, useEffect } from 'react';
import { type Skill, type RoleId, type HeroId } from '../types/Skill';
import { InputGroup } from './ui/InputGroup';
import { ROLES, HEROES } from '../data/overwatchHeroes';
import { chipBase, chipSelected, chipUnselected, chipTag } from '../styles/chipStyles';
import { getUniqueTags, toTagDisplayCase } from '../logic/skillSelectors';

interface SkillEditorProps {
  skill: Skill;
  allSkills: Skill[];
  isActive: boolean;
  onUpdate: (updates: Partial<Skill>) => void;
  onDelete: () => void;
}

function normalizeTag(tag: string): string {
  return tag.trim().toLowerCase();
}

function hasTag(skill: Skill, tag: string): boolean {
  const norm = normalizeTag(tag);
  return skill.tags.some(t => normalizeTag(t) === norm);
}

export const SkillEditor = ({ skill, allSkills, isActive, onUpdate, onDelete }: SkillEditorProps) => {
  const [tagInput, setTagInput] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionRef = useRef<HTMLDivElement>(null);

  const allTags = getUniqueTags(allSkills);
  const suggestions = tagInput.trim()
    ? allTags.filter(t => t.toLowerCase().includes(tagInput.toLowerCase()) && !hasTag(skill, t))
    : [];

  const addTag = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || hasTag(skill, trimmed)) return;
    const displayTag = toTagDisplayCase(trimmed);
    if (hasTag(skill, displayTag)) return; // prevent duplicate after normalizing
    onUpdate({ tags: [...skill.tags, displayTag] });
    setTagInput('');
    setShowSuggestions(false);
  };

  const removeTag = (tag: string) => {
    const norm = normalizeTag(tag);
    onUpdate({ tags: skill.tags.filter(t => normalizeTag(t) !== norm) });
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  const handleTagBlur = () => {
    // Only hide dropdown on blur; do NOT add tag (user must press Enter or click dropdown)
    setTimeout(() => setShowSuggestions(false), 150);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (suggestionRef.current && !suggestionRef.current.contains(e.target as Node) && inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

      {/* Tags — input + removable chips */}
      <div className='flex flex-col gap-2'>
        <label className='text-xs font-bold text-slate-400 uppercase tracking-wider'>
          Tags
        </label>
        <div className='relative'>
          <div className='bg-slate-950/50 border border-slate-700/60 rounded-xl p-2.5 flex flex-wrap gap-2 max-h-16 overflow-y-auto overflow-x-hidden scrollbar-app pr-1'>
            {skill.tags.map(tag => (
              <span
                key={tag}
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold uppercase ${chipTag}`}
              >
                {tag}
                {!isActive && (
                  <button
                    type='button'
                    onClick={() => removeTag(tag)}
                    aria-label={`Remove ${tag}`}
                    className='ml-0.5 w-4 flex items-center justify-center p-0 leading-none text-base font-medium hover:bg-white/20 rounded transition shrink-0'
                  >
                    ×
                  </button>
                )}
              </span>
            ))}
            {!isActive && (
              <input
                ref={inputRef}
                type='text'
                value={tagInput}
                onChange={(e) => { setTagInput(e.target.value); setShowSuggestions(true); }}
                onKeyDown={handleTagKeyDown}
                onBlur={handleTagBlur}
                onFocus={() => tagInput.trim() && setShowSuggestions(true)}
                placeholder='Add tag…'
                className='flex-1 min-w-[100px] bg-transparent border-none outline-none text-white placeholder-slate-500 text-xs'
              />
            )}
          </div>
          {!isActive && showSuggestions && suggestions.length > 0 && (
            <div
              ref={suggestionRef}
              className='absolute z-10 mt-1 w-full bg-slate-900 border border-slate-700 rounded-lg shadow-lg max-h-32 overflow-y-auto'
            >
              {suggestions.map(tag => (
                <button
                  key={tag}
                  type='button'
                  onMouseDown={(e) => {
                    e.preventDefault(); // prevent input blur before we add
                    addTag(tag);
                  }}
                  className='w-full text-left px-3 py-2 text-xs text-slate-300 hover:bg-slate-700 transition'
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
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