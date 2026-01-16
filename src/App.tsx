import { useState, useEffect } from 'react';
import { useSkills } from './hooks/useSkills';
import { useTimer } from './hooks/useTimer';
import { SkillList } from './components/SkillList';
import { SkillEditor } from './components/SkillEditor';
import { Settings } from './components/Settings';
import { type Skill } from './types/Skill';
import { LocalStorageSkillStorage } from './storage/LocalStorageSkillStorage';
import { LocalStorageSettingsStorage } from './storage/LocalStorageSettingsStorage';

const INITIAL_SKILLS: Skill[] = [
	{
		id: 'off-angle', 
		name: 'Off Angle', 
		description: 'Use off angles to seprarate enemy resources', 
		tts: 'off angles', 
		interval: 20, 
	},
	{
		id: 'target-priority', 
		name: 'Target Priority', 
		description: 'Focus squishies, not the tank', 
		tts: 'target priority', 
		interval: 30, 
	},
	{
		id: 'ult-tracking', 
		name: 'Ult Tracking', 
		description: 'Think of what ults the enemy has', 
		tts: 'ult tracking', 
		interval: 45, 
	},
]

const storage = new LocalStorageSkillStorage();
const settingsStorage = new LocalStorageSettingsStorage();

function App() {
  const [volume, setVolume] = useState<number>(1);
  const [delay, setDelay] = useState<number>(30);

  useEffect(() => {
    settingsStorage.getVolume().then(setVolume);
    settingsStorage.getDelay().then(setDelay);
  }, []);

  const { skills, activeSkill, setActiveSkill, addSkill, saveSkill, deleteSkill, resetSkills, reorderSkill } = useSkills(storage, INITIAL_SKILLS);
  const { isActive, timeLeft, isDelayPhase, toggleTimer } = useTimer({ 
    skill: activeSkill.tts, 
    intervalTime: activeSkill.interval,
    volume: volume,
    delay: delay,
  });

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
          <SkillEditor 
            skill={activeSkill} 
            isActive={isActive}
            onUpdate={(updates) => {
              const updatedSkill = { ...activeSkill, ...updates };
              setActiveSkill(updatedSkill);
              // Auto-save if skill is already in the list
              if (skills.some(s => s.id === activeSkill.id)) {
                saveSkill(updatedSkill);
              }
            }}
            onDelete={() => deleteSkill(activeSkill.id)}
          />

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

          {/* Navigation Section */}
          <SkillList 
            skills={skills} 
            activeId={activeSkill.id} 
            onSelect={(s) => !isActive && setActiveSkill(s)} 
            onAdd={addSkill}
            onReorder={(startIndex, endIndex) => !isActive && reorderSkill(startIndex, endIndex)}
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