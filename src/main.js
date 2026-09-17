import "./input.css";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const loader = document.getElementById("loader");

function whenStylesReady() {
  const links = Array.from(
    document.querySelectorAll('link[rel="preload"][as="style"], link#fontsCss')
  ).filter((l) => l.hasAttribute("onload"));

  const ready = () =>
    links.every((l) => l.sheet && l.rel === "stylesheet" && l.media !== "print");

  if (ready()) return Promise.resolve();

  return new Promise((resolve) => {
    const started = Date.now();
    const tick = () => {
      if (ready() || Date.now() - started > 2500) return resolve();
      window.setTimeout(tick, 40);
    };
    tick();
  });
}

function initLoader() {
  const root = document.documentElement;
  const showLoader = !!loader && !root.classList.contains("no-loader");

  if (reduceMotion) {
    if (loader) loader.remove();
    root.classList.remove("pt-enter");
    return;
  }

  const bar = showLoader ? document.getElementById("loaderBar") : null;
  const pct = showLoader ? document.getElementById("loaderPct") : null;
  const status = showLoader ? document.getElementById("loaderStatus") : null;
  const phrases = [
    "Setting type",
    "Inking the plates",
    "Running the press",
    "Folding the edition",
  ];

  let progress = 0;
  let phrase = 0;
  let progressTimer = 0;
  let phraseTimer = 0;

  if (showLoader) {
    progressTimer = window.setInterval(() => {
      progress = Math.min(progress + (94 - progress) * 0.085, 94);
      if (bar) bar.style.transform = `scaleX(${(progress / 100).toFixed(4)})`;
      if (pct) pct.textContent = `${Math.round(progress)}%`;
    }, 70);

    phraseTimer = window.setInterval(() => {
      phrase = (phrase + 1) % phrases.length;
      if (status) status.textContent = phrases[phrase];
    }, 620);
  }

  const minWait = new Promise((resolve) =>
    window.setTimeout(resolve, showLoader ? 900 : 320)
  );
  const pageLoaded = new Promise((resolve) => {
    if (document.readyState === "complete") resolve();
    else window.addEventListener("load", resolve, { once: true });
  });
  const fontsReady = whenStylesReady().then(() =>
    document.fonts ? document.fonts.ready.catch(() => {}) : Promise.resolve()
  );
  const failsafe = new Promise((resolve) =>
    window.setTimeout(resolve, showLoader ? 5000 : 2600)
  );

  Promise.race([Promise.all([pageLoaded, fontsReady, minWait]), failsafe]).then(
    () => {
      window.clearInterval(progressTimer);
      window.clearInterval(phraseTimer);

      if (bar) bar.style.transform = "scaleX(1)";
      if (pct) pct.textContent = "100%";
      if (status) status.textContent = "Edition ready";

      const reveal = showLoader ? 280 : 0;

      window.setTimeout(() => {
        root.classList.remove("pt-enter");
        if (!loader) return;
        if (showLoader) {
          loader.setAttribute("data-done", "true");
          window.setTimeout(() => loader.remove(), 1000);
        } else {
          loader.remove();
        }
      }, reveal);
    }
  );
}

initLoader();

const toggle = document.getElementById("menuToggle");
const menu = document.getElementById("menu");
const nav = document.getElementById("nav");

function lockScroll() {
  const root = document.documentElement;
  const zoom = parseFloat(root.style.zoom) || 1;
  const scrollbar = (window.innerWidth - root.clientWidth) / zoom;
  root.style.setProperty("--sbw", scrollbar + "px");
  document.body.style.overflow = "hidden";
}

function unlockScroll() {
  document.documentElement.style.setProperty("--sbw", "0px");
  document.body.style.overflow = "";
}

function openMenu() {
  menu.removeAttribute("data-leaving");
  menu.setAttribute("data-open", "true");
  menu.setAttribute("aria-hidden", "false");
  toggle.setAttribute("aria-expanded", "true");
  toggle.setAttribute("aria-label", "Close menu");
  lockScroll();
}

function closeMenu() {
  menu.setAttribute("data-open", "false");
  menu.setAttribute("aria-hidden", "true");
  toggle.setAttribute("aria-expanded", "false");
  toggle.setAttribute("aria-label", "Open menu");
  unlockScroll();
}

function isOpen() {
  return menu.getAttribute("data-open") === "true";
}

if (toggle && menu) {
  toggle.addEventListener("click", () => {
    isOpen() ? closeMenu() : openMenu();
  });

  menu.querySelectorAll("[data-close]").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) closeMenu();
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth > 991 && isOpen()) closeMenu();
  });
}

const targets = document.querySelectorAll(
  ".intro, .project-card, .strip-head, .orca-note, .stat, .work-detail, .about-col, .solve, .edu-item, .quote, .f-info"
);

targets.forEach((el) => el.classList.add("reveal"));

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const index = Array.prototype.indexOf.call(el.parentNode.children, el);
        el.style.transitionDelay = `${Math.min(index, 5) * 70}ms`;
        el.classList.add("in");
        observer.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  targets.forEach((el) => observer.observe(el));
} else {
  targets.forEach((el) => el.classList.add("in"));
}

const progress = document.querySelector(".scroll-progress");

function setProgress() {
  const doc = document.documentElement;
  const max = doc.scrollHeight - doc.clientHeight;
  const ratio = max > 0 ? doc.scrollTop / max : 0;
  if (progress) progress.style.transform = `scaleX(${Math.min(ratio, 1)})`;
}

let lastY = window.pageYOffset;

window.addEventListener(
  "scroll",
  () => {
    if (!isOpen()) {
      const y = window.pageYOffset;
      if (nav) {
        nav.style.transform =
          y > 220 && y > lastY ? "translateY(-100%)" : "translateY(0)";
      }
      lastY = y;
    }
    setProgress();
  },
  { passive: true }
);

setProgress();

if (finePointer && !reduceMotion) {
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    const strength = parseFloat(el.getAttribute("data-magnetic")) || 0.3;

    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) * strength;
      const y = (e.clientY - (rect.top + rect.height / 2)) * strength;
      el.style.transform = `translate(${x}px, ${y}px)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform = "";
    });
  });
}

function isInternalLink(anchor) {
  if (!anchor) return false;
  if (anchor.target === "_blank" || anchor.hasAttribute("download")) return false;
  const href = anchor.getAttribute("href");
  if (!href || href.startsWith("#")) return false;
  let url;
  try {
    url = new URL(anchor.href, location.href);
  } catch {
    return false;
  }
  if (url.origin !== location.origin) return false;
  return /\.html?$/.test(url.pathname);
}

let navigating = false;

if (!reduceMotion) {
  document.addEventListener("click", (e) => {
    if (navigating || e.defaultPrevented) return;
    if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const anchor = e.target.closest("a");
    if (!isInternalLink(anchor)) return;

    e.preventDefault();
    navigating = true;

    document.documentElement.classList.remove("pt-enter");

    const fromMenu = !!anchor.closest("#menu");
    if (fromMenu && menu) menu.setAttribute("data-leaving", "true");

    const water = document.querySelector(".pt-water");
    if (water && !fromMenu) {
      water.classList.add("pt-cover");
      water.style.transform = "translateY(-96px)";
    }

    window.setTimeout(
      () => {
        location.href = anchor.href;
      },
      fromMenu ? 760 : 1180
    );
  });
}

window.addEventListener("pageshow", (e) => {
  if (!e.persisted || reduceMotion) return;
  const root = document.documentElement;
  root.classList.add("pt-enter");
  requestAnimationFrame(() =>
    requestAnimationFrame(() => root.classList.remove("pt-enter"))
  );
});

const DESIGN_WIDTH = 1440;
let zoomTimer;

function applyZoom() {
  const zoom = Math.max(1, window.innerWidth / DESIGN_WIDTH);
  document.documentElement.style.zoom = zoom;
}

applyZoom();

window.addEventListener("resize", () => {
  window.clearTimeout(zoomTimer);
  zoomTimer = window.setTimeout(applyZoom, 120);
});
