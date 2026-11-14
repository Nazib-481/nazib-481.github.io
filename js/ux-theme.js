/* ux-theme.js — blue-theme toggle, scroll reveal, progress bar, tilt, typing line, filters. Load after ux-polish.js */
(function () {
  'use strict';
  const root = document.documentElement;
  const KEY = 'blue-theme';
  const read = () => { try { return localStorage.getItem(KEY); } catch (_) { return null; } };
  const save = v => { try { localStorage.setItem(KEY, v); } catch (_) { /* storage blocked */ } };

  /* Blue theme is ON by default; the choice is remembered */
  const btn = document.createElement('button');
  btn.className = 'nx-toggle'; btn.type = 'button';
  const apply = on => {
    root.classList.toggle('theme', on);
    btn.textContent = on ? 'Blue theme: On' : 'Blue theme: Off';
    btn.setAttribute('aria-pressed', on);
  };
  apply(read() !== 'off');
  btn.addEventListener('click', () => {
    const on = !root.classList.contains('theme'); apply(on); save(on ? 'on' : 'off');
    const img = document.querySelector('.hero-headshot img');   /* replay the photo morph */
    if (on && img) { img.style.animation = 'none'; void img.offsetWidth; img.style.animation = ''; }
  });
  document.body.appendChild(btn);

  /* Scroll progress bar */
  const bar = document.createElement('div');
  bar.className = 'nx-progress'; document.body.appendChild(bar);
  const onScroll = () => {
    const h = root.scrollHeight - innerHeight;
    bar.style.transform = 'scaleX(' + (h > 0 ? scrollY / h : 0) + ')';
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* Staggered reveal as sections scroll into view */
  const items = document.querySelectorAll('.section-header,.info-card,.skill-matrix-card,.academic-card,.academic-project-card,.dev-pillar-card,.contact-detail-card,.market-context-banner,.credentials-rule-banner');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .12 });
    items.forEach(el => {
      el.classList.add('nx-reveal');
      el.style.setProperty('--d', Math.min([...el.parentElement.children].indexOf(el), 5) * 0.08 + 's');
      io.observe(el);
    });
  }


  /* ===== cool layer ===== */
  const fine = matchMedia('(pointer: fine)').matches;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const CARDS = '.info-card,.skill-matrix-card,.academic-card,.academic-project-card,.dev-pillar-card';

  /* typing tagline under the affiliation line */
  const aff = document.querySelector('.hero-affiliation');
  if (aff) {
    const phrases = ['Turning data into decisions.', 'Excel · Power BI · Corporate Finance.', 'Future financial analyst.'];
    const line = document.createElement('p');
    line.className = 'nx-type'; line.setAttribute('aria-hidden', 'true');
    aff.insertAdjacentElement('afterend', line);
    if (calm) { line.textContent = phrases[0]; }
    else {
      let i = 0, n = 0, del = false;
      (function tick() {
        const w = phrases[i];
        n += del ? -1 : 1;
        line.textContent = w.slice(0, n);
        let wait = del ? 28 : 55;
        if (!del && n === w.length) { del = true; wait = 1600; }
        else if (del && n === 0) { del = false; i = (i + 1) % phrases.length; wait = 350; }
        setTimeout(tick, wait);
      })();
    }
  }

  if (fine && !calm) {
    const hero = document.querySelector('.hero-section');
    hero && hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--px', ((e.clientX - r.left) / r.width - .5).toFixed(3));
      hero.style.setProperty('--py', ((e.clientY - r.top) / r.height - .5).toFixed(3));
    });

    /* gentle 3D tilt */
    document.querySelectorAll(CARDS).forEach(c => {
      c.classList.add('nx-tilt');
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--rx', ((e.clientX - r.left) / r.width - .5) * 7 + 'deg');
        c.style.setProperty('--ry', -((e.clientY - r.top) / r.height - .5) * 7 + 'deg');
      });
      c.addEventListener('pointerleave', () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); });
    });

    /* magnetic buttons */
    document.querySelectorAll('.btn-lg').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        b.style.setProperty('--tx', Math.max(-6, Math.min(6, (e.clientX - r.left - r.width / 2) * .12)) + 'px');
        b.style.setProperty('--ty', Math.max(-4, Math.min(4, (e.clientY - r.top - r.height / 2) * .12)) + 'px');
      });
      b.addEventListener('pointerleave', () => { b.style.setProperty('--tx', '0px'); b.style.setProperty('--ty', '0px'); });
    });
  }

  /* count-up for the headline numbers (e.g. 144%, 8.3 mo) */
  if (!calm && 'IntersectionObserver' in window) {
    const co = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      co.unobserve(e.target);
      const el = e.target, txt = el.textContent, m = txt.match(/\d+(\.\d+)?/);
      if (!m) return;
      const end = parseFloat(m[0]), dec = (m[1] || '').length, t0 = performance.now();
      (function step(t) {
        const k = Math.min(1, (t - t0) / 900), v = (end * (1 - Math.pow(1 - k, 3))).toFixed(dec);
        el.textContent = txt.replace(m[0], v);
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    }), { threshold: .6 });
    document.querySelectorAll('.case-metrics strong').forEach(el => co.observe(el));
  }

  /* filter chips for the case studies */
  const grid = document.querySelector('.academic-work-grid');
  if (grid) {
    const cards = [...grid.children];
    const bar = document.createElement('div');
    bar.className = 'nx-filters'; bar.setAttribute('role', 'group'); bar.setAttribute('aria-label', 'Filter case studies');
    ['All', 'Excel', 'Power BI', 'Finance', 'Budget'].forEach((label, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'nx-chip'; b.textContent = label; b.setAttribute('aria-pressed', i === 0);
      b.addEventListener('click', () => {
        bar.querySelectorAll('.nx-chip').forEach(x => x.setAttribute('aria-pressed', x === b));
        cards.forEach(c => {
          const tag = ((c.querySelector('.card-tag') || {}).textContent || '').toLowerCase();
          const ok = i === 0 || tag.includes(label.toLowerCase());
          c.style.display = ok ? '' : 'none';
          if (ok) { c.classList.remove('nx-show'); void c.offsetWidth; c.classList.add('nx-show'); }
        });
      });
      bar.appendChild(b);
    });
    grid.parentElement.insertBefore(bar, grid);
  }

  /* click the headshot -> polaroid-style photo popup */
  const photo = document.querySelector('.hero-headshot img');
  if (photo) {
    photo.tabIndex = 0; photo.setAttribute('role', 'button'); photo.setAttribute('aria-label', 'View photo larger'); photo.title = 'View photo';
    const showPhoto = () => {
      const o = document.createElement('div');
      o.className = 'ux-overlay';
      o.innerHTML = '<figure class="ux-polaroid" role="dialog" aria-modal="true" aria-label="Profile photo"><button class="ux-close" aria-label="Close">&times;</button><img alt=""><figcaption>MD Nazibul Islam Nazib<small>BBA · Finance · IUB</small></figcaption></figure>';
      const im = o.querySelector('img'); im.src = photo.currentSrc || photo.src; im.alt = photo.alt || '';
      const done = () => { o.remove(); document.body.style.overflow = ''; photo.focus(); };
      o.addEventListener('click', e => { if (e.target === o) done(); });
      o.querySelector('.ux-close').addEventListener('click', done);
      document.body.appendChild(o); document.body.style.overflow = 'hidden';
      o.querySelector('.ux-close').focus();
    };
    photo.addEventListener('click', showPhoto);
    photo.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showPhoto(); } });
  }
})();
