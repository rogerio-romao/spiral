// @vitest-environment jsdom

import HudController from '../src/HudController.js';

function createHud() {
    document.body.innerHTML = '<div id="msg"></div><div id="algos"></div><div id="help"></div>';
    const algosDisplayElement = document.querySelector('#algos');
    const helpElement = document.querySelector('#help');
    const messageElement = document.querySelector('#msg');
    return {
        algosDisplayElement,
        helpElement,
        hud: new HudController({ algosDisplayElement, helpElement, messageElement }),
        messageElement,
    };
}

describe('hudController', () => {
    afterEach(() => {
        vi.useRealTimers();
    });

    describe('displayMessage', () => {
        it('shows the message uppercased', () => {
            const { hud, messageElement } = createHud();
            hud.displayMessage('hello');
            expect(messageElement.textContent).toBe('HELLO');
            expect(messageElement.style.display).toBe('block');
            hud.destroy();
        });

        it('replaces a prior message', () => {
            const { hud, messageElement } = createHud();
            hud.displayMessage('first');
            hud.displayMessage('second');
            expect(messageElement.textContent).toBe('SECOND');
            hud.destroy();
        });

        it('hides the message after 7500ms', () => {
            vi.useFakeTimers();
            const { hud, messageElement } = createHud();
            hud.displayMessage('hello');
            vi.advanceTimersByTime(7500);
            expect(messageElement.style.display).toBe('none');
            expect(messageElement.textContent).toBe('');
            hud.destroy();
        });
    });

    describe('displayAlgorithmName', () => {
        it('shows algorithm name uppercased', () => {
            const { hud, algosDisplayElement } = createHud();
            hud.displayAlgorithmName('myAlgo');
            expect(algosDisplayElement.textContent).toBe('MYALGO');
            expect(algosDisplayElement.style.display).toBe('block');
            hud.destroy();
        });

        it('does nothing when silent mode is active', () => {
            const { hud, algosDisplayElement } = createHud();
            hud.toggleSilent();
            hud.displayAlgorithmName('myAlgo');
            expect(algosDisplayElement.textContent).toBe('');
            hud.destroy();
        });

        it('hides after 5000ms', () => {
            vi.useFakeTimers();
            const { hud, algosDisplayElement } = createHud();
            hud.displayAlgorithmName('myAlgo');
            vi.advanceTimersByTime(5000);
            expect(algosDisplayElement.style.display).toBe('none');
            hud.destroy();
        });
    });

    describe('toggleSilent', () => {
        it('returns true on first call', () => {
            const { hud } = createHud();
            expect(hud.toggleSilent()).toBeTruthy();
            hud.destroy();
        });

        it('returns false on second call', () => {
            const { hud } = createHud();
            hud.toggleSilent();
            expect(hud.toggleSilent()).toBeFalsy();
            hud.destroy();
        });

        it('clears algos display on activation', () => {
            const { hud, algosDisplayElement } = createHud();
            hud.displayAlgorithmName('test');
            hud.toggleSilent();
            expect(algosDisplayElement.textContent).toBe('');
            expect(algosDisplayElement.style.display).toBe('none');
            hud.destroy();
        });
    });

    describe('toggleHelp', () => {
        it('shows help on first call', () => {
            const { hud, helpElement } = createHud();
            expect(hud.toggleHelp()).toBeTruthy();
            expect(helpElement.style.display).toBe('block');
            hud.destroy();
        });

        it('hides help on second call', () => {
            const { hud, helpElement } = createHud();
            hud.toggleHelp();
            expect(hud.toggleHelp()).toBeFalsy();
            expect(helpElement.style.display).toBe('none');
            hud.destroy();
        });
    });

    describe('destroy', () => {
        it('cancels the pending message timer', () => {
            vi.useFakeTimers();
            const { hud, messageElement } = createHud();
            hud.displayMessage('test');
            hud.destroy();
            vi.advanceTimersByTime(10_000);
            expect(messageElement.style.display).toBe('block');
        });

        it('cancels the pending algorithm name timer', () => {
            vi.useFakeTimers();
            const { hud, algosDisplayElement } = createHud();
            hud.displayAlgorithmName('algo');
            hud.destroy();
            vi.advanceTimersByTime(10_000);
            expect(algosDisplayElement.style.display).toBe('block');
        });
    });

    describe('silent getter', () => {
        it('returns false initially', () => {
            const { hud } = createHud();
            expect(hud.silent).toBeFalsy();
            hud.destroy();
        });

        it('returns true after toggleSilent()', () => {
            const { hud } = createHud();
            hud.toggleSilent();
            expect(hud.silent).toBeTruthy();
            hud.destroy();
        });
    });
});
