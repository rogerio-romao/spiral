// @vitest-environment jsdom

import KeyboardController from '../src/KeyboardController.js';

let controller = null;

function makeController({ isDevEnvironment = false } = {}) {
    globalThis.env = { isDevEnvironment };

    const hudController = {
        displayMessage: vi.fn(),
        silent: false,
        toggleHelpView: vi.fn(),
        toggleSilenceMode: vi.fn(),
    };
    const transitionManager = {
        autoChangeIntervalInSeconds: 60,
        changeAlgorithm: vi.fn(),
        isInManualMode: false,
    };
    const musicPlayer = { togglePlayerVisibility: vi.fn() };
    const devModeController = { toggleDevModal: vi.fn() };
    const spiral = { toggleWaveform: vi.fn() };

    controller = new KeyboardController({
        devModeController,
        hudController,
        musicPlayer,
        spiral,
        transitionManager,
    });
    controller.bind();

    return { controller, devModeController, hudController, musicPlayer, spiral, transitionManager };
}

function dispatch(code) {
    globalThis.dispatchEvent(new globalThis.KeyboardEvent('keyup', { bubbles: true, code }));
}

describe('keyboardController', () => {
    beforeEach(() => {
        document.body.requestFullscreen ??= () => null;
        document.exitFullscreen ??= () => null;
    });

    afterEach(() => {
        controller?.destroy();
        vi.restoreAllMocks();
        delete globalThis.env;
    });

    it('space calls transitionManager.changeAlgorithm()', () => {
        const { transitionManager } = makeController();
        dispatch('Space');
        expect(transitionManager.changeAlgorithm).toHaveBeenCalledOnce();
    });

    it('keyF toggles fullscreen mode', () => {
        makeController();
        let spy = vi.spyOn(document.body, 'requestFullscreen').mockReturnValue(null);
        dispatch('KeyF');
        expect(spy).toHaveBeenCalledOnce();
        spy.mockRestore();
        spy = vi.spyOn(document, 'exitFullscreen').mockReturnValue(null);
        document.fullscreenElement = {};
        dispatch('KeyF');
        expect(spy).toHaveBeenCalledOnce();
    });

    it('keyI increments autoChange by 10', () => {
        const { hudController, transitionManager } = makeController();
        dispatch('KeyI');
        expect(transitionManager.autoChangeIntervalInSeconds).toBe(70);
        expect(hudController.displayMessage).toHaveBeenCalledWith('Auto-change: 70secs');
    });

    it('keyI caps autoChange at 300', () => {
        const { transitionManager } = makeController();
        transitionManager.autoChangeIntervalInSeconds = 295;
        dispatch('KeyI');
        expect(transitionManager.autoChangeIntervalInSeconds).toBe(300);
    });

    it('keyD decrements autoChange by 10', () => {
        const { hudController, transitionManager } = makeController();
        dispatch('KeyD');
        expect(transitionManager.autoChangeIntervalInSeconds).toBe(50);
        expect(hudController.displayMessage).toHaveBeenCalledWith('Auto-change: 50secs');
    });

    it('keyD floors autoChange at 10', () => {
        const { transitionManager } = makeController();
        transitionManager.autoChangeIntervalInSeconds = 10;
        dispatch('KeyD');
        expect(transitionManager.autoChangeIntervalInSeconds).toBe(10);
    });

    it('keyM toggles manual on and displays message', () => {
        const { hudController, transitionManager } = makeController();
        transitionManager.isInManualMode = false;
        dispatch('KeyM');
        expect(transitionManager.isInManualMode).toBeTruthy();
        expect(hudController.displayMessage).toHaveBeenCalledWith('Manual mode');
    });

    it('keyM toggles manual off and displays message', () => {
        const { hudController, transitionManager } = makeController();
        transitionManager.isInManualMode = true;
        dispatch('KeyM');
        expect(transitionManager.isInManualMode).toBeFalsy();
        expect(hudController.displayMessage).toHaveBeenCalledWith('Auto mode');
    });

    it('keyS calls toggleSilenceMode and displayMessage', () => {
        const { hudController } = makeController();
        dispatch('KeyS');
        expect(hudController.toggleSilenceMode).toHaveBeenCalledOnce();
        expect(hudController.displayMessage).toHaveBeenCalledOnce();
    });

    it('keyH calls hudController.toggleHelpView()', () => {
        const { hudController } = makeController();
        dispatch('KeyH');
        expect(hudController.toggleHelpView).toHaveBeenCalledOnce();
    });

    it('keyP calls musicPlayer.togglePlayerVisibility()', () => {
        const { musicPlayer } = makeController();
        dispatch('KeyP');
        expect(musicPlayer.togglePlayerVisibility).toHaveBeenCalledOnce();
    });

    it('keyE calls devModeController.toggleDevModal() in dev mode', () => {
        const { devModeController } = makeController({ isDevEnvironment: true });
        dispatch('KeyE');
        expect(devModeController.toggleDevModal).toHaveBeenCalledOnce();
    });

    it('keyE does not call toggleDevModal() in production mode', () => {
        const { devModeController } = makeController({ isDevEnvironment: false });
        dispatch('KeyE');
        expect(devModeController.toggleDevModal).not.toHaveBeenCalled();
    });

    it('keyW calls spiral.toggleWaveform()', () => {
        const { spiral } = makeController();
        dispatch('KeyW');
        expect(spiral.toggleWaveform).toHaveBeenCalledOnce();
    });

    it('destroy() stops key events from triggering handlers', () => {
        const { transitionManager } = makeController();
        controller.destroy();
        dispatch('Space');
        expect(transitionManager.changeAlgorithm).not.toHaveBeenCalled();
    });
});
