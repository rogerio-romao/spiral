// @vitest-environment jsdom

import HudController from '../src/HudController.js';

function createHud() {
    document.body.innerHTML = /* html */ `<div id="msg"></div><div id="algos"></div><div id="help"></div>`;

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
        it('shows the message uppercased in a child element', () => {
            const { hud, messageElement } = createHud();
            hud.displayMessage('hello');
            const item = messageElement.querySelector('.msg-item');

            expect(item).not.toBeNull();
            expect(item.textContent).toBe('HELLO');

            hud.destroy();
        });

        it('stacks messages simultaneously when no key is provided', () => {
            const { hud, messageElement } = createHud();
            hud.displayMessage('first');
            hud.displayMessage('second');
            const items = messageElement.querySelectorAll('.msg-item');

            expect(items).toHaveLength(2);
            expect(items[0].textContent).toBe('FIRST');
            expect(items[1].textContent).toBe('SECOND');

            hud.destroy();
        });

        it('replaces an existing message with the same key', () => {
            const { hud, messageElement } = createHud();
            hud.displayMessage('first', 'mode');
            hud.displayMessage('second', 'mode');
            const items = messageElement.querySelectorAll('.msg-item');

            expect(items).toHaveLength(1);
            expect(items[0].textContent).toBe('SECOND');

            hud.destroy();
        });

        it('stacks different keyed messages independently', () => {
            const { hud, messageElement } = createHud();
            hud.displayMessage('manual mode', 'mode');
            hud.displayMessage('waveform on', 'waveform');
            const items = messageElement.querySelectorAll('.msg-item');

            expect(items).toHaveLength(2);

            hud.destroy();
        });

        it('evicts the oldest message when max capacity is reached', () => {
            const { hud, messageElement } = createHud();
            hud.displayMessage('msg1');
            hud.displayMessage('msg2');
            hud.displayMessage('msg3');
            hud.displayMessage('msg4');
            hud.displayMessage('msg5');
            const items = messageElement.querySelectorAll('.msg-item');

            expect(items).toHaveLength(4);
            expect(items[0].textContent).toBe('MSG2');
            expect(items[3].textContent).toBe('MSG5');

            hud.destroy();
        });

        it('starts removing the message after 7500ms', () => {
            vi.useFakeTimers();
            const { hud, messageElement } = createHud();
            hud.displayMessage('hello');
            vi.advanceTimersByTime(7500);
            const item = messageElement.querySelector('.msg-item');

            expect(item.classList.contains('msg-item-removing')).toBeTruthy();

            hud.destroy();
        });

        it('removes the message from DOM after 7500ms and transition', () => {
            vi.useFakeTimers();
            const { hud, messageElement } = createHud();
            hud.displayMessage('hello');
            vi.advanceTimersByTime(7500 + 350);

            expect(messageElement.querySelector('.msg-item')).toBeNull();

            hud.destroy();
        });

        it('each message has its own independent timer', () => {
            vi.useFakeTimers();
            const { hud, messageElement } = createHud();
            hud.displayMessage('first');
            vi.advanceTimersByTime(4000);
            hud.displayMessage('second');
            // advance 3600ms more: total 7600ms
            // first message timer fires at 7500ms ✓
            // fallback cleanup fires at 7850ms (not yet) ✓
            // second message timer fires at 4000 + 7500 = 11500ms (not yet) ✓
            vi.advanceTimersByTime(3600);
            const items = messageElement.querySelectorAll('.msg-item');

            expect(items).toHaveLength(2);
            expect(items[0].classList.contains('msg-item-removing')).toBeTruthy();
            expect(items[1].classList.contains('msg-item-removing')).toBeFalsy();

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
            hud.toggleSilenceMode();
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

    describe('toggleSilenceMode', () => {
        it('returns true on first call', () => {
            const { hud } = createHud();
            hud.toggleSilenceMode();

            expect(hud.silenceMessages).toBeTruthy();

            hud.destroy();
        });

        it('returns false on second call', () => {
            const { hud } = createHud();
            hud.toggleSilenceMode();
            hud.toggleSilenceMode();

            expect(hud.silenceMessages).toBeFalsy();

            hud.destroy();
        });

        it('clears algos display on activation', () => {
            const { hud, algosDisplayElement } = createHud();
            hud.displayAlgorithmName('test');
            hud.toggleSilenceMode();

            expect(algosDisplayElement.textContent).toBe('');
            expect(algosDisplayElement.style.display).toBe('none');

            hud.destroy();
        });
    });

    describe('toggleHelpView', () => {
        it('shows help on first call', () => {
            const { hud, helpElement } = createHud();
            hud.toggleHelpView();

            expect(hud.showHelpView).toBeTruthy();
            expect(helpElement.style.display).toBe('block');

            hud.destroy();
        });

        it('hides help on second call', () => {
            const { hud, helpElement } = createHud();
            hud.toggleHelpView();
            hud.toggleHelpView();

            expect(hud.showHelpView).toBeFalsy();
            expect(helpElement.style.display).toBe('none');

            hud.destroy();
        });
    });

    describe('destroy', () => {
        it('cancels all pending message timers', () => {
            vi.useFakeTimers();
            const { hud, messageElement } = createHud();
            hud.displayMessage('test');
            hud.destroy();
            vi.advanceTimersByTime(10_000);

            const item = messageElement.querySelector('.msg-item');
            expect(item).not.toBeNull();
            expect(item.classList.contains('msg-item-removing')).toBeFalsy();
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

        it('returns true after toggleSilenceMode()', () => {
            const { hud } = createHud();
            hud.toggleSilenceMode();

            expect(hud.silenceMessages).toBeTruthy();

            hud.destroy();
        });
    });
});
