import DevModeController from '../../src/DevModeController.js';

vi.mock(import('../../src/generated/algorithmRegistry.js'), () => ({
    // oxlint-disable unicorn/no-static-only-class - we just want to group static properties together for this mock
    algorithms: [
        class AlgoA {
            static name = 'AlgoA';
        },
        class AlgoB {
            static name = 'AlgoB';
        },
    ],
    templateAlgorithms: [
        class TmplA {
            static name = 'TmplA';
        },
    ],
}));

const FIXTURE = `
    <div id="dev-mode" style="display:none">
        <label><input type="checkbox" id="dev-enable" /><span>Enable Dev Mode</span></label>
        <div class="dev-selects">
            <label>
                <span>Algorithm A:</span>
                <select id="dev-algo-a"><option value="random">Random</option></select>
            </label>
            <label>
                <span>Algorithm B:</span>
                <select id="dev-algo-b"><option value="random">Random</option></select>
            </label>
        </div>
    </div>
    <div id="dev-badge">DEV</div>
`;

function createDeps() {
    return {
        hudController: {
            displayMessage: vi.fn(),
        },
        transitionManager: {
            setDevModeActive: vi.fn(),
            setDevModeAlgos: vi.fn(),
        },
    };
}

describe('devModeController (browser)', () => {
    describe('random option sets algoA/algoB to null and calls setDevModeAlgos', () => {
        beforeEach(() => {
            globalThis.env = { isDevEnvironment: true };
        });

        it('selecting Random for algoA sets algoA to null and calls setDevModeAlgos', () => {
            const deps = createDeps();
            const ctrl = new DevModeController(deps);
            // Enable dev mode
            const checkbox = document.querySelector('#dev-enable');
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change'));
            deps.transitionManager.setDevModeAlgos.mockClear();
            // Select Random for algoA
            const algoASelect = document.querySelector('#dev-algo-a');
            algoASelect.value = 'random';
            algoASelect.dispatchEvent(new Event('change'));
            expect(ctrl.algoA).toBeNull();
            expect(deps.transitionManager.setDevModeAlgos).toHaveBeenCalledWith(null, ctrl.algoB);
            ctrl.destroy();
        });

        it('selecting Random for algoB sets algoB to null and calls setDevModeAlgos', () => {
            const deps = createDeps();
            const ctrl = new DevModeController(deps);
            // Enable dev mode
            const checkbox = document.querySelector('#dev-enable');
            checkbox.checked = true;
            checkbox.dispatchEvent(new Event('change'));
            deps.transitionManager.setDevModeAlgos.mockClear();
            // Select Random for algoB
            const algoBSelect = document.querySelector('#dev-algo-b');
            algoBSelect.value = 'random';
            algoBSelect.dispatchEvent(new Event('change'));
            expect(ctrl.algoB).toBeNull();
            expect(deps.transitionManager.setDevModeAlgos).toHaveBeenCalledWith(ctrl.algoA, null);
            ctrl.destroy();
        });
    });
    describe('error handling for missing DOM elements', () => {
        const requiredSelectors = [
            { label: 'dev-badge', selector: '#dev-badge' },
            { label: 'dev-mode', selector: '#dev-mode' },
            { label: 'dev-algo-a', selector: '#dev-algo-a' },
            { label: 'dev-algo-b', selector: '#dev-algo-b' },
            { label: 'dev-enable', selector: '#dev-enable' },
        ];

        it.each(requiredSelectors)(
            'throws if required DOM element %s is missing',
            ({ selector, label }) => {
                globalThis.env = { isDevEnvironment: true };
                // Remove the element from the fixture
                document.body.innerHTML = FIXTURE;
                const el = document.querySelector(selector);
                el?.remove();
                const deps = createDeps();
                expect(() => new DevModeController(deps)).toThrow(
                    new RegExp(`Missing required DOM element: #${label}`),
                );
            },
        );
    });
    beforeEach(() => {
        document.body.innerHTML = FIXTURE;
    });

    afterEach(() => {
        delete globalThis.env;
    });

    it('populates selects with algorithm options in dev mode', () => {
        globalThis.env = { isDevEnvironment: true };
        const deps = createDeps();
        const ctrl = new DevModeController(deps);
        const options = document.querySelectorAll('#dev-algo-a option');
        // 3 algo classes appended to existing "Random" option = 4 total
        expect(options).toHaveLength(4);
        ctrl.destroy();
    });

    it('hides modal and badge in prod mode', () => {
        globalThis.env = { isDevEnvironment: false };
        // oxlint-disable-next-line no-new
        new DevModeController(createDeps());
        expect(document.querySelector('#dev-mode').style.display).toBe('none');
        expect(document.querySelector('#dev-badge').style.display).toBe('none');
    });

    it('toggle opens and closes the modal', () => {
        globalThis.env = { isDevEnvironment: true };
        const deps = createDeps();
        const ctrl = new DevModeController(deps);
        ctrl.toggleDevModal();
        expect(document.querySelector('#dev-mode').style.display).toBe('block');
        ctrl.toggleDevModal();
        expect(document.querySelector('#dev-mode').style.display).toBe('none');
        ctrl.destroy();
    });

    it('enable checkbox calls setDevModeActive and shows badge', () => {
        globalThis.env = { isDevEnvironment: true };
        const deps = createDeps();
        const ctrl = new DevModeController(deps);
        const checkbox = document.querySelector('#dev-enable');
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event('change'));
        expect(deps.transitionManager.setDevModeActive).toHaveBeenCalledWith(true);
        expect(document.querySelector('#dev-badge').style.display).toBe('block');
        ctrl.destroy();
    });

    it('algo select change triggers setDevModeAlgos when active', () => {
        globalThis.env = { isDevEnvironment: true };
        const deps = createDeps();
        const ctrl = new DevModeController(deps);
        const checkbox = document.querySelector('#dev-enable');
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event('change'));
        deps.transitionManager.setDevModeAlgos.mockClear();
        const algoASelect = document.querySelector('#dev-algo-a');
        algoASelect.value = '0';
        algoASelect.dispatchEvent(new Event('change'));
        expect(deps.transitionManager.setDevModeAlgos).toHaveBeenCalledOnce();
        ctrl.destroy();
    });

    it('destroy removes event listeners', () => {
        globalThis.env = { isDevEnvironment: true };
        const deps = createDeps();
        const ctrl = new DevModeController(deps);
        ctrl.destroy();
        const checkbox = document.querySelector('#dev-enable');
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event('change'));
        expect(deps.transitionManager.setDevModeActive).not.toHaveBeenCalled();
    });
});
