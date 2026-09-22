// Mock data — only used when data/players.js failed to load or didn't set window.PLAYERS.
// Same shape as the real file. Contains deliberate nulls to exercise the "missing source" path.
(function () {
  if (typeof window !== "undefined" && Array.isArray(window.PLAYERS) && window.PLAYERS.length) return;

  // [name, team, pos, yahooRank, adp7, adpRank, hashtagRank, cats|null]
  var rows = [
    ["Nikola Jokic", "DEN", "C", 1, 1.4, 1, 1, [0.58, 0.82, 1.2, 28.5, 12.6, 9.9, 1.4, 0.8, 3.2, 14.6]],
    ["Luka Doncic", "LAL", "PG,SG", 2, 2.3, 2, 6, [0.49, 0.78, 3.8, 32.1, 8.9, 9.1, 1.4, 0.5, 4.0, 10.8]],
    ["Shai Gilgeous-Alexander", "OKC", "PG,SG", 3, 2.9, 3, 2, [0.53, 0.89, 1.9, 31.8, 5.4, 6.2, 1.9, 0.9, 2.4, 13.9]],
    ["Victor Wembanyama", "SAS", "PF,C", 4, 3.6, 4, 3, [0.48, 0.83, 3.0, 24.9, 11.1, 3.7, 1.2, 3.8, 3.3, 13.5]],
    ["Giannis Antetokounmpo", "MIL", "PF,C", 5, 4.9, 5, 14, [0.61, 0.62, 0.3, 30.4, 11.9, 6.5, 1.0, 1.2, 3.1, 8.2]],
    ["Anthony Davis", "DAL", "PF,C", 6, 6.8, 6, 5, [0.53, 0.78, 0.7, 25.1, 11.8, 3.6, 1.3, 2.2, 2.1, 11.2]],
    ["Jayson Tatum", "BOS", "SF,PF", 7, 7.2, 7, 12, [0.45, 0.81, 3.1, 26.8, 8.7, 5.8, 1.1, 0.5, 2.7, 8.6]],
    ["Tyrese Haliburton", "IND", "PG", 9, 9.1, 9, 8, [0.47, 0.85, 3.0, 18.7, 3.5, 9.2, 1.4, 0.7, 1.6, 9.4]],
    ["Kevin Durant", "HOU", "SF,PF", 8, 8.4, 8, 4, [0.53, 0.84, 2.3, 26.6, 6.0, 4.2, 0.8, 1.2, 3.2, 10.9]],
    ["Anthony Edwards", "MIN", "SG,SF", 10, 10.3, 10, 15, [0.45, 0.84, 4.1, 27.6, 5.7, 4.5, 1.2, 0.6, 3.2, 8.1]],
    ["Karl-Anthony Towns", "NYK", "PF,C", 11, 11.9, 11, 7, [0.53, 0.83, 2.0, 24.4, 12.8, 3.1, 1.0, 0.7, 2.6, 10.2]],
    ["Stephen Curry", "GSW", "PG", 12, 12.6, 12, 9, [0.45, 0.93, 4.4, 24.5, 4.4, 6.0, 1.1, 0.4, 2.9, 9.9]],
    ["Domantas Sabonis", "SAC", "C", 13, 13.1, 13, 11, [0.59, 0.75, 1.0, 19.1, 13.9, 6.0, 0.7, 0.4, 3.0, 8.9]],
    ["Cade Cunningham", "DET", "PG", 14, 14.8, 14, 20, [0.47, 0.85, 2.0, 26.1, 6.1, 9.1, 1.0, 0.8, 4.4, 6.8]],
    ["Donovan Mitchell", "CLE", "SG", 15, 15.4, 15, 17, [0.44, 0.82, 3.3, 24.0, 4.5, 5.0, 1.3, 0.2, 2.7, 7.4]],
    ["Jalen Brunson", "NYK", "PG", 16, 17.2, 17, 22, [0.49, 0.82, 2.3, 26.0, 2.9, 7.3, 0.9, 0.1, 2.5, 6.9]],
    ["LeBron James", "LAL", "SF,PF", 17, 16.1, 16, 13, [0.51, 0.78, 2.1, 24.4, 7.8, 8.2, 1.0, 0.6, 3.7, 8.4]],
    ["Trae Young", "ATL", "PG", 20, 21.5, 21, 30, [0.41, 0.88, 2.9, 24.2, 3.1, 11.6, 1.2, 0.2, 4.7, 5.1]],
    ["Evan Mobley", "CLE", "PF,C", 19, 20.0, 19, 10, [0.56, 0.72, 1.0, 18.5, 9.3, 3.2, 0.9, 1.6, 1.8, 9.6]],
    ["Chet Holmgren", "OKC", "PF,C", 18, 18.6, 18, 16, [0.49, 0.75, 1.5, 15.0, 8.0, 2.0, 0.6, 2.2, 1.5, 7.9]],
    ["Jaren Jackson Jr.", "MEM", "PF,C", 22, 23.3, 23, 19, [0.49, 0.78, 1.8, 22.2, 5.6, 2.0, 1.2, 1.5, 1.9, 7.1]],
    ["Derrick White", "BOS", "PG,SG", 28, 31.0, 31, 18, [0.44, 0.86, 3.3, 16.4, 4.5, 4.8, 1.0, 1.1, 1.5, 7.3]],
    ["Alperen Sengun", "HOU", "C", 21, 19.4, 20, 28, [0.50, 0.70, 0.5, 19.1, 10.3, 4.9, 1.1, 0.8, 2.8, 5.5]],
    ["Bam Adebayo", "MIA", "C", 23, 22.1, 22, 25, [0.49, 0.77, 0.8, 18.1, 9.6, 4.3, 1.3, 0.7, 2.2, 6.0]],
    ["Pascal Siakam", "IND", "PF", 26, 25.5, 26, 27, [0.52, 0.73, 1.2, 20.2, 6.9, 3.4, 0.9, 0.5, 1.5, 6.2]],
    ["Ja Morant", "MEM", "PG", 24, 24.0, 24, 41, [0.45, 0.82, 1.8, 23.2, 4.1, 7.3, 1.2, 0.3, 3.4, 4.1]],
    ["Devin Booker", "PHX", "PG,SG", 25, 26.2, 27, 26, [0.46, 0.89, 2.5, 25.6, 4.1, 7.2, 0.9, 0.3, 3.0, 6.1]],
    ["James Harden", "LAC", "PG", 27, 27.8, 28, 24, [0.41, 0.87, 2.7, 22.8, 5.8, 8.7, 1.5, 0.7, 4.3, 6.4]],
    ["Franz Wagner", "ORL", "SF,PF", 33, 33.5, 33, 35, [0.45, 0.84, 1.4, 24.1, 5.7, 4.7, 1.3, 0.3, 2.9, 5.0]],
    ["Paolo Banchero", "ORL", "PF", 29, 28.7, 29, 44, [0.45, 0.72, 1.8, 25.9, 7.5, 4.8, 0.8, 0.6, 3.6, 3.9]],
    ["Kyrie Irving", "DAL", "PG,SG", 31, 34.9, 35, 23, [0.47, 0.91, 3.1, 24.7, 4.8, 4.6, 1.3, 0.5, 2.0, 6.7]],
    ["Scottie Barnes", "TOR", "SF,PF", 30, 30.2, 30, 32, [0.44, 0.75, 1.3, 19.3, 7.7, 5.8, 1.3, 1.0, 2.7, 5.4]],
    ["Amen Thompson", "HOU", "SG,SF", 32, 29.5, 30, 21, [0.56, 0.68, 0.2, 14.1, 8.2, 3.8, 1.4, 1.3, 1.8, 6.5]],
    ["Ivica Zubac", "LAC", "C", 38, 42.0, 42, 29, [0.63, 0.66, 0.0, 16.8, 12.6, 2.7, 0.7, 1.1, 1.6, 5.6]],
    ["Dyson Daniels", "ATL", "SG,SF", 40, 45.3, 45, 31, [0.49, 0.59, 1.3, 14.1, 5.9, 4.4, 3.0, 0.7, 2.0, 5.2]],
    ["Walker Kessler", "UTA", "C", 45, 51.7, 51, 33, [0.66, 0.53, 0.0, 11.1, 12.2, 1.7, 0.4, 2.4, 1.1, 5.0]],
    ["Rudy Gobert", "MIN", "C", 41, 46.6, 46, 36, [0.67, 0.67, 0.0, 12.0, 10.9, 1.8, 0.8, 1.4, 1.4, 4.8]],
    // Missing Hashtag rank (outside top 200 / not scraped)
    ["Zion Williamson", "NOP", "PF", 35, 32.6, 32, null, [0.57, 0.68, 0.1, 24.6, 7.2, 5.3, 1.2, 0.9, 3.4, 4.4]],
    // Missing Yahoo rank
    ["Cooper Flagg", "DAL", "SF,PF", null, 36.4, 36, 34, [0.47, 0.78, 1.5, 18.0, 7.0, 3.5, 1.0, 0.9, 2.4, 5.0]],
    // Missing ADP entirely
    ["Jalen Johnson", "ATL", "SF,PF", 34, null, null, 37, [0.50, 0.74, 1.1, 18.9, 10.0, 5.0, 1.6, 1.0, 2.9, 5.3]],
    // Missing cats
    ["Tyler Herro", "MIA", "PG,SG", 43, 39.8, 39, 40, null],
    // Only one source
    ["Deni Avdija", "POR", "SF,PF", null, 58.2, 58, null, [0.48, 0.78, 1.5, 16.9, 7.3, 3.9, 0.9, 0.5, 2.4, 3.5]],
  ];

  function slug(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  }
  var keys = ["fg", "ft", "tpm", "pts", "reb", "ast", "stl", "blk", "to", "total"];

  window.PLAYERS = rows.map(function (r) {
    var cats = null;
    if (r[7]) {
      cats = {};
      keys.forEach(function (k, i) { cats[k] = r[7][i]; });
    }
    return {
      id: slug(r[0]), name: r[0], team: r[1], pos: r[2],
      yahooRank: r[3], adp7: r[4], adpRank: r[5], hashtagRank: r[6], cats: cats,
    };
  });
  window.PLAYERS_SOURCE = "mock";
})();
