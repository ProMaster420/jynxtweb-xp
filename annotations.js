/* ==========================================================================
   jynxt - Lyric Annotation System (Genius-style)
   Interactive annotation browsing with audio synchronization
   ========================================================================== */

const $ = (id) => document.getElementById(id);

// State
let currentAnnotations = [];
let activeAnnotation = null;

/* ---------- load configuration -------------------------------------------- */

async function loadAnnotations() {
  try {
    const res = await fetch("/config.json", { cache: "no-cache" });
    const config = await res.json();
    currentAnnotations = config.annotations?.entries || [];

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

function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, m => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  }[m]));
}

/* ---------- open annotation browser --------------------------------------- */

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

  title.textContent = entry.entry?.title || entry.title || "";
  artist.textContent = entry.entry?.artist || entry.artist || "";

  const annotation = entry.entry || entry;
  text.textContent = annotation.annotation || "";

  if (annotation.cover) {
    cover.innerHTML = `<img src="${annotation.cover}" alt="${escapeHtml(entry.entry?.title || entry.title || "")}" />`;
  } else {
    cover.innerHTML = "";
  }

  // Format lyrics with line breaks
  const rawLyrics = annotation.lyrics || "";
  const formattedLyrics = rawLyrics.split("\n").map(line => escapeHtml(line)).join("</div><div>");
  lyrics.innerHTML = `<div class="lyrics-container">${formattedLyrics ? `<div>${formattedLyrics}</div>` : ''}</div>`;

  // Set context before/after
  const contextHtml = [];
  if (annotation.before) contextHtml.push(`<div class="context before">${escapeHtml(annotation.before)}</div>`);
  contextHtml.push(`<div class="lyrics">${lyrics.innerHTML}</div>`);
  if (annotation.after) contextHtml.push(`<div class="context after">${escapeHtml(annotation.after)}</div>`);
  lyrics.innerHTML = contextHtml.join("");

  // Set genius link
  if (annotation.geniusUrl) {
    geniusLink.href = annotation.geniusUrl;
    geniusLink.textContent = "View on Genius";
    geniusLink.style.display = "inline-block";
  } else {
    geniusLink.style.display = "none";
  }

  // Set full song link - look in fullSongs array from config
  fullLink.style.display = "none";

  overlay.style.display = "flex";
}

function closeAnnotation() {
  const overlay = $("annotation-overlay");
  overlay.style.display = "none";
  activeAnnotation = null;
}

/* ---------- annotation browser UI ------------------------------------------ */

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
            <span class="highlight-tag">annotation</span>
            <span class="preview-text">${escapeHtml((a.annotation || "").substring(0, 60))}...</span>
          </div>
        `).join('')}
      </div>
    </div>
  `).join("");

  // Add click handlers
  container.querySelectorAll(".annotation-preview").forEach(el => {
    el.addEventListener("click", () => {
      const id = el.dataset.id;
      const entry = currentAnnotations.flatMap(s => s.annotations).find(a => a.id === id);
      if (entry) {
        openAnnotation({ entry, title: entry.title, artist: entry.artist });
      }
    });
  });

  // Close button
  $("annotation-close")?.addEventListener("click", closeAnnotation);

  // Click outside to close
  $("annotation-overlay")?.addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeAnnotation();
  });
}

/* ---------- Initialize --------------------------------------------------- */

function initAnnotations() {
  // Load and render annotations
  loadAnnotations().then(() => {
    renderAnnotationBrowser();
  });
}

/* ---------- Event handlers ------------------------------------------------ */

// Called when user clicks the "look closer" button
function startAnnotations() {
  loadAnnotations().then(() => {
    // Show first song's annotations
    if (currentAnnotations.length > 0) {
      const firstSong = currentAnnotations[0];
      openAnnotation({
        entry: firstSong,
        title: firstSong.title,
        artist: firstSong.artist
      });
    }
  });
}

/* ---------- Global exports ------------------------------------------------- */

window.initAnnotations = initAnnotations;
window.startAnnotations = startAnnotations;
window.openAnnotation = openAnnotation;
window.closeAnnotation = closeAnnotation;