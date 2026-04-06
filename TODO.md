# Next Session TODO

## Verify & Ship
- [x] In-game verification: VE HUD elements confirmed working in-game (colors, layout match fuel HUD)
- [ ] In-game verification: confirm fuel/VE per-lap averages populate after laps with a hybrid hypercar (BMW M Hybrid V8, Porsche 963, etc.)
- [ ] In-game verification: confirm consumption data saves on invalid laps (cut a corner, check Fuel/Lap still updates)
- [ ] Git commit all changes once verified working

## GitHub
- [ ] Create a fork of `Yuvix25/ReHUD` under your GitHub account
- [ ] Set the fork as the `origin` remote (current origin points to the upstream repo)
- [ ] Push all changes to the fork

## Bugs to Fix
- [ ] `VersionService` reads Electron version as app version, triggering spurious upgrade actions on first launch — should read from `electron.manifest.json` buildVersion instead
- [ ] Test harness (`wwwroot/test-harness.html`) missing VE Time Est computation in the JS logic

## Nice to Have
- [ ] Add VE elements to the Spec 001 test coverage summary (currently 44 tests, could document what each covers)
- [ ] Consider adding C# unit tests for `SaveData` consumption logic now that the xUnit project reference works
