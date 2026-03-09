// @vitest-environment jsdom

import KeyboardController from '../src/KeyboardController.js';

function makeController({ isDevEnvironment = false } = {}) {
    globalThis.env = { isDevEnvironment };

    const hudController = {
        displayMessage: vi.fn(),
        silenceMessages: false,
        toggleHelpView: vi.fn(),
        // oxlint-disable-next-line jest/prefer-mock-return-shorthand
        toggleSilenceMode: vi.fn().mockImplementation(function toggleSilenceMode() {
            this.silenceMessages = !this.silenceMessages;
        }),
    };

    const transitionManager = {
        autoChangeIntervalInSeconds: 60,
        changeAlgorithm: vi.fn(),
        isInManualMode: false,
    };

    const musicPlayer = {
        playNext: vi.fn(),
        playPrev: vi.fn(),
        playTrack: vi.fn(),
        showPlayer: true,
        stopPlayback: vi.fn(),
        togglePlayerVisibility: vi.fn(),
    };
    const devModeController = { toggleDevModal: vi.fn() };
    const spiral = { toggleWaveform: vi.fn(), waveformController: { showWaveform: false } };
    const blockedAlgorithmsModal = { toggleModal: vi.fn() };

    const controller = new KeyboardController({
        blockedAlgorithmsModal,
        devModeController,
        hudController,
        musicPlayer,
        spiral,
        transitionManager,
    });
    controller.bind();

    return {
        blockedAlgorithmsModal,
        controller,
        devModeController,
        hudController,
        musicPlayer,
        spiral,
        transitionManager,
    };
}

function dispatchKeyup(code) {
    globalThis.dispatchEvent(new globalThis.KeyboardEvent('keyup', { bubbles: true, code }));
}

describe('keyboardController', () => {
    afterEach(() => {
        vi.restoreAllMocks();
        delete globalThis.env;
    });

    it('space calls transitionManager.changeAlgorithm()', () => {
        const { controller, transitionManager } = makeController();
        dispatchKeyup('Space');

        expect(transitionManager.changeAlgorithm).toHaveBeenCalledWith();

        controller.destroy();
    });

    it('keyF toggles fullscreen mode', () => {
        // JSDOM doesn't implement fullscreen APIs, so we need to mock them for this test.
        document.body.requestFullscreen ??= () => null;
        document.exitFullscreen ??= () => null;

        const { controller } = makeController();
        let spy = vi.spyOn(document.body, 'requestFullscreen').mockReturnValue(null);
        dispatchKeyup('KeyF');

        expect(spy).toHaveBeenCalledOnce();

        spy.mockRestore();
        spy = vi.spyOn(document, 'exitFullscreen').mockReturnValue(null);
        document.fullscreenElement = {};
        dispatchKeyup('KeyF');

        expect(spy).toHaveBeenCalledOnce();

        controller.destroy();
    });

    it('equal key increments autoChange by 10', () => {
        const { controller, hudController, transitionManager } = makeController();
        dispatchKeyup('Equal');

        expect(transitionManager.autoChangeIntervalInSeconds).toBe(70);
        expect(hudController.displayMessage).toHaveBeenCalledWith(
            'Auto-change: 70secs',
            'autochange',
        );

        controller.destroy();
    });

    it('equal key caps autoChange at 300', () => {
        const { controller, transitionManager } = makeController();
        transitionManager.autoChangeIntervalInSeconds = 295;
        dispatchKeyup('Equal');

        expect(transitionManager.autoChangeIntervalInSeconds).toBe(300);

        controller.destroy();
    });

    it('minus key decrements autoChange by 10', () => {
        const { controller, hudController, transitionManager } = makeController();
        dispatchKeyup('Minus');

        expect(transitionManager.autoChangeIntervalInSeconds).toBe(50);
        expect(hudController.displayMessage).toHaveBeenCalledWith(
            'Auto-change: 50secs',
            'autochange',
        );

        controller.destroy();
    });

    it('minus key floors autoChange at 10', () => {
        const { controller, transitionManager } = makeController();
        transitionManager.autoChangeIntervalInSeconds = 10;
        dispatchKeyup('Minus');

        expect(transitionManager.autoChangeIntervalInSeconds).toBe(10);

        controller.destroy();
    });

    it('keyA toggles manual on and displays message', () => {
        const { controller, hudController, transitionManager } = makeController();
        transitionManager.isInManualMode = false;
        dispatchKeyup('KeyA');

        expect(transitionManager.isInManualMode).toBeTruthy();
        expect(hudController.displayMessage).toHaveBeenCalledWith('Manual mode', 'mode');

        controller.destroy();
    });

    it('keyA toggles manual off and displays message', () => {
        const { controller, hudController, transitionManager } = makeController();
        transitionManager.isInManualMode = true;
        dispatchKeyup('KeyA');

        expect(transitionManager.isInManualMode).toBeFalsy();
        expect(hudController.displayMessage).toHaveBeenCalledWith('Auto mode', 'mode');

        controller.destroy();
    });

    it('keyS calls toggleSilenceMode and displayMessage', () => {
        const { controller, hudController } = makeController();
        dispatchKeyup('KeyS');

        expect(hudController.toggleSilenceMode).toHaveBeenCalledOnce();
        expect(hudController.displayMessage).toHaveBeenCalledWith('Silent mode', 'silence');
        expect(hudController.silenceMessages).toBeTruthy();

        dispatchKeyup('KeyS');

        expect(hudController.toggleSilenceMode).toHaveBeenCalledTimes(2);
        expect(hudController.displayMessage).toHaveBeenCalledWith('Display mode', 'silence');
        expect(hudController.silenceMessages).toBeFalsy();

        controller.destroy();
    });

    it('keyH calls hudController.toggleHelpView()', () => {
        const { controller, hudController } = makeController();
        dispatchKeyup('KeyH');

        expect(hudController.toggleHelpView).toHaveBeenCalledOnce();

        controller.destroy();
    });

    it('keyM calls musicPlayer.togglePlayerVisibility()', () => {
        const { controller, musicPlayer } = makeController();
        dispatchKeyup('KeyM');

        expect(musicPlayer.togglePlayerVisibility).toHaveBeenCalledOnce();

        controller.destroy();
    });

    it('keyP calls musicPlayer.playTrack()', () => {
        const { controller, musicPlayer } = makeController();
        dispatchKeyup('KeyP');

        expect(musicPlayer.playTrack).toHaveBeenCalledOnce();

        controller.destroy();
    });

    it('keyX calls musicPlayer.stopPlayback()', () => {
        const { controller, musicPlayer } = makeController();
        dispatchKeyup('KeyX');

        expect(musicPlayer.stopPlayback).toHaveBeenCalledOnce();

        controller.destroy();
    });

    it('arrowLeft calls musicPlayer.playPrev()', () => {
        const { controller, musicPlayer } = makeController();
        dispatchKeyup('ArrowLeft');

        expect(musicPlayer.playPrev).toHaveBeenCalledOnce();

        controller.destroy();
    });

    it('arrowRight calls musicPlayer.playNext()', () => {
        const { controller, musicPlayer } = makeController();
        dispatchKeyup('ArrowRight');

        expect(musicPlayer.playNext).toHaveBeenCalledOnce();

        controller.destroy();
    });

    it('keyE calls devModeController.toggleDevModal() in dev mode', () => {
        const { controller, devModeController } = makeController({ isDevEnvironment: true });
        dispatchKeyup('KeyE');

        expect(devModeController.toggleDevModal).toHaveBeenCalledOnce();

        controller.destroy();
    });

    it('keyE does not call toggleDevModal() in production mode', () => {
        const { controller, devModeController } = makeController({ isDevEnvironment: false });
        dispatchKeyup('KeyE');

        expect(devModeController.toggleDevModal).not.toHaveBeenCalled();

        controller.destroy();
    });

    it('keyW calls spiral.toggleWaveform()', () => {
        const { controller, spiral } = makeController();
        dispatchKeyup('KeyW');

        expect(spiral.toggleWaveform).toHaveBeenCalledOnce();

        controller.destroy();
    });

    it('keyL calls blockedAlgorithmsModal.toggleModal()', () => {
        const { blockedAlgorithmsModal, controller } = makeController();
        dispatchKeyup('KeyL');

        expect(blockedAlgorithmsModal.toggleModal).toHaveBeenCalledOnce();

        controller.destroy();
    });

    it('destroy() stops key events from triggering handlers', () => {
        const { controller, transitionManager } = makeController();
        controller.destroy();

        dispatchKeyup('Space');
        expect(transitionManager.changeAlgorithm).not.toHaveBeenCalled();
    });
});
