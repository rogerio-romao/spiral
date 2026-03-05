/**
 * HudController — manages HUD overlay text: transient messages,
 * algorithm name display, silent mode, and help screen toggle.
 */
export default class HudController {
    // INSTANCE PROPERTIES
    messageDisplayTimeInMs = 7500;
    algorithmNameDisplayTimeInMs = 5000;

    /**
     * @param {Object} options - Configuration object for HUD elements
     * @param {HTMLElement} options.messageElement     - The #msg element
     * @param {HTMLElement} options.algosDisplayElement - The #algos element
     * @param {HTMLElement} options.helpElement         - The #help element
     */
    constructor({ messageElement, algosDisplayElement, helpElement }) {
        this.messageElement = messageElement;
        this.algosDisplayElement = algosDisplayElement;
        this.helpElement = helpElement;

        this.messageTimer = null;
        this.algorithmNameTimer = null;

        this.showHelpView = false;
        this.silenceMessages = false;
    }

    /** Clear all timers, called when the app closes. */
    destroy() {
        clearTimeout(this.messageTimer);
        clearTimeout(this.algorithmNameTimer);
    }

    /**
     * Show algorithm name in uppercase for `this.algorithmNameDisplayTimeInMs` ms. Respects silent mode. This is called externally by the `TransitionManager` whenever a new algorithm starts.
     * @param {string} name - The algorithm name to display.
     */
    displayAlgorithmName(name) {
        if (this.silenceMessages) {
            return;
        }

        // clear any existing timers to reset the display time if a new algorithm name comes in before the prior one is hidden
        clearTimeout(this.algorithmNameTimer);

        this.algosDisplayElement.textContent = `${name.toUpperCase()}`;
        this.algosDisplayElement.style.display = 'block';

        // hide the algorithm name after the default display time
        this.algorithmNameTimer = setTimeout(() => {
            this.algosDisplayElement.style.display = 'none';
            this.algosDisplayElement.textContent = '';
        }, this.algorithmNameDisplayTimeInMs);
    }

    /**
     * Show a temporary message for `this.messageDisplayTimeInMs` ms. Clears any prior message. Messages are uppercased for clarity. These messages are always shown, regardless of silent mode. Used for transient notifications like "Welcome", "Auto-change: 60secs", etc. This is called externally by various modules, such as the `KeyboardController` when adjusting auto-change settings, or the `DevModeController` when toggling Developer Mode.
     *
     * @param {string} message - The message to display.
     */
    displayMessage(message) {
        // clear any existing message timers to reset the display time if a new message comes in
        clearTimeout(this.messageTimer);

        this.messageElement.textContent = message.toUpperCase();
        this.messageElement.style.display = 'block';

        // hide the message after the default display time
        this.messageTimer = setTimeout(() => {
            this.messageElement.style.display = 'none';
            this.messageElement.textContent = '';
        }, this.messageDisplayTimeInMs);
    }

    /**
     * Toggle help screen on/off.
     */
    toggleHelpView() {
        this.showHelpView = !this.showHelpView;
        this.helpElement.style.display = this.showHelpView ? 'block' : 'none';
    }

    /**
     * Toggle silence mode on/off.
     */
    toggleSilenceMode() {
        this.silenceMessages = !this.silenceMessages;
        this.algosDisplayElement.textContent = '';
        this.algosDisplayElement.style.display = 'none';
    }
}
