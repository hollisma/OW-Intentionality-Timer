import { useState, useEffect, useRef } from 'react';

function App() {
  // --- State ---
  const [skill, setSkill] = useState<string>('Angles');
  const [intervalTime, setIntervalTime] = useState<number>(60);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(intervalTime);

  // --- Refs (to keep track of the timer and speech without re-renders) ---
  const timerRef = useRef<number | null>(null);
  const synth = window.speechSynthesis;

  // --- Speech Function ---
  const speak = (text: string) => {
    if (synth.speaking) synth.cancel(); // Stop current speech to stay synced
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9; 
    synth.speak(utterance);
  };

  // --- Timer Logic ---
  useEffect(() => {
    if (isActive && timeLeft > 0) {
      // Countdown every second
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      // Trigger the "Poke" and Reset
      speak(`Reminder: ${skill}`);
      setTimeLeft(intervalTime);
    }

    // Cleanup: This stops the timer if the component unmounts or isActive changes
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, skill, intervalTime]);

  const toggleSession = () => {
    if (!isActive) {
      setTimeLeft(intervalTime);
      speak(`Starting session. Focus on ${skill}`);
    } else {
      synth.cancel();
    }
    setIsActive(!isActive);
  };

  return (
    <div className="h-screen w-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-800 rounded-2xl border border-slate-700 shadow-2xl p-8">
        
        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white uppercase italic">Intentionality</h2>
        </div>

        {/* Inputs */}
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Focus Skill</label>
            <input 
              type="text" 
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              disabled={isActive}
              className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-orange-500 outline-none disabled:opacity-50 transition"
              placeholder="e.g. Ult Tracking"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase">Interval (Seconds)</label>
            <input 
              type="number" 
              value={intervalTime}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setIntervalTime(val);
                if (!isActive) setTimeLeft(val);
              }}
              disabled={isActive}
              className="bg-slate-950 border border-slate-700 rounded-lg p-3 text-white focus:border-orange-500 outline-none disabled:opacity-50 transition"
            />
          </div>

          {/* Visualization of Timer */}
          {isActive && (
            <div className="text-center py-4">
              <div className="text-5xl font-mono font-bold text-orange-500 mb-2">
                {timeLeft}s
              </div>
              <p className="text-xs text-slate-500 uppercase animate-pulse">Session Active</p>
            </div>
          )}

          {/* Action Button */}
          <button 
            onClick={toggleSession}
            className={`w-full py-4 rounded-xl font-black uppercase tracking-wider transition-all transform active:scale-95 ${
              isActive 
              ? 'bg-slate-700 hover:bg-red-600 text-white' 
              : 'bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_20px_rgba(234,88,12,0.4)]'
            }`}
          >
            {isActive ? 'Stop Training' : 'Initialize Session'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;