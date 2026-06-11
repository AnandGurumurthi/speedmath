# Math Battle — Technical Specification

*For Anand's reference when refactoring. Describes the current implementation — structure, patterns, known debt, and refactoring notes.*

> **Editing rule:** Always append. Never delete or overwrite existing content. When something changes (e.g. a file is split, debt is resolved, a new API is added), add a new dated section or annotate the existing entry with "✅ Resolved in vX.Y" or "Updated in vX.Y". The full technical evolution of this project must be preserved.

**Last updated:** 2026-06-11  
**Current version:** v1.4

---

## File Structure

```
speedmath/
├── index.html          # Entire frontend (~3000 lines: HTML + CSS + JS)
├── api/
│   ├── scores.js       # Leaderboard API (Supabase proxy)
│   └── online.js       # Online 1v1 API (matchmaking + game events)
├── manifest.json       # PWA manifest
├── icon.svg            # App icon (SVG)
├── package.json        # { "engines": { "node": "24.x" } } — pins Vercel Node version
├── SPEC.md             # Product specification
├── TECH.md             # This file — technical specification
└── STORY.md            # Build narrative
```

---

## index.html Structure

The file has three sections in order:

```
<head>
  <style>                  ← All CSS (~400 lines)
  </style>
</head>
<body>
  <!-- screens 1–15 -->    ← All HTML (~600 lines)
  <script>                 ← All JavaScript (~2000 lines)
  </script>
  <!-- profile screen -->  ← Outside script tag (historical accident, valid HTML)
</body>
```

### CSS organisation (inside `<style>`)
- CSS variables (`:root`) — colour palette
- Reset + body layout
- Background elements (sky, stars, moon, ground)
- Screen base (`.screen`, `.screen.active`)
- Per-screen styles in rough screen order
- Component styles (buttons, warrior cards, math panel, badges, PvP, online)

### HTML screens (inside `<body>`, before `<script>`)
In DOM order:
1. `#intro` — title screen
2. `#mainmenu` — main menu
3. `#instructions` — how to play
4. `#difficulty` — difficulty picker
5. `#menu` — math type picker
6. `#prestart` — pre-game summary
7. `#countdown` — 5..4..3..2..1
8. `#game` — main battle screen
9. `#gameover` — defeat screen
10. `#victory` — win screen
11. `#leaderboard` — global leaderboard
12. Online Battle screens: `#online-setup`, `#online-searching`, `#online-ready`, `#online-countdown`, `#online-game`, `#online-result`
13. Speed Battle screens: `#speed-setup`, `#speed-game`, `#speed-result` — `#online-searching`, `#online-ready`, `#online-countdown` are **shared** with Online Battle (mode determined by `currentOnlineMode` variable)
14. Team Battle screens: `#team-setup`, `#team-game`, `#team-result` — also shares `#online-searching`, `#online-ready`, `#online-countdown` (same `currentOnlineMode` pattern, value `'team'`)
15. PvP screens: `#pvp-setup`, `#pvp-game`, `#pvp-handoff`, `#pvp-result` — **hidden from menu** (Pass & Play button has `display:none`; screens still exist in DOM)
15. `#profile` — **outside `<script>` tag** (see note below)

> ⚠️ **Known debt:** `#profile` ended up after the closing `</script>` tag due to an earlier insertion accident. This is valid HTML and works correctly, but is inconsistent with the other screens. Fix: move it inside `<body>` before `<script>` during next refactor.

### JavaScript sections (inside `<script>`)

| Section | Lines (approx) | Description |
|---------|---------------|-------------|
| CONFIG | ~30 | `DIFF`, `UNIT_DEFS`, `ENEMY_DEFS`, `WAVES`, `AVATARS`, `BADGE_CATS` constants |
| STATE | ~15 | All `let` declarations for game state |
| HELPERS | ~15 | `rnd()`, `uid()`, `shuffle()`, `generateWrongAnswers()`, `pickOp()` |
| WARRIOR ROLES | ~30 | `handleUnitTap()`, `setAttacker()`, `setDefender()`, `getEffectiveAttacker/Defender()` |
| GAME TIMER | ~20 | `startGameTimer()`, `stopGameTimer()`, `formatTime()` |
| PAUSE | ~20 | `togglePause()` |
| ONLINE 1v1 | ~300 | All `online*` and `ol*` functions |
| SPEED BATTLE | ~280 | All `sp*` and `speed*` functions; `currentOnlineMode` var |
| TEAM BATTLE | ~310 | All `team*` and `tm*` functions; `team` state object |
| LEADERBOARD | ~50 | `submitScore()`, `renderLeaderboard()`, `openLeaderboard()` |
| PROFILE & BADGES | ~150 | `loadStats/saveStats`, badge checking, `renderProfileScreen()`, `saveProfile()`, `resetStats()` |
| NAVIGATION | ~20 | `chooseDiff()`, `chooseMath()`, `showScreen()` |
| COUNTDOWN | ~20 | `beginCountdown()`, `actuallyStartGame()` |
| APPROACH TIMER | ~25 | `startApproachTimer()`, `updateApproachBar()`, `enemyAutoAttack()` |
| ANSWER TIMER | ~25 | `startAnswerTimer()`, `updateAnswerBar()`, `onAnswerTimeout()` |
| MATH PANEL | ~60 | `clickAction()`, `openMathPanel()`, `closeMathPanel()`, `cancelAction()`, `generateQuestion()` |
| CHECK ANSWER | ~50 | `checkAnswer()`, `executeAction()` |
| COMBAT | ~60 | `doAttack()`, `doBuyUnit()`, `enemyHitsPlayer()`, `updateAttackDiffLabel()` |
| PVP | ~270 | All `pvp*` functions |
| WAVE SYSTEM | ~40 | `spawnWave()`, `waveComplete()` |
| POTIONS | ~60 | `updatePotionDisplay()`, `clickPotion()`, `potionClickUnit()`, `potionClickCastle()`, etc. |
| RENDER | ~40 | `render()`, `updateHUD()` |
| ANIMATIONS | ~30 | `flashUnit()`, `flashSide()`, `flashBase()`, `showBattleMsg()`, `showMpFeedback()` |
| GAME END | ~30 | `gameOver()`, `victoryScreen()`, `retreat()` |
| SCREEN NAV | ~10 | `showScreen()` |
| EVENT LISTENER | ~8 | Player army click handler (potion + role tap) |

---

## API Routes

### `api/scores.js` — Leaderboard

```
GET  /api/scores?difficulty=medium   → top 10 rows sorted by time_secs asc
POST /api/scores                     → insert score, return rank (0-indexed, -1 if not top 10)
```

Proxies directly to Supabase REST API. No npm packages — uses Node `fetch`.  
Reads `process.env.SUPABASE_URL` and `process.env.SUPABASE_KEY`.

### `api/online.js` — Online 1v1 + Speed Battle

```
POST action=search       → join matchmaking queue; returns {status:'searching'|'matched', room_id, slot, p1_name, p2_name}
                           Speed players have player_id starting with "sp-"; API filters so sp- players only match other sp- players
GET  action=poll_match   → check if matched while waiting; returns same as search
POST action=ready        → mark self as ready; returns {both_ready: bool}
GET  action=poll_ready   → check if both players ready
GET  action=poll_game    → fetch full room state (castle HPs, armies, pending events)
POST action=event        → post an action result (attack, defend, recruit, forfeit, speed_progress); updates my state
                           Speed Battle repurposes my_state.shields to carry wavesDone (0, 1, or 2)
POST action=finish       → mark room as finished with winner_name
POST action=cancel       → remove self from queue
```

**Polling strategy:** client calls `poll_game` every 800ms. Online Battle: compares `pending_event.ts` to `lastEventTs`; applies opponent event locally. Speed Battle: reads `p{oppSlot}_shields` as opponent's waves completed.

**Mode detection (no schema change):** Speed players use `player_id = "sp-" + uuid`. Team players use `player_id = "co-" + uuid`. API filters each prefix to only match players of the same mode. Client tracks mode via `currentOnlineMode` variable (`'battle'`, `'speed'`, or `'team'`). The shared `#online-searching / #online-ready / #online-countdown` screens are reused for all three modes; at countdown end, `currentOnlineMode` decides whether to call `olStartGame()`, `spStartGame()`, or `teamStartGame()`.

**Team Battle shared state (no schema change):** Team mode stores all shared game state in the `p1_*` columns (p1_castle, p1_army, p1_gold). The `p1_army` column is repurposed as a JSON blob: `{ _co: true, army, enemies, waveIdx, wavesDone, lastApproachReset, ts }`. When either player posts a state update, they use `event_type: 'co_state'` which forces the API to always write to `p1_*` regardless of slot. Both players read `p1_army` on every poll. Last write wins — occasional micro-conflicts are acceptable. Winner posted as `"TEAM"` (co-op win) or `"ENEMY"` (castle fell).

---

## State Management

### Single-player game state (global `let` vars)
```js
gold, baseHP, maxBaseHP, waveIdx, score, totalKills, totalGoldEarned
myUnits, enemies, uidCounter
selectedDiff, selectedMath, difficulty, mathMode
currentAnswer, choiceValues
panelOpen, pendingAction, busy, recruitStep
approachVal, approachMax, approachInterval
answerVal, answerMax, answerInterval
potions, answerStreak, potionMode, potionVal, potionMax, potionInterval
gameElapsedSecs, gameTimerInterval
paused, castleDamagedThisGame
attackerUnitId, defenderUnitId
tapCounts, tapTimers
badgeQueue, badgeShowing
```

### PvP state (`pvp` object)
```js
pvp = {
  p: [player0, player1],   // each: { name, castle, maxCastle, army, gold, shields, shieldActive, shieldVal, shieldMax, shieldInterval }
  cur,                     // current player index (0 or 1)
  action, defendStep, recruitStep, uidCounter, over
}
```

### Online Battle state (`online` object)
```js
online = {
  playerId, playerName, slot, roomId, opponentName,
  myState,   // { castle, maxCastle, army, gold, shields, shieldActive, shieldVal, shieldMax, shieldInterval }
  oppState,  // { castle, maxCastle, army }
  pollInterval, lastEventTs, gameOver,
  panelOpen, action, defendStep, recruitStep, uidCounter
}
```

### Speed Battle state (`speed` object)
```js
speed = {
  playerId, playerName, slot, roomId, opponentName,
  castle, maxCastle,
  army,        // player's warriors
  gold,
  enemies,     // current wave's enemies (array)
  waveIdx,     // 0 or 1 (which wave the player is on)
  wavesDone,   // 0, 1, or 2 (waves completed — shared with opponent via p_shields column)
  oppWavesDone,// opponent's waves completed (read from poll_game)
  panelOpen, action, recruitStep, uidCounter,
  pollInterval, gameOver,
  approachVal, approachMax, approachInterval,  // enemy approach timer
}
```

### Team Battle state (`team` object)
```js
team = {
  playerId, playerName, slot, roomId, opponentName,
  // shared with teammate (synced via server):
  castle, maxCastle,
  army,              // shared warrior array
  gold,              // shared gold
  enemies,           // current wave's enemies (shared)
  waveIdx,           // 0, 1, or 2 (current wave)
  wavesDone,         // 0, 1, 2, or 3 (waves completed)
  lastApproachReset, // timestamp — used to sync approach timer reset across clients
  lastReadTs,        // timestamp of last state blob we consumed from server
  panelOpen, action, recruitStep, uidCounter,
  pollInterval, gameOver,
  approachVal, approachMax, approachInterval,
}
```

### Mode tracking
```js
let currentOnlineMode = 'battle'; // or 'speed' or 'team'
```
Set to `'speed'` in `speedSearch()`, `'team'` in `teamSearch()`, reset to `'battle'` in `onlineCancelSearch()` and after game ends.

### Persistent state (localStorage)
```js
localStorage['mb_profile']  // { name, avatar }
localStorage['mb_stats']    // { wins, losses, correct, mistakes, kills, dragons, potionsUsed, maxStreak, perfectWins, bestTime, topDifficulty, bestTimes, bestScores, totalScore }
localStorage['mb_badges']   // { [catId]: tierIndex }  e.g. { victories: 2, dragon: 0, ... }
```

---

## Known Technical Debt

| Priority | Issue | Notes |
|----------|-------|-------|
| 🔴 High | `#profile` screen is outside `<script>` tag | Works fine but structurally wrong. Move inside `<body>` before `<script>`. |
| 🟡 Medium | All JS in one `<script>` block, ~2000 lines | Could split into logical sections with ES modules if moved to multi-file structure |
| 🟡 Medium | No error boundary for Supabase failures in online mode | Opponent disconnect currently not handled gracefully — game just stalls (affects both Online Battle and Speed Battle) |
| 🟡 Medium | `online_queue` and `online_rooms` never get cleaned up | Stale rows accumulate. Includes speed battle rows. Add a cleanup cron or TTL. |
| 🟡 Medium | Speed Battle "same questions" is approximate | Both players generate questions independently with the same difficulty settings. Not truly seeded-identical because action order diverges. Good enough for fun; a true shared seed would require pre-generating questions server-side. |
| 🟡 Medium | Phone/small screen layout not optimised | Reported: buttons too small, scrolling issues on phones |
| 🟢 Low | `tapTimers` and `tapCounts` objects grow unboundedly | Reset them in `actuallyStartGame()`. Minor leak. |
| 🟢 Low | Inline styles used heavily throughout HTML | Could be moved to CSS classes for consistency |
| 🟢 Low | PvP and Online each duplicate the math panel HTML with different ID prefixes | Could share a single floating panel overlay |

---

## Patterns / Conventions

**Screen switching:** `showScreen(id)` removes `.active` from all `.screen` elements, adds it to the target. CSS handles `display:none` → `display:block/flex`. Some screens override with `#id.active { display:flex }` for centering.

**Timer pattern:** All timers follow the same shape:
```js
let xVal, xMax, xInterval;
function startXTimer() { clearInterval(xInterval); xMax=N*10; xVal=xMax; xInterval=setInterval(()=>{ xVal--; update(); if(xVal<=0) onTimeout(); }, 100); }
function stopXTimer() { clearInterval(xInterval); }
```
100ms tick = 0.1 second resolution. Multiply seconds by 10 for tick counts.

**Multi-step actions:** `recruitStep` / `defendStep` / `pvp.defendStep` track progress. Each correct answer increments the step. When step reaches the target, action completes.

**Badge checking:** `checkAndAwardBadges(stats)` is called after any stat change. It loops all badge categories, checks if the current tier's goal is met, advances the tier, saves badge state, and returns earned badges as an array. Callers do `.forEach(showBadgeNotification)`.

**API calls:** All API calls to `/api/scores` and `/api/online` use raw `fetch` with `Content-Type: application/json`. No libraries. Error handling is minimal — most failures are silently caught.

---

## Refactoring Suggestions (for Anand)

If splitting the single file into multiple files:

```
src/
├── css/
│   ├── base.css           # reset, variables, body, screens
│   ├── game.css           # HUD, battlefield, unit cards, math panel
│   ├── menus.css          # intro, difficulty, weapon, prestart
│   ├── pvp.css            # pvp + online screens
│   └── profile.css        # profile, badges
├── js/
│   ├── config.js          # DIFF, UNIT_DEFS, ENEMY_DEFS, WAVES, BADGE_CATS, AVATARS
│   ├── state.js           # all let declarations
│   ├── helpers.js         # rnd, uid, shuffle, generateWrongAnswers, pickOp
│   ├── game.js            # main game loop, timers, math panel, combat, wave system
│   ├── potions.js         # potion system
│   ├── roles.js           # warrior role selection (tap)
│   ├── profile.js         # localStorage stats, badges, renderProfileScreen
│   ├── pvp.js             # pass & play 1v1
│   ├── online.js          # online 1v1
│   └── nav.js             # showScreen, chooseDiff, chooseMath
└── index.html             # thin shell — imports all above
```

This would require a build step (Vite or esbuild) or using ES module `<script type="module">` imports. Vercel handles both easily.

> **Note:** Anand flagged wanting to do this refactor. Aditya doesn't need to be involved — it's a pure code restructuring with no feature changes.

---

## 📋 Refactor TODO — Planned for a Dedicated Session (2026-06-07)

**Why:** Aditya will keep building features all summer. At ~3000 lines the file is still splittable cleanly. Waiting until 5000+ lines mid-summer makes the surgery riskier.

**Approach:** ES modules via `<script type="module">` — no build tool needed, Vercel serves them natively. Zero feature changes, zero visual changes.

**Step-by-step order** (each step: move code → verify game works → commit):

1. **Fix `#profile` placement** — move it from after `</script>` to inside `<body>` before `<script>`. 30-second change, lowest risk, do this first.

2. **Extract `src/js/config.js`** — `DIFF`, `UNIT_DEFS`, `ENEMY_DEFS`, `WAVES`, `AVATARS`, `BADGE_CATS`. Pure data, no dependencies. Easiest first module.

3. **Extract `src/js/helpers.js`** — `rnd()`, `uid()`, `shuffle()`, `generateWrongAnswers()`, `pickOp()`. No DOM dependencies.

4. **Extract `src/js/state.js`** — all `let` declarations for game state, pvp object, online object. Import config here.

5. **Extract `src/js/nav.js`** — `showScreen()`, `chooseDiff()`, `chooseMath()`. Light DOM, easy to isolate.

6. **Extract `src/js/profile.js`** — `loadStats/saveStats`, badge checking, `renderProfileScreen()`, `saveProfile()`, `resetStats()`. Self-contained localStorage module.

7. **Extract `src/js/roles.js`** — `handleUnitTap()`, `setAttacker()`, `setDefender()`, `getEffectiveAttacker/Defender()`.

8. **Extract `src/js/potions.js`** — all `potion*` functions. Touches DOM + state but cleanly bounded.

9. **Extract `src/js/pvp.js`** — all `pvp*` functions (~270 lines). Keep `pvp` state object here.

10. **Extract `src/js/online.js` (frontend)** — all `online*` and `ol*` functions (~300 lines). Keep `online` state object here.

11. **Extract `src/js/game.js`** — everything remaining: timers, math panel, combat, wave system, render, animations, game end. This is the largest chunk — do last when all dependencies are already clean modules.

12. **Extract CSS** — split `<style>` block into `src/css/base.css`, `game.css`, `menus.css`, `pvp.css`, `profile.css`. Link all from `<head>`. Do after JS is stable.

13. **Thin out `index.html`** — replace `<script>` block with `<script type="module" src="src/js/game.js">` (game.js imports everything else). Replace `<style>` with `<link>` tags.

**After each step:** open the game in browser, run through: single-player game, PvP handoff, Online matchmaking, Profile/badges. All must work identically.

**Risk mitigations:**
- One step per commit — easy to bisect if something breaks
- Keep a `index.html.bak` until the refactor is fully verified
- Don't change any logic, variable names, or DOM IDs during the refactor — purely move code

---

## 📋 Testing TODO — To Be Set Up Alongside the Refactor (2026-06-07)

**Why:** Every new feature Aditya adds risks breaking existing ones (timers, combat math, badge logic, PvP state). Tests catch regressions before deploy. The refactor into ES modules is the prerequisite — you can't unit test logic that's buried in a monolithic HTML file.

**Stack:**
- **Vitest** — unit tests for pure logic. Zero config, works natively with ES modules, runs in milliseconds.
- **Playwright** — E2E smoke tests for critical game flows. Runs a real browser, catches DOM/timer/interaction bugs.
- **GitHub Actions** — runs both suites on every push to main. Blocks deploy if tests fail.

---

### Unit Tests (Vitest)

Install: `npm install -D vitest`  
Run: `npx vitest run` (or `vitest` for watch mode)  
Add to `package.json`: `"test": "vitest run"`

**What to test — by module:**

`config.js`
- All difficulty values are present and have the expected keys
- All UNIT_DEFS have cost, hp, dmg, recruitQs
- WAVES has exactly 5 entries

`helpers.js`
- `rnd(min, max)` always returns value within range
- `generateWrongAnswers(correct, count)` returns `count` values, none equal to `correct`, all within ±20% spread
- `pickOp(mathMode)` returns only valid operators for the selected mode
- `uid()` returns unique values across 1000 calls

`game logic (extracted from game.js)`
- `generateQuestion(unit, diff, mathMode)` — answer matches the operation, numbers within expected range
- Score calculation — correct answer adds expected points
- Enemy HP scaling — `scaledHP = baseHP × (1 + kills × 0.15)` at various kill counts

`profile.js`
- `checkAndAwardBadges(stats)` — awards badge when threshold is met, not before
- Badge tier advances correctly (tier 0 → 1 → 2)
- `loadStats()` returns defaults when localStorage is empty

`pvp.js`
- Shield timer only counts down during opponent's turn, not owner's
- Attack damage applies to opponent's frontmost warrior, not castle, if warrior exists
- Defend fail gives opponent a free hit

---

### E2E Tests (Playwright)

Install: `npm install -D @playwright/test && npx playwright install chromium`  
Run: `npx playwright test`  
Config: `playwright.config.js` pointing at `http://localhost:3000` (or Vercel preview URL)

**Smoke test flows (one test file per flow):**

`tests/single-player.spec.js`
- Load game → click Start → pick Easy → pick Addition → game screen appears
- Answer a question correctly → score increases, approach bar resets
- Answer wrong → enemy counter-attacks (warrior HP decreases)
- Let approach bar fill → enemy auto-attacks
- Kill all wave 1 enemies → wave 2 starts
- Castle HP reaches 0 → game over screen appears

`tests/victory.spec.js`
- Complete all 5 waves → victory screen appears
- Submit name to leaderboard → leaderboard shows entry

`tests/pvp.spec.js`
- Enter two player names → PvP game screen shows both names and armies
- Player 1 attacks → handoff screen appears
- Player 2 taps to start turn → their army is shown

`tests/profile.spec.js`
- Open profile → stats grid renders without error
- Pick avatar → persists after navigating away and back
- Enter name → persists after navigating away and back

`tests/leaderboard.spec.js`
- Open leaderboard → renders without JS error (even if Supabase returns empty)

---

### CI Setup (GitHub Actions)

Create `.github/workflows/test.yml`:

```yaml
name: Test
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 24
      - run: npm ci
      - run: npm test                          # Vitest unit tests
      - run: npx playwright install chromium
      - run: npx playwright test               # E2E smoke tests
```

**When to add tests for a new feature:**
- Any new function in `helpers.js`, `config.js`, or `profile.js` → add a unit test immediately
- Any new screen or game flow → add an E2E smoke test before merging
- Any bug fix → add a regression test first, then fix

**Do the refactor first, then set up Vitest, then Playwright.** Order matters — you can't write meaningful unit tests until the logic is in importable modules.
