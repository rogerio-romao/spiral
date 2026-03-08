import { algorithms, templateAlgorithms } from './generated/algorithmRegistry.js';

/**
 * Controller for the Developer Mode feature.
 * Handles the UI and logic for selecting and testing specific algorithms.
 */
export default class DevModeController {
    /**
     * @param {Object} options - Configuration options for the DevModeController
     * @param {import('./TransitionManager.js').default} options.transitionManager - The transition manager instance
     * @param {import('./HudController.js').default} options.hudController - The HUD controller instance
     */
    constructor({ hudController, transitionManager }) {
        this.hudController = hudController;
        this.transitionManager = transitionManager;

        this.initDomRefs();
        this.initState();
        this.initHandlers();
        this.applyDevModeBehavior();
    }

    /**
     * Applies the behavior for Developer Mode based on the environment.
     * If not in production, it initializes the Developer Mode UI and binds events.
     * Otherwise, it hides the Developer Mode modal and badge.
     */
    applyDevModeBehavior() {
        if (this.isNotProduction) {
            this.populateSelects();
            this.bindEvents();
            return;
        }

        this.modal.style.display = 'none';
        this.badge.style.display = 'none';
    }

    /**
     * Binds the previously prepared handlers (in `initHandlers`) as listeners to the Developer Mode UI elements.
     * These events handle enabling/disabling Developer Mode and selecting algorithms.
     */
    bindEvents() {
        this.enableCheckbox.addEventListener('change', this.onToggleDevModeChangeHandler);
        this.algoASelect.addEventListener('change', this.onAlgoAChangeHandler);
        this.algoBSelect.addEventListener('change', this.onAlgoBChangeHandler);
    }

    /**
     * Cleans up event listeners.
     * This method is called when the application is closing.
     */
    destroy() {
        this.enableCheckbox.removeEventListener('change', this.onToggleDevModeChangeHandler);
        this.algoASelect.removeEventListener('change', this.onAlgoAChangeHandler);
        this.algoBSelect.removeEventListener('change', this.onAlgoBChangeHandler);
    }

    /**
     * Initializes references to the required DOM elements for Developer Mode.
     * Throws an error if any of the required elements are missing.
     */
    initDomRefs() {
        /** @type {HTMLElement} */
        this.badge = document.querySelector('#dev-badge');
        if (!this.badge) {
            throw new Error('Missing required DOM element: #dev-badge');
        }

        /** @type {HTMLElement} */
        this.modal = document.querySelector('#dev-mode');
        if (!this.modal) {
            throw new Error('Missing required DOM element: #dev-mode');
        }

        this.algoASelect = document.querySelector('#dev-algo-a');
        if (!this.algoASelect) {
            throw new Error('Missing required DOM element: #dev-algo-a');
        }

        this.algoBSelect = document.querySelector('#dev-algo-b');
        if (!this.algoBSelect) {
            throw new Error('Missing required DOM element: #dev-algo-b');
        }

        this.enableCheckbox = document.querySelector('#dev-enable');
        if (!this.enableCheckbox) {
            throw new Error('Missing required DOM element: #dev-enable');
        }
    }

    /**
     * Initializes handler functions for Developer Mode events.
     * These handlers create references for binding and unbinding to DOM elements, such as cleaning up the listeners when the application is closing.
     */
    initHandlers() {
        this.onToggleDevModeChangeHandler = (e) => this.onToggleDevModeChange(e.target.checked);
        this.onAlgoAChangeHandler = (e) => this.onDevAlgoChange('A', e.target.value);
        this.onAlgoBChangeHandler = (e) => this.onDevAlgoChange('B', e.target.value);
    }

    /**
     * Initializes the state for Developer Mode.
     * Sets environment flags, tracks the active state of Developer Mode, and prepares the list of algorithms.
     */
    initState() {
        this.isNotProduction = globalThis.env?.isDevEnvironment;
        this.isDevModeActive = false;

        this.algoA = null;
        this.algoB = null;

        this.allAlgorithms = this.isNotProduction
            ? [...algorithms, ...templateAlgorithms].toSorted((a, b) =>
                  (a?.name ?? '').localeCompare(b?.name ?? ''),
              )
            : algorithms;
    }

    /**
     * Handles changes to the selected algorithm for a given slot (A or B).
     * Updates the selected algorithm and triggers the transition manager to use the new algorithms if Developer Mode is active.
     *
     * @param {'A' | 'B'} slot - The slot identifier ('A' or 'B').
     * @param {string} value - The selected algorithm index as a string, that comes from the corresponding select element's value. If the value is 'random', it sets the corresponding algorithm to null, which indicates that a random algorithm should be used for that slot.
     */
    onDevAlgoChange(slot, value) {
        if (slot === 'A') {
            this.algoA = value === 'random' ? null : this.allAlgorithms[Number(value)];
        } else {
            this.algoB = value === 'random' ? null : this.allAlgorithms[Number(value)];
        }

        // only update the algos if the dev mode checkbox is active
        if (this.isDevModeActive) {
            this.updateDevAlgos();
        }
    }

    /**
     * Toggles Developer Mode on or off based on the provided state of the checkbox.
     * Updates the transition manager and displays a message in the HUD.
     *
     * @param {boolean} enabled - Indicates whether Developer Mode should be enabled or disabled.
     */
    onToggleDevModeChange(enabled) {
        this.isDevModeActive = enabled;

        // transition manager uses the dev mode algos instead of regular behaviour when dev mode is active
        this.transitionManager.setDevModeActive(enabled);

        if (enabled) {
            this.updateDevAlgos();
            this.badge.style.display = 'block';
            this.hudController.displayMessage('DEV MODE ENABLED');
        } else {
            this.badge.style.display = 'none';
            this.hudController.displayMessage('DEV MODE DISABLED');
        }
    }

    /**
     * Populates the algorithm selection dropdowns for slots A and B when Developer Mode is active.
     * Combines all available algorithms and appends them as options to the respective select elements, after the "Random" option that is already present in the HTML. The options are sorted alphabetically.
     */
    populateSelects() {
        const fragment = document.createDocumentFragment();

        for (const [index, AlgoClass] of this.allAlgorithms.entries()) {
            const option = document.createElement('option');
            option.value = String(index);
            option.textContent = AlgoClass.name;
            fragment.append(option);
        }

        // cloneNode used to reuse the fragment, otherwise algoA would consume it and algoB would be empty
        this.algoASelect.append(fragment.cloneNode(true));
        this.algoBSelect.append(fragment);
    }

    /**
     * Toggles the visibility of the Developer Mode modal.
     */
    toggleDevModal() {
        const currentDisplayMode = this.modal.style.display;
        this.modal.style.display = currentDisplayMode === 'block' ? 'none' : 'block';
    }

    /**
     * Updates the transition manager with the currently selected algorithms for Developer Mode.
     */
    updateDevAlgos() {
        this.transitionManager.setDevModeAlgos(this.algoA, this.algoB);
    }
}
