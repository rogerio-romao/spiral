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

describe('hudController (browser)', () => {
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

    it('calls clearTimeout on message and algorithm name timers in destroy', () => {
        const { hud } = createHud();
        const clearTimeoutSpy = vi.spyOn(globalThis, 'clearTimeout');

        hud.displayMessage('test');
        hud.displayAlgorithmName('algo');
        const messageTimerId = hud.messages[0].timer;
        const algoTimerId = hud.algorithmNameTimer;
        hud.destroy();

        expect(clearTimeoutSpy).toHaveBeenCalledWith(messageTimerId);
        expect(clearTimeoutSpy).toHaveBeenCalledWith(algoTimerId);

        clearTimeoutSpy.mockRestore();
    });

    it('displays a message as a child element in the real browser DOM', () => {
        const { hud, messageElement } = createHud();
        hud.displayMessage('browser test');
        const item = messageElement.querySelector('.msg-item');

        expect(item).not.toBeNull();
        expect(item.textContent).toBe('BROWSER TEST');

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

    it('stacks messages simultaneously and each timer expires independently', async () => {
        const { hud, messageElement } = createHud();
        hud.messageDisplayTimeInMs = 500;
        hud.displayMessage('first');
        let items = messageElement.querySelectorAll('.msg-item');

        expect(items).toHaveLength(1);
        expect(items[0].textContent).toBe('FIRST');

        await sleep(100);
        hud.displayMessage('second');
        items = messageElement.querySelectorAll('.msg-item');

        expect(items).toHaveLength(2);
        expect(items[0].textContent).toBe('FIRST');
        expect(items[1].textContent).toBe('SECOND');

        await sleep(410);

        // first message (added at t=0) expires at t=500ms — wait until t=510ms
        expect(items[0].classList.contains('msg-item-removing')).toBeTruthy();
        // second message (added at t=100ms) expires at t=600ms — not yet
        expect(items[1].classList.contains('msg-item-removing')).toBeFalsy();

        // wait for first message's transition to complete (350ms fallback)
        await sleep(400);
        items = messageElement.querySelectorAll('.msg-item');
        expect(items).toHaveLength(1);
        expect(items[0].textContent).toBe('SECOND');

        hud.destroy();
    });

    it('replaces a keyed message immediately without stacking', async () => {
        const { hud, messageElement } = createHud();
        hud.displayMessage('manual mode', 'mode');

        expect(messageElement.querySelectorAll('.msg-item')).toHaveLength(1);

        await sleep(50);
        hud.displayMessage('auto mode', 'mode');
        const items = messageElement.querySelectorAll('.msg-item');

        expect(items).toHaveLength(1);
        expect(items[0].textContent).toBe('AUTO MODE');

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
