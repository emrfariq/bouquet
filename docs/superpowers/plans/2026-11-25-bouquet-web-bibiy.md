# Buket untuk Bibiy (web) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port `bouqet.py` to a static web page (Vercel) with a purple flower mix and texts from Emir for Bibiy.

**Architecture:** `bouquet.js` is a 1:1 port of the Python scene builder and rasterizer into a character grid (chars + 256-color codes + z-buffer). The grid is drawn on a `<canvas>`, one glyph per fixed-size cell (cell height = 2 × width, same as a terminal, so `sxs = scale * 2` stays valid). Title, typed message, signature, and hint are DOM text around the canvas so they stay readable on phones.

**Tech Stack:** plain HTML/CSS/JS, no dependencies, no build.

**Spec:** `docs/superpowers/specs/2026-11-25-bouquet-web-bibiy-design.md`

## Global Constraints
- No `package.json`, no build step; `index.html` at repo root.
- TO = "Bibiy", FROM = "Emir", messages and signature verbatim from the spec.
- 30 flowers as in the original kinds/counts (8 rose, 2 sun, 3 lily, 5 sakura, 5 daisy, 4 tulip, 3 hydrangea), recoloured purple.
- Original author credit stays in the README.

## Review Focus
1. Phone portrait (≈390×844): bouquet fits, message readable, tap = next message.
2. Window resize / rotate: grid and scene density rebuild without errors.
3. Non-ASCII glyphs (`♥`, `·`) must not shift columns (canvas draws per cell).
4. Hidden tab / long pause: `dt` capped at 0.1 s so particles don't jump.
5. Slow devices: frame cost; FPS capped at 30.

---

### Task 1: Port renderer + page
**Files:** Create `index.html`, `style.css`, `bouquet.js`.
- [ ] Port constants, `build_scene`, `dynamic_points`, `draw_core`, `draw_points`, `raster_flower`, stars/particles/babies/sparkles/flies, `msg_phase` into `bouquet.js`. Python `random.Random(21)` becomes a seeded mulberry32 with Box–Muller `gauss`.
- [ ] `xterm256(code) -> "#rrggbb"`; canvas draws each non-space cell with `fillText` at its cell centre.
- [ ] Cell size `cw = clamp(min(innerWidth/90, canvasHeight/120), 4.5, 12)`, `ch = 2*cw`; rebuild grid on resize.
- [ ] Controls: space pause, `+`/`-` speed, `r` reverse, `n` / click / tap next message.
- [ ] Verify in the browser preview at desktop and mobile size: no console errors, bouquet blooms and spins, message types.

### Task 2: Purple mix + texts
**Files:** `bouquet.js`, `bouqet.py`.
- [ ] Purple palettes (256-colour codes) for roses, sun (purple coneflower), sakura (lilac), lilies, tulips, asters, hydrangea, paper, tissue, ribbon, hearts, petals, message colours; same values in both files.
- [ ] Texts per spec in both files.
- [ ] Verify by screenshot.

### Task 3: README + commit
- [ ] Rewrite README in Indonesian: open locally, deploy to Vercel, edit texts; keep credit to Red Ivan Clay.
- [ ] Commit.
