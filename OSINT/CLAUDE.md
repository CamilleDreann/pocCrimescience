# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Frontend (port 5173)
yarn install
yarn dev

# API server (port 3001) - run in separate terminal
cd api && npm install
node api/server.js

# Lint
yarn lint
```

## Architecture

This is an OSINT (Open Source Intelligence) web application presented as a Linux-style desktop environment. Users can search for digital footprints by email address.

### State Management

The OS uses a **reducer pattern** via React Context (`src/context/OSContext.jsx`):
- `OSProvider` wraps the app and exposes state + actions via `useOS()` hook
- Window management: open/close/minimize/maximize/focus/resize/drag
- System state: volume, brightness, wifi, bluetooth, notifications
- Actions are dispatched through callbacks like `openApp()`, `closeWindow()`, `addNotification()`

### App System

Apps are registered in `src/data/appRegistry.js` with lazy-loaded components:
- Each app has: `id`, `title`, `icon`, `component`, `defaultSize`
- Opening an app creates a window entry in state; closing removes it
- Single-instance: reopening focuses existing window

### Component Layers

- **`src/components/os/`** — Desktop shell: `Desktop`, `Window`, `TopPanel`, `AppLauncher`, `SystemTray`
- **`src/components/ui/`** — Reusable UI primitives: `Button`, `Input`, `Toggle`, `Slider`, `ContextMenu`, `Dropdown`
- **`src/apps/`** — Desktop applications: `OsintSearch`, `Terminal`, `FileManager`, `TextEditor`, `Settings`

### API

Fastify server (`api/server.js`) with single endpoint:
- `GET /api/search?email=...` — returns user profile data from `api/data/users.json`
- Data indexed by email at startup for O(1) lookup

### Styling

- **CSS Modules** (`.module.css`) for component-scoped styles
- **Design tokens** in `src/styles/tokens.css` — colors, typography, spacing, shadows, z-index scale
- GNOME/Ubuntu dark theme aesthetic with `--color-accent: #e95420`

### Custom Hooks

- `useDrag` — window dragging
- `useResize` — window resizing from edges/corners
- `useClickOutside` — close menus on outside click
- `useContextMenu` — right-click context menus
