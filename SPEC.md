# Math Battle — Product Specification

> **Editing rule:** Always append. Never delete or overwrite existing content. Add new version rows, new feature sections, and updated notes. The full history of how this product evolved must be preserved.

**Live URL:** https://speedmath-gamma.vercel.app  
**GitHub:** https://github.com/AnandGurumurthi/speedmath  
**Built by:** Aditya (age 10) with Claude  
**Last updated:** 2026-06-08  
**Current version:** v1.2

---

## Version History

| Version | Date | What Was Built |
|---------|------|----------------|
| v0.1 | 2026-06-05 | Basic math game — questions, HP bar, gold, difficulty picker, math type picker |
| v0.2 | 2026-06-05 | Army system — 4 warrior types, 5 enemy types, 5 waves, approach bar, gold economy |
| v0.3 | 2026-06-05 | Wave unlock system, 4-choice tap buttons (iPad), auto-replace weakest warrior |
| v0.4 | 2026-06-05 | Dark fantasy visual redesign (Cinzel/Bebas Neue fonts, glows, gradients) |
| v0.5 | 2026-06-05 | Multi-step recruit (1–5 questions per warrior), healing potions (streak of 4) |
| v0.6 | 2026-06-05 | Deployed to Vercel + GitHub auto-deploy, PWA manifest for iPad home screen |
| v0.7 | 2026-06-06 | Global leaderboard via Supabase (top 10 per difficulty, time + score) |
| v0.8 | 2026-06-06 | Node.js 24.x fix, leaderboard SQL permissions fixed |
| v0.9 | 2026-06-07 | Pause button, larger button text, approach bar resets on enemy kill |
| v0.10 | 2026-06-07 | Renamed to "Math Battle", cleaner intro screen, main menu flow |
| v0.11 | 2026-06-07 | Profile page (stats, avatar, personal bests), 30 tiered badges, mid-game badge notifications |
| v0.12 | 2026-06-07 | Warrior role selection (2× tap = defender, 3× tap = attacker) |
| v1.0 | 2026-06-07 | 1v1 Pass & Play — turn-based local battle with shields, recruit, handoff screen |
| v1.1 | 2026-06-08 | 1v1 Online — real-time matchmaking, Supabase-backed, simultaneous play |
| v1.2 | 2026-06-08 | Shield timer fixed (pauses on owner's turn), total score in profile, retreat = loss |

---

## Screen Flow

```
intro → [START] → mainmenu
  mainmenu
    ├── [Play] → difficulty → math type → prestart → countdown → game
    │                                                   game → gameover
    │                                                   game → victory → leaderboard
    ├── [1v1 Pass & Play] → pvp-setup → pvp-game ⇄ pvp-handoff (loop) → pvp-result
    ├── [1v1 Online] → online-setup → online-searching → online-ready → online-countdown → online-game → online-result
    ├── [Leaderboard] → leaderboard
    ├── [Profile] → profile
    └── [How to Play] → instructions
```

---

## Feature Specifications

---

### 1. Difficulty System

**Four difficulty levels** selectable before every game:

| Difficulty | Enemy approach (secs) | Answer timer (secs) | Castle HP | Start gold | Gold per correct | Max number | Max multiplier |
|-----------|----------------------|--------------------|-----------|-----------|-----------------|-----------|----|
| 🟢 Easy | 20 | 15 | 150 | 40 | 15 | 10 | 5 |
| 🟡 Medium | 12 | 10 | 100 | 30 | 12 | 25 | 12 |
| 🟠 Hard | 7 | 6 | 75 | 20 | 10 | 50 | 15 |
| ☠️ Impossible | 4 | 4 | 50 | 10 | 8 | 100 | 20 |

The **approach timer** controls how fast the red bar fills at the top of the battlefield. When it reaches 100%, the current enemy automatically attacks the player. This cannot be stopped except by answering a question (which opens the math panel, pausing the approach bar).

The **answer timer** is the per-question time limit shown as a green→yellow→red countdown bar inside the math panel.

---

### 2. Math Types

Players choose one before each game:
- ➕ Addition
- ➖ Subtraction
- ✖️ Multiplication
- ➗ Division
- ⚡ All Operations (random each question)

The question difficulty scales with the active warrior — harder warriors (Mage, Dragon) use larger numbers.

---

### 3. Multiple Choice Answer System

Every math question shows **4 tap buttons** with the correct answer placed randomly. Wrong answers are generated within a ±20% spread of the correct answer (minimum spread of 3) to avoid obviously wrong options. This replaced keyboard input to make the game iPad-friendly.

---

### 4. Warrior System

**Five warrior types** with escalating cost, damage, HP, and math difficulty:

| Warrior | Emoji | HP | Dmg | Cost | Recruit Qs | Bonus time | Math scale |
|---------|-------|----|-----|------|-----------|-----------|-----------|
| Soldier | 🗡️ | 4 | 1 | 10 💰 | 1 | — | ×1.0 |
| Archer | 🏹 | 3 | 2 | 25 💰 | 2 | +3 sec | ×1.5 |
| Mage | 🔮 | 2 | 4 | 45 💰 | 3 | +6 sec | ×3.0 |
| Charioteer | 🏇 | 6 | 2 | 60 💰 | 4 | +9 sec | ×2.0 |
| Dragon Rider | 🐉 | 5 | 7 | 90 💰 | 5 | +12 sec | ×3.5 |

**Math scale** multiplies the difficulty setting's `maxNum` and `multMax` when calculating the attack math question. The frontmost warrior (or selected attacker) sets the math difficulty for Attack actions.

**Army limit:** Maximum 4 warriors per side.

---

### 5. Wave Unlock System

Warriors unlock after completing specific waves:

| Wave completed | Warrior unlocked |
|----------------|-----------------|
| Start of game | 🗡️ Soldier |
| Wave 1 | 🏹 Archer |
| Wave 2 | 🔮 Mage |
| Wave 3 | 🏇 Charioteer |
| Wave 4 | 🐉 Dragon Rider |

Locked warriors show 🔒 and their unlock wave on the action button. Clicking a locked warrior shows an error message instead of opening the math panel.

---

### 6. Multi-Step Recruit System

Recruiting a warrior requires answering multiple questions correctly **in a row**:
- Soldier/Attack: 1 question at the difficulty's base timer
- Archer: 2 questions, each with +3 seconds added to the base timer
- Mage: 3 questions, each with +6 seconds
- Charioteer: 4 questions, each with +9 seconds
- Dragon Rider: 5 questions, each with +12 seconds

**If any step is answered incorrectly:** the recruit fails, enemy gets a free counter-attack, and gold is NOT spent. The player must start the recruit from step 1 again.

**If all steps answered correctly:** gold is deducted and the warrior joins the army. If the army is full (4 warriors), the weakest warrior (lowest gold cost) is automatically removed to make room. If the new warrior is weaker than the current weakest, the recruit is blocked.

---

### 7. Auto-Replace Weakest Warrior

When the army is at max capacity (4) and the player tries to recruit a stronger warrior, the weakest warrior is automatically removed without confirmation. If the player tries to recruit a warrior weaker than or equal to the current weakest, the action is blocked with a message.

**Weakness is determined by gold cost** (not HP or damage). Soldier (10) < Archer (25) < Charioteer (60) < Mage (45) < Dragon (90).

---

### 8. Enemy Waves

Five waves with increasing difficulty. Enemy HP and damage also scale with total kills in the session (`scaledHP = basHP × (1 + totalKills × 0.15)`):

| Wave | Enemies |
|------|---------|
| 1 | 4× Grunt 💀 |
| 2 | 3× Grunt 💀, 2× Earcher 🎯 |
| 3 | 2× Earcher 🎯, 2× Knight 🛡️ |
| 4 | 3× Knight 🛡️, 1× Beast 🐗 |
| 5 | 2× Knight 🛡️, 2× Beast 🐗, 1× Boss 👿 (The Warlord) |

Each enemy has a randomly assigned name from a pool of 20 dark fantasy names (e.g. "Shadow Blade", "Blood Axe", etc.). The Boss is always named "The Warlord".

**Between waves:** the player earns a gold bonus (50 × wave number), and the castle auto-heals 20% of max HP if it took damage.

**Approach bar reset:** When an enemy is killed, the approach bar resets to 0%, giving the player a brief reprieve.

---

### 9. Combat Flow

**Player attacks:**
1. Player clicks ⚔️ Attack button
2. Math panel opens; question difficulty set by player's frontmost warrior (or selected attacker)
3. Player taps correct answer within the timer
4. **Correct:** player's frontmost warrior (or selected attacker) deals its damage to the first enemy. If enemy HP reaches 0, enemy is removed. If all enemies are dead, wave complete.
5. **Wrong:** math panel shows correct answer, enemy counter-attacks (see below). Approach bar does not reset.
6. **Timeout:** same as wrong answer.

**Enemy counter-attack (wrong answer / timeout):**
- The first enemy deals its damage to the player's first warrior (or selected defender).
- If the warrior's HP reaches 0, it is removed from the army.
- If the player has no warriors, the enemy deals `enemy.dmg × difficulty.dmgMult` damage to the castle.
- If the castle HP reaches 0, game over.

**Enemy auto-attack (approach bar fills):**
- Same as counter-attack logic.
- Approach bar resets to 0 after firing.

---

### 10. Warrior Role Selection

Players can designate which warrior attacks and which absorbs damage:

- **Double-tap** a warrior card → sets as **🛡️ Defender** (absorbs all enemy hits). Card glows blue.
- **Triple-tap** a warrior card → sets as **⚔️ Attacker** (deals damage, sets attack math difficulty). Card glows gold.
- If the same warrior is both: card glows purple with ⚔️🛡️ badge.
- If no warrior is explicitly selected, the first warrior in the army (index 0) is used for both roles.
- Roles reset to null when the designated warrior dies or is replaced.
- **Tap window:** 420ms to register multi-tap. Single tap is ignored.

---

### 11. Healing Potions

**Earning:** Every 4 correct answers in a row earns 1 potion. Displayed as a streak counter. Max 5 potions stored.

**Using:**
1. Tap the 🧪 button next to the castle
2. The battlefield enters "potion mode" — all warrior cards and the castle glow and pulse
3. A 4-second countdown bar appears
4. Tap a **warrior** to fully restore its HP
5. Tap the **🏰 castle** to restore 30% of max castle HP
6. Multiple potions can be used within the 4-second window
7. If time expires or potions run out, potion mode ends automatically

**Potion mode pauses** the approach bar (enemy cannot auto-attack during the 4-second window).

---

### 12. Pause Feature

A **⏸ Pause** button appears in the top-right of the game screen. When tapped:
- The enemy approach bar stops progressing
- If a math question is open, the answer timer freezes
- The game clock stops
- A full-screen overlay appears with a **▶ Resume** button

Resuming restores all timers exactly where they left off.

---

### 13. Game Timer and Leaderboard

A timer runs from the start of each game and counts total elapsed seconds. It is shown in the HUD.

On **victory**, the player can enter their name and submit their score to the global leaderboard. The leaderboard stores:
- Player name
- Completion time (seconds)
- Score
- Difficulty

The leaderboard shows the **top 10 fastest times per difficulty**. Ties broken by time ascending. The leaderboard is accessible from the main menu and from the victory screen.

**Score calculation:**
- +5 points per correct answer
- `+unit.dmg × 10` points per hit
- `+enemy.reward × 5` points per enemy killed
- `+waveBonus × 10` per wave completed (50 × wave number)

---

### 14. Profile System

Accessible from the main menu. All data stored locally in `localStorage`.

**Layout:**
- **Left/Centre:** Stats grid (wins, losses, correct answers, mistakes, total score) + Personal Bests table
- **Right:** Avatar picker (12 emoji options) + name input

**Stats tracked:**
- Wins / Losses
- Total correct answers / Total mistakes
- Total cumulative score (all games, win or lose)
- Personal best time per difficulty
- Personal best score per difficulty

**Avatar:** Pick from 12 fantasy emoji (⚔️🏹🔮🐉🧙🦸🛡️👑🌟🔥⚡🏰). Saved immediately on tap.

**Name:** Type name, tap ✓ to save.

**Reset:** A red "Reset All Stats & Badges" button at the bottom clears all stats and badge progress (with confirmation).

---

### 15. Badge System

**30 total badges** across 9 categories, each with 3–4 tiers. Completing a tier moves it to the ✅ Completed section and activates the next harder tier.

| Category | Tier 1 | Tier 2 | Tier 3 | Tier 4 |
|----------|--------|--------|--------|--------|
| 🏆 Victories | Win 1 | Win 5 | Win 15 | Win 50 |
| 🗡️ Enemies | Defeat 10 | Defeat 50 | Defeat 200 | Defeat 500 |
| 🐉 Dragon | Recruit 1 | Recruit 5 | Recruit 15 | — |
| ⚡ Speed | Win <5 min | Win <3 min | Win <2 min | — |
| 🔥 Streak | 4 correct | 8 correct | 12 correct | — |
| 📚 Scholar | 50 correct | 200 correct | 500 correct | — |
| 🧪 Healer | Use 5 potions | Use 20 | Use 50 | — |
| 🛡️ Defender | 1 perfect win | 3 perfect wins | 5 perfect wins | — |
| ☠️ Difficulty | Win Medium | Win Hard | Win Impossible | — |

**Perfect win:** winning without the castle taking any damage.

**Mid-game badge notifications:** When a badge is earned during a game, a small gold card slides in from the right side of the screen for ~3 seconds, showing the badge emoji and name. Multiple badges queue and show one at a time.

---

### 16. 1v1 Pass & Play

**Setup:** Both players enter their names. Each starts with 2 Soldiers, 100 castle HP, 30 gold.

**Turn structure:**
1. Current player sees their castle HP, army, opponent's castle HP and army, and their gold.
2. Current player chooses an action (Attack / Defend / Recruit warrior).
3. Math panel opens. Player answers questions.
4. Result is shown briefly.
5. Handoff screen appears: "Pass to [Name] — cover the screen!" with a tap-to-start button.
6. Next player taps to reveal their turn.

**Actions:**
- **⚔️ Attack (1 question, medium timer, hard numbers):** Your frontmost warrior deals its damage to the opponent's frontmost warrior (or their castle if they have no warriors). Wrong answer = opponent's frontmost warrior gets a free hit on your frontmost warrior (or your castle).
- **🛡️ Defend (3 questions, same timer):** Earns 1 shield (up to 5 stored). If any step is wrong, defend fails and opponent gets a free hit.
- **Recruit warrior:** Same multi-step system as single player. All warriors available (no wave lock). Wrong answer = opponent gets a free hit.

**Shields:**
- Tap the 🛡️×N button next to your HP bar at **any time** — even during the opponent's turn.
- Activates a 5-second full protection window.
- The shield timer **pauses during the shield owner's own turn** and only counts down during the opponent's turn.
- While active: any attack that would hit the castle is completely blocked and the shield is consumed.
- A countdown bar shows remaining shield time.

**Win condition:** Opponent's castle HP reaches 0.

---

### 17. 1v1 Online (Real-Time)

**Matchmaking:**
1. Enter name, tap 🔍 Search.
2. Server checks the `online_queue` table for another searching player.
3. If found: a room is created, both players are notified with each other's names.
4. If not found: player waits and polls every 1.8 seconds.
5. Both players see the Contestants screen with both names.
6. Both tap ⚔️ Ready. When both are ready, the 5..4..3..2..1 countdown begins.

**Game:**
- Both players act **simultaneously** — no turns.
- Poll every 800ms for opponent state changes.
- Each correct attack answer fires immediately and is posted to the server.
- The opponent's client receives the attack event and applies damage to their own state.
- **No pause button.**
- **Forfeit** = instant loss (counts as a loss in profile stats).

**Actions:** Same as Pass & Play (Attack, Defend/Shields, Recruit) — all warriors available, no wave lock.

**Win condition:** Opponent's castle HP reaches 0. The finishing player posts a "finish" event to the server with the winner name. The opponent sees the result on their next poll.

**Disconnect / stale rooms:** Currently not handled. If a player closes their browser, the game stalls for the other player. Planned fix: add last-ping timestamps and auto-forfeit after 30 seconds of inactivity.

---

### 18. Forfeit / Retreat

- In the **main single-player game:** tapping "← Retreat to Menu" counts as a **loss** and saves the current score to profile stats.
- In **online 1v1:** tapping "🏳️ Forfeit" (with confirmation) counts as a loss, the opponent wins, and the result is posted to the server.
- In **pass & play:** no explicit forfeit — players can just stop.

---

## Known Issues / Backlog

| Status | Item |
|--------|------|
| ✅ Fixed | Approach bar resets on enemy kill |
| ✅ Fixed | PvP shield timer pauses during owner's turn |
| ✅ Fixed | Retreat counts as a loss |
| ✅ Fixed | Leaderboard Supabase permissions |
| ✅ Fixed | Node.js version for Vercel |
| 📋 Planned | Phone / small screen layout improvements |
| 📋 Planned | Updated How to Play (shorter, with per-section detail screens) |
| 📋 Planned | Background music (epic during battle, calm on menus) |
| 📋 Planned | Online 1v1 disconnect handling (auto-forfeit after 30s inactivity) |
| 📋 Planned | Supabase table cleanup (stale online_queue / online_rooms rows) |
