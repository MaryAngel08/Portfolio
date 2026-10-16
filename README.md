# Mary

A cinematic, real-time 3D glass sculpture scene built with Vite, React, Three.js, and React Three Fiber.

## Quick start

```bash
npm install
npm run dev
```

Then open the URL shown in the terminal — usually:

**http://localhost:5173/**

## Scripts

| Command           | What it does                |
| ----------------- | --------------------------- |
| `npm run dev`     | Start the local preview     |
| `npm run build`   | Create a production build   |
| `npm run preview` | Preview the production build |

## Project structure

```
src/
  App.jsx                 # App shell + WebGL fallback
  main.jsx                # React entry
  styles.css              # Full-viewport styles
  config.js               # Camera, speed, bloom knobs
  hooks/useMediaFlags.js  # Mobile / reduced-motion / tab visibility
  materials/              # Shared glass material settings
  components/
    Scene.jsx             # Canvas, lights, camera, effects
    GlassRibbon.jsx       # Central twisted glass tube
    FloatingObjects.jsx   # Glass spheres & cubes
    ConnectingLines.jsx   # Thin cyan connectors
    Floor.jsx             # Dark reflective floor
```

## Tuning the scene

Open `src/config.js` to adjust:

- `ANIMATION_SPEED` — overall motion rate
- `CAMERA.position` / `CAMERA.lookAt` / `CAMERA.drift`
- `BLOOM` — soft highlight glow
- `OBJECT_COUNTS` — desktop vs mobile piece count

## Notes

- Animation respects `prefers-reduced-motion`.
- Animation pauses when the browser tab is hidden.
- If WebGL is unavailable, a static fallback message is shown.
- On some Windows setups, native Rollup binaries are blocked by Application Control. This project already uses a WASM fallback via `ROLLUP_USE_WASM` in the npm scripts.
