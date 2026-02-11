import { type SettingsStorage } from '../storage/SettingsStorage';
import { InputGroup } from './ui/InputGroup';

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
      <InputGroup
        label="Volume"
        type="slider"
        value={volume}
        min={0}
        max={1}
        step={0.01}
        onChange={(val) => {
          const newVolume = parseFloat(val);
          onVolumeChange(newVolume);
          settingsStorage.setVolume(newVolume);
        }}
        formatValue={(val) => `${Math.round(val * 100)}%`}
      />

      {/* Delay Input */}
      <InputGroup
        label="Delay (seconds)"
        type="number"
        value={delay}
        disabled={isActive}
        onChange={(val) => {
          const newDelay = parseInt(val, 10) || 0;
          onDelayChange(newDelay);
          settingsStorage.setDelay(newDelay);
        }}
      />
    </>
  );
};
