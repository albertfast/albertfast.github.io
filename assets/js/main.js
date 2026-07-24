/* ============================================================
   ORVLI — Interactions
   Cursor, scroll reveals, nav, 3D tilt on cards, magnetic
   buttons, animated counters, mobile menu, contact form.
   ============================================================ */
(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isCoarse = window.matchMedia('(pointer: coarse)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

  /* ----------------------- Loading veil ----------------------- */
  window.addEventListener('load', () => {
    document.body.classList.remove('loading');
    triggerHero();
  });
  // Safety: never trap the user if 'load' already fired or is delayed.
  setTimeout(() => {
    document.body.classList.remove('loading');
    triggerHero();
  }, 1400);

  /* ----------------------- Custom cursor ----------------------- */
  // Custom cursor disabled — users prefer the native OS cursor.
  (function cursor() {
    return;
    if (isCoarse) return;
    const root = $('.cursor');
    if (!root) return;
    const dot = $('.cursor__dot', root);
    const ring = $('.cursor__ring', root);
    let mx = window.innerWidth / 2, my = window.innerHeight / 2;
    let rx = mx, ry = my;

    window.addEventListener('pointermove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    }, { passive: true });

    window.addEventListener('pointerdown', () => root.classList.add('is-down'));
    window.addEventListener('pointerup', () => root.classList.remove('is-down'));

    // Lerp the ring for a trailing feel.
    (function loop() {
      rx += (mx - rx) * 0.18;
      ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    })();

    // Hover affordance on interactive things.
    const hoverSel = 'a, button, input, textarea, select, [data-magnetic], .appcard';
    document.addEventListener('pointerover', (e) => {
      if (e.target.closest && e.target.closest(hoverSel)) root.classList.add('is-hover');
    });
    document.addEventListener('pointerout', (e) => {
      if (e.target.closest && e.target.closest(hoverSel)) root.classList.remove('is-hover');
    });
  })();

  /* ----------------------- Scroll progress + nav state ----------------------- */
  (function scrollState() {
    const nav = $('#nav');
    const prog = $('.scroll-progress span');
    const sections = $$('section[id], main[id]');
    const navLinks = $$('.nav__links a[data-nav]');

    function onScroll() {
      const y = window.scrollY;
      if (nav) nav.classList.toggle('is-scrolled', y > 30);
      if (prog) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        prog.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
      }
      // Active section highlight.
      const fromTop = y + window.innerHeight * 0.32;
      let activeId = null;
      for (const s of sections) {
        if (s.offsetTop <= fromTop) activeId = s.id;
      }
      navLinks.forEach(a => {
        a.classList.toggle('is-active', a.getAttribute('href') === '#' + activeId);
      });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  })();

  /* ----------------------- Mobile menu ----------------------- */
  (function mobileMenu() {
    const burger = $('.nav__burger');
    const menu = $('.mobile-menu');
    if (!burger || !menu) return;
    const close = () => {
      burger.classList.remove('is-open');
      menu.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    };
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('is-open');
      menu.classList.toggle('is-open', open);
      burger.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    $$('a', menu).forEach(a => a.addEventListener('click', close));
  })();

  /* ----------------------- Reveal on scroll ----------------------- */
  (function reveals() {
    const items = $$('.reveal');
    if (prefersReduced || !('IntersectionObserver' in window)) {
      items.forEach(el => el.classList.add('is-visible'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // Stagger items that enter together.
          const delay = Math.min(i * 80, 240);
          setTimeout(() => entry.target.classList.add('is-visible'), delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    items.forEach(el => io.observe(el));
  })();

  // Hero reveals fire immediately on load (not waiting for IO).
  function triggerHero() {
    $$('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('is-visible'), 120 + i * 110);
    });
  }

  /* ----------------------- Animated counters ----------------------- */
  (function counters() {
    const nums = $$('[data-count]');
    if (!nums.length) return;
    const animate = (el) => {
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const dur = 1500;
      const start = performance.now();
      const step = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    if (prefersReduced || !('IntersectionObserver' in window)) {
      nums.forEach(el => el.textContent = el.dataset.count + (el.dataset.suffix || ''));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });
    nums.forEach(el => io.observe(el));
  })();

  /* ----------------------- 3D tilt on cards ----------------------- */
  (function tilt() {
    if (isCoarse || prefersReduced) return;
    const cards = $$('[data-tilt]');
    cards.forEach(card => {
      let rect;
      const onEnter = () => { rect = card.getBoundingClientRect(); card.style.transition = 'transform .1s var(--ease)'; };
      const onMove = (e) => {
        if (!rect) rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        const rotY = px * 10;
        const rotX = -py * 8;
        card.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
      };
      const onLeave = () => {
        card.style.transition = 'transform .6s var(--ease)';
        card.style.transform = '';
        rect = null;
      };
      card.addEventListener('pointerenter', onEnter);
      card.addEventListener('pointermove', onMove);
      card.addEventListener('pointerleave', onLeave);
    });
  })();

  /* ----------------------- Smooth anchor scrolling ----------------------- */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = a.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 10;
    window.scrollTo({ top, behavior: prefersReduced ? 'auto' : 'smooth' });
  });

  /* ----------------------- Contact form ----------------------- */
  (function contactForm() {
    const form = $('#contactForm');
    if (!form) return;
    const note = $('#formNote');

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const subject = (data.get('subject') || 'A new project').toString();
      const message = (data.get('message') || '').toString().trim();

      // Basic validation.
      const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!name || !emailOk || !message) {
        note.textContent = 'Please fill in your name, a valid email, and a message.';
        note.className = 'contact__form-note err';
        return;
      }

      // Compose a mailto: handoff — opens the user's mail client.
      const body = `Name: ${name}\nEmail: ${email}\nSubject: ${subject}\n\n${message}`;
      const mailto = `mailto:hello@orvli.com?subject=${encodeURIComponent('[ORVLI] ' + subject)}&body=${encodeURIComponent(body)}`;
      note.textContent = 'Opening your mail app…';
      note.className = 'contact__form-note ok';
      window.location.href = mailto;

      // Reset shortly after.
      setTimeout(() => {
        form.reset();
        setTimeout(() => { note.textContent = ''; note.className = 'contact__form-note'; }, 4000);
      }, 1200);
    });
  })();

  /* ----------------------- Footer year ----------------------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
