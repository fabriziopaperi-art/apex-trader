@echo off
echo.
echo  APEX TRADER - AVVIO
echo.
IF NOT EXIST node_modules (
  echo  Installazione dipendenze (solo la prima volta)...
  npm install
  echo.
)
echo  Avvio server su http://localhost:3000
echo.
node server.js
pause
