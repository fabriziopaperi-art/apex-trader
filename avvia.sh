#!/bin/bash
echo ""
echo "  APEX TRADER - AVVIO"
echo ""
if [ ! -d "node_modules" ]; then
  echo "  Installazione dipendenze (solo la prima volta)..."
  npm install
  echo ""
fi
echo "  Server su http://localhost:3000"
echo ""
node server.js
