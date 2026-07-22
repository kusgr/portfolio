'use strict';

// DOM refs
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');
const nav = document.getElementById('nav');
const hamburger = document.getElementById('hamburger');
const mobileDrawer = document.getElementById('mobileDrawer');

// Custom cursor
let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;
let dotX = 0;
let dotY = 0;
let rafId = null;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (!rafId) rafId = requestAnimationFrame(animateCursor);
});

function animateCursor() {
  dotX += (mouseX - dotX) * 0.85;
  dotY += (mouseY - dotY) * 0.85;
  ringX += (mouseX - ringX) * 0.14;
  ringY += (mouseY - ringY) * 0.14;

  if (cursorDot) {
    cursorDot.style.transform = `translate(${dotX}px,${dotY}px) translate(-50%,-50%)`;
  }
  if (cursorRing) {
    cursorRing.style.transform = `translate(${ringX}px,${ringY}px) translate(-50%,-50%)`;
  }

  rafId = requestAnimationFrame(animateCursor);
}

const interactiveEls = 'a, button, .project-card, .about-card, .social-card, .skill-card, .cert-card';
document.addEventListener('mouseover', (e) => {
  if (e.target.closest(interactiveEls)) cursorRing?.classList.add('hovered');
});
document.addEventListener('mouseout', (e) => {
  if (e.target.closest(interactiveEls)) cursorRing?.classList.remove('hovered');
});

document.addEventListener('mouseleave', () => {
  if (cursorDot) cursorDot.style.opacity = '0';
  if (cursorRing) cursorRing.style.opacity = '0';
});
document.addEventListener('mouseenter', () => {
  if (cursorDot) cursorDot.style.opacity = '1';
  if (cursorRing) cursorRing.style.opacity = '1';
});

// Nav shadow on scroll
const onScrollNav = () => {
  nav?.classList.toggle('scrolled', window.scrollY > 60);
};
window.addEventListener('scroll', onScrollNav, { passive: true });
onScrollNav();

// Mobile drawer
hamburger?.addEventListener('click', () => {
  const isOpen = mobileDrawer?.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

document.querySelectorAll('.drawer-link').forEach((link) => {
  link.addEventListener('click', () => {
    mobileDrawer?.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

// Scroll reveal
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
);
document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// Active nav section
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navAnchors.forEach((a) => a.classList.remove('active'));
        const active = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
        active?.classList.add('active');
      }
    });
  },
  { rootMargin: '-40% 0px -55% 0px' }
);
sections.forEach((section) => sectionObserver.observe(section));

// Certification ticker loop
const tickerContent = document.getElementById('tickerContent');
if (tickerContent) {
  const clone = tickerContent.cloneNode(true);
  clone.setAttribute('aria-hidden', 'true');
  tickerContent.parentElement.appendChild(clone);
}

// Project card tilt
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
      card.style.transform =
        `translateY(-7px) scale(1.015) perspective(800px) rotateX(${-dy * 4}deg) rotateY(${dx * 4}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// About card glow
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('.about-card').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      const glow = card.querySelector('.card-glow');
      if (glow) {
        glow.style.background =
          `radial-gradient(ellipse 70% 60% at ${x}% ${y}%, var(--clr-blue-glow), transparent 70%)`;
      }
    });
  });
}

// Footer reveal
const footer = document.querySelector('.footer');
if (footer) {
  footer.style.cssText =
    'opacity:0; transform:translateY(14px); transition:opacity 0.7s ease, transform 0.7s ease;';
  new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      footer.style.opacity = '1';
      footer.style.transform = 'translateY(0)';
    }
  }, { threshold: 0.1 }).observe(footer);
}

// Nav link stagger
window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.nav-links li').forEach((li, i) => {
    li.style.opacity = '0';
    li.style.transform = 'translateY(-8px)';
    li.style.transition =
      `opacity 0.4s ease ${0.1 + i * 0.07}s, transform 0.4s ease ${0.1 + i * 0.07}s`;
    void li.offsetWidth;
    li.style.opacity = '1';
    li.style.transform = 'translateY(0)';
  });
});

// Escape closes the drawer
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileDrawer?.classList.contains('open')) {
    mobileDrawer.classList.remove('open');
    hamburger?.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }
});
