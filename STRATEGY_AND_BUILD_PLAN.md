# Ambient Studio — Strategy & Build Plan (July 2026 review)

> Product review conducted 2026-07-05. Companion to `PRODUCT_PLAN.md` (which holds the
> engineering log, licensing detail, and go-to-market mechanics). This doc answers:
> consumer vs. niche, what makes us original, and what to build next in what order.

---

## 1. Strategic verdict: creator tool, not consumer app

**Stay in the coach/creator niche. Do not pivot to a consumer listening product.**

- Consumer relaxation audio is saturated by Calm, Headspace, Endel, BetterSleep, myNoise,
  plus infinite free YouTube/Spotify sleep content. Those players win on content libraries,
  mobile apps, subscription retention, and marketing spend a solo maker can't match.
- But those are all **listening products**. There is almost no good **making product**.
  A coach who needs session music today has four bad options:
  1. **Royalty-free packs** (Music of Wisdom, Enlightened Audio, etc.) — same tracks every
     other coach uses; licenses often exclude meditation apps or charge upgrades.
  2. **Commission a composer** — hundreds of dollars per track.
  3. **Learn a DAW** — a skill cliff most coaches never climb.
  4. **AI generators** (Mubert, Soundraw, Suno) — generic output, subscriptions, murky
     licensing/provenance that makes coaches nervous.

**Our wedge:** *"Make your own unique, session-length, commercially licensed track in five
minutes — no audio skills."* In 2026, "hand-crafted human recordings from Norway, no AI
provenance questions" is a genuine selling point, not just a nice story. Lead with it.

**Consumer exposure strategy:** the free demo is a *toy that markets the tool* — the
Shuffle button is the shareable "generate your sanctuary" moment. It is not a product line.

---

## 2. Differentiators to finish and center

### a) The guided-session studio — the killer feature
Voice-over + auto-ducking is shipped but buried as one card among ten. Nobody serves this:
coaches record narration on a phone, then fight Audacity to lay music under it. Reposition
Ambient Studio as: *"record or import your narration — we handle the music, ducking, bells,
fades, and export a finished guided meditation."* That's not a music tool; it's a **session
production studio**, with no direct competitor at hobbyist price.

Two gaps to close:
- **In-browser recording** (currently import-only): `getUserMedia` + MediaRecorder — small build.
- **Multiple voice segments with timed placement**: "intro at 0:00, body at 4:00, closing
  at 18:00." A simple list UI (segment + start-time) beats one-clip-at-the-start.

### b) Uniqueness as a feature
Every Auto-Drift render is one-of-a-kind. Coaches hate finding "their" track under someone
else's video. Say it explicitly in marketing: **"No two exports are identical — your track
exists nowhere else."** Consider embedding a render seed/fingerprint in file metadata to
make it tangible.

### c) Breath-pacing pads (rare in the market, cheap for us)
Pads swell at a chosen breathing rate (coherent breathing 5.5/min, box breathing). Builds
directly on the existing swell engine and speaks the coach's language. Optional on-screen
breathing visual doubles as a screen-recordable video background for YouTube.

### d) Platform-ready exports
Coaches don't know LUFS; they know "Insight Timer rejected my file." Export presets named
after destinations — **Insight Timer / YouTube / Podcast / In-studio** — with correct
loudness + format baked in. Quiet superpower; no competitor offers it.

### e) Scene Journeys (already planned, §6 of PRODUCT_PLAN.md)
Sequence 2–4 saved presets with minutes-per-scene and crossfades. A 30-min yoga nidra that
moves forest → ocean → stillness is exactly what this audience produces. The simple
reuse-presets version is right; no timeline editor.

---

## 3. UX direction: the customer is a teacher on an iPad, not a producer

The current UI is an honest control panel — right for Thea, intimidating for the buyer.
Three structural changes:

1. **Lead with outcome, not controls.** First screen asks *"What is this session for?"*
   (Sleep / Deep meditation / Breathwork / Focus / Yoga nidra) → *"How long?"* → instant
   sensible mix (right brainwave band, pulse tempo, curated sounds) → then tweak. Mostly
   re-sequencing what exists (presets + shuffle) into a wizard. Full mixer stays one tap away.
2. **Progressive disclosure.** Collapse each card to essentials (sound picker + level
   slider) with an "Advanced" expander hiding carrier Hz, timbre, movement, harmonizer.
   Rename toward function: "Sparks" → "Melody & Instruments", "Harmonic Floor Swells" →
   "Background Pad"; give "Binaural & Isochronic" a plain subtitle ("gentle brainwave
   tones — headphones recommended").
3. **Audition before committing.** Hover/tap-preview library sounds before loading into a
   slot. Choosing blind from 30+ sparks is real friction; small feature, big quality jump.

Supporting polish:
- **Onboarding golden path** (60 seconds): "Press Shuffle. Press Play. Press Export." The
  free 60s export cap makes their first track the demo.
- **Export experience:** progress bar + time estimate; useful filenames
  (`Sleep-Journey_30min_Theta_2026-07-05.mp3`); creator name in metadata (white-label, cheap).
- **iPad Safari pass:** sliders + drag-drop on tablet — this demographic's device.
- **Trust surface:** landing page gallery of 3–4 finished renders ("hear what you can make
  in 5 minutes") + one plain-English license box: "Use it in your sessions, courses,
  YouTube, Insight Timer. Don't resell the raw audio." License clarity is the #1 purchase
  objection.

---

## 4. Pricing & distribution

- **Validate at** founder ~$29 → regular ~$49 one-time (as decided in PRODUCT_PLAN.md §8).
- **Once guided-session features land**, split tiers: **Personal ~$29 / Creator-commercial
  ~$79–99**. A commercial-license production tool is worth more than a toy; capture that
  without a subscription.
- **Sample/preset packs** = recurring revenue, reuses the Etsy muscle. Keep.
- **The honest risk is distribution, not product.** The app already outclasses what this
  audience has; the work is *legibility* (approachable power) and *reach*. Word-of-mouth in
  teacher communities beats features: Insight Timer teacher forums, meditation/coach
  Facebook groups, yoga-teacher trainings, plus YouTube demo content and the Etsy funnel.

---

## 5. Recommended build plan (priority order)

The first three phases turn "interesting mixer" into "the tool meditation teachers tell
each other about." Ship and announce each phase; don't batch.

### Phase 1 — Guided-session studio (biggest differentiator)
- [ ] In-browser voice recording (`getUserMedia` + MediaRecorder) alongside file import.
- [ ] Multi-segment narration: list of segments, each with a start time; ducking applies
      per segment in live preview and render.
- [ ] Promote the voice-over card visually — it's the headline feature, not card #8.
- [ ] Marketing copy shift: "export a finished guided meditation," uniqueness promise.

### Phase 2 — Legibility (outcome-first UX)
- [x] Goal wizard: purpose → length → auto-configured mix (maps to curated presets).
- [x] Curated session profiles and mood palettes with controlled variations.
- [x] Initial progressive disclosure and plain-function workspace labels.
- [ ] Library sound audition (preview on hover/tap before loading).
- [ ] First-run golden path: Shuffle → Play → Export 60s.
- [x] Automated desktop, iPad, and mobile Chromium QA pass.

### Phase 3 — Platform-ready exports
- [ ] Loudness/format presets: Insight Timer, YouTube, Podcast, In-studio.
- [ ] Export progress bar + time estimate; descriptive default filenames.
- [ ] Creator name + title + render seed in file metadata.

### Phase 4 — Breath pacing
- [ ] Pad swells locked to breathing rate (presets: coherent 5.5/min, box, custom).
- [ ] Optional on-screen breathing guide (doubles as video background).

### Phase 5 — Scene Journeys
- [ ] Sequence 2–4 preset "scenes," minutes per scene, crossfade in render engine.
      (Simple version per PRODUCT_PLAN.md §6 — no timeline UI.)

### Phase 6 — Packs & pricing evolution
- [ ] Sample-pack manifest system (folder + manifest → sellable pack; ties into Etsy).
- [ ] Tier split: Personal / Creator-commercial, once Phases 1–3 justify the higher price.
- [ ] Landing page: render gallery, plain-English license box, testimonials as they come.

### Ongoing / parallel
- Distribution experiments: teacher communities, YouTube demos, Etsy funnel cross-links.
- Keep the free GitHub Pages demo as the shareable toy.

---

## 6. Explicitly deprioritized
- Consumer listening app / mobile apps / subscription content engine — wrong fight.
- Full timeline/DAW editor — Scene Journeys covers 80% at 20% cost.
- Artifact-free pitch-shifting harmonizer — deferred until a paying customer asks.

---

## 7. Work log — 2026-07-15

- Reframed the product around creating finished guided meditations rather than exposing
  an audio control panel first.
- Shipped the outcome-first setup and four-step studio workspace to Netlify.
- Added `session-presets.js`: five session behaviors (Guided, Sleep, Breathwork, Yoga Nidra,
  Ambient) combine with four feelings (Grounded, Deep, Ethereal, Hopeful) for 20 curated
  starting points.
- Each starting point sets sound pools, layer levels, pad behavior, entrainment, pulse,
  bells, narration ducking, fades, and Auto-Drift. Added an in-palette variation button.
- Renamed Hearth Fire to Fireplace. Sleep now uses only Soft White Noise, Underwater, or
  Fireplace for its texture layer after listening review.
- Validation: all 20 combinations, controlled variation, Auto-Drift, responsive layouts,
  playback, and free WAV export passed automated browser tests.
- Recommended next session: add tap-to-preview audition controls for library sounds, then
  continue narration with in-browser recording and timed voice segments.
