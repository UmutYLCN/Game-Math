# Game-Math

A Turkish mental-math practice app with a retro interface, 16 game modes and three introductory strategy lessons. Static HTML, CSS and JavaScript; no build step, account or backend.

## Run locally

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open http://127.0.0.1:8765/. Keep the same browser and origin to retain local progress. Google Fonts and KaTeX load from the existing external CDNs; basic question and lesson text works without them.

## Learn and practice

- **Pratik yap** retains campaign levels, daily challenges, custom multiplication ranges and all topic/difficulty presets under **Mod seç**.
- **Öğren** adds making tens, number decomposition and rounding with compensation. Follow a worked example, complete guided steps, then try untimed practice with hints and solutions.
- Optional timed practice starts at 60 seconds and adds two seconds per correct answer. Opening lessons pauses the timer; returning resumes it.
- Use Enter to submit, Escape to dismiss/clear, or the on-screen keypad. Decimals use a point. A–F appear for hexadecimal answers.
- **Formül rehberi**, **İstatistikler**, sound, Matrix and the expandable activity log remain available. The interface uses retro styling throughout; reduced-motion preferences suppress animation.

Progress remains browser-local under `MATH_DECIPHER_SAVE_v3`. Lessons add `learningProgress` without replacing existing scores, unlocks, badges or daily data. Clearing browser storage removes local progress.

## Engine regression tests

Node.js is only needed to run tests, not to use the app:

```sh
node --test tests/engine.test.cjs
```

The tests exercise engine/storage behavior with lightweight DOM adapters. They do not certify real-browser layout or interactions. See [delivery notes](docs/delivery-notes.md) for the feature inventory, evidence and browser-check limitations.
