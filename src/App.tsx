import { useState, useEffect, useMemo, useCallback } from 'react';
import { useTimer } from './hooks/useTimer';
import { SkillList } from './components/SkillList';
import { SkillEditor } from './components/SkillEditor';
import { Settings } from './components/Settings';
import { SkillFiltersPanel } from './components/SkillFiltersPanel';
import { LocalStorageSettingsStorage } from './storage/LocalStorageSettingsStorage';
import { useSkillStore } from './hooks/useSkillStore';
import { filterAndSortSkills, type SkillSortKey } from './logic/skillSelectors';
import type { RoleId, HeroId } from './types/Skill';

const settingsStorage = new LocalStorageSettingsStorage();

function App() {
  const [volume, setVolume] = useState<number>(1);
  const [delay, setDelay] = useState<number>(30);
  
  // Filter and sort state
  const [selectedRoleIds, setSelectedRoleIds] = useState<RoleId[]>([]);
  const [selectedHeroIds, setSelectedHeroIds] = useState<HeroId[]>([]);
  const [sortBy, setSortBy] = useState<SkillSortKey>('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    settingsStorage.getVolume().then(setVolume);
    settingsStorage.getDelay().then(setDelay);
  }, []);

  const { skills, activeSkill, setActiveSkill, addSkill, saveSkill, deleteSkill, resetSkills, reorderSkill } = useSkillStore();
  
  // Filter and sort skills (memoized for performance)
  const filteredAndSortedSkills = useMemo(() => {
    return filterAndSortSkills(
      skills,
      {
        roleIds: selectedRoleIds.length > 0 ? selectedRoleIds : undefined,
        heroIds: selectedHeroIds.length > 0 ? selectedHeroIds : undefined,
      },
      sortBy,
      sortDirection
    );
  }, [skills, selectedRoleIds, selectedHeroIds, sortBy, sortDirection]);

  // Safety check: if no active skill, don't render timer (app should remain functional)
  const hasActiveSkill = activeSkill && skills.length > 0;
  
  const { isActive, timeLeft, isDelayPhase, toggleTimer } = useTimer({ 
    skill: hasActiveSkill ? activeSkill.tts : '', 
    intervalTime: hasActiveSkill ? activeSkill.interval : 60,
    volume: volume,
    delay: delay,
  });

  // Memoized callbacks to avoid unnecessary re-renders
  const handleSkillUpdate = useCallback((updates: Partial<typeof activeSkill>) => {
    if (!hasActiveSkill) return;
    const updatedSkill = { ...activeSkill, ...updates };
    setActiveSkill(updatedSkill);
    if (skills.some(s => s.id === activeSkill.id)) {
      saveSkill(updatedSkill);
    }
  }, [activeSkill, skills, setActiveSkill, saveSkill, hasActiveSkill]);

  const handleSkillDelete = useCallback(() => {
    if (!hasActiveSkill) return;
    deleteSkill(activeSkill.id);
  }, [activeSkill, deleteSkill, hasActiveSkill]);

  return (
    <div className='min-h-screen w-screen bg-slate-900 flex flex-col items-center py-10 px-4 overflow-y-auto'>
      <div className='w-full max-w-md bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-8'>
        <header className='flex justify-between items-center mb-8'>
          <h2 className='text-2xl font-bold text-white uppercase italic tracking-tighter'>Intentionality</h2>
        </header>

        <main className='space-y-6'>
          {/* Timer Display Section */}
          <section>
            {isActive && (
               <div className="text-center py-8 bg-slate-900/50 rounded-xl mb-4">
                 <div className="text-6xl font-mono font-black text-orange-500">{timeLeft}s</div>
                 {isDelayPhase && (
                   <div className="text-sm text-slate-400 mt-2 uppercase tracking-wide">Delay</div>
                 )}
               </div>
            )}
            <button 
              onClick={toggleTimer}
              className={`w-full py-4 rounded-xl font-black uppercase
                ${isActive ? 'text-red-100 bg-red-700 hover:bg-red-600' : 'text-orange-100 bg-orange-700 hover:bg-orange-600'}`}
            >
              {isActive ? 'Stop' : 'Start'}
            </button>
          </section>

          {/* Editor Section */}
          {hasActiveSkill && (
            <SkillEditor 
              skill={activeSkill} 
              isActive={isActive}
              onUpdate={handleSkillUpdate}
              onDelete={handleSkillDelete}
            />
          )}
          {!hasActiveSkill && (
            <div className='text-center py-8 text-slate-400'>
              <p className='text-sm'>No skills available. Add a skill to get started.</p>
            </div>
          )}

          <hr className="border-slate-700" />

          {/* Settings */}
          <Settings
            volume={volume}
            delay={delay}
            isActive={isActive}
            settingsStorage={settingsStorage}
            onVolumeChange={setVolume}
            onDelayChange={setDelay}
          />

          <hr className="border-slate-700" />

          {/* Filters Panel */}
          <SkillFiltersPanel
            selectedRoleIds={selectedRoleIds}
            selectedHeroIds={selectedHeroIds}
            sortBy={sortBy}
            sortDirection={sortDirection}
            onRoleFilterChange={setSelectedRoleIds}
            onHeroFilterChange={setSelectedHeroIds}
            onSortChange={(newSortBy, newDirection) => {
              setSortBy(newSortBy);
              setSortDirection(newDirection);
            }}
          />

          <hr className="border-slate-700" />

          {/* Navigation Section */}
          <SkillList 
            skills={filteredAndSortedSkills} 
            activeId={hasActiveSkill ? activeSkill.id : ''} 
            onSelect={(s) => !isActive && setActiveSkill(s)} 
            onAdd={addSkill}
            onReorder={(startIndex, endIndex) => {
              // Only allow reordering if no filters are active (to avoid index mismatches)
              if (selectedRoleIds.length === 0 && selectedHeroIds.length === 0 && !isActive) {
                // Map filtered indices back to original skill IDs, then reorder in full list
                const draggedSkill = filteredAndSortedSkills[startIndex];
                const targetSkill = filteredAndSortedSkills[endIndex];
                if (draggedSkill && targetSkill) {
                  const draggedIndexInFull = skills.findIndex(s => s.id === draggedSkill.id);
                  const targetIndexInFull = skills.findIndex(s => s.id === targetSkill.id);
                  if (draggedIndexInFull >= 0 && targetIndexInFull >= 0) {
                    reorderSkill(draggedIndexInFull, targetIndexInFull);
                  }
                }
              }
            }}
          />
          
          <button
            onClick={resetSkills}
            disabled={isActive}
            className='w-full text-slate-400/70 uppercase font-bold transition-all hover:text-slate-300 disabled:opacity-50 text-sm'
          >
            Reset All
          </button>
        </main>
      </div>
    </div>
  );
}

export default App;