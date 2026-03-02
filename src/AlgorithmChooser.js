import { algorithms } from './generated/algorithmRegistry.js';

export default class AlgorithmChooser {
    constructor() {
        this.algorithms = algorithms;
        this.lastAlgos = new Set();
        this.lastAlgosCapacity = 50;
    }

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
