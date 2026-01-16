export interface SettingsStorage {
  getVolume(): Promise<number>;
  setVolume(volume: number): Promise<void>;
  getDelay(): Promise<number>;
  setDelay(delay: number): Promise<void>;
}
