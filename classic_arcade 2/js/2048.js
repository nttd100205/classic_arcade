(() => {
  let el = document.getElementById("board");
  if (!el) return;
  let b, s = 0,
    over = false;
  const msg = document.getElementById("message"),
    sc = document.getElementById("score");

  function add() {
    let e = [];
    b.forEach((r, y) => r.forEach((v, x) => {
      if (!v) e.push([y, x])
    }));
    if (e.length) {
      let p = e[Math.random() * e.length | 0];
      b[p[0]][p[1]] = Math.random() < .9 ? 2 : 4
    }
  }

  function draw() {
    el.innerHTML = "";
    el.className = "board " + document.getElementById("palette").value;
    b.flat().forEach(v => {
      let d = document.createElement("div");
      d.className = "tile";
      if (v) d.dataset.v = v;
      d.textContent = v || "";
      el.append(d)
    });
    sc.textContent = s
  }

  function start() {
    b = Array.from({
      length: 4
    }, () => [0, 0, 0, 0]);
    s = 0;
    over = false;
    add();
    add();
    draw();
    msg.textContent = "Use arrow keys or swipe to move."
  }

  function line(r) {
    let a = r.filter(Boolean),
      o = [];
    for (let i = 0; i < a.length; i++) {
      if (a[i] === a[i + 1]) {
        o.push(a[i] * 2);
        s += a[i] * 2;
        i++
      } else o.push(a[i])
    }
    while (o.length < 4) o.push(0);
    return o
  }

  function move(k) {
    if (over) return;
    let old = JSON.stringify(b);
    if (k === "ArrowLeft") b = b.map(line);
    if (k === "ArrowRight") b = b.map(r => line(r.slice().reverse()).reverse());
    if (k === "ArrowUp" || k === "ArrowDown")
      for (let x = 0; x < 4; x++) {
        let c = b.map(r => r[x]);
        if (k === "ArrowDown") c.reverse();
        c = line(c);
        if (k === "ArrowDown") c.reverse();
        c.forEach((v, y) => b[y][x] = v)
      }
    if (old !== JSON.stringify(b)) {
      add();
      draw();
      if (!b.some(r => r.includes(0)) && !b.some((r, y) => r.some((v, x) => x < 3 && v === r[x + 1] || y < 3 && v === b[y + 1][x]))) {
        over = true;
        msg.textContent = "Game over! Final score: " + s;
        record("2048", s)
      }
    }
  }
  document.addEventListener("keydown", e => {
    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)) {
      e.preventDefault();
      move(e.key)
    }
  });
  let sx, sy;
  el.addEventListener("touchstart", e => {
    sx = e.touches[0].clientX;
    sy = e.touches[0].clientY
  }, {
    passive: true
  });
  el.addEventListener("touchend", e => {
    let dx = e.changedTouches[0].clientX - sx,
      dy = e.changedTouches[0].clientY - sy;
    if (Math.max(Math.abs(dx), Math.abs(dy)) > 25) move(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "ArrowRight" : "ArrowLeft") : (dy > 0 ? "ArrowDown" : "ArrowUp"))
  });
  document.getElementById("start").onclick = start;
  document.getElementById("palette").onchange = draw;
  start()
})();
