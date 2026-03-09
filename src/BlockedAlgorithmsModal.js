import { algorithms } from './generated/algorithmRegistry.js';

/** @typedef {import('./TransitionManager.js').default} TransitionManager */

/**
 * BlockedAlgorithmsModal — modal UI for managing the blocked algorithms list.
 *
 * Renders a searchable, scrollable list of all algorithms with checkboxes.
 * Checked = blocked. The last unblocked algorithm's checkbox is disabled to
 * ensure at least one algorithm is always available.
 *
 * DOM is created and appended programmatically to avoid polluting index.html.
 */
export default class BlockedAlgorithmsModal {
    /**
     * @param {Object} deps - Dependencies object containing required components
     * @param {TransitionManager} deps.transitionManager - TransitionManager instance to read/update blocked algorithms
     */
    constructor({ transitionManager }) {
        /** @type {TransitionManager} */
        this.transitionManager = transitionManager;

        this.sortedAlgorithms = [...algorithms].toSorted((a, b) => a.name.localeCompare(b.name));

        this.modal = this.createModal();
        document.body.append(this.modal);
    }

    /**
     * Build the modal DOM and wire up internal event listeners.
     * @returns {HTMLDivElement} The root modal element, not yet attached to the document.
     * */
    createModal() {
        const modal = document.createElement('div');
        modal.id = 'blocked-algos-modal';
        modal.style.display = 'none';

        const heading = document.createElement('h3');
        heading.textContent = 'BLOCKED ALGORITHMS';

        this.countDisplay = document.createElement('p');
        this.countDisplay.className = 'blocked-count';

        this.searchInput = document.createElement('input');
        this.searchInput.type = 'text';
        this.searchInput.placeholder = 'Filter...';
        this.searchInput.className = 'blocked-search';
        this.searchInput.addEventListener('input', () => this.filterList());

        this.listContainer = document.createElement('div');
        this.listContainer.className = 'blocked-list';

        for (const algo of this.sortedAlgorithms) {
            const item = document.createElement('label');
            item.className = 'blocked-item';

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.dataset.algoName = algo.name;
            checkbox.addEventListener('change', (e) => this.handleCheckboxChange(e));

            item.append(checkbox);
            item.append(document.createTextNode(algo.name));
            this.listContainer.append(item);
        }

        const closeBtn = document.createElement('button');
        closeBtn.textContent = 'Close';
        closeBtn.className = 'blocked-close';
        closeBtn.addEventListener('click', () => this.toggleModal());

        modal.append(heading);
        modal.append(this.countDisplay);
        modal.append(this.searchInput);
        modal.append(this.listContainer);
        modal.append(closeBtn);

        return modal;
    }

    /** Remove the modal from the DOM. */
    destroy() {
        this.modal.remove();
    }

    /** Filter visible list items by the current search input value. */
    filterList() {
        const query = this.searchInput.value.toLowerCase();

        /** @type {NodeListOf<HTMLLabelElement>} */
        const items = this.listContainer.querySelectorAll('label.blocked-item');

        for (const item of items) {
            const name = item.querySelector('input').dataset.algoName.toLowerCase();

            item.style.display = name.includes(query) ? '' : 'none';
        }
    }

    /**
     * Handle a checkbox toggle — update the blocked set and refresh UI.
     * @param {Event} e - The change event from the checkbox input.
     */
    handleCheckboxChange(e) {
        const checkbox = /** @type {HTMLInputElement} */ (e.target);
        const name = checkbox.dataset.algoName;
        const { blockedAlgorithms } = this.transitionManager;

        if (checkbox.checked) {
            // Guard: never block the last remaining algorithm
            if (blockedAlgorithms.size >= algorithms.length - 1) {
                checkbox.checked = false;
                return;
            }

            blockedAlgorithms.add(name);
        } else {
            blockedAlgorithms.delete(name);
        }

        this.transitionManager.setBlockedAlgorithms(blockedAlgorithms);
        this.updateList();
    }

    /** Show or hide the modal. Syncs list state on open. */
    toggleModal() {
        if (this.modal.style.display === 'none') {
            this.updateList();
            this.searchInput.value = '';
            this.filterList();
            this.modal.style.display = 'flex';
        } else {
            this.modal.style.display = 'none';
        }
    }

    /**
     * Sync all checkbox checked/disabled states from the current blocked set,
     * and update the count display.
     */
    updateList() {
        const { blockedAlgorithms } = this.transitionManager;
        const activeCount = algorithms.length - blockedAlgorithms.size;
        const atLimit = activeCount <= 1;

        this.countDisplay.textContent = `${blockedAlgorithms.size} / ${algorithms.length} blocked`;

        /** @type {NodeListOf<HTMLInputElement>} */
        const checkboxes = this.listContainer.querySelectorAll('input[type="checkbox"]');

        for (const checkbox of checkboxes) {
            const name = checkbox.dataset.algoName;
            const isBlocked = blockedAlgorithms.has(name);
            checkbox.checked = isBlocked;
            // Disable the checkbox for the last remaining unblocked algorithm
            checkbox.disabled = atLimit && !isBlocked;
            checkbox.closest('label').classList.toggle('blocked-item-last', atLimit && !isBlocked);
        }
    }
}
