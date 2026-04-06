# ReHUD - Development Guide

## Project Overview

ReHUD is a real-time HUD overlay for RaceRoom Racing Experience (R3E). It reads telemetry via shared memory, processes it in a .NET 6 backend, and renders HUD elements in an Electron frontend (TypeScript/Webpack).

## Development Workflow (TDD)

Follow strict red-green-refactor for all changes:

1. **Write unit tests first.** Validate they fail (red).
2. **Write the implementation.** Run tests to confirm they pass (green).
3. **Fix until ALL tests pass.** No broken tests left behind.
4. **Review and refactor.** Look for changes that make the code easier to change. Keep tests green.

Do not skip steps. Do not write implementation code before a failing test exists.

## Test Infrastructure

- **C# (backend):** xUnit test project at `ReHUD.Tests/`. Run with `dotnet test ReHUD.Tests`.
- **TypeScript (frontend):** Vitest + jsdom at `wwwroot/ts/__tests__/`. Run with `npm test`. Setup file at `wwwroot/ts/__tests__/setup.ts` mocks Electron IPC.
- HUD element `render()` methods are pure functions (data in, string/style out) — test them in isolation.
- Test helpers in `wwwroot/ts/__tests__/testHelpers.ts`: `createHudElement()`, `makeExtendedShared()`, `makeDriverInfo()`, `executeAndGetText()`.
- See `Specs/000-dev-environment-setup.md` for full setup instructions.

## UI Visualization & Testing

- **Unit tests:** Validate HUD element render logic via Vitest with DOM assertions.
- **HTML test harness:** `wwwroot/test-harness.html` — standalone page with sliders to feed fake data to HUD elements. Start with `preview_start("test-harness")` (config in `.claude/launch.json`), then navigate to `/test-harness.html`. Serves on port 3000.
- **Mock data injector:** Optional utility that writes fake R3EData to the `$R3E` shared memory region for full integration testing with the real app (not yet built).

## Architecture Quick Reference

```
R3E Game -> Shared Memory ($R3E)
  -> SharedMemoryService (C#, reads struct at ~60fps)
  -> R3EDataService (processes, calculates extras, persists to SQLite)
  -> IPC "r3eData" channel (serialized JSON, filtered to used keys)
  -> Electron frontend -> SharedMemorySupplier -> HudElement.render()
```

### Key Directories

- `Models/` — R3E shared memory structs (`R3E.cs`), extra data (`R3EExtraData.cs`)
- `Services/` — Backend services (shared memory, data processing, lap data, drivers)
- `wwwroot/ts/hudElements/` — TypeScript HUD element classes
- `wwwroot/ts/` — Frontend core (Hud.ts, Action.ts, HudElement.ts, SharedMemoryConsumer.ts)
- `Pages/` — Razor pages (Index.cshtml is the main HUD layout)

### HUD Element Pattern

Each HUD element:
1. Extends `HudElement` (which extends `Action` extends `EventListener`)
2. Declares `sharedMemoryKeys` — data dependencies (prefix `+` for extraData fields)
3. Implements `render(...)` — pure function returning `string | Style | null | Hide`
4. Is registered in `SharedMemorySupplier` and rendered in the `Hud` render loop

## Next Session

See [TODO.md](TODO.md) for the prioritized task list.

## Conventions

- Use existing patterns when adding new HUD elements or services.
- Do not add features, refactoring, or "improvements" beyond what was requested.
- Keep commits focused and atomic.
