/**
 * HudController — manages HUD overlay text: transient messages,
 * algorithm name display, silent mode, and help screen toggle,
 * and their associated timers and state. Designed for use by external modules to trigger HUD updates without direct DOM manipulation.
 */
export default class HudController {
    // INSTANCE PROPERTIES
    algorithmNameDisplayTimeInMs = 5000;
    /** @type {ReturnType<typeof setTimeout>|null} */
    algorithmNameTimer = null;
    messageDisplayTimeInMs = 7500;
    /** @type {{ key: string|null, timer: ReturnType<typeof setTimeout>, element: HTMLElement }[]} */
    messages = [];
    maxMessages = 4;
    showHelpView = false;
    silenceMessages = false;

    /**
     * @param {Object} domElements - Configuration object for HUD elements
     * @param {HTMLElement|undefined} domElements.messageElement     - The #msg element
     * @param {HTMLElement|undefined} domElements.algosDisplayElement - The #algos element
     * @param {HTMLElement|undefined} domElements.helpElement         - The #help element
     */
    constructor({ messageElement, algosDisplayElement, helpElement }) {
        if (!messageElement) {
            throw new Error('Missing required DOM element: #msg');
        }
        if (!algosDisplayElement) {
            throw new Error('Missing required DOM element: #algos');
        }
        if (!helpElement) {
            throw new Error('Missing required DOM element: #help');
        }
        /** @type {HTMLElement} */
        this.messageElement = messageElement;
        /** @type {HTMLElement} */
        this.algosDisplayElement = algosDisplayElement;
        /** @type {HTMLElement} */
        this.helpElement = helpElement;
    }

    /** Clear all timers, called when the app closes. */
    destroy() {
        for (const msg of this.messages) {
            clearTimeout(msg.timer);
        }

        clearTimeout(this.algorithmNameTimer);

        this.messages = [];
    }

    /**
     * Show algorithm name in uppercase for `this.algorithmNameDisplayTimeInMs` ms. Respects silent mode. This is called externally by the `TransitionManager` whenever a new algorithm starts.
     * @param {string} name - The algorithm name to display.
     */
    displayAlgorithmName(name) {
        // clear any existing timers to reset the display time if a new algorithm name comes in before the prior one is hidden
        clearTimeout(this.algorithmNameTimer);

        this.algosDisplayElement.textContent = `${name.toUpperCase()}`;

        // only show the element if not in silent mode; the name is still stored so
        // toggling off silent mode can reveal it
        if (!this.silenceMessages) {
            this.algosDisplayElement.style.display = 'block';
        }

        // hide the algorithm name after the default display time
        this.algorithmNameTimer = setTimeout(() => {
            this.algosDisplayElement.style.display = 'none';
            this.algosDisplayElement.textContent = '';
        }, this.algorithmNameDisplayTimeInMs);
    }

    /**
     * Show a temporary message for `this.messageDisplayTimeInMs` ms. Multiple messages stack
     * vertically, each with its own independent timer. If `key` is provided and a message with
     * that key is already visible, it is replaced immediately. If the stack is full
     * (`maxMessages`), the oldest is evicted. Messages are uppercased. Always shown regardless
     * of silent mode. Called externally by various modules for transient notifications.
     *
     * @param {string} message - The message to display.
     * @param {string|null} [key] - Optional key: replaces an existing message with the same key.
     */
    displayMessage(message, key = null) {
        if (key !== null) {
            const existing = this.messages.findIndex((msg) => msg.key === key);
            if (existing !== -1) {
                this.evictMessage(existing);
            }
        }

        if (this.messages.length >= this.maxMessages) {
            this.evictMessage(0);
        }

        const element = document.createElement('div');
        element.className = 'msg-item';
        element.textContent = message.toUpperCase();
        this.messageElement.append(element);

        const timer = setTimeout(() => {
            this.removeMessage(element);
        }, this.messageDisplayTimeInMs);

        this.messages.push({ element, key, timer });
    }

    /**
     * Immediately remove a message at the given index without animation.
     * Used for keyed replacement and max-capacity eviction.
     * @param {number} index - The index of the message to evict in the `this.messages` array.
     */
    evictMessage(index) {
        const msg = this.messages[index];
        clearTimeout(msg.timer);
        msg.element.remove();
        this.messages.splice(index, 1);
    }

    /**
     * Animate a message out and remove it from the DOM and messages array after the transition.
     * Falls back to a timeout if `transitionend` does not fire (e.g. in test environments).
     * @param {HTMLElement} element - The message element to remove.
     */
    removeMessage(element) {
        element.classList.add('msg-item-removing');

        const cleanup = () => {
            element.remove();
            const index = this.messages.findIndex((msg) => msg.element === element);
            if (index !== -1) {
                this.messages.splice(index, 1);
            }
        };

        // matches the --transition-slow duration (0.35s) used in .msg-item-removing
        const fallback = setTimeout(cleanup, 350);
        element.addEventListener(
            'transitionend',
            () => {
                clearTimeout(fallback);
                cleanup();
            },
            { once: true },
        );
    }

    /**
     * Toggle help screen on/off.
     */
    toggleHelpView() {
        this.showHelpView = !this.showHelpView;
        this.helpElement.style.display = this.showHelpView ? 'block' : 'none';
    }

    /**
     * Toggle silence mode on/off. No algorithm names will be shown.
     */
    toggleSilenceMode() {
        this.silenceMessages = !this.silenceMessages;

        if (this.silenceMessages) {
            // entering silent mode: hide the element but keep textContent so it
            // can be revealed if the user exits silent mode while the timer is still running
            this.algosDisplayElement.style.display = 'none';
        } else {
            // exiting silent mode: reveal the element if there is a pending name
            if (this.algosDisplayElement.textContent !== '') {
                this.algosDisplayElement.style.display = 'block';
            }
        }
    }
}
