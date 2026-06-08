# How Aditya Built a Game — The Math Battle Story

*A narrative of every feature, idea, and decision made during the build.*

---

## The Beginning

It started with a simple idea: what if answering maths questions made warriors attack?

Aditya was 10 years old when he sat down with Claude and started building **Math Battle** — a game where you command an army by solving maths problems. No prior coding experience. Just ideas, curiosity, and a lot of enthusiasm.

The first version was modest — a basic battle screen, some warriors, a castle HP bar. But Aditya's mind was already racing ahead.

---

## Wave 1: The Game Takes Shape

### "After every wave a new good guy type shows up"

Aditya's first big idea was a **wave unlock system**. Beat Wave 1, unlock the Archer. Beat Wave 2, unlock the Mage. He wanted players to feel progression — to feel like they were earning their army.

The warrior roster grew:
| Warrior | Unlocks | Special |
|---------|---------|---------|
| 🗡️ Soldier | Start | Reliable starter |
| 🏹 Archer | Wave 1 | Faster damage |
| 🔮 Mage | Wave 2 | High damage, fragile |
| 🏇 Charioteer | Wave 3 | Tough and durable |
| 🐉 Dragon Rider | Wave 4 | The ultimate warrior |

### "Since this is an iPad app, typing the answer will be hard"

Aditya immediately thought about the user experience. This game was made to be played on an iPad. Typing numbers with a keyboard is awkward. So he asked for **4 tap buttons** with the correct answer hidden in a random position each time — no patterns to memorise.

### "When a higher power opens up, automatically remove the lowest power one"

A clever quality-of-life feature. If your army was full and you recruited a stronger warrior, the weakest one left automatically. No fussing with menus. The game just did the smart thing.

---

## Wave 2: Going Deeper

### The multi-step recruit system

Aditya wanted stronger warriors to be *harder to earn*. His idea: each warrior tier requires more correct answers in a row to recruit, with bonus time added at each level:

- Soldier: 1 question (normal time)
- Archer: 2 questions (+3 seconds)
- Mage: 3 questions (+6 seconds)
- Charioteer: 4 questions (+9 seconds)
- Dragon Rider: 5 questions (+12 seconds)

He originally suggested +2 seconds per tier. Then changed his mind: *"actually should we add the time by 3 seconds?"* That confident revision — knowing what felt right — was a sign of a real game designer at work.

### "Add a healing potion"

One of Aditya's most detailed feature requests. He described the entire system in one go:

> "There will be a healing potion whenever the player gets an answer streak of 4. A button will appear next to the characters and you can store up to 5 potions. When the potion button is clicked the player will have 4 seconds to decide where to use the potions. The player can even use the potions on the castle to partially renew its health but if used on a character the character gets completely healed."

The level of systems thinking here — streaks, storage limits, a timed decision window, different healing amounts for warriors vs the castle — came entirely from a 10-year-old's imagination.

---

## Wave 3: Going Live

### Anand steps in — "How do I get it on the iPad looking like an app?"

At this point, Aditya's dad Anand got involved. He wanted the game properly deployed — not just running locally. They set up:

- **Vercel** for hosting (GitHub auto-deploys on every push)
- **PWA manifest** so it installs on iPad like a real app
- **speedmath-gamma.vercel.app** — live to the world

Anand's philosophy: Aditya shouldn't need to know about git, servers, or deployments. He just builds. When he approves something, it goes live automatically.

### The leaderboard — "I want to share with my friends and family"

Aditya wanted people to compete. Anand already had a Supabase account. Together they designed a **shared global leaderboard** — top 10 fastest times per difficulty level, stored server-side, visible to everyone.

The scoreboard tracks:
- Player name
- Completion time
- Score
- Difficulty level

It was Aditya's first taste of building something truly multi-user.

---

## Wave 4: Polish and Personality

### Renaming the game — "I want a title that mentions math and battle in a fun way"

The game was originally called *SpeedMath Battle*. Aditya decided it needed a better name. He went through several rounds of suggestions:

- Math Mayhem
- Number Smash
- Math Warriors
- Math Clash

He landed on **Math Battle** — *"I like that it mentions math and battle and sounds like a real game."* Simple. Confident. Right.

### The profile and badge system — inspired by Duolingo

This was one of Aditya's most ambitious ideas. He described wanting:
- A profile with name and a picture (he settled on emoji avatars)
- Stats: wins, losses, correct answers, mistakes
- Personal best times per difficulty
- A badge system where completing one badge unlocks a harder version

The badge categories Aditya designed:

| Category | Tiers |
|----------|-------|
| 🏆 Victories | 1 → 5 → 15 → 50 wins |
| 🗡️ Enemies Defeated | 10 → 50 → 200 → 500 |
| 🐉 Dragon | 1 → 5 → 15 dragons recruited |
| ⚡ Speed | Under 5 min → 3 min → 2 min |
| 🔥 Streak | 4 → 8 → 12 in a row |
| 📚 Scholar | 50 → 200 → 500 correct answers |
| 🧪 Healer | 5 → 20 → 50 potions used |
| 🛡️ Defender | Win with no castle damage: 1 → 3 → 5 times |
| ☠️ Difficulty | Win on Medium → Hard → Impossible |

*"After each goal is complete the badge saves in the completed section and a new one of the same topic but harder appears."*

He also added: *"The Dragon Master badge should be recruit 15 Dragon Warriors in total."* He knew exactly what would make that badge feel earned.

---

## Wave 5: The Battle Modes

### "I wanted to add a one vs one battle option"

Aditya thought through both variants:

**Pass & Play** — two players on the same iPad, taking turns. Simple, works immediately, great for siblings and friends.

**Online 1v1** — two players on different devices. Aditya noticed the design flaw in pure turn-based play: *"the faster and better math person has more of a chance of winning than the person who goes first probably wins."* Simultaneous play was fairer. Smarter.

The online matchmaking he designed:
1. Enter your name and press Search
2. If anyone else is also searching, you're matched
3. A screen shows both contestants
4. Both tap Ready
5. 5... 4... 3... 2... 1... FIGHT!
6. No pause. Forfeit = instant loss.

### "Add a Defend option — it should work like a shield"

In the original pass & play design, Aditya wanted a shield. He thought carefully about how it should work:

*"The shield takes more problems to get but you have to do it in the same time you take to do an attack."*

Three questions correctly answered → one shield earned (up to 5 stored). Tap the shield button at any time for 5 seconds of full castle protection.

He caught a design flaw himself: in pass & play, the shield timer was counting down during the player's OWN turn, making it useless. He flagged it immediately. The fix: the timer only counts down during the OPPONENT's turn.

### "The player can choose which character takes damage and which one attacks"

A strategic depth layer Aditya added to the main game. Double-tap a warrior to set them as your **defender** (absorbs enemy hits). Triple-tap to set them as your **attacker** (deals damage, sets math difficulty).

Put your tough Charioteer in the defending role. Put your Dragon in the attacking role. Real tactics.

---

## The Numbers

By the end of the build, Math Battle had grown to:

- **~3,000 lines** of HTML, CSS, and JavaScript — all in one file
- **2 Vercel API routes** (`/api/scores`, `/api/online`)
- **4 Supabase tables** (`leaderboard`, `online_queue`, `online_rooms`, plus sequences)
- **5 game screens** for the main campaign
- **4 battle mode screens** for pass & play
- **6 screens** for online matchmaking and battle
- **9 badge categories** × up to 4 tiers = **30 total badges**
- **4 difficulty levels**, **5 math types**, **5 warrior types**, **5 enemy types**
- **5 waves** of escalating enemies
- Deployed live at **speedmath-gamma.vercel.app**
- Installable as a home screen app on iPad

---

## What Made This Special

Aditya never wrote a line of code. But every design decision, every mechanic, every balance choice came from him.

He knew the game should be iPad-first before anyone told him about touch UX. He spotted that the first-player advantage in turn-based 1v1 was unfair. He noticed the shield timer was useless mid-turn and flagged it. He remembered that the approach bar should reset when you kill an enemy. He thought about badge progression systems inspired by Duolingo.

These aren't beginner ideas. These are the instincts of someone who thinks deeply about what makes games fun.

The code was Claude's job. The game was Aditya's.

---

## Selected Quotes

*"Since this is an iPad app, typing and entering the answer will be hard."*
— Aditya designs for his audience before being asked

*"Actually should we add the time by 3 seconds?"*
— Aditya second-guessing his own idea and getting it right

*"The Dragon Master should be recruit 15 Dragon Warriors in total."*
— Aditya setting the bar for earning the rarest badge

*"The faster and better math person has more of a chance of winning than the person who goes first."*
— Aditya identifying a game design flaw nobody else had mentioned

*"I want a title that mentions math and battle in a fun way that makes people want to play."*
— Aditya understanding marketing at age 10

*"This is great! I showed it to my friends and they loved it!"*
— The moment every developer works for

---

*Built over multiple sessions in June 2026. Aditya was 10 years old.*
*Deployed at: https://speedmath-gamma.vercel.app*
*Source: https://github.com/AnandGurumurthi/speedmath*
