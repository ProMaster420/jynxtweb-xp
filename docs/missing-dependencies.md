# 🔍 Missing Dependencies & Resources

This document tracks the dependencies, credentials, and resources needed for the jynxt website project.

## 🔐 Required API Credentials

### 1. Last.fm API
**Purpose:** Currently playing track integration
**Endpoint:** api/nowplaying.js
**Required:**
- [ ] Last.fm API Key
- [ ] Last.fm username: ProMaster420

**Usage:**
- Poll for currently playing track
- Display in profile header
- Update track metadata

### 2. ngl.link Integration
**Purpose:** Anonymous message inbox
**Endpoint:** api/message.js, api/ngl.js
**Required:**
- [ ] Custom ngl.link subdomain (e.g., ngl.link/jynxt__)

**Configuration in config.json:**
```json
"inbox": {
  "provider": "ngl",
  "profileUrl": "https://ngl.link/jynxt__"
}
```

### 3. Spotify API (Optional Enhancement)
**Purpose:** Enhanced music features
**Required:**
- [ ] Spotify API Client ID
- [ ] Spotify API Client Secret

## 🎵 Music Assets

### Required Files:
- [ ] music-metadata.json - Playlist in JSON format
- [ ] Local MP3/FLAC files in Music/ directory for annotation audio
- [ ] Cover art in assets/uploads/ (already partially present)

## 🖼️ Assets to Generate/Migrate

### From Windows XP Assets Collection:
- [ ] Convert selected wallpapers to WebP format
- [ ] Optimize profile avatars (3 existing in reference)
- [ ] Optimize social icons (6 existing in reference)
- [ ] Generate twitch icon (referenced but missing)

## 🌐 Infrastructure Requirements

### Deployment Platform:
- [ ] Vercel account
- [ ] Custom domain configuration

### Git Repository:
- [ ] GitHub repository created
- [ ] Initial commit with reference content

## 🔧 Development Tools

### Required:
- [ ] Node.js (for Vercel deployment)
- [ ] Python 3 (for metadata scripts)
- [ ] Git

## 📋 Content Generation Tasks

### Before Launch:
- [ ] Generate proper config.json
- [ ] Create music-metadata.json playlist
- [ ] Configure admin panel password (auth.json)
- [ ] Set up sync_meta.py

## 🎨 Theme Configuration Options

| Setting | Default | Description |
|---------|---------|-------------|
| font | system | System font stack |
| accent | #ffffff | Accent/wireframe color |
| overlay | 0.2 | Glass effect opacity |
| blur | 20 | Glass blur radius |
| radius | 32 | Card border radius |

## 🚀 Quick Setup Checklist

1. Create Vercel project linked to GitHub repo
2. Add environment variables:
   - LASTFM_API_KEY
   - LASTFM_USERNAME (if different from config)
3. Place admin password in admin/auth.json
4. Upload music files to Music/
5. Deploy and test all integrations
6. Update config.json with live URLs