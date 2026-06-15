#!/bin/bash
#
# Ambient Studio - Library Updater
# Scans this folder for .mp3 files and (re)builds library.json.
#
#   - Files named  nature-*   -> "grounding" slot (Slot A)
#   - Files named  texture-*  -> "texture"   slot (Slot B)
#   - Everything else         -> "sparks"    slot (Slot C, tonal/harmonized)
#
# For sparks, tags and the display name are parsed from the filename. Put any of
# these words in the filename and they become filter tags (case-insensitive):
#   cinematic, grounded, etheral, deep (or depth), nostalgic, hopeful (or hopefull)
# A leading key letter (e.g. "G-") is read as the musical key and stripped from
# the name. Example: "G-grounded-nostalgic analog dreams.mp3"
#   -> name "Analog Dreams", key "G", tags ["grounded","nostalgic"]
#
# Curated names/keys/tags already in library.json are PRESERVED; files that no
# longer exist on disk are dropped automatically.
#
# Usage:   ./update_library.sh
#
set -e
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$DIR"

python3 - <<'PY'
import json, os, re, collections

MANIFEST = "library.json"

# Filename word -> canonical tag (only these six are surfaced in the UI).
TAG_MAP = {
    "cinematic": "cinematic",
    "grounded": "grounded",
    "etheral": "ethereal", "ethereal": "ethereal",
    "deep": "deep", "depth": "deep",
    "nostalgic": "nostalgic",
    "hopeful": "hopeful", "hopefull": "hopeful",
}
TAG_ORDER = ["cinematic", "grounded", "ethereal", "deep", "nostalgic", "hopeful"]
NOISE = {"sample", "loop"}  # dropped from generated names

# 1. Load existing manifest so curated names/keys/tags survive.
old = {}
if os.path.exists(MANIFEST):
    try:
        data = json.load(open(MANIFEST))
        for cat, items in data.items():
            for it in items:
                old[it["file"]] = {
                    "name": it.get("name"), "key": it.get("key"),
                    "category": cat, "tags": it.get("tags"),
                }
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

# Musical key token: a root (A–G, optional #/b) with an optional quality.
# Matches "G", "C#", "Cmaj", "Amin", "Gmin", "Abmaj", "F#min", "C major", ...
KEY_RE = re.compile(r"^([A-Ga-g])([#b]?)(maj|min|major|minor)?$", re.I)

def parse_key(tok):
    m = KEY_RE.match(tok)
    if not m:
        return None
    root = m.group(1).upper() + (m.group(2) or "").lower()
    q = (m.group(3) or "").lower()
    if q.startswith("maj"):
        return f"{root} major"
    if q.startswith("min"):
        return f"{root} minor"
    return root

def parse_spark(fname):
    """Return (name, key, tags) for a tonal sample, parsed from its filename."""
    stem = re.sub(r"\.mp3$", "", fname, flags=re.I)
    raw = re.sub(r"[-_]+", " ", stem)
    raw = re.sub(r"\s+", " ", raw).strip()
    tags, key, name_tokens = [], None, []
    for tok in raw.split(" "):
        low = tok.lower()
        if low in TAG_MAP:
            t = TAG_MAP[low]
            if t not in tags:
                tags.append(t)
            continue
        k = parse_key(tok)
        if k:
            if key is None:
                key = k
            continue
        if low in NOISE or re.fullmatch(r"\d+", tok):
            continue
        name_tokens.append(tok)
    name = " ".join(name_tokens).strip().title()
    tags = [t for t in TAG_ORDER if t in tags]   # stable order
    return name, key, tags

# 2. Scan folder.
files = sorted(f for f in os.listdir(".") if f.lower().endswith(".mp3"))

lib = collections.OrderedDict([("grounding", []), ("texture", []), ("sparks", [])])
added, kept = [], []

for f in files:
    prev = old.get(f)
    cat = prev["category"] if prev and prev.get("category") in lib else categorize(f)
    if cat == "sparks":
        pname, pkey, ptags = parse_spark(f)
        name = (prev.get("name") if prev else None) or pname or f
        # The key written in the filename is the source of truth (it's the
        # explicit intent); fall back to any curated key, then G.
        key = pkey or (prev.get("key") if prev else None) or "G"
        # Tags come from the filename (source of truth); keep any curated tags
        # only when the filename carries none.
        tags = ptags if ptags else ((prev.get("tags") if prev else None) or [])
        entry = {"name": name, "file": f, "key": key, "tags": tags}
    else:
        name = (prev.get("name") if prev else None) or pretty(f)
        entry = {"name": name, "file": f}
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
