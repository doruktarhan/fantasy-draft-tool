# 02-salary-draft — handoff
> Updated: 2026-09-30 · Status: active

## Doing
Salary mode has shipped in `index.html`:
- Snake/Salary toggle.
- A Sold price entry, with the player kept on the board.
- All/Remaining/Sold views.
- A price-by-tier table (bands of 10 by Yahoo/Comp/HT rank).
- An Est $ column: the median price of sold players within ±5 ranks.

Salary state is kept in `fdt:salary:v1`, the mode in `fdt:mode:v1`, and the snake state `fdt:v1` is untouched.
## Next
Doruk picks which ideas to build next. Candidates:
- a budget tracker (my team, max bid)
- per-player max $ targets
- a per-manager budget
- an inflation meter
- Yahoo projected salaries as a baseline
- export/import of prices as a backup

Also do the data refresh (backlog) before the draft, around 2026-10-07.
## Micro-decisions
- Blur commits a typed price. The keyboard loop is search → Enter → S → price → Enter.
## Don't touch
The localStorage keys above.
