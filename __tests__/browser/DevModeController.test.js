import DevModeController from '../../src/DevModeController.js';

// oxlint-disable-next-line vitest/prefer-import-in-mock
vi.mock('../../src/generated/algorithmRegistry.js', () => ({
    // oxlint-disable unicorn/no-static-only-class
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
    // oxlint-enable unicorn/no-static-only-class
}));

const FIXTURE = `
    <div id="dev-mode" style="display:none">
        <label><input type="checkbox" id="dev-enable" /><span>Enable Dev Mode</span></label>
        <div class="dev-selects">
            <label>
                <span>Algorithm A:</span>
                <select id="dev-algo-a"><option value="">Random</option></select>
            </label>
            <label>
                <span>Algorithm B:</span>
                <select id="dev-algo-b"><option value="">Random</option></select>
            </label>
        </div>
    </div>
    <div id="dev-badge">DEV</div>
`;

function createDeps() {
    return {
        hud: {
            displayMessage: vi.fn(),
        },
        transitionManager: {
            setDevModeActive: vi.fn(),
            setDevModeAlgos: vi.fn(),
        },
    };
}

describe('devModeController (browser)', () => {
    beforeEach(() => {
        document.body.innerHTML = FIXTURE;
    });

    afterEach(() => {
        delete globalThis.env;
    });

    it('populates selects with algorithm options in dev mode', () => {
        globalThis.env = { isDev: true };
        const deps = createDeps();
        const ctrl = new DevModeController(deps);
        const options = document.querySelectorAll('#dev-algo-a option');
        // 3 algo classes appended to existing "Random" option = 4 total
        expect(options).toHaveLength(4);
        ctrl.destroy();
    });

    it('hides modal and badge in prod mode', () => {
        globalThis.env = { isDev: false };
        // oxlint-disable-next-line no-new
        new DevModeController(createDeps());
        expect(document.querySelector('#dev-mode').style.display).toBe('none');
        expect(document.querySelector('#dev-badge').style.display).toBe('none');
    });

    it('toggle opens and closes the modal', () => {
        globalThis.env = { isDev: true };
        const deps = createDeps();
        const ctrl = new DevModeController(deps);
        ctrl.toggleDevModal();
        expect(document.querySelector('#dev-mode').style.display).toBe('block');
        ctrl.toggleDevModal();
        expect(document.querySelector('#dev-mode').style.display).toBe('none');
        ctrl.destroy();
    });

    it('enable checkbox calls setDevModeActive and shows badge', () => {
        globalThis.env = { isDev: true };
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
        globalThis.env = { isDev: true };
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
        globalThis.env = { isDev: true };
        const deps = createDeps();
        const ctrl = new DevModeController(deps);
        ctrl.destroy();
        const checkbox = document.querySelector('#dev-enable');
        checkbox.checked = true;
        checkbox.dispatchEvent(new Event('change'));
        expect(deps.transitionManager.setDevModeActive).not.toHaveBeenCalled();
    });
});
