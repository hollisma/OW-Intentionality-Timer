// Core ID types (kept simple for now but aligned with V1.0 spec)
export type GameId = 'overwatch' | string;
export type HeroId = string;
export type RoleId = 'tank' | 'damage' | 'support' | 'flex' | string;

export interface Skill {
  id: string;
  gameId: GameId;

  name: string;
  description: string;

  // TTS and timing
  tts: string;
  interval: number; // in seconds

  // Organization fields (arrays to support multiple heroes/roles per skill)
  heroIds: HeroId[];
  roleIds: RoleId[];

  /** Simple metadata strings (e.g. ["Aim", "Positioning", "GameSense"]) */
  tags: string[];

  // Lifecycle / origin flags
  isPreset: boolean;
  isArchived: boolean;

  // Timestamps
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface RoleMeta {
  id: RoleId;
  name: string;
}

export interface HeroMeta {
  id: HeroId;
  name: string;
  roleId: RoleId;
}
