@echo off
:: ═══════════════════════════════════════════════════════════════
:: CLEANUP LOCKED DIRECTORIES - Run after restart
:: FOR THE KIDS - 50/30/20 IMMUTABLE
:: ═══════════════════════════════════════════════════════════════

echo.
echo =========================================================================
echo   GOSPEL FLEET - CLEANUP LOCKED DIRECTORIES
echo =========================================================================
echo.

cd /d C:\AiCollabForTheKids

echo [1/3] Removing archive...
rmdir /s /q archive 2>nul && echo   OK: archive removed || echo   SKIP: archive not found

echo [2/3] Removing claude-droid...
rmdir /s /q claude-droid 2>nul && echo   OK: claude-droid removed || echo   SKIP: claude-droid not found

echo [3/3] Removing claude-relay...
rmdir /s /q claude-relay 2>nul && echo   OK: claude-relay removed || echo   SKIP: claude-relay not found

echo.
echo =========================================================================
echo   CLEANUP COMPLETE - Verifying...
echo =========================================================================
dir /b /ad
echo.
echo =========================================================================
echo   FOR THE KIDS - 50/30/20 IMMUTABLE
echo =========================================================================
echo.

:: Self-delete this script after running
del "%~f0"
