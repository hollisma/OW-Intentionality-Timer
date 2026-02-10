import { useState, useEffect } from 'react';
import type { SettingsStorage } from '../storage/SettingsStorage';

export function useSettings(settingsStorage: SettingsStorage) {
  const [volume, setVolume] = useState<number>(1);
  const [delay, setDelay] = useState<number>(30);

  useEffect(() => {
    settingsStorage.getVolume().then(setVolume);
    settingsStorage.getDelay().then(setDelay);
  }, [settingsStorage]);

  return {
    volume,
    delay,
    setVolume,
    setDelay,
  };
}
