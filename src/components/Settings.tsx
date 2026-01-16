import { type SettingsStorage } from '../storage/SettingsStorage';

interface SettingsProps {
  volume: number;
  delay: number;
  isActive: boolean;
  settingsStorage: SettingsStorage;
  onVolumeChange: (volume: number) => void;
  onDelayChange: (delay: number) => void;
}

export const Settings = ({ 
  volume, 
  delay, 
  isActive, 
  settingsStorage, 
  onVolumeChange, 
  onDelayChange 
}: SettingsProps) => {
  return (
    <>
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
              onVolumeChange(newVolume);
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
              onDelayChange(newDelay);
              settingsStorage.setDelay(newDelay);
            }}
            disabled={isActive}
            className="flex-1 px-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-300 font-mono disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>
      </div>
    </>
  );
};
