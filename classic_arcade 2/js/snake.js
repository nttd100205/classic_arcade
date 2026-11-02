(() => {
  let c = document.getElementById("game");
  if (!c) return;
  let x = c.getContext("2d"),
    n = 24,
    cell = 20,
    snake, food, dir, score, timer, run = false;

  function foodPos() {
    let p;
    do {
      p = {
        x: Math.random() * n | 0,
        y: Math.random() * n | 0
      }
    } while (snake.some(q => q.x === p.x && q.y === p.y));
    return p
  }

  function draw() {
    x.fillStyle = "#101a2c";
    x.fillRect(0, 0, 480, 480);
    x.strokeStyle = "#1c2a40";
    for (let i = 0; i <= n; i++) {
      x.beginPath();
      x.moveTo(i * cell, 0);
      x.lineTo(i * cell, 480);
      x.stroke();
      x.beginPath();
      x.moveTo(0, i * cell);
      x.lineTo(480, i * cell);
      x.stroke()
    }
    x.fillStyle = "#ff718c";
    x.fillRect(food.x * cell + 4, food.y * cell + 4, 12, 12);
    snake.forEach((p, i) => {
      x.fillStyle = i ? "#51c99b" : "#a4f5d1";
      x.fillRect(p.x * cell + 1, p.y * cell + 1, 18, 18)
    })
  }

  function end() {
    clearInterval(timer);
    run = false;
    document.getElementById("message").textContent = "Game over! Final score: " + score;
    record("Snake", score)
  }

  function tick() {
    let h = {
      x: snake[0].x + dir.x,
      y: snake[0].y + dir.y
    };
    if (h.x < 0 || h.y < 0 || h.x >= n || h.y >= n || snake.slice(0, -1).some(p => p.x === h.x && p.y === h.y)) {
      end();
      return
    }
    snake.unshift(h);
    if (h.x === food.x && h.y === food.y) {
      score += 10;
      food = foodPos();
      document.getElementById("score").textContent = score
    } else snake.pop();
    draw()
  }

  function start() {
    clearInterval(timer);
    snake = [{
      x: 12,
      y: 12
    }, {
      x: 11,
      y: 12
    }, {
      x: 10,
      y: 12
    }];
    dir = {
      x: 1,
      y: 0
    };
    score = 0;
    food = foodPos();
    run = true;
    document.getElementById("score").textContent = 0;
    document.getElementById("message").textContent = "Good luck!";
    draw();
    timer = setInterval(tick, 115)
  }
  let dirs = {
    ArrowUp: {
      x: 0,
      y: -1
    },
    w: {
      x: 0,
      y: -1
    },
    ArrowDown: {
      x: 0,
      y: 1
    },
    s: {
      x: 0,
      y: 1
    },
    ArrowLeft: {
      x: -1,
      y: 0
    },
    a: {
      x: -1,
      y: 0
    },
    ArrowRight: {
      x: 1,
      y: 0
    },
    d: {
      x: 1,
      y: 0
    }
  };

  function turn(d) {
    if (!run) start();
    if (d.x !== -dir.x || d.y !== -dir.y) dir = d
  }
  document.addEventListener("keydown", e => {
    if (dirs[e.key]) {
      e.preventDefault();
      turn(dirs[e.key])
    }
  });
  document.querySelectorAll("[data-d]").forEach(b => b.onclick = () => turn(({
    up: dirs.ArrowUp,
    down: dirs.ArrowDown,
    left: dirs.ArrowLeft,
    right: dirs.ArrowRight
  })[b.dataset.d]));
  document.getElementById("start").onclick = start;
  draw()
})();
