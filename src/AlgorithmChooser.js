import { algorithms } from './generated/algorithmRegistry.js';

export default class AlgorithmChooser {
    constructor() {
        this.algorithms = algorithms;
        this.lastAlgos = [];
        this.lastAlgosCapacity = 50;
    }

    getRandomAlgorithm() {
        const picks = this.algorithms.filter(
            (algo) => !this.lastAlgos.includes(algo),
        );

        const randomIndex = Math.floor(Math.random() * picks.length);
        const AlgorithmClass = picks[randomIndex];

        this.lastAlgos.push(AlgorithmClass);
        if (this.lastAlgos.length > this.lastAlgosCapacity) {
            this.lastAlgos.shift();
        }

        return AlgorithmClass;
    }
}
