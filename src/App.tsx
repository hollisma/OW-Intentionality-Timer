import { useState, useEffect } from 'react';
import { useSkills } from './hooks/useSkills';
import { useTimer } from './hooks/useTimer';
import { SkillList } from './components/SkillList';
import { SkillEditor } from './components/SkillEditor';
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
            isInList={skills.some(s => s.id === activeSkill.id)}
            onUpdate={(updates) => setActiveSkill((prev: Skill) => ({ ...prev, ...updates }))}
            onSave={() => saveSkill(activeSkill)}
            onDelete={() => deleteSkill(activeSkill.id)}
          />

          <hr className="border-slate-700" />

          {/* Volume Slider */}
          <div className="space-y-2">
            <label className="text-slate-400 font-bold uppercase text-sm tracking-[0.2em] block">
              Volume
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => {
                  const newVolume = parseFloat(e.target.value);
                  setVolume(newVolume);
                  settingsStorage.setVolume(newVolume);
                }}
                className="flex-1 h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                style={{
                  background: `linear-gradient(to right, rgb(249 115 22) 0%, rgb(249 115 22) ${volume * 100}%, rgb(51 65 85) ${volume * 100}%, rgb(51 65 85) 100%)`
                }}
              />
              <span className="text-slate-300 font-mono text-sm w-12 text-right">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>

          {/* Delay Input */}
          <div className="space-y-2">
            <label className="text-slate-400 font-bold uppercase text-sm tracking-[0.2em] block">
              Delay (seconds)
            </label>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="0"
                max="300"
                step="1"
                value={delay}
                onChange={(e) => {
                  const newDelay = parseInt(e.target.value, 10) || 0;
                  setDelay(newDelay);
                  settingsStorage.setDelay(newDelay);
                }}
                disabled={isActive}
                className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 font-mono disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

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
            Reset
          </button>
        </main>
      </div>
    </div>
  );
}

export default App;