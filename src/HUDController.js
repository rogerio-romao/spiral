/**
 * HUDController — manages HUD overlay text: transient messages,
 * algorithm name display, silent mode, and help screen toggle.
 */
export default class HUDController {
    /**
     * @param {Object} options
     * @param {HTMLElement} options.messageElement     - The #msg element
     * @param {HTMLElement} options.algosDisplayElement - The #algos element
     * @param {HTMLElement} options.helpElement         - The #help element
     */
    constructor({ messageElement, algosDisplayElement, helpElement }) {
        this._messageElement = messageElement;
        this._algosDisplayElement = algosDisplayElement;
        this._helpElement = helpElement;

        this._messageTimer = null;
        this._algorithmNameTimer = null;
        this._helpView = false;
        this._silent = false;
    }

    /** Whether silent mode is active (read-only). */
    get silent() {
        return this._silent;
    }

    /** Show a temporary message for 7500 ms. Clears any prior message. */
    displayMessage(message) {
        clearTimeout(this._messageTimer);
        this._messageElement.textContent = message.toUpperCase();
        this._messageElement.style.display = 'block';
        this._messageTimer = setTimeout(() => {
            this._messageElement.style.display = 'none';
            this._messageElement.textContent = '';
        }, 7500);
    }

    /** Show algorithm name for 5000 ms. Respects silent mode. */
    displayAlgorithmName(name) {
        if (this._silent) return;
        clearTimeout(this._algorithmNameTimer);
        this._algosDisplayElement.textContent = `${name.toUpperCase()}`;
        this._algosDisplayElement.style.display = 'block';

        this._algorithmNameTimer = setTimeout(() => {
            this._algosDisplayElement.style.display = 'none';
            this._algosDisplayElement.textContent = '';
        }, 5000);
    }

    /**
     * Toggle silent mode on/off.
     * @returns {boolean} The new silent state.
     */
    toggleSilent() {
        this._silent = !this._silent;
        this._algosDisplayElement.textContent = '';
        this._algosDisplayElement.style.display = 'none';
        return this._silent;
    }

    /**
     * Toggle help screen on/off.
     * @returns {boolean} The new help-view state.
     */
    toggleHelp() {
        this._helpView = !this._helpView;
        this._helpElement.style.display = this._helpView ? 'block' : 'none';
        return this._helpView;
    }

    /** Clear all timers and reset HUD state. */
    destroy() {
        clearTimeout(this._messageTimer);
        clearTimeout(this._algorithmNameTimer);
    }
}
