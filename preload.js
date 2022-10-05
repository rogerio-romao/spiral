const { contextBridge, ipcRenderer } = require('electron');

// helpers
const Vector = require('./Vector.js');
const Particle = require('./Particle.js');

contextBridge.exposeInMainWorld('Utils', {
    Vector: () => ipcRenderer.send(Vector),
    Particle: () => ipcRenderer.send(Particle)
});

// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerText = text;
    };

    for (const type of ['chrome', 'node', 'electron']) {
        replaceText(`${type}-version`, process.versions[type]);
    }
});
