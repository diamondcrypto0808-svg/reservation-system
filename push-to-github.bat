@echo off
echo ========================================
echo GitHub Push Script
echo ========================================
echo.
echo Repository: reservation-system
echo GitHub User: diamondcrypto0808-svg
echo.
echo ========================================
echo.

REM Clear any cached credentials
git credential reject protocol=https host=github.com 2>nul

echo Pushing to GitHub...
echo.
echo If prompted, please enter your GitHub credentials:
echo Username: diamondcrypto0808-svg
echo Password: Use your Personal Access Token (NOT your password)
echo.
echo To create a token: https://github.com/settings/tokens
echo.

git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Project deployed to GitHub
    echo ========================================
    echo.
    echo View your repository:
    echo https://github.com/diamondcrypto0808-svg/reservation-system
    echo.
    echo Next steps:
    echo 1. Go to https://vercel.com
    echo 2. Sign in with GitHub
    echo 3. Import your repository
    echo 4. Deploy!
    echo.
) else (
    echo.
    echo ========================================
    echo PUSH FAILED
    echo ========================================
    echo.
    echo Please try one of these solutions:
    echo.
    echo 1. Use GitHub Desktop (Easiest):
    echo    Download: https://desktop.github.com
    echo.
    echo 2. Create Personal Access Token:
    echo    Go to: https://github.com/settings/tokens
    echo    Then run this script again
    echo.
    echo 3. Check PUSH_NOW.md for detailed instructions
    echo.
)

pause
