# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **personal music website** (jynxt) built as an interactive Windows XP-style desktop environment. Users navigate through windows, icons, and applications in a desktop metaphor.

## Repository Structure

```
jynxtweb-xp/
├── docs/                          # Project documentation
│   ├── asset-inventory.md        # Windows XP UI assets inventory
│   ├── content-migration.md      # Content from original site
│   └── missing-dependencies.md   # Required credentials & assets
├── assets/optimized/             # WebP-optimized images
│   ├── avatars/                   # Profile images
│   ├── icons/                     # Social icons
│   └── wallpapers/                # Desktop backgrounds
├── assets/uploads/                 # User annotation artwork
├── api/                            # Server endpoints
├── admin/                          # Admin panel
├── Music/                           # Music files
├── annotations-audio/              # Annotation audio clips
├── index.html                      # Main entry point
├── script.js                       # Main client logic
├── styles.css                      # Main styles
├── config.json                     # Site configuration
└── vercel.json                     # Deployment config
```

## Core Architecture

This is a client-side SPA with Windows XP desktop metaphor:
- HTML5 audio player for music playback
- JSON configuration-driven content
- localStorage/IndexedDB for persistence
- No backend required (except for API endpoints)

## Development Commands

```bash
# Local development server
python -m http.server 8000

# Or with Node.js
npx serve

# Git workflow
git add .
git commit -m "message"
git push
```

## Theme System

Theme values from `config.json`:
- font: System font stack
- accent: "#ffffff" (highlight color)
- overlay: 0.2 (glass opacity)
- blur: 20 (glass blur radius)
- radius: 32 (card border radius)

## File Organization

- `assets/optimized/` - WebP images (avatars, icons, wallpapers)
- `assets/uploads/` - User annotation artwork
- `Music/` - Music files for annotations
- `annotations-audio/` - Short audio clips for lyric sync