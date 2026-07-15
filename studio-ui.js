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
    }

    function selectLibrarySound(slot, offset) {
        const select = document.getElementById(`library-select-${slot}`);
        if (!select || select.options.length < 2) return;
        const candidates = Array.from(select.options).filter((option) => option.value);
        const picked = candidates[offset % candidates.length];
        if (picked) setControl(select.id, picked.value);
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

    async function configureSession() {
        await waitForLibrary();
        const type = selected('session-type') || 'guided';
        const length = selected('session-length') || '600';
        const mood = selected('session-mood') || 'grounded';
        const moodIndex = ['grounded', 'deep', 'ethereal', 'hopeful'].indexOf(mood);

        setControl('render-length', length, false);
        setControl('synth-movement', type === 'sleep' ? 'deepbass' : 'swells');
        setControl('entrain-mode', type === 'ambient' ? 'off' : (type === 'breathwork' ? 'isochronic' : 'binaural'));
        setControl('entrain-band', type === 'sleep' ? '2.5' : (type === 'breathwork' ? '10' : '6'));

        const pulse = document.getElementById('pulse-toggle');
        if (type === 'breathwork' && pulse?.textContent === 'Enable Pulse') pulse.click();
        if (type !== 'breathwork' && pulse?.textContent === 'Pulse Active') pulse.click();

        selectLibrarySound(1, moodIndex + 1);
        selectLibrarySound(2, moodIndex + 3);
        selectLibrarySound(3, moodIndex + 2);

        title.textContent = `${labels[type]} · ${Number(length) / 60} minutes · ${mood}`;
        const narrationSection = document.getElementById('workspace-narration');
        if (narrationSection) narrationSection.hidden = type === 'ambient';
        revealWorkspace();
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
})();
