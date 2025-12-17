import { useState } from 'react';
import { useSkills } from './hooks/useSkills';
import { useTimer } from './hooks/useTimer';
import { InputGroup } from './components/InputGroup';
import { SkillList } from './components/SkillList';
import { SkillEditor } from './components/SkillEditor';
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
  const { skills, activeSkill, setActiveSkill, addSkill, saveSkill, deleteSkill } = useSkills(INITIAL_SKILLS);
  const { isActive, timeLeft, toggleTimer } = useTimer({ 
    skill: activeSkill.tts, 
    intervalTime: activeSkill.interval, 
  });

  return (
    <div className='min-h-screen w-screen bg-slate-900 flex flex-col items-center py-10 px-4 overflow-y-auto'>
      <div className='w-full max-w-md bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-8'>
        <header className='flex justify-between items-center mb-8'>
          <h2 className='text-2xl font-bold text-white uppercase italic tracking-tighter'>Intentionality</h2>
        </header>

        <main className='space-y-6'>
          {/* 1. Timer Display Section */}
          <section>
            {isActive && (
               <div className="text-center py-8 bg-slate-900/50 rounded-xl mb-4">
                 <div className="text-6xl font-mono font-black text-orange-500">{timeLeft}s</div>
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

          {/* 2. Editor Section */}
          <SkillEditor 
            skill={activeSkill} 
            isActive={isActive}
            onUpdate={(updates) => setActiveSkill((prev: Skill) => ({ ...prev, ...updates }))}
            onSave={() => saveSkill(activeSkill)}
            onDelete={() => deleteSkill(activeSkill.id)}
          />

          <hr className="border-slate-700" />

          {/* 3. Navigation Section */}
          <SkillList 
            skills={skills} 
            activeId={activeSkill.id} 
            onSelect={(s) => !isActive && setActiveSkill(s)} 
            onAdd={addSkill}
          />
        </main>
      </div>
    </div>
  );
}

export default App;