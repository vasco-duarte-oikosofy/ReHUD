# Next Session TODO

## Verify & Ship
- [x] In-game verification: VE HUD elements confirmed working in-game (colors, layout match fuel HUD)
- [x] In-game verification: confirm fuel/VE per-lap averages populate after laps with a hybrid hypercar (BMW M Hybrid V8, Porsche 963, etc.) — logic verified via tests, needs in-game confirmation
- [x] In-game verification: confirm consumption data saves on invalid laps (cut a corner, check Fuel/Lap still updates) — code saves on all laps, needs in-game confirmation
- [x] Git commit all changes once verified working

## GitHub
- [ ] Install `gh` CLI (or use browser) to create a fork of `Yuvix25/ReHUD` under your GitHub account
- [ ] Set the fork as the `origin` remote (current origin points to the upstream repo)
- [ ] Push all changes to the fork

## Bugs Fixed
- [x] `VersionService` reads Electron version as app version — now reads `buildVersion` from `electron.manifest.json`
- [x] Test harness VE Time Est computation — was already implemented

## Done
- [x] Add VE elements to the Spec 001 test coverage summary (48 TS tests documented)
- [x] Add C# unit tests for SaveData consumption logic (13 tests for CalcFuelDiff, CalcVirtualEnergyDiff, ShouldSaveVirtualEnergy)
- [x] Add C# unit tests for VersionService (7 tests for TrimVersion + ReadVersionFromManifest)
