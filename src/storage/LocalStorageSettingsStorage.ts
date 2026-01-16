import { type SettingsStorage } from './SettingsStorage';

const VOLUME_STORAGE_KEY = 'ow-intentionality-volume';
const DELAY_STORAGE_KEY = 'ow-intentionality-delay';

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

  async getDelay(): Promise<number> {
    try {
      const saved = localStorage.getItem(DELAY_STORAGE_KEY);
      return saved ? parseInt(saved, 10) : 30;
    } catch (error) {
      console.error('Error loading delay from localStorage:', error);
      return 30;
    }
  }

  async setDelay(delay: number): Promise<void> {
    try {
      localStorage.setItem(DELAY_STORAGE_KEY, delay.toString());
    } catch (error) {
      console.error('Error saving delay to localStorage:', error);
      throw error;
    }
  }
}
