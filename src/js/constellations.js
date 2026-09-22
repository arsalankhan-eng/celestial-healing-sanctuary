// Interactive Constellation & Starlight Background Canvas
export function initConstellations() {
  const canvas = document.getElementById("celestial-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let mouse = { x: null, y: null, radius: 140 };

  window.addEventListener("resize", () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    createStars();
  });

  window.addEventListener("mousemove", (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  window.addEventListener("mouseleave", () => {
    mouse.x = null;
    mouse.y = null;
  });

  let stars = [];
  const count = Math.floor((width * height) / 10000);

  function createStars() {
    stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.6 + 0.4,
        baseAlpha: Math.random() * 0.6 + 0.2,
        alpha: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.02 + 0.005,
        isGolden: Math.random() < 0.18
      });
    }
  }

  createStars();

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw stars
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      s.x += s.vx;
      s.y += s.vy;

      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;
      if (s.y < 0) s.y = height;
      if (s.y > height) s.y = 0;

      s.alpha += s.twinkleSpeed;
      if (s.alpha > 0.9 || s.alpha < 0.2) {
        s.twinkleSpeed = -s.twinkleSpeed;
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = s.isGolden
        ? `rgba(229, 192, 123, ${Math.max(0.1, s.alpha)})`
        : `rgba(240, 235, 255, ${Math.max(0.1, s.alpha * 0.75)})`;
      ctx.fill();

      // Connect stars near mouse
      if (mouse.x !== null) {
        const dx = mouse.x - s.x;
        const dy = mouse.y - s.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < mouse.radius) {
          const lineAlpha = (1 - dist / mouse.radius) * 0.45;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(212, 175, 55, ${lineAlpha})`;
          ctx.lineWidth = 0.65;
          ctx.stroke();
        }
      }

      // Constellation inter-connections
      for (let j = i + 1; j < stars.length; j++) {
        const s2 = stars[j];
        const dist2 = Math.hypot(s.x - s2.x, s.y - s2.y);
        if (dist2 < 75) {
          const lineAlpha = (1 - dist2 / 75) * 0.12;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s2.x, s2.y);
          ctx.strokeStyle = `rgba(220, 205, 250, ${lineAlpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
}
