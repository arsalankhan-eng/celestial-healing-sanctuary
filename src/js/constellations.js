// Interactive Constellation & Starlight Background Canvas (Mobile & Touch Optimized)
export function initConstellations() {
  const canvas = document.getElementById("celestial-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let pointer = { x: null, y: null, radius: 130 };

  let lastWidth = width;
  window.addEventListener("resize", () => {
    // Only recreate stars if actual width changed significantly (avoids mobile address bar scroll jumps)
    if (Math.abs(window.innerWidth - lastWidth) > 30) {
      lastWidth = width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createStars();
    } else {
      height = canvas.height = window.innerHeight;
    }
  });

  // Mouse & Touch Support
  window.addEventListener("mousemove", (e) => {
    pointer.x = e.clientX;
    pointer.y = e.clientY;
  });

  window.addEventListener("mouseleave", () => {
    pointer.x = null;
    pointer.y = null;
  });

  window.addEventListener("touchstart", (e) => {
    if (e.touches.length > 0) {
      pointer.x = e.touches[0].clientX;
      pointer.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) {
      pointer.x = e.touches[0].clientX;
      pointer.y = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener("touchend", () => {
    pointer.x = null;
    pointer.y = null;
  });

  let stars = [];
  const starCount = Math.min(100, Math.max(35, Math.floor((width * height) / 12000)));

  function createStars() {
    stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.2,
        vy: (Math.random() - 0.5) * 0.2,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        isGolden: Math.random() < 0.2
      });
    }
  }

  createStars();

  function draw() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      s.x += s.vx;
      s.y += s.vy;

      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;
      if (s.y < 0) s.y = height;
      if (s.y > height) s.y = 0;

      s.alpha += s.twinkleSpeed;
      if (s.alpha > 0.85 || s.alpha < 0.2) {
        s.twinkleSpeed = -s.twinkleSpeed;
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = s.isGolden
        ? `rgba(229, 192, 123, ${Math.max(0.1, s.alpha)})`
        : `rgba(240, 235, 255, ${Math.max(0.1, s.alpha * 0.75)})`;
      ctx.fill();

      // Connect stars near pointer (mouse or finger touch)
      if (pointer.x !== null) {
        const dx = pointer.x - s.x;
        const dy = pointer.y - s.y;
        const dist = Math.hypot(dx, dy);

        if (dist < pointer.radius) {
          const lineAlpha = (1 - dist / pointer.radius) * 0.4;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.strokeStyle = `rgba(212, 175, 55, ${lineAlpha})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      // Inter-constellation connections
      for (let j = i + 1; j < stars.length; j++) {
        const s2 = stars[j];
        const dist2 = Math.hypot(s.x - s2.x, s.y - s2.y);
        if (dist2 < 70) {
          const lineAlpha = (1 - dist2 / 70) * 0.1;
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
