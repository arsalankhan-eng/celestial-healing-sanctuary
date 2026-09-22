// =========================================================
// SACRED CELESTIAL ALCHEMY & HEALING AMBIENT CANVAS
// Features:
// 1. Slow Prana Breathing Aura Nebulae (Amethyst, Gold & Rose)
// 2. Rotating Sacred Geometric Celestial Orbit Rings
// 3. Shimmering Starlight & Ambient Prana Dust
// 4. Occasional Ethereal Shooting Stars / Comets
// 5. Interactive Touch / Click Sacred Geometry Energy Ripples
// =========================================================

export function initConstellations() {
  const canvas = document.getElementById("celestial-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  let pointer = { x: null, y: null, radius: 140 };
  let ripples = [];
  let shootingStars = [];
  let stars = [];
  let rotationAngle = 0;
  let breathPhase = 0;

  // Track window resizing smoothly
  let lastWidth = width;
  window.addEventListener("resize", () => {
    if (Math.abs(window.innerWidth - lastWidth) > 30) {
      lastWidth = width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      createStars();
    } else {
      height = canvas.height = window.innerHeight;
    }
  });

  // Mouse & Touch Tracking
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
      createRipple(pointer.x, pointer.y);
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

  // Click creates an energetic healing aura ripple
  window.addEventListener("click", (e) => {
    createRipple(e.clientX, e.clientY);
  });

  function createRipple(x, y) {
    ripples.push({
      x: x,
      y: y,
      radius: 5,
      maxRadius: Math.min(width, height) * 0.35,
      alpha: 0.65,
      lineWidth: 2,
      nodes: 8
    });
  }

  // Generate background stars & floating prana particles
  const starCount = Math.min(120, Math.max(45, Math.floor((width * height) / 10000)));

  function createStars() {
    stars = [];
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -Math.random() * 0.25 - 0.05, // gentle upward floating prana smoke
        radius: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.6 + 0.2,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        isGolden: Math.random() < 0.25,
        shimmerPulse: Math.random() * Math.PI
      });
    }
  }

  createStars();

  // Shooting Star / Comet Trigger
  function maybeSpawnShootingStar() {
    if (shootingStars.length === 0 && Math.random() < 0.008) {
      const startX = Math.random() * (width * 0.7);
      const startY = Math.random() * (height * 0.4);
      const length = Math.random() * 120 + 80;
      const angle = Math.PI / 4 + (Math.random() - 0.5) * 0.3; // ~45 deg downward
      shootingStars.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * 7,
        vy: Math.sin(angle) * 7,
        length: length,
        alpha: 1,
        life: 0,
        maxLife: 45
      });
    }
  }

  // Aura Nebulae orbs (Lissajous organic drift)
  const orbs = [
    { xRatio: 0.25, yRatio: 0.3, color: "rgba(107, 33, 168, ", size: 360, speed: 0.0004 },  // Violet 7th chakra
    { xRatio: 0.75, yRatio: 0.65, color: "rgba(202, 138, 4, ", size: 320, speed: 0.00035 }, // Solar gold
    { xRatio: 0.5, yRatio: 0.45, color: "rgba(147, 51, 234, ", size: 280, speed: 0.0005 }   // Amethyst resonance
  ];

  function drawAuraNebulae() {
    breathPhase += 0.008; // slow meditative breathing cycle (~8-10s)
    const breathScale = 1 + Math.sin(breathPhase) * 0.12;

    orbs.forEach((orb, i) => {
      const time = Date.now() * orb.speed;
      const ox = (width * orb.xRatio) + Math.cos(time + i) * 60;
      const oy = (height * orb.yRatio) + Math.sin(time * 0.8 + i) * 50;
      const radius = orb.size * breathScale;

      const grad = ctx.createRadialGradient(ox, oy, 0, ox, oy, radius);
      grad.addColorStop(0, `${orb.color}0.18)`);
      grad.addColorStop(0.5, `${orb.color}0.08)`);
      grad.addColorStop(1, `${orb.color}0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(ox, oy, radius, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  // Rotating Sacred Geometry Rings (Ancient Altar Vibration)
  function drawSacredGeometry() {
    rotationAngle += 0.0006; // ultra slow peaceful rotation

    const cx = width * 0.5;
    const cy = Math.min(height * 0.45, 450);
    const baseR = Math.min(width, height) * 0.28;

    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(rotationAngle);

    // Outer subtle gold dashed ring
    ctx.strokeStyle = "rgba(212, 175, 55, 0.05)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 12]);
    ctx.beginPath();
    ctx.arc(0, 0, baseR, 0, Math.PI * 2);
    ctx.stroke();

    // Inner sacred ring
    ctx.setLineDash([2, 8]);
    ctx.strokeStyle = "rgba(229, 192, 123, 0.04)";
    ctx.beginPath();
    ctx.arc(0, 0, baseR * 0.7, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 8 Cardinal Starlight nodes
    const nodeCount = 8;
    for (let k = 0; k < nodeCount; k++) {
      const a = (k * Math.PI * 2) / nodeCount;
      const nx = Math.cos(a) * baseR;
      const ny = Math.sin(a) * baseR;

      ctx.beginPath();
      ctx.arc(nx, ny, 1.8, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(250, 235, 200, 0.12)";
      ctx.fill();
    }

    ctx.restore();
  }

  // Main Render Loop
  function draw() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw soothing breathing aura nebulae
    drawAuraNebulae();

    // 2. Draw rotating sacred celestial rings
    drawSacredGeometry();

    // 3. Draw & update starlight and ascending prana particles
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i];

      s.x += s.vx;
      s.y += s.vy;

      // Soft wrap-around
      if (s.x < 0) s.x = width;
      if (s.x > width) s.x = 0;
      if (s.y < 0) s.y = height;
      if (s.y > height) s.y = 0;

      s.alpha += s.twinkleSpeed;
      if (s.alpha > 0.85 || s.alpha < 0.18) {
        s.twinkleSpeed = -s.twinkleSpeed;
      }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
      ctx.fillStyle = s.isGolden
        ? `rgba(235, 195, 125, ${Math.max(0.1, s.alpha)})`
        : `rgba(240, 235, 255, ${Math.max(0.1, s.alpha * 0.7)})`;
      ctx.fill();

      // Soft glow around golden stars
      if (s.isGolden && s.alpha > 0.6) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius * 2.8, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 175, 55, ${s.alpha * 0.12})`;
        ctx.fill();
      }

      // Constellation linkage with cursor / finger touch
      if (pointer.x !== null) {
        const dx = pointer.x - s.x;
        const dy = pointer.y - s.y;
        const dist = Math.hypot(dx, dy);

        if (dist < pointer.radius) {
          const lineAlpha = (1 - dist / pointer.radius) * 0.38;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.strokeStyle = `rgba(212, 175, 55, ${lineAlpha})`;
          ctx.lineWidth = 0.65;
          ctx.stroke();
        }
      }

      // Constellation lines between nearby stars
      for (let j = i + 1; j < stars.length; j++) {
        const s2 = stars[j];
        const dist2 = Math.hypot(s.x - s2.x, s.y - s2.y);
        if (dist2 < 72) {
          const lineAlpha = (1 - dist2 / 72) * 0.09;
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s2.x, s2.y);
          ctx.strokeStyle = `rgba(220, 205, 250, ${lineAlpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // 4. Update & draw interactive healing touch ripples
    for (let r = ripples.length - 1; r >= 0; r--) {
      const rip = ripples[r];
      rip.radius += 3.2;
      rip.alpha *= 0.96;

      if (rip.alpha <= 0.01 || rip.radius >= rip.maxRadius) {
        ripples.splice(r, 1);
        continue;
      }

      // Expanding wave ring
      ctx.beginPath();
      ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(212, 175, 55, ${rip.alpha * 0.7})`;
      ctx.lineWidth = rip.lineWidth;
      ctx.stroke();

      // Second soft inner glow ring
      ctx.beginPath();
      ctx.arc(rip.x, rip.y, rip.radius * 0.7, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(180, 140, 240, ${rip.alpha * 0.35})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Cardinal starlight pips along the expanding ring
      for (let k = 0; k < rip.nodes; k++) {
        const angle = (k * Math.PI * 2) / rip.nodes + (rip.radius * 0.02);
        const px = rip.x + Math.cos(angle) * rip.radius;
        const py = rip.y + Math.sin(angle) * rip.radius;

        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(250, 235, 200, ${rip.alpha})`;
        ctx.fill();
      }
    }

    // 5. Update & draw occasional shooting stars
    maybeSpawnShootingStar();
    for (let m = shootingStars.length - 1; m >= 0; m--) {
      const star = shootingStars[m];
      star.x += star.vx;
      star.y += star.vy;
      star.life++;

      const progress = star.life / star.maxLife;
      const alpha = (1 - progress) * 0.85;

      const tailX = star.x - (star.vx * 6);
      const tailY = star.y - (star.vy * 6);

      const grad = ctx.createLinearGradient(star.x, star.y, tailX, tailY);
      grad.addColorStop(0, `rgba(255, 245, 220, ${alpha})`);
      grad.addColorStop(0.4, `rgba(212, 175, 55, ${alpha * 0.6})`);
      grad.addColorStop(1, `rgba(212, 175, 55, 0)`);

      ctx.beginPath();
      ctx.moveTo(star.x, star.y);
      ctx.lineTo(tailX, tailY);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.8;
      ctx.stroke();

      // Star head sparkle
      ctx.beginPath();
      ctx.arc(star.x, star.y, 1.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.fill();

      if (star.life >= star.maxLife) {
        shootingStars.splice(m, 1);
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
}
