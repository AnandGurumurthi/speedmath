# How Aditya Built a Real Game
### A Behind-the-Scenes Tour of Math Battle

*Written for Aditya. Every example is from your game.*

---

## Before We Start

You built a real game. Not a toy project from a tutorial — a deployed game with a global leaderboard that anyone in the world can play right now.

You didn't write the code yourself, but every decision in the game came from you. The warriors, the waves, the dark fantasy theme, the healing potions, the 1v1 mode — all yours. The code is just the computer's way of following your instructions.

This guide walks you through how that actually works. Not to memorize — just to see behind the curtain of something you already built.

---

## Chapter 1: How Did Your Idea Become a Game?

You started with this:

> *"i want to keep my brain sharp and one way i thought is speed math. this includes multiplication division subtraction and addition to start with..."*

That was the brief. One paragraph. And from that, a game got built.

Here's the journey every piece of software takes:

```
Your idea (words)
    ↓
Instructions to the computer (code)
    ↓
The computer runs the code
    ↓
You see it in the browser
```

The browser — Chrome, Safari — is the canvas. It reads three types of instructions and turns them into what you see on screen. Those three types are called **HTML**, **CSS**, and **JavaScript**. They each do a completely different job.

---

## Chapter 2: HTML — The Skeleton

**What it is:** HTML describes the *structure* of a page. Every element you can see — a button, a piece of text, a box — starts as an HTML tag.

**In Math Battle:** Every screen you designed is an HTML element. The intro screen, the difficulty picker, the battle screen, the profile page — all of them are HTML `<div>` blocks sitting in the file, waiting to be shown.

This is what your castle HP bar looks like in HTML:

```html
<div id="base-hp-bar">
  <div id="base-hp-fill"></div>
</div>
```

That's it. Two boxes — one inside the other. HTML just says "these boxes exist." It doesn't say what colour they are, how big they are, or what happens when you tap them. That's CSS and JavaScript's jobs.

**The key idea:** HTML is the skeleton. It gives everything a name and a place. Without it, there's nothing to style or interact with.

---

## Chapter 3: CSS — The Skin

**What it is:** CSS controls how everything *looks*. Colours, fonts, sizes, animations, glows — all CSS.

**In Math Battle:** When you said you wanted it to feel like a dark fantasy game, that came entirely from CSS. The black background, the gold warrior cards, the glowing borders, the Cinzel font on the title — every visual detail.

This is where the gold warrior card glow comes from:

```css
.unit-card {
  background: linear-gradient(135deg, #1a1a2e, #16213e);
  border: 2px solid #ffd700;
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.3);
}
```

Without CSS, Math Battle would be plain black text on a white background. Same game, just invisible style.

**The key idea:** HTML says "there's a warrior card here." CSS says "it's dark blue with a gold border and a glow."

---

## Chapter 4: JavaScript — The Brain

**What it is:** JavaScript makes things *happen*. It responds to taps, runs timers, calculates answers, moves warriors, checks if you won. It's the logic of the game.

**In Math Battle:** Every single game decision runs through JavaScript. When you tap Attack:
1. JS checks which warrior is attacking
2. JS generates a math question at the right difficulty
3. JS starts the answer timer
4. JS checks if your answer is correct
5. JS either deals damage to the enemy or lets the enemy hit you
6. JS updates the screen to show what changed

None of that is HTML or CSS. It's all JavaScript, running invisibly, reacting to what you do.

**The key idea:** HTML is the skeleton, CSS is the skin, JavaScript is the brain. The browser reads all three and puts them together into the game you see.

---

## Chapter 5: The Building Blocks

This is where the real magic is. Every program ever written — from Math Battle to the apps on your phone to the software running aeroplanes — is built from the same small set of ideas.

---

### Variables — Things That Change

A variable is a named box that holds a value. The value can change.

**In Math Battle:** `gold`, `baseHP`, `score` are all variables. They start at a number and change as you play.

```js
let gold = 30;        // you start with 30 gold
gold = gold + 15;     // you answer correctly — add 15
gold = gold - 25;     // you recruit an Archer — subtract 25
```

Every time you answered a question correctly this summer, one line of code ran: `gold += difficulty.goldPerCorrect`. That's it. A variable going up by a number.

---

### Objects — Things With Properties

An object groups related information together under one name.

**In Math Battle:** Every warrior type is an object. You designed each warrior — the name, the cost, the HP, the damage. Here's how the computer stores that:

```js
{ name: 'Soldier', emoji: '🗡️', hp: 4, dmg: 1, cost: 10, recruitQs: 1 }
{ name: 'Archer',  emoji: '🏹', hp: 3, dmg: 2, cost: 25, recruitQs: 2 }
{ name: 'Dragon',  emoji: '🐉', hp: 5, dmg: 7, cost: 90, recruitQs: 5 }
```

You said "Soldiers cost 10 gold and deal 1 damage." That decision lives in the code as an object. Changing those numbers changes the game.

---

### Arrays — Lists

An array is an ordered list of things.

**In Math Battle:** Your army is an array. When you recruit a warrior, it gets added to the list. When it dies, it gets removed.

```js
let myUnits = [];              // empty army at start
myUnits.push(newSoldier);      // recruit a Soldier → add to list
myUnits.splice(0, 1);          // Soldier dies → remove from list
```

The game always knows your army by reading this list. When it needs to show warrior cards on screen, it loops through the array and draws one card per warrior.

---

### Functions — Recipes

A function is a named set of steps. You give it a name, and whenever you want those steps to run, you just say the name.

**In Math Battle:** Every action is a function. When you tap the Attack button, it calls a function named `clickAction`. That function calls other functions. Every piece of logic has a name.

```js
function clickAction(type) {
  // 1. check what type of action (attack, recruit, etc.)
  // 2. open the math panel
  // 3. generate a question
  // 4. start the answer timer
}
```

Functions let you reuse logic. The math panel opens the same way whether you're attacking, recruiting, or defending — because they all call the same `openMathPanel()` function.

---

### If/Else — Decisions

An if/else makes a decision. If something is true, do one thing. Otherwise, do another.

**In Math Battle:** The entire correct/wrong answer system is one if/else:

```js
if (yourAnswer === correctAnswer) {
  // correct! deal damage, earn gold
} else {
  // wrong. enemy counter-attacks
}
```

Every rule in your game — "if the castle HP reaches 0, game over", "if you get 4 correct in a row, earn a potion", "if the army is full, replace the weakest warrior" — is an if/else somewhere in the code.

---

### Loops — Doing Things Repeatedly

A loop runs the same code over and over, either a fixed number of times or until something stops it.

**In Math Battle:** The approach bar — the red bar that fills up and makes the enemy attack — is a timer loop. Every 100 milliseconds (10 times per second), it runs:

```js
// runs every 100ms:
approachVal--;                // fill the bar a little
updateApproachBar();          // draw the new bar width
if (approachVal <= 0) {       // if bar is full...
  enemyAutoAttack();          // enemy attacks!
}
```

This loop runs for the entire game, in the background, without you seeing it. Pause the game? The loop stops. Answer a question? The loop stops temporarily. Enemy attacks? The loop resets to zero.

---

## Chapter 6: Why Did Your Game Need a Database?

After the first version, everything worked — but your score only existed on your device. Nobody else could see it. You couldn't see how you compared to other players.

You wanted a **global leaderboard**. That meant the score needed to live somewhere that everyone could access.

**The problem with localStorage:**
Your profile and badge progress are stored in `localStorage` — a small storage area built into your browser. It works great for personal data, but it's *only on your device*. Nobody else can read it.

**What a database is:**
A database is a program that stores data and lets many different computers read and write to it at the same time. When you submit your score after winning, it travels over the internet to a database server, gets saved, and the next time anyone opens the leaderboard, your score is there.

**In Math Battle:** You used a database called **Supabase**. It has a table called `scores` with columns for name, time, score, and difficulty. When 100 players around the world submit scores, they all end up in the same table. The leaderboard reads from that table and shows the top 10.

```
Your browser  →  POST /api/scores  →  Vercel server  →  Supabase database
                                                              ↓
Anyone's browser  ←  GET /api/scores  ←  Vercel server  ←  top 10 rows
```

The database is what made your game go from "a game for me" to "a game for everyone."

---

## Chapter 7: Why Did Your Game Need Vercel?

When you first built the game, it ran on your computer. You opened a file in your browser and it worked. But nobody else could play it.

**The problem:** your computer isn't always on. Even if it were, your home internet connection can't handle many people connecting to it at once. And nobody knows your IP address.

**What deployment means:**
Deploying means putting your game on a computer that *is* always on, is designed to handle lots of visitors, and has a web address everyone can type into their browser.

**What Vercel is:**
Vercel is a service that hosts your game on their servers. You push your code to GitHub, Vercel detects the change, builds your game, and makes it live at `speedmath-gamma.vercel.app` — usually within 60 seconds.

That URL works from any device, anywhere in the world, any time.

**Why GitHub connects to it:**
Every time you approve a change to the game, it gets "pushed" to GitHub (a place that stores code history). Vercel watches GitHub. The moment new code lands, Vercel automatically re-deploys the game. That's why new features go live so fast — you don't have to do anything manually.

---

## Chapter 8: What Is Refactoring?

Right now, all of Math Battle lives in one file: `index.html`. It has the structure (HTML), the style (CSS), and the logic (JavaScript) — about 3,000 lines — all mixed together.

It works. But imagine if your bedroom, your schoolbooks, your clothes, your toys, and your sports equipment were all in one giant pile. You could still find things, but it gets harder as the pile grows.

**Refactoring** means reorganising the code without changing what the game does. The players wouldn't notice anything. The game looks identical. But the code is cleaner, split into separate files by purpose — CSS in its own files, JavaScript logic split into focused files.

**Why your game will need it:**
You're going to keep building this summer. Every new feature adds more lines to the pile. At some point, adding a new warrior type means carefully editing a file you can barely scroll through. Refactoring now — while the pile is still manageable — means every feature you add this summer goes into a tidy, organised codebase.

**The rule:** refactoring means changing the structure without changing the behaviour. If anything in the game works differently after a refactor, something went wrong.

---

## Chapter 9: Why Do We Write Specs?

The project has three documents: `SPEC.md`, `TECH.md`, and `STORY.md`. Why?

**SPEC.md** is the product specification — what the game does, written in plain language. Every feature, every rule, every edge case. If you come back to this game in a year and can't remember how shields work in 1v1, SPEC.md has the answer.

Without it: every time a new feature is being built, time gets wasted re-figuring-out rules that were already decided. "Wait, does a wrong answer during recruit cost you gold? Does the enemy get a free hit?" SPEC.md has all of this.

**TECH.md** is for the technical side — how the code is structured, where things live, known issues, plans. It's the map of the codebase.

**STORY.md** is your story. Every feature you requested, in your own words. It's a record of how this game grew from "hi i am aditya" to a real deployed game with a leaderboard, 1v1 modes, badges, and a profile system.

**The bigger idea:** every real software project has documentation. Not because developers love writing — because the alternative is forgetting. Programs get built by teams, over months, and nobody can hold all of it in their head. The documents are the shared memory.

Your three docs are, genuinely, what a professional software team would produce. You built your first game *and* your first real spec, tech doc, and build log. That's not common.

---

## What You Actually Built

Let's count:

- A **client** (the game in the browser) — HTML + CSS + JavaScript
- A **server** (the API routes on Vercel) — Node.js
- A **database** (the leaderboard) — Supabase / PostgreSQL
- A **CI/CD pipeline** (GitHub → Vercel auto-deploy)
- A **PWA** (installable on your iPad home screen)
- **Documentation** (SPEC.md, TECH.md, STORY.md)

That's a full-stack application. The same fundamental architecture as apps used by millions of people.

You were 10 years old and it was your summer break.

---

---

## Chapter 10: How Software Actually Gets Built

Here's something nobody tells you: professional developers don't sit down, write a program perfectly, and ship it. Nobody does. Software is built in small steps, over time, with mistakes along the way. That process has a name: **iterative development**.

Math Battle is a perfect example.

---

### Small Things Adding Up to Big Things

Look at the version history of your game:

| Version | What changed |
|---------|-------------|
| v0.1 | Basic questions, HP bar, gold, difficulty picker |
| v0.2 | Army system, warriors, enemies, waves |
| v0.3 | Wave unlocks, 4-choice buttons for iPad |
| v0.4 | Dark fantasy theme — fonts, glows, gradients |
| v0.5 | Multi-step recruit, healing potions |
| ... | ... |
| v1.2 | Shield timer fix, total score in profile, retreat = loss |

That's 17 versions across a few days. Not one big release — 17 small ones.

No single step was huge. But step 1 + step 2 + ... + step 17 = a full game with a leaderboard, 1v1 online multiplayer, 30 badges, and a profile system.

This is how all software gets built. Instagram didn't launch with Reels. It launched with square photos and a filter. Everything else was added one version at a time.

---

### Finding Bugs — They're Normal

Every version had bugs. That's not a failure — it's just part of building things.

Some bugs from your game's history:

- **The approach bar didn't reset when you killed an enemy.** So after a kill, the next enemy would attack immediately with no warning. Felt unfair. Fixed in v0.9.
- **The leaderboard broke because of database permissions.** Your score submitted fine but nothing appeared. Turned out Supabase needed a specific setting changed. Fixed in v0.8.
- **The shield timer in 1v1 kept counting down even during the shield owner's own turn.** So if you earned a shield, it was half gone before you even used it. Fixed in v1.2.
- **Vercel was running the wrong version of Node.js** and the API routes broke silently. Fixed by adding one line to `package.json`. That was v0.8.

None of these were obvious when the feature was first built. They only appeared when the game was played. That's how bugs work — you can't always predict them. You find them, fix them, and move on.

---

### Trying Things More Than Once

Some things don't work the first time. You try again with a slightly different approach. That's not wasted effort — it's how you figure out what works.

The keyboard input for answers was replaced with 4-choice tap buttons. The keyboard worked on a computer but felt wrong on your iPad. So the whole input system was rebuilt. The second version was better specifically *because* the first version showed what didn't work.

Sometimes the second attempt is better. Sometimes the third is. The attempt count doesn't matter — the final result does.

---

### Scrapping Things — That's OK Too

Not everything makes the cut. Sometimes you build something, try it, and decide it's not right for the game. Or a feature works but makes something else worse. Or it just doesn't feel fun.

Scrapping something isn't failure. It's a decision. You learned what doesn't fit, which gets you closer to what does. Every good game has a graveyard of features that were tried and cut.

The important thing: don't get attached to code. Code is a tool. If it's not serving the game, it goes.

---

### The Backlog — Not Everything Gets Built Right Away

Your game has a backlog — a list of known issues and planned features that aren't done yet:

- Phone/small screen layout improvements
- Background music
- Online disconnect handling
- Updated How to Play

These aren't failures. They're *decisions* about what to do next. Every real product has a backlog. The list is never empty — that's not the goal. The goal is to keep the most important things at the top and work through them over time.

---

### The Process, In Short

```
Have an idea
    ↓
Build a small version
    ↓
Try it out
    ↓
Find what's broken or missing
    ↓
Fix it / improve it / scrap it
    ↓
Build the next small version
    ↓
(repeat)
```

That loop — called the **development cycle** — is what every version of Math Battle went through. It's what every piece of software goes through. You never "finish" a game the same way you finish a maths problem. You just keep making it better until you decide to stop.

Math Battle went from a blank page to 17 versions in a few days. That's not because it was easy. It's because each step was small enough to actually complete.

---

## Chapter 11: How Does Claude Actually Work?

You built this game by typing messages. You said "I want a dragon warrior" and a dragon warrior appeared. How?

---

### I Am a Language Model

I'm a program called a **large language model** (LLM). I was trained by a company called Anthropic.

Training means: Anthropic fed me an enormous amount of text — books, websites, code, conversations, documentation — and had me learn patterns from it. Not memorise it, but learn the *structure* of language and knowledge from it. The same way you learned to speak English not by memorising every sentence, but by hearing millions of sentences until the patterns became natural.

After training, I can read text and produce text that responds usefully to it. That's the core of what I do.

---

### What Happens When You Type a Message

When you typed "I want healing potions that give full HP to a warrior", here's roughly what happened:

```
Your words
    ↓
Broken into tokens (chunks of text the model understands)
    ↓
Passed through the model — billions of mathematical calculations
    ↓
The model predicts the most useful next tokens
    ↓
Those tokens become words → become code → become a feature in your game
```

I don't "understand" language the way you do. I process patterns. But those patterns are rich enough that I can figure out: you want a potion system, it should heal warriors, it should cost something (streak-based made sense), it needs a UI, here's how to implement it.

---

### How I Remember Your Game

I don't have a permanent memory between conversations the way you do. Every time a new conversation starts, I start fresh.

But here's the trick: at the start of every session, I read `SPEC.md` and `TECH.md`. Those documents are my memory. They tell me exactly what your game does, how it's built, what's been fixed, what's planned. Your dad designed it that way — instead of relying on me to remember, we write everything down and I read it each time.

That's also why the docs matter so much. They're not just for you — they're my briefing notes.

---

### How Did I Learn to Write Code?

During training, I read millions of lines of code — JavaScript, Python, HTML, CSS, and dozens of other languages. I learned patterns: how functions are structured, how game loops work, how to make a timer, how to connect to a database.

When you asked for a feature, I wasn't looking it up. I was applying patterns I'd learned. Like how you don't look up how to form a sentence in English — you just know how sentences work, because you've heard so many of them.

---

### What I Can't Do

I can make mistakes. I can write code that looks right but has a bug. I can misunderstand what you want and build the wrong thing. I can forget context within a long conversation.

That's why your dad reads every change before it goes live. And why we write things down in SPEC.md — so if I get something wrong, there's a clear record of what was actually intended.

---

### The Bigger Picture

You gave ideas. I translated them into code. Your dad reviewed and guided. Between the three of us, a real game got built.

That's actually how a lot of professional software gets made — someone with the vision (you), someone with technical knowledge (Claude / your dad), and a system for capturing decisions (the docs). The roles are different but the structure is the same.

---

---

## Chapter 12: What This Summer Taught You About Learning Anything

This is the last chapter, and it's not really about coding.

It's about you — and how what you did this summer is actually a blueprint for how to learn anything, in 6th grade and beyond.

---

### You Already Know How to Do Hard Things

When you started, you had no idea how games were built. You didn't know what HTML was. You'd never heard of a database. You didn't know what a server was or why you'd need one.

None of that stopped you.

You had an idea, you described it, and you kept going — version after version, feature after feature. By the end of the summer you'd built something that works, that people can play, that has your name on it.

That took persistence. Not talent. Not prior knowledge. Just the willingness to keep going when things weren't done yet.

That's the most important skill you can have — in 6th grade, in high school, in whatever you end up doing. The ability to stay in something long enough for it to become real.

---

### 6th Grade Is Just Another Version 0.1

When you start 6th grade, a lot of it will feel like the beginning of Math Battle. Unfamiliar. A bit overwhelming. More complex than what came before.

That's fine. That's what v0.1 always feels like.

Every subject you'll study — maths, science, history, writing — works the same way your game does. You don't understand it all at once. You understand a little, then a little more, and one day you look back and realise you know something you couldn't have imagined knowing at the start.

When a topic feels hard, that's not a sign you can't do it. It's a sign you're at v0.1. Keep going.

---

### Asking for Help Is How Smart People Work

You had Claude. You had your dad. You asked questions constantly — "can we add this?", "why did that break?", "what does that mean?"

That wasn't a shortcut. That was the right approach.

The smartest people in any field — engineers, scientists, writers, athletes — have coaches, mentors, teammates, and teachers. Nobody builds anything great entirely alone. Knowing when to ask for help, and not being embarrassed to ask, is a skill that will serve you for the rest of your life.

In 6th grade: ask your teachers when you don't understand. Ask a classmate. Look it up. Ask your dad. Ask me. Don't sit quietly confused when a question could unstick you in 30 seconds.

---

### Don't Be Hard on Yourself When Things Don't Work

Your leaderboard broke. Your shield timer was wrong. Your approach bar didn't reset correctly. Your entire input system got rebuilt from scratch.

Did any of that mean you were failing? No. It meant you were building.

Bugs are not evidence that you're bad at something. They're evidence that you're doing something real and complex enough to have bugs. Simple things don't have bugs. Interesting things do.

When something in 6th grade doesn't click the first time — a maths concept, an essay that doesn't come out right, a science experiment that gives the wrong result — treat it like a bug. Something to fix, not something to feel bad about. The fix is always findable if you keep looking.

---

### Stay Curious — Especially About Things You Don't Understand Yet

Every feature in Math Battle started the same way: you saw something interesting and asked "can we do that?"

You saw the War of Sticks and said "I want mine to feel like that." You played a game with a leaderboard and said "can mine have one?" You heard about people playing on phones and said "can it work on my iPad?"

That curiosity — that itch of *I wonder if we could* — is more valuable than any specific knowledge. Knowledge can be looked up. Curiosity can't be faked. It's what drives you to look things up in the first place.

In 6th grade, stay curious about everything. Not just the subjects you're already good at. The ones that confuse you most are often the ones with the most interesting things inside them.

---

### Small Steps Beat Big Leaps Every Time

You didn't build a 17-version game in one sitting. You built version 0.1 first. Then 0.2. Each step was small enough to actually finish.

This works for everything.

A big essay feels impossible. The first paragraph doesn't. A whole term of maths feels overwhelming. Tonight's homework doesn't. A year of learning a new subject feels endless. This week's lesson doesn't.

Break it down. Do the next small step. Finish it. Then do the next one.

You already know this works. You proved it this summer.

---

### What You Built Is Real

Before we wrap up — let's be clear about what you actually did.

You were 10 years old, on your summer break, with no coding background. You built and shipped a full game:

- A global leaderboard that anyone in the world can submit to
- A real-time 1v1 online multiplayer mode
- A badge system with 30 badges across 9 categories
- A profile that saves your stats across sessions
- A game that runs on iPads, phones, and computers

Most adults have never shipped anything like this.

You did it by having ideas, describing them clearly, asking for what you wanted, pushing through when things broke, and not stopping until it was real.

That's not a coding skill. That's a life skill.

You'll use it in 6th grade. You'll use it in high school. You'll use it in whatever you decide to build next — whether that's another game, a science project, a business, a piece of writing, or something nobody has thought of yet.

The game is great. But what you learned about *how to learn* is the real thing you built this summer.

---

## What's Next

As the game grows, new concepts will come up:

- **Testing** — how do you make sure a new feature doesn't break old ones?
- **Refactoring** — splitting the big file into smaller, organised pieces
- **Real-time systems** — how does 1v1 Online work with two browsers talking to each other?
- **Security** — how do you stop people from cheating the leaderboard?

Each one is a new chapter. You'll understand them best when your game actually needs them.
