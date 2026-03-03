// @vitest-environment jsdom

import KeyboardController from '../src/KeyboardController.js';

let controller = null;

function makeController({ isDevEnvironment = false } = {}) {
    globalThis.env = { isDevEnvironment };

    const HudController = {
        displayMessage: vi.fn(),
        silent: false,
        toggleHelpView: vi.fn(),
        toggleSilenceMode: vi.fn(),
    };
    const TransitionManager = {
        autoChange: 60,
        changeAlgorithm: vi.fn(),
        manual: false,
    };
    const MusicPlayer = { togglePlayerVisibility: vi.fn() };
    const DevModeController = { toggleDevModal: vi.fn() };
    const Spiral = { toggleWaveform: vi.fn() };

    controller = new KeyboardController({
        DevModeController,
        HudController,
        MusicPlayer,
        Spiral,
        TransitionManager,
    });
    controller.bind();

    return { controller, DevModeController, HudController, MusicPlayer, Spiral, TransitionManager };
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

    it('space calls TransitionManager.changeAlgorithm()', () => {
        const { TransitionManager } = makeController();
        dispatch('Space');
        expect(TransitionManager.changeAlgorithm).toHaveBeenCalledOnce();
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
        const { HudController, TransitionManager } = makeController();
        dispatch('KeyI');
        expect(TransitionManager.autoChange).toBe(70);
        expect(HudController.displayMessage).toHaveBeenCalledWith('Auto-change: 70secs');
    });

    it('keyI caps autoChange at 300', () => {
        const { TransitionManager } = makeController();
        TransitionManager.autoChange = 295;
        dispatch('KeyI');
        expect(TransitionManager.autoChange).toBe(300);
    });

    it('keyD decrements autoChange by 10', () => {
        const { HudController, TransitionManager } = makeController();
        dispatch('KeyD');
        expect(TransitionManager.autoChange).toBe(50);
        expect(HudController.displayMessage).toHaveBeenCalledWith('Auto-change: 50secs');
    });

    it('keyD floors autoChange at 10', () => {
        const { TransitionManager } = makeController();
        TransitionManager.autoChange = 10;
        dispatch('KeyD');
        expect(TransitionManager.autoChange).toBe(10);
    });

    it('keyM toggles manual on and displays message', () => {
        const { HudController, TransitionManager } = makeController();
        TransitionManager.manual = false;
        dispatch('KeyM');
        expect(TransitionManager.manual).toBeTruthy();
        expect(HudController.displayMessage).toHaveBeenCalledWith('Manual mode');
    });

    it('keyM toggles manual off and displays message', () => {
        const { HudController, TransitionManager } = makeController();
        TransitionManager.manual = true;
        dispatch('KeyM');
        expect(TransitionManager.manual).toBeFalsy();
        expect(HudController.displayMessage).toHaveBeenCalledWith('Auto mode');
    });

    it('keyS calls toggleSilenceMode and displayMessage', () => {
        const { HudController } = makeController();
        dispatch('KeyS');
        expect(HudController.toggleSilenceMode).toHaveBeenCalledOnce();
        expect(HudController.displayMessage).toHaveBeenCalledOnce();
    });

    it('keyH calls HudController.toggleHelpView()', () => {
        const { HudController } = makeController();
        dispatch('KeyH');
        expect(HudController.toggleHelpView).toHaveBeenCalledOnce();
    });

    it('keyP calls MusicPlayer.togglePlayerVisibility()', () => {
        const { MusicPlayer } = makeController();
        dispatch('KeyP');
        expect(MusicPlayer.togglePlayerVisibility).toHaveBeenCalledOnce();
    });

    it('keyE calls DevModeController.toggleDevModal() in dev mode', () => {
        const { DevModeController } = makeController({ isDevEnvironment: true });
        dispatch('KeyE');
        expect(DevModeController.toggleDevModal).toHaveBeenCalledOnce();
    });

    it('keyE does not call toggleDevModal() in production mode', () => {
        const { DevModeController } = makeController({ isDevEnvironment: false });
        dispatch('KeyE');
        expect(DevModeController.toggleDevModal).not.toHaveBeenCalled();
    });

    it('keyW calls Spiral.toggleWaveform()', () => {
        const { Spiral } = makeController();
        dispatch('KeyW');
        expect(Spiral.toggleWaveform).toHaveBeenCalledOnce();
    });

    it('destroy() stops key events from triggering handlers', () => {
        const { TransitionManager } = makeController();
        controller.destroy();
        dispatch('Space');
        expect(TransitionManager.changeAlgorithm).not.toHaveBeenCalled();
    });
});
