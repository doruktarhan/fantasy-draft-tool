#!/usr/bin/env python3
"""Merge Yahoo ADP rankings and Hashtag Basketball rankings into data/players.js.

Usage:
    python3 merge.py [path/to/hashtag.json]

Reads data/yahoo_adp.json (fixed input) and a Hashtag Basketball rankings
file (defaults to data/hashtag.json), matches players between the two
sources by normalized name (falling back to last-name + team), and writes
data/players.js for the draft-board page.
"""
import json
import re
import sys
import unicodedata
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent
YAHOO_PATH = REPO_ROOT / "data" / "yahoo_adp.json"
DEFAULT_HASHTAG_PATH = REPO_ROOT / "data" / "hashtag.json"
OUTPUT_PATH = REPO_ROOT / "data" / "players.js"

SUFFIXES = {"jr", "sr", "ii", "iii", "iv"}

# Team-code spellings differ between the two sources (e.g. Yahoo's "GSW" vs
# Hashtag's "GS"). Used only to line up the last-name+team fallback match;
# the output keeps whichever source's own team code it came from.
TEAM_ALIASES = {
    "GS": "GSW",
    "NY": "NYK",
    "NO": "NOP",
    "PHO": "PHX",
    "SA": "SAS",
}


def normalize_team(team):
    if not team:
        return team
    team = team.strip().upper()
    return TEAM_ALIASES.get(team, team)


def normalize_name(name):
    """Strip accents/punctuation/suffixes so names from both sources compare equal."""
    decomposed = unicodedata.normalize("NFKD", name)
    stripped = "".join(c for c in decomposed if not unicodedata.combining(c))
    lowered = stripped.lower()
    cleaned = re.sub(r"[^a-z0-9\s]", " ", lowered)
    tokens = [t for t in cleaned.split() if t not in SUFFIXES]
    return " ".join(tokens)


def last_token(normalized_name):
    tokens = normalized_name.split()
    return tokens[-1] if tokens else ""


def slugify(normalized_name):
    slug = re.sub(r"\s+", "-", normalized_name.strip())
    return slug or "player"


def load_json(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def build_indexes(yahoo_rows):
    by_norm_name = {}
    by_last_team = {}
    for idx, row in enumerate(yahoo_rows):
        norm = normalize_name(row["name"])
        by_norm_name.setdefault(norm, []).append(idx)

        key = (last_token(norm), normalize_team(row["team"]))
        by_last_team.setdefault(key, []).append(idx)
    return by_norm_name, by_last_team


def match_hashtag_players(yahoo_rows, hashtag_rows):
    """Returns (hashtag_rank -> yahoo_idx, unmatched_hashtag_rows, ambiguous_reports)."""
    by_norm_name, by_last_team = build_indexes(yahoo_rows)

    matched_yahoo_idx = {}  # yahoo_idx -> hashtag row (for detecting reuse)
    hashtag_match = {}  # hashtag rank -> yahoo_idx
    unmatched = []
    ambiguous = []

    for h in hashtag_rows:
        h_norm = normalize_name(h["name"])
        candidates = list(by_norm_name.get(h_norm, []))
        match_kind = "name"

        if not candidates:
            key = (last_token(h_norm), normalize_team(h.get("team")))
            candidates = list(by_last_team.get(key, []))
            match_kind = "last name + team"

        # Drop any candidate already claimed by an earlier hashtag row.
        available = [c for c in candidates if c not in matched_yahoo_idx]

        if len(available) == 1:
            yahoo_idx = available[0]
            matched_yahoo_idx[yahoo_idx] = h
            hashtag_match[h["rank"]] = yahoo_idx
        elif len(available) > 1:
            names = [yahoo_rows[c]["name"] for c in available]
            ambiguous.append(
                f"Hashtag #{h['rank']} {h['name']} ({h.get('team')}) matched "
                f"{len(available)} Yahoo players via {match_kind}: {', '.join(names)}"
            )
            unmatched.append(h)
        else:
            unmatched.append(h)

    return hashtag_match, unmatched, ambiguous


def build_players(yahoo_rows, hashtag_rows, hashtag_match):
    hashtag_rank_by_yahoo_idx = {v: k for k, v in hashtag_match.items()}
    matched_hashtag_ranks = set(hashtag_match.keys())

    players = []
    for idx, row in enumerate(yahoo_rows):
        players.append(
            {
                "name": row["name"],
                "team": row["team"],
                "pos": row["pos"],
                "yahooRank": row["rank"],
                "adp7": row["adp7"],
                "adpAll": row["adpAll"],
                "hashtagRank": hashtag_rank_by_yahoo_idx.get(idx),
            }
        )

    for h in hashtag_rows:
        if h["rank"] in matched_hashtag_ranks:
            continue
        players.append(
            {
                "name": h["name"],
                "team": h.get("team"),
                "pos": h.get("pos"),
                "yahooRank": None,
                "adp7": None,
                "adpAll": None,
                "hashtagRank": h["rank"],
            }
        )

    return players


def assign_adp_ranks(players):
    with_adp = [p for p in players if p["adp7"] is not None]
    with_adp.sort(key=lambda p: p["adp7"])
    for i, p in enumerate(with_adp, start=1):
        p["adpRank"] = i
    for p in players:
        p.setdefault("adpRank", None)


def assign_ids(players):
    used = {}
    for p in players:
        base = slugify(normalize_name(p["name"]))
        if base not in used:
            used[base] = 1
            p["id"] = base
        else:
            used[base] += 1
            p["id"] = f"{base}-{used[base]}"


def sort_players(players):
    players.sort(
        key=lambda p: (
            p["yahooRank"] is None,
            p["yahooRank"] if p["yahooRank"] is not None else 0,
            p["hashtagRank"] if p["hashtagRank"] is not None else 0,
        )
    )


def write_output(players, output_path):
    ordered = [
        {
            "id": p["id"],
            "name": p["name"],
            "team": p["team"],
            "pos": p["pos"],
            "yahooRank": p["yahooRank"],
            "adp7": p["adp7"],
            "adpAll": p["adpAll"],
            "adpRank": p["adpRank"],
            "hashtagRank": p["hashtagRank"],
            "cats": None,
        }
        for p in players
    ]
    body = json.dumps(ordered, indent=2, ensure_ascii=False)
    content = 'window.PLAYERS_SOURCE = "real";\nwindow.PLAYERS = ' + body + ";\n"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(content)


def main():
    hashtag_path = Path(sys.argv[1]) if len(sys.argv) > 1 else DEFAULT_HASHTAG_PATH

    yahoo_rows = load_json(YAHOO_PATH)
    hashtag_rows = load_json(hashtag_path)

    hashtag_match, unmatched, ambiguous = match_hashtag_players(yahoo_rows, hashtag_rows)

    players = build_players(yahoo_rows, hashtag_rows, hashtag_match)
    assign_adp_ranks(players)
    assign_ids(players)
    sort_players(players)

    write_output(players, OUTPUT_PATH)

    print(f"Yahoo rows: {len(yahoo_rows)}")
    print(f"Hashtag rows: {len(hashtag_rows)}")
    print(f"Matched: {len(hashtag_match)}")
    print(f"Total merged players written: {len(players)}")

    print(f"\nHashtag players with no Yahoo match ({len(unmatched)}):")
    if unmatched:
        for h in sorted(unmatched, key=lambda r: r["rank"]):
            print(f"  #{h['rank']:>3}  {h['name']} ({h.get('team')})")
    else:
        print("  (none)")

    print(f"\nAmbiguous matches ({len(ambiguous)}):")
    if ambiguous:
        for line in ambiguous:
            print(f"  {line}")
    else:
        print("  (none)")


if __name__ == "__main__":
    main()
