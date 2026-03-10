// @vitest-environment jsdom
// oxlint-disable max-classes-per-file

import BlockedAlgorithmsModal from '../src/BlockedAlgorithmsModal.js';

vi.mock(import('../src/generated/algorithmRegistry.js'), () => ({
    algorithms: [class AlgoA {}, class AlgoB {}, class AlgoC {}, class AlgoD {}, class AlgoE {}],
}));

vi.mock(import('../src/utils/BlockedAlgorithms.js'), () => ({
    saveBlockedAlgorithms: vi.fn(),
}));

function createTransitionManager(blockedNames = []) {
    return {
        blockedAlgorithms: new Set(blockedNames),
        setBlockedAlgorithms: vi.fn().mockImplementation(function setBlockedAlgorithms(names) {
            this.blockedAlgorithms = new Set(names);
        }),
    };
}

describe('blockedAlgorithmsModal', () => {
    let modal = null;
    let tm = null;

    beforeEach(() => {
        tm = createTransitionManager();
        modal = new BlockedAlgorithmsModal({ transitionManager: tm });
    });

    afterEach(() => {
        modal.destroy();
        vi.restoreAllMocks();
    });

    describe('constructor', () => {
        it('appends the modal element to the document body', () => {
            expect(document.querySelector('#blocked-algos-modal')).not.toBeNull();
        });

        it('starts hidden', () => {
            expect(document.querySelector('#blocked-algos-modal').style.display).toBe('none');
        });

        it('renders one checkbox per algorithm', () => {
            const checkboxes = document.querySelectorAll(
                '#blocked-algos-modal input[type="checkbox"]',
            );

            expect(checkboxes).toHaveLength(5);
        });

        it('renders algorithms sorted alphabetically', () => {
            const labels = [
                ...document.querySelectorAll('#blocked-algos-modal .blocked-item input'),
            ].map((checkbox) => checkbox.dataset.algoName);
            const sorted = [...labels].toSorted((a, b) => a.localeCompare(b));

            expect(labels).toStrictEqual(sorted);
        });
    });

    describe('toggleModal()', () => {
        it('shows the modal when it is hidden', () => {
            modal.toggleModal();

            expect(document.querySelector('#blocked-algos-modal').style.display).toBe('flex');
        });

        it('hides the modal when it is visible', () => {
            modal.toggleModal();
            modal.toggleModal();

            expect(document.querySelector('#blocked-algos-modal').style.display).toBe('none');
        });

        it('syncs checkbox state from the blocked set on open', () => {
            tm.blockedAlgorithms = new Set(['AlgoA', 'AlgoC']);
            modal.toggleModal();

            const checkboxes = [
                ...document.querySelectorAll('#blocked-algos-modal input[type="checkbox"]'),
            ];
            const checkedNames = checkboxes
                .filter((checkbox) => checkbox.checked)
                .map((checkbox) => checkbox.dataset.algoName);

            expect(checkedNames).toContain('AlgoA');
            expect(checkedNames).toContain('AlgoC');
            expect(checkedNames).not.toContain('AlgoB');
        });

        it('clears search input on open', () => {
            modal.searchInput.value = 'foo';
            modal.toggleModal();

            expect(modal.searchInput.value).toBe('');
        });
    });

    describe('updateList()', () => {
        it('shows correct blocked count', () => {
            tm.blockedAlgorithms = new Set(['AlgoA', 'AlgoB']);
            modal.updateList();

            expect(modal.countDisplay.textContent).toBe('2 / 5 blocked');
        });

        it('disables the last unblocked checkbox when at the limit', () => {
            // Block 4 of 5 — only AlgoE remains unblocked
            tm.blockedAlgorithms = new Set(['AlgoA', 'AlgoB', 'AlgoC', 'AlgoD']);
            modal.updateList();

            const checkboxes = [
                ...document.querySelectorAll('#blocked-algos-modal input[type="checkbox"]'),
            ];
            const unchecked = checkboxes.filter((checkbox) => !checkbox.checked);

            expect(unchecked).toHaveLength(1);
            expect(unchecked[0].disabled).toBeTruthy();
        });

        it('re-enables checkboxes when no longer at the limit', () => {
            tm.blockedAlgorithms = new Set(['AlgoA', 'AlgoB', 'AlgoC', 'AlgoD']);
            modal.updateList();
            tm.blockedAlgorithms = new Set(['AlgoA']);
            modal.updateList();

            const disabled = [
                ...document.querySelectorAll(
                    '#blocked-algos-modal input[type="checkbox"]:disabled',
                ),
            ];

            // All should be re-enabled since only 1 is blocked
            expect(disabled).toHaveLength(0);
        });
    });

    describe('filterList()', () => {
        it('hides items that do not match the search query', () => {
            modal.toggleModal();
            modal.searchInput.value = 'algoa';
            modal.filterList();

            const visible = [
                ...document.querySelectorAll('#blocked-algos-modal .blocked-item'),
            ].filter((item) => item.style.display !== 'none');

            expect(visible).toHaveLength(1);
            expect(visible[0].querySelector('input').dataset.algoName).toBe('AlgoA');
        });

        it('is case-insensitive', () => {
            modal.toggleModal();
            modal.searchInput.value = 'ALGOB';
            modal.filterList();

            const visible = [
                ...document.querySelectorAll('#blocked-algos-modal .blocked-item'),
            ].filter((item) => item.style.display !== 'none');

            expect(visible).toHaveLength(1);
        });

        it('shows all items when search is cleared', () => {
            modal.toggleModal();
            modal.searchInput.value = 'algoa';
            modal.filterList();
            modal.searchInput.value = '';
            modal.filterList();

            const hidden = [
                ...document.querySelectorAll('#blocked-algos-modal .blocked-item'),
            ].filter((item) => item.style.display === 'none');

            expect(hidden).toHaveLength(0);
        });
    });

    describe('handleCheckboxChange()', () => {
        it('adds a newly checked algorithm to the blocked set', () => {
            modal.toggleModal();
            const checkbox = [
                ...document.querySelectorAll('#blocked-algos-modal input[type="checkbox"]'),
            ].find((cbox) => cbox.dataset.algoName === 'AlgoA');
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change'));

            expect(tm.setBlockedAlgorithms).toHaveBeenCalledWith(expect.any(Set));
            expect(tm.blockedAlgorithms.has('AlgoA')).toBeTruthy();
        });

        it('removes an unchecked algorithm from the blocked set', () => {
            tm.blockedAlgorithms = new Set(['AlgoA']);
            modal.toggleModal();

            const checkbox = [
                ...document.querySelectorAll('#blocked-algos-modal input[type="checkbox"]'),
            ].find((cbox) => cbox.dataset.algoName === 'AlgoA');

            checkbox.checked = false;
            checkbox.dispatchEvent(new Event('change'));

            expect(tm.blockedAlgorithms.has('AlgoA')).toBeFalsy();
        });

        it('prevents blocking the last remaining algorithm', () => {
            // Block 4 of 5 — only AlgoE unblocked
            tm.blockedAlgorithms = new Set(['AlgoA', 'AlgoB', 'AlgoC', 'AlgoD']);
            modal.toggleModal();

            const lastCheckbox = [
                ...document.querySelectorAll('#blocked-algos-modal input[type="checkbox"]'),
            ].find((checkbox) => !checkbox.checked);

            // Try to check the last unblocked algo
            lastCheckbox.checked = true;
            lastCheckbox.dispatchEvent(new Event('change'));

            // Should be reverted and set not updated
            expect(lastCheckbox.checked).toBeFalsy();
            expect(tm.blockedAlgorithms.size).toBe(4);
        });
    });

    describe('destroy()', () => {
        it('removes the modal from the DOM', () => {
            modal.destroy();

            expect(document.querySelector('#blocked-algos-modal')).toBeNull();

            // Create a replacement for afterEach cleanup
            modal = new BlockedAlgorithmsModal({ transitionManager: tm });
        });
    });
});
