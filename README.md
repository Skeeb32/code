# Pattern Practice

A step-by-step interview preparation workspace for learning algorithm patterns. The first version includes a personalized dashboard, a 12-week curriculum, and an interactive Two Sum lesson.

## Run locally

This is a dependency-free static site. From this directory, run:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Current features

- Overview dashboard for the Python, intermediate-level, 12-week interview plan
- Six-stage roadmap covering foundations through mock interviews
- Three-step Two Sum lesson: understand, reason, and attempt
- Local browser saving for lesson notes, code, and completion status
- Responsive layout with keyboard-visible focus styles and reduced-motion support

Progress is stored in the current browser using `localStorage`; this first version has no accounts or cross-device sync.
