#!/bin/bash
# Easy screenshot script for Pi debugging with Claude

SCREENSHOT_DIR="/home/increasinglyhuman/Documents/Claude/Phuzzy/temp/screenshots"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
FILENAME="Screenshot-${TIMESTAMP}.jpg"
FILEPATH="${SCREENSHOT_DIR}/${FILENAME}"

echo "Taking screenshot..."

# Take screenshot with scrot (delay 2 seconds for you to switch windows)
scrot -d 2 "$FILEPATH"

if [ $? -eq 0 ]; then
    echo "✅ Screenshot saved: $FILENAME"
    echo "📁 Located at: $FILEPATH"
    echo "💬 Tell Claude: 'hey look at the latest screenshot' and I'll check it!"
else
    echo "❌ Screenshot failed"
fi