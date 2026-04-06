# Spec 002: ElectronNET.API Version Swap

## Problem

The project references `ElectronNET.API` v99.0.8 which is a custom/forked package not available on public NuGet. This prevents:
- `dotnet restore` on a fresh clone
- Running the app via `electronize start`
- xUnit tests that reference the main project

## Change

Swap `ElectronNET.API` from v99.0.8 to v23.6.2 (latest public release on nuget.org).

## Risk

The v99.0.8 fork may contain custom patches. Files that import `ElectronNET.API`:
- `IpcCommunication.cs`
- `HudLayout.cs`
- `Program.cs`
- `Startup.cs`
- `R3EDataService.cs`
- `VersionService.cs`
- `IR3EDataService.cs`
- `Settings.cshtml.cs`

API surface used: `BrowserWindow`, `Electron.IpcMain`, `Electron.WindowManager`, `OnTopLevel`, `IpcMain.Send`, `IpcMain.On`, standard Electron.NET patterns.

## Validation

After the swap:
1. `dotnet restore` must succeed
2. `dotnet build` must succeed
3. `electronize start` must launch the app
4. All TypeScript tests must still pass (no TS dependency on ElectronNET)
5. Manual test: launch with R3E running, verify HUD renders

## Result

Swap successful with one API fix required:

- `CommandLine.RemoveSwitch()` does not exist in v23.6.2 (was a custom addition in v99.0.8)
- Fix in `Startup.cs`: changed `SetHardwareAccelerationEnabled()` to only append switches when disabling. Re-enabling hardware acceleration requires an app restart.
- Also added `<DefaultItemExcludes>` in `ReHUD.csproj` to exclude `ReHUD.Tests/` from the main project build.
- Re-enabled the project reference in `ReHUD.Tests.csproj`.
- Installed `ElectronNET.CLI` v23.6.2 as a global dotnet tool.
- **Electron runtime version mismatch**: the public ElectronNET.CLI v23.6.2 ships with Electron 23.x, but the app requires Electron 26.x for transparent overlay windows to work correctly. The `run-dev.bat` script upgrades the host's Electron to 26.6.10 automatically.
- `VersionService` reads `Electron.App.GetVersionAsync()` as the "app version" — with Electron 23.x this returned `23.3.13`, triggering upgrade actions from v0.11.5 to v23.x. With Electron 26.x this is less problematic but still not ideal (the app version should come from the manifest, not Electron).

## Rollback

Revert `ReHUD.csproj` to reference v99.0.8 and undo the `Startup.cs` change if the public version causes runtime issues.
