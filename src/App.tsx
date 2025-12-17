import { useState } from 'react';
import { useTimer } from './hooks/useTimer';
import { InputGroup } from './components/InputGroup';

function App() {
  const [skill, setSkill] = useState('Angles');
  const [intervalTime, setIntervalTime] = useState(60);

  const { isActive, timeLeft, toggleTimer } = useTimer({ skill, intervalTime });

  return (
    <div className="h-screen w-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-8">
        
        <header className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white uppercase italic tracking-tighter">
            Intentionality <span className="text-orange-500 not-italic text-sm ml-2">v0.1</span>
          </h2>
        </header>

        <main className="space-y-6">
          <InputGroup 
            label="Focus Skill" 
            value={skill} 
            disabled={isActive} 
            onChange={setSkill} 
          />

          <InputGroup 
            label="Interval (Seconds)" 
            type="number" 
            value={intervalTime} 
            disabled={isActive} 
            onChange={(val) => setIntervalTime(parseInt(val) || 0)} 
          />

          {isActive && (
            <div className="text-center py-4 bg-slate-900/50 rounded-xl border border-slate-700/50">
              <div className="text-6xl font-mono font-black text-orange-500 drop-shadow-[0_0_10px_rgba(234,88,12,0.3)]">
                {timeLeft}<span className="text-2xl">s</span>
              </div>
              <p className="text-[10px] text-slate-500 uppercase tracking-[0.3em] mt-2 animate-pulse">
                Session Active
              </p>
            </div>
          )}
          <button 
            onClick={toggleTimer}
            className={`w-full py-4 rounded-xl font-black uppercase tracking-widest transition-all transform active:scale-[0.98] text-white 
              ${
                isActive 
                ? 'bg-slate-700 hover:bg-red-800' 
                : 'bg-orange-600 hover:bg-orange-500 shadow-2xl shadow-orange-900/20'
              }
            `}
          >
            {isActive ? 'Stop' : 'Start'}
          </button>
        </main>
      </div>
    </div>
  );
}

export default App;