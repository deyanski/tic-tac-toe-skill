---
name: "Repository instructions"
description: "Repository-level guidance for Copilot and contributors"
applyTo: "**"
---

<!-- Tip: Use /create-instructions in chat to generate content with agent assistance -->

# Project: tic-tac-toe-premium

## Stack
- Backend: Node.js, TypeScript, Express
- Frontend: React, TailwindCSS
- Deployment: GitHub Pages — hosting
- GitHub Actions — CI/CD pipeline (test → build → deploy workflow)
- Testing: Vitest for unit and integration tests
- Build: Vite

## Skills
- Before building any UI, read and follow: .github/skills/frontend-design/SKILL.md

## Conventions
- Always throw AppError, not Error

## What NOT to do
- Don't install new packages without asking