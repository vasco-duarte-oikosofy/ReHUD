# Spec 001: Virtual Energy HUD for Hypercars

## Summary

Add HUD elements to display Virtual Energy (VE) data for hybrid hypercars in RaceRoom Racing Experience (R3E). VE is the maximum energy a driver can use per stint — distinct from battery SoC (state of charge).

## Motivation

R3E exposes VE data via shared memory but ReHUD had no UI for it. The in-game pit menu shows VE as a percentage, so the HUD should match that format to be immediately useful to drivers.

## R3E Shared Memory Fields Used

From `R3EData` (raw shared memory):
- `virtualEnergyLeft` — MJ remaining (Single)
- `virtualEnergyCapacity` — MJ total capacity (Single)

From `R3EExtraData` (calculated per-lap):
- `virtualEnergyPerLap` — average MJ used per lap (from DB)
- `virtualEnergyLastLap` — MJ used on previous lap

## HUD Elements Added

| Element | DOM id | Display | Data Sources |
|---------|--------|---------|-------------|
| VirtualEnergyLeft | `virtual-energy-left` | `XX.X%` (left/capacity) | `virtualEnergyLeft`, `virtualEnergyCapacity` |
| VirtualEnergyPerLap | `virtual-energy-per-lap` | `X.XX` MJ | `+virtualEnergyPerLap` |
| VirtualEnergyLapsLeft | `virtual-energy-laps` | `X.X` laps (color coded) | `virtualEnergyLeft`, `+virtualEnergyPerLap` |
| VirtualEnergyLastLap | `virtual-energy-last-lap` | `X.XX` MJ (color coded) | `+virtualEnergyLastLap`, `+virtualEnergyPerLap` |
| VirtualEnergyTimeLeft | `virtual-energy-time` | `H:MM:SS` | `virtualEnergyLeft`, `+virtualEnergyPerLap`, `+averageLapTime` |
| VirtualEnergyToEnd | `virtual-energy-to-end` | `XX.X%` of capacity | `virtualEnergyCapacity`, `+lapsUntilFinish`, `+virtualEnergyPerLap` |
| VirtualEnergyToAdd | `virtual-energy-to-add` | `XX.X%` of capacity | `virtualEnergyLeft`, `virtualEnergyCapacity`, `+lapsUntilFinish`, `+virtualEnergyPerLap` |

All elements hide automatically when `engineType !== Hybrid`.

## Color Coding

- **Laps Left**: red (1 lap) → green (5+ laps), same gradient as FuelLapsLeft
- **Last Lap**: green when below average usage, red when above (vs `virtualEnergyPerLap`)

## Files Changed

### New TypeScript HUD Elements
- `wwwroot/ts/hudElements/VirtualEnergyLeft.ts`
- `wwwroot/ts/hudElements/VirtualEnergyPerLap.ts`
- `wwwroot/ts/hudElements/VirtualEnergyLapsLeft.ts`
- `wwwroot/ts/hudElements/VirtualEnergyLastLap.ts`
- `wwwroot/ts/hudElements/VirtualEnergyTimeLeft.ts`
- `wwwroot/ts/hudElements/VirtualEnergyToEnd.ts`
- `wwwroot/ts/hudElements/VirtualEnergyToAdd.ts`

### Modified TypeScript
- `wwwroot/ts/r3eTypes.ts` — added `virtualEnergyLeft`, `virtualEnergyCapacity` to `IShared`
- `wwwroot/ts/consts.ts` — added `virtualEnergyPerLap`, `virtualEnergyLastLap` to `IExtendedShared`; added `virtual-energy-data` to `TRANSFORMABLES`
- `wwwroot/ts/index.ts` — imports and registration of all 7 VE elements

### C# Backend
- `Models/R3EExtraData.cs` — added `virtualEnergyPerLap`, `virtualEnergyLastLap` fields
- `Models/LapData/LapData.cs` — added `VirtualEnergyUsage` entity, `VirtualEnergyUsages` on `LapContext`, fields on `CombinationSummary`
- `Models/LapData/LapDataContext.cs` — registered `VirtualEnergyUsage` DbSet and relationship
- `Services/R3EDataService.cs` — per-lap VE tracking (`lastVirtualEnergy`, `lastVirtualEnergyUsage`), diff calculation in `SaveData`, wiring in `ProcessR3EData`; consumption data saved on all laps (not just valid ones)
- `Services/LapDataService.cs` — `VirtualEnergyUsage` in Log switch and `GetCombinationSummary`
- `Migrations/20260406140000_AddVirtualEnergyUsages.cs` — DB migration to create the `VirtualEnergyUsages` table

### HTML
- `Pages/Index.cshtml` — added `#virtual-energy-data` container with all 7 element spans

## Design Decisions

- **Percentage display for VE Left, To End, To Add**: matches in-game pit menu format where drivers see VE as a percentage
- **No FuelUsageContext equivalent for VE**: VE has no rate multiplier setting in R3E (unlike fuel with 1x/2x/etc), so `VirtualEnergyUsage` extends `LapPointer<double>` directly without a context
- **Only tracks VE diff > 0**: negative diffs (energy regeneration between laps) are ignored, only consumption is logged
- **Consumption data saved on all laps (valid and invalid)**: fuel, VE, and tire wear are logged to the DB regardless of lap validity so averages populate immediately. Only best-lap telemetry is gated on lap validity.
- **DB migration required**: existing databases need the `VirtualEnergyUsages` table. Migration `20260406140000_AddVirtualEnergyUsages` handles this automatically via EF Core `context.Database.Migrate()`.
