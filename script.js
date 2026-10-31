/* ==========================================================================
   jynxt - Main Application Script
   Windows XP-style personal music website
   ========================================================================== */

const PREVIEW = new URLSearchParams(location.search).has("preview");

const DEFAULT_CONFIG = {
  site: { title: "jynxt", description: "i listen to music" },
  profile: { name: "jynxt", tagline: "wsp", avatar: "/assets/optimized/avatars/profile1.webp" },
  about: { title: "about me", text: "close to giving up" },
  links: [
    { title: "Instagram", url: "https://instagram.com/jynxt__/", icon: "/assets/optimized/icons/instagram.webp" },
    { title: "Spotify", url: "https://open.spotify.com/user/i0ue71gymkciwhe01azc7yrj4", icon: "/assets/optimized/icons/spotify.webp" },
    { title: "Last.fm", url: "https://last.fm/user/ProMaster420", icon: "/assets/optimized/icons/lastfm.webp" },
    { title: "Genius", url: "https://genius.com/ProMaster420", icon: "/assets/optimized/icons/genius.webp" },
    { title: "Steam", url: "https://steamcommunity.com/id/ProMaster420_/", icon: "/assets/optimized/icons/steam.webp" },
    { title: "YouTube", url: "https://youtube.com/@ProMaster420", icon: "/assets/optimized/icons/youtube.webp" }
  ],
  wallpapers: [
    "/assets/optimized/wallpapers/default.webp",
    "/assets/optimized/wallpapers/wallpaper1.webp",
    "/assets/optimized/wallpapers/wallpaper2.webp",
    "/assets/optimized/wallpapers/wallpaper3.webp",
    "/assets/optimized/wallpapers/wallpaper4.webp",
    "/assets/optimized/wallpapers/wallpaper5.webp"
  ],
  inbox: { enabled: true, provider: "ngl", profileUrl: "https://ngl.link/jynxt__", title: "tell me your thoughts", maxLength: 500 },
  lastfm: { enabled: true, username: "ProMaster420" },
  theme: { font: "system", accent: "#ffffff", overlay: 0.2, blur: 20, radius: 32 },
  music: { autoplay: false, shuffle: true },
  annotations: { enabled: true, highlight: "#ffe94d", entries: [] }
};

const $ = (id) => document.getElementById(id);
const $all = (sel) => document.querySelectorAll(sel);

// State
let config = DEFAULT_CONFIG;
let playing = false;
let muted = false;
let trackIdx = 0;
let tracks = [];
let wallpaperIdx = 0;
let windows = {};
let windowZIndex = 100;

/* ---------- Helpers ------------------------------------------------------- */

const isObj = (v) => v && typeof v === "object" && !Array.isArray(v);

function merge(base, extra) {
  const out = { ...base };
  for (const [k, v] of Object.entries(extra ?? {})) {
    out[k] = isObj(v) && isObj(base[k]) ? merge(base[k], v) : v;
  }
  return out;
}

function safeHref(u) {
  if (typeof u !== "string" || !u.trim()) return "#";
  try {
    const url = new URL(u, location.href);
    return ["http:", "https:", "mailto:"].includes(url.protocol) ? url.href : "#";
  } catch { return "#"; }
}

function safeSrc(u) {
  if (typeof u !== "string" || !u) return "";
  if (u.startsWith("blob:") || /^data:image\/(png|jpe?g|webp|gif);/i.test(u)) return u;
  try {
    const url = new URL(u, location.href);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "";
  } catch { return ""; }
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

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;",
    '"': "&quot;", "'": "&#039;"
  }[m]));
}

/* ---------- Clock ---------------------------------------------------------- */

function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, "0");
  const mins = String(now.getMinutes()).padStart(2, "0");
  const suffix = now.getHours() >= 12 ? "PM" : "AM";
  $("taskbar-clock").textContent = `${hours}:${mins} ${suffix}`;
}

setInterval(updateClock, 1000);
updateClock();

/* ---------- Wallpaper System ----------------------------------------------- */

function setWallpaper(idx = null) {
  if (idx !== null) wallpaperIdx = idx;
  const wallpapers = config.wallpapers || ["/assets/optimized/wallpapers/default.webp"];
  wallpaperIdx = ((wallpaperIdx % wallpapers.length) + wallpapers.length) % wallpapers.length;

  const img = document.createElement("img");
  const existing = $("wallpapers img");
  if (existing) existing.remove();
  img.src = wallpapers[wallpaperIdx];
  img.className = "active";
  $("wallpapers").appendChild(img);
}

/* ---------- Window Management ---------------------------------------------- */

function createWindow(id, title, content, options = {}) {
  if (windows[id]) {
    focusWindow(id);
    return windows[id].element;
  }

  const win = document.createElement("div");
  win.className = "window";
  win.style.display = "none";
  win.dataset.windowId = id;

  win.innerHTML = `
    <div class="window-titlebar">
      <span class="window-title">${escapeHtml(title)}</span>
      <div class="window-controls">
        <button class="win-btn minimize" aria-label="Minimize">_</button>
        <button class="win-btn maximize" aria-label="Maximize">□</button>
        <button class="win-btn close" aria-label="Close">✕</button>
      </div>
    </div>
    <div class="window-content"></div>
  `;

  win.querySelector(".window-content").innerHTML = content;
  win.style.left = options.left || "100px";
  win.style.top = options.top || "100px";
  win.style.zIndex = windowZIndex++;

  // Draggable titlebar
  win.querySelector(".window-titlebar").addEventListener("mousedown", (e) => {
    if (e.target.closest(".window-controls")) return;
    startDrag(win, e);
  });

  // Button handlers
  win.querySelectorAll(".win-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const action = btn.className.split(" ")[1];
      handleWindowButton(win, action);
    });
  });

  $("windows-container").appendChild(win);
  windows[id] = { element: win, open: true };
  return win;
}

function focusWindow(id) {
  if (!windows[id]) return;
  Object.values(windows).forEach(w => w.element.style.zIndex = windowZIndex++);
  setWindowVisibility(id, true);
}

function setWindowVisibility(id, visible) {
  if (!windows[id]) return;
  windows[id].element.style.display = visible ? "block" : "none";
}

function closeWindow(id) {
  if (!windows[id]) return;
  windows[id].open = false;
  setWindowVisibility(id, false);
}

/* ---------- Drag Implementation ------------------------------------------- */

let dragState = null;

function startDrag(win, e) {
  dragState = { win, startX: e.clientX, startY: e.clientY, startLeft: win.offsetLeft, startTop: win.offsetTop };
  win.style.zIndex = windowZIndex++;

  const mouseMove = (e2) => {
    if (!dragState) return;
    const dx = e2.clientX - dragState.startX;
    const dy = e2.clientY - dragState.startY;
    win.style.left = (dragState.startLeft + dx) + "px";
    win.style.top = (dragState.startTop + dy) + "px";
  };

  const mouseUp = () => {
    dragState = null;
    document.removeEventListener("mousemove", mouseMove);
    document.removeEventListener("mouseup", mouseUp);
  };

  document.addEventListener("mousemove", mouseMove);
  document.addEventListener("mouseup", mouseUp);
}

function handleWindowButton(win, action) {
  if (action === "close") {
    closeWindow(win.dataset.windowId);
  } else if (action === "minimize") {
    setWindowVisibility(win.dataset.windowId, false);
  } else if (action === "maximize") {
    win.classList.toggle("maximized");
  }
}

/* ---------- Login -------------------------------------------------------- */

function initLogin() {
  $("#login-screen").addEventListener("click", () => {
    $("#login-screen").classList.add("hidden");
    $("intro").classList.add("is-hidden");
    document.body.classList.add("entered");
    activateProfileSection();
    updateSections();
  });
}

/* ---------- Profile Window ----------------------------------------------- */

function openProfileWindow() {
  const content = `
    <div class="profile-content">
      <div style="text-align: center; margin-bottom: 16px;">
        <img src="${config.profile.avatar}" alt="jynxt" style="width: 96px; height: 96px; border-radius: 50%; border: 3px solid #fff;">
        <h2 style="margin: 8px 0 4px;">${escapeHtml(config.profile.name)}</h2>
        <p style="color: #aaa; font-size: 14px;">${escapeHtml(config.profile.tagline)}</p>
      </div>
      <div id="profile-links">
        ${config.links.map(l => `
          <a href="${safeHref(l.url)}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 12px; padding: 8px; background: rgba(255,255,255,0.05); border-radius: 6px; margin-bottom: 8px;">
            <img src="${safeSrc(l.icon)}" style="width: 20px; height: 20px;">
            <span>${l.title}</span>
          </a>
        `).join("")}
      </div>
    </div>
  `;
  createWindow("profile-win", "jynxt - Profile", content, { left: 150, top: 150 });
}

/* ---------- Gallery Window ------------------------------------------------ */

function openGalleryWindow() {
  const content = `
    <div id="gallery-content" style="overflow-y: auto;">
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px;">
        ${config.wallpapers.map((wp, i) => `
          <div data-index="${i}" style="cursor: pointer; border: 2px solid rgba(255,255,255,0.1); border-radius: 8px; overflow: hidden;" class="gallery-item">
            <img src="${safeSrc(wp)}" style="width: 100%; height: 120px; object-fit: cover;">
          </div>
        `).join("")}
      </div>
    </div>
  `;
  const win = createWindow("gallery-win", "jynxt - Gallery", content, { left: 100, top: 150, width: "400px" });

  win.querySelectorAll(".gallery-item").forEach(el => {
    el.addEventListener("click", () => {
      setWallpaper(parseInt(el.dataset.index));
    });
  });
}

/* ---------- Music Window -------------------------------------------------- */

function openMusicWindow() {
  const content = `
    <div class="music-window-content">
      <div style="margin-bottom: 12px; padding: 12px; background: rgba(255,255,255,0.05); border-radius: 8px;">
        <div id="music-current" style="font-weight: bold;">Loading...</div>
        <div id="music-artist" style="color: #aaa; font-size: 12px;">Now Playing</div>
      </div>
      <div style="display: flex; gap: 8px; margin-top: auto;">
        <button id="wp-mute" class="win-btn">🔊</button>
      </div>
    </div>
  `;

  const win = createWindow("music-win", "jynxt - Music", content, { left: 200, top: 200 });
  renderTrackToWindow(win);
}

function renderTrackToWindow(win) {
  const title = win.querySelector("#music-current");
  const artist = win.querySelector("#music-artist");
  if (tracks[trackIdx]) {
    title.textContent = tracks[trackIdx].title;
    artist.textContent = tracks[trackIdx].artist;
  }
}

/* ---------- Wallpaper Window ---------------------------------------------- */

function openWallpaperWindow() {
  const content = `
    <div class="wallpaper-selector">
      <div id="wp-list" style="display: flex; gap: 12px; overflow-x: auto; padding: 12px;">
        ${config.wallpapers.map((wp, i) => `
          <div data-index="${i}" style="min-width: 120px; cursor: pointer; border: 2px solid ${i === wallpaperIdx ? 'var(--accent)' : 'rgba(255,255,255,0.2)'}; border-radius: 8px; overflow: hidden;" class="wp-option">
            <img src="${safeSrc(wp)}" style="width: 100%; height: 80px; object-fit: cover;">
            <div style="padding: 4px; text-align: center; font-size: 10px;">${i + 1}</div>
          </div>
        `).join("")}
      </div>
      <button id="wp-apply" style="margin-top: 12px; padding: 8px 16px;">Apply</button>
    </div>
  `;

  const win = createWindow("wallpaper-win", "jynxt - Wallpaper", content, { left: 150, top: 150 });
  const applyBtn = win.querySelector("#wp-apply");
  let selected = wallpaperIdx;

  win.querySelectorAll(".wp-option").forEach(el => {
    el.addEventListener("click", () => {
      selected = parseInt(el.dataset.index);
      win.querySelectorAll(".wp-option").forEach(o => {
        o.style.borderColor = "rgba(255,255,255,0.2)";
      });
      el.style.borderColor = "var(--accent)";
    });
  });

  applyBtn.addEventListener("click", () => {
    setWallpaper(selected);
  });
}

/* ---------- Desktop Icons ------------------------------------------------- */

function initDesktopIcons() {
  const icons = $("desktop-icons");
  icons.querySelectorAll(".desktop-icon").forEach(icon => {
    icon.addEventListener("dblclick", () => {
      const app = icon.dataset.app;
      if (app === "profile") openProfileWindow();
      else if (app === "gallery") openGalleryWindow();
      else if (app === "music") { openMusicWindow(); }
      else if (app === "wallpaper") openWallpaperWindow();
    });
  });
}

/* ---------- Start Menu --------------------------------------------------- */

function initStartMenu() {
  const startBtn = $("start-btn");
  const startMenu = $("start-menu");

  startBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    startMenu.style.display = startMenu.style.display === "block" ? "none" : "block";
  });

  startMenu.querySelectorAll(".start-menu-item").forEach(item => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      const action = item.dataset.action;
      startMenu.style.display = "none";

      if (action === "profile") openProfileWindow();
      else if (action === "gallery") openGalleryWindow();
      else if (action === "music") { openMusicWindow(); renderTrack(); }
      else if (action === "wallpaper") openWallpaperWindow();
    });
  });

  document.addEventListener("click", (e) => {
    if (!startMenu.contains(e.target) && e.target !== startBtn) {
      startMenu.style.display = "none";
    }
  });
}

/* ---------- Sections Control ---------------------------------------------- */

let sections = [];

function updateSections() {
  sections = $all(".card-section");
  sections.forEach(el => el.style.display = "none");
}

function activateProfileSection() {
  const profileCard = $("profile-card");
  if (profileCard) {
    profileCard.style.display = "block";
  }
}

/* ---------- Music System -------------------------------------------------- */

function loadMusic() {
  const fallback = [{ title: "poison", artist: "Jaydes", src: "/Music/Jaydes - poison.flac", cover: null }];
  tracks = fallback;
  trackIdx = 0;
}

function renderTrack() {
  if (!tracks[trackIdx]) return;
  const t = tracks[trackIdx];

  $("track-title").textContent = t.title || "";
  $("track-artist").textContent = t.artist || "";

  const audio = $("audio");
  const playBtn = $("play-btn");

  if (t.cover) {
    $("cover").innerHTML = `<img src="${safeSrc(t.cover)}">`;
  } else {
    $("cover").textContent = "♪";
  }

  if (t.src) {
    audio.src = t.src;
    $("now-playing").href = t.src;
    $("now-playing").textContent = `${t.title} - ${t.artist}`;
    $("now-playing").hidden = false;
  }

  playBtn.textContent = "▶";
}

function stepTrack(dir) {
  if (!tracks.length) return;
  trackIdx = (trackIdx + dir + tracks.length) % tracks.length;
  renderTrack();
  renderTrackToWindow(windows["music-win"]);
}

function togglePlay() {
  const audio = $("audio");
  const btn = $("play-btn");
  playing = !playing;
  if (playing) audio.play().catch(() => {});
  else audio.pause();
  btn.textContent = playing ? "⏸" : "▶";
}

function initMusicControls() {
  $("play-btn").addEventListener("click", togglePlay);
  $("prev-btn").addEventListener("click", () => stepTrack(-1));
  $("next-btn").addEventListener("click", () => stepTrack(1));
  $("audio").addEventListener("ended", () => stepTrack(1));

  $("mute-btn").addEventListener("click", (e) => {
    e.stopPropagation();
    muted = !muted;
    $("mute-icon").src = muted ? "/assets/volume off.png" : "/assets/volume on.png";
    $("mute-btn").setAttribute("aria-label", muted ? "Unmute" : "Mute");
    $("audio").muted = muted;
  });
}

/* ---------- Config -------------------------------------------------------- */

async function loadConfig() {
  try {
    const res = await fetch("/config.json", { cache: "no-cache" });
    if (res.ok) {
      config = merge(DEFAULT_CONFIG, await res.json());
      const theme = config.theme || {};
      document.documentElement.style.setProperty("--accent", theme.accent || "#ffffff");
      document.documentElement.style.setProperty("--overlay", theme.overlay ?? 0.2);
      document.documentElement.style.setProperty("--glass-blur", (theme.blur || 20) + "px");
      document.documentElement.style.setProperty("--card-radius", (theme.radius || 32) + "px");
    }
  } catch {}
}

/* ---------- Boot ---------------------------------------------------------- */

async function boot() {
  await loadConfig();
  setWallpaper(0);
  loadMusic();
  initLogin();
  initMusicControls();
  initDesktopIcons();
  initStartMenu();

  if (PREVIEW) {
    document.body.classList.add("entered");
    activateProfileSection();
    return;
  }
}

boot();