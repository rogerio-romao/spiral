// @vitest-environment jsdom

import KeyboardController from '../src/KeyboardController.js';

let controller = null;

function makeController({ isDev = false } = {}) {
    globalThis.env = { isDev };

    const hud = {
        displayMessage: vi.fn(),
        silent: false,
        toggleHelp: vi.fn(),
        toggleSilent: vi.fn(),
    };
    const transition = {
        autoChange: 60,
        changeAlgorithm: vi.fn(),
        manual: false,
    };
    const musicPlayer = { togglePlayerVisibility: vi.fn() };
    const devModeController = { toggle: vi.fn() };
    const spiral = { toggleWaveform: vi.fn() };

    controller = new KeyboardController({
        devModeController,
        hud,
        musicPlayer,
        spiral,
        transition,
    });
    controller.bind();

    return { controller, devModeController, hud, musicPlayer, spiral, transition };
}

function dispatch(code) {
    globalThis.dispatchEvent(new globalThis.KeyboardEvent('keyup', { bubbles: true, code }));
}

describe('keyboardController', () => {
    beforeEach(() => {
        document.body.requestFullscreen ??= () => null;
    });

    afterEach(() => {
        controller?.destroy();
        vi.restoreAllMocks();
        delete globalThis.env;
    });

    it('space calls transition.changeAlgorithm()', () => {
        const { transition } = makeController();
        dispatch('Space');
        expect(transition.changeAlgorithm).toHaveBeenCalledOnce();
    });

    it('keyF calls document.body.requestFullscreen()', () => {
        makeController();
        const spy = vi.spyOn(document.body, 'requestFullscreen').mockReturnValue(null);
        dispatch('KeyF');
        expect(spy).toHaveBeenCalledOnce();
    });

    it('keyI increments autoChange by 10', () => {
        const { hud, transition } = makeController();
        dispatch('KeyI');
        expect(transition.autoChange).toBe(70);
        expect(hud.displayMessage).toHaveBeenCalledWith('Auto-change: 70secs');
    });

    it('keyI caps autoChange at 300', () => {
        const { transition } = makeController();
        transition.autoChange = 295;
        dispatch('KeyI');
        expect(transition.autoChange).toBe(300);
    });

    it('keyD decrements autoChange by 10', () => {
        const { hud, transition } = makeController();
        dispatch('KeyD');
        expect(transition.autoChange).toBe(50);
        expect(hud.displayMessage).toHaveBeenCalledWith('Auto-change: 50secs');
    });

    it('keyD floors autoChange at 10', () => {
        const { transition } = makeController();
        transition.autoChange = 10;
        dispatch('KeyD');
        expect(transition.autoChange).toBe(10);
    });

    it('keyM toggles manual on and displays message', () => {
        const { hud, transition } = makeController();
        transition.manual = false;
        dispatch('KeyM');
        expect(transition.manual).toBeTruthy();
        expect(hud.displayMessage).toHaveBeenCalledWith('Manual mode');
    });

    it('keyM toggles manual off and displays message', () => {
        const { hud, transition } = makeController();
        transition.manual = true;
        dispatch('KeyM');
        expect(transition.manual).toBeFalsy();
        expect(hud.displayMessage).toHaveBeenCalledWith('Auto mode');
    });

    it('keyS calls toggleSilent and displayMessage', () => {
        const { hud } = makeController();
        dispatch('KeyS');
        expect(hud.toggleSilent).toHaveBeenCalledOnce();
        expect(hud.displayMessage).toHaveBeenCalledOnce();
    });

    it('keyH calls hud.toggleHelp()', () => {
        const { hud } = makeController();
        dispatch('KeyH');
        expect(hud.toggleHelp).toHaveBeenCalledOnce();
    });

    it('keyP calls musicPlayer.togglePlayerVisibility()', () => {
        const { musicPlayer } = makeController();
        dispatch('KeyP');
        expect(musicPlayer.togglePlayerVisibility).toHaveBeenCalledOnce();
    });

    it('keyE calls devModeController.toggle() in dev mode', () => {
        const { devModeController } = makeController({ isDev: true });
        dispatch('KeyE');
        expect(devModeController.toggle).toHaveBeenCalledOnce();
    });

    it('keyE does not call toggle() in production mode', () => {
        const { devModeController } = makeController({ isDev: false });
        dispatch('KeyE');
        expect(devModeController.toggle).not.toHaveBeenCalled();
    });

    it('keyW calls spiral.toggleWaveform()', () => {
        const { spiral } = makeController();
        dispatch('KeyW');
        expect(spiral.toggleWaveform).toHaveBeenCalledOnce();
    });

    it('keyW with null spiral does not throw', () => {
        const { hud, musicPlayer, devModeController, transition } = makeController();
        controller.destroy();
        globalThis.env = { isDev: false };
        controller = new KeyboardController({
            devModeController,
            hud,
            musicPlayer,
            spiral: null,
            transition,
        });
        controller.bind();
        expect(() => dispatch('KeyW')).not.toThrow();
    });

    it('destroy() stops key events from triggering handlers', () => {
        const { transition } = makeController();
        controller.destroy();
        dispatch('Space');
        expect(transition.changeAlgorithm).not.toHaveBeenCalled();
    });
});
