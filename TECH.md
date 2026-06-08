# Math Battle — Technical Specification

*For Anand's reference when refactoring. Describes the current implementation — structure, patterns, known debt, and refactoring notes.*

**Last updated:** 2026-06-08  
**Current version:** v1.2

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
12. Online screens: `#online-setup`, `#online-searching`, `#online-ready`, `#online-countdown`, `#online-game`, `#online-result`
13. PvP screens: `#pvp-setup`, `#pvp-game`, `#pvp-handoff`, `#pvp-result`
14. `#profile` — **outside `<script>` tag** (see note below)

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

### `api/online.js` — Online 1v1

```
POST action=search       → join matchmaking queue; returns {status:'searching'|'matched', room_id, slot, p1_name, p2_name}
GET  action=poll_match   → check if matched while waiting; returns same as search
POST action=ready        → mark self as ready; returns {both_ready: bool}
GET  action=poll_ready   → check if both players ready
GET  action=poll_game    → fetch full room state (castle HPs, armies, pending events)
POST action=event        → post an action result (attack, defend, recruit, forfeit); updates my state
POST action=finish       → mark room as finished with winner_name
POST action=cancel       → remove self from queue
```

**Polling strategy:** client calls `poll_game` every 800ms. Compares `pending_event.ts` to `lastEventTs`; if newer and from opponent, applies the event locally.

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

### Online state (`online` object)
```js
online = {
  playerId, playerName, slot, roomId, opponentName,
  myState,   // { castle, maxCastle, army, gold, shields, shieldActive, shieldVal, shieldMax, shieldInterval }
  oppState,  // { castle, maxCastle, army }
  pollInterval, lastEventTs, gameOver,
  panelOpen, action, defendStep, recruitStep, uidCounter
}
```

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
| 🟡 Medium | No error boundary for Supabase failures in online mode | Opponent disconnect currently not handled gracefully — game just stalls |
| 🟡 Medium | `online_queue` and `online_rooms` never get cleaned up | Stale rooms accumulate. Add a cleanup cron or TTL. |
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
