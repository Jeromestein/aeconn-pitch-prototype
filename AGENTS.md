# AGENTS Instructions

- Prefer Chinese for replies, communication, and planning.
- Default to English when generating documentation, code comments, pull requests, and similar artifacts, unless the user requests otherwise.
- Do not run `pnpm build`.

## Frontend Verification

- For any frontend-related change, automatically use the local `playwright` skill after the code edit unless the user explicitly says not to.
- Treat frontend-related change as any modification to UI, layout, styling, animation, copy shown on screen, routes/pages, or client-side interaction behavior.
- Use the Playwright CLI wrapper at `$HOME/.codex/skills/playwright/scripts/playwright_cli.sh`.
- Required verification flow after frontend edits:
  1. Ensure the local dev server for this repo is running.
  2. Open the affected page in a real browser with Playwright.
  3. Capture a fresh snapshot before interaction.
  4. Interact with the updated UI when needed to reach the changed state.
  5. Capture a screenshot in the final visual state.
  6. Report the verification result in the final response, including whether the check passed and what page/state was verified.
- Store generated screenshots and related artifacts under `output/playwright/` when feasible.
- If Playwright cannot run because of environment restrictions, missing network access, missing browser/runtime, or unavailable local dev server, explicitly say what blocked verification and what was still checked locally.

## Skills

- If the task requires browser automation, UI flow debugging, screenshots, snapshots, or visual verification, use the `playwright` skill at `/Users/plusone/.codex/skills/playwright/SKILL.md`.
