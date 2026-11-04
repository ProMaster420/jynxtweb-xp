# Windows XP Luna Theme Specification

This document provides pixel-perfect specifications for authentic Windows XP Luna theme interface design, with analysis of how the current jynxt implementation compares to and differs from the authentic XP Luna style.

## 1. Color Palette - Exact Luna Colors

### Primary Luna Blue
| Element | Authentic XP Luna | Current jynxt | Notes |
|---------|------------------|---------------|-------|
| Luna Blue (Primary accent) | `#0078D7` | `#0078d7` | Exact match - this is the official Windows XP Luna blue |
| Luna Blue (Darker variant) | `#005A9E` | `#005a9e` | For gradients and shadows |

### Window Colors
| Element | Authentic XP Luna | Current jynxt | Notes |
|---------|------------------|---------------|-------|
| Window Background | `#F0F0F0` | `#F0F0F0` | EXACT MATCH |
| Window Border (outer) | `#000080` (Navy) | `#000080` | EXACT MATCH |
| Window Border (inner highlight) | `#FFFFFF` (White) | `#FFFFFF` | EXACT MATCH |

### Title Bar Colors
| Element | Authentic XP Luna | Current jynxt | Notes |
|---------|------------------|---------------|-------|
| Title Bar Gradient Start | `#0078D7` | `#0078d7` | Left side |
| Title Bar Gradient End | `#005AA1` | `#005aa1` | Right side (slightly darker) |

### Taskbar Colors
| Element | Authentic XP Luna | Current jynxt | Notes |
|---------|------------------|---------------|-------|
| Taskbar Background | `#003366` | `#003366` | EXACT MATCH |
| Taskbar Gradient Dark | `#001A33` | Not used | Bottom gradient |

### Start Button
| Element | Authentic XP Luna | Current jynxt | Notes |
|---------|------------------|---------------|-------|
| Start Green Light | `#008000` | `#008000` | Top/left gradient |
| Start Green Dark | `#006600` | `#006600` | Bottom/right gradient |
| Highlight Border | `#FFFFFF` | `#FFFFFF` | Top/left 2px |
| Outer Border | `#000000` | `#000000` | Bottom/right 2px |
| Shadow Border | `#004000` | `#004000` | Bottom/right inset |

### Text Colors
| Element | Authentic XP Luna | Current jynxt | Notes |
|---------|------------------|---------------|-------|
| Window Text | `#000000` (Black) | `#000000` | EXACT MATCH |
| Title Bar Text | `#FFFFFF` (White) | `#FFFFFF` | EXACT MATCH |
| Login Dialog Text | `#000000` | `#000000` | Black body text |
| Login Dialog Subtitle | `#333333` | `#333333` | Dark gray secondary |

### Special Colors
| Name | Value | Usage |
|------|-------|-------|
| Luna Highlight Yellow | `#FFE94D` | Annotations highlight (used correctly) |
| 3D Highlight | `#FFFFFF` | Button highlights |
| 3D Shadow | `#808080` | Button shadows |
| 3D Face | `#C0C0C0` | Button face color |
| 3D Dark Shadow | `#000000` | Button dark border |
| 3D Light | `#FFFFFF` | Button light border |

## 2. Login/Welcome Screen - Exact Layout

### Screen Structure
```
Screen (100vh x 100vw)
├── Background: Bliss wallpaper (centered, covers entire screen)
├── XP Logo: Positioned at top center (24px from top)
├── User Panel: Centered below logo
├── Enter Button: Centered below user panel
└── Branding: Positioned at bottom center (20px from bottom)
```

### XP Logo Specifications
| Property | Value |
|----------|-------|
| Position | `position: absolute` |
| Top | `24px` |
| Left | `50%` |
| Transform | `translateX(-50%)` |
| Z-index | `1001` |
| Width | `64px` |
| Height | `64px` |
| Object-fit | `contain` |

### Login Card (Dialog Window)
| Property | Authentic XP | Current jynxt |
|----------|-------------|---------------|
| Width | `280px` min-width | `280px` EXACT MATCH |
| Padding | `20px` | `20px` MATCH |
| Background | `#F0F0F0` | `#F0F0F0` MATCH |
| Border (top/left) | `2px solid #FFFFFF` | `2px solid #FFFFFF` MATCH |
| Border (bottom/right) | `2px solid #000080` | `2px solid #000080` MATCH |
| Box-shadow | `3px 3px 0 #000000` (with opacity) | `3px 3px 0 rgba(0,0,0,0.3)` |
| Position | Centered in viewport | Centered |

### Avatar Specifications
| Property | Value |
|----------|-------|
| Width | `56px` |
| Height | `56px` |
| Border-radius | `50%` (circular) |
| Border | `3px solid #000080` (outer) |
| Border-bottom/right | `4px solid #808080` (3D effect) |
| Object-fit | `cover` |
| Margin | `0 auto 12px` |

### Typography
| Element | Font | Size | Weight | Color |
|---------|------|------|--------|-------|
| Title | Segoe UI, Tahoma, Verdana | `18px` | Bold | `#000000` |
| Subtitle | Segoe UI, Tahoma, Verdana | `12px` | Normal | `#333333` |
| Branding | Segoe UI, Tahoma, Verdana | `12px` | Normal | `#FFFFFF` (with text-shadow) |

### Login Button
| Property | Authentic XP | Current jynxt |
|----------|-------------|---------------|
| Width | Auto (fit-content) | Auto |
| Padding | `6px 24px` | `6px 24px` MATCH |
| Height | ~36px | ~36px |
| Background | Gradient `#C0C0C0` to `#A0A0C0` | Linear gradient 180deg `#c0c0c0` to `#a0a0a0` |
| Border | 2px solid with 3D effect: TL white, BR dark gray | Same 3D border effect |
| Font | Segoe UI, Tahoma | Same |
| Color | `#000000` | `#000000` MATCH |
| Box-shadow | `2px 2px 0 #000000` | `2px 2px 0 rgba(0,0,0,0.2)` |

## 3. Desktop - Wallpaper Placement & Icon Styling

### Desktop Container
| Property | Value |
|----------|-------|
| Position | `position: fixed` |
| Top | `0` |
| Left | `0` |
| Right | `0` |
| Bottom | `0` |
| Z-index | `1` |
| Display | `flex` |
| Flex-direction | `column` |

### Wallpaper Container
| Property | Value |
|----------|-------|
| Position | `position: fixed` |
| Inset | `0` |
| Z-index | `0` |
| Overflow | `hidden` |

### Desktop Icons
| Property | Authentic XP | Current jynxt |
|----------|-------------|---------------|
| Icon Size | `48px x 48px` | `48px x 48px` EXACT |
| Label Font | `Segoe UI` | Same |
| Label Size | `11px` | `11px` MATCH |
| Label Color | `#000000` | `#000000` MATCH |
| Spacing | `16px` vertical gap | `16px` MATCH |
| Margin from bottom | `24px` | `24px` MATCH |
| Margin from left | `24px` | `24px` MATCH |

### Icon Border (3D Effect)
| Side | Color |
|------|-------|
| Top | `#FFFFFF` |
| Left | `#FFFFFF` |
| Right | `#C0C0C0` |
| Bottom | `#808080` |

### Desktop Icon Background
| Property | Value |
|----------|-------|
| Background | `#F0F0F0` (3D face color) |
| Border | 2px solid with 3D effect |

## 4. Taskbar - Green Start Button & Clock Format

### Taskbar Dimensions
| Property | Value |
|----------|-------|
| Height | `36px` |
| Background | Gradient `#003366` to `#001A33` (bottom) |
| Border-top | `1px solid rgba(255,255,255,0.1)` |
| Padding | `0 8px` |

### Start Button Specifications
| Property | Authentic XP | Current jynxt |
|----------|-------------|---------------|
| Position | Left-aligned | Left-aligned |
| Minimum Width | `80px` | `80px` MATCH |
| Padding | `4px 12px` | `4px 12px` MATCH |
| Height | ~28px | ~28px |
| Background | Gradient `#008000` to `#006600` | Same gradient |
| Border | 2px solid 3D effect (TL white, BR dark) | Same 3D border |
| Font | `Segoe UI`, Bold | Same |
| Text Color | `#FFFFFF` | `#FFFFFF` MATCH |
| Box-shadow | `2px 2px 0 #000000` | `2px 2px 0 rgba(0,0,0,0.3)` |
| Text Alignment | `center` | `center` MATCH |

### Clock Format
| Property | Authentic XP |
|----------|---------------|
| Format | `HH:MM AM/PM` (12-hour format) |
| Font | `Courier New`, monospace |
| Font Size | `13px` |
| Text Color | `#FFFFFF` |
| Background | `rgba(255,255,255,0.1)` |
| Padding | `4px 12px` |
| Border-radius | `4px` |

### System Tray Area
The system tray (notification area) appears to the right of the clock:
- Small 16x16 or 24x24 icons
- Right-aligned
- No additional background (inherits taskbar)

### Taskbar Spacer
| Property | Value |
|----------|-------|
| Flex | `1` (expands to fill space) |
| Margin-left | `8px` (between start button and spacer) |

## 5. Start Menu - Two-Column Layout

### Start Menu Container
| Property | Value |
|----------|-------|
| Position | `fixed` |
| Bottom | `0` |
| Left | `0` |
| Width | `240px` |
| Background | `#F0F0F0` |
| Border | 2px solid 3D effect |
| Box-shadow | `3px 3px 0 rgba(0,0,0,0.4)` |
| Z-index | `1000` |
| Display | `none` (shown via JS) |

### User Area (Top Section)
| Property | Value |
|----------|-------|
| Display | `flex` |
| Align-items | `center` |
| Gap | `12px` |
| Padding | `12px 16px` |
| Border-bottom | `1px solid #808080` |

### User Avatar
| Property | Value |
|----------|-------|
| Width | `32px` |
| Height | `32px` |
| Border-radius | `4px` (slightly rounded, not circular) |
| Border | `2px solid #000080` |

### User Name Text
| Property | Value |
|----------|-------|
| Font | `Segoe UI`, Tahoma, Verdana |
| Font-weight | `bold` |
| Color | `#000000` |

### Separator Line
| Property | Value |
|----------|-------|
| Height | `1px` |
| Background | `#808080` |
| Margin | `8px 0` |

### Menu Items
| Property | Value |
|----------|-------|
| Padding | `10px 16px` |
| Cursor | `pointer` |
| Font-family | `Segoe UI`, Tahoma, Verdana |
| Font-size | `14px` |
| Color | `#000000` |
| Hover Background | `#0078D7` (Luna blue) |
| Hover Color | `#FFFFFF` |

## 6. Windows - Titlebar Design & Control Buttons

### Window Container
| Property | Value |
|----------|-------|
| Position | `fixed` |
| Background | `#F0F0F0` |
| Border | 2px solid 3D effect |
| Border-radius | `0` |
| Min-width | `300px` |
| Min-height | `200px` |
| Z-index | `100` |
| Box-shadow | `3px 3px 0 rgba(0,0,0,0.4)` |
| Display | `none` |
| Overflow | `hidden` |

### Title Bar
| Property | Value |
|----------|-------|
| Background | Gradient `#0078D7` to `#005AA1` |
| Height | `22px` |
| Color | `#FFFFFF` |
| Display | `flex` |
| Justify-content | `space-between` |
| Align-items | `center` |
| Padding | `2px 8px` |
| User-select | `none` |
| Cursor | `default` |
| Border-bottom | `1px solid #000000` |

### Window Controls (Minimize, Maximize, Close)
| Property | Value |
|----------|-------|
| Display | `flex` |
| Gap | `2px` |
| Button Size | `16px x 16px` |
| Background | `transparent` |
| Border | `none` |
| Color | `#FFFFFF` |
| Font-size | `12px` |
| Font-weight | `bold` |
| Cursor | `pointer` |
| Border-radius | `0` |
| Padding | `0` |
| Box-shadow | `1px 1px 0 rgba(0,0,0,0.2)` |

#### Close Button (X)
| State | Background | Color |
|-------|------------|-------|
| Normal | Transparent | White |
| Hover | `rgba(255,255,255,0.1)` | White |
| Active | Transparent | White |

#### Maximize Button
| State | Icon |
|-------|------|
| Normal | Square (restored state shows square too) |
| Hover | Same |
| Active | Click animation |

#### Minimize Button
| State | Icon |
|-------|------|
| Normal | Minus line |
| Hover | Same |

## 7. Dialog Boxes & Controls - 3D Button Effects

### Button (Standard 3D Style)
| Property | Value |
|----------|-------|
| Background | Gradient `#F0F0F0` to `#C0C0C0` (bottom to top) |
| Border (top/left) | `#FFFFFF` (2px) |
| Border (bottom/right) | `#808080` (2px) |
| Border-right/btm inset | `#C0C0C0` (for 3D bevel) |
| Border-radius | `0` |
| Padding | `6px 12px` minimum |
| Font | `Segoe UI` |
| Color | `#000000` |
| Box-shadow | `1px 1px 0 rgba(0,0,0,0.2)` |

### Input Fields
| Property | Value |
|----------|-------|
| Background | `#F0F0F0` |
| Border | 2px solid 3D effect |
| Border-radius | `0` |
| Padding | `2px 4px` |
| Font | `Segoe UI` |
| Color | `#000000` |

### Check Boxes & Radio Buttons
| Property | Value |
|----------|-------|
| Size | `13px x 13px` |
| Background | `#F0F0F0` |
| Border | 2px solid 3D effect |
| Checked color | `#0078D7` (blue when selected) |

### Scrollbars
| Property | Value |
|----------|-------|
| Width/Height | `17px` |
| Background | `#C0C0C0` |
| Track | `#F0F0F0` |
| Arrows | `#000000` |
| Thumb | `#A0A0A0` |
| Border | 2px 3D effect |

## 8. Music Player - Windows Media Player 7 Style

### Current Implementation Analysis
The jynxt implementation uses a dark sidebar player ("music-island") rather than classic WMP7. For authentic WMP7 style:

### Windows Media Player 7 Interface
| Element | Dimensions | Color |
|---------|------------|-------|
| Player Frame | Gradient background | `#000000` to `#336699` |
| Title Bar | `#0078D7` (Luna blue) |
| Control Buttons | 16x16, 3D style |
| Play/Pause | Triangle and two vertical bars |
| Next/Previous | Arrows |
| Volume | Slider control |
| Progress Bar | `#0078D7` fill |

### WMP7-Style Controls
| Control | Size | Colors |
|---------|------|--------|
| Play Button | `16px x 16px` | 3D button style |
| Pause Button | `16px x 16px` | Same |
| Stop Button | `16px x 16px` | Same |
| Next Button | Arrow icon | Transparent with hover |
| Previous Button | Arrow icon | Transparent with hover |

### Media Bar (Bottom)
| Property | Value |
|----------|-------|
| Height | `40px` |
| Background | `#2E4A6B` (dark blue) |
| Border-top | `1px solid #000000` |
| Controls spacing | `4px` |

## 9. Icon Grid Layout

### Desktop Icon Spacing
| Property | Value |
|----------|-------|
| Horizontal spacing | Not typically defined (left-aligned) |
| Vertical spacing | `16px` between icon groups |
| Icon to label spacing | `8px` |
| Grid origin | `24px` from left, `24px` from bottom |

### Icon Dimensions
| Size | Usage |
|------|-------|
| `48px x 48px` | Standard desktop icons |
| `32px x 32px` | Start menu user avatar |
| `16px x 16px` | Toolbar/small icons |

## 10. Border Radius & Shadows

### Window Corners
| Element | Border Radius |
|---------|---------------|
| Window corners | `0` (sharp, authentic XP) |
| Current jynxt | `var(--card-radius)` - uses `32px` radius (MODERN interpretation, not XP) |

### Card Elements (Modern Glass Effect)
| Property | Value |
|----------|-------|
| Border-radius | `32px` (current jynxt) |
| Glass opacity | `0.2` to `0.9` |
| Blur radius | `20px` to `28px` |
| Border | `1px solid rgba(255,255,255,0.15)` |

### Shadow Effects
| Element | Shadow |
|---------|--------|
| Window | `3px 3px 0 rgba(0,0,0,0.4)` |
| Button | `1px 1px 0 rgba(0,0,0,0.2)` |
| Card | `0 2px 4px rgba(0,0,0,0.2)` |

## 11. Font Specifications

### Primary Font Stack
```
"Segoe UI", Tahoma, Verdana, Arial, sans-serif
```

### Font Sizes by Element
| Element | Size | Weight |
|---------|------|--------|
| Window Title | `13px` | 500 (Semi-bold) |
| Login Title | `18px` | Bold |
| Login Subtitle | `12px` | Normal |
| Desktop Icon Label | `11px` | Normal |
| Start Menu Item | `14px` | Normal |
| Clock | `13px` | N/A (monospace) |
| Button | `14px` | Bold (sometimes) |

## 12. Animation & Transition Settings

### Window Transitions
| Property | Value |
|----------|-------|
| Login fade | `opacity 0.3s ease` |
| Window show | Immediate (XP style) |
| Icon hover | Scale to `0.95` on active |

### Taskbar Reveal
| Property | Value |
|----------|-------|
| Enter animation | Vignette fade-in |
| Mute button | Slide from top with `data-no-reveal` attribute |

## 13. Color System Comparison Table

| XP Element | Authentic Luna Color | Current jynxt | Gap Analysis |
|------------|---------------------|---------------|--------------|
| Luna Blue | `#0078D7` | `#0078d7` | None - exact match |
| Window Bg | `#F0F0F0` | `#F0F0F0` | None - exact match |
| Window Border | `#000080` | `#000080` | None - exact match |
| Title Bar Gradient | `#0078D7` → `#005AA1` | Same | None |
| Taskbar | `#003366` gradient | Same | None |
| Start Button | Green 3D | Same | None |
| Login Dialog | `#F0F0F0` 3D border | Same | None |
| Icon Border | 3D effect | Same | None |
| Button Style | 3D inset | Same | None |
| Clock Font | `Courier New` | `Courier New` | None |
| Desktop Icons | `11px` label | `11px` | None |
| Icon Size | `48px` | `48px` | None |

## 14. Notable Departures in jynxt Implementation

### Modern Glass Effect (Non-XP)
The jynxt implementation adds a "glass-morphism" effect not present in authentic XP:
- `--glass-blur: 20px-28px` (XP has no blur)
- `--card-radius: 32px` (XP is sharp-angled at `0px`)
- `--overlay: 0.2-0.9` (XP has solid opaque backgrounds)

### Dark Theme Implementation
The default dark theme (`#05060a` background) is a modern interpretation:
- Authentic XP Luna is light-themed
- Dark mode would be based on Royale theme or custom, not Luna

### Music Island
The corner-placed music player is inspired by WMP but positioned differently than classic WMP7's docked player at bottom of screen.

## 15. Pixel Dimensions Summary

| Element | Width | Height |
|---------|-------|--------|
| Window Min-width | 300px | - |
| Window Min-height | 200px | - |
| Title Bar Height | 22px | - |
| Taskbar Height | 36px | - |
| Start Menu Width | 240px | - |
| Desktop Icon | 48px | 48px |
| Desktop Icon with label | 48px | 56px (including 8px spacing) |
| Login Card | 280px | Auto (~320px with content) |
| Avatar (Login) | 56px | 56px |
| User Avatar (Start Menu) | 32px | 32px |
| Window Button | 16px | 16px |
| Clock | Auto | 20px |
| Icon Label | 64px max width | - |

## 16. 3D Border Implementation Reference

### Classic XP 3D Border CSS Pattern
```css
/* Outer border - darker color */
border: 2px solid #000080;
/* Top and left edges - lighter/highlight */
border-top: 2px solid #FFFFFF;
border-left: 2px solid #FFFFFF;
/* Right and bottom edges - darker/shade */
border-right: 2px solid #808080;
border-bottom: 2px solid #808080;
```

### Button 3D Effect Pattern
```css
background: linear-gradient(180deg, #F0F0F0 0%, #C0C0C0 100%);
border: 2px solid #000000;
border-top: 2px solid #FFFFFF;
border-left: 2px solid #FFFFFF;
border-right: 2px solid #808080;
border-bottom: 2px solid #808080;
```

## 17. Wallpaper Specifications

### Bliss Wallpaper (Default)
| Property | Value |
|----------|-------|
| Original Format | BMP |
| Aspect Ratio | 4:3 |
| Native Resolutions | 640x480, 800x600, 1024x768 |
| Color Palette | Green hill, blue sky, white farmhouse |
| File Reference | `%WINDIR%\Web\Wallpaper\Bliss.bmp` |

### Wallpaper Rotation
Current jynxt supports multiple wallpapers:
- `Bliss.webp` - Classic default
- `Windows XP.webp` - XP-themed image
- `Ascent.webp` - Mountain theme
- `Azul.webp` - Blue theme
- `Crystal.webp` - Glass-like theme
- `Friend.webp` - Social theme

## 18. Implementation Notes for jynxt

### What's Done Well (Authentic XP Elements)
1. Luna blue color `#0078d7` correctly implemented
2. 3D window borders with proper light/dark contrast
3. Taskbar gradient and height match XP
4. Start button 3D styling is accurate
5. Window titlebar gradient is correct
6. Login dialog styling is faithful
7. Desktop icon sizing and labeling match XP
8. Clock font and position correct

### Modern Enhancements (Beyond Authentic XP)
1. **Glass-morphism effect** - Modern aesthetic layer
2. **Blur filters** - Not present in XP
3. **Rounded corners** - XP uses sharp angles
4. **Dark theme** - XP Luna is light-themed
5. **Vignette overlay** - Modern atmospheric effect
6. **Spotlight effect** - Interactive hover states
7. **Mobile responsiveness** - XP predates mobile

### Recommendations for Enhanced Authenticity
1. Remove or optionally disable glass-morphism for "authentic mode"
2. Add option for sharp corners (`radius: 0`)
3. Implement light theme option matching Luna exactly
4. Add proper WMP7-style music player for full authenticity
5. Include proper cursor assets from XP collection
6. Add system sounds for interactions
7. Implement proper double-buffered window dragging

---

**Specification Version**: 1.0  
**Based on**: Microsoft Windows XP Luna Theme ( Released October 2001 )  
**Reference Image**: Windows XP Luna theme screenshots  
**Documented by**: jynxt web project analysis