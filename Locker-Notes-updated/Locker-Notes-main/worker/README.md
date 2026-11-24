# AI Teacher backend (Cloudflare Worker)

`worker.js` is the code that answers the AI Teacher and Essay & Email Coach.
GitHub Pages does not run it. It runs on Cloudflare, so updating this file in
GitHub changes nothing until you paste it into Cloudflare (steps below).

## Update the live Worker
1. Cloudflare dashboard -> Workers & Pages -> `locker-notes-ai` -> **Edit code**.
2. Copy the old code somewhere safe first (a text file) in case you want it back.
3. Delete the old code, paste all of `worker.js`, click **Deploy**.
4. Go to **Settings -> Variables and Secrets** and check for a secret called
   `GEMINI_API_KEY`. If it's missing, add it as a **Secret** (key from Google AI Studio).
   Because API keys and billing involve accounts, ask a parent or guardian to
   help with that part.
5. Optional: add a text variable `GEMINI_MODEL` with the current model name from
   Google AI Studio. If answers stop working one day, an old model name is the
   first thing to check, because Google retires models.
6. Open the Worker's address in your browser. You should see
   `{"ok":true,...,"keyIsSet":true}`.
7. Open the site, go to a class page, and ask the AI Teacher a question.

## If it breaks
Cloudflare dashboard -> your Worker -> **Logs**. The Worker writes the real
reason there ("Gemini returned 404..." means the model name is wrong or retired,
"returned 403/400" usually means a bad or expired key, "429" means the free
daily or per-minute limit was reached). Students only ever see a friendly message.
