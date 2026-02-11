# QA Review: V1.0 Skill Model 2.0 Implementation

**Reviewer**: @QA  
**Spec**: `docs/specs/v1.0-skill-model-2.0.md`  
**Date**: 2025-02-11

---

## Executive Summary

The V1.0 implementation delivers **core functionality** (skills with hero/role metadata, filtering, sorting, archiving) but has **significant gaps** versus the spec. Several **bugs and edge cases** should be addressed before considering V1.0 complete. Categories and tags are partially implemented (schema + selector logic) but have **no UI or persistence**.

---

## 1. Compliance with Spec

### ✅ Implemented Well

| Requirement | Status | Notes |
|-------------|--------|-------|
| Skill schema with heroId/roleId | ✅ | Uses `heroIds`/`roleIds` arrays (spec says singular; implementation chose multi-select—acceptable) |
| `ttsText` / `timerSeconds` | ✅ | Implemented as `tts` / `interval`—equivalent |
| `isPreset`, `isArchived` | ✅ | Used correctly; archiving works |
| Static hero/role metadata | ✅ | `overwatchHeroes.ts` with ROLES, HEROES |
| Versioned storage (`owPractice.v1.skills`) | ✅ | Keys and schema version correct |
| Filter/sort logic in selectors | ✅ | `filterAndSortSkills` in `skillSelectors.ts`—pure, no I/O |
| SkillFiltersPanel (role, hero, sort) | ✅ | Hero filters scope to selected roles |
| SkillList, SkillListItem (SkillListCard) | ✅ | Shows name, hero/role, preset badge, description |
| Soft-delete (archive) | ✅ | `deleteSkill` sets `isArchived`, no hard delete |
| First-run presets | ✅ | When no stored skills, loads built-in presets |
| Preset failure fallback | ✅ | Falls back to empty list, app stays functional |
| localStorage try/catch | ✅ | Load/save wrapped with fallbacks |
| loadError separate from isLoading | ⚠️ | Not surfaced to UI; `loadError` not in store |

### ❌ Not Implemented / Gaps

| Requirement | Status | Notes |
|-------------|--------|-------|
| **Categories** (storage, UI, CategoryManager) | ❌ | `Category` type exists; no `owPractice.v1.categories` storage; no category CRUD; no category filters in UI |
| **Tags** (storage, UI, auto-create, GC) | ❌ | `Tag` type exists; no `owPractice.v1.tags` storage; no tag picker in SkillEditor; no tag filters; no auto-create or GC |
| **UserSettingsV1** (persistence) | N/A | Filter/sort can remain session-based per product decision; persistence not required. |
| **SkillStore actions for categories** | ❌ | No `addCategory`, `renameCategory`, `deleteCategory` |
| **SkillStore structure** | ⚠️ | Store has skills + activeSkill; no `categories`, `tags`, or `settings` in shared state |
| **`getHeroById` / `getRoles` helpers** | ⚠️ | No `getHeroById`; `getHeroNames`/`getRoleNames` exist; spec suggests explicit helpers |
| **Pre-fill new skill from filters** | ❌ | Spec: "Pre-fill heroId and roleId from current filters if single value selected"; `addSkill` ignores filters |
| **"No skills match your filters"** | ❌ | Empty filtered list shows nothing; spec requires friendly message + prompt to create/add |
| **`skill: Skill \| null` for create** | ⚠️ | Editor always receives a skill; create flow works via Add → edit, but spec suggests null for "new" mode |

---

## 2. Bugs & Edge Cases

### P0 – Data Loss Risk

**All skills archived → presets overwrite stored data**

- **Location**: `useSkills.ts` load logic
- **Behavior**: When `visibleSkills.length === 0` (all skills archived), code falls into the "no stored skills" path and overwrites storage with `initialData` (presets).
- **Impact**: User archives all custom skills; on reload, archived skills are replaced by presets.
- **Fix**: Only use presets when `storedSkills.length === 0`. If all skills are archived, keep `storedSkills`, set `activeSkill` to `null` or first archived skill, and show suitable empty state.

### P1 – Functional / UX

**Interval = 0 causes timer issues**

- **Location**: `SkillEditor.tsx` (accepts 0), `useTimer.ts` (uses `intervalTime` directly)
- **Behavior**: `intervalTime === 0` leads to instant reset and repeated TTS.
- **Fix**: Enforce `interval >= 1` in validation (e.g. in `skillDefaults` and editor).

**"General" skills (no hero/role) hidden when filters active**

- **Location**: `skillSelectors.ts` filter logic
- **Behavior**: Skills with `roleIds: []` or `heroIds: []` are excluded when role/hero filters are applied (`skill.roleIds.some(...)` is false for empty arrays).
- **Spec**: "Skills with missing or unknown heroId/roleId: Treat as 'General' skills."
- **Clarification**: Spec is ambiguous; typical UX: "General" skills show when "all" is selected and possibly when any filter is selected. Document intended behavior and implement consistently.

**Empty filtered list shows no message**

- **Location**: `SkillList` / `App.tsx`
- **Behavior**: When filters return no skills, list is empty with no guidance.
- **Spec**: "Show a friendly 'No skills match your filters' state with a prompt to create/add skills."
- **Fix**: Render an empty state when `filteredAndSortedSkills.length === 0` and `skills.length > 0`.

### P2 – Minor / Polish

**Sort direction not updated when changing sort field**

- **Location**: `SkillFiltersPanel.tsx` select `onChange`
- **Behavior**: `onSortChange(e.target.value, sortDirection)` keeps current direction; some users may expect a default direction when changing sort field.
- **Note**: Current behavior is acceptable; document if intentional.

**Partially corrupted `UserSettingsV1`**

- **Spec**: "If any settings field is invalid or missing... fall back to documented default."
- **Status**: N/A—filter/sort kept session-based; no persistence needed.

---

## 3. Overwatch Safety (Performance)

- **Filter/sort**: Pure function, memoized in `useSkillFilters` ✅  
- **No heavy work in render**: Appropriate use of `useMemo` ✅  
- **localStorage**: Reads on load, writes on change; no obvious thrashing ✅  
- **Selector hooks**: Single `useSkillStore()` returns full state; consider selector-based subscriptions if re-renders become an issue ⚠️  

**Verdict**: No major performance concerns for expected scale (hundreds of skills).

---

## 4. Recommendations for @Engineer

### Must Fix (P0)

1. **Archive overwrite bug**: Change load logic so presets are used only when `storedSkills.length === 0`.

### Should Fix (P1)

2. **Interval validation**: Enforce `interval >= 1` in defaults and editor.  
3. **Empty filtered state**: Add "No skills match your filters" (and optionally "Clear filters" / "Add skill") when filters return empty.  
4. **General skills behavior**: Decide and implement whether General skills appear when filters are active.

### Consider for V1.0 Completion

5. **Categories & tags**: Implement storage, category CRUD, and tag picker if targeting full spec compliance.  
6. **Pre-fill from filters**: When adding a skill, pre-fill hero/role from filters when exactly one is selected.

### Optional / Future

7. **Archive toggle**: Add optional filter to show archived skills for restore/debug.  
8. **`getHeroById` helper**: Add for consistency with spec and reuse.  
9. **`loadError` in store**: Expose load errors for optional "Data may have been reset" messaging.

### Preset Skills Update

10. **Add hero-specific and role-specific presets**: Current presets have no roles/heroes associated. Add the following to demonstrate filtering:
    - **Kiriko – TP then Suzu**  
      - Hero: Kiriko  
      - Description: Use Swift Step to your teammate, then Suzu to save them. Prioritize TP before Suzu so you're in position to cleanse.  
      - TTS: "TP then Suzu" (or similar)  
      - Interval: e.g. 45s  
    - **Tanks – Engage with team**  
      - Role: Tank  
      - Description: Before engaging, check that your team is ready and together. Don't push in alone—wait for your team to be in position so everyone engages together.  
      - TTS: "Engage with team" (or similar)  
      - Interval: e.g. 30s  

---

## 5. Summary Checklist

| Area | Status |
|------|--------|
| Core skill model (hero, role, gameId) | ✅ |
| Categories & tags (full) | ❌ |
| Storage (skills, schema version) | ✅ |
| UserSettingsV1 storage | N/A (session-based) |
| Filter/sort UI | ✅ (role, hero, sort) |
| Category/tag filters | ❌ |
| SkillEditor (hero, role) | ✅ |
| SkillEditor (categories, tags) | ❌ |
| Archive vs delete | ✅ |
| Empty states | ⚠️ (partial) |
| Pre-fill new skill | ❌ |
| Archive overwrite bug | ❌ P0 |
| Interval = 0 | ❌ P1 |
| General skills in filters | ⚠️ (needs decision) |

**Verdict**: Implementation is **usable** but not fully spec-compliant. Address P0 and P1 issues before release; categories/tags are the main remaining spec gaps. Add hero/role-specific presets to demonstrate filtering.
