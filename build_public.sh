#!/bin/bash
#
# Assembles a clean ./public folder for Netlify deploy.
# Only deployable assets are copied — internal docs (PRODUCT_PLAN.md, setup
# notes) and scripts stay OUT of the public site.
#
# Usage:  ./build_public.sh   then   netlify deploy --prod
#
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

rm -rf public
mkdir -p public

cp index.html        public/
cp studio-ui.css     public/
cp studio-ui.js      public/
cp session-presets.js public/
cp workspace-layout.js public/
cp license.html      public/
cp library.json      public/
cp robots.txt        public/ 2>/dev/null || true
cp sitemap.xml       public/ 2>/dev/null || true
cp llms.txt          public/ 2>/dev/null || true
cp google*.html      public/ 2>/dev/null || true   # Google Search Console verification file
cp favicon-32.png    public/ 2>/dev/null || true   # served favicon (1024 favicon.png kept in repo as source only)
cp apple-touch-icon.png public/ 2>/dev/null || true
cp og-image.png      public/ 2>/dev/null || true   # social link preview image
cp ./*.mp3           public/ 2>/dev/null || true

echo "Built ./public with:"
ls -1 public | sed 's/^/  /'
echo ""
echo "Functions are served from ./netlify/functions (see netlify.toml)."
echo "Next: netlify deploy --prod   (or drag the folder into the Netlify UI)."
