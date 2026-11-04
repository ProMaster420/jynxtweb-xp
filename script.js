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
    "/assets/optimized/wallpapers/Bliss.webp",
    "/assets/optimized/wallpapers/Ascent.webp",
    "/assets/optimized/wallpapers/Azul.webp",
    "/assets/optimized/wallpapers/Crystal.webp",
    "/assets/optimized/wallpapers/Friend.webp",
    "/assets/optimized/wallpapers/Windows XP.webp"
  ],
  inbox: { enabled: true, provider: "ngl", profileUrl: "https://ngl.link/jynxt__", title: "tell me your thoughts", maxLength: 500 },
  lastfm: { enabled: true, username: "ProMaster420" },
  theme: { font: "system", accent: "#ffffff", overlay: 0.2, blur: 20, radius: 32 },
  music: { autoplay: false, shuffle: true },
  annotations: { enabled: true, highlight: "#ffe94d", entries: [] }
};

// DOM Helper
const $ = (id) => {
  const element = document.getElementById(id.replace(/^#/, ""));
  if (!element) console.warn(`Element not found: #${id.replace(/^#/, "")}`);
  return element;
};
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
let dragState = null;

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
  const clock = $("taskbar-clock");
  if (clock) clock.textContent = `${hours}:${mins} ${suffix}`;
}

setInterval(updateClock, 1000);
updateClock();

/* ---------- Wallpaper System ----------------------------------------------- */

function setWallpaper(idx = null) {
  if (idx !== null) wallpaperIdx = idx;
  const wallpapers = config.wallpapers || ["/assets/optimized/wallpapers/Bliss.webp"];
  wallpaperIdx = ((wallpaperIdx % wallpapers.length) + wallpapers.length) % wallpapers.length;

  const img = document.createElement("img");
  const existing = $all("#wallpapers img")[0];
  if (existing) existing.remove();
  img.src = wallpapers[wallpaperIdx];
  img.className = "active";
  $("#wallpapers").appendChild(img);
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

  const width = options.width || "auto";
  const height = options.height || "auto";
  if (width !== "auto") win.style.width = width;
  if (height !== "auto") win.style.height = height;

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

  const windowsContainer = document.getElementById("windows");
  if (windowsContainer) windowsContainer.appendChild(win);
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
  const welcomeScreen = $("#welcome-screen");
  const enterBtn = $("#enter-btn");
  const welcomeDialog = $("#welcome-dialog");
  const xpLogo = $("#xp-logo");

  if (enterBtn) {
    enterBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      transitionToDesktop();
    });
  }

  if (welcomeDialog) {
    welcomeDialog.addEventListener("click", (e) => {
      // Don't respond if clicking the XP logo area
      if (xpLogo && xpLogo.contains(e.target)) return;
      transitionToDesktop();
    });
  }
}

function transitionToDesktop() {
  const welcomeScreen = $("#welcome-screen");
  if (welcomeScreen) {
    welcomeScreen.style.transition = "opacity 0.5s ease";
    welcomeScreen.style.opacity = "0";
    setTimeout(() => {
      welcomeScreen.style.display = "none";
      document.body.classList.add("entered");
      activateProfileSection();
    }, 500);
  } else {
    document.body.classList.add("entered");
    activateProfileSection();
  }
}

/* ---------- Profile Window ----------------------------------------------- */

function openProfileWindow() {
  const content = `
    <div class="profile-content" style="font-family: 'Segoe UI', Tahoma, Verdana, sans-serif; color: #000000;">
      <div style="text-align: center; margin-bottom: 16px;">
        <img src="${config.profile.avatar}" alt="jynxt" style="width: 80px; height: 80px; border-radius: 50%; border: 3px solid #000080; border-bottom: 4px solid #808080; border-right: 4px solid #808080; object-fit: cover;">
        <h2 style="margin: 8px 0 4px; font-size: 18px; font-weight: bold; color: #000000;">${escapeHtml(config.profile.name)}</h2>
        <p style="color: #666666; font-size: 12px;">${escapeHtml(config.profile.tagline)}</p>
      </div>
      <div id="profile-links">
        ${config.links.map(l => `
          <a href="${safeHref(l.url)}" target="_blank" rel="noopener noreferrer" style="display: flex; align-items: center; gap: 12px; padding: 8px 12px; background: #f0f0f0; border: 1px solid #000080; border-top: 1px solid #ffffff; border-left: 1px solid #ffffff; border-right: 1px solid #000080; border-bottom: 1px solid #000080; border-radius: 0; margin-bottom: 8px; text-decoration: none; color: #000000; font-family: 'Segoe UI', Tahoma, Verdana, sans-serif; font-size: 12px;">
            <img src="${safeSrc(l.icon)}" style="width: 16px; height: 16px; display: block;">
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
    <div id="gallery-content" style="overflow-y: auto; font-family: 'Segoe UI', Tahoma, Verdana, sans-serif; color: #000000;">
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px; padding: 12px;">
        ${config.wallpapers.map((wp, i) => `
          <div data-index="${i}" style="cursor: pointer; border: 2px solid #000080; border-top: 2px solid #ffffff; border-left: 2px solid #ffffff; border-right: 2px solid #000080; border-bottom: 2px solid #000080; overflow: hidden;" class="gallery-item">
            <img src="${safeSrc(wp)}" style="width: 100%; height: 90px; object-fit: cover;">
            <div style="padding: 4px; text-align: center; font-size: 10px; color: #000000;">${i + 1}</div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
  const win = createWindow("gallery-win", "jynxt - Gallery", content, { left: 100, top: 150, width: "400px" });

  if (win) {
    win.querySelectorAll(".gallery-item").forEach(el => {
      el.addEventListener("click", () => {
        setWallpaper(parseInt(el.dataset.index));
        closeWindow("gallery-win");
      });
    });
  }
}

/* ---------- Music Window -------------------------------------------------- */

function openMusicWindow() {
  const content = `
    <div class="music-window-content" style="font-family: 'Segoe UI', Tahoma, Verdana, sans-serif; color: #000000; padding: 12px;">
      <div style="margin-bottom: 12px; padding: 12px; background: #f0f0f0; border: 2px solid #000080; border-top: 2px solid #ffffff; border-left: 2px solid #ffffff; padding: 0;">
        <div id="music-current" style="font-weight: bold; margin: 0; padding: 8px 12px; color: #000000;">Loading...</div>
        <div id="music-artist" style="color: #666666; font-size: 12px; margin: 0; padding: 0 12px;">Now Playing</div>
      </div>
      <div style="display: flex; gap: 8px; margin-top: auto;">
        <button id="wp-mute" style="width: 20px; height: 20px;">🔊</button>
      </div>
    </div>
  `;

  const win = createWindow("music-win", "jynxt - Music", content, { left: 200, top: 200 });
  if (win) renderTrackToWindow(win);
}

function renderTrackToWindow(win) {
  const title = win.querySelector("#music-current");
  const artist = win.querySelector("#music-artist");
  if (tracks[trackIdx]) {
    if (title) title.textContent = tracks[trackIdx].title;
    if (artist) artist.textContent = tracks[trackIdx].artist;
  }
}

/* ---------- Wallpaper Window ---------------------------------------------- */

function openWallpaperWindow() {
  const content = `
    <div class="wallpaper-selector" style="font-family: 'Segoe UI', Tahoma, Verdana, sans-serif; color: #000000; padding: 12px;">
      <div id="wp-list" style="display: flex; gap: 12px; overflow-x: auto; padding: 12px;">
        ${config.wallpapers.map((wp, i) => `
          <div data-index="${i}" style="min-width: 120px; cursor: pointer; border: 2px solid ${i === wallpaperIdx ? '#0078d7' : '#000080'}; border-top: 2px solid #ffffff; border-left: 2px solid #ffffff; border-right: 2px solid #000080; border-bottom: 2px solid #000080; overflow: hidden;" class="wp-option">
            <img src="${safeSrc(wp)}" style="width: 100%; height: 80px; object-fit: cover;">
            <div style="padding: 4px; text-align: center; font-size: 10px; color: #000000;">${i + 1}</div>
          </div>
        `).join("")}
      </div>
      <button id="wp-apply" style="margin-top: 12px; padding: 6px 16px; background: linear-gradient(180deg, #c0c0c0 0%, #a0a0a0 100%); border: 2px solid #000000; border-top: 2px solid #ffffff; border-left: 2px solid #ffffff; border-right: 2px solid #000080; border-bottom: 2px solid #000080; border-radius: 0; cursor: pointer; font-family: 'Segoe UI', Tahoma, Verdana, sans-serif; font-weight: bold; color: #000000; box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.2);">Apply</button>
    </div>
  `;

  const win = createWindow("wallpaper-win", "jynxt - Wallpaper", content, { left: 150, top: 150 });

  if (win) {
    const applyBtn = win.querySelector("#wp-apply");
    let selected = wallpaperIdx;

    win.querySelectorAll(".wp-option").forEach(el => {
      el.addEventListener("click", () => {
        selected = parseInt(el.dataset.index);
        win.querySelectorAll(".wp-option").forEach(o => {
          o.style.borderColor = "#000080";
          o.style.borderTopColor = "#ffffff";
          o.style.borderLeftColor = "#ffffff";
          o.style.borderRightColor = "#000080";
          o.style.borderBottomColor = "#000080";
        });
        el.style.borderColor = "#0078d7";
        el.style.borderTopColor = "#ffffff";
        el.style.borderLeftColor = "#ffffff";
        el.style.borderRightColor = "#0078d7";
        el.style.borderBottomColor = "#0078d7";
      });
    });

    if (applyBtn) {
      applyBtn.addEventListener("click", () => {
        setWallpaper(selected);
        closeWindow("wallpaper-win");
      });
    }
  }
}

/* ---------- Desktop Icons ------------------------------------------------- */

function initDesktopIcons() {
  const icons = $("#desktop-icons");
  if (!icons) return;

  icons.querySelectorAll(".desktop-item").forEach(icon => {
    icon.addEventListener("dblclick", () => {
      const app = icon.dataset.app;
      if (app === "profile") openProfileWindow();
      else if (app === "gallery") openGalleryWindow();
      else if (app === "music") openMusicWindow();
      else if (app === "wallpaper") openWallpaperWindow();
    });
  });
}

/* ---------- Start Menu --------------------------------------------------- */

function initStartMenu() {
  const startBtn = $("start-btn");
  const startMenu = $("start-menu");

  if (startBtn) {
    startBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      if (startMenu) {
        startMenu.style.display = startMenu.style.display === "block" ? "none" : "block";
      }
    });
  }

  if (startMenu) {
    // Add Annotations menu item if enabled
    if (config.annotations?.enabled) {
      const annotationItem = document.createElement("div");
      annotationItem.className = "menu-item";
      annotationItem.dataset.action = "annotations";
      annotationItem.textContent = "Annotations";
      startMenu.appendChild(annotationItem);
    }

    // Add Message/Inbox menu item if enabled
    if (config.inbox?.enabled) {
      const inboxItem = document.createElement("div");
      inboxItem.className = "menu-item";
      inboxItem.dataset.action = "inbox";
      inboxItem.textContent = "Message";
      startMenu.appendChild(inboxItem);
    }

    // Add About menu item
    const aboutItem = document.createElement("div");
    aboutItem.className = "menu-item";
    aboutItem.dataset.action = "about";
    aboutItem.textContent = "About";
    startMenu.appendChild(aboutItem);

    // Handle menu item clicks
    startMenu.querySelectorAll(".menu-item").forEach(item => {
      item.addEventListener("click", (e) => {
        e.stopPropagation();
        const action = item.dataset.action;
        startMenu.style.display = "none";

        if (action === "profile") openProfileWindow();
        else if (action === "gallery") openGalleryWindow();
        else if (action === "music") openMusicWindow();
        else if (action === "wallpaper") openWallpaperWindow();
        else if (action === "annotations") openAnnotationsWindow();
        else if (action === "inbox") openInboxWindow();
        else if (action === "about") openAboutWindow();
      });
    });

    document.addEventListener("click", (e) => {
      if (!startMenu.contains(e.target) && e.target !== startBtn) {
        startMenu.style.display = "none";
      }
    });
  }
}

/* ---------- Sections Control ---------------------------------------------- */

function activateProfileSection() {
  // Open profile window on login as the default view
  openProfileWindow();
}

/* ---------- Music System -------------------------------------------------- */

function loadMusic() {
  // Try to load from music-metadata.json, fall back to empty array
  tracks = [];
  trackIdx = 0;

  fetch("/music-metadata.json")
    .then(res => res.json())
    .then(data => {
      tracks = data.map(t => ({
        title: t.title || "Unknown",
        artist: t.artist || "Unknown",
        src: t.src || "",
        cover: t.cover || null
      }));
      if (tracks.length > 0 && tracks[0].src) {
        trackIdx = 0;
        renderTrackIsland();
      }
    })
    .catch(err => {
      console.warn("Could not load music metadata, using fallback");
      tracks = [{ title: "No tracks", artist: "Music folder empty", src: "", cover: null }];
    });
}

function renderTrackIsland() {
  if (!tracks[trackIdx]) return;
  const t = tracks[trackIdx];

  const islandTitle = $("island-title");
  const islandArtist = $("island-artist");
  const islandCover = $("island-cover");
  const audioPlayer = $("audio-player");

  if (islandTitle) islandTitle.textContent = t.title || "";
  if (islandArtist) islandArtist.textContent = t.artist || "";

  if (t.cover && islandCover) {
    islandCover.innerHTML = `<img src="${safeSrc(t.cover)}" style="width: 36px; height: 36px; object-fit: cover;">`;
  }

  if (audioPlayer && t.src) {
    audioPlayer.src = t.src;
  }
}

function stepTrack(dir) {
  if (!tracks.length) return;
  trackIdx = (trackIdx + dir + tracks.length) % tracks.length;
  renderTrackIsland();
}

function togglePlay() {
  const audioPlayer = $("#audio-player");
  const playBtn = $("#play-btn");
  if (!audioPlayer || !playBtn) return;

  playing = !playing;
  if (playing) {
    audioPlayer.play().catch(() => {});
  } else {
    audioPlayer.pause();
  }
  playBtn.textContent = playing ? "⏸" : "▶";
}

function initMusicControls() {
  const playBtn = $("play-btn");
  const prevBtn = $("prev-btn");
  const nextBtn = $("next-btn");
  const audioPlayer = $("audio-player");
  const muteBtn = $("mute-btn");
  const islandCover = $("island-cover");
  const wpMute = $("wp-mute");

  if (playBtn) {
    playBtn.addEventListener("click", togglePlay);
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => stepTrack(-1));
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => stepTrack(1));
  }

  if (audioPlayer) {
    audioPlayer.addEventListener("ended", () => stepTrack(1));
  }

  if (muteBtn) {
    muteBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      muted = !muted;
      muteBtn.textContent = muted ? "🔇" : "🔊";
      if (audioPlayer) audioPlayer.muted = muted;
    });
  }

  if (wpMute) {
    wpMute.addEventListener("click", (e) => {
      e.stopPropagation();
      muted = !muted;
      wpMute.textContent = muted ? "🔇" : "🔊";
      if (audioPlayer) audioPlayer.muted = muted;
    });
  }

  if (islandCover) {
    islandCover.addEventListener("click", (e) => {
      e.stopPropagation();
      if (tracks[trackIdx]?.src) {
        window.open(tracks[trackIdx].src, "_blank");
      }
    });
  }
}

/* ---------- Annotation System --------------------------------------------- */

let currentAnnotations = [];
let activeAnnotation = null;

async function loadAnnotations() {
  try {
    const res = await fetch("/config.json", { cache: "no-cache" });
    const cfg = await res.json();
    currentAnnotations = cfg.annotations?.entries || [];

    // Group by song title
    const songs = new Map();
    currentAnnotations.forEach(entry => {
      const key = entry.title;
      if (!songs.has(key)) {
        songs.set(key, {
          id: entry.id,
          title: entry.title,
          artist: entry.artist,
          cover: entry.cover,
          audio: entry.audio,
          annotations: []
        });
      }
      songs.get(key).annotations.push(entry);
    });

    currentAnnotations = Array.from(songs.values());
  } catch (e) {
    console.error("Failed to load annotations:", e);
    currentAnnotations = [];
  }
}

function openAnnotation(entry) {
  activeAnnotation = entry;
  const overlay = $("annotation-overlay");
  const title = $("annotation-title");
  const artist = $("annotation-artist");
  const cover = $("annotation-cover");
  const lyrics = $("annotation-lyrics");
  const text = $("annotation-text");
  const fullLink = $("annotation-full-link");
  const geniusLink = $("annotation-genius-link");

  const annotation = entry.entry || entry;

  if (title) title.textContent = annotation.title || "";
  if (artist) artist.textContent = annotation.artist || "";
  if (text) text.textContent = annotation.annotation || "";

  if (cover) {
    if (annotation.cover) {
      cover.innerHTML = `<img src="${safeSrc(annotation.cover)}" alt="${escapeHtml(annotation.title || "")}" />`;
    } else {
      cover.innerHTML = "";
    }
  }

  // Format lyrics with line breaks
  if (lyrics) {
    const rawLyrics = annotation.lyrics || "";
    const formattedLyrics = rawLyrics.split("\n").map(line => escapeHtml(line)).join("</div><div>");
    lyrics.innerHTML = `<div class="lyrics-container">${formattedLyrics ? `<div>${formattedLyrics}</div>` : ''}</div>`;

    // Set context before/after
    const contextHtml = [];
    if (annotation.before) contextHtml.push(`<div class="context before">${escapeHtml(annotation.before)}</div>`);
    contextHtml.push(`<div class="lyrics">${lyrics.innerHTML}</div>`);
    if (annotation.after) contextHtml.push(`<div class="context after">${escapeHtml(annotation.after)}</div>`);
    lyrics.innerHTML = contextHtml.join("");
  }

  // Set genius link
  if (geniusLink && annotation.geniusUrl) {
    geniusLink.href = annotation.geniusUrl;
    geniusLink.textContent = "View on Genius";
    geniusLink.style.display = "inline-block";
  } else if (geniusLink) {
    geniusLink.style.display = "none";
  }

  // Set full song link - look in fullSongs array from config
  if (fullLink) {
    fullLink.style.display = "none";
    if (annotation.fullSong) {
      fullLink.href = annotation.fullSong.url;
      fullLink.textContent = annotation.fullSong.title;
      fullLink.style.display = "inline-block";
    }
  }

  if (overlay) overlay.classList.add("active");
}

function closeAnnotation() {
  const overlay = $("annotation-overlay");
  if (overlay) overlay.classList.remove("active");
  activeAnnotation = null;
}

function renderAnnotationBrowser() {
  const container = document.getElementById("annotation-list");
  if (!container) return;

  if (!currentAnnotations.length) {
    container.innerHTML = '<div class="no-annotations">No annotations available</div>';
    return;
  }

  container.innerHTML = currentAnnotations.map(song => `
    <div class="annotation-song" data-song="${song.id}">
      <h4 class="song-title">${escapeHtml(song.title)}</h4>
      <p class="song-artist">${escapeHtml(song.artist)}</p>
      <div class="annotation-previews">
        ${song.annotations.map(a => `
          <div class="annotation-preview" data-id="${a.id}">
            <span class="highlight-tag" style="background: ${config.annotations?.highlight || '#ffe94d'};">annotation</span>
            <span class="preview-text">${escapeHtml((a.annotation || "").substring(0, 60))}...</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join("");

  // Add click handlers
  if (container) {
    container.querySelectorAll(".annotation-preview").forEach(el => {
      el.addEventListener("click", () => {
        const id = el.dataset.id;
        const entry = currentAnnotations.flatMap(s => s.annotations).find(a => a.id === id);
        if (entry) {
          openAnnotation({ entry, title: entry.title, artist: entry.artist });
        }
      });
    });
  }

  // Close button
  const closeBtn = $("annotation-close");
  if (closeBtn) closeBtn.addEventListener("click", closeAnnotation);

  // Click outside to close
  const overlay = $("annotation-overlay");
  if (overlay) overlay.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeAnnotation();
  });
}

function openAnnotationsWindow() {
  const content = `
    <div id="annotations-content" style="font-family: 'Segoe UI', Tahoma, Verdana, sans-serif; color: #000000;">
      <div id="annotation-list" style="overflow-y: auto; padding: 12px;"></div>
    </div>
  `;
  createWindow("annotations-win", "jynxt - Annotations", content, { left: 150, top: 150, width: "400px", height: "300px" });
  renderAnnotationBrowser();
}

/* ---------- Inbox Window -------------------------------------------------- */

function openInboxWindow() {
  const inbox = config.inbox || {};
  if (!inbox.enabled) return;

  const content = `
    <div id="inbox-content" style="font-family: 'Segoe UI', Tahoma, Verdana, sans-serif; color: #000000; padding: 12px;">
      <h3 style="margin-bottom: 8px;">${escapeHtml(inbox.title || "Message")}</h3>
      <p style="color: #666666; font-size: 12px; margin-bottom: 12px;">${escapeHtml(inbox.subtitle || "")}</p>
      <div style="background: #f0f0f0; border: 2px solid #000080; border-top: 2px solid #ffffff; border-left: 2px solid #ffffff; padding: 12px;">
        <form id="inbox-form" target="_blank" action="${safeHref(inbox.profileUrl)}" method="POST">
          <textarea name="message" placeholder="${escapeHtml(inbox.placeholder || "Send a message...")}" rows="4" style="width: 100%; margin-bottom: 12px; padding: 8px; border: 2px solid #000080; background: #ffffff; color: #000000; resize: vertical;"></textarea>
          <button type="submit" style="width: 100%; padding: 8px; background: linear-gradient(180deg, #c0c0c0 0%, #a0a0a0 100%); border: 2px solid #000000; border-top: 2px solid #ffffff; border-left: 2px solid #ffffff; color: #000000; font-weight: bold; cursor: pointer;">${escapeHtml(inbox.submitLabel || "Submit")}</button>
        </form>
      </div>
    </div>
  `;
  createWindow("inbox-win", "jynxt - Message", content, { left: 200, top: 200, width: "350px" });
}

/* ---------- About Window -------------------------------------------------- */

function openAboutWindow() {
  const about = config.about || {};
  const content = `
    <div id="about-content" style="font-family: 'Segoe UI', Tahoma, Verdana, sans-serif; color: #000000; padding: 12px;">
      <h1 style="margin-bottom: 16px; font-size: 18px;">${escapeHtml(about.title || "About")}</h1>
      <div style="background: #f0f0f0; border: 2px solid #000080; border-top: 2px solid #ffffff; border-left: 2px solid #ffffff; padding: 12px;">
        <p style="margin: 0 0 12px; color: #000000;">${escapeHtml(about.text || "")}</p>
        <p style="margin: 0; color: #666666; font-size: 12px;">Site: ${escapeHtml(config.site?.title || "jynxt")}</p>
      </div>
    </div>
  `;
  createWindow("about-win", "jynxt - About", content, { left: 150, top: 150 });
}

/* ---------- Quick Launch -------------------------------------------------- */

function initQuickLaunch() {
  const quickLaunch = $(".quick-launch");
  if (!quickLaunch) return;

  quickLaunch.addEventListener("dblclick", (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick launch placeholder - could be configured for favorite apps
    openProfileWindow();
  });
}

/* ---------- Last.fm Widget ------------------------------------------------ */

async function loadLastFm() {
  const lastfm = config.lastfm;
  if (!lastfm?.enabled || !lastfm.username) return;

  try {
    const res = await fetch(`https://last.fm/api/active_records?user=${encodeURIComponent(lastfm.username)}`, { mode: 'cors' });
    if (!res.ok) throw new Error("Last.fm API error");

    const data = await res.json();
    // Process Last.fm data if available
    console.log("Last.fm data loaded:", data);
  } catch (e) {
    console.warn("Could not load Last.fm data:", e.message);
  }
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
  initQuickLaunch();

  // Initialize annotations browser (for when window is opened)
  loadAnnotations();

  // Initialize Last.fm widget
  loadLastFm();

  if (PREVIEW) {
    document.body.classList.add("entered");
    activateProfileSection();
    return;
  }
}

boot();