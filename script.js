import { fontStack, loadFont } from "/fonts.js";

/* ==========================================================================
   jynxt - Main Application Script
   Windows XP-inspired personal website
   ========================================================================== */

const PREVIEW = new URLSearchParams(location.search).has("preview");
const INBOX_COOLDOWN_MS = 20_000;

const DEFAULT_CONFIG = {
  site: { title: "jynxt", description: "" },
  profile: { name: "jynxt", tagline: "", avatar: "/assets/optimized/avatars/profile1.webp" },
  about: { title: "about me", text: "" },
  links: [],
  wallpapers: ["/assets/optimized/wallpapers/default.webp"],
  inbox: { enabled: false, provider: "whispr", profileUrl: "", linkLabel: "send a whispr", title: "tell me your thoughts", subtitle: "", placeholder: "", submitLabel: "send", maxLength: 500 },
  lastfm: { enabled: false, username: "" },
  theme: { font: "system", accent: "#ffffff", overlay: 0.3, blur: 28, radius: 32 },
  music: { autoplay: true, shuffle: true },
};

const FALLBACK_TRACKS = [
  { title: "poison", artist: "Jaydes", src: "/Music/Jaydes - poison.flac", cover: null },
];

const $ = (id) => document.getElementById(id);
const $all = (sel) => document.querySelectorAll(sel);

/* ---------- small helpers ------------------------------------------------ */

const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);
function merge(base, extra) {
  const out = { ...base };
  for (const [k, v] of Object.entries(extra ?? {})) out[k] = isObj(v) && isObj(base[k]) ? merge(base[k], v) : v;
  return out;
}

// Security: validate URLs
function safeHref(u) {
  if (typeof u !== "string" || !u.trim()) return "#";
  try {
    const url = new URL(u, location.href);
    return ["http:", "https:", "mailto:"].includes(url.protocol) ? url.href : "#";
  } catch {
    return "#";
  }
}

function safeSrc(u) {
  if (typeof u !== "string" || !u) return "";
  if (u.startsWith("blob:") || /^data:image\/(png|jpe?g|webp|gif);/i.test(u)) return u;
  try {
    const url = new URL(u, location.href);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch {
    return "";
  }
}

function loadImage(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => (img.decode?.() ?? Promise.resolve()).catch(() => {}).finally(resolve);
    img.onerror = resolve;
    img.src = src;
  });
}

const withTimeout = (p, ms) => Promise.race([p, new Promise((r) => setTimeout(r, ms))]);

/* ---------- state -------------------------------------------------------- */

let config = DEFAULT_CONFIG;
let introDone = false;
let playing = false;
let muted = false;
let trackIdx = 0;
let tracks = [];

/* ---------- wallpaper loading -------------------------------------------- */

let wallpaperIdx = 0;

function setWallpaper(idx) {
  const wallpapers = config.wallpapers || ["/assets/optimized/wallpapers/default.webp"];
  wallpaperIdx = ((idx % wallpapers.length) + wallpapers.length) % wallpapers.length;
  const img = document.createElement("img");
  const existing = $(".wallpapers img");
  if (existing) existing.remove();
  img.src = wallpapers[wallpaperIdx];
  img.className = "active";
  $("wallpapers").appendChild(img);
}

/* ---------- login screen ------------------------------------------------- */

function initLogin() {
  const loginScreen = $("#login-screen");
  const loginBtn = $("#login-btn");

  loginBtn.addEventListener("click", () => {
    loginScreen.classList.add("hidden");
    introDone = true;
    $("intro").classList.add("is-hidden");
    document.body.classList.add("entered");
    loadRemainingWallpapers();
    updateSections();
  });
}

/* ---------- config ------------------------------------------------------- */

async function loadConfig() {
  let loaded = null;
  try {
    const res = await fetch("/config.json", { cache: "no-cache" });
    if (res.ok) loaded = await res.json();
  } catch {
    // fall through to defaults
  }
  applyConfig(loaded ?? {});
}

function applyConfig(cfg) {
  config = merge(DEFAULT_CONFIG, cfg);

  // Apply theme
  const theme = config.theme || {};
  document.documentElement.style.setProperty("--accent", theme.accent || "#ffffff");
  document.documentElement.style.setProperty("--overlay", theme.overlay ?? 0.3);
  document.documentElement.style.setProperty("--glass-blur", (theme.blur || 28) + "px");
  document.documentElement.style.setProperty("--card-radius", (theme.radius || 32) + "px");

  // Apply font
  if (theme.font) loadFont(theme.font);

  // Update profile
  const profile = config.profile || {};
  if (profile.avatar) {
    $("#avatar").src = profile.avatar;
    $("#login-avatar").src = profile.avatar;
  }
  if (profile.name) $("#profile-name").textContent = profile.name;
  if (profile.tagline) $("#profile-tagline").textContent = profile.tagline;

  // Update links
  const linksContainer = $("#links");
  linksContainer.innerHTML = "";
  (config.links || []).forEach(link => {
    const a = document.createElement("a");
    a.href = safeHref(link.url);
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.innerHTML = `<img src="${safeSrc(link.icon)}" alt="${link.title}" />${link.title}`;
    linksContainer.appendChild(a);
  });

  // Update about
  if (config.about?.text) {
    // Could add about content display
  }

  // Set wallpaper
  if (config.wallpapers?.length) {
    setWallpaper(0);
  }
}

/* ---------- music -------------------------------------------------------- */

async function loadMusic() {
  try {
    const res = await fetch("/music-metadata.json");
    const data = res.ok ? await res.json() : null;
    if (Array.isArray(data) && data.length) {
      tracks = config.music.shuffle ? shuffle([...data]) : [...data];
      trackIdx = 0;
    }
  } catch {
    // keep the fallback track
  }
  renderTrack();
}

function renderTrack() {
  if (!tracks[trackIdx]) return;
  const t = tracks[trackIdx];
  $("#track-title").textContent = t.title || "";
  $("#track-artist").textContent = t.artist || "";
  $("#cover").textContent = t.cover ? "" : "♪";
  if (t.cover) {
    $("#cover").innerHTML = `<img src="${safeSrc(t.cover)}" alt="" />`;
  }
  $("#audio").src = t.src || "";

  const fullLink = $("now-playing");
  if (fullLink && t.src) {
    fullLink.href = t.src;
    fullLink.textContent = `${t.title} - ${t.artist}`;
    fullLink.hidden = false;
  }
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function step(dir) {
  trackIdx = (trackIdx + dir + tracks.length) % tracks.length;
  renderTrack();
}

/* ---------- music controls ------------------------------------------------ */

function initMusicControls() {
  const playBtn = $("play-btn");
  const prevBtn = $("prev-btn");
  const nextBtn = $("next-btn");
  const muteBtn = $("mute-btn");
  const audio = $("audio");
  const muteIcon = $("mute-icon");

  playBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    playing = !playing;
    if (playing) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
    sync();
  });

  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    step(-1);
  });

  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    step(1);
  });

  audio.addEventListener("ended", () => step(1));

  audio.addEventListener("play", () => {
    playing = true;
    sync();
  });

  audio.addEventListener("pause", () => {
    playing = false;
    sync();
  });

  muteBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    muted = !muted;
    muteIcon.src = muted ? "/assets/volume off.png" : "/assets/volume on.png";
    muteBtn.setAttribute("aria-label", muted ? "Unmute" : "Mute");
    muteBtn.setAttribute("aria-pressed", String(muted));
    audio.muted = muted;
  });

  function sync() {
    playBtn.textContent = playing ? "⏸" : "▶";
  }

  // Store reference for sync
  window.__mp = { playBtn, audio, muteBtn, muteIcon, sync };
}

/* ---------- sections ------------------------------------------------------- */

let sections = [];
let activeIndex = 0;

function updateSections() {
  sections = $all(".card-section");
  sections.forEach((el, i) => {
    el.style.display = i === activeIndex ? "block" : "none";
  });
}

function loadRemainingWallpapers() {
  const wallpapers = config.wallpapers || [];
  wallpapers.forEach((url, i) => {
    if (i === 0) return; // already loaded
    loadImage(url);
  });
}

/* ---------- intro -------------------------------------------------------- */

function armIntro() {
  $("intro-label").textContent = "click to enter";
  $("intro").removeAttribute("hidden");
  $("intro").classList.remove("is-hidden");
}

/* ---------- boot ---------------------------------------------------------- */

async function boot() {
  await loadConfig();
  await loadMusic();
  initLogin();
  initMusicControls();

  if (PREVIEW) {
    // Admin live preview mode
    introDone = true;
    $("intro").classList.add("is-hidden");
    document.body.classList.add("entered");
    loadRemainingWallpapers();
    updateSections();
    return;
  }

  // Normal mode: wait for login, then proceed
  armIntro();
}

boot();