/**
 * KeyboardController — centralized keyboard shortcut handler.
 * Consolidates shortcuts from `Spiral` and `MusicPlayer` into one place.
 */
export default class KeyboardController {
    // INSTANCE PROPERTIES
    maxTransitionTimeInSeconds = 300;
    minTransitionTimeInSeconds = 10;
    transitionTimeStepInSeconds = 10;

    /**
     * @param {Object} deps Dependencies for keyboard shortcut handling.
     * @param {import('./HudController.js').default}     deps.HudController - The HUD controller for displaying messages and managing UI visibility.
     * @param {import('./TransitionManager.js').default} deps.TransitionManager - The transition manager for handling algorithm changes and auto-change settings.
     * @param {import('./MusicPlayer.js').default}       deps.MusicPlayer - The music player for controlling audio playback visibility.
     * @param {import('./DevModeController.js').default} deps.DevModeController - The dev mode controller for enabling developer features.
     * @param {import('./Spiral.js').default}            deps.Spiral - The spiral instance for controlling toggling the waveform display.
     */
    constructor({ HudController, TransitionManager, MusicPlayer, DevModeController, Spiral }) {
        this.HudController = HudController;
        this.TransitionManager = TransitionManager;
        this.MusicPlayer = MusicPlayer;
        this.DevModeController = DevModeController;
        this.Spiral = Spiral;

        // Dev mode shortcut should only work in development, we need to check this
        this.isDevEnvironment = globalThis.env?.isDevEnvironment;

        // store the handler as an instance property so we can properly remove it in destroy()
        this.handler = (e) => this.handleKeyup(e);
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
    handleKeyup(e) {
        switch (e.code) {
            // Decrease auto-change time by `transitionTimeStepInSeconds`, with a minimum of `minTransitionTimeInSeconds`
            case 'KeyD': {
                this.TransitionManager.autoChange = Math.max(
                    this.TransitionManager.autoChange - this.transitionTimeStepInSeconds,
                    this.minTransitionTimeInSeconds,
                );
                this.HudController.displayMessage(
                    `Auto-change: ${this.TransitionManager.autoChange}secs`,
                );
                break;
            }

            // Toggle Developer Mode modal visibility in development environment
            case 'KeyE': {
                if (this.isDevEnvironment) {
                    this.DevModeController.toggleDevModal();
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
                this.HudController.toggleHelpView();
                break;
            }

            // Increase auto-change time by `transitionTimeStepInSeconds`, with a maximum of `maxTransitionTimeInSeconds`
            case 'KeyI': {
                this.TransitionManager.autoChange = Math.min(
                    this.TransitionManager.autoChange + this.transitionTimeStepInSeconds,
                    this.maxTransitionTimeInSeconds,
                );
                this.HudController.displayMessage(
                    `Auto-change: ${this.TransitionManager.autoChange}secs`,
                );
                break;
            }

            // Toggle manual mode on/off. In manual mode, algorithms only change when the user triggers it (e.g. by pressing Space), and the auto-change timer is paused. In auto mode, algorithms change automatically based on the auto-change timer.
            case 'KeyM': {
                this.TransitionManager.manual = !this.TransitionManager.manual;
                this.HudController.displayMessage(
                    this.TransitionManager.manual ? 'Manual mode' : 'Auto mode',
                );
                break;
            }

            // Toggle the music player's visibility
            case 'KeyP': {
                this.MusicPlayer.togglePlayerVisibility();
                break;
            }

            // Toggle silent mode on/off. In silent mode, algorithm names are not shown in the HUD. This is useful for users who want a more immersive experience.
            case 'KeyS': {
                this.HudController.toggleSilenceMode();
                this.HudController.displayMessage(
                    this.HudController.silenceMessages ? 'Silent mode' : 'Display mode',
                );
                break;
            }

            // Toggle the waveform display on/off in the Spiral visualization
            case 'KeyW': {
                this.Spiral.toggleWaveform();
                break;
            }

            // Trigger an immediate algorithm change
            case 'Space': {
                e.preventDefault();
                this.TransitionManager.changeAlgorithm();
                break;
            }

            default: {
                break;
            }
        }
    }
}
