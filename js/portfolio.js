/* Portfolio de Lucas Giovinazzo — escenas con scroll continuo.
   Sin GSAP o con movimiento reducido, las escenas quedan como secciones normales. */
(() => {
  'use strict';

  const root = document.documentElement;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const deskQuery = window.matchMedia('(min-width: 900px) and (min-aspect-ratio: 1/1)');
  const scenes = Array.from(document.querySelectorAll('.scene'));
  const N = scenes.length;
  const HOLD = 2;
  const ACC = '245,165,36';

  const rnd = (a, b) => a + Math.random() * (b - a);
  let artScale = 1;

  /* ---------- Escala de los artboards de escritorio ---------- */
  function fit() {
    artScale = deskQuery.matches ? Math.min(innerWidth / 1440, innerHeight / 900) : 1;
    root.style.setProperty('--s', artScale.toFixed(4));
  }
  fit();

  /* ---------- Contador, navegación lateral y riel ---------- */
  const num = document.getElementById('counterNum');
  const label = document.getElementById('counterName');
  const rail = document.querySelector('.rail');
  const onEls = Array.from(document.querySelectorAll('[data-on]'));
  let current = -1;

  function setActive(i, p) {
    if (p != null) rail.style.setProperty('--p', Math.max(0, Math.min(1, p)).toFixed(4));
    if (i === current || i < 0) return;
    current = i;
    num.textContent = String(i + 1).padStart(2, '0');
    label.textContent = scenes[i].dataset.name;
    onEls.forEach((el) => {
      const on = el.dataset.on.split(',').map(Number).includes(i);
      el.classList.toggle('on', on);
      if (el.tagName === 'A') {
        if (on) el.setAttribute('aria-current', 'true');
        else el.removeAttribute('aria-current');
      }
    });
  }

  /* ---------- Lluvia de código (canvas 2D) ---------- */
  const GLYPHS = 'アイウエオカキクケコサシスセソ01{}<>/=;$#ﾊﾋﾌﾍﾎ';
  const glyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];

  const RAIN = {
    screen: { size: 13, gap: 16, len: [14, 28], speed: [0.05, 0.14], alpha: [0.35, 1] },
    far: { size: 12, gap: 16, len: [30, 60], speed: [0.08, 0.2], alpha: [0.2, 0.7] },
    near: { size: 26, lanes: [40, 130, 230, 1180, 1270, 1360].map((x) => x / 1440), len: [18, 28], speed: [0.28, 0.55], alpha: [0.5, 0.9], glow: true }
  };

  class Rain {
    constructor(canvas, opts) {
      this.c = canvas;
      this.ctx = canvas.getContext('2d');
      this.base = opts;
      this.scene = canvas.closest('.scene');
      this.cols = [];
      this.resize();
    }
    resize() {
      const w = this.c.clientWidth;
      const h = this.c.clientHeight;
      if (!w || !h) return;
      const o = { ...this.base };
      if (!deskQuery.matches) o.size = Math.round(o.size * (o.glow ? 0.7 : 0.9));
      this.o = o;
      const k = Math.min(window.devicePixelRatio || 1, 2) * artScale;
      this.c.width = Math.round(w * k);
      this.c.height = Math.round(h * k);
      this.ctx.setTransform(k, 0, 0, k, 0, 0);
      this.w = w;
      this.h = h;
      this.lh = o.size * 1.18;
      const xs = [];
      if (o.lanes) o.lanes.forEach((f) => xs.push(f * w));
      else for (let x = 4; x < w; x += o.gap) xs.push(x);
      this.cols = xs.map((x) => this.column(x, true));
    }
    column(x, first) {
      const o = this.o;
      const len = Math.floor(rnd(o.len[0], o.len[1]));
      return {
        x,
        y: first ? rnd(0, this.h + len * this.lh) : -rnd(0, this.h * 0.4),
        v: rnd(o.speed[0], o.speed[1]),
        len,
        a: rnd(o.alpha[0], o.alpha[1]),
        ch: Array.from({ length: len }, glyph)
      };
    }
    draw(dt) {
      if (!this.w) return;
      const { ctx, o, lh } = this;
      ctx.clearRect(0, 0, this.w, this.h);
      ctx.font = `${o.size}px "JetBrains Mono", monospace`;
      ctx.textBaseline = 'bottom';
      ctx.shadowBlur = o.glow ? 12 : 0;
      ctx.shadowColor = '#f5a524';
      for (const c of this.cols) {
        c.y += c.v * dt;
        if (c.y - c.len * lh > this.h) Object.assign(c, this.column(c.x, false));
        if (dt && Math.random() < 0.08) c.ch[Math.floor(Math.random() * c.len)] = glyph();
        for (let k = 0; k < c.len; k++) {
          const y = c.y - k * lh;
          if (y < 0 || y > this.h + lh) continue;
          const a = c.a * (1 - k / c.len);
          ctx.fillStyle = k === 0 ? `rgba(255,236,200,${Math.min(1, a + 0.2).toFixed(3)})` : `rgba(${ACC},${a.toFixed(3)})`;
          ctx.fillText(c.ch[k], c.x, y);
        }
      }
    }
  }

  const rains = Array.from(document.querySelectorAll('canvas[data-rain]')).map((c) => new Rain(c, RAIN[c.dataset.rain]));

  /* ---------- Campo de partículas ---------- */
  const sc = document.getElementById('stars');
  const sctx = sc.getContext('2d');
  let SW = 0;
  let SH = 0;
  let stars = [];
  let vel = 0;

  const newStar = (any) => ({ x: rnd(-1, 1), y: rnd(-1, 1), z: any ? rnd(0.08, 1) : 1, t: rnd(0, 6.28), r: Math.random() < 0.85 ? rnd(0.6, 1.3) : rnd(1.4, 2.3) });

  function sizeStars() {
    const k = Math.min(window.devicePixelRatio || 1, 2);
    SW = innerWidth;
    SH = innerHeight;
    sc.width = Math.round(SW * k);
    sc.height = Math.round(SH * k);
    sctx.setTransform(k, 0, 0, k, 0, 0);
    const n = Math.round(Math.min(380, (SW * SH) / 4200));
    stars = Array.from({ length: n }, () => newStar(true));
  }

  function drawStars(dt, time) {
    sctx.clearRect(0, 0, SW, SH);
    const cx = SW * 0.56;
    const cy = SH * 0.45;
    const f = Math.max(SW, SH) * 0.5;
    const sp = reduce ? 0 : 0.00004 + Math.min(Math.abs(vel) * 0.0000012, 0.0012);
    const streak = sp > 0.00025;
    for (const s of stars) {
      const pz = s.z;
      s.z -= sp * dt;
      if (s.z <= 0.04) { Object.assign(s, newStar(false)); continue; }
      const x = cx + (s.x / s.z) * f;
      const y = cy + (s.y / s.z) * f;
      if (x < -20 || x > SW + 20 || y < -20 || y > SH + 20) {
        if (!reduce) Object.assign(s, newStar(false));
        continue;
      }
      const depth = 1 - s.z;
      const tw = reduce ? 0.8 : 0.55 + 0.45 * Math.sin(time * 0.002 + s.t);
      const a = Math.min(1, (0.12 + depth * 0.88) * tw);
      const r = s.r * (0.4 + depth * 1.4);
      if (streak) {
        sctx.strokeStyle = `rgba(${ACC},${(a * 0.6).toFixed(3)})`;
        sctx.lineWidth = r;
        sctx.beginPath();
        sctx.moveTo(cx + (s.x / pz) * f, cy + (s.y / pz) * f);
        sctx.lineTo(x, y);
        sctx.stroke();
      }
      sctx.fillStyle = `rgba(${ACC},${a.toFixed(3)})`;
      sctx.beginPath();
      sctx.arc(x, y, r, 0, 6.2832);
      sctx.fill();
    }
  }

  sizeStars();

  /* ---------- Modo con animación (GSAP + ScrollTrigger) ---------- */
  let isVisible = (s) => s._vis !== false;
  let go = null;

  function initFx() {
    const { gsap, ScrollTrigger } = window;
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.config({ ignoreMobileResize: true });
    root.classList.add('fx');

    const track = document.getElementById('track');
    const setTrack = () => { track.style.height = `${N * window.innerHeight}px`; };
    setTrack();

    gsap.set(scenes, { autoAlpha: 0, scale: 0.55 });
    gsap.set(scenes[0], { autoAlpha: 1, scale: 1 });

    // Punto de zoom: el centro de la pantalla de cada escena, en % de la escena (no depende de su escala).
    const originIn = (scene, el) => {
      const sr = scene.getBoundingClientRect();
      const r = el.getBoundingClientRect();
      return `${(((r.left + r.width / 2) - sr.left) / sr.width * 100).toFixed(2)}% ${(((r.top + r.height / 2) - sr.top) / sr.height * 100).toFixed(2)}%`;
    };

    const wires = Array.from(document.querySelectorAll('.circuit .w'));
    wires.forEach((p) => {
      const len = p.getTotalLength();
      p.style.strokeDasharray = `${len}`;
      p.dataset.len = len;
    });

    const tl = gsap.timeline({ defaults: { ease: 'none' } });
    for (let i = 0; i < N; i++) tl.addLabel(`s${i}`, i * HOLD);

    const arrive = {
      ispm: (s, t) => tl.from(s.querySelectorAll('.feat'), { autoAlpha: 0, scale: 0.7, stagger: 0.07, duration: 0.4 }, t),
      proyectos: (s, t) => tl.from(s.querySelectorAll('.panel'), { autoAlpha: 0, stagger: 0.08, duration: 0.4 }, t),
      stack: (s, t) => {
        tl.fromTo(wires, { strokeDashoffset: (i, el) => el.dataset.len }, { strokeDashoffset: 0, stagger: 0.02, duration: 0.55 }, t - 0.1);
        tl.from(s.querySelectorAll('.circuit text'), { autoAlpha: 0, stagger: 0.02, duration: 0.3 }, t + 0.15);
      },
      contacto: (s, t) => {
        tl.from(s.querySelector('.lg-big'), { scale: 1.6, autoAlpha: 0, duration: 0.5 }, t - 0.1);
        tl.from(s.querySelectorAll('.lg-btn'), { autoAlpha: 0, y: 18, stagger: 0.06, duration: 0.3 }, t + 0.2);
      }
    };

    for (let i = 0; i < N - 1; i++) {
      const t = i * HOLD + 0.5;
      const cur = scenes[i];
      const nxt = scenes[i + 1];
      const zoomEl = cur.querySelector('[data-zoom]');
      if (zoomEl) {
        tl.to(cur, { scale: i === 0 ? 3.4 : 4.2, autoAlpha: 0, transformOrigin: () => originIn(cur, zoomEl), duration: 1, ease: 'power2.in' }, t);
      } else {
        tl.to(cur, { scale: 1.6, autoAlpha: 0, transformOrigin: '50% 50%', duration: 0.8, ease: 'power2.in' }, t);
      }
      const inAt = t + (zoomEl ? 0.45 : 0.3);
      tl.fromTo(nxt, { scale: 0.55, autoAlpha: 0, transformOrigin: '50% 50%' }, { scale: 1, autoAlpha: 1, transformOrigin: '50% 50%', duration: 0.85, ease: 'power2.out', immediateRender: false }, inAt);
      const fn = arrive[nxt.id];
      if (fn) fn(nxt, inAt + 0.35);
    }
    tl.to({}, { duration: 0.001 }, (N - 1) * HOLD);

    const st = ScrollTrigger.create({
      trigger: track,
      start: 'top top',
      end: 'bottom bottom',
      animation: tl,
      scrub: 0.7,
      invalidateOnRefresh: true,
      onRefreshInit: setTrack,
      // Cada escena es una parada: un poco de scroll alcanza para ir a la siguiente o volver a la anterior.
      snap: {
        snapTo: (value, self) => {
          const pos = value * (N - 1);
          const near = Math.round(pos);
          if (Math.abs(pos - near) < 0.04) return near / (N - 1);
          return (self.direction > 0 ? Math.ceil(pos) : Math.floor(pos)) / (N - 1);
        },
        inertia: false,
        duration: { min: 0.3, max: 0.9 },
        delay: 0.08,
        ease: 'power2.inOut'
      },
      onUpdate(self) { vel = self.getVelocity(); }
    });

    gsap.ticker.add(() => {
      setActive(Math.min(N - 1, Math.round(tl.time() / HOLD)), tl.progress());
    });

    isVisible = (s) => Number(gsap.getProperty(s, 'opacity')) > 0.01;

    go = (i, smooth = true) => {
      const y = st.start + (st.end - st.start) * ((i * HOLD) / tl.duration());
      window.scrollTo({ top: Math.round(y), behavior: smooth ? 'smooth' : 'auto' });
    };

    const start = scenes.findIndex((s) => `#${s.id}` === location.hash);
    if (start > 0) requestAnimationFrame(() => go(start, false));
  }

  /* ---------- Modo estático ---------- */
  function initStatic() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        en.target._vis = en.isIntersecting;
        if (en.isIntersecting && en.intersectionRatio >= 0.5) setActive(scenes.indexOf(en.target));
      });
    }, { threshold: [0, 0.5] });
    scenes.forEach((s) => { s._vis = false; io.observe(s); });
    setActive(0, 0);
    let lastY = window.scrollY;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      rail.style.setProperty('--p', (max > 0 ? window.scrollY / max : 0).toFixed(4));
      vel = (window.scrollY - lastY) * 60;
      lastY = window.scrollY;
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    go = (i) => scenes[i].scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }

  const hasGsap = Boolean(window.gsap && window.ScrollTrigger);
  if (!reduce && hasGsap) initFx();
  else initStatic();
  rains.forEach((r) => r.resize());

  /* Links internos: en modo animado cada escena es un punto del scroll */
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a || !go) return;
    const id = a.getAttribute('href').slice(1);
    const i = scenes.findIndex((s) => s.id === id);
    if (i < 0) return;
    e.preventDefault();
    go(i);
    history.replaceState(null, '', `#${id}`);
  });

  /* ---------- Bucle de dibujo ---------- */
  function drawAllOnce() {
    drawStars(0, 0);
    rains.forEach((r) => r.draw(0));
  }

  let resizeQueued = false;
  addEventListener('resize', () => {
    if (resizeQueued) return;
    resizeQueued = true;
    requestAnimationFrame(() => {
      resizeQueued = false;
      fit();
      sizeStars();
      rains.forEach((r) => r.resize());
      if (reduce) drawAllOnce();
    });
  });

  if (reduce) {
    (document.fonts ? document.fonts.ready : Promise.resolve()).then(drawAllOnce);
    return;
  }

  let last = performance.now();
  let rainAcc = 0;
  function frame(now) {
    const dt = Math.min(50, now - last);
    last = now;
    vel *= 0.9;
    drawStars(dt, now);
    rainAcc += dt;
    if (rainAcc >= 33) {
      rains.forEach((r) => { if (isVisible(r.scene)) r.draw(rainAcc); });
      rainAcc = 0;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
