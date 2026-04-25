# Tic-Tac-Toe-skill Project

## Skills
Before starting any task, read and follow the relevant skills:

- **UI/Design tasks**: Read `.agents/skills/frontend-design/SKILL.md`
- **React/Tailwind/Vite setup**: Read `.agents/skills/web-artifacts-builder/SKILL.md`
- **Browser/UI testing**: Read `.agents/skills/webapp-testing/SKILL.md`
- **Unit testing**: Read `.agents/skills/vitest/SKILL.md`

## Stack
- Runtime: Node.js
- Language: TypeScript (strict mode)
- Framework: React 18+
- Bundler/Dev server: Vite
- Styling: Tailwind CSS + shadcn/ui
- Unit testing: Vitest
- E2E/UI testing: Playwright
- Deployment: GitHub Pages — hosting
- GitHub Actions — CI/CD pipeline (test → build → deploy workflow)

## Project Structure
src/
├── components/      # React UI components
├── game/            # Game logic (pure TypeScript, fully typed)
├── hooks/           # Custom React hooks
└── tests/           # Vitest unit tests

## Testing Rules
- All game logic in `src/game/` MUST have Vitest unit tests
- Run unit tests with: `npm run test`
- Run with coverage: `npm run test:coverage`
- Run UI tests with: `npm run test:ui`
- Never skip tests — fix failures before moving on

## Design Rules
- Pick a bold, specific aesthetic and commit to it fully
- No Inter font, no purple gradients, no generic layouts
- Use CSS variables for all theme colors
- Animations must be intentional — win state, move transitions, reset

## TypeScript Rules
- `strict: true` in tsconfig.json
- All game state fully typed (Board, Player, GameStatus)
- No `any` types