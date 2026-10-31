/* ==========================================================================
   jynxt API - Last.fm Now Playing
   Endpoint to fetch currently playing track from Last.fm API
   ========================================================================== */

// Last.fm API configuration
// API key needs to be set via environment variable or config
const LASTFM_USERNAME = "ProMaster420";
const LASTFM_API_KEY = process.env.LASTFM_API_KEY || "YOUR_API_KEY_HERE";

// Fetch currently playing track
async function getNowPlaying() {
  if (!LASTFM_API_KEY || LASTFM_API_KEY === "YOUR_API_KEY_HERE") {
    console.warn("Last.fm API key not configured");
    return null;
  }

  const url = new URL("http://ws.audioscrobbler.com/2.0/");
  url.searchParams.set("method", "user.getrecenttracks");
  url.searchParams.set("user", LASTFM_USERNAME);
  url.searchParams.set("api_key", LASTFM_API_KEY);
  url.searchParams.set("format", "json");
  url.searchParams.set("limit", "1");

  try {
    const response = await fetch(url.toString());
    const data = await response.json();

    if (data.recenttracks && data.recenttracks.track && data.recenttracks.track.length > 0) {
      const track = data.recenttracks.track[0];

      // Check if currently playing
      const nowPlaying = track["@attr"] && track["@attr"].nowplaying;

      return {
        title: track.name,
        artist: track.artist["#text"],
        album: track.album["#text"],
        cover: track.image ? track.image[track.image.length - 1]["#text"] : null,
        nowPlaying: !!nowPlaying,
        url: track.url
      };
    }
  } catch (error) {
    console.error("Error fetching now playing:", error);
  }

  return null;
}

export { getNowPlaying, LASTFM_USERNAME };