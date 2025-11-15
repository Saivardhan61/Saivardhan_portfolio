/* Final script.js - cleaned & working */
(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from((root || document).querySelectorAll(sel));

  /* THEME TOGGLE */
  function initThemeToggle() {
    const toggle = $("#day-night");
    const saved = localStorage.getItem("theme");
    if (saved === "dark") { document.body.classList.add("dark"); if (toggle) toggle.checked = true; }
    if (toggle) {
      toggle.addEventListener("change", () => {
        const isDark = document.body.classList.toggle("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
      });
    }
  }

  /* ACCENT SWITCHER */
  function initAccentColors() {
    const KEY = "accent-class";
    const saved = localStorage.getItem(KEY);
    if (saved) document.documentElement.classList.add(saved);

    $$(".swatch").forEach(s => {
      s.addEventListener("click", () => {
        const cls = s.dataset.color;
        if (!cls) return;
        // remove previous color-* classes on :root
        document.documentElement.classList.remove(...Array.from(document.documentElement.classList).filter(c => c.startsWith("color-")));
        document.documentElement.classList.add(cls);
        localStorage.setItem(KEY, cls);
      });
    });
  }

  /* TYPEWRITER */
  function initTypewriter() {
    $$(".txt-rotate").forEach(node => {
      let words = [];
      try { words = JSON.parse(node.getAttribute("data-rotate")); } catch {}
      if (!words || !words.length) return;
      const period = parseInt(node.getAttribute("data-period"), 10) || 2000;
      let loop = 0, txt = "", deleting = false;
      function tick() {
        const full = words[loop % words.length];
        txt = deleting ? full.substring(0, txt.length - 1) : full.substring(0, txt.length + 1);
        node.textContent = txt;
        let delta = 120;
        if (!deleting && txt === full) { delta = period; deleting = true; }
        else if (deleting && txt === "") { deleting = false; loop++; delta = 400; }
        setTimeout(tick, delta);
      }
      tick();
    });
  }

  /* SCROLL REVEAL */
  function initScrollReveal() {
    const els = $$("[data-reveal]");
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.style.opacity = "1";
          e.target.style.transform = "translateY(0)";
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    els.forEach(el => io.observe(el));
  }

  /* SKILL BARS */
  function initSkills() {
    const bars = $$(".skill-fill");
    if (!bars.length) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const b = e.target;
          const final = b.dataset.final || "0%";
          b.style.width = final;
          io.unobserve(b);
        }
      });
    }, { threshold: 0.25 });
    bars.forEach(b => { b.style.width = "0%"; io.observe(b); });
  }

  /* HERO TILT */
  function initHeroTilt() {
    const wrap = $(".home__img--wrapper");
    if (!wrap) return;
    const img = wrap.querySelector(".home__img");
    if (!img) return;
    wrap.addEventListener("mousemove", e => {
      const r = wrap.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      img.style.transform = `translate(${x * 10}px, ${y * 10}px) scale(1.03)`;
    });
    wrap.addEventListener("mouseleave", () => {
      img.style.transform = "translate(0,0) scale(1)";
    });
  }

  /* CARD TILT */
  function initCardTilt() {
    const cards = $$(".work__card, .project-card");
    cards.forEach(card => {
      const img = card.querySelector(".project-img, img");
      card.addEventListener("mousemove", e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(700px) rotateX(${y * -8}deg) rotateY(${x * 8}deg)`;
        if (img) img.style.transform = `translate(${x * 8}px, ${y * -6}px) scale(1.03)`;
      });
      card.addEventListener("mouseleave", () => { card.style.transform = "none"; if (img) img.style.transform = "none"; });
    });
  }

  /* NAV ACTIVE */
  function initNavActive() {
    const sections = $$("main section[id]");
    const links = $$(".nav__link");
    if (!sections.length || !links.length) return;
    function update() {
      const pos = window.scrollY + 160;
      let current = sections[0];
      sections.forEach(s => { if (s.offsetTop <= pos) current = s; });
      links.forEach(a => a.classList.toggle("active-link", a.getAttribute("href") === `#${current.id}`));
    }
    window.addEventListener("scroll", update);
    update();
  }

  /* LOAD GSAP (optional header animation) */
  function loadGSAP(cb) {
    if (window.gsap) return cb(window.gsap);
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js";
    s.onload = () => cb(window.gsap);
    s.onerror = () => cb(null);
    document.head.appendChild(s);
  }

  /* INIT */
  document.addEventListener("DOMContentLoaded", () => {
    /* EXTRA SCROLL ANIMATIONS */
function initExtraScrollAnimations() {
  const els = document.querySelectorAll(
    ".slide-left, .slide-right, .scale-in, .glow-reveal"
  );

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  els.forEach((el) => io.observe(el));
}

    initThemeToggle();
    initAccentColors();
    initTypewriter();
    initScrollReveal();
    initSkills();
    initHeroTilt();
    initCardTilt();
    initNavActive();
    initExtraScrollAnimations();


    loadGSAP(gsap => { if (!gsap) return; gsap.from("header", { y: -20, opacity: 0, duration: 0.6, ease: "power2" }); });
  });
})();
