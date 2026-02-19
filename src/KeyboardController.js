/**
 * KeyboardController — centralized keyboard shortcut handler.
 * Consolidates shortcuts from Spiral.js and MusicPlayer.js into one place.
 */
export default class KeyboardController {
    /**
     * @param {Object} deps
     * @param {HUDController}     deps.hud
     * @param {TransitionManager} deps.transition
     * @param {MusicPlayer}       deps.musicPlayer
     * @param {Object}            deps.spiral - Spiral instance (for devMode)
     */
    constructor({ hud, transition, musicPlayer, spiral }) {
        this._hud = hud;
        this._transition = transition;
        this._musicPlayer = musicPlayer;
        this._spiral = spiral;

        this._handler = (e) => this._handleKeyup(e);
    }

    /** Attach the keyup listener to window. */
    bind() {
        window.addEventListener('keyup', this._handler);
    }

    /** Remove the keyup listener from window. */
    destroy() {
        window.removeEventListener('keyup', this._handler);
    }

    /** Route key events to the appropriate module. */
    _handleKeyup(e) {
        switch (e.code) {
            case 'Space':
                if (!this._spiral.devMode) {
                    this._transition.changeAlgorithm();
                }
                break;

            case 'KeyF':
                document.body.requestFullscreen();
                break;

            case 'KeyI':
                if (this._spiral.devMode) break;
                this._transition.autoChange = Math.min(
                    this._transition.autoChange + 10,
                    300,
                );
                this._hud.displayMessage(
                    `Auto-change: ${this._transition.autoChange}secs`,
                );
                break;

            case 'KeyD':
                if (this._spiral.devMode) break;
                this._transition.autoChange = Math.max(
                    this._transition.autoChange - 10,
                    10,
                );
                this._hud.displayMessage(
                    `Auto-change: ${this._transition.autoChange}secs`,
                );
                break;

            case 'KeyM':
                if (this._spiral.devMode) break;
                this._transition.manual = !this._transition.manual;
                this._hud.displayMessage(
                    this._transition.manual ? 'Manual mode' : 'Auto mode',
                );
                break;

            case 'KeyS':
                this._hud.toggleSilent();
                this._hud.displayMessage(
                    this._hud.silent ? 'Silent mode' : 'Display mode',
                );
                break;

            case 'KeyH':
                this._hud.toggleHelp();
                break;

            case 'KeyP':
                this._musicPlayer.togglePlayerVisibility();
                break;

            default:
                break;
        }
    }
}
