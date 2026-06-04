#!/bin/bash
#
# Ambient Studio - Library Updater
# Scans this folder for .mp3 files and (re)builds library.json.
#
#   - Files named  nature-*   -> "grounding" slot (Slot A)
#   - Files named  texture-*  -> "texture"   slot (Slot B)
#   - Everything else         -> "sparks"    slot (Slot C, tonal/harmonized)
#
# Curated display names and keys already in library.json are PRESERVED.
# New files get an auto-generated name; remove this script's guess by editing
# library.json afterwards if you like.
#
# Usage:   ./update_library.sh
#
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

python3 - <<'PY'
import json, os, re, collections

MANIFEST = "library.json"

# 1. Load existing manifest so curated names/keys/categories survive.
old = {}
if os.path.exists(MANIFEST):
    try:
        data = json.load(open(MANIFEST))
        for cat, items in data.items():
            for it in items:
                old[it["file"]] = {"name": it.get("name"), "key": it.get("key"), "category": cat}
    except Exception as e:
        print(f"  ! Could not read existing {MANIFEST} ({e}); rebuilding from scratch.")

def categorize(fname):
    low = fname.lower()
    if low.startswith("nature-"):
        return "grounding"
    if low.startswith("texture-"):
        return "texture"
    return "sparks"

def pretty(fname):
    stem = re.sub(r"\.mp3$", "", fname, flags=re.I)
    stem = stem.replace("Sample_", "").replace("_", " ").replace("-", " ")
    stem = re.sub(r"\s+", " ", stem).strip()
    return stem.title()

# 2. Scan folder.
files = sorted(f for f in os.listdir(".") if f.lower().endswith(".mp3"))

lib = collections.OrderedDict([("grounding", []), ("texture", []), ("sparks", [])])
added, kept = [], []

for f in files:
    prev = old.get(f)
    cat = prev["category"] if prev and prev.get("category") in lib else categorize(f)
    name = prev["name"] if prev and prev.get("name") else pretty(f)
    entry = {"name": name, "file": f}
    if cat == "sparks":
        entry["key"] = (prev.get("key") if prev else None) or "G"
    lib[cat].append(entry)
    (kept if prev else added).append(f)

removed = [f for f in old if f not in files]

json.dump(lib, open(MANIFEST, "w"), indent=2, ensure_ascii=False)
open(MANIFEST, "a").write("\n")

print(f"  Library rebuilt: {sum(len(v) for v in lib.values())} samples "
      f"({len(lib['grounding'])} grounding / {len(lib['texture'])} texture / {len(lib['sparks'])} sparks)")
if added:   print("  + added:   " + ", ".join(added))
if removed: print("  - removed (file gone): " + ", ".join(removed))
if not added and not removed:
    print("  (no changes — all files already in manifest)")
PY

echo "Done. Refresh the app in your browser to see the updated list."
