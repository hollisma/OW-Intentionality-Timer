import { useCallback } from 'react';
import type { Skill } from './types/Skill';
import { useTimer } from './hooks/useTimer';
import { SkillList } from './components/SkillList';
import { SkillEditor } from './components/SkillEditor';
import { Settings } from './components/Settings';
import { SkillFiltersPanel } from './components/SkillFiltersPanel';
import { Card } from './components/ui/Card';
import { AppShell } from './components/layout/AppShell';
import { PracticePageLayout } from './components/layout/PracticePageLayout';
import { LocalStorageSettingsStorage } from './storage/LocalStorageSettingsStorage';
import { useSkillStore } from './hooks/useSkillStore';
import { useSkillFilters } from './hooks/useSkillFilters';
import { useSkillReorder } from './hooks/useSkillReorder';
import { useSettings } from './hooks/useSettings';
import { useToast } from './hooks/useToast';

const settingsStorage = new LocalStorageSettingsStorage();

function App() {
  const { volume, delay, setVolume, setDelay } = useSettings(settingsStorage);
  const { skills, activeSkill, setActiveSkill, addSkill, saveSkill, deleteSkill, restoreSkill, resetSkills, reorderSkill } = useSkillStore();
  const { showToast } = useToast();

  const {
    selectedRoleIds,
    selectedHeroIds,
    selectedTags,
    availableTags,
    sortBy,
    sortDirection,
    filteredAndSortedSkills,
    setSelectedRoleIds,
    setSelectedHeroIds,
    toggleTag,
    handleSortChange,
    clearFilters,
  } = useSkillFilters(skills);

  const hasActiveFilters = selectedRoleIds.length > 0 || selectedHeroIds.length > 0 || selectedTags.length > 0;
  const handleReorder = useSkillReorder(skills, filteredAndSortedSkills, reorderSkill, hasActiveFilters);

  const hasActiveSkill = activeSkill && skills.length > 0;

  const { isActive, timeLeft, isDelayPhase, toggleTimer } = useTimer({
    skill: hasActiveSkill ? activeSkill.tts : '',
    intervalTime: hasActiveSkill ? activeSkill.interval : 60,
    volume: volume,
    delay: delay,
  });

  const handleSkillUpdate = useCallback(
    (updates: Partial<typeof activeSkill>) => {
      if (!hasActiveSkill) return;
      const updatedSkill = { ...activeSkill, ...updates };
      setActiveSkill(updatedSkill);
      if (skills.some((s) => s.id === activeSkill.id)) {
        saveSkill(updatedSkill);
      }
    },
    [activeSkill, skills, setActiveSkill, saveSkill, hasActiveSkill]
  );

  const handleSkillDelete = useCallback(() => {
    if (!hasActiveSkill) return;
    const skillToDelete = { ...activeSkill };
    deleteSkill(skillToDelete.id);
    showToast(skillToDelete.name ? `Removed ${skillToDelete.name}` : 'Skill deleted', {
      onUndo: () => restoreSkill(skillToDelete),
      duration: 4500,
    });
  }, [activeSkill, deleteSkill, restoreSkill, showToast, hasActiveSkill]);

  const handleDeleteSkillFromList = useCallback(
    (skill: Skill) => {
      const skillToDelete = { ...skill };
      deleteSkill(skillToDelete.id);
      showToast(skillToDelete.name ? `Removed ${skillToDelete.name}` : 'Skill deleted', {
        onUndo: () => restoreSkill(skillToDelete),
        duration: 4500,
      });
    },
    [deleteSkill, restoreSkill, showToast]
  );

  const timerSlot = (
    <Card>
      {isActive && (
        <div className="text-center py-8 bg-slate-900/50 rounded-xl mb-4">
          <div className="text-6xl font-mono font-black text-orange-500">{timeLeft}s</div>
          {isDelayPhase && <div className="text-sm text-slate-400 mt-2 uppercase tracking-wide">Delay</div>}
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
  );

  const controlsSlot = (
    <Card>
      <div className="space-y-6">
        <Settings
          volume={volume}
          delay={delay}
          isActive={isActive}
          settingsStorage={settingsStorage}
          onVolumeChange={setVolume}
          onDelayChange={setDelay}
        />

        <hr className="border-slate-700" />

        <SkillFiltersPanel
          selectedRoleIds={selectedRoleIds}
          selectedHeroIds={selectedHeroIds}
          selectedTags={selectedTags}
          availableTags={availableTags}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onRoleFilterChange={setSelectedRoleIds}
          onHeroFilterChange={setSelectedHeroIds}
          onTagToggle={toggleTag}
          onSortChange={handleSortChange}
          onClearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />

        <hr className="border-slate-700" />

        <SkillList
          skills={filteredAndSortedSkills}
          activeId={hasActiveSkill ? activeSkill.id : ''}
          onSelect={(s) => !isActive && setActiveSkill(s)}
          onAdd={addSkill}
          onDelete={handleDeleteSkillFromList}
          onReorder={!isActive ? handleReorder : () => {}}
          showEmptyFilteredState={hasActiveFilters && skills.length > 0}
          onClearFilters={clearFilters}
        />

        <button
          onClick={resetSkills}
          disabled={isActive}
          className="w-full text-slate-400/70 uppercase font-bold transition-all hover:text-slate-300 disabled:opacity-50 text-sm"
        >
          Reset All
        </button>
      </div>
    </Card>
  );

  const detailSlot = (
    <Card>
      {hasActiveSkill ? (
        <SkillEditor
          skill={activeSkill}
          allSkills={skills}
          isActive={isActive}
          onUpdate={handleSkillUpdate}
          onDelete={handleSkillDelete}
        />
      ) : (
        <div className="text-center py-8 text-slate-400">
          {skills.length === 0 ? (
            <p className="text-sm">No skills available. Add a skill to get started.</p>
          ) : (
            <p className="text-sm">Select a skill from the list to edit it.</p>
          )}
        </div>
      )}
    </Card>
  );

  return (
    <AppShell maxWidth="xl">
      <header className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white uppercase italic tracking-tighter">Intentionality</h2>
      </header>

      <PracticePageLayout timerSlot={timerSlot} controlsSlot={controlsSlot} detailSlot={detailSlot} />
    </AppShell>
  );
}

export default App;
