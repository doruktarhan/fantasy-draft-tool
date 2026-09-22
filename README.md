# Fantasy Draft Tool

Single-page draft board for a Yahoo 9-cat H2H fantasy basketball draft. It merges three rankings (Yahoo rank, Yahoo 7-day ADP, Hashtag Basketball) into one sortable board, with a starred shortlist, drafted tracking with undo, and an "HT edge" column that flags players Hashtag rates above the market.

## Use
1. Put scraped rankings in `data/yahoo_adp.json` and `data/hashtag.json`.
2. Run `python3 merge.py` to write `data/players.js`.
3. Open `index.html` in a browser. Without real data it falls back to `data/players.mock.js`.

`data/targets.js` lists the players to highlight green.

Scraped data files are gitignored because they come from paid sources.
