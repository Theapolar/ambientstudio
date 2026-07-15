/* Outcome-first session setup.
 * This module deliberately talks to the existing studio through its DOM controls,
 * keeping the proven audio and render engines unchanged while the UI is redesigned.
 */
(function () {
    const setup = document.getElementById('session-setup');
    const workspace = document.getElementById('studio-workspace');
    const createButton = document.getElementById('create-session-btn');
    const skipButton = document.getElementById('skip-setup-btn');
    const changeButton = document.getElementById('change-session-btn');
    const title = document.getElementById('workspace-title');

    if (!setup || !workspace) return;

    const labels = {
        guided: 'Guided meditation', sleep: 'Sleep journey',
        breathwork: 'Breathwork', yoga: 'Yoga nidra', ambient: 'Ambient background'
    };
    const curated = window.AMBIENT_SESSION_PRESETS;
    let lastVariation = '';

    document.querySelectorAll('[data-choice-group]').forEach((group) => {
        group.addEventListener('click', (event) => {
            const button = event.target.closest('.setup-choice');
            if (!button) return;
            group.querySelectorAll('.setup-choice').forEach((choice) => {
                const selected = choice === button;
                choice.classList.toggle('is-selected', selected);
                choice.setAttribute('aria-pressed', String(selected));
            });
        });
    });

    function selected(group) {
        return document.querySelector(`[data-choice-group="${group}"] .is-selected`)?.dataset.value;
    }

    function setControl(id, value, notify = true) {
        const control = document.getElementById(id);
        if (!control) return;
        control.value = value;
        if (notify) control.dispatchEvent(new Event('change', { bubbles: true }));
        const segmented = document.getElementById(`${id}-seg`);
        segmented?.querySelectorAll('.seg-btn').forEach((button) => {
            button.classList.toggle('seg-btn-active', button.dataset.value === String(value));
        });
    }

    function setSlider(id, value) {
        const control = document.getElementById(id);
        if (!control) return;
        control.value = value;
        control.dispatchEvent(new Event('input', { bubbles: true }));
    }

    function setCheckbox(id, checked) {
        const control = document.getElementById(id);
        if (control) control.checked = checked;
    }

    function setToggle(id, enabled, activeLabel) {
        const button = document.getElementById(id);
        if (!button) return;
        const active = button.textContent.trim() === activeLabel;
        if (active !== enabled) button.click();
    }

    function shuffled(items) {
        return [...items].sort(() => Math.random() - 0.5);
    }

    function selectLibrarySound(slot, names) {
        const select = document.getElementById(`library-select-${slot}`);
        if (!select || select.options.length < 2) return;
        const candidates = shuffled(names)
            .map((name) => Array.from(select.options).find((option) => option.textContent === name))
            .filter(Boolean);
        const current = select.options[select.selectedIndex]?.textContent;
        const picked = candidates.find((option) => option.textContent !== current) || candidates[0];
        if (picked) setControl(select.id, picked.value);
        return picked?.textContent || '';
    }

    function waitForLibrary() {
        if (document.getElementById('library-select-1')?.options.length > 1) return Promise.resolve();
        return new Promise((resolve) => {
            let checks = 0;
            const timer = setInterval(() => {
                checks += 1;
                if (document.getElementById('library-select-1')?.options.length > 1 || checks >= 20) {
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    }

    async function configureSession(reveal = true) {
        await waitForLibrary();
        const type = selected('session-type') || 'guided';
        const length = selected('session-length') || '600';
        const mood = selected('session-mood') || 'grounded';
        const profile = curated?.sessions?.[type];
        const palette = curated?.moods?.[mood];
        if (!profile || !palette) return;

        setControl('render-length', length, false);
        setControl('synth-timbre', palette.timbre);
        setControl('synth-tuning', '432');
        setControl('synth-movement', profile.movement);
        setControl('harmonizer-mode', 'off');
        setSlider('vol-synth', profile.levels.pad);
        setSlider('vol-1', profile.levels.nature);
        setSlider('vol-2', profile.levels.texture);
        setSlider('vol-3', profile.levels.sparks);

        setControl('entrain-mode', profile.entrainment.mode);
        setControl('entrain-band', profile.entrainment.band);
        setSlider('entrain-carrier', profile.entrainment.carrier);
        setSlider('entrain-level', profile.entrainment.level);

        setSlider('pulse-tempo', profile.pulse.tempo);
        setControl('pulse-pattern', profile.pulse.pattern);
        setSlider('pulse-level', profile.pulse.level);
        setToggle('pulse-toggle', profile.pulse.enabled, 'Pulse Active');

        setCheckbox('bell-start', profile.bells.start);
        setControl('bell-interval', profile.bells.interval);
        setCheckbox('bell-end', profile.bells.end);
        setSlider('bell-level', profile.bells.level);
        setSlider('voice-level', profile.voice.level);
        setSlider('voice-duck', profile.voice.duck);
        setControl('render-fadein', profile.fades.in, false);
        setControl('render-fadeout', profile.fades.out, false);

        let chosen;
        for (let attempt = 0; attempt < 4; attempt += 1) {
            chosen = [
                selectLibrarySound(1, palette.nature),
                selectLibrarySound(2, profile.textures || palette.texture),
                selectLibrarySound(3, palette.sparks)
            ];
            if (chosen.join('|') !== lastVariation) break;
        }
        lastVariation = chosen.join('|');
        workspace.dataset.presetDrift = String(profile.drift);

        title.textContent = `${labels[type]} · ${Number(length) / 60} minutes · ${mood}`;
        const narrationSection = document.getElementById('workspace-narration');
        if (narrationSection) narrationSection.hidden = type === 'ambient';
        if (reveal) revealWorkspace();
        const variationButton = document.getElementById('curated-variation-btn');
        if (variationButton) {
            variationButton.textContent = `Another ${mood} variation`;
            variationButton.title = chosen.filter(Boolean).join(' · ');
        }
    }

    function revealWorkspace() {
        setup.hidden = true;
        workspace.hidden = false;
        workspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    createButton?.addEventListener('click', configureSession);
    skipButton?.addEventListener('click', () => {
        const narrationSection = document.getElementById('workspace-narration');
        if (narrationSection) narrationSection.hidden = false;
        revealWorkspace();
    });
    changeButton?.addEventListener('click', () => {
        workspace.hidden = true;
        setup.hidden = false;
        setup.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    workspace.addEventListener('click', (event) => {
        if (event.target.closest('#curated-variation-btn')) configureSession(false);
    });

    // Profiles can request Auto-Drift, but it can only be engaged after audio starts.
    document.getElementById('master-play')?.addEventListener('click', () => {
        if (workspace.dataset.presetDrift !== 'true') return;
        const playText = document.getElementById('play-btn-text')?.textContent;
        const driftText = document.getElementById('drift-btn-text')?.textContent;
        if (playText === 'Pause Soundstage' && driftText === 'Enable Auto-Drift') {
            document.getElementById('drift-btn')?.click();
        }
    });
})();
