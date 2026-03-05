import { algorithms } from './generated/algorithmRegistry.js';

/**
 * Chooses random algorithm classes, avoiding recent repeats.
 */
export default class AlgorithmChooser {
    /**
     * Creates an AlgorithmChooser instance.
     * @property {Array<Function>} algorithms - List of available algorithm classes.
     * @property {Set<Function>} lastAlgos - Set of recently used algorithm classes.
     * @property {number} lastAlgosCapacity - Maximum number of recent algorithms to track.
     */
    constructor() {
        /**
         * List of available algorithm classes.
         * @type {Array<Function>}
         */
        this.algorithms = algorithms;
        /**
         * Set of recently used algorithm classes.
         * @type {Set<Function>}
         */
        this.lastAlgos = new Set();
        /**
         * Maximum number of recent algorithms to track.
         * @type {number}
         */
        this.lastAlgosCapacity = 50;
    }

    /**
     * Returns a random algorithm class, avoiding recently used ones.
     * Adds the selected algorithm to the recent set and evicts the oldest if needed.
     *
     * @returns {Function} The chosen algorithm class constructor.
     */
    getRandomAlgorithm() {
        const picks = this.algorithms.filter((algo) => !this.lastAlgos.has(algo));

        const randomIndex = Math.floor(Math.random() * picks.length);
        const AlgorithmClass = picks[randomIndex];

        this.lastAlgos.add(AlgorithmClass);
        if (this.lastAlgos.size > this.lastAlgosCapacity) {
            this.lastAlgos.delete(this.lastAlgos.values().next().value);
        }

        return AlgorithmClass;
    }
}
