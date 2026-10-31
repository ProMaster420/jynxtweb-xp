# 📦 Asset Inventory: Windows XP UI Assets

This directory contains an unofficial collection of UI assets extracted from various versions of Microsoft Windows (XP through 11). These assets are provided for archival, educational, and personal use.

## 📂 Directory Structure

```
windows xp ui assets/
├── Cursors/Windows XP/          - Cursor (.cur) and animated cursor (.ani) files
├── Icons/Windows XP/            - Icon files from shell32.dll and imageres.dll
├── README.md                    - Overview and licensing information
├── Sounds/Windows XP/           - WAV and MIDI system sounds
├── Tables/                      - Documentation tables
│   ├── Windows XP Icons.md     - 338 icons from shell32.dll indexed
│   └── Windows XP Wallpapers.md - 30+ desktop wallpaper thumbnails
└── Wallpapers/Windows XP/       - Full desktop wallpaper images
```

## 🖱️ Cursors (Cursors/Windows XP/)

### Windows XP Cursor Files (.cur)
- Standard arrows, I-beams, waiting cursors, and busy indicators
- Directional cursors (nwse, nesw, etc.)
- Resize cursors (all directions)
- Move, help, and context-specific cursors
- Animated cursors (.ani): busy, loading, and special effects

**Common usage patterns:**
- `3dgn*.cur` / `3dgn*.ani` - 3D group navigation
- `arrow_*.cur` - Standard arrow cursors (directional variants)
- `beam_i.cur` - I-beam text selection
- `move_i.cur` - Move cursor
- `help_i.cur` - Help cursor
- `appstart.ani` / `appstar*.ani` - Application startup animations

### Animated Cursors (.ani)
- `dinosau2.ani`, `dinosaur.ani` - Dinosaur-themed
- `horse.ani` - Horse animation
- `metronom.ani` - Metronome/beat animation
- `stopwtch.ani` - Stopwatch/timer animation
- `wagtail.ani` - Flying bird animation

## 🎯 Icons (Icons/Windows XP/)

### From `shell32.dll` (338 icons, indexed 1-338+)
The `Windows XP Icons.md` table documents 338 icons extracted from `shell32.dll`. These are the standard system icons used throughout Windows XP interface:

- Icons 1-50: Basic system and navigation icons
- Icons 51-100: File type and device icons
- Icons 101-150: Extended system functions
- Icons 151-200: More system and device categories
- Icons 201-258: Additional system functions
- Icons 259-303: Further system categories
- Icons 304-338: Final system icons

### From `imageres.dll`
Additional icon resources stored separately (not fully tabulated in this repo).

**Typical icon sizes:** 16×16, 32×32, 48×48 pixels (Windows XP standard)

## 🖼️ Wallpapers (Wallpapers/Windows XP/)

### Desktop Wallpaper Collection
Documented in `Tables/Windows XP Wallpapers.md` with 30+ desktop wallpairs including:

| Wallpaper | Path |
|-----------|------|
| Bliss.bmp | `%WINDIR%\Web\Wallpaper\Bliss.bmp` |
| Windows XP.jpg | `%WINDIR%\Web\Wallpaper\Windows%20XP.jpg` |
| Ascent.jpg | `%WINDIR%\Web\Wallpaper\Ascent.jpg` |
| Autumn.jpg | `%WINDIR%\Web\Wallpaper\Autumn.jpg` |
| Azul.jpg | `%WINDIR%\Web\Wallpaper\Azul.jpg` |
| Crystal.jpg | `%WINDIR%\Web\Wallpaper\Crystal.jpg` |
| ...and many more (Fondo, Friend, Home, Moon flower, Peace, Power, Purple flower, Radiance, Red moon desert, Ripple, Stonehenge, Tulips, Vortec space, Wind) |

**Common resolutions:** 640×480, 800×600, 1024×768 (native Windows XP resolutions)

## 🔊 Sounds (Sounds/Windows XP/)

### System Sound Effects (28+ WAV and MIDI files)

| Sound File | Description |
|------------|-------------|
| `start.wav` | System startup sound |
| `ding.wav` | General ding/notification |
| `chord.wav` | Chord progression |
| `chimes.wav` | Chime sounds |
| `notify.wav` | Notification alert |
| `Windows XP Ding.wav` | XP-specific ding |
| `Windows XP Error.wav` | Error sound |
| `Windows XP Exclamation.wav` | Warning/exclamation |
| `Windows XP Information Bar.wav` | Info bar notification |
| `Windows XP Pop-up Blocked.wav` | Pop-up blocker sound |
| `Windows XP Critical Stop.wav` | Critical error stop |
| `Windows XP Hardware Fail.wav` | Hardware failure |
| `Windows XP Hardware Insert.wav` | Hardware insert |
| `Windows XP Hardware Remove.wav` | Hardware remove |
| `Windows XP Minimize.wav` | Minimize effect |
| `Windows XP Menu Command.wav` | Menu command selection |
| `Windows XP Print complete.wav` | Print completion |
| `Windows XP Recycle.wav` | Recycle bin action |
| `Windows XP Restore.wav` | System restore |
| `Windows XP Ringin.wav` / `Windows XP Ringout.wav` | Phone ring |
| `Windows XP Start.wav` | Start menu open |
| `Windows XP Shutdown.wav` | System shutdown |
| `Windows XP Logon Sound.wav` | User logon |
| `Windows XP Logoff Sound.wav` | User logoff |
| `Windows XP Default.wav` | Default system sound |
| `flourish.mid` | MIDI flourish |
| `onestop.mid` | MIDI one-stop |
| `town.mid` | MIDI town theme |

**Formats:** WAV (digital audio) and MIDI (procedural/sequential)

## 📄 Documentation Files

- `Tables/Windows XP Wallpapers.md` - Tabular listing of wallpaper thumbnails with file paths
- `Tables/Windows XP Icons.md` - Tabular listing of 338 icons from shell32.dll with indices
- `README.md` - Overview, licensing, and source information

## ⚠️ Legal Notice

All trademarks, images, and sounds are the property of **Microsoft Corporation**. These resources are provided for archival, educational, and personal use only. Commercial use may violate Microsoft's EULA.

- Repository structure and Markdown files: **MIT License**
- Graphical and audio materials: Subject to Microsoft's original licensing terms
- This repository does not claim ownership of any Microsoft content

## 💡 Suggested Usage in Web Projects

While these are Windows system assets, they can be referenced in web development contexts for:

- **Retro/futuristic UI themes** - Windows XP aesthetic web interfaces
- **Educational demonstrations** - Operating system history
- **System tooling** - Reference for system iconography
- **Archival projects** - Preserving Windows UI history

**Note:** Direct use of copyrighted Microsoft assets in public-facing websites may require licensing. Consider creating inspired-by designs rather than direct asset usage.