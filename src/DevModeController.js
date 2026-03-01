import {
    algorithms,
    templateAlgorithms,
} from './generated/algorithmRegistry.js';

export default class DevModeController {
    constructor({ transitionManager, hud }) {
        this._transitionManager = transitionManager;
        this._hud = hud;

        this._isDev = globalThis.env?.isDev;
        this._modal = document.querySelector('#dev-mode');
        this._enableCheckbox = document.querySelector('#dev-enable');
        this._algoASelect = document.querySelector('#dev-algo-a');
        this._algoBSelect = document.querySelector('#dev-algo-b');
        this._badge = document.querySelector('#dev-badge');

        this._active = false;
        this._algoA = null;
        this._algoB = null;

        this._onEnableChangeHandler = (e) =>
            this._onEnableChange(e.target.checked);
        this._onAlgoAChangeHandler = (e) =>
            this._onAlgoChange('A', e.target.value);
        this._onAlgoBChangeHandler = (e) =>
            this._onAlgoChange('B', e.target.value);

        // Combine both for dev mode
        // Concatenate and sort by class name so Template* appears with other T algos
        this._allAlgorithms = this._isDev
            ? [...algorithms, ...templateAlgorithms].toSorted((a, b) => {
                  if (!a?.name || !b?.name) {
                      return 0;
                  }
                  return a.name.localeCompare(b.name);
              })
            : algorithms;

        if (this._isDev) {
            this._populateSelects();
            this._bindEvents();
        } else {
            // Hide modal and badge in production
            if (this._modal) {
                this._modal.style.display = 'none';
            }
            if (this._badge) {
                this._badge.style.display = 'none';
            }
        }
    }

    _populateSelects() {
        const fragment = document.createDocumentFragment();

        for (const [index, AlgoClass] of this._allAlgorithms.entries()) {
            const option = document.createElement('option');
            option.value = index;
            option.textContent = AlgoClass.name;
            fragment.append(option);
        }

        this._algoASelect.append(fragment.cloneNode(true));
        this._algoBSelect.append(fragment);
    }

    _bindEvents() {
        this._enableCheckbox.addEventListener(
            'change',
            this._onEnableChangeHandler,
        );
        this._algoASelect.addEventListener(
            'change',
            this._onAlgoAChangeHandler,
        );
        this._algoBSelect.addEventListener(
            'change',
            this._onAlgoBChangeHandler,
        );
    }

    toggle() {
        if (this._modal.style.display === 'block') {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this._modal.style.display = 'block';
    }

    close() {
        this._modal.style.display = 'none';
    }

    _onEnableChange(enabled) {
        this._active = enabled;
        this._transitionManager.setDevModeActive(enabled);

        if (enabled) {
            this._updateAlgos();
            this._badge.style.display = 'block';
            this._hud.displayMessage('DEV MODE ENABLED');
        } else {
            this._badge.style.display = 'none';
            this._hud.displayMessage('DEV MODE DISABLED');
        }
    }

    _onAlgoChange(slot, value) {
        if (slot === 'A') {
            this._algoA =
                value === ''
                    ? null
                    : this._allAlgorithms[Number.parseInt(value, 10)];
        } else {
            this._algoB =
                value === ''
                    ? null
                    : this._allAlgorithms[Number.parseInt(value, 10)];
        }

        if (this._active) {
            this._updateAlgos();
        }
    }

    _updateAlgos() {
        this._transitionManager.setDevModeAlgos(this._algoA, this._algoB);
    }

    destroy() {
        this._enableCheckbox.removeEventListener(
            'change',
            this._onEnableChangeHandler,
        );
        this._algoASelect.removeEventListener(
            'change',
            this._onAlgoAChangeHandler,
        );
        this._algoBSelect.removeEventListener(
            'change',
            this._onAlgoBChangeHandler,
        );
    }
}
