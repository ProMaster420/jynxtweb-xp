# jynxt — A Windows XP-Style Personal Website

A modern, interactive music website presented as a Windows XP desktop environment.

## Live Site

Visit: `https://jynxt.vercel.app` (when deployed)

## About

This is a personal website that replicates the experience of using a Windows XP computer, showcasing my music interests, social profiles, and creative annotations on lyrics.

## Development

### Prerequisites
- Node.js (for Vercel deployment)
- Python 3 (for local development server)
- Git

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd jynxtweb-xp

# Start local development server
python -m http.server 8000
# or
npx serve
```

### Project Structure

```
jynxtweb-xp/
├── admin/          # Admin panel
├── api/            # Backend API endpoints
├── assets/         # Static images and media
├── Music/          # Music files for annotations
├── annotations-audio/ # Short audio clips for lyric sync
├── docs/           # Project documentation
├── index.html      # Main entry point
├── script.js       # Main application logic
├── styles.css      # Styling
├── config.json     # Site configuration
└── vercel.json     # Deployment config
```

## Features

- **Windows XP Desktop**: Authentic desktop environment with wallpaper
- **Music Player**: HTML5 audio player with shuffle and playlist
- **Lyric Annotations**: Genius-style annotated song lyrics with timing sync
- **Last.fm Integration**: Currently playing track from your Last.fm account
- **NGL.link Inbox**: Anonymous message collection
- **Admin Dashboard**: Configuration editing with live preview

## Configuration

Edit `config.json` to customize:

```json
{
  "theme": {
    "font": "system",
    "accent": "#ffffff",
    "blur": 20,
    "overlay": 0.2,
    "radius": 32
  }
}
```

## Deployment

This project is designed for Vercel deployment:

1. Push to GitHub
2. Connect to Vercel
3. Set environment variables:
   - `LASTFM_API_KEY` - Your Last.fm API key
4. Deploy

## Required Credentials

Before deployment, you'll need:

| Credential | How to get |
|------------|-----------|
| Last.fm API key | [Last.fm API](https://www.last.fm/api) |
| ngl.link subdomain | Set up at [ngl.link](https://ngl.link) |
| Admin password | Update `admin/auth.json` |

## Development Roadmap

- [x] Core desktop environment
- [x] Login screen
- [x] Profile card
- [x] Music player
- [ ] Wallpaper selector
- [ ] Gallery
- [ ] Start menu
- [ ] Proper authentication
- [ ] Production-ready admin

## License

- Code: MIT License
- Windows XP Assets: Microsoft Corporation (used under fair use for personal/educational purposes)

## Acknowledgments

Built with inspiration from:
- Windows XP interface design
- Genius lyric annotations
- Last.fm music tracking

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)