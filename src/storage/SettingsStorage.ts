export interface SettingsStorage {
  getVolume(): Promise<number>;
  setVolume(volume: number): Promise<void>;
}
