# agents.md

Guidance for AI coding agents (and humans) working in this repository.
**Read this before making changes.**

## What this project is

A small static website published with **GitHub Pages (Jekyll)**. It is a
collection of **music-theory quizzes** built with plain **HTML, CSS, and
vanilla JavaScript** — no bundler, no framework, no npm, no build step.

- `index.html` — landing page.
- `music/` — the quizzes and the shared engine:
  - `quiz-core.js` — shared quiz engine (`QuizCore`). Every quiz page uses it.
  - `instrument-quiz.html`, `instrument-quiz-data.js` — instrument quiz + data.
  - `key-signature-quiz.html` — key-signature quiz.
  - `quiz.css` — shared quiz styling.
  - `index.html` — index of the quizzes.
- `resources/` — private reference notes (see *Publishing* below).
- `_config.yml` — Jekyll / GitHub Pages config.
- `.githooks/pre-commit` — the pre-commit hook (see *Commits* below).

## Publishing rules (important)

The site is built by Jekyll from the repo root. Anything listed under
`exclude:` in `_config.yml` is **NOT** published — requesting its URL returns
404, but the file still lives in git.

Currently excluded (private, never served):
- `resources/`
- `agents.md`  ← this file

**Never** let `agents.md` (or any agent-internal doc) be served on the site.
If you add a private reference file or folder, add it to `exclude:` in
`_config.yml` so it stays unpublished. Do not link to it from any page.

## Local preview

No build step is required — open the `.html` files directly in a browser, or
serve locally for a closer-to-production check:

    python3 -m http.server 8000

then visit http://localhost:8000/ .

## Code conventions

- Vanilla JS, ES5-style (the engine uses `var`, `function`, IIFEs, no modules).
  Match the existing style; do not introduce a bundler, transpiler, or npm.
- Shared logic goes in `music/quiz-core.js`. Individual quiz pages stay thin:
  data plus a `QuizCore` config.
- Keep pages self-contained and dependency-free.

## Commits (binding rules)

A pre-commit hook lives at `.githooks/pre-commit`. Git is configured
(`core.hooksPath = .githooks`) to run it on every commit. On a fresh clone,
re-enable it once:

    git config core.hooksPath .githooks

The hook inspects **staged** content for:
- trailing whitespace, merge-conflict markers, and a missing final newline;
- JavaScript syntax (`node --check`) on staged `.js` files;
- leftover debug code (`console.log` / `debugger`) in staged `.js`;
- any staged file larger than 1 MB.

### Rules

1. **You MUST commit through the pre-commit hook.** Every commit must pass it.
2. **NEVER use `--no-verify`.** Do not run `git commit --no-verify`, ever —
   not "just this once", not for a "trivial" change, not when in a hurry.
   There are no exceptions. If the hook fails, fix the problem and re-stage.
   If a check is genuinely wrong, fix the hook itself — then commit the hook
   change through the hook.
3. Do not disable, delete, or weaken the hook to make a commit go through.

These rules keep the published site and the codebase clean. Bypassing them
defeats the purpose.
