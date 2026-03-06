import HudController from '../../src/HudController.js';
import sleep from '../helpers/sleep.js';

function createHud() {
    document.body.innerHTML = /* html */ `<div id="msg"></div><div id="algos"></div><div id="help"></div>`;

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
    it('throws if any required DOM element is missing', () => {
        // messageElement missing
        expect(
            () =>
                new HudController({
                    algosDisplayElement: document.createElement('div'),
                    helpElement: document.createElement('div'),
                    messageElement: null,
                }),
        ).toThrow('Missing required DOM element: #msg');

        // algosDisplayElement missing
        expect(
            () =>
                new HudController({
                    algosDisplayElement: null,
                    helpElement: document.createElement('div'),
                    messageElement: document.createElement('div'),
                }),
        ).toThrow('Missing required DOM element: #algos');

        // helpElement missing
        expect(
            () =>
                new HudController({
                    algosDisplayElement: document.createElement('div'),
                    helpElement: null,
                    messageElement: document.createElement('div'),
                }),
        ).toThrow('Missing required DOM element: #help');
    });

    it('calls clearTimeout on both timers in destroy', () => {
        const { hud } = createHud();
        const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

        hud.displayMessage('test');
        hud.displayAlgorithmName('algo');
        const messageTimerId = hud.messageTimer;
        const algoTimerId = hud.algorithmNameTimer;

        hud.destroy();
        expect(clearTimeoutSpy).toHaveBeenCalledWith(messageTimerId);
        expect(clearTimeoutSpy).toHaveBeenCalledWith(algoTimerId);
        clearTimeoutSpy.mockRestore();
    });

    it('displays a message in the real browser DOM', () => {
        const { hud, messageElement } = createHud();
        hud.displayMessage('browser test');
        expect(messageElement.textContent).toBe('BROWSER TEST');
        expect(messageElement.style.display).toBe('block');

        hud.destroy();
    });

    it('toggleHelpView shows and hides the help panel', () => {
        const { hud, helpElement } = createHud();

        hud.toggleHelpView();
        expect(hud.showHelpView).toBeTruthy();
        expect(helpElement.style.display).toBe('block');

        hud.toggleHelpView();
        expect(hud.showHelpView).toBeFalsy();
        expect(helpElement.style.display).toBe('none');

        hud.destroy();
    });

    it('properly resets timers and DOM on rapid consecutive displayMessage calls', async () => {
        const { hud, messageElement } = createHud();
        hud.messageDisplayTimeInMs = 500;

        hud.displayMessage('first');
        expect(messageElement.textContent).toBe('FIRST');
        await sleep(100);
        hud.displayMessage('second');
        expect(messageElement.textContent).toBe('SECOND');
        await sleep(400);
        expect(messageElement.style.display).toBe('block');
        expect(messageElement.textContent).toBe('SECOND');
        await sleep(100);
        expect(messageElement.style.display).toBe('none');
        expect(messageElement.textContent).toBe('');

        hud.destroy();
    });

    it('properly resets timers and DOM on rapid consecutive displayAlgorithmName calls', async () => {
        const { hud } = createHud();
        hud.algorithmNameDisplayTimeInMs = 500;

        const algosDisplayElement = document.querySelector('#algos');
        hud.displayAlgorithmName('algo1');
        expect(algosDisplayElement.textContent).toBe('ALGO1');
        await sleep(100);
        hud.displayAlgorithmName('algo2');
        expect(algosDisplayElement.textContent).toBe('ALGO2');
        await sleep(400);
        expect(algosDisplayElement.style.display).toBe('block');
        await sleep(100);
        expect(algosDisplayElement.style.display).toBe('none');
        expect(algosDisplayElement.textContent).toBe('');

        hud.destroy();
    });
});
