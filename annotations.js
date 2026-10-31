/* ==========================================================================
   jynxt - Lyric Annotation System (Genius-style)
   Interactive annotation browsing with audio synchronization
   ========================================================================== */

import { fontStack } from "/fonts.js";

const $ = (id) => document.getElementById(id);

// State
let annotationsData = null;
let currentAnnotations = [];
let activeAnnotation = null;
let musicRef = null;

/* ---------- load configuration -------------------------------------------- */

async function loadAnnotations() {
  try {
    const res = await fetch("/config.json", { cache: "no-cache" });
    const config = await res.json();
    annotationsData = config.annotations;
    currentAnnotations = config.annotations.entries || [];

    // Sort by title/artist
    currentAnnotations.sort((a, b) => {
      const sortA = (a.title + a.artist).toLowerCase();
      const sortB = (b.title + b.artist).toLowerCase();
      return sortA.localeCompare(sortB);
    });

    // Remove duplicates, keeping the last one for each title
    const seen = new Set();
    currentAnnotations = currentAnnotations.filter(entry => {
      const key = entry.title + "|" + entry.artist;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).reverse(); // Most recent first

  } catch (e) {
    console.error("Failed to load annotations:", e);
    currentAnnotations = [];
  }
}

/* ---------- annotation display ---------------------------------------------- */

function renderAnnotationList() {
  const container = document.getElementById("annotation-list");
  if (!container || !currentAnnotations.length) return;

  container.innerHTML = currentAnnotations.map(entry => `
    <div class="annotation-item" data-id="${entry.id}">
      <h4>${escapeHtml(entry.title)}</h4>
      <p class="artist">${escapeHtml(entry.artist)}</p>
    </div>
  `).join("");

  container.querySelectorAll(".annotation-item").forEach(el => {
    el.addEventListener("click", () => {
      const id = el.dataset.id;
      const entry = currentAnnotations.find(e => e.id === id);
      if (entry) openAnnotation(entry);
    });
  });
}

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#039;"
  }[m]));
}

function openAnnotation(entry) {
  const overlay = $("annotation-overlay");
  const title = $("annotation-title");
  const artist = $("annotation-artist");
  const cover = $("annotation-cover");
  const lyrics = $("annotation-lyrics");
  const text = $("annotation-text");
  const fullLink = $("annotation-full-link");
  const geniusLink = $("annotation-genius-link");

  title.textContent = entry.title;
  artist.textContent = entry.artist;
  text.textContent = entry.annotation || "";

  if (entry.cover) {
    cover.innerHTML = `<img src="${entry.cover}" alt="${entry.title}" />`;
  } else {
    cover.innerHTML = "";
  }

  // Format lyrics with line breaks
  const formattedLyrics = (entry.lyrics || "").split("\\n").map(line => `<div>${escapeHtml(line)}</div>`).join("");
  lyrics.innerHTML = `<div class="lyrics-container">${formattedLyrics}</div>`;

  // Set context before/after
  const contextHtml = [];
  if (entry.before) contextHtml.push(`<div class="context before">${escapeHtml(entry.before)}</div>`);
  contextHtml.push(`<div class="lyrics">${formattedLyrics}</div>`);
  if (entry.after) contextHtml.push(`<div class="context after">${escapeHtml(entry.after)}</div>`);
  lyrics.innerHTML = contextHtml.join("");

  // Highlight current line based on audio time
  highlightCurrentLine(0);

  // Set links
  if (entry.geniusUrl) {
    geniusLink.href = entry.geniusUrl;
    geniusLink.textContent = "View on Genius";
    geniusLink.style.display = "inline-block";
  } else {
    geniusLink.style.display = "none";
  }

  if (entry.fullSongs && entry.fullSongs.length > 0) {
    const fullSong = entry.fullSongs.find(s => s.title.toLowerCase().includes(entry.title.toLowerCase()));
    if (fullSong) {
      fullLink.href = fullSong.url;
      fullLink.textContent = `Listen to full song on ${fullSong.artist}`;
      fullLink.style.display = "inline-block";
    } else {
      fullLink.style.display = "none";
    }
  } else {
    fullLink.style.display = "none";
  }

  overlay.style.display = "flex";
}

function highlightCurrentLine(time) {
  if (!activeAnnotation || !musicRef) return;
  const audio = musicRef.audio;
  if (!audio) return;

  const currentTime = audio.currentTime;
  const start = activeAnnotation.startTime || 0;
  const end = activeAnnotation.endTime || 0;

  // Check if current time is within annotation range
  if (currentTime >= start && (end === 0 || currentTime <= end)) {
    // Highlight appropriate line
    const lines = document.querySelectorAll(".lyrics-container > div");
    lines.forEach((line, i) => {
      line.classList.remove("highlight");
    });

    // Calculate which line should be highlighted
    const lyricLines = (activeAnnotation.lyrics || "").split("\\n").length;
    if (lyricLines > 0) {
      const lineIndex = Math.floor((currentTime - start) / ((end - start) / lyricLines)) % lyricLines;
      if (lines[lineIndex]) {
        lines[lineIndex].classList.add("highlight");
      }
    }
  }
}

/* ---------- close annotation ---------------------------------------------- */

function closeAnnotation() {
  const overlay = $("annotation-overlay");
  overlay.style.display = "none";
  activeAnnotation = null;
}

/* ---------- initialize ---------------------------------------------------- */

function initAnnotations() {
  // Load annotation data
  loadAnnotations().then(() => {
    renderAnnotationList();
  });

  // Close button
  $("annotation-close").addEventListener("click", closeAnnotation);

  // Click outside to close
  $("annotation-overlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) {
      closeAnnotation();
    }
  });

  // Set up music time sync
  setInterval(() => {
    if (activeAnnotation) {
      highlightCurrentLine();
    }
  }, 500);
}

/* ---------- start annotation browsing ------------------------------------- */

function startAnnotations() {
  const overlayBtn = $("annot-open");

  if (!overlayBtn) return;

  overlayBtn.addEventListener("click", async () => {
    await loadAnnotations();
    renderAnnotationList();
    document.getElementById("annotation-gallery").style.display = "block";
    document.getElementById("annotation-list").style.display = "block";
  });
}

/* ---------- module exports ------------------------------------------------ */

window.startAnnotations = startAnnotations;
window.initAnnotations = initAnnotations;
window.openAnnotation = openAnnotation;
window.closeAnnotation = closeAnnotation;