const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelectorAll('.global-nav a');

if (menuButton) {
  menuButton.addEventListener('click', () => {
    const isOpen = document.body.classList.toggle('nav-open');
    menuButton.setAttribute('aria-expanded', String(isOpen));
  });
}

navLinks.forEach((link) => {
  link.addEventListener('click', () => {
    document.body.classList.remove('nav-open');
    menuButton?.setAttribute('aria-expanded', 'false');
  });
});

const revealTargets = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

revealTargets.forEach((target) => observer.observe(target));

// Typewriter: "I am SHUN"
const typewriterEl = document.getElementById('typewriter-text');
if (typewriterEl) {
  const words = 'I am SHUN';
  let idx = 0;
  function typeChar() {
    if (idx < words.length) {
      typewriterEl.textContent += words[idx++];
      setTimeout(typeChar, 80);
    }
  }
  setTimeout(typeChar, 1500);
}

const exampleBtn = document.getElementById('example-btn');
const exampleBox = document.getElementById('example-box');
if (exampleBtn && exampleBox) {
  exampleBtn.addEventListener('click', () => {
    const isOpen = !exampleBox.hidden;
    exampleBox.hidden = isOpen;
    exampleBtn.textContent = isOpen ? '記入例を見る' : '記入例を閉じる';
    exampleBtn.classList.toggle('is-open', !isOpen);
  });
}
