# Adding New Samples — quick checklist

Everything happens in `~/Ambient_Studio`. The whole thing is ~3 steps; the rest is optional.

---

## The steps

### 1. Drop the `.mp3` into `~/Ambient_Studio/`
Name it with the right **prefix** so it auto-sorts into the correct slot:

| File name pattern | Goes to | Slot |
|---|---|---|
| `nature-*.mp3`  | **Grounding** (beds, water, wind, ocean) | A |
| `texture-*.mp3` | **Texture** (ASMR, crackles, atmospheres) | B |
| anything else   | **Sparks** (tonal/melodic — pads, organs, strings) | C |

Example: `nature-mountain-stream.mp3`, `texture-paper-rustle.mp3`, `glass-harmonica.mp3`.

### 2. Rebuild the library
```bash
./update_library.sh
```
This rescans the folder and regenerates `library.json`. Curated display names and keys
already in `library.json` are **preserved** — only new files get added.

### 3. (Sparks only) Set the musical key
New Sparks sounds default to key **`G`**. If the sound is tonal/melodic, open
`library.json` and change its `"key"` to the real key (e.g. `"C"`, `"Em"`, `"D"`), or the
harmonizer will transpose it oddly. Grounding/Texture sounds don't use a key — skip this.

### 4. Publish to the PAID app (Netlify)
```bash
git add -A && git commit -m "add new samples" && git push
```
Netlify auto-rebuilds from the push in ~1 minute. Live at
**https://pinedesignstudio.netlify.app/**

### 5. (Optional) Update the FREE demo too
```bash
./deploy.sh
```
Pushes to the GitHub Pages demo at **https://theapolar.github.io/ambient/**.
Only needed if you want the free "try it" site to have the new sounds too.

---

## The two sites (why there are two deploys)

- **Netlify** = the paid app. Updates **automatically** on every `git push`. (step 4)
- **GitHub Pages** = the free demo. Updates **only** when you run `./deploy.sh`. (step 5)

They're separate sites that share the same `index.html`.

---

## TL;DR
1. Drop `mp3` (named `nature-` / `texture-` / or plain for sparks)
2. `./update_library.sh`
3. Fix the key in `library.json` if it's a melodic sound
4. `git add -A && git commit -m "..." && git push`  ← live on the paid app
5. `./deploy.sh`  ← optional, updates the free demo

> Don't want to touch git? Just say "I added samples" to Claude and it'll do steps 2–5
> (and double-check the keys).
