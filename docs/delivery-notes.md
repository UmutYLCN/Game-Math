# Teaching update delivery notes

## Baseline inventory (before editing)

Inspected clean detached HEAD `7bd3978` (also `origin/main`) in the assigned isolated worktree. No scratch changes, extra files, project AGENTS.md or CONTRIBUTING.md were present. Created `fm/game-math-intake` from that exact base. The Garage and primary checkouts are untouched.

### Feature preservation checklist (source comparison, not browser certification)

- [x] All 16 modes: CAMPAIGN, DAILY_CHALLENGE, MULTIPLICATION_TABLE, MULTIPLICATION_OP, ADDITION, SUBTRACTION, DIVISION, COMPUTER_BASES, EXPONENTS, SQUARE_ROOTS, LOGARITHM, PERCENTAGE, GEOMETRY, FACTORIAL, TRIGONOMETRY, MATH_TRIVIA.
- [x] Campaign: ten levels, levels 1–9 require five correct answers; level 10 requires ten. Unlocks, level buttons, level-up dialog and final-level continuation.
- [x] Daily: ten questions, date, completion, replay and best score. Baseline chooses generator categories by date but draws operands randomly (the scout report overstated determinism).
- [x] Custom multiplication: min/max inputs, reversed-range handling, six quick chips (1–5, 1–10, 5–10, 1–15, 1–20, 1–30).
- [x] Optional 60-second timer, +2 seconds per correct answer, timeout and restart.
- [x] Score formula `100 × (currentLevelIndex + 1) × min(5, 1 + floor(streak / 3))`; high score, current/best streak, total solved/attempts, accuracy, operations/minute and all six badges.
- [x] Enter submission, Escape dismissal/clear, touch digits, minus, clear, backspace and submit. Add decimal point and contextual A–F without changing string/alternate-answer matching.
- [x] Sound synthesis/toggle, Matrix toggle/canvas, retro visuals, terminal log/clock, mode/doc tab navigation and all six dialogs.
- [x] Existing save key `MATH_DECIPHER_SAVE_v3`: `highScore`, `unlockedLevelIndex`, `totalSolved`, `totalAttempts`, `bestStreak`, `badges`, and `dailyState` (`dateStr`, `completed`, `bestScore`, `currentIndex`, `questions`). No existing field removed. Runtime mode/preset/current score, partial campaign answers, sound and Matrix were not persisted by baseline.

### Complete preset inventory

- `mult-op`: `mult-op-rr`, `mult-op-sr`, `mult-op-ss`, `mult-op-3r`, `mult-op-3s`, `mult-op-4r`, `mult-op-4s`, `mult-op-10s`
- `bases`: `bases-bin`, `bases-dec2bin`, `bases-hex`, `bases-dec2hex`, `bases-oct`, `bases-dec2oct`, `bases-add`, `bases-mix`
- `exp`: `exp-2n`, `exp-35n`, `exp-sq`, `exp-cube`, `exp-10n`, `exp-mix`
- `root`: `root-basic`, `root-addsub`, `root-mult`, `root-mix`
- `log`: `log-23`, `log-10`, `log-rule`, `log-mix`
- `trivia`: `trivia-angles`, `trivia-primes`, `trivia-mix`
- `pct`: `pct-basic`, `pct-adv`, `pct-mix`
- `geom`: `geom-pyth`, `geom-area`, `geom-mix`
- `fact`: `fact-basic`, `fact-ratio`, `fact-mix`
- `trigo`: `trigo-basic`, `trigo-quad`, `trigo-ident`, `trigo-mix`
- `add`: `add-rr`, `add-sr`, `add-ss`, `add-33`, `add-44`
- `sub`: `sub-rr`, `sub-sr`, `sub-ss`, `sub-33`, `sub-44`
- `div`: `div-basit`, `div-sr`, `div-ss`, `div-3s`, `div-4s`

61 preset buttons, plus the custom range and ten campaign levels.

### Reference content retained

`doc-exp`, `doc-root`, `doc-bases`, `doc-trivia`, `doc-log`, `doc-pct`, `doc-geom`, `doc-fact`, `doc-trigo`, `doc-mult-adv`, `doc-mult-basic`, `doc-add`, `doc-sub`, `doc-div`. All 14 sections and their formulas/shortcuts are unchanged against the baseline HTML.

## Delivered behavior

The sole presentation is the updated retro interface chosen after the user's localhost preview. The interim clean-theme control, handler and exclusive styles were removed; Matrix still has its own toggle and respects the operating system's reduced-motion preference. No theme preference is read or migrated. Unrecognized existing save fields (including an old `theme: "clean"` value) are preserved without affecting the retro presentation.

The separate learning workspace teaches making tens, decomposition and rounding with compensation. Each lesson has original Turkish explanations, worked examples, guided intermediate answers, untimed independent questions, hints, solutions and retries. Compensation covers both addition/subtraction and upward/downward rounding. Lesson completion means the supplied activities were completed; no speed or mastery claim is made. Learning pauses an active practice timer and resumes its remaining seconds on return. Game scores and lesson progress are separate.

`learningProgress` is additive under `MATH_DECIPHER_SAVE_v3`. Legacy fields and unknown fields are retained. Same-day daily questions are reused after loading; unlocks and daily index changes are saved after transitions. Unreadable stored JSON is left untouched with a visible warning. Incorrect game attempts are now saved as well.

Mixed geometry now consumes its requested subtype, avoiding unbounded recursion. The keypad accepts decimal points and exposes A–F when an answer targets hexadecimal. Existing exact-string and alternate-answer semantics remain intact. Duplicate submissions during question transitions are ignored. Escape only advances a level when its level-up dialog is actually open.

Navigation keeps all topics, presets and reference sections; wrapping menu buttons expose previously horizontally hidden topics. The log remains available in a keyboard-accessible details panel. Inputs have labels, feedback uses status regions, dialogs manage keyboard focus, zoom is allowed, and reduced motion suppresses animations. These accessibility behaviors require real-browser coverage beyond the checks below.

## Validation evidence and limits

- `node --check app.js`, `node --check learning.js`, `node --check interface.js`: passed.
- `node --test tests/engine.test.cjs`: 7 tests passed. Tests execute the engine with lightweight DOM/storage adapters, covering both mixed-geometry branches, legacy/unknown save-field round trip with lesson progress, corrupt-save preservation, decimal/hex keypad editing, score/timer bonus and duplicate-submit protection, and saved unlock/daily index transitions.
- Regression demonstration: `GAME_MATH_TEST_APP=.scratch/baseline-app.js node --test --test-name-pattern='mixed geometry' tests/engine.test.cjs` against `git show 7bd3978:app.js`: both cases failed with `RangeError: Maximum call stack size exceeded`. The same cases pass in the changed engine. This baseline failure is the expected regression proof, not an omitted failing current test.
- A one-time Python HTMLParser source inventory found no missing baseline element IDs, no duplicate IDs, balanced markup, all 61 preset values unchanged, all 14 reference sections unchanged, and all six custom-range chips unchanged. This is a source inventory, not runtime mode parity evidence.
- Preview: `python3 -m http.server 8765 --bind 127.0.0.1` and `curl -s -o /dev/null -w 'HTTP %{http_code}\n' http://127.0.0.1:8765/` returned `HTTP 200`. The preview remains running for user testing.
- The user reported testing the localhost preview and selected the new retro appearance. No exhaustive user test coverage is inferred from that feedback.

### Browser automation was not performed

Used the isolated `CHROME_DEVTOOLS_AXI_SESSION=game-math-intake` session. `chrome-devtools-axi open http://127.0.0.1:8765` returned `Input validation error: Invalid arguments for tool take_snapshot: pageId: Invalid input: expected number, received undefined`. Subsequent `snapshot` and `console` commands returned the same missing-pageId error. After inspecting installed help, `pages` returned page ID 1 (`about:blank`, selected), but the documented `selectpage 1` route also returned the same error. No useful browser evidence was obtained, and no tool installation or shared infrastructure change was attempted.

Firstmate's later instruction explicitly accepted this disclosed unperformed check and authorized continuing to the pipeline; the wrapper defect is not claimed fixed. Consequently the worker did not exercise the lesson flow, all-mode UI parity, actual browser reload/storage behavior, keyboard focus, mobile/touch layout, sound, Matrix, timed challenges or reduced-motion rendering in a browser. Engine adapter tests and source preservation checks do not substitute for those interactions. The selected no-mistakes pipeline owns further validation, review, fixes, documentation, push and CI.

## Delivery

Implementation is prepared on `fm/game-math-intake`, with scratch artifacts excluded. No default-branch push, merge or deployment is authorized. The exact commit and pipeline outcome will be reported separately after the pipeline returns. The user's Garage and primary clones were not edited by the worker.
