# Ambient Studio — Product Plan & Roadmap

> **Vision:** A web app that lets meditation coaches and creators mix Thea's hand-crafted
> Norwegian recordings + nature/ASMR samples with real-time, self-harmonizing 432Hz
> ambient pads — and export unique, royalty-free, session-length tracks. Sold as a one-time
> licensed app (free demo + paid unlock via Gumroad), with add-on sample/preset packs,
> alongside the existing Etsy meditation-music packs.

_Last updated: 2026-06-03_

---

## 1. Where it runs (today)

- **Source of truth:** `~/Ambient_Studio/index.html` (single file, Web Audio API, Tailwind CDN, no build step).
- **Always-on locally:** systemd user service `ambient-studio.service` → `python http.server :8000` from this folder.
  - Reach it at: LAN `http://10.0.0.50:8000`, Tailscale `http://100.116.232.18:8000`, or SSH tunnel.
  - Edits to `index.html` appear on browser refresh — no restart needed.
  - Manage: `systemctl --user {status|restart|stop} ambient-studio`
- **Public site:** GitHub Pages via `./deploy.sh` → `Theapolar.github.io/ambient` (ships index.html + library.json + *.mp3).
- **Backups / old versions:** `~/_archive/` (pre-Phase-A backup + retired `ambient_remixer.html`).

---

## 2. Done so far ✅

- **Core engine:** 3 sample slots (Grounding / Texture / Sparks) + procedural 432Hz synth-pad floor.
- **Auto-Harmonizer:** pitch-tracks the tonal Sparks slot across a G→C→Em→D progression.
- **Auto-Drift:** slow random volume crossfades for endless variation.
- **Tuning / timbre / movement** controls (432/528/440, sine/triangle/saw, swells vs drone).
- **Phase A — Studio Export:** fixed-length offline render (1–60 min) → **WAV (lossless)** or **MP3 320**, with intro/outro fades, peak normalization to −1 dB, and Auto-Drift baked in. Renders far faster than real-time.
- **Phase A — Preset "Recipes":** save/load all settings; import/export as `.json` to back up or share a signature sound.
- **Data-driven library:** dropdowns build from `library.json`. Add a sound = drop the mp3 in this folder, run `./update_library.sh`, refresh. (Auto-files by name prefix: `nature-*`→Grounding, `texture-*`→Texture, else Sparks. Curated names/keys preserved.)
- Live **file upload/drag-drop** per slot for one-off custom sounds.
- **Surrender & Shuffle** (2026-06-03): one-tap random mix — picks a random sound per category, randomizes levels, starts playback + Auto-Drift. Per-slot 🔓/🔒 **lock** keeps chosen layers across shuffles.
- **Pulse Engine** (2026-06-03): synthesized warm sub-bass beats (soft sine kick w/ pitch drop + lowpass), chord-root locked. Controls: on/off, tempo 40–90 BPM, pattern (steady/sparse/heartbeat), level. Plays live and bakes into renders; saved in presets.
- Floor pad default level lowered 60% → 45% (sits under the 50% sample layers).
- **Deep Bass floor voicing** (2026-06-03, now the default Movement mode): drops the harsh upper chord tones (was 242/288 Hz) and plays warm low root + sub-octave + soft fifth as pure sine through a 180 Hz lowpass; still follows the chord progression so the harmonizer works. Old "Serene Swells" and "Static Drone" still selectable. Shared `getPadVoicing()` keeps live + render identical.
- **Binaural & Isochronic entrainment** (2026-06-03): mode (off/binaural/isochronic), brainwave band (Delta 2.5 / Theta 6 / Alpha 10 / Beta 18 Hz), carrier 80–400 Hz, level. Binaural = true L/R via ChannelMerger (headphones); isochronic = triangle-LFO amplitude pulse (speakers OK). In live + render + presets. Soft wording + headphone/non-medical note in UI.
- **Recorder removed** (2026-06-03): live MediaRecorder dropped — the offline render replaces it (higher quality, fixed-length, deterministic). NOTE: the render does NOT capture real-time manual fader moves; revisit a "record live performance" option only if a customer wants improvised capture.
- **Free/paid license gate** (2026-06-03): free = 60s export cap; valid Gumroad key unlocks all lengths (localStorage + background re-verify). Serverless validator `netlify/functions/verify-license.js` + `netlify.toml` + `license.html` + `build_public.sh` (keeps internal docs out of deploy) + `SETUP_PAYWALL.md`. App side complete; goes live once Thea does the Gumroad+Netlify steps.
- **Library expanded to 30 sounds** (2026-06-03): 5 grounding / 5 texture / 20 sparks (organs, string pads, brass, ASMR textures, ocean waves added).
- **Key-aware harmonizer** (2026-06-03): each Sparks sample now carries its real key in library.json; harmonizer transposes from the sample's own key to the nearest chord root (was: assumed everything in G). Custom uploads default to G. NOTE: transposes by root only, not mode — a major sample over a minor chord (or vice-versa) has a subtle third clash; fine for most ambient textures, could add mode-matching later if needed.
- **3-mode Harmonizer** (2026-06-03): Slot C "Harmonizer" selector — **Off (default)**, **Smooth** (ducks a per-slot harmGain, snaps pitch, fades back), **Glide** (tape sweep). Default is **Off** because the Deep Bass floor already carries the harmony, so untransposed atmospheric samples sit well over it — and on sustained sounds the Smooth dip can read as "cut off" / Glide swooshes. Harmonizer is now an opt-in creative tool. **Shuffle does NOT touch the harmonizer** (only sounds/levels/pad/drift), so shuffled mixes play with whatever mode is set (Off by default). Badge reflects mode. Works live + render + presets. Future: true time-preserving pitch-shift (granular/AudioWorklet) if the on-modes ever need to be artifact-free — deferred.

---

## 3. Roadmap (prioritized)

### NEXT — Make it sellable (the gate to revenue)
- **Paywall + auth.** Recommended lowest-lift path: host on **Netlify/Vercel** + sell **license keys via Lemon Squeezy or Gumroad** (they handle VAT/tax). A tiny serverless function validates the key before unlocking full-length/clean export. **Do not run billing on the 3GB home server.**
- **Tiers (suggested):** Free = mix + listen + short/​watermarked export. Paid = full-length clean commercial export + presets + new packs.
- **Licensing page:** explicit royalty-free commercial license on *exported* audio (YouTube, Insight Timer, Spotify, podcasts, in-studio).

### Phase B — Creator power features
- ✅ ~~Binaural beats + isochronic tones~~ — shipped 2026-06-03 (see §4).
- ✅ ~~Random Mixer / "Surrender & Shuffle"~~ — shipped 2026-06-03.
- ✅ ~~Rhythmic sub-bass / slow warm pulse~~ — shipped 2026-06-03 (see §5b).
- ✅ ~~Interval & ending bells~~ — shipped 2026-06-03 (synth singing-bowl, start/interval/ending, pitched to chord root; live = start+interval, export adds ending; presets; default off).
- **Breath-pacing pad mode** — pads swell at a chosen rate (e.g. 5.5 breaths/min) for coherent breathing; optional on-screen breathing guide.
- **Voice-over slot + auto-ducking** — import/record narration; music dips under the voice.
- **More layers** beyond 3; per-slot crossfade when swapping sounds.

### Phase C — Depth & growth
- **Scene "Journeys"** — sequence several preset recipes into one longer render with crossfades (see §6).
- **Master FX:** reverb size, warmth (lowpass), stereo width.
- **Platform loudness presets:** −14 LUFS (streaming), −16 (podcast), etc.
- **Branded/white-label exports:** embed creator name + title in file metadata.
- **PWA / offline install**, mobile gesture polish.
- **Sample-pack system:** a pack = folder of mp3s + manifest; sell/swap packs (ties into Etsy business).

---

## 4. Binaural beats & isochronic tones — recommendation: generate them in code

**You do NOT need to produce these as audio files.** They're pure tones and trivial to synthesize live with the Web Audio engine we already have — which also means they render perfectly into exports and can be tuned by the user.

- **Binaural beats:** two oscillators, one panned hard-left, one hard-right, a few Hz apart
  (e.g. left 200 Hz / right 204 Hz → perceived 4 Hz "beat"). **Requires headphones.**
- **Isochronic tones:** a single tone switched on/off (amplitude-modulated) at the beat rate
  via an LFO on a gain node. **Works on speakers** — generally the better default.
- **Brainwave presets to expose:** Delta 0.5–4 Hz (sleep), Theta 4–8 (deep meditation),
  Alpha 8–13 (relaxed focus), Beta 13–30 (alert). Let the user pick band + carrier + level.

**Why programmatic beats files:** infinitely adjustable, zero storage, always in tune with the
session, and no licensing questions. If Thea has her own produced beat files she prefers, they
can also just be added as library samples — but the synth approach is simpler and more flexible.

**Cautions (put in UI):** add a headphones note for binaural; keep isochronic pulsing gentle and
add a brief seizure/epilepsy caution; keep all wellness wording soft ("many find this calming"),
never medical claims (see §7).

---

## 5. Random Mixer / Shuffler — recommended, low effort

A one-tap **"Surrender & Shuffle"**: pick a random sound from each category in `library.json`,
load them, randomize levels, and engage Auto-Drift → an instant unique sanctuary. High delight,
small build, and a great demo/marketing moment. (Optionally: a "lock" toggle per slot so users
can keep one layer and reshuffle the rest, and a "shuffle within current key" rule for Sparks.)

---

## 6. Combining mixes into longer tracks — my take

**Worth doing, but later, and in a simple form.** Two interpretations:

1. **Just want long tracks?** Already solved — the export renders up to 60 min from one mix.
2. **Want a track that *evolves* through sections** (a "journey": 10 min forest → 10 min ocean → 10 min stillness)? That's an arrangement/sequencer feature and a bigger build.

**Recommended simple version (Phase C): "Scene Journeys."** Reuse what we have — let the user
save 2–4 preset recipes as "scenes," set minutes per scene, and have the render engine play each
scene then crossfade to the next. This delivers 80% of the value by reusing the preset + render
systems, without building a full timeline UI. A full drag-on-a-timeline editor is probably more
than this product needs — revisit only if customers ask.

**Other ideas worth considering:**
- Per-platform loudness export presets (§3 Phase C).
- Breathing/visual mode that doubles as a sellable video background (YouTube/screen use).
- "Daily unique" — a deterministic seed-of-the-day mix coaches can share with clients.
- Favorites/history of generated mixes.

---

## 5b. Rhythmic sub-bass / slow warm beats — yes, synthesize it

Those slow, warm, deep "suspended" beats in ambient electronica are very doable **in code** —
no drum samples needed — and the result stays in tune with the mix because we lock it to the
current chord root from the Auto-Harmonizer. Build it as a **"Pulse" module** alongside the pad:

- **Soft sub-kick:** a sine/triangle oscillator at the chord root, one octave down, with a fast
  pitch drop (e.g. 80→45 Hz over ~0.1 s) + a gain envelope (quick attack, long decay) = a round,
  warm thump rather than a sharp click.
- **Suspension / swell:** same idea with a slow attack and long release for a breathing sub-bass
  that "hangs" under the pad.
- **Tempo + pattern:** a slow grid (e.g. 40–70 BPM, or one hit every 2–4 s), with patterns like
  single pulse / heartbeat double-thump / on-beats-1&3. Tie to chord changes so it never clashes.
- **Warmth:** route through a lowpass filter + a touch of the existing reverb; keep it gentle.
- Renders cleanly into exports (it's just scheduled Web Audio nodes), and gets a level slider + on/off.

Optional alternative: Thea can drop her own produced beat loops in as library samples — but those
won't follow the harmony/tempo, so the synthesized Pulse module is the more cohesive route.
**Safety:** keep it subtle; nothing strobing.

## 7. Licensing & rights (important)

> Not legal advice — verify current terms before relying on these. Keep dated records of which
> account/plan generated each asset.

### ElevenLabs sounds — _can Thea use them here?_
- **Generally yes, on a PAID plan.** ElevenLabs grants commercial-use rights to audio you
  generate on paid tiers, including monetization. Best fit here: their **Sound Effects** /
  ambient/texture output as **Grounding or Texture layers**.
- **Free tier = NO commercial use** and requires attribution — don't sell anything made on it.
- **Two caveats to check in the current Terms:**
  1. **Redistribution as stock.** Using AI sounds *inside* a larger combined work (a mix/render the
     customer creates) is the safe pattern. **Selling the raw AI sound files as standalone
     downloadable sample packs** may bump into redistribution restrictions — treat that
     differently and confirm it's allowed.
  2. **Voices.** If any clip contains a cloned/real voice, extra consent rules apply. Pure
     ambient/SFX is lower-risk; guided-voice content needs care.
- **Practical fit note:** AI sounds aren't reliably pitched, so put them in Grounding/Texture, not
  the tonal **Sparks** slot (the Auto-Harmonizer assumes a known key — default G).
- **Action:** confirm Thea's ElevenLabs plan includes commercial rights, and decide the model
  (layers-in-a-mix = safe; reselling raw files = verify first).

### Your own recordings
- Thea's Norwegian field recordings and produced samples = hers to license. The product grants
  buyers a royalty-free commercial license on what they *export* — write this up on a terms page.

### 432Hz / 528Hz "Solfeggio" framing
- Fine as aesthetic/marketing language. **Avoid medical/health claims** ("cures," "heals,"
  "treats"). Use soft wording ("many find it calming / grounding") to stay clear of
  wellness-advertising regulations.

---

## 8. Go-to-market — DECIDED (2026-06-03)

**Model:** One-time purchase + **free demo** (freemium-lite). Not subscription at launch
(no monthly content engine yet; Etsy audience is used to one-time; validates demand first).
Recurring revenue comes from **add-on sample/preset packs** sold one-time (reuses the
`library.json` pack system + existing Etsy pack-making skill). Subscription = a *future*
option once there are several packs + steady sales.

**Free vs paid gate:** Free = mix, listen, short/watermarked export. Paid = full-length
clean export + all sounds + presets + commercial license.

**Launch:** time-limited **founder price** for existing Etsy customers (suggested ~$29
founder → ~$49 regular; add-on packs ~$9–19). Drives the Etsy funnel: try free → buy.

**Payments:** **Gumroad** (Thea already has an account). Merchant of record → handles
Norway/EU VAT. Has a license-key API. The app gate validates a **Gumroad license key**,
**independent of where the sale happened** — so keys can be issued by Gumroad checkout
(automatic) OR by Thea manually for an Etsy sale.

**Sales channels:**
- **Sample/preset packs → Etsy** (instant file download; Etsy handles VAT; built-in audience). Keep doing this.
- **App access → Gumroad checkout** (auto license key). Optionally also an **Etsy listing
  with manual key delivery** (Etsy can't auto-mint keys; Etsy also forbids redirecting a
  listing to external checkout, so fulfill the key inside the Etsy order/message).

**Hosting:** Netlify recommended (free tier + a serverless function to validate the Gumroad
key without CORS issues). Keep a free demo on the current GitHub Pages link. _(host not yet set up)_

**License terms (proposed — see §7 detail):** royalty-free commercial use in the buyer's own
works, live/guided sessions, and client/therapy distribution; **NOT** resellable/redistributable
as standalone audio products or sample packs; no claiming authorship of the sounds. One license per user.

### Build split
- **Claude builds (app side):** free/paid feature flags (export cap + watermark), "Unlock with
  license key" UI, serverless Gumroad-key validator, license/terms page, landing/pricing page.
- **Thea does (identity/money/signups):** create Gumroad product + set price + generate keys,
  pick/configure domain, set up Netlify account. (Step-by-step to be provided.)

## 9. Still open
- Confirm ElevenLabs plan + intended use (layers vs reselling files).
- Final pricing numbers + domain/brand name (PineDesign vs Thea Borch).
- Remaining Phase B order: bells, breath-pacing, voice-over.
