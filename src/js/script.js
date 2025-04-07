// Animações simples ao carregar os blocos
document.addEventListener("DOMContentLoaded", () => {
    const boxes = document.querySelectorAll(".bento-box");
    boxes.forEach((box, index) => {
      box.style.opacity = 0;
      box.style.transform = "translateY(20px)";
      setTimeout(() => {
        box.style.transition = "all 0.6s ease";
        box.style.opacity = 1;
        box.style.transform = "translateY(0)";
      }, index * 150);
    });
  });

  //animação sobre mim
  const fadeEls = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.3
  });

  fadeEls.forEach(el => observer.observe(el));


