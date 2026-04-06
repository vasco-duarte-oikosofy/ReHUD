# Spec 000: Development Environment Setup

## Prerequisites

- **Windows 10/11**
- **.NET 6.0 SDK** — add to PATH after install
- **Node.js v20+** — zip distribution works (no admin required), add to PATH
- **Git** — available via Git for Windows / Git Bash

## Clone & Setup

```bash
git clone git@github.com:Yuvix25/ReHUD.git rehud
cd rehud
npm install
```

### ElectronNET.API Version

The upstream repo used a custom/forked `ElectronNET.API` v99.0.8 not available on public NuGet. We switched to the public v23.6.2 (see [Spec 002](002-electronnet-version-swap.md)). One API difference was patched in `Startup.cs`.

## Running the App

Use `run-dev.bat` (Windows CMD) from the repo root. It handles:
1. TypeScript compilation + Webpack bundling
2. Copying `node.exe` into the Electron host (needed because `electronize` spawns `electron.cmd` which calls `node`)
3. Ensuring Electron 26.x is installed in the host (the CLI ships with 23.x but the app needs 26.x for transparent overlays)
4. Launching via `electronize start`

### First-time setup (once)

```bash
dotnet tool install ElectronNET.CLI -g --version 23.6.2
```

### Important notes

- Close the installed/packaged ReHUD before running from source (they share the same shared memory and data directory)
- The app data directory is `Documents/ReHUD/` — contains `UserData.db` (SQLite) and layout presets
- If you get SQLite errors about missing tables, delete `UserData.db` and restart — EF Core migrations will recreate it

## Running Tests

### TypeScript (Vitest)

```bash
npm test          # single run
npm run test:watch  # watch mode
```

Tests are in `wwwroot/ts/__tests__/`. Setup file at `wwwroot/ts/__tests__/setup.ts` mocks Electron IPC.

Test helpers in `wwwroot/ts/__tests__/testHelpers.ts`:
- `createHudElement(Ctor, elementId)` — instantiates a HUD element with DOM
- `makeExtendedShared(rawOverrides, extraOverrides)` — creates mock telemetry data
- `makeDriverInfo(engineType)` — creates mock driver info
- `executeAndGetText(element, data, elementId)` — runs element and returns rendered text

### C# (xUnit)

```bash
dotnet test ReHUD.Tests
```

The test project at `ReHUD.Tests/` references `ReHUD.csproj`.

## Visual UI Testing

Open `wwwroot/test-harness.html` in a browser (or serve it):

```bash
npx serve wwwroot -p 3333
# then open http://localhost:3333/test-harness.html
```

The harness has sliders and controls to feed mock data to HUD elements without needing the game or Electron running.

## Project Structure

```
Models/
  R3E.cs                  — R3E shared memory struct (maps to game memory)
  R3EExtraData.cs         — Calculated extra data (per-lap averages, etc.)
  LapData/
    LapData.cs            — EF Core entities (Lap, FuelUsage, VirtualEnergyUsage, etc.)
    LapDataContext.cs     — EF Core DbContext
Services/
  SharedMemoryService.cs  — Reads R3E shared memory at ~60fps
  R3EDataService.cs       — Processes data, calculates extras, sends to frontend
  LapDataService.cs       — SQLite persistence and querying
Pages/
  Index.cshtml            — Main HUD HTML layout
wwwroot/
  ts/
    hudElements/          — TypeScript HUD element classes (one per widget)
    __tests__/            — Vitest tests
    Hud.ts                — Main render loop
    consts.ts             — Types (IExtendedShared), constants, TRANSFORMABLES
    r3eTypes.ts           — TypeScript types matching R3E shared memory
    index.ts              — Element instantiation and registration
  test-harness.html       — Visual testing page
Specs/                    — Feature specifications and dev docs
ReHUD.Tests/              — xUnit test project
CLAUDE.md                 — AI assistant project guide
vitest.config.ts          — Vitest configuration
```

## Test Infrastructure Added

### npm packages (devDependencies)
- `vitest` ^3.1.1 — test runner
- `@vitest/coverage-v8` ^3.1.1 — coverage
- `jsdom` ^26.0.0 — DOM environment for tests

### NuGet packages (ReHUD.Tests/)
- `Microsoft.NET.Test.Sdk` 17.1.0
- `xunit` 2.4.1
- `xunit.runner.visualstudio` 2.4.3
- `coverlet.collector` 3.1.2

### Config files added
- `vitest.config.ts` — jsdom env, `.js`→`.ts` import alias, setup file
- `wwwroot/ts/__tests__/setup.ts` — mocks `electron` module for tests
