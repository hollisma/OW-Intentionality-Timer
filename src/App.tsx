import { useCallback } from 'react';
import { useTimer } from './hooks/useTimer';
import { SkillList } from './components/SkillList';
import { SkillEditor } from './components/SkillEditor';
import { Settings } from './components/Settings';
import { SkillFiltersPanel } from './components/SkillFiltersPanel';
import { Card } from './components/Card';
import { LocalStorageSettingsStorage } from './storage/LocalStorageSettingsStorage';
import { useSkillStore } from './hooks/useSkillStore';
import { useSkillFilters } from './hooks/useSkillFilters';
import { useSkillReorder } from './hooks/useSkillReorder';
import { useSettings } from './hooks/useSettings';

const settingsStorage = new LocalStorageSettingsStorage();

function App() {
  const { volume, delay, setVolume, setDelay } = useSettings(settingsStorage);
  const { skills, activeSkill, setActiveSkill, addSkill, saveSkill, deleteSkill, resetSkills, reorderSkill } = useSkillStore();
  
  const {
    selectedRoleIds,
    selectedHeroIds,
    sortBy,
    sortDirection,
    filteredAndSortedSkills,
    setSelectedRoleIds,
    setSelectedHeroIds,
    handleSortChange,
  } = useSkillFilters(skills);

  const hasActiveFilters = selectedRoleIds.length > 0 || selectedHeroIds.length > 0;
  const handleReorder = useSkillReorder(skills, filteredAndSortedSkills, reorderSkill, hasActiveFilters);

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
    <div className='min-h-screen w-screen bg-slate-900 flex flex-col items-center py-10 px-4 overflow-y-auto gap-6 scrollbar-app'>
      <div className='w-full max-w-md'>
        <header className='flex justify-between items-center mb-6'>
          <h2 className='text-2xl font-bold text-white uppercase italic tracking-tighter'>Intentionality</h2>
        </header>

        <div className='flex flex-col gap-6'>
          {/* Timer Card */}
          <Card>
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
              className={`w-full py-4 rounded-xl font-black uppercase transition
                ${isActive ? 'text-red-100 bg-red-700 hover:bg-red-600' : 'text-orange-100 bg-orange-700 hover:bg-orange-600'}`}
            >
              {isActive ? 'Stop' : 'Start'}
            </button>
          </Card>

          {/* Editor Card */}
          <Card>
            {hasActiveSkill ? (
              <SkillEditor 
                skill={activeSkill} 
                isActive={isActive}
                onUpdate={handleSkillUpdate}
                onDelete={handleSkillDelete}
              />
            ) : (
              <div className='text-center py-8 text-slate-400'>
                <p className='text-sm'>No skills available. Add a skill to get started.</p>
              </div>
            )}
          </Card>

          {/* Settings, Filters, and Navigation Card */}
          <Card>
            <div className='space-y-6'>
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
                onSortChange={handleSortChange}
              />

              <hr className="border-slate-700" />

              {/* Navigation Section */}
              <SkillList 
                skills={filteredAndSortedSkills} 
                activeId={hasActiveSkill ? activeSkill.id : ''} 
                onSelect={(s) => !isActive && setActiveSkill(s)} 
                onAdd={addSkill}
                onReorder={!isActive ? handleReorder : () => {}}
              />
              
              <button
                onClick={resetSkills}
                disabled={isActive}
                className='w-full text-slate-400/70 uppercase font-bold transition-all hover:text-slate-300 disabled:opacity-50 text-sm'
              >
                Reset All
              </button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default App;