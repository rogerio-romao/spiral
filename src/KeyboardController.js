import { savePreference } from './utils/UserPreferences.js';

/** @typedef {import('./HudController.js').default} HudController */
/** @typedef {import('./TransitionManager.js').default} TransitionManager */
/** @typedef {import('./MusicPlayer.js').default} MusicPlayer */
/** @typedef {import('./DevModeController.js').default} DevModeController */
/** @typedef {import('./Spiral.js').default} Spiral */
/** @typedef {import('./BlockedAlgorithmsModal.js').default} BlockedAlgorithmsModal */

/**
 * KeyboardController — centralized keyboard shortcut handler.
 * Consolidates shortcuts from `Spiral`, `MusicPlayer` and other modules into one place.
 */
export default class KeyboardController {
    // INSTANCE PROPERTIES
    maxTransitionTimeInSeconds = 300;
    minTransitionTimeInSeconds = 10;
    transitionTimeStepInSeconds = 10;

    /**
     * @param {Object} deps Dependencies for keyboard shortcut handling.
     * @param {HudController} deps.hudController - The HUD controller for displaying messages and managing UI visibility.
     * @param {TransitionManager} deps.transitionManager - The transition manager for handling algorithm changes and auto-change settings.
     * @param {MusicPlayer} deps.musicPlayer - The music player for controlling audio playback and visibility.
     * @param {DevModeController} deps.devModeController - The dev mode controller for enabling developer features.
     * @param {Spiral} deps.spiral - The spiral instance for controlling toggling the waveform display.
     * @param {BlockedAlgorithmsModal} deps.blockedAlgorithmsModal - The blocked algorithms modal controller.
     */
    constructor({
        hudController,
        transitionManager,
        musicPlayer,
        devModeController,
        spiral,
        blockedAlgorithmsModal,
    }) {
        /** @type {HudController} */
        this.hudController = hudController;
        /** @type {TransitionManager} */
        this.transitionManager = transitionManager;
        /** @type {MusicPlayer} */
        this.musicPlayer = musicPlayer;
        /** @type {DevModeController} */
        this.devModeController = devModeController;
        /** @type {Spiral} */
        this.spiral = spiral;
        /** @type {BlockedAlgorithmsModal} */
        this.blockedAlgorithmsModal = blockedAlgorithmsModal;

        // Dev mode shortcut should only work in development, we need to check this
        this.isDevEnvironment = Boolean(/** @type {any} */ (globalThis).env?.isDevEnvironment);

        // store the handler as an instance property so we can properly remove it in destroy()
        this.handler = (/** @type {KeyboardEvent} */ e) => this.handleKeyup(e);
    }

    /** Attach the keyup listener to window, gets called by `Spiral` after all the `KeyboardController` dependencies are initialized. */
    bind() {
        globalThis.addEventListener('keyup', this.handler);
    }

    /** Remove the keyup listener from window on app close. */
    destroy() {
        globalThis.removeEventListener('keyup', this.handler);
    }

    /**
     * Route key events to the appropriate module or action. Uses `e.code` so that shortcuts are consistent regardless of keyboard layout or modifier keys.
     * @param {KeyboardEvent} e - The keyboard event.
     */
    // oxlint-disable-next-line complexity
    handleKeyup(e) {
        // If the event target is an input, textarea, select, or button element, we should ignore the shortcut to avoid interfering with user interactions in forms and controls.
        const { target } = e;
        if (target instanceof HTMLInputElement || target instanceof HTMLSelectElement) {
            return;
        }

        switch (e.code) {
            // Skip to previous track
            case 'ArrowLeft': {
                this.musicPlayer.playPrev();
                break;
            }

            // Skip to next track
            case 'ArrowRight': {
                this.musicPlayer.playNext();
                break;
            }

            // Increase auto-change time by `transitionTimeStepInSeconds`, with a maximum of `maxTransitionTimeInSeconds`
            case 'Equal': {
                this.transitionManager.autoChangeIntervalInSeconds = Math.min(
                    this.transitionManager.autoChangeIntervalInSeconds +
                        this.transitionTimeStepInSeconds,
                    this.maxTransitionTimeInSeconds,
                );

                this.hudController.displayMessage(
                    `Auto-change: ${this.transitionManager.autoChangeIntervalInSeconds}secs`,
                    'autochange',
                );

                savePreference(
                    'autoChangeIntervalInSeconds',
                    this.transitionManager.autoChangeIntervalInSeconds,
                );

                break;
            }

            // Toggle Auto/Manual mode on/off. In manual mode, algorithms only change when the user triggers it (e.g. by pressing Space), and the auto-change timer is paused. In auto mode, algorithms change automatically based on the auto-change timer.
            case 'KeyA': {
                this.transitionManager.isInManualMode = !this.transitionManager.isInManualMode;
                this.transitionManager.resetAutoChangeTimer();

                this.hudController.displayMessage(
                    this.transitionManager.isInManualMode ? 'Manual mode' : 'Auto mode',
                    'mode',
                );

                savePreference('isInManualMode', this.transitionManager.isInManualMode);

                break;
            }

            // Toggle Developer Mode modal visibility in development environment
            case 'KeyE': {
                if (this.isDevEnvironment) {
                    this.devModeController.toggleDevModal();
                }
                break;
            }

            // Toggles fullscreen on the canvas's parent element (the #app container)
            case 'KeyF': {
                if (document.fullscreenElement) {
                    document.exitFullscreen();
                    break;
                }

                document.body.requestFullscreen();
                break;
            }

            // Toggle the help view in the HUD
            case 'KeyH': {
                this.hudController.toggleHelpView();
                break;
            }

            // Open / close the blocked algorithms modal
            case 'KeyL': {
                this.blockedAlgorithmsModal.toggleModal();
                break;
            }

            // Toggle the music player's visibility
            case 'KeyM': {
                this.musicPlayer.togglePlayerVisibility();

                savePreference('showPlayer', this.musicPlayer.showPlayer);

                break;
            }

            // Toggle music play/pause
            case 'KeyP': {
                this.musicPlayer.playTrack();
                break;
            }

            // Toggle silent mode on/off. In silent mode, algorithm names are not shown in the HUD. This is useful for users who want a more immersive experience.
            case 'KeyS': {
                this.hudController.toggleSilenceMode();

                this.hudController.displayMessage(
                    this.hudController.silenceMessages ? 'Silent mode' : 'Display mode',
                    'silence',
                );

                savePreference('silenceMessages', this.hudController.silenceMessages);

                break;
            }

            // Toggle the waveform display on/off in the Spiral visualization
            case 'KeyW': {
                this.spiral.toggleWaveform();

                savePreference('showWaveform', this.spiral.waveformController.showWaveform);

                break;
            }

            // Stop music playback
            case 'KeyX': {
                this.musicPlayer.stopPlayback();
                break;
            }

            // Decrease auto-change time by `transitionTimeStepInSeconds`, with a minimum of `minTransitionTimeInSeconds`
            case 'Minus': {
                this.transitionManager.autoChangeIntervalInSeconds = Math.max(
                    this.transitionManager.autoChangeIntervalInSeconds -
                        this.transitionTimeStepInSeconds,
                    this.minTransitionTimeInSeconds,
                );

                this.hudController.displayMessage(
                    `Auto-change: ${this.transitionManager.autoChangeIntervalInSeconds}secs`,
                    'autochange',
                );

                savePreference(
                    'autoChangeIntervalInSeconds',
                    this.transitionManager.autoChangeIntervalInSeconds,
                );

                break;
            }

            // Trigger an immediate algorithm change
            case 'Space': {
                e.preventDefault();
                this.transitionManager.changeAlgorithm();
                break;
            }

            default: {
                break;
            }
        }
    }
}
