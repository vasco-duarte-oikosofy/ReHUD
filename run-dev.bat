@echo off
echo === ReHUD Dev Launcher ===
echo.

set DOTNET_ROOT=%USERPROFILE%\.dotnet
set PATH=%USERPROFILE%\node-v20.18.1-win-x64;%USERPROFILE%\.dotnet;%USERPROFILE%\.dotnet\tools;%CD%\obj\Host\node_modules\.bin;%PATH%

echo [1/4] Compiling TypeScript + Webpack...
call npm run prestart
if errorlevel 1 (
    echo ERROR: TypeScript/Webpack build failed
    pause
    exit /b 1
)

echo.
echo [2/4] Copying node.exe for Electron host...
if not exist "obj\Host\node_modules\.bin\node.exe" (
    copy "%USERPROFILE%\node-v20.18.1-win-x64\node.exe" "obj\Host\node_modules\.bin\node.exe" >nul 2>&1
)

echo.
echo [3/4] Ensuring Electron 26 in host (matching installed ReHUD)...
for /f "tokens=*" %%i in ('node -e "console.log(require('./obj/Host/node_modules/electron/package.json').version)"') do set ELECTRON_VER=%%i
echo      Electron version: %ELECTRON_VER%
if not "%ELECTRON_VER:~0,2%"=="26" (
    echo      Upgrading Electron to v26...
    pushd obj\Host
    call npm install electron@26.6.10 --save-dev
    popd
    copy "%USERPROFILE%\node-v20.18.1-win-x64\node.exe" "obj\Host\node_modules\.bin\node.exe" >nul 2>&1
)

echo.
echo [4/4] Launching ReHUD...
echo      Close this window to stop ReHUD.
echo.
electronize start
