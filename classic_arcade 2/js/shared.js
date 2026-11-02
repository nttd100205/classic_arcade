const KEY = "classicArcadeScores";

function allScores() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || []
  } catch (e) {
    return []
  }
}

function record(game, score) {
  let a = allScores();
  a.push({
    game,
    score: Number(score) || 0,
    date: Date.now()
  });
  localStorage.setItem(KEY, JSON.stringify(a))
}
document.addEventListener("DOMContentLoaded", () => {
  let t = document.getElementById("theme");
  if (localStorage.getItem("arcadeTheme") === "light") document.body.classList.add("light");
  if (t) t.onclick = () => {
    document.body.classList.toggle("light");
    localStorage.setItem("arcadeTheme", document.body.classList.contains("light") ? "light" : "dark")
  }
});
