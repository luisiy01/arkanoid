# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Arkanoid (breakout-style) browser game built with vanilla HTML, CSS, and JavaScript — zero external dependencies. Not yet implemented; only assets and workflow tooling exist so far.

## Development

Open `index.html` directly in a browser (no build step, no bundler, no server required). All game code is plain ES modules or script tags.

## Architecture

### Assets

- `assets/spritesheet-breakout.png` — single spritesheet for all game graphics
- `assets/spritesheet.js` — sprite coordinate maps and loading/drawing helpers (`loadSpritesheet`, `drawSprite`, `drawFrame`)
  - Sprites: paddle, ball, colored blocks (gray, red, yellow, cyan, magenta, hotpink, green)
  - Explosion animations: 4 frames per color, 150ms duration
  - Block sprites accessed via `drawSprite(ctx, 'block_<color>', ...)` naming convention
- `assets/sounds/` — `ball-bounce.mp3`, `break-sound.mp3`

### Spec-Driven Workflow

This project uses a spec-first development process via installed skills from `Klerith/fernando-skills`:

1. **`/spec <feature description>`** — guided spec designer. Asks clarifying questions, produces a structured spec file in `specs/NN-slug.md` with status `Draft`.
2. **`/spec-impl <NN-spec-name>`** — implements an approved spec. Only works when spec status is "Approved" (or equivalent in any language). Creates branch `spec-NN-slug`, implements step by step with pauses for review.

Spec lifecycle: `Draft` → `In review` → `Approved` → `Implemented` / `Obsolete`

Branch creation controlled by `specs/.spec-config.yml` (`AutoCreateBranch: true` by default).

## Language

README and specs are in Spanish. Match language of existing specs when creating new ones.
