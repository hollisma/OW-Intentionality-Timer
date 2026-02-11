**Problem**: It’s easy to lose focus on intentional skill practice during high-stress Overwatch matches.  
**Goal**: A lightweight assistant that periodically "pokes" the player to stay intentional with specific skills.  
**Primary Success Metric**: Higher percentage of games where the player self-rates their intentionality/learning as 4–5 / 5.

## Guiding Principles
- **Overwatch Safety (Performance)**: Keep the app ultra light-weight. Any heavy logic that can run in a Web Worker **must** run in a Web Worker. Minimize main-thread work so Overwatch FPS is never affected.
- **Focus First**: Every feature should reinforce intentional practice, not distract (e.g. short flows, quick edits, minimal clicks in between matches).
- **Privacy & Ownership**: Users own their data. Log in to sync across devices, but local/offline still feels great.
- **Scalable Platform**: Design the data model and UX so we can eventually support other games, and eventually non-game skills (mindset, life skills, etc.).
- **Safe Social**: Sharing and browsing skills should be helpful and low friction, but also safe from spam/abuse.
- **Progressive Depth**: The app should feel great as “just a TTS timer” for low-involvement users, while offering deep features (playlists, charts, social) for users who want to go all‑in. Advanced features should be discoverable but never overwhelming.

## Milestone Overview (High-Level Priority)
- **Completed (V0.x)**: Core TTS loop, basic skills, local storage.
- **Near-Term (V1.0–V1.2)**: Better skill model & organization, responsive desktop/mobile layout, per-skill progress and ratings, and a more “game-like” personal experience—still fine if used purely locally.
- **Medium-Term (V1.3–V1.5)**: Accounts & cloud sync, skill browsing, sharing, guides, and workout programs.
- **Long-Term (V2.0+)**: Multi-game support (and eventually non-game skills), richer social features, and advanced analytics—without breaking the “Overwatch Safety” rule.

---

## V0.x – Shipped Foundations

### V0.1 – Core Loop (DONE)
- [x] Basic React UI with customizable timer.
- [x] Hook up Web Speech API (`window.speechSynthesis`) for one voice.
- [x] Play custom TTS on timer expiration.

### V0.2 – Skills 1.0 (DONE)
- [x] Store multiple skills.
  - [x] Each skill has description, TTS text, timer (and room for progress data later).
- [x] Skill presets with common skills.

### V0.3 – Local Storage & Resets (DONE)
- [x] Store skills in local storage.
- [x] Add functionality to reset skills to default.

---

## V1.0 – Skill Model 2.0 & Organization
**Goal**: Redesign skills so they can be organized by hero, role, and tags—and so the same system can later support non-Overwatch games. Categories are scrapped; Playlists will come in V1.2.

- [x] **Skill Schema Redesign**
  - [x] Add fields for game, hero, role (e.g. `gameId`, `heroIds`, `roleIds`).
  - [x] Ensure schema can represent multiple games.
  - [ ] Add tags as simple string array on Skill (e.g. `tags: ["Aim", "Positioning", "GameSense"]`).
- [x] **Organization & Filtering**
  - [x] Group and filter skills by hero and role.
  - [x] Sort skills (by name, role, hero, created).
  - [ ] Filter skills by tags (when tags are implemented).
- [x] **UI/UX Pass for Skill List**
  - [x] Hero/role filter panel for quick switching of which skills are visible.
  - [x] Sort controls.

**Dependency notes**:  
This milestone lays the foundation for better personal practice flows, browsing skills, sharing them, and expanding beyond Overwatch. See `docs/specs/v1.0-tags-and-categories.md` for tags (P1) and playlists (V1.2).

---

## V1.0.5 – Responsive Layout & Desktop Space Efficiency
**Goal**: Revamp the UI so the app feels space-efficient on desktop while remaining mobile-first and fully responsive across all screen sizes.

- [ ] **Responsive Layout System**
  - [ ] Define breakpoints: mobile (single-column), tablet (optional two-column), desktop (split-panel layout).
  - [ ] Layout adapts smoothly at each breakpoint—no jarring jumps; components reflow as expected.
- [ ] **Desktop Split-Panel Layout**
  - [ ] **Left (or primary) panel**: Timer, settings, and skill selection/filters—the “control center” for the session.
  - [ ] **Right (or secondary) panel**: Skill info, description, and details for the currently selected skill.
  - [ ] Panels can be collapsible or resizable on larger screens (optional polish).
- [ ] **Mobile Preservation**
  - [ ] Keep current mobile-friendly, single-column stacked layout as the default for small screens.
  - [ ] Stack timer → skill selection → skill info vertically on mobile; no horizontal split.
- [ ] **Performance Guardrails**
  - [ ] Layout changes must be CSS-first (flexbox/grid, media queries); avoid heavy JS for responsive behavior.
  - [ ] Ensure resize/reflow does not cause main-thread jank during Overwatch (layout thrashing).

**Design suggestions**:
- Consider a ~768px breakpoint for tablet and ~1024px for desktop split-panel.
- On desktop, the left panel could be ~40% width and the right ~60%, or fixed min-widths to keep content readable.
- If space allows, a collapsible right panel (e.g. sidebar that slides in/out) could maximize timer visibility when the user only needs the controls.

**Dependency notes**:  
Can be implemented alongside or after V1.0 skill model work. Improves UX for desktop/second-screen users without impacting mobile users.

---

## V1.1 – Progress Tracking & Ratings (Gamification 1.0)
**Goal**: Make practice feel like a game: track how often a skill is used, how a match felt, and show progress over time.

- [ ] **Post-Game Rating Flow**
  - [ ] Simple post-game “rating” for intentionality or success per skill (e.g. 1–5 scale).
  - [ ] Track number of games per skill and aggregate stats.
- [ ] **Per-Skill Progress Tracking**
  - [ ] Store rating data and number of games per skill.
  - [ ] Show progress summaries per skill (e.g. trend over time, streaks).
- [ ] **Lightweight Dashboard**
  - [ ] Overview screen for: “Which skills am I actually practicing?” and “What’s getting better?”
- [ ] **Performance Guardrails**
  - [ ] Ensure all tracking is low-cost and batched (e.g. write to storage between games, not mid-fight).

**Dependency notes**:  
Uses the richer skill model from V1.0. Can be implemented locally first and later enhanced to sync via accounts/cloud.

---

## V1.2 – Personalization & Practice Flows (Gamification 1.1)
**Goal**: Help users structure their own practice sessions and make the app feel more “game-like” without needing other users yet.

- [ ] **Practice Playlists / Workouts**
  - [ ] Create “playlists” of skills (e.g. “Tank Fundamentals”, “Ranked Tank Session”, “Warmup”, “Scrim Checklist”).
  - [ ] **User flow**: "I'm playing Tank today, so I'll start my 'Tank Fundamentals' playlist."—provides a clear path rather than just a filtered list.
  - [ ] Quickly swap which playlist is active for the session.
- [ ] **Goals & Reminders**
  - [ ] Optional daily/weekly goals (e.g. “Use this skill in 5 games”).
  - [ ] Gentle reminders between matches to update ratings or adjust skills.
- [ ] **Hero/Role-Focused Views**
  - [ ] Views tailored to Tank/DPS/Support (or future roles), surfacing relevant skills and playlists.
- [ ] **Involvement / Depth Controls**
  - [ ] Preference for “Simple” vs “Advanced” mode (e.g. just timer + skills vs. full playlists/charts/social).
  - [ ] Progressive disclosure in the UI so advanced features appear when the user goes looking for them, not all at once.

**Dependency notes**:  
Builds directly on V1.0 organization and V1.1 progress data. All of this should work great for fully local users even before accounts exist.

---

## V1.3 – Accounts & Cloud Sync (Data > Private)
**Goal**: Move from purely local storage to per-user cloud storage, enabling login, multi-device sync, and future sharing—while keeping things fast and simple.

- [ ] **Authentication MVP**
  - [ ] Basic login (e.g. email/password or a single OAuth provider).
  - [ ] Secure session management on the frontend.
- [ ] **Database & Data Model v1**
  - [ ] Per-user storage for skills, playlists, and progress data.
  - [ ] Sync skills and progress between devices.
  - [ ] Migration path from local storage → user account (import local skills and history after login).
- [ ] **Overwatch Safety Check**
  - [ ] Ensure login/database calls are off the critical path during a match (e.g. sync between matches, aggressively cache locally).

**Dependency notes**:  
This milestone is a prerequisite for shared skills, multi-device usage, and reliable long-term progress history across devices.

---

## V1.4 – Skills Browser (Read-Only Catalog)
**Goal**: Let users browse a curated catalog of skills and quickly add them to their own list.

- [ ] **Skills Browser Page**
  - [ ] NavBar with Home page and Skills Browser page.
  - [ ] Browse skills by hero, role, tags, popularity, and recency.
- [ ] **Import to My Skills**
  - [ ] One-click “Add to my skills” flow that copies a skill into the user’s account.
  - [ ] Allow lightweight customization after import (e.g. tweak TTS wording or timer).
- [ ] **Curation Pipeline (MVP)**
  - [ ] Simple way to seed the catalog with built-in skills and a few “official” guides.

**Dependency notes**:  
Requires V1.0 accounts/database and V1.1’s generalized skill model.

---

## V1.5 – UGC & Sharing (Skills 3.0)
**Goal**: Let users create skills and share them, and let others discover and adopt them. Start moving toward a small community of practice.

- [ ] **Visibility & Privacy Defaults**
  - [ ] Skills and playlists are **private by default**.
  - [ ] Users can explicitly mark individual skills or playlists as “shareable/public”.
  - [ ] Clear UI that shows what’s public vs. private, and easy ways to revert something to private.
- [ ] **Publishing Skills & Playlists**
  - [ ] Publish public skills and playlists to the global catalog.
  - [ ] Attribute skills/playlists to their creator.
- [ ] **Guides & Workout Programs**
  - [ ] User-created guides that bundle multiple skills and short writeups.
  - [ ] Workout/program flows (e.g. “do these 3 skills for 10 games this week”).
- [ ] **Browsing & Social Signals**
  - [ ] Browse skills/guides by popularity, rating, or role.
  - [ ] Optional simple reactions (e.g. “helpful” count) to surface good content.
- [ ] **Profiles & Social Credit (Optional)**
  - [ ] Simple creator profiles that can show aggregate “social credit” (e.g. total adds/likes of their public skills/playlists).
  - [ ] Controls for what is shown on a profile (e.g. hide social metrics, keep profile effectively anonymous).
- [ ] **Safety & Moderation (MVP)**
  - [ ] Basic abuse controls (e.g. report button, simple filters on text fields).

**Dependency notes**:  
Builds on accounts, the browser, and the shared skill schema. This is the first step toward a social platform.

---

## V2.0+ – Multi-Game Platform & Advanced Features
**Goal**: Evolve from “Overwatch practice helper” to a general-purpose intentional practice assistant for multiple games and, eventually, non-game skills—while preserving Overwatch performance guarantees.

- [ ] **Multi-Game Support**
  - [ ] Generalize “hero/role” into a more flexible “character/class/role” model per game.
  - [ ] Game-specific presets and catalogs (e.g. different skill libraries per game).
- [ ] **Advanced Analytics**
  - [ ] Deeper history views (trendlines, comparisons between skills, time spent per role).
  - [ ] Optional integrations (if they don’t violate performance constraints) for richer data.
- [ ] **Richer Social Features (Optional/Future)**
  - [ ] Following creators, sharing playlists, collaborative programs.
  - [ ] Community curation (e.g. upvoting, collections) with strong moderation tools.

---

## Parking Lot / Ideas to Discuss
- **Coach Mode**: Flows or templates designed for coaches to set up skills/playlists for their players.
- **Session Templates**: Pre-built routines for common goals (e.g. “Climb as Support”, “Warmup for Scrims”).
- **Life Skills & Mindset Practice**: Adapting the same intentional-practice loop for non-game domains (e.g. reframing mindsets, communication skills, habit-building).
- **Offline-First Enhancements**: Make sure all core flows work even without a network connection; sync later when online.
- **Overwatch-Specific UX Polish**: Quick-toggle overlays or second-screen modes that feel natural between matches.

We can adjust milestone names, split or merge versions (e.g. separate progress vs. ratings), and reprioritize based on what you’re most excited to build next. Let me know which milestones you’d like to emphasize or de-scope, and we can refine this roadmap further.
