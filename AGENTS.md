# AGENTS.md

Guidance for AI coding agents (and humans) in this repo. Read before changing things.

## Project

Static **music-theory quiz** site on **GitHub Pages (Jekyll)** - plain
HTML/CSS/vanilla JS. No bundler, no framework, no npm, no build step.

- `index.html` - landing page.
- `music/` - quizzes + shared engine `quiz-core.js` (`QuizCore`).
- `resources/selfmanagement/` - published study notes (markdown, rendered by Jekyll).
- `_layouts/note.html` + `assets/note.{css,js}` - shared note page (theme
  picker, TOC, numbered sections, reading progress).
- `hidden/` - private reference notes (not served).
- `_config.yml` - Jekyll config. `exclude:` lists files kept off the site.
- `Gemfile` - local Jekyll preview only (GitHub Pages uses its own gems).
- `.githooks/pre-commit` - the pre-commit hook.

## Publishing

Anything in `exclude:` in `_config.yml` is **not** served (404) but stays in git.
`AGENTS.md` and `hidden/` are excluded. Never serve agent-internal docs;
add new private files to `exclude:` and don't link to them.

## Local preview

    python3 -m http.server 8000   # then open http://localhost:8000/

Serves static files only (markdown notes are NOT rendered). For the full
Jekyll site, build/serve with Docker:

    docker run --rm -v "$PWD:/srv/jekyll" -v webpage_bundle:/usr/local/bundle jekyll/jekyll:4 bundle install
    docker run --rm -v "$PWD:/srv/jekyll" -v webpage_bundle:/usr/local/bundle -p 4000:4000 jekyll/jekyll:4 jekyll serve --host 0.0.0.0

## Conventions

Vanilla ES5 JS (`var`, `function`, IIFEs). Match existing style; shared logic
in `music/quiz-core.js`; keep quiz pages thin (data + `QuizCore` config).

## Commits (binding)

A pre-commit hook at `.githooks/pre-commit` runs on every commit. On a fresh
clone, enable once: `git config core.hooksPath .githooks`. It checks staged
content for whitespace/conflict markers, missing final newline, JS syntax
(`node --check`), `console.log`/`debugger`, and files >1 MB.

1. **Every commit must pass the pre-commit hook.**
2. **Never use `--no-verify`** - no exceptions. If it fails, fix the issue and
   re-stage; if a check is wrong, fix the hook (committed through the hook).
3. Don't disable or weaken the hook to force a commit through.
