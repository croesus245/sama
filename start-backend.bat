@echo off
echo ========================================
echo MWG Hostels - Start Backend Server
echo ========================================
echo.

cd /d "C:\Users\croes\Desktop\sama\backend"

echo Starting server on port 5000...
echo Keep this window open while using the platform!
echo.
echo Press Ctrl+C to stop the server
echo.

node simple-server.js

pause
