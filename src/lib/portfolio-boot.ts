// Portfolio boot logic — runs only on client (browser) after mount.
// Lazy-imports three to keep SSR safe.
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import SplitType from "split-type";
import type * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

export async function bootPortfolio(): Promise<() => void> {
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lowPower = (navigator.hardwareConcurrency || 8) < 4;
  const lite = reduceMotion || lowPower;

  const cleanups: Array<() => void> = [];
  const off = (fn: () => void) => cleanups.push(fn);

  /* ---------- Nav pill: compact at top, expanded on scroll, hidden at bottom ---------- */
  const pill = document.querySelector<HTMLElement>(".pill");
  function syncPill() {
    if (!pill) return;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const nearBottom = max > 0 && y > max - 80;
    if (nearBottom) {
      pill.classList.add("is-hidden");
    } else {
      pill.classList.remove("is-hidden");
    }
    if (y > 80) pill.classList.add("is-expanded");
    else pill.classList.remove("is-expanded");
  }
  syncPill();
  window.addEventListener("scroll", syncPill, { passive: true });
  window.addEventListener("resize", syncPill);
  off(() => window.removeEventListener("scroll", syncPill));
  off(() => window.removeEventListener("resize", syncPill));
  const onEnter = () => pill?.classList.add("is-expanded");
  pill?.addEventListener("mouseenter", onEnter);
  pill?.addEventListener("mouseleave", syncPill);
  off(() => {
    pill?.removeEventListener("mouseenter", onEnter);
    pill?.removeEventListener("mouseleave", syncPill);
  });

  /* ---------- SplitType reveals ---------- */
  document.querySelectorAll<HTMLElement>("[data-split]").forEach((el) => {
    const split = new SplitType(el, { types: "chars" });
    const chars = split.chars || [];
    gsap.set(chars, { y: 40, opacity: 0, filter: "blur(12px)" });
    const onMount = el.closest("#hero");
    const tweenIn = () =>
      gsap.to(chars, {
        y: 0,
        opacity: 1,
        filter: "blur(0px)",
        duration: 1.4,
        ease: "expo.out",
        stagger: 0.018,
      });
    if (onMount) tweenIn();
    else ScrollTrigger.create({ trigger: el, start: "top 80%", once: true, onEnter: tweenIn });
  });
  document.querySelectorAll<HTMLElement>("[data-split-lines]").forEach((el) => {
    const split = new SplitType(el, { types: "lines" });
    const lines = split.lines || [];
    gsap.set(lines, { y: 24, opacity: 0 });
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => gsap.to(lines, { y: 0, opacity: 1, duration: 0.9, ease: "power3.out", stagger: 0.08 }),
    });
  });

  /* ---------- Background morph by section ---------- */
  document.querySelectorAll<HTMLElement>("section[data-bg]").forEach((sec) => {
    ScrollTrigger.create({
      trigger: sec,
      start: "top 60%",
      end: "bottom 40%",
      onEnter: () => gsap.to(document.body, { backgroundColor: sec.dataset.bg!, duration: 0.8, ease: "power2.out" }),
      onEnterBack: () => gsap.to(document.body, { backgroundColor: sec.dataset.bg!, duration: 0.8, ease: "power2.out" }),
    });
  });

  /* ---------- Magnetic icons ---------- */
  document.querySelectorAll<HTMLElement>(".mag").forEach((el) => {
    const setX = gsap.quickTo(el, "x", { duration: 0.4, ease: "power3.out" });
    const setY = gsap.quickTo(el, "y", { duration: 0.4, ease: "power3.out" });
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = e.clientX - cx, dy = e.clientY - cy;
      const d = Math.hypot(dx, dy);
      if (d < 120) {
        const k = (1 - d / 120) * 24;
        setX((dx / d) * k); setY((dy / d) * k);
      } else { setX(0); setY(0); }
    };
    window.addEventListener("mousemove", onMove);
    off(() => window.removeEventListener("mousemove", onMove));
  });

  /* ---------- Card: 3D tilt + spotlight + flip on click ---------- */
  document.querySelectorAll<HTMLElement>(".card").forEach((c) => {
    const onMove = (e: MouseEvent) => {
      const r = c.getBoundingClientRect();
      const mx = e.clientX - r.left, my = e.clientY - r.top;
      c.style.setProperty("--mx", `${mx}px`);
      c.style.setProperty("--my", `${my}px`);
      if (c.classList.contains("is-flipped")) return;
      const nx = (mx / r.width) * 2 - 1;
      const ny = (my / r.height) * 2 - 1;
      c.style.setProperty("--ry", `${nx * 6}deg`);
      c.style.setProperty("--rx", `${-ny * 6}deg`);
    };
    const onLeave = () => {
      c.style.setProperty("--rx", "0deg");
      c.style.setProperty("--ry", "0deg");
    };
    const onClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).closest("a")) return;
      c.classList.toggle("is-flipped");
      onLeave();
    };
    c.addEventListener("mousemove", onMove);
    c.addEventListener("mouseleave", onLeave);
    c.addEventListener("click", onClick);
    off(() => {
      c.removeEventListener("mousemove", onMove);
      c.removeEventListener("mouseleave", onLeave);
      c.removeEventListener("click", onClick);
    });
  });

  /* ---------- Skills reveal ---------- */
  const io = new IntersectionObserver(
    (entries) => entries.forEach((en) => en.isIntersecting && en.target.classList.add("in-view")),
    { threshold: 0.2 }
  );
  document.querySelectorAll(".sk").forEach((el) => io.observe(el));
  off(() => io.disconnect());

  /* ---------- Timeline (vertical) progress + parallax ---------- */
  const track = document.querySelector<HTMLElement>(".tl-track");
  const prog = document.querySelector<HTMLElement>(".tl-progress");
  if (track && prog) {
    ScrollTrigger.create({
      trigger: track,
      start: "top 75%",
      end: "bottom 60%",
      scrub: true,
      onUpdate: (s) => { prog.style.height = (s.progress * 100).toFixed(1) + "%"; },
    });
  }
  document.querySelectorAll<HTMLElement>(".tl-item").forEach((it, idx) => {
    const depth = parseFloat(it.dataset.parallax || "0.1");
    const card = it.querySelector<HTMLElement>(".tl-card");
    const dot = it.querySelector<HTMLElement>(".tl-dot");
    const when = it.querySelector<HTMLElement>(".tl-when");
    const title = it.querySelector<HTMLElement>(".tl-title");
    const desc = it.querySelector<HTMLElement>(".tl-desc");
    if (!card) return;
    // 3D scrubbed entrance
    gsap.fromTo(
      card,
      { y: 90, opacity: 0, rotateX: 28, scale: 0.94, filter: "blur(14px)", transformPerspective: 900 },
      {
        y: 0, opacity: 1, rotateX: 0, scale: 1, filter: "blur(0px)",
        ease: "power3.out",
        scrollTrigger: { trigger: it, start: "top 92%", end: "top 55%", scrub: 0.5 },
      }
    );
    // Lift the side bits independently for richness
    if (when) gsap.fromTo(when, { x: -16, opacity: 0 }, { x: 0, opacity: 1, ease: "power2.out", scrollTrigger: { trigger: it, start: "top 88%", end: "top 60%", scrub: 0.5 } });
    if (title) gsap.fromTo(title, { y: 18, opacity: 0 }, { y: 0, opacity: 1, ease: "power3.out", scrollTrigger: { trigger: it, start: "top 86%", end: "top 55%", scrub: 0.5 } });
    if (desc) gsap.fromTo(desc, { y: 14, opacity: 0 }, { y: 0, opacity: 1, ease: "power2.out", scrollTrigger: { trigger: it, start: "top 84%", end: "top 52%", scrub: 0.5 } });
    // Dot bloom as it crosses the viewport center
    if (dot) {
      ScrollTrigger.create({
        trigger: it,
        start: "top 60%",
        end: "bottom 40%",
        onEnter: () => dot.classList.add("is-on"),
        onEnterBack: () => dot.classList.add("is-on"),
        onLeave: () => dot.classList.remove("is-on"),
        onLeaveBack: () => dot.classList.remove("is-on"),
      });
    }
    // Long-form parallax drift
    gsap.to(card, {
      y: -40 * (depth * 10),
      ease: "none",
      scrollTrigger: { trigger: it, start: "top bottom", end: "bottom top", scrub: true },
    });
    // Subtle horizontal weave to make them feel alive
    gsap.fromTo(card,
      { x: idx % 2 === 0 ? -18 : 18 },
      { x: 0, ease: "power2.out", scrollTrigger: { trigger: it, start: "top 95%", end: "top 50%", scrub: 0.6 } }
    );
  });

  /* ---------- Footer: cycling status line ---------- */
  const footStatus = document.querySelector<HTMLElement>("[data-foot-status]");
  if (footStatus) {
    const lines = [
      "now: shipping the portfolio",
      "listening: lofi @ 88bpm",
      "uptime: 18.4h · coffee #3",
      "stack: vim · arch · tmux",
      "currently: breaking & fixing",
      "next up: a CTF writeup",
    ];
    let fi = 0;
    const tick = () => {
      fi = (fi + 1) % lines.length;
      footStatus.style.opacity = "0";
      setTimeout(() => { footStatus.textContent = lines[fi]; footStatus.style.opacity = "1"; }, 220);
    };
    const t = setInterval(tick, 2600);
    off(() => clearInterval(t));
  }

  /* ---------- Signal panel: lively idle cycle + bar animation ---------- */
  const orbVal = document.querySelector<HTMLElement>("[data-orb-val]");
  const orbText = orbVal?.querySelector<HTMLElement>(".orb-text");
  const orbFreq = document.querySelector<HTMLElement>("[data-orb-freq]");
  const orbBars = document.querySelectorAll<HTMLElement>(".orb-bars i");
  const idlePool = ["idle", "listening", "warming up", "tracing", "decoding", "humming"];
  let idleI = 0;
  let signalLocked = false;
  const idleTimer = setInterval(() => {
    if (signalLocked || !orbText) return;
    idleI = (idleI + 1) % idlePool.length;
    orbText.textContent = idlePool[idleI];
    if (orbFreq) {
      const f = (1.2 + Math.random() * 3.6).toFixed(1);
      orbFreq.textContent = `${f}Ghz`;
    }
  }, 1800);
  off(() => clearInterval(idleTimer));
  let barRaf = 0;
  const tickBars = () => {
    barRaf = requestAnimationFrame(tickBars);
    const t = performance.now() / 320;
    orbBars.forEach((b, i) => {
      const h = 24 + (Math.sin(t + i * 0.7) * 0.5 + 0.5) * (signalLocked ? 70 : 40);
      b.style.height = h + "%";
    });
  };
  tickBars();
  off(() => cancelAnimationFrame(barRaf));

  /* ---------- Custom cursor ---------- */
  if (!lite) {
    const dot = document.querySelector<HTMLElement>(".cursor-dot");
    const ring = document.querySelector<HTMLElement>(".cursor-ring");
    const canvas = document.getElementById("cursor-trail") as HTMLCanvasElement | null;
    if (dot && ring && canvas) {
      const ctx = canvas.getContext("2d")!;
      let w = (canvas.width = innerWidth), h = (canvas.height = innerHeight);
      const onResize = () => { w = canvas.width = innerWidth; h = canvas.height = innerHeight; };
      window.addEventListener("resize", onResize);
      off(() => window.removeEventListener("resize", onResize));

      let mx = innerWidth / 2, my = innerHeight / 2;
      let rx = mx, ry = my, lx = mx, ly = my;
      const particles: Array<{ x: number; y: number; life: number; r: number; vx: number; vy: number }> = [];
      const setDot = gsap.quickSetter(dot, "css") as (v: Record<string, number>) => void;

      const onMove = (e: MouseEvent) => {
        mx = e.clientX; my = e.clientY;
        const v = Math.hypot(mx - lx, my - ly);
        const n = Math.min(6, Math.floor(v / 4));
        for (let i = 0; i < n; i++) {
          particles.push({ x: mx, y: my, life: 1, r: 6 + Math.random() * 10, vx: (Math.random() - 0.5) * 0.6, vy: (Math.random() - 0.5) * 0.6 });
        }
        lx = mx; ly = my;
      };
      window.addEventListener("mousemove", onMove);
      off(() => window.removeEventListener("mousemove", onMove));

      document.querySelectorAll<HTMLElement>('[data-cursor="hover"]').forEach((el) => {
        const enter = () => ring.classList.add("is-hover");
        const leave = () => ring.classList.remove("is-hover");
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
        off(() => {
          el.removeEventListener("mouseenter", enter);
          el.removeEventListener("mouseleave", leave);
        });
      });

      let raf = 0;
      function tick() {
        setDot({ x: mx, y: my });
        rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
        ring!.style.transform = `translate(${rx}px, ${ry}px) translate(-50%, -50%)`;
        ctx.clearRect(0, 0, w, h);
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.life -= 0.025;
          p.x += p.vx; p.y += p.vy; p.r *= 0.985;
          if (p.life <= 0) { particles.splice(i, 1); continue; }
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
          g.addColorStop(0, `rgba(200,177,122,${0.22 * p.life})`);
          g.addColorStop(1, "rgba(200,177,122,0)");
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
        }
        raf = requestAnimationFrame(tick);
      }
      tick();
      off(() => cancelAnimationFrame(raf));
    }
  }

  /* ---------- Lenis smooth scroll ---------- */
  let lenis: Lenis | null = null;
  if (!lite) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on("scroll", ScrollTrigger.update);
    const lenisTick = (t: number) => lenis!.raf(t * 1000);
    gsap.ticker.add(lenisTick);
    gsap.ticker.lagSmoothing(0);
    off(() => { gsap.ticker.remove(lenisTick); lenis?.destroy(); });

    document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
      const onClick = (e: MouseEvent) => {
        const id = a.getAttribute("href");
        const tgt = id && document.querySelector(id);
        if (tgt) { e.preventDefault(); lenis!.scrollTo(tgt as HTMLElement, { offset: -20 }); }
      };
      a.addEventListener("click", onClick);
      off(() => a.removeEventListener("click", onClick));
    });
  }

  /* ---------- WebGL: background ico + skills sphere ---------- */
  if (!lite) {
    const THREE = await import("three");
    /* Background scene */
    const bgCanvas = document.getElementById("bg") as HTMLCanvasElement | null;
    if (bgCanvas) {
      const renderer = new THREE.WebGLRenderer({ canvas: bgCanvas, antialias: false, powerPreference: "high-performance", alpha: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
      renderer.setSize(innerWidth, innerHeight, false);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 100);
      camera.position.set(0, 0, 5);

      const group = new THREE.Group();
      scene.add(group);

      const icoGeo = new THREE.IcosahedronGeometry(1.4, 2);
      const icoMat = new THREE.ShaderMaterial({
        transparent: true,
        uniforms: { uTime: { value: 0 }, uPulse: { value: 0 } },
        vertexShader: `varying vec3 vN; varying vec3 vV;
          void main(){ vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.0); vV = -mv.xyz; gl_Position = projectionMatrix * mv; }`,
        fragmentShader: `varying vec3 vN; varying vec3 vV; uniform float uPulse;
          void main(){
            float f = pow(1.0 - max(dot(normalize(vN), normalize(vV)), 0.0), 2.0);
            vec3 emerald = vec3(0.07, 0.32, 0.24);
            vec3 champagne = vec3(0.78, 0.69, 0.48);
            vec3 hot = vec3(0.95, 0.82, 0.55);
            vec3 col = mix(emerald, champagne, f);
            col = mix(col, hot, uPulse * f);
            gl_FragColor = vec4(col, 0.85 + 0.15 * uPulse);
          }`,
        wireframe: true,
      });
      const ico = new THREE.Mesh(icoGeo, icoMat);
      group.add(ico);

      /* Particles */
      const COUNT = 4000;
      const pgeo = new THREE.InstancedBufferGeometry();
      const base = new THREE.PlaneGeometry(0.012, 0.012);
      pgeo.index = base.index;
      pgeo.attributes.position = base.attributes.position;
      pgeo.attributes.uv = base.attributes.uv;
      const offsets = new Float32Array(COUNT * 3);
      for (let i = 0; i < COUNT; i++) {
        const r = 3 + Math.random() * 8;
        const t = Math.random() * Math.PI * 2;
        const p = Math.acos(2 * Math.random() - 1);
        offsets[i * 3] = r * Math.sin(p) * Math.cos(t);
        offsets[i * 3 + 1] = r * Math.sin(p) * Math.sin(t);
        offsets[i * 3 + 2] = r * Math.cos(p);
      }
      pgeo.setAttribute("aOffset", new THREE.InstancedBufferAttribute(offsets, 3));
      const pmat = new THREE.ShaderMaterial({
        transparent: true, depthWrite: false,
        uniforms: { uTime: { value: 0 }, uMouse: { value: new THREE.Vector2() } },
        vertexShader: `attribute vec3 aOffset; uniform float uTime; uniform vec2 uMouse; varying float vA;
          void main(){
            vec3 p = aOffset;
            float n = sin(p.x*0.4 + uTime*0.3) + cos(p.y*0.5 + uTime*0.2) + sin(p.z*0.3 + uTime*0.25);
            p += normalize(p) * n * 0.15;
            p.x += uMouse.x * 0.4;
            p.y += uMouse.y * 0.4;
            vec4 mv = modelViewMatrix * vec4(p + position, 1.0);
            gl_Position = projectionMatrix * mv;
            vA = smoothstep(12.0, 2.0, length(p));
          }`,
        fragmentShader: `varying float vA;
          void main(){
            vec3 col = mix(vec3(0.78,0.69,0.48), vec3(0.95,0.92,0.86), vA);
            gl_FragColor = vec4(col, vA * 0.55);
          }`,
      });
      const particles = new THREE.Mesh(pgeo, pmat);
      scene.add(particles);

      const mouse = new THREE.Vector2();
      const onPMove = (e: MouseEvent) => {
        mouse.x = (e.clientX / innerWidth) * 2 - 1;
        mouse.y = -((e.clientY / innerHeight) * 2 - 1);
      };
      window.addEventListener("mousemove", onPMove);
      off(() => window.removeEventListener("mousemove", onPMove));

      /* Section state */
      const sectionState = { mode: "hero", rotSpeed: 0.002 };
      const setMode = (mode: string) => {
        sectionState.mode = mode;
        const s = mode === "skills" ? 1.6 : mode === "work" ? 0.7 : mode === "contact" ? 1.1 : 1.0;
        gsap.to(ico.scale, { x: s, y: s, z: s, duration: 1.0, ease: "power3.inOut" });
      };
      ["hero", "about", "skills", "work", "contact"].forEach((id) => {
        const el = document.getElementById(id);
        if (!el) return;
        ScrollTrigger.create({
          trigger: el, start: "top 50%", end: "bottom 50%",
          onEnter: () => setMode(id), onEnterBack: () => setMode(id),
        });
      });

      /* Philosophy tenets ↔ orb readout + visible orb pulse + ico color pulse */
      const aboutOrb = document.querySelector<HTMLElement>(".about-orb");
      const orbReadout = document.querySelector<HTMLElement>("[data-orb-readout]");
      const tenetLabels: Record<string, string> = {
        build: "shipping it",
        learn: "reading source",
        break: "breaking it",
        share: "documenting",
      };
      const tenetColors: Record<string, string> = {
        build: "#E9D6A3",
        learn: "#9bd1bd",
        break: "#f1c269",
        share: "#C8B17A",
      };
      document.querySelectorAll<HTMLElement>(".tenets li").forEach((li) => {
        const key = li.dataset.tenet || "";
        const enter = () => {
          li.classList.add("is-active");
          aboutOrb?.classList.add("is-pulsing");
          orbReadout?.classList.add("is-locked");
          signalLocked = true;
          if (orbText) {
            orbText.textContent = tenetLabels[key] || "active";
            orbText.style.color = tenetColors[key] || "#C8B17A";
          }
          if (orbFreq) orbFreq.textContent = "LOCK";
          gsap.to(icoMat.uniforms.uPulse, { value: 1, duration: 0.4, ease: "power3.out" });
          gsap.to(ico.rotation, { z: "+=0.5", duration: 0.8, ease: "power3.out" });
          gsap.to(ico.scale, { x: 1.25, y: 1.25, z: 1.25, duration: 0.6, ease: "back.out(2)" });
        };
        const leave = () => {
          li.classList.remove("is-active");
          aboutOrb?.classList.remove("is-pulsing");
          orbReadout?.classList.remove("is-locked");
          signalLocked = false;
          if (orbText) { orbText.textContent = "idle"; orbText.style.color = ""; }
          if (orbFreq) orbFreq.textContent = "2.7Ghz";
          gsap.to(icoMat.uniforms.uPulse, { value: 0, duration: 0.6, ease: "power2.out" });
          gsap.to(ico.scale, { x: 1, y: 1, z: 1, duration: 0.6, ease: "power3.out" });
        };
        li.addEventListener("mouseenter", enter);
        li.addEventListener("mouseleave", leave);
        off(() => { li.removeEventListener("mouseenter", enter); li.removeEventListener("mouseleave", leave); });
      });

      /* Skill grid hover → nudge the bg ico (constellation handled outside webgl block) */
      document.querySelectorAll<HTMLElement>(".sk").forEach((el) => {
        const enter = () => { gsap.to(ico.rotation, { y: "+=0.4", duration: 0.7, ease: "power3.out" }); };
        el.addEventListener("mouseenter", enter);
        off(() => el.removeEventListener("mouseenter", enter));
      });

      /* Render loop */
      let visible = true;
      const obs = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 });
      obs.observe(bgCanvas);
      off(() => obs.disconnect());

      const clock = new THREE.Clock();
      let raf2 = 0;
      function frame() {
        raf2 = requestAnimationFrame(frame);
        if (!visible) return;
        const t = clock.getElapsedTime();
        icoMat.uniforms.uTime.value = t;
        pmat.uniforms.uTime.value = t;
        pmat.uniforms.uMouse.value.lerp(mouse, 0.05);
        ico.rotation.y += sectionState.rotSpeed;
        ico.rotation.x += sectionState.rotSpeed * 0.4;
        group.position.x += (mouse.x * 0.3 - group.position.x) * 0.05;
        group.position.y += (mouse.y * 0.3 - group.position.y) * 0.05;
        renderer.render(scene, camera);
      }
      frame();
      off(() => cancelAnimationFrame(raf2));

      const onResize = () => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight, false);
      };
      window.addEventListener("resize", onResize);
      off(() => window.removeEventListener("resize", onResize));
    }

    /* ---------- Skills: dependency constellation + package inspector ---------- */
  }

  {
    const SKILL_META: Record<string, { kind: string; since: number; comfort: number; deps: string[]; blurb: string }> = {
      C: { kind: "lang · systems", since: 2023, comfort: 80, deps: ["Linux", "Git"], blurb: "Bare-metal headers, kernels, low-noise programs." },
      "C++": { kind: "lang · app", since: 2023, comfort: 78, deps: ["Qt", "C"], blurb: "Qt apps, CLIs, performance-sensitive code." },
      JS: { kind: "lang · web", since: 2024, comfort: 72, deps: ["HTML", "CSS"], blurb: "Browser-first scripting and UI logic." },
      HTML: { kind: "markup", since: 2023, comfort: 88, deps: ["CSS", "JS"], blurb: "Semantic structure first, always." },
      CSS: { kind: "style", since: 2023, comfort: 82, deps: ["HTML"], blurb: "Layout, motion, dark themes — handcrafted." },
      SQL: { kind: "data", since: 2024, comfort: 68, deps: ["Linux"], blurb: "Schemas, joins, reading query plans." },
      Linux: { kind: "platform", since: 2022, comfort: 84, deps: [], blurb: "Daily driver. Arch + tmux + a lot of man pages." },
      Git: { kind: "vcs", since: 2023, comfort: 76, deps: ["Linux"], blurb: "Rebase, bisect, signed commits, no force-push to main." },
      Qt: { kind: "framework", since: 2025, comfort: 62, deps: ["C++"], blurb: "Desktop UI with QSS theming and signal-slot graphs." },
      Nmap: { kind: "offsec · recon", since: 2024, comfort: 70, deps: ["Linux"], blurb: "Service & version enumeration on a budget." },
      Burp: { kind: "offsec · web", since: 2025, comfort: 58, deps: ["JS", "HTML"], blurb: "HTTP intercept, modify, replay — the boring way." },
      Python: { kind: "lang · script", since: 2024, comfort: 66, deps: ["Linux"], blurb: "Glue scripts, automation, tooling." },
    };
    const ORDER = Object.keys(SKILL_META);
    const svg = document.querySelector<SVGSVGElement>("[data-constellation]");
    const pos: Record<string, { x: number; y: number }> = {};
    if (svg) {
      const ns = "http://www.w3.org/2000/svg";
      const cx = 160, cy = 110;
      ORDER.forEach((k, i) => {
        const a = (i / ORDER.length) * Math.PI * 2 - Math.PI / 2;
        const r = i % 2 === 0 ? 92 : 58;
        pos[k] = { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
      });
      // edges
      const eg = document.createElementNS(ns, "g");
      eg.setAttribute("class", "cn-edges");
      ORDER.forEach((k) => {
        SKILL_META[k].deps.forEach((d) => {
          if (!pos[d]) return;
          const l = document.createElementNS(ns, "line");
          l.setAttribute("x1", String(pos[k].x));
          l.setAttribute("y1", String(pos[k].y));
          l.setAttribute("x2", String(pos[d].x));
          l.setAttribute("y2", String(pos[d].y));
          l.setAttribute("data-from", k);
          l.setAttribute("data-to", d);
          eg.appendChild(l);
        });
      });
      svg.appendChild(eg);
      // nodes
      const ng = document.createElementNS(ns, "g");
      ng.setAttribute("class", "cn-nodes");
      ORDER.forEach((k) => {
        const g = document.createElementNS(ns, "g");
        g.setAttribute("class", "cn-node");
        g.setAttribute("transform", `translate(${pos[k].x},${pos[k].y})`);
        g.setAttribute("data-skill", k);
        const ring = document.createElementNS(ns, "circle");
        ring.setAttribute("r", "11"); ring.setAttribute("class", "cn-ring");
        const dot = document.createElementNS(ns, "circle");
        dot.setAttribute("r", "3.5"); dot.setAttribute("class", "cn-dot");
        const lab = document.createElementNS(ns, "text");
        lab.setAttribute("class", "cn-lab");
        lab.setAttribute("text-anchor", "middle");
        lab.setAttribute("y", "-15");
        lab.textContent = k;
        g.appendChild(ring); g.appendChild(dot); g.appendChild(lab);
        ng.appendChild(g);
      });
      svg.appendChild(ng);
    }

    const R = {
      ver: document.querySelector<HTMLElement>("[data-pkg-ver]"),
      mods: document.querySelector<HTMLElement>("[data-pkg-mods]"),
      readout: document.querySelector<HTMLElement>("[data-pkg-readout]"),
    };
    // Build node_modules list once
    if (R.mods) {
      R.mods.innerHTML = ORDER.map((k) => {
        const m = SKILL_META[k];
        return `<li class="pkg-mod" data-mod="${k}">
          <span class="pkg-mod-name">${k.toLowerCase().replace(/\\+/g, "p")}</span>
          <span class="pkg-mod-ver">^${m.since}.${String(m.comfort).padStart(2, "0")}.0</span>
        </li>`;
      }).join("");
    }
    const focusSkill = (k: string) => {
      const m = SKILL_META[k]; if (!m) return;
      if (R.ver) R.ver.textContent = `v${m.since}.${String(m.comfort).padStart(2, "0")}.0`;
      R.readout?.classList.remove("is-pulse");
      void R.readout?.offsetWidth;
      R.readout?.classList.add("is-pulse");
      R.mods?.querySelectorAll(".pkg-mod").forEach((n) => n.classList.remove("is-on", "is-related"));
      R.mods?.querySelector(`.pkg-mod[data-mod="${CSS.escape(k)}"]`)?.classList.add("is-on");
      m.deps.forEach((d) => R.mods?.querySelector(`.pkg-mod[data-mod="${CSS.escape(d)}"]`)?.classList.add("is-related"));
      svg?.querySelectorAll(".cn-node").forEach((n) => n.classList.remove("is-on", "is-related"));
      svg?.querySelector(`.cn-node[data-skill="${CSS.escape(k)}"]`)?.classList.add("is-on");
      m.deps.forEach((d) => svg?.querySelector(`.cn-node[data-skill="${CSS.escape(d)}"]`)?.classList.add("is-related"));
      svg?.querySelectorAll("line").forEach((l) => {
        const on = l.getAttribute("data-from") === k || l.getAttribute("data-to") === k;
        l.classList.toggle("is-on", on);
      });
    };


    document.querySelectorAll<HTMLElement>(".sk").forEach((el) => {
      const key = el.dataset.skill || "";
      const enter = () => focusSkill(key);
      el.addEventListener("mouseenter", enter);
      off(() => el.removeEventListener("mouseenter", enter));
    });
    svg?.querySelectorAll<SVGGElement>(".cn-node").forEach((n) => {
      const key = n.getAttribute("data-skill") || "";
      const enter = () => {
        focusSkill(key);
        document.querySelector(`.sk[data-skill="${CSS.escape(key)}"]`)?.classList.add("is-focus");
      };
      const leave = () => document.querySelector(`.sk[data-skill="${CSS.escape(key)}"]`)?.classList.remove("is-focus");
      n.addEventListener("mouseenter", enter);
      n.addEventListener("mouseleave", leave);
      off(() => { n.removeEventListener("mouseenter", enter); n.removeEventListener("mouseleave", leave); });
    });
    focusSkill("Linux");
  }

  if (false) {
    // (legacy skills sphere removed; replaced by constellation + inspector above)
  }

  document.fonts?.ready.then(() => ScrollTrigger.refresh());

  return () => {
    cleanups.forEach((fn) => {
      try { fn(); } catch {}
    });
    ScrollTrigger.getAll().forEach((t) => t.kill());
  };
}
