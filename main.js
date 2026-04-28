/* ============= JustVideo Labs — Site JS ============= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- year ---------- */
  document.querySelectorAll('[data-year]').forEach(el => el.textContent = new Date().getFullYear());

  /* ---------- theme toggle ---------- */
  const toggleBtns = document.querySelectorAll('.theme-toggle');
  toggleBtns.forEach(btn => btn.addEventListener('click', () => {
    const html = document.documentElement;
    const isLight = html.getAttribute('data-theme') === 'light';
    if (isLight) {
      html.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    } else {
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    }
  }));

  /* ---------- header scroll state ---------- */
  const header = document.querySelector('.site-header');
  const onScroll = () => {
    if (!header) return;
    if (window.scrollY > 12) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile drawer ---------- */
  const drawer = document.querySelector('.drawer');
  document.querySelectorAll('[data-open-drawer]').forEach(b => b.addEventListener('click', () => drawer?.classList.add('open')));
  document.querySelectorAll('[data-close-drawer]').forEach(b => b.addEventListener('click', () => drawer?.classList.remove('open')));
  drawer?.addEventListener('click', (e) => { if (e.target === drawer) drawer.classList.remove('open'); });

  /* ---------- reveal on scroll (includes new variants) ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => io.observe(el));

  /* ---------- accordion (services + faq) ---------- */
  document.querySelectorAll('[data-accordion]').forEach(group => {
    group.querySelectorAll('[data-accordion-item]').forEach(item => {
      const summary = item.querySelector('[data-accordion-summary]');
      summary?.addEventListener('click', () => {
        const willOpen = !item.classList.contains('open');
        // close others in same group (single-open)
        if (group.dataset.accordion === 'single') {
          group.querySelectorAll('[data-accordion-item].open').forEach(o => o.classList.remove('open'));
        }
        item.classList.toggle('open', willOpen);
      });
    });
  });

  /* ---------- about-page tabs ---------- */
  document.querySelectorAll('[data-tabs]').forEach(group => {
    const btns = group.querySelectorAll('.tab-btn');
    const panels = group.querySelectorAll('.tab-panel');
    btns.forEach(b => b.addEventListener('click', () => {
      const id = b.dataset.tab;
      btns.forEach(x => x.classList.toggle('active', x === b));
      panels.forEach(p => p.classList.toggle('active', p.dataset.panel === id));
    }));
  });

  /* ---------- magnetic CTAs ---------- */
  const magnets = document.querySelectorAll('[data-magnet]');
  magnets.forEach(m => {
    m.addEventListener('mousemove', (e) => {
      const r = m.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      m.style.transform = `translate(${x * .15}px, ${y * .25}px)`;
    });
    m.addEventListener('mouseleave', () => m.style.transform = '');
  });

  /* ---------- contact form → webhook ---------- */
  const CONTACT_WEBHOOK = 'https://api.nodex.bubblelab.ai/webhook/user_36lWT7tSw4MOQm0gENBx8TR0Im3/9R2xGC3LS2YH';
  document.querySelectorAll('form[data-demo]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = form.querySelector('.submit, [type=submit]');
      if (!btn) return;
      const original = btn.innerHTML;
      btn.disabled = true;
      btn.innerHTML = 'Sending…';
      const data = Object.fromEntries(new FormData(form));
      try {
        await fetch(CONTACT_WEBHOOK, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        btn.innerHTML = "Thanks — we'll be in touch";
        btn.style.background = '#87BA54';
        form.reset();
      } catch (_) {
        btn.innerHTML = 'Something went wrong';
        btn.style.background = '#E53935';
      }
      btn.disabled = false;
      setTimeout(() => { btn.innerHTML = original; btn.style.background = ''; }, 2200);
    });
  });

  /* ---------- case study expandable panels ---------- */
  document.querySelectorAll('[data-cs-trigger]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      const item = trigger.closest('[data-cs-item]');
      if (!item) return;
      const willOpen = !item.classList.contains('open');
      document.querySelectorAll('[data-cs-item].open').forEach(o => {
        if (o !== item) o.classList.remove('open');
      });
      item.classList.toggle('open', willOpen);
      if (willOpen) {
        setTimeout(() => item.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 100);
      }
    });
  });

  /* ---------- orbit node touch toggle ---------- */
  document.querySelectorAll('.orbit-node').forEach(node => {
    node.addEventListener('click', () => {
      const isActive = node.classList.contains('active');
      document.querySelectorAll('.orbit-node.active').forEach(n => n.classList.remove('active'));
      if (!isActive) node.classList.add('active');
    });
  });

  /* ---------- newsletter (demo) ---------- */
  document.querySelectorAll('form[data-newsletter]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button');
      if (!btn) return;
      const original = btn.textContent;
      btn.textContent = 'Subscribed \u2713';
      setTimeout(() => { btn.textContent = original; form.reset(); }, 2200);
    });
  });

  /* ---------- cursor glow ---------- */
  const glow = document.getElementById('cursorGlow');
  if (glow && window.matchMedia('(pointer:fine)').matches) {
    document.addEventListener('mousemove', (e) => {
      glow.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
    });
  }

  /* ---------- animated counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        let start = 0;
        const duration = 2000;
        const startTime = performance.now();
        const ease = t => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        function tick(now) {
          const elapsed = now - startTime;
          const progress = Math.min(elapsed / duration, 1);
          const current = Math.round(ease(progress) * target);
          el.textContent = current + suffix;
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        counterObserver.unobserve(el);
      });
    }, { threshold: 0.3 });
    counters.forEach(el => counterObserver.observe(el));
  }

  /* ---------- brand logo color toggle ---------- */
  document.querySelectorAll('.brand-cell').forEach(cell => {
    cell.addEventListener('click', () => {
      cell.classList.toggle('show-color');
    });
  });

  /* ---------- 3D card tilt ---------- */
  document.querySelectorAll('[data-tilt]').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });

  /* ---------- parallax ---------- */
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        parallaxEls.forEach(el => {
          const speed = parseFloat(el.dataset.parallax) || 0.03;
          const rect = el.getBoundingClientRect();
          const offset = (rect.top + scrollY - window.innerHeight / 2) * speed;
          el.style.transform = `translateY(${offset}px)`;
        });
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- typing effect (homepage eyebrow) ---------- */
  const typingEl = document.querySelector('.eyebrow-text');
  if (typingEl) {
    const fullText = typingEl.dataset.text || typingEl.textContent;
    typingEl.textContent = '';
    let i = 0;
    const interval = setInterval(() => {
      typingEl.textContent = fullText.slice(0, ++i);
      if (i >= fullText.length) clearInterval(interval);
    }, 80);
  }

});
