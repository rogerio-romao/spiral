import HudController from '../../src/HudController.js';

function createHud() {
    document.body.innerHTML = '<div id="msg"></div><div id="algos"></div><div id="help"></div>';
    const algosDisplayElement = document.querySelector('#algos');
    const helpElement = document.querySelector('#help');
    const messageElement = document.querySelector('#msg');
    return {
        helpElement,
        hud: new HudController({ algosDisplayElement, helpElement, messageElement }),
        messageElement,
    };
}

describe('hudController (browser smoke)', () => {
    it('displays a message in the real browser DOM', () => {
        const { hud, messageElement } = createHud();
        hud.displayMessage('browser test');
        expect(messageElement.textContent).toBe('BROWSER TEST');
        expect(messageElement.style.display).toBe('block');
        hud.destroy();
    });

    it('toggleHelp shows and hides the help panel', () => {
        const { hud, helpElement } = createHud();
        expect(hud.toggleHelp()).toBeTruthy();
        expect(helpElement.style.display).toBe('block');
        expect(hud.toggleHelp()).toBeFalsy();
        expect(helpElement.style.display).toBe('none');
        hud.destroy();
    });
});
