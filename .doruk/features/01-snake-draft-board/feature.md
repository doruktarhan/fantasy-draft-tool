# 01-snake-draft-board — Yahoo 9-cat draft board
> Status: done — used for the 2026-09-22 snake draft
> Key files: `index.html`, `merge.py`, `data/targets.js`, `data/SCRAPER_NOTES.md`
> Repo: https://github.com/doruktarhan/fantasy-draft-tool (public, branch `master`)

## What it is
One self-contained `index.html` with no build step and no server. It opens straight from disk (file://). The league is Yahoo 9-cat H2H.
- **Main board:** available players with ★ (shortlist) and − (drafted) buttons. The columns are Player (TEAM), Pos, Yahoo rank, ADP (7-day, with its ordinal), HT (Hashtag rank), Comp and HT edge.
- **Shortlist:** a right panel that compares the starred players side by side.
- **Drafted log:** undo per entry, plus Cmd+Z.
- **Search:** Enter jumps to the player and flashes the row, then Space stars them. Shift+Enter stars directly. Search never drafts.
- **State:** drafted, starred and weights are kept in localStorage under `fdt:v1`. Reset clears them.

## Data pipeline
`data/yahoo_adp.json` + `data/hashtag.json` → `python3 merge.py` → `data/players.js` (`window.PLAYERS`).
- The page falls back to `data/players.mock.js` and shows an orange MOCK badge when `players.js` is missing.
- **Scraped files are gitignored** because they come from paid sources (Yahoo Plus/Diamond, Hashtag). Only code, the mock data and the targets are public. On a new machine you have to re-scrape.
- `players.js` fields are `id, name, team, pos, yahooRank, adp7, adpAll, adpRank, hashtagRank, cats(null)`.
- `merge.py` normalizes names: NFKD, strip accents, lowercase, drop jr/sr/ii/iii/iv. It then matches on the full name, falling back to last name + team with a team-alias map (GS/GSW, NO/NOP, …). In the 2026-09-22 run 199 of 200 matched; the one miss was Allen Graves, who is Hashtag-only.
- `data/targets.js` holds `window.TARGETS` (soft green) and `window.AVOID` (soft red). Name matching there is accent- and case-insensitive.

## How the data was fetched (re-run this for data-refresh)
Use **Playwright MCP, and Doruk logs in by hand.** The agent opens the login page, stops with `NEEDS LOGIN: <site>`, Doruk signs in inside the Playwright window, and the agent resumes. Extract with a targeted `browser_evaluate`; never `browser_snapshot` a big table. Full gotchas are in `data/SCRAPER_NOTES.md`.
- **Yahoo** (basketball.fantasysports.yahoo.com/nba/draftanalysis, logged in with Plus/Diamond):
  - Keep the page's own sort. It's ordered by "Last 7 Days 💎" ADP.
  - Take the left **Rank** column as `yahooRank`, plus `adp7` ("Last 7 Days 💎") and `adpAll` ("All Drafts 💎"). Skip the basic ADP and preseason columns.
  - Paging is 30 rows at a time with caret buttons; go to about 450 rows.
  - Read each page twice about 350ms apart and accept only when both reads match, because the DOM settles late.
  - Only about 190 players have an ADP. Below that it's genuinely null, not a scrape bug.
- **Hashtag Basketball** (paid, needs login): one page. Settings:
  - 9-cat, TO ×0.25, rank type **Combined**, value mode **H2H**, positions **Yahoo**, **2026-27 Rest of Season**, Top 200.
  - Extract rank, name, team and pos only.
  - Sanity anchors on 2026-09-22 were Jokic 1, Giannis 5 and KAT 11.
  - "Top 200" greyed out means you're not logged in. A repeated header row appears around row 195; filter out rows whose rank isn't a number.
- **Don't use `jb` (Jev Browser)** for these. It's an isolated Chromium with no shared logins and can't extract data. The first scraper never used it.
- **Use one fresh Sonnet scraper per source.** A single scraper reached about 168K context mostly through session overhead, not page data.

## Decisions and why
- **Market vs model.** Yahoo rank and 7-day ADP are "the market", meaning what the room sees and drafts by. Hashtag is "the model".
  - **HT edge** = avg(yahooRank, adpRank) − hashtagRank. A positive value means Hashtag likes the player more than the room does.
  - It's colored by edge ÷ market: light green at ≥8%, strong green at ≥15%, red at ≤−15%. It needs |edge| ≥ 3 before any color shows, because +1 at pick 2 is noise.
  - This replaced "ADP rank − composite rank", which Doruk found useless for hunting value.
- **Comp** is a weighted average of the available ranks, with 3 sliders at equal weight by default. When ADP is missing it just averages the remaining ranks. The idea of treating missing ADP as "undrafted, ~200" was never decided.
- The Dan Titus Yahoo article rankings (`yahoo_expert.json`) are superseded by the Rank column on the draft-analysis page, which Doruk confirmed is current.
- **Extra sources were rejected on 2026-09-22:**
  - Basketball Monster: 2026-27 projections are paywall-only ($70) with no shared list found.
  - RotoWire: Doruk declined.
  - FantasyPros: an aggregate, so it would double-count.
  - Untested lead: "Fanscout" free 2026-27 projections (r/fantasybball, 2026-09-07).
- **UI choices:** light theme, compact numeric columns, team shown in parentheses next to the name, soft green/red tints for targets and avoids.
