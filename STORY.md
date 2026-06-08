# How Aditya Built Math Battle
### A 10-Year-Old, an AI, and a Game Built From Scratch

*Every quote below is verbatim — spelling, punctuation, and all. That's the point.*

---

## The Handover

It started with a message from Anand:

> **Anand:** "i am going to handover control to my 10 year old son Aditya. he has some ideas on a speedmath project he wants to build with you. he does not know software or how to build things. you should fully drive and make decisions."

And then Aditya arrived.

---

## "hi i am aditya"

> **Aditya:** "hi i am aditya and i am having my summer break. i want to keep my brain sharp and one way i thought is speed math. this includes multiplication division subtraction and addition to start with and basic problems but after correct answers, problems can become harder and new concepts can be introduced. when a question is answered correctly points go up and difficulty slowly increases but if answered incorrectly points go down and problems become easier. i want the game to have options where i can choose if i want addition, subtraction, multiplication, division or all."

That was the brief. In one paragraph, he had described:
- The core loop
- Adaptive difficulty
- A scoring system
- A subject selection menu

He was 10 years old and it was his summer break.

---

## The Theme

> **Aditya:** "i also want before the first slide to be an introduction and an easy medium hard or impossible version. i aso want this game to be themed like a game called the war of sticks on poki.com"

He knew exactly what he wanted the game to feel like. He referenced a game he loved and said: make it like that. When Claude explained the game couldn't be opened directly, he moved on without missing a beat.

> **Aditya:** "this game is amazing. one thing i want to change is that if i take too long i take damage and like the war of sticks i want to see the screen like i do in poki but if i want to do something i have to click it and do math"

---

## Building the Army

> **Aditya:** "also can i also have a health bar and i can make new people buy making money by doing math so i can battle larger amounts of enemys. can there also be different kinds of warionrs and enemys for example foot soldiers archers magicians and chariotiers. the better ones or the ones that deal more damage."

He invented the economy of the game — earn gold by answering correctly, spend it on stronger warriors. The full warrior roster came from his head: foot soldiers, archers, magicians, charioteers. He'd go on to add a Dragon Rider later.

When the first version appeared with action buttons and math questions:

> **Aditya:** "this is great. can you make it so that whenever i want to have the math questions i can click a button to get it without it coming the whole time"

He wanted the math to be on-demand, not forced. Player agency from day one.

---

## Wave Unlocks — "a new good guy type shows up"

After seeing the first full version of the game:

> **Aditya:** "this is great! one suggestion is that after every wave a new good guy type shows up so the person can battle the hard enemys"

He wanted progression. Not just harder enemies — new tools to fight them with. Beat Wave 1, unlock the Archer. Beat Wave 4, unlock the Dragon. The game became about earning your army.

---

## iPad-First — "typing and entering the answer will be hard"

> **Aditya:** "since this is an ipad app, typing and entering the answer will be hard. can we replace that with 4 choices and correct answer in random places each time so its not a pattern."

Nobody told him to think about UX. He just knew this was an iPad game and keyboards are awkward. Four tap buttons replaced the text input. He also specified "random places each time so its not a pattern" — no memorising the position of the correct answer.

---

## Auto-Replace — "automatically remove the lowest power one"

> **Aditya:** "when a higher power opens up, and i add it, automatically remove the lowest power one."

Simple, clean, strategic. When your army is full and you recruit a stronger warrior, the weakest one leaves automatically. He didn't want a menu or a confirmation — just the smart thing to happen.

---

## The Multi-Step Recruit System

Coming back after a break:

> **Aditya:** "hello i am back again!"

And then immediately:

> **Aditya:** "one idea that i had is that whenever i unlock a new charecter the player needs to answer 1 more question with an extra of 2 more seconds than the previous charecter and so on for all charecters. for the last charecter there will be 5 questions and 10 more additional seconds. attack and soldier will both have 1 question and the regullar amount of time. will these new additions make the game more interesting or complex?"

He had been thinking about this between sessions. The system he described is exact: each warrior tier requires one more correct answer, with bonus time added per level. He even asked whether it would make the game *more interesting or more complex* — a real design question.

Claude agreed it was interesting, and he approved:

> **Aditya:** "this is awesome. now can you add this to the game"

But then he second-guessed himself:

> **Aditya:** "actually should we add the time by 3 seconds?"

He changed +2 seconds per level to +3 seconds. No explanation needed. He just felt it.

---

## The Healing Potion System

> **Aditya:** "this is awesome. now can you add this to the game. there will be a healing potion whenever the player gets an answer streak of 4. a button will appear next to or beside the charecters and you can store up to 5 potions. when the potion button is clicked the player will have 4 seconds to decide where and how much potions they use. the player can even use the potions on the castle to partially renew its health but if used on a charecter the charecter gets completely healed. after a wave gets complete the castle if it took any damage the castle gets partially healed."

This is one paragraph. It contains:
- The earn condition (4-answer streak)
- Storage limits (5 max)
- A time-pressured decision window (4 seconds)
- Two different heal types (castle = partial, warrior = full)
- A free wave-end heal mechanic

He designed a complete system in a single message.

---

## Going Live — Anand Steps In

> **Anand:** "this is Anand; aditya's dad. how do i get it on the ipad looking like an app? can we deploy this to vercel? also before we deploy -- is the code formatted correctly?"

Anand handled the infrastructure. Vercel, GitHub, environment variables, the Supabase connection. When asked whether the game should stay as one HTML file or be split into separate files:

> **Anand:** "should we have this as one large file or split into different files for html, css and js"

He kept it simple. One file. No build step. Easy to understand.

And critically:

> **Anand:** "he doesnt know git.. so when he says something is good and moving to the next one commit it"

Every time Aditya approved something, it went live. He never had to think about deployments.

---

## The Leaderboard — "i want to share with my friends and family"

> **Aditya:** "i want to build a leaderboard for users. one way i thought we can do this is if we had a timer for the full level at the top of the screen and when someone finishes it they get to add their name and see where they are in the leaderboard. lets just do top ten for each level. the first person whould have the least time and the persons name and time should appear. where you can open this page is when you open the game to the home screen leaderboard is an option. before you start any questions"

He had designed the full leaderboard feature — timer, name entry, top 10, accessible from the home screen — before anyone built anything.

When it needed to store scores across devices, he already knew the answer:

> **Aditya:** "i want to share with my friends and family. how do i make leaderboard store it"

> **Anand:** "anand here; i already have supabase. can we use it"

Anand set up the database. Aditya had the idea. The leaderboard went live.

---

## Renaming the Game

> **Aditya:** "i want to heve a title that mentions math and battle in a fun way that makes people want to play"

> **Aditya:** "i want it to also sound like a battle game"

Several options were offered — Math Mayhem, Number Smash, Math Warriors, Math Conquest. He considered them all.

> **Aditya:** "i like the title 'Math Battle'"

Short. Direct. Exactly what he said he wanted.

---

## A New Layout — "the first page should only be the title and the start button"

> **Aditya:** "i want the first page to be only the title and the start button. once start is pressed they will see buttons such as leaderboard and play"

He had a clear visual hierarchy in mind. The title screen should make an impression. Everything else comes after you press Start.

---

## Showing Friends — "they loved it!"

> **Aditya:** "this is great! i showed it to my friends and they loved it! i also wanted to add some new features."

He went and tested his game with real people. Then came back with more ideas.

---

## The Profile — Inspired by Duolingo

> **Aditya:** "everything is great right now. one thing i wanted to add on the options page was a profile option. in the profile the person has to insert a name and if they want to they can add a picture. these things will be shown at the right side of the screen. on the lift and middle will show how much times in all they won and how much they have lost. it also shows total number of mistakes and correct answers. and shows personal best times and scores. this was inspired by duolingo and i also want to do something like its badge system. please tell me your ideas"

He named his inspiration. He described the layout spatially (left for stats, right for profile picture). He asked for Claude's ideas on the badge system — collaborative, not just directive.

When the badge tiers were proposed, he made one precise correction:

> **Aditya:** "the dragon master should be recruit 15 dragon warriers in total. the rest is amazing but after each goal is complete the badge saves in the completed section and a new one of the sameish topic but harder appears"

He signed off on everything except the Dragon Master threshold. He knew exactly how hard that badge should be to earn.

---

## Badge Notifications — "small on the side not to distract"

> **Aditya:** "also if a badge is completed in the middle of a round it appears small on the side not to distract but to notify the player. also a badge with amounts of enemies defeated would be cool"

Two ideas in one sentence. The notification UX (small, non-intrusive, slide-in from the side) and a new badge category he thought of on the spot. Both were built.

---

## The Attack Bar Reset

> **Aditya:** "this is great the leaderboard is working now. one thing i wanted to add is that whenever an enemy gets defeated the attack bar should reset."

One sentence. One feature. The enemy approach bar now resets to zero every time you kill an enemy — giving the player a moment to breathe and making kills feel rewarding. Aditya noticed it was missing and asked for it.

---

## Pause and Readability — "the text on the buttons look very small"

> **Aditya:** "a few feedback on the app - we need to add a pause option - the text on the buttons look very small; we cant read it - can we fix them first"

He had been testing the game and had real feedback. Two separate issues, clearly articulated, prioritised ("fix them first").

---

## 1v1 Battle — "any idea how we can do that?"

> **Aditya:** "another feature that i wanted to add is a one vs one battle option. any idea how we can do that?"

He asked for ideas rather than just issuing an order. When two options were presented (pass & play and online), he thought through both:

> **Aditya:** "we can do both but start with pass and play. why i liked online option better is because then the faster and better mathe person has more of a chance of winning than the person who goes first probably wins. also i also wanted to add a feature in the 1v1 battle called defend"

He identified the fairness problem with turn-based play — the first player always has an advantage — and understood why simultaneous play solved it. That's a design insight most adults miss.

---

## The Defend / Shield System

> **Aditya:** "it should work like a sheild but not counter attack. also the sheild takes more problems to get but you have to do it in the same time you take to do an attack. the 1v1 battles should also be all operations and in medium to hard difficulty but medium timers"

Then he refined it:

> **Aditya:** "the player can have up to 5 shields and can use them whenever they want to. like healing potions they last five seconds but completely block all attacks in those 5 seconds"

He drew the parallel to the potion system himself. Same storage mechanic, same urgency. He noticed it fit the existing design language of the game.

When he tested pass & play:

> **Aditya:** "during the pass and play the sheild seemed usleless because it just emptied out in the 5 seconds of your turn."

He caught a design flaw immediately. The shield timer was counting down during the player's own turn, making it useless. The fix was to pause the timer until the opponent's turn. Aditya found this bug through playtesting, not theory.

---

## Character Roles — "clicked twice... clicked thrice"

> **Aditya:** "the player can choose which charecter takes damage and which one attacks. the one that takes damage is clicked twice and the one that attacks is clicked thrice"

A complete interaction design in one sentence. Double-tap = defender. Triple-tap = attacker. No extra menus. He'd been thinking about strategy — putting your tough Charioteer in front to absorb hits while the Dragon attacks from behind.

---

## Online 1v1 — The Full Design

> **Aditya:** "one idea i just got for the online battle is that after the 1v1 battle screen appears they insert their name and press search. if anybody also pressed search at that time it would open up a screen which states the contestents and after both contestents agree to battle the 5,4,3,2,1 battle screen appears and they start. if any player forfeits in a match then it is an automatic win for the other player. there is also no pause game."

The entire matchmaking flow, designed in one message:
- Name entry → search
- Real-time matching
- Contestant reveal screen
- Both players consent
- Countdown
- No pause
- Forfeit = automatic loss

This became the online 1v1 system, built with Supabase polling and Vercel serverless functions.

He also added:

> **Aditya:** "another thing i wanted to add to profile is total score. at the end of each mathch the person gets a score. also every forfeit even in regular is counted as a loss"

He closed a loophole — players couldn't retreat to avoid a loss.

---

## The Story Request — Anand Closes the Loop

> **Anand:** "i am really enjoying my son interacting with you to build this. can you keep a copy and a nice narrative of all his chat with you saved locally. at the end i want to maybe build a blog post or sometin"

> **Anand:** "in all sections, add the relevant quote from what Aditya actualy said to you"

> **Anand:** "and even the prompts i gave you. so its a full picture with actual conversations and your narrative. that way it is easier"

You're reading that document now.

---

## What Got Built

| | |
|--|--|
| **Game screens** | 15+ screens across single player, pass & play, and online modes |
| **Warriors** | 5 types with unique HP, damage, cost, and math difficulty |
| **Enemy waves** | 5 waves of escalating enemies with 5 enemy types |
| **Difficulties** | Easy, Medium, Hard, Impossible — each with tuned timers, numbers, and gold |
| **Math types** | Addition, Subtraction, Multiplication, Division, All Operations |
| **Badges** | 9 categories × up to 4 tiers = 30 total badges |
| **Profile** | Stats, personal bests, avatar picker, cumulative score |
| **Leaderboard** | Global top 10 per difficulty, stored in Supabase |
| **Pass & Play 1v1** | Turn-based local battle with shields, recruit, and handoff screen |
| **Online 1v1** | Real-time matchmaking, live battle, forfeit system |
| **Deployment** | Vercel + GitHub auto-deploy, installable as iPad home screen app |
| **Code** | ~3,000 lines, single HTML file + 2 Vercel API routes |

---

## What This Actually Was

Aditya never wrote a line of code. But the game is his.

Every mechanic, every balance decision, every feature came from him. He thought about his users (iPad players can't type easily). He thought about fairness (simultaneous online play). He thought about game feel (the approach bar should reset when you kill someone). He caught bugs through playtesting. He named his inspirations. He knew when to push back on his own ideas.

The code was Claude's job. The design was entirely Aditya's.

He built something real, deployed it to the internet, and his friends played it. That's the whole story.

---

*Built in June 2026. Aditya was 10 years old.*
*Live at: https://speedmath-gamma.vercel.app*
*Source: https://github.com/AnandGurumurthi/speedmath*
