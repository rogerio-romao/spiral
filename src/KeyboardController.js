/**
 * KeyboardController — centralized keyboard shortcut handler.
 * Consolidates shortcuts from Spiral.js and MusicPlayer.js into one place.
 */
export default class KeyboardController {
    /**
     * @param {Object} deps Dependencies for keyboard shortcut handling.
     * @param {HUDController}     deps.hud - The HUD controller for displaying messages and managing UI visibility.
     * @param {TransitionManager} deps.transition - The transition manager for handling algorithm changes and auto-change settings.
     * @param {MusicPlayer}       deps.musicPlayer - The music player for controlling audio playback visibility.
     * @param {DevModeController} deps.devModeController - The dev mode controller for enabling developer features.
     * @param {Spiral}            deps.spiral - The spiral instance for controlling waveform display.
     */
    constructor({ hud, transition, musicPlayer, devModeController, spiral }) {
        this._hud = hud;
        this._transition = transition;
        this._musicPlayer = musicPlayer;
        this._devModeController = devModeController;
        this._spiral = spiral;

        // Only enable dev mode shortcut if allowed
        this._isDev = globalThis.env?.isDev;
        this._handler = (e) => this._handleKeyup(e);
    }

    /** Attach the keyup listener to window. */
    bind() {
        globalThis.addEventListener('keyup', this._handler);
    }

    /** Remove the keyup listener from window. */
    destroy() {
        globalThis.removeEventListener('keyup', this._handler);
    }

    /**
     * Route key events to the appropriate module.
     * @param {KeyboardEvent} e - The keyboard event.
     */
    _handleKeyup(e) {
        switch (e.code) {
            case 'Space': {
                e.preventDefault();
                this._transition.changeAlgorithm();
                break;
            }

            case 'KeyF': {
                document.body.requestFullscreen();
                break;
            }

            case 'KeyI': {
                this._transition.autoChange = Math.min(this._transition.autoChange + 10, 300);
                this._hud.displayMessage(`Auto-change: ${this._transition.autoChange}secs`);
                break;
            }

            case 'KeyD': {
                this._transition.autoChange = Math.max(this._transition.autoChange - 10, 10);
                this._hud.displayMessage(`Auto-change: ${this._transition.autoChange}secs`);
                break;
            }

            case 'KeyM': {
                this._transition.manual = !this._transition.manual;
                this._hud.displayMessage(this._transition.manual ? 'Manual mode' : 'Auto mode');
                break;
            }

            case 'KeyS': {
                this._hud.toggleSilenceMode();
                this._hud.displayMessage(
                    this._hud.silenceMessages ? 'Silent mode' : 'Display mode',
                );
                break;
            }

            case 'KeyH': {
                this._hud.toggleHelpView();
                break;
            }

            case 'KeyP': {
                this._musicPlayer.togglePlayerVisibility();
                break;
            }

            case 'KeyE': {
                if (this._isDev) {
                    this._devModeController.toggleDevModal();
                }
                break;
            }

            case 'KeyW': {
                if (this._spiral) {
                    this._spiral.toggleWaveform();
                }
                break;
            }

            default: {
                break;
            }
        }
    }
}
