import { type SettingsStorage } from './SettingsStorage';

const VOLUME_STORAGE_KEY = 'ow-intentionality-volume';

export class LocalStorageSettingsStorage implements SettingsStorage {
  async getVolume(): Promise<number> {
    try {
      const saved = localStorage.getItem(VOLUME_STORAGE_KEY);
      return saved ? parseFloat(saved) : 1;
    } catch (error) {
      console.error('Error loading volume from localStorage:', error);
      return 1;
    }
  }

  async setVolume(volume: number): Promise<void> {
    try {
      localStorage.setItem(VOLUME_STORAGE_KEY, volume.toString());
    } catch (error) {
      console.error('Error saving volume to localStorage:', error);
      throw error;
    }
  }
}
