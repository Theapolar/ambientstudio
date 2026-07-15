/* Studio information architecture.
 * Moves the existing, already-wired controls into outcome-oriented sections.
 * appendChild preserves all event listeners and live Web Audio state.
 */
(function () {
    const workspace = document.getElementById('studio-workspace');
    const heading = workspace?.querySelector('.workspace-heading');
    if (!workspace || !heading) return;

    function section(kicker, title, description, id) {
        const node = document.createElement('section');
        node.id = id;
        node.className = 'workspace-section';
        node.innerHTML = `
            <header class="section-heading">
                <span class="section-number" aria-hidden="true"></span>
                <div>
                    <span class="eyebrow">${kicker}</span>
                    <h2>${title}</h2>
                    <p>${description}</p>
                </div>
            </header>
            <div class="section-content"></div>`;
        return node;
    }

    function append(sectionNode, id) {
        const item = document.getElementById(id);
        if (item) sectionNode.querySelector('.section-content').appendChild(item);
    }

    const narration = section(
        'Narration', 'Add your guidance',
        'Upload your voice track and choose how gently the soundscape moves beneath it.',
        'workspace-narration'
    );
    append(narration, 'card-narration');

    const soundscape = section(
        'Soundscape', 'Shape the atmosphere',
        'Preview your session, shuffle a starting point, then balance nature, atmosphere, melody and the background pad.',
        'workspace-soundscape'
    );
    append(soundscape, 'studio-transport');
    append(soundscape, 'studio-shuffle');
    append(soundscape, 'soundscape-layers');

    const moments = section(
        'Session moments', 'Add rhythm, bells and meditation tones',
        'Optional details for pacing the experience. Leave them off for a simple, spacious mix.',
        'workspace-moments'
    );
    const momentGrid = document.createElement('div');
    momentGrid.className = 'moment-grid';
    moments.querySelector('.section-content').appendChild(momentGrid);
    ['card-pulse', 'card-bells', 'card-entrainment'].forEach((id) => {
        const card = document.getElementById(id);
        if (card) momentGrid.appendChild(card);
    });

    const output = section(
        'Finish', 'Save and export your session',
        'Keep the sound as a reusable recipe or render a finished audio file.',
        'workspace-output'
    );
    append(output, 'studio-exports');

    [narration, soundscape, moments, output].forEach((node) => workspace.appendChild(node));

    const consoleBox = document.getElementById('console-box');
    if (consoleBox) {
        const details = document.createElement('details');
        details.className = 'status-details';
        details.innerHTML = '<summary>Studio status</summary>';
        details.appendChild(consoleBox);
        workspace.appendChild(details);
    }

    // The pad's specialist synthesis controls should not compete with sound and level.
    const padCard = document.getElementById('card-synth');
    const timbre = document.getElementById('synth-timbre');
    const padControls = timbre?.closest('.grid');
    const padLevel = document.getElementById('vol-synth')?.closest('.space-y-2');
    if (padCard && padControls && padLevel) {
        const advanced = document.createElement('details');
        advanced.className = 'advanced-controls';
        advanced.innerHTML = '<summary>Advanced pad settings</summary>';
        advanced.appendChild(padControls);
        padCard.insertBefore(advanced, padLevel);
    }

    // Add accessible navigation for long tablet/desktop sessions.
    const nav = document.createElement('nav');
    nav.className = 'workspace-nav';
    nav.setAttribute('aria-label', 'Studio sections');
    nav.innerHTML = `
        <a href="#workspace-narration">Narration</a>
        <a href="#workspace-soundscape">Soundscape</a>
        <a href="#workspace-moments">Session moments</a>
        <a href="#workspace-output">Export</a>`;
    heading.after(nav);
})();
