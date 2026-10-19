---
name: AetherFlix
description: Sleek Cinema & Universal Streaming Platform
colors:
  primary: "#e50914"
  primary-hover: "#f40612"
  primary-glow: "#ff334b"
  neutral-bg: "#08080a"
  surface: "#111114"
  surface-hover: "#18181d"
  surface-active: "#212128"
  border: "#26262f"
  border-focus: "#e50914"
  text-primary: "#f4f4f6"
  text-secondary: "#c2c2ce"
  text-muted: "#8c8c9a"
  accent-gold: "#e6b33a"
typography:
  display:
    fontFamily: "'Bebas Neue', 'Outfit', sans-serif"
    fontSize: "clamp(2rem, 5vw, 3.5rem)"
    fontWeight: 400
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  headline:
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)"
    fontWeight: 700
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: "normal"
  label:
    fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.06em"
rounded:
  sm: "6px"
  md: "10px"
  lg: "16px"
  pill: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.md}"
    padding: "10px 22px"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
  card-media:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.md}"
    padding: "0px"
---

# Design System: AetherFlix

## 1. Overview

**Creative North Star: "The Private Screening Room"**

AetherFlix embraces a quiet, cinema-grade aesthetic inspired by premium screening environments and modern curator galleries (Apple TV+, Modern Plex, and Letterboxd). The interface functions as an acoustically tuned, pitch-black gallery wall: silent and invisible until invoked, letting high-definition movie backdrops, character art, and vibrant cover photography take center stage.

We reject SaaS cliches: no gratuitous floating frosted-glass cards that obscure video stills, no rainbow or neon border gradients, and no low-contrast dark gray text that strains users in dark home theater rooms. Every surface has deliberate tonal depth, razor-sharp typographic hierarchy, and tactile, instantaneous responsiveness.

**Key Characteristics:**
- **Pitch-OLED Foundation:** True deep blacks (`#08080a`) and finely tuned dark slate surfaces (`#111114`, `#18181d`) provide limitless contrast without muddy gray haze.
- **Whisper-Quiet Chrome:** Menus, pills, and toolbars fade cleanly into the background, stepping forward with high-clarity focus rings only when actively engaged.
- **10-Foot & 1-Foot Precision:** Generous click/touch targets (≥44px), clear spatial keyboard and remote D-pad focus indicators (`2px solid #e50914`), and adaptive responsive grid layouts that look majestic on 4K OLED TVs and razor-sharp on mobile phones.

## 2. Colors

The palette is anchored in deep cinematic darks with a disciplined crimson focal point reserved strictly for primary actions, live states, and active selection.

### Primary
- **Cinematic Crimson** (`#e50914`): Reserved for active navigation indicators, primary play buttons, and remote focus rings. Never sprayed across large surfaces.
- **Crimson Highlight** (`#f40612`): Hover state for primary buttons.
- **Crimson Glow** (`#ff334b`): Micro-ring glow on remote/keyboard active focus.

### Secondary
- **Curator Gold** (`#e6b33a`): Highlighting IMDb ratings, awards, and premium feature badges.

### Neutral
- **OLED Void** (`#08080a`): Global application background.
- **Deep Film Surface** (`#111114`): Sidebar, dialog sheets, player chrome, and card background.
- **Raised Tonal Surface** (`#18181d`): Hovered cards, chips, search inputs, and dropdown panels.
- **Active Surface** (`#212128`): Active filter tabs, pressed states, and selected row items.
- **Subtle Film Border** (`#26262f`): Crisp 1px perimeter dividers that maintain element definition without drawing focus.
- **High-Clarity Ink** (`#f4f4f6`): Primary titles, player timestamps, and button labels (high WCAG AAA contrast).
- **Secondary Ink** (`#c2c2ce`): Metadata, release years, genres, and synopsis body text (>4.5:1 ratio).
- **Subdued Ink** (`#8c8c9a`): Unfocused icons, placeholder text, and secondary timestamps. Never drops below readable threshold.

### Named Rules
**The One Spotlight Rule.** The crimson accent is used on less than 8% of the viewport. It represents attention, playback, and focus. If everything glows, nothing is focused.
**The Legibility Floor Rule.** Body and metadata text must never use low-opacity gray below `#8c8c9a` against dark surfaces. Contrast in dimly lit home theaters must always satisfy WCAG AA (≥4.5:1).

## 3. Typography

**Display Font:** Bebas Neue, Outfit, sans-serif
**Body & Interface Font:** DM Sans, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

**Character:** A classic cinema marque contrast pairing. Bold, condensed display titling for billboard hero titles and movie typography, paired with warm, open, highly legible grotesque sans for cast details, descriptions, and UI controls.

### Hierarchy
- **Display** (Regular 400, `clamp(2rem, 5vw, 3.5rem)`, 1.05 line-height): Billboard title headers, hero showcase names.
- **Headline** (Bold 700, `clamp(1.25rem, 2.5vw, 1.75rem)`, 1.2 line-height): Section titles ("Trending Now", "Continue Watching", "Top Anime").
- **Title** (Semi-bold 600, `1.125rem`, 1.3 line-height): Card hover titles, modal headers, season selector labels.
- **Body** (Regular 400, `0.9375rem`, 1.55 line-height): Plot synopses, settings descriptions, subtitle listings.
- **Label** (Semi-bold 600, `0.75rem`, 0.06em tracking, uppercase): Genre tags, resolution chips (4K, HDR, 1080p), rating badges.

### Named Rules
**The Marquee Discipline Rule.** Bebas Neue is strictly reserved for standalone hero display headlines and category banners. All interactive UI, buttons, inputs, lists, and metadata use DM Sans for optimal reading speed.

## 4. Elevation

Elevation in AetherFlix relies on tonal layering and crisp edge borders rather than heavy, muddy drop shadows. Surfaces rise from `#08080a` (void) to `#111114` (canvas), `#18181d` (raised card), and `#212128` (active overlay).

### Shadow Vocabulary
- **Card Rest:** Flat with `1px solid var(--border)` (`#26262f`).
- **Card Hover / Lift:** `0 14px 28px rgba(0, 0, 0, 0.65), 0 0 0 1px rgba(255, 255, 255, 0.08)`.
- **Focus Ring (Remote / Keyboard):** `0 0 0 2px var(--border-focus), 0 0 16px rgba(229, 9, 20, 0.4)`.
- **Modal Backdrop:** `rgba(0, 0, 0, 0.82)` with subtle backdrop blur (`12px`) to suppress background noise.

### Named Rules
**The Crisp Edge Rule.** Dark mode cards must never rely on diffuse shadows alone for separation; a subtle 1px border (`#26262f`) guarantees sharp edge contrast against pure black backdrops.

## 5. Components

### Buttons
- **Shape:** Soft curved rectangle (`10px` radius).
- **Primary:** Cinematic Crimson (`#e50914`), white text, `10px 22px` padding, font weight 600.
- **Hover / Focus:** Lighter crimson (`#f40612`), subtle scale transform (`1.02`), box-shadow glow.
- **Secondary / Ghost:** Transparent surface with `1px solid #26262f`, `#f4f4f6` text; hover shifts to surface `#18181d` and border `#3a3a46`.

### Media Cards
- **Corner Style:** `10px` radius, `overflow: hidden`.
- **Aspect Ratio:** 2:3 for posters; 16:9 for episode thumbnails and backdrops.
- **Hover Transition:** Snappy `transform: scale(1.04) translateY(-4px)` with cubic-bezier(0.2, 0, 0, 1) over 220ms.
- **Overlays:** Dark gradient vignette from bottom (`rgba(0,0,0,0.85)` to transparent) with crisp metadata labels.

### Navigation (Sidebar / Header)
- **Desktop/TV:** Left slim rail (`76px`) expanding on focus/hover or remaining compact with crisp, illuminated icons and vertical alignment.
- **Active Indicator:** Smooth left pill accent in crimson with glowing dot or icon fill.

### Inputs & Search
- **Style:** Background `#141419`, border `1px solid #26262f`, radius `10px`, text `#f4f4f6`.
- **Focus:** Border shifts to `#e50914` with `0 0 0 1px #e50914` inner stroke. No harsh default browser rings.

### Modals & Dialogs
- **Style:** Solid `#111116` elevated container, `16px` radius, `1px solid #2f2f3c`.
- **Exit Affordance:** Explicit visible close button in top right, ESC key and remote Back button mapped.

## 6. Do's and Don'ts

### Do:
- **Do** maintain minimum 4.5:1 contrast for all secondary text, episode numbers, and subtitle listings.
- **Do** test every interactive component with remote D-pad / arrow keys and highlight active items with the crimson focus ring.
- **Do** wrap all animations in `@media (prefers-reduced-motion: reduce)` with instantaneous fallback.
- **Do** use responsive fluid clamp typography and auto-fit grid layouts that scale gracefully between mobile (360px), desktop (1440px), and Smart TV (4K).

### Don't:
- **Don't** use washed-out low-contrast gray text (`#444`, `#555`) on dark backgrounds.
- **Don't** use multi-colored rainbow gradients or flashy decorative glassmorphism across content cards.
- **Don't** allow dropdowns or action menus to be clipped by `overflow: hidden` parent containers.
- **Don't** write border-left or border-right colored stripes as card accents.
- **Don't** use bounce or elastic animations; keep transitions snappy (<250ms) using cubic-bezier ease-out.
