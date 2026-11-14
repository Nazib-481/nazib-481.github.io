/* ux-polish.js — loads AFTER js/main.js. Adds detail popups + a copy toast. */
(function () {
  'use strict';
  let opener = null;

  function toast(msg) {
    const old = document.querySelector('.ux-toast'); old && old.remove();
    const el = document.createElement('div');
    el.className = 'ux-toast'; el.setAttribute('role', 'status'); el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 2200);
  }
  document.querySelectorAll('.copy-btn').forEach(b =>
    b.addEventListener('click', () => toast('Email copied to clipboard')));

  function close() {
    const o = document.querySelector('.ux-overlay');
    if (!o) return;
    o.remove(); document.body.style.overflow = '';
    opener && opener.focus();
  }

  function open(card) {
    const kicker = card.querySelector('.card-tag,.case-kicker,.skill-category-tag,.pillar-status');
    const title = card.querySelector('h3');
    const body = card.cloneNode(true);
    body.querySelectorAll('.card-badge-icon,.academic-card-header,.academic-card-footer,.dev-card-index,.case-card-header,.skill-card-top,h3').forEach(n => n.remove());
    const link = card.querySelector('a[href]:not([href="#"])');

    const o = document.createElement('div');
    o.className = 'ux-overlay';
    o.innerHTML = '<div class="ux-card" role="dialog" aria-modal="true" aria-labelledby="uxTitle"><div class="ux-head"><div class="ux-kicker"></div><h3 class="ux-title" id="uxTitle"></h3><button class="ux-close" aria-label="Close">&times;</button></div><div class="ux-body"></div></div>';
    o.querySelector('.ux-kicker').textContent = kicker ? kicker.textContent.trim() : '';
    o.querySelector('.ux-title').textContent = title ? title.textContent.trim() : '';
    o.querySelector('.ux-body').innerHTML = body.innerHTML;
    o.addEventListener('click', e => { if (e.target === o) close(); });
    o.querySelector('.ux-close').addEventListener('click', close);
    document.body.appendChild(o);
    document.body.style.overflow = 'hidden';
    o.querySelector('.ux-close').focus();
  }

  document.querySelectorAll('.info-card,.academic-card,.academic-project-card,.skill-matrix-card,.dev-pillar-card').forEach(card => {
    card.tabIndex = 0; card.setAttribute('role', 'button');
    const go = e => { if (e.target.closest('a,button')) return; opener = card; open(card); };
    card.addEventListener('click', go);
    card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(e); } });
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();
