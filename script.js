document.addEventListener("DOMContentLoaded", () => {
  const stage = document.querySelector(".stage");
  const envelopeWrapper = document.getElementById("envelope-wrapper");
  const promptText = document.getElementById("prompt-text");
  const resetBtn = document.getElementById("reset-btn");
  const cardArtwork = document.getElementById("card-artwork");
  const cardFallback = document.getElementById("card-fallback");

  let isOpen = false;
  let controlsTimer = null;

  function showFallback() {
    if (cardArtwork) cardArtwork.style.display = "none";
    if (cardFallback) cardFallback.classList.add("show");
  }

  if (cardArtwork && cardFallback) {
    if (cardArtwork.complete && cardArtwork.naturalWidth === 0) {
      showFallback();
    } else {
      cardArtwork.addEventListener("error", showFallback);
    }
  }

  function openInvitation() {
    if (isOpen) return;
    isOpen = true;

    clearTimeout(controlsTimer);

    envelopeWrapper.classList.add("open");
    stage.classList.add("is-open");
    envelopeWrapper.setAttribute("aria-expanded", "true");

    if (promptText) promptText.hidden = true;
    if (resetBtn) resetBtn.hidden = true;

    controlsTimer = setTimeout(() => {
      if (isOpen && resetBtn) {
        resetBtn.hidden = false;
      }
    }, 900);
  }

  function closeInvitation(event) {
    if (event) event.stopPropagation();
    if (!isOpen) return;
    isOpen = false;

    clearTimeout(controlsTimer);

    envelopeWrapper.classList.remove("open");
    stage.classList.remove("is-open");
    envelopeWrapper.setAttribute("aria-expanded", "false");

    if (resetBtn) resetBtn.hidden = true;

    controlsTimer = setTimeout(() => {
      if (!isOpen && promptText) {
        promptText.hidden = false;
      }
    }, 600);
  }

  envelopeWrapper.addEventListener("click", () => {
    if (!isOpen) openInvitation();
  });

  envelopeWrapper.addEventListener("keydown", (e) => {
    if (!isOpen && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      openInvitation();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen) {
      closeInvitation();
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", closeInvitation);
  }

  /* Ambient Floating Gold Particles */
  const canvas = document.getElementById("particles-canvas");
  const ctx = canvas ? canvas.getContext("2d") : null;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let particles = [];

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
    if (!canvas) return;
    const count = Math.min(50, Math.floor((window.innerWidth * window.innerHeight) / 18000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.8 + 0.6,
      speedY: -(Math.random() * 0.35 + 0.12),
      speedX: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.65 + 0.2,
      pulse: Math.random() * Math.PI * 2,
    }));
  }

  function animateParticles() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.pulse += 0.025;

      if (p.y < -10) p.y = canvas.height + 10;
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;

      const currentAlpha = p.alpha * (0.65 + 0.35 * Math.sin(p.pulse));

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(242, 213, 143, ${currentAlpha})`;
      ctx.shadowBlur = 8;
      ctx.shadowColor = "rgba(242, 213, 143, 0.8)";
      ctx.fill();
    });

    if (!prefersReducedMotion) {
      requestAnimationFrame(animateParticles);
    }
  }

  if (canvas && ctx) {
    window.addEventListener("resize", () => {
      resizeCanvas();
      createParticles();
      if (prefersReducedMotion) animateParticles();
    });

    resizeCanvas();
    createParticles();
    animateParticles();
  }
});