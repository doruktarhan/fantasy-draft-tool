# STATE — fantasy-draft-tool
> Updated: 2026-09-30
> Constraint: Yahoo **salary (auction) draft in ~2 weeks (around 2026-10-07)**. Refresh the data before it.

| # | feature | status | next move | owner/branch | folder |
|---|---------|--------|-----------|--------------|--------|
| 02 | salary-draft | active | Salary mode shipped. Doruk picks the next ideas (budget tracker, max-$ targets, inflation, Yahoo $ baseline, backup). | coordinator | `features/02-salary-draft/` |

## Done (durable record in each folder's feature.md)
- 01 snake-draft-board: board shipped and used for the 2026-09-22 snake draft. It merges Yahoo rank, 7-day ADP and Hashtag rank, with an HT edge column and target/avoid tints.

## Backlog
- data-refresh: re-scrape Yahoo (ranks and ADP change) and Hashtag (injuries, new projections), then re-run `merge.py`. Runbook is in `features/01-snake-draft-board/feature.md`. Do this before the salary draft.
