@echo off
cd /d "%~dp0"

echo ========================================
echo Notice CMS
echo ========================================
echo.
echo Starting local web server...
echo Keep this window open while checking the site.
echo.
echo URL:
echo   http://localhost:3000/notices
echo.

start "" "http://localhost:3000/notices"

npm.cmd run dev -- --hostname 0.0.0.0 --port 3000

echo.
echo The server stopped. Press any key to close this window.
pause > nul
