## Project Context – Overwatch TTS Skill Timer

### What We Did in This Session
- **Roadmap rewrite**:
  - Replaced the old `docs/roadmap.md` with a dependency-ordered roadmap aligned to the current vision.
  - Clarified guiding principles: Overwatch Safety (performance + Web Workers), Focus First, Privacy & Ownership, Scalable Platform (multi-game + eventually non-game skills), Safe Social, and Progressive Depth (works both as “just a timer” and as a deep system).
  - Reordered milestones so solo/local play and gamification come before accounts:
    - V0.x: Core loop, Skills 1.0, Local storage (documented as done).
    - V1.0: Skill Model 2.0 & Organization.
    - V1.1: Progress Tracking & Ratings (Gamification 1.0).
    - V1.2: Personalization & Practice Flows (Gamification 1.1, including Simple vs Advanced modes).
    - V1.3: Accounts & Cloud Sync.
    - V1.4: Skills Browser (read-only catalog).
    - V1.5: UGC & Sharing (privacy-by-default, optional social credit on profiles).
    - V2.0+: Multi-game and eventually non-game skills, advanced analytics and social.
  - Added Parking Lot ideas: coach mode, session templates, life skills & mindset practice, offline-first, Overwatch-specific UX polish.

- **V1.0 spec authoring** (`docs/specs/v1.0-skill-model-2.0.md`):
  - Defined the **scope** of V1.0 as “Skill Model 2.0 & Organization”, purely local but forward-compatible with accounts, multi-game, and progress/playlists.
  - Documented **domain models**: `Skill`, `Category`, `Tag`, `HeroMeta`, `RoleMeta`, and ID types; clarified that `isPreset` is an origin flag (presets are still deletable) and `isArchived` is a soft-delete flag used when users “delete” skills.
  - Clarified **tags & categories**:
    - Tags are shared across skills, auto-created on input, normalized and deduplicated by key, and garbage-collected when no skills reference them.
    - Categories are user-defined groups; deleting a category removes its `categoryId` from all skills (no reassignment in V1.0).
  - Defined a **local storage schema** (version `"1"`) with namespaced keys and a simple `UserSettingsV1` shape for filters/sorting.
  - Clarified **schema versioning**:
    - For V1.0, treat `"1"` as the first stable schema; if `schemaVersion` is missing/other, start from defaults and write `"1"` on first save.
    - V0.x → V1.0 migration rules are kept as an example only and are not to be implemented.
  - Outlined a **React architecture**:
    - `SkillStoreState` and `SkillStoreActions` as the central store interface.
    - Component responsibilities for `SkillLayout`, `SkillFiltersPanel`, `SkillList`, `SkillListItem`, `SkillEditor`, and `CategoryManager`.
    - Shared pure selector helpers (e.g. `filterAndSortSkills`) to avoid duplicated logic.
    - Guidance to use selector hooks / split contexts to limit re-renders.
  - Captured **UX behaviours and edge cases**:
    - Defaults for filters/sorting, creation/editing behaviour, and archiving vs hard delete.
    - First-run behaviour with presets and a safe fallback if preset loading fails.
    - Handling empty lists, missing hero/role, corrupted storage and partially invalid `UserSettingsV1` (field-level fallbacks).
    - Performance expectations (few hundred skills/tags) and guidance for future Web Worker offload if needed.

### Next Steps
- **V1.0 implementation (@Engineer)**:
  - Implement the `Skill`/`Category`/`Tag` models and hero/role metadata exactly as described in the V1.0 spec.
  - Implement the `SkillStore` (state + actions) and local-storage-backed persistence (`schemaVersion = "1"`, `owPractice.v1.*` keys), following the archiving and tag/category rules.
  - Wire up the React components (`SkillLayout`, `SkillFiltersPanel`, `SkillList`, `SkillListItem`, `SkillEditor`, and optional `CategoryManager`) to use the store and shared selectors.
  - Ensure UX matches the documented behaviour for filtering, sorting, creation/editing, deletion (archive), and first-run presets.

- **Future architectural work (@Architect)**:
  - Define a concrete `SkillStorage` interface (local vs remote implementation) ahead of V1.3 (Accounts & Cloud Sync) so the store can switch from local storage to a database with minimal change.
  - Draft specs for V1.1 (Progress Tracking & Ratings) and V1.2 (Personalization & Practice Flows), building directly on the V1.0 models and storage.

