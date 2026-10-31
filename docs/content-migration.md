# 📋 Content Migration Guide

This document outlines the content and functionality from the original jynxt website that should be migrated to the new project.

## 🎵 Music Metadata System

### Source: `reference/jynxtweb/music-metadata.json`
- Playlist metadata in JSON format
- Track entries with title, artist, URL
- Should be preserved in the new Music/ directory

### Playback System
- HTML5 audio element with autoplay and shuffle capabilities
- Track progression with next/previous controls
- Persistent playback state in browser

## 📝 Annotation System

### Source: `reference/jynxtweb/annotations.js` / `annotations.css`
The annotation system provides a unique "look closer" experience where users can explore annotated song lyrics.

**Features:**
- Interactive song-by-song annotations
- Timestamp-based lyric highlighting
- Context: before/after annotation sections
- Full song links (YouTube)
- Audio playback synchronization
- Visual highlighting (configurable color in config.json)

**Annotations Structure** (from config.json):
```json
{
  "id": "entry-xxxxx",
  "title": "song title",
  "artist": "artist name",
  "cover": "/assets/uploads/cover.webp",
  "audio": "annotations-audio/filename.mp3",
  "startTime": 123,
  "endTime": 456,
  "before": "context before",
  "lyrics": "lyrics snippet",
  "after": "context after",
  "annotation": "personal annotation",
  "geniusUrl": "https://genius.com/..."
}
```

**Annotation Entries from config.json:**
1. "bandaids" by keshi
2. "Who Knows" by Daniel Caesar
3. "SUMMER 2016" by DC The Don
4. "MISS ME" by keshi (multiple entries for same song)
5. "FTC (F*** The Club)" by Joji (multiple entries)
6. "Preach" by DC The Don (multiple entries)

## 🌐 Site Configuration Structure

### Source: `reference/jynxtweb/config.json`

**Main Configuration Sections:**

#### `site`
- `title`: Site title (used in meta tags)
- `description`: Site description (meta tags)

#### `profile`
- `name`: Display name (e.g., "jynxt")
- `tagline`: Profile tagline
- `avatar`: Avatar image path

#### `about`
- `title`: About section title
- `text`: About section content

#### `links`
Array of social links:
```json
{
  "title": "Platform name",
  "url": "https://...",
  "icon": "/assets/optimized/icons/xxx.webp"
}
```

**Configured links:**
- Instagram
- Spotify
- Last.fm
- Genius
- Steam
- YouTube

#### `wallpapers`
Array of wallpaper image paths for background rotation

#### `inbox`
Message collection system:
- `enabled`: Boolean
- `provider`: "ngl" or "webhook"
- `profileUrl`: ngl.link URL
- `title` / `subtitle`: Display text
- `placeholder`: Message input placeholder
- `submitLabel`: Button text
- `maxLength`: Character limit

#### `lastfm`
Last.fm integration:
- `enabled`: Boolean
- `username`: Last.fm username

#### `theme`
Visual theme configuration:
- `font`: System font stack or custom
- `accent`: Accent color (HTML/CSS)
- `overlay`: Glass effect opacity (0-1)
- `blur`: Glass blur radius (px)
- `radius`: Card border radius (px)

#### `music`
Music player settings:
- `autoplay`: Boolean
- `shuffle`: Boolean

#### `library`
Assets library (avatars, icons, wallpapers for admin)

#### `annotations`
Full annotation configuration:
- `enabled`: Boolean
- `buttonLabel`: "look closer :)" text
- `title`: "jy's world"
- `highlight`: "#ffe94d" (highlight color)
- `autoplay`: Boolean
- `fullLabel`: "listen to the full song"
- `fullSongs`: Array of YouTube links
- `entries`: Array of annotation entries

## 🎨 Styles and Visual Design

### Source: `reference/jynxtweb/styles.css`
- Liquid glass (frosted glass) effect
- CSS custom properties for theming
- Responsive design
- Vignette background overlay
- Spotlight/pointer effects
- Mobile-friendly layout

### Key Design Features:
- Dark theme background (#05060a)
- Glass-morphism cards
- Custom cursor effects
- Smooth transitions and animations
- CSS variables for runtime theming

## 🛠️ Admin Panel

### Source: `reference/jynxtweb/admin/`
Complete admin panel system for editing the site:

**Files:**
- `index.html` - Admin UI shell
- `admin.js` - Main admin logic
- `admin.css` - Admin panel styles
- `lock.js` - Authentication
- `auth.json` - Password hash storage

**Features:**
- Password-protected admin access
- Draft editing (changes saved to localStorage/IndexedDB)
- Live preview in iframe
- Import/Export configuration
- Export as .zip for deployment
- Message inbox implementation

## 🔌 API Endpoints

### Source: `reference/jynxtweb/api/`

#### `api/message.js`
- Incoming message webhook endpoint
- Handles ngl.link message forwarding

#### `api/ngl.js`
- NGL.link integration
- Message polling/handling

#### `api/nowplaying.js`
- Currently playing detection
- Last.fm integration

## 📁 Asset Organization

### Original Site Structure:
```
reference/jynxtweb/
├── assets/
│   ├── optimized/
│   │   ├── avatars/*.webp
│   │   ├── icons/*.webp
│   │   └── wallpapers/*.webp
│   └── uploads/
│       (user annotation artwork)
├── Music/
│   (local music files for annotations)
├── admin/
│   (admin panel files)
├── api/
│   (server-side endpoints)
├── index.html         (main entry point)
├── script.js          (main client logic)
├── styles.css         (main styles)
├── annotations.js     (annotations feature)
├── fonts.js           (font loading)
├── config.json        (main configuration)
└── music-metadata.json (playlist data)
```

## ⚙️ Development/Deployment Setup

### `vercel.json`
Deployment configuration for Vercel hosting with:
- Routing configuration
- Edge functions

### `sync_meta.py`
- Generates social media metadata (title/description/og:image)
- Updates meta tags based on config.json

### `generate_music_metadata.py`
- Python script to auto-generate music-metadata.json
- Reads tags from local music files

## 🎯 Key Functionalities to Preserve

1. **Personal music website with embedded player**
2. **Last.fm integration for currently playing tracking**
3. **Annotation system with lyric highlighting**
4. **Social link integration with custom icons**
5. **Glass-morphism UI with spotlight effects**
6. **NGL.link message inbox**
7. **Admin panel for configuration editing**
8. **Wallpaper background rotation**
9. **Theme customization (font, colors, effects)**
10. **Mobile-responsive design**

## 📋 Missing Dependencies/Resources Needed

### API Credentials Required:
- **Last.fm API key** - For now playing integration
- **nGl.link custom subdomain** - For message inbox (e.g., ngl.link/jynxt__)
- **Spotify API credentials** (optional) - For enhanced music features

### External Services:
- **Vercel account** - For deployment
- **GitHub repository** - For version control and deployment
- **YouTube API** - For full song links (currently used directly)

### Assets to Convert/Generate:
- Audio file hosting path (local /Music/ or external streaming)
- Cover art conversion to webp format
- Icon optimization from Windows XP collection

## 🚀 Deployment Strategy

1. Configuration lives in `config.json`
2. Assets deployed to `assets/` and `Music/` directories
3. Admin panel at `/admin/` path
4. API endpoints at `/api/` path
5. Vercel handles deployment with custom domain