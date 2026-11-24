# Locker Notes: project notes

Paste this file at the start of a chat with any AI so it knows how the project works.

## What it is
A free website for school students: AI Teacher, Essay & Email Coach, quick answers,
homework help, advice, and mock tests. Pick your country, board and class.
Live at https://adityashorag-crypto.github.io/Locker-Notes/ (GitHub Pages).
Plain HTML, CSS and JavaScript. No framework, no build step. It can be installed as an app (PWA).

## Files
| File | What it does |
|---|---|
| `index.html` | Home page: choose country, board, class. Features, free college courses, share, support. |
| `class.html` | One page per class, e.g. `class.html?country=india&level=5`. AI Teacher, Essay & Email Coach, quick answers, homework help, advice, mock tests. |
| `style.css` | All styles, shared by both pages. |
| `data.js` | All the content: `COUNTRIES`, `CONTENT` (homework tips, advice) and `MOCK` (mock test questions). Shared by both pages. Edit content here, in one place. |
| `index.js` | Logic for the home page. |
| `class.js` | Logic for the class page, including the AI Teacher calls. |
| `sw.js` | Service worker (offline support). When you add, rename or delete a file, update `ASSETS` and change the number in `CACHE_NAME`. |
| `manifest.json`, `icon-192.png`, `icon-512.png` | App name and icons. |
| `og-image.png` | Preview picture when the link is shared. |
| `worker/worker.js` | AI Teacher backend. It runs on Cloudflare, not GitHub Pages. See `worker/README.md`. |
| `index-v8.html`, `manifest_1.json`, `og-image_1.png` | Old or unused copies. Nothing links to them. Safe to delete. |

Load order on each page: `data.js` first, then `index.js` or `class.js`.

## How the AI Teacher works
`class.js` sends JSON to `WORKER_URL` (near the top of the "Ask Anything" section).
- Question: `{ question, context }` returns `{ answer: "ANSWER: ...\nSTEPS: step || step || step" }`
- Essay or email: `{ mode: "essay", writingType, topic, context }` returns `{ draft, notes }`
- Any problem: `{ error: "friendly message" }`
`context` is the class, e.g. "Class 5". Notes and answers are shown as plain text, never as HTML.

## Rules for any AI helping with this project
- Keep it plain HTML, CSS and JavaScript. No frameworks or new libraries unless the owner asks.
- Never put passwords or API keys in these files. Keys live only in Cloudflare secrets.
- Everything is for school students: simple, friendly, safe language.
- Make one small change at a time. Don't rewrite whole files.
- Don't rename element ids or functions that the HTML uses (`onclick="askQuestion()"` and similar).
- After a change, check: home page, pick a class, class page loads, a mock test runs, AI Teacher answers.

## Workflow when several AIs help
1. This GitHub repo is the only real copy. Always start from the files in it.
2. Commit before and after every AI change so a bad change can be undone.
3. Give each AI one small job and only the file it needs.
4. Don't let two AIs edit the same file at the same time.

## Known to-dos
- `index.html`, "Support via UPI": the link still says `YOUR_UPI_ID_HERE`. Put in the real UPI ID, or remove the button.
- The AI Teacher feature text says "No sign-up, no limits." Free AI plans do have daily limits, so change the wording if students hit them.
- Check the six "Free College Courses" links now and then, because websites move.
