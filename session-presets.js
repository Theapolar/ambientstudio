/* Curated session starting points.
 * Session profiles define pacing and mix behavior; mood palettes define which
 * PineDesign recordings belong together. The UI combines them at runtime so
 * all 20 session/mood choices remain intentional without duplicating recipes.
 */
window.AMBIENT_SESSION_PRESETS = {
    moods: {
        grounded: {
            nature: ['Fjord Stream', 'Lush Rain & Crackles', 'Whispering Wind'],
            texture: ['Fireplace', 'Crackle', 'ASMR Bubbling Water'],
            sparks: ['Neutral Drone Floor', 'Earth Strings', 'Complete Peace Flutes', 'String Pads', 'Air Piano', 'Neutral Soothing Pad Waves'],
            timbre: 'sine'
        },
        deep: {
            nature: ['Deep Ocean Swell', 'Ocean Waves', 'Lush Rain & Crackles'],
            texture: ['Underwater', 'Soft White Noise', 'ASMR Crackling Ice'],
            sparks: ['Earth Strings', 'Pads And Voices With Breathy Flutes', 'Singing Bowl Bass', 'Cave Ambience', 'Heavenly Organ Pureo', 'Bell Ambience'],
            timbre: 'sine'
        },
        ethereal: {
            nature: ['Whispering Wind', 'Fjord Stream', 'Ocean Waves'],
            texture: ['Wind & Chimes', 'ASMR Bubbling Water', 'Underwater'],
            sparks: ['Complete Peace Flutes', 'Panning Woodwind', 'Whispering Flutes', 'Bell Whispers And Breaths', 'Dripping Ambience Voicelike Flutes', 'Air Piano', 'Digital Voices', 'Bright Lights Pads'],
            timbre: 'triangle'
        },
        hopeful: {
            nature: ['Fjord Stream', 'Ocean Waves', 'Whispering Wind'],
            texture: ['Beach Swoosh', 'Wind & Chimes', 'ASMR Bubbling Water'],
            sparks: ['String Pads', 'Bright Lights Pads', 'Shimmering Pads And Flutes', 'Bells And String Swells', 'Heavenly Bliss Organ', 'Orchestral Bliss Pads'],
            timbre: 'triangle'
        }
    },
    sessions: {
        guided: {
            levels: { pad: 30, nature: 38, texture: 22, sparks: 25 },
            movement: 'deepbass', drift: true,
            entrainment: { mode: 'off', band: '6', carrier: 180, level: 15 },
            pulse: { enabled: false, tempo: 55, pattern: 'sparse', level: 28 },
            bells: { start: true, interval: '0', end: true, level: 35 },
            voice: { level: 90, duck: 55 }, fades: { in: 6, out: 10 }
        },
        sleep: {
            textures: ['Soft White Noise', 'Underwater', 'Fireplace'],
            levels: { pad: 42, nature: 40, texture: 28, sparks: 22 },
            movement: 'deepbass', drift: true,
            entrainment: { mode: 'binaural', band: '2.5', carrier: 140, level: 14 },
            pulse: { enabled: false, tempo: 45, pattern: 'sparse', level: 20 },
            bells: { start: false, interval: '0', end: false, level: 25 },
            voice: { level: 88, duck: 45 }, fades: { in: 15, out: 20 }
        },
        breathwork: {
            levels: { pad: 32, nature: 38, texture: 18, sparks: 24 },
            movement: 'swells', drift: false,
            entrainment: { mode: 'off', band: '10', carrier: 180, level: 12 },
            pulse: { enabled: true, tempo: 50, pattern: 'sparse', level: 32 },
            bells: { start: true, interval: '0', end: true, level: 38 },
            voice: { level: 90, duck: 52 }, fades: { in: 5, out: 8 }
        },
        yoga: {
            levels: { pad: 38, nature: 35, texture: 22, sparks: 28 },
            movement: 'deepbass', drift: true,
            entrainment: { mode: 'binaural', band: '6', carrier: 170, level: 14 },
            pulse: { enabled: false, tempo: 50, pattern: 'sparse', level: 22 },
            bells: { start: true, interval: '0', end: true, level: 40 },
            voice: { level: 90, duck: 50 }, fades: { in: 10, out: 14 }
        },
        ambient: {
            levels: { pad: 40, nature: 38, texture: 30, sparks: 38 },
            movement: 'swells', drift: true,
            entrainment: { mode: 'off', band: '10', carrier: 200, level: 12 },
            pulse: { enabled: false, tempo: 55, pattern: 'sparse', level: 24 },
            bells: { start: false, interval: '0', end: false, level: 30 },
            voice: { level: 90, duck: 0 }, fades: { in: 8, out: 12 }
        }
    }
};
