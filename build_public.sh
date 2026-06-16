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
cp license.html      public/
cp library.json      public/
cp robots.txt        public/ 2>/dev/null || true
cp sitemap.xml       public/ 2>/dev/null || true
cp llms.txt          public/ 2>/dev/null || true
cp ./*.mp3           public/ 2>/dev/null || true

echo "Built ./public with:"
ls -1 public | sed 's/^/  /'
echo ""
echo "Functions are served from ./netlify/functions (see netlify.toml)."
echo "Next: netlify deploy --prod   (or drag the folder into the Netlify UI)."
