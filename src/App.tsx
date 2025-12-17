import { useState } from 'react';
import { InputGroup } from './components/InputGroup';
import { SkillList } from './components/SkillList';
import { useTimer } from './hooks/useTimer';
import { type Skill } from './types/Skill';

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

function App() {
  const [activeSkill, setActiveSkill] = useState<Skill>(INITIAL_SKILLS[0]);

  const { isActive, timeLeft, toggleTimer } = useTimer({ 
    skill: activeSkill.tts, 
    intervalTime: activeSkill.interval, 
  });

  const handleManualUpdate = (updates: Partial<Skill>) => {
    setActiveSkill(prev => ({...prev, ...updates}));
  }

  return (
    // Changed to min-h-screen and py-10 so long lists can scroll
    <div className='min-h-screen w-screen bg-slate-900 flex flex-col items-center py-10 px-4 overflow-y-auto'>
      
      <div className='w-full max-w-md bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-8'>
        <header className='mb-8 text-center'>
          <h2 className='text-3xl font-bold text-white uppercase italic tracking-tighter'>
            Intentionality <span className='text-orange-500 not-italic text-sm ml-2'>v0.1</span>
          </h2>
        </header>

        <main className='space-y-6'>
          {/* Manual Overrides */}
          <InputGroup 
            label='Current Focus' 
            value={activeSkill.name} 
            disabled={isActive} 
            onChange={(val) => handleManualUpdate({ name: val, tts: `Reminder: ${val}` })} 
          />

          <InputGroup 
            label='Interval (Seconds)' 
            type='number' 
            value={activeSkill.interval} 
            disabled={isActive} 
            onChange={(val) => handleManualUpdate({ interval: parseInt(val) || 0 })} 
          />

          {isActive && (
            <div className='text-center py-4 bg-slate-900/50 rounded-xl border border-slate-700/50'>
              <div className='text-6xl font-mono font-black text-orange-500 drop-shadow-[0_0_10px_rgba(234,88,12,0.3)]'>
                {timeLeft}<span className='text-2xl'>s</span>
              </div>
              <p className='text-[10px] text-slate-500 uppercase tracking-[0.3em] mt-2 animate-pulse'>
                Session Active
              </p>
            </div>
          )}

          <button 
            onClick={toggleTimer}
            className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all transform active:scale-[0.98] text-white 
              ${isActive 
                ? 'bg-slate-700 hover:bg-red-800' 
                : 'bg-orange-600 hover:bg-orange-500 shadow-2xl shadow-orange-900/20'
              }
            `}
          >
            {isActive ? 'Stop' : 'Start'}
          </button>

          <hr className='border-slate-700 my-6' />

          {/* 5. The Skill List Integration */}
          <SkillList 
            skills={INITIAL_SKILLS} 
            activeId={activeSkill.id} 
            onSelect={(s) => !isActive && setActiveSkill(s)} 
          />
        </main>
      </div>
    </div>
  );
}

export default App;