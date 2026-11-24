# Drift Detector

AI agents declare a plan, then call tools. Drift Detector checks whether the agent
actually stuck to its plan: paste the declared plan and the tool-call log, and it
flags every call that went off-plan (intent drift), with a verdict and a drift
percentage.

## Why this exists

Agent security tools like ArmorIQ enforce an agent's declared intent at runtime —
a tool call outside the plan gets blocked. Drift Detector is the audit side of the
same idea: after the run, it shows *which* calls drifted and *why*. I built it
while learning how intent enforcement works, with ArmorClaude and ArmorOpenCode installed during the build.

## How it works

1. The user pastes an agent's declared plan and its tool-call log (one call per line).
2. `POST /api/analyze` sends both to Gemini (`gemini-3.8-flash`), which judges each
   call as `IN PLAN` or `DRIFT` with a one-line reason.
3. The page shows an overall verdict (Clean / Drift detected), the drift percentage,
   and a table of every call with a green/red badge.

The sample data prefilled on the page shows the idea: the plan allows only reading
files and web search, but the log contains a `Bash rm -rf` command and a fetch to an
unknown URL — both get flagged as DRIFT.

## Run locally

```bash
npm install
cp .env.local.example .env.local
# put your Gemini API key in .env.local as GEMINI_API_KEY
npm run dev
```

Open http://localhost:3000.

## Deploy on Vercel

1. Push this repo to GitHub.
2. Import it in Vercel.
3. Add the environment variable `GEMINI_API_KEY` in the Vercel project settings.
4. Deploy — no other setup needed.

## Tech

Next.js 14 (App Router), React, Gemini API. No database, no auth. The API key is
only read from the `GEMINI_API_KEY` environment variable and is never committed —
`.env.local` is in `.gitignore`.
