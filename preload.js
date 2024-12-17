const { contextBridge } = require('electron');

// Import the scripts
require('./src/utils/canvasExtensions.js');
const Vector = require('./src/utils/vector.js');
const Particle = require('./src/utils/particle.js');
const utils = require('./src/utils/math.js');

contextBridge.exposeInMainWorld('electron', {
    // Add any electron specific features you need exposed to the renderer
});

window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    };

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type]);
    }
});
