# Scraper handoff notes

- **Yahoo expert article** (`yahoo_expert.json`): Public page, no login. Plain `<table>`, straightforward `td` scrape. Now superseded by `yahoo_adp.json`'s `rank` field per Doruk — old file left on disk, not deleted.
- **Yahoo draft-analysis / ADP** (`yahoo_adp.json`, DONE, 450 rows): basketball.fantasysports.yahoo.com/nba/draftanalysis, logged in, Plus Member. Diamond columns ("💎") are empty when signed out. Pagination is a caret-left/right icon-button pair (no text/aria-label) next to a "1-30" style label span — click `svg[data-icon="caret-right"]`'s closest `button`.
- **Gotcha:** table display is sorted ascending by "Last 7 Days 💎" (adp7), NOT by the Rank column — Rank jumps around per row. Don't assume rank == row position.
- **Gotcha:** after a page-load or pagination click, the DOM looks "clean"/sequential for a few hundred ms before settling into its real (scrambled) values — a single read right after load can look valid but be wrong. Fix: read twice ~350ms apart, only accept when both reads match exactly (name+rank+key stat per row).
- **Gotcha:** `browser_evaluate` return values >~a few KB get written to a file instead of returned inline (e.g. `yahoo_adp_raw3.json` in the project root) — the result is a JSON **string**, so `json.loads` twice (outer file, inner string) to get real data. Clean these temp files up after use.
- **Hashtag Basketball**: paid, needs login. "Top 200" option in the Show dropdown is disabled (greyed out) until logged in — that's the tell for "not logged in yet," don't rely on the login form text alone.
- **Tabs:** one Playwright window, two tabs — tab 0 = Hashtag, tab 1 = Yahoo. Always `browser_tabs list` + `select` before acting; another agent may have touched the shared browser between turns.
