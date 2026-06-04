#!/bin/bash
# 
# Ambient Studio Deployer
# Automates pushing code and samples to the live website.

set -e

REPO_URL="git@github.com:Theapolar/Theapolar.github.io.git"
TEMP_DIR="/tmp/ambient_deploy_$(date +%s)"
SOURCE_DIR="/home/thea/Ambient_Studio"

echo "=== Starting Ambient Studio Deployment ==="

# 1. Clone the GitHub Pages site repo temporarily
echo "→ Cloning website repository..."
git clone --depth 1 "$REPO_URL" "$TEMP_DIR"

# 2. Sync files into the /ambient folder
echo "→ Copying files and samples..."
mkdir -p "$TEMP_DIR/ambient"
cp "$SOURCE_DIR/index.html" "$TEMP_DIR/ambient/index.html"
cp "$SOURCE_DIR/license.html" "$TEMP_DIR/ambient/license.html"
cp "$SOURCE_DIR/library.json" "$TEMP_DIR/ambient/library.json"
cp "$SOURCE_DIR"/*.mp3 "$TEMP_DIR/ambient/"

# 3. Commit and Push back to GitHub
echo "→ Deploying to GitHub..."
cd "$TEMP_DIR"
git config user.name "Thea Borch"
git config user.email "thea@theaborch.com"
git config core.sshCommand "ssh -i /home/thea/.ssh/thea_github -o StrictHostKeyChecking=no"

git add ambient/index.html ambient/license.html ambient/library.json ambient/*.mp3
if git diff --cached --quiet; then
    echo "  ✓ Everything is already up to date on your live site!"
else
    git commit -m "feat: deploy updated Ambient Studio with customizable synth floor & samples"
    git push origin main
    echo "  ✓ Successfully pushed changes to GitHub Pages!"
fi

# 4. Cleanup
echo "→ Cleaning up local temporary directories..."
rm -rf "$TEMP_DIR"

echo "=== Deployment Completed Successfully! ==="
