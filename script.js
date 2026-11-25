document.addEventListener("DOMContentLoaded", () => {
  const stage = document.querySelector(".stage");
  const envelopeWrapper = document.getElementById("envelope-wrapper");
  const promptText = document.getElementById("prompt-text");
  const resetBtn = document.getElementById("reset-btn");
  const cardArtwork = document.getElementById("card-artwork");
  const cardFallback = document.getElementById("card-fallback");

  let isOpen = false;

  // If the image fails to load, show a helpful message instead of an empty card
  if (cardArtwork && cardFallback) {
    cardArtwork.addEventListener("error", () => {
      cardArtwork.style.display = "none";
      cardFallback.classList.add("show");
    });
  }

  function openInvitation() {
    if (isOpen) return;
    isOpen = true;

    envelopeWrapper.classList.add("open");
    stage.classList.add("is-open");
    envelopeWrapper.setAttribute("aria-expanded", "true");

    promptText.hidden = true;
    setTimeout(() => {
      resetBtn.hidden = false;
    }, 950);
  }

  function closeInvitation(event) {
    if (event) event.stopPropagation();
    if (!isOpen) return;
    isOpen = false;

    envelopeWrapper.classList.remove("open");
    stage.classList.remove("is-open");
    envelopeWrapper.setAttribute("aria-expanded", "false");

    resetBtn.hidden = true;
    setTimeout(() => {
      promptText.hidden = false;
    }, 650);
  }

  envelopeWrapper.addEventListener("click", openInvitation);
  envelopeWrapper.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openInvitation();
    }
  });

  resetBtn.addEventListener("click", closeInvitation);

  /* Ambient Floating Gold Particles */
  const canvas = document.getElementById("particles-canvas");
  const ctx = canvas.getContext("2d");
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticles() {
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

    requestAnimationFrame(animateParticles);
  }

  window.addEventListener("resize", () => {
    resizeCanvas();
    createParticles();
  });

  resizeCanvas();
  createParticles();
  animateParticles();
});