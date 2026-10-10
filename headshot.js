(function () {
  'use strict';
  var arena = document.getElementById('arena');
  var target = document.getElementById('target');
  var msg = document.getElementById('message');
  var startBtn = document.getElementById('startBtn');
  var againBtn = document.getElementById('againBtn');
  var startScreen = document.getElementById('startScreen');
  var endScreen = document.getElementById('endScreen');
  var resultEl = document.getElementById('result');
  var rankEl = document.getElementById('rank');

  var TOTAL_ROUNDS = 10;
  var round = 0;
  var times = [];
  var startTime = 0;
  var waitTimer = null;

  function randPos() {
    var pad = 70;
    var r = arena.getBoundingClientRect();
    var maxX = Math.max(r.width - pad * 2, 10);
    var maxY = Math.max(r.height - pad * 2, 10);
    return { x: pad + Math.random() * maxX, y: pad + Math.random() * maxY };
  }

  function nextRound() {
    if (round >= TOTAL_ROUNDS) { finish(); return; }
    target.style.display = 'none';
    msg.textContent = 'Wait for the target…';
    var delay = 800 + Math.random() * 2200;
    waitTimer = setTimeout(function () {
      var p = randPos();
      target.style.left = p.x + 'px';
      target.style.top = p.y + 'px';
      target.style.display = 'block';
      startTime = performance.now();
      msg.textContent = 'TAP NOW!';
    }, delay);
  }

  target.addEventListener('pointerdown', function (e) {
    e.preventDefault();
    if (target.style.display !== 'block') return;
    var ms = Math.round(performance.now() - startTime);
    times.push(ms);
    round++;
    clearTimeout(waitTimer);
    target.style.display = 'none';
    if (round >= TOTAL_ROUNDS) { finish(); return; }
    msg.textContent = ms + ' ms — ' + (TOTAL_ROUNDS - round) + ' left';
    setTimeout(nextRound, 600);
  });

  function rankFor(avg) {
    if (avg < 250) return '🏆 GRANDMASTER — insane speed!';
    if (avg < 350) return '💎 HEROIC — pro player!';
    if (avg < 450) return '🔷 DIAMOND — sharp!';
    if (avg < 600) return '🟢 PLATINUM — good!';
    return '🟡 GOLD — keep practicing!';
  }

  function finish() {
    clearTimeout(waitTimer);
    target.style.display = 'none';
    var sum = times.reduce(function (a, b) { return a + b; }, 0);
    var avg = Math.round(sum / times.length);
    var best = Math.min.apply(null, times);
    resultEl.textContent = 'Average: ' + avg + ' ms • Best: ' + best + ' ms';
    rankEl.textContent = rankFor(avg);
    msg.textContent = 'Test complete!';
    endScreen.style.display = 'flex';
  }

  function startGame() {
    startScreen.style.display = 'none';
    endScreen.style.display = 'none';
    round = 0;
    times = [];
    nextRound();
  }

  startBtn.addEventListener('click', startGame);
  againBtn.addEventListener('click', startGame);
})();
