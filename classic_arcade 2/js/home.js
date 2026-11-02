document.addEventListener("DOMContentLoaded", () => {
  let a = allScores();
  [
    ["2048", "b2048"],
    ["Snake", "bSnake"],
    ["Tetris", "bTetris"]
  ].forEach(([g, id]) => {
    let el = document.getElementById(id),
      s = a.filter(x => x.game === g).sort((x, y) => y.score - x.score).slice(0, 5);
    el.innerHTML = s.length ? s.map(x => "<li>Player <b>" + x.score.toLocaleString() + "</b></li>").join("") : "<li>No scores yet</li>"
  });
  document.getElementById("played").textContent = a.length;
  document.getElementById("saved").textContent = a.length;
  document.getElementById("top").textContent = a.length ? Math.max(...a.map(x => x.score)).toLocaleString() : 0
});
