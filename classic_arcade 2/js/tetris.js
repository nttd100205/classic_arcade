(() => {
  let c = document.getElementById("game");
  if (!c) return;
  let x = c.getContext("2d"),
    W = 10,
    H = 20,
    S = 30,
    colors = [null, "#67d8e8", "#a78bfa", "#f2b36d", "#70e1ad", "#ef7898", "#6f9bea", "#e6d36f"],
    shapes = [
      [
        [1, 1, 1, 1]
      ],
      [
        [2, 0, 0],
        [2, 2, 2]
      ],
      [
        [0, 0, 3],
        [3, 3, 3]
      ],
      [
        [4, 4],
        [4, 4]
      ],
      [
        [0, 5, 5],
        [5, 5, 0]
      ],
      [
        [0, 6, 0],
        [6, 6, 6]
      ],
      [
        [7, 7, 0],
        [0, 7, 7]
      ]
    ],
    a, p, score = 0,
    lines = 0,
    level = 1,
    last = 0,
    acc = 0,
    interval = 800,
    raf, run = false,
    pause = false;

  function mat() {
    return Array.from({
      length: H
    }, () => Array(W).fill(0))
  }

  function hit() {
    for (let y = 0; y < p.m.length; y++)
      for (let z = 0; z < p.m[y].length; z++)
        if (p.m[y][z] && (a[y + p.y] && a[y + p.y][z + p.x]) !== 0) return true;
    return false
  }

  function spawn() {
    let m = shapes[Math.random() * shapes.length | 0].map(r => r.slice());
    p = {
      m,
      x: W / 2 - Math.ceil(m[0].length / 2) | 0,
      y: 0
    };
    if (hit()) finish()
  }

  function merge() {
    p.m.forEach((r, y) => r.forEach((v, z) => {
      if (v) a[y + p.y][z + p.x] = v
    }))
  }

  function rotate() {
    let original = p.m;
    p.m = original[0].map((_, column) => original.map(row => row[column]).reverse());
    if (hit()) p.m = original
  }

  function sweep() {
    let n = 0;
    outer: for (let y = H - 1; y >= 0; y--) {
      if (a[y].some(v => !v)) continue outer;
      a.splice(y, 1);
      a.unshift(Array(W).fill(0));
      n++;
      y++
    }
    if (n) {
      lines += n;
      score += [0, 100, 300, 500, 800][n] * level;
      level = (lines / 10 | 0) + 1;
      interval = Math.max(120, 800 - (level - 1) * 60)
    }
  }

  function update() {
    document.getElementById("score").textContent = score;
    document.getElementById("lines").textContent = lines;
    document.getElementById("level").textContent = level
  }

  function draw() {
    x.fillStyle = "#101a2c";
    x.fillRect(0, 0, 300, 600);

    function cell(z, y, v) {
      if (v) {
        x.fillStyle = colors[v];
        x.fillRect(z * S + 1, y * S + 1, S - 2, S - 2)
      }
    }
    a.forEach((r, y) => r.forEach((v, z) => cell(z, y, v)));
    if (p) p.m.forEach((r, y) => r.forEach((v, z) => cell(z + p.x, y + p.y, v)))
  }

  function drop() {
    p.y++;
    if (hit()) {
      p.y--;
      merge();
      sweep();
      spawn()
    }
    acc = 0
  }

  function finish() {
    run = false;
    cancelAnimationFrame(raf);
    document.getElementById("message").textContent = "Game over! Final score: " + score;
    record("Tetris", score)
  }

  function loop(t = 0) {
    if (!run || pause) return;
    acc += t - last;
    last = t;
    if (acc > interval) drop();
    draw();
    update();
    raf = requestAnimationFrame(loop)
  }

  function start() {
    cancelAnimationFrame(raf);
    a = mat();
    score = lines = 0;
    level = 1;
    interval = 800;
    acc = 0;
    last = 0;
    run = true;
    pause = false;
    spawn();
    document.getElementById("message").textContent = "Game on! P pauses.";
    loop()
  }
  document.addEventListener("keydown", e => {
    if (!p) return;
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      e.preventDefault();
      p.x += e.key === "ArrowLeft" ? -1 : 1;
      if (hit()) p.x += e.key === "ArrowLeft" ? 1 : -1
    }
    if (e.key === "ArrowUp") rotate();
    if (e.key === "ArrowDown" && run && !pause) {
      drop();
      score++
    }
    if (e.code === "Space" && run && !pause) {
      e.preventDefault();
      do {
        p.y++
      } while (!hit());
      p.y--;
      merge();
      sweep();
      spawn()
    }
    if (e.key.toLowerCase() === "p" && run) {
      pause = !pause;
      document.getElementById("message").textContent = pause ? "Paused — press P to resume." : "Game resumed.";
      if (!pause) {
        last = 0;
        loop()
      }
    }
    draw();
    update()
  });
  document.getElementById("start").onclick = start;
  a = mat();
  spawn();
  draw()
})();
