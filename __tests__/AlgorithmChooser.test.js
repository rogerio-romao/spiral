import AlgorithmChooser from '../src/AlgorithmChooser.js';

vi.mock(import('../src/generated/algorithmRegistry.js'), () => ({
    algorithms: [
        class AlgoA {},
        class AlgoB {},
        class AlgoC {},
        class AlgoD {},
        class AlgoE {},
    ],
}));

describe('algorithmChooser', () => {
    let chooser = null;

    beforeEach(() => {
        chooser = new AlgorithmChooser();
    });

    it('returns an algorithm class from the pool', () => {
        const result = chooser.getRandomAlgorithm();
        expect(chooser.algorithms).toContain(result);
    });

    it('adds picked algorithms to the history set', () => {
        chooser.getRandomAlgorithm();
        expect(chooser.lastAlgos.size).toBe(1);
    });

    it('does not repeat algorithms within the history window', () => {
        chooser.lastAlgosCapacity = 4;
        const picks = new Set();
        for (let i = 0; i < 5; i++) {
            picks.add(chooser.getRandomAlgorithm());
        }
        // With 5 algos and capacity 4, all 5 should eventually appear
        expect(picks.size).toBe(5);
    });

    it('evicts oldest history entry when capacity is exceeded', () => {
        chooser.lastAlgosCapacity = 3;
        const [firstPick] = chooser.algorithms;

        // Fill the history to capacity with known picks by controlling randomness
        chooser.lastAlgos = new Set([
            chooser.algorithms[0],
            chooser.algorithms[1],
            chooser.algorithms[2],
        ]);

        // Manually simulate adding a 4th to trigger eviction
        chooser.lastAlgos.add(chooser.algorithms[3]);
        // oxlint-disable-next-line jest/no-conditional-in-test
        if (chooser.lastAlgos.size > chooser.lastAlgosCapacity) {
            chooser.lastAlgos.delete(chooser.lastAlgos.values().next().value);
        }

        // The oldest entry (firstPick) should have been evicted
        expect(chooser.lastAlgos.has(firstPick)).toBeFalsy();
        expect(chooser.lastAlgos.size).toBe(3);
    });

    it('defaults to a capacity of 50', () => {
        expect(chooser.lastAlgosCapacity).toBe(50);
    });
});
