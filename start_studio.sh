#!/bin/bash
# Clean, welcoming launch script for Thea's Ambient Studio Remixer

echo "=================================================="
echo "🌲 Welcome to your PineDesign Ambient Studio! 🌲"
echo "=================================================="
echo "This script starts a local, secure HTTP web server"
echo "on your computer to bypass browser CORS blocks."
echo ""
echo "Once started, the app will automatically fetch and"
echo "mix your 320kbps Norwegian loops on startup!"
echo "--------------------------------------------------"

# Get directory where the script is located
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
cd "$DIR"

# Verify that Python is available
if ! command -v python3 &> /dev/null
then
    echo "Error: python3 could not be found. Please install Python to run the server."
    exit 1
fi

echo "Starting server at: http://localhost:8000"
echo "Press Ctrl+C to close the server and stop the stream."
echo "--------------------------------------------------"

# Start the python HTTP server
python3 -m http.server 8000
