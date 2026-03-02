import { buildFileContents, run, toIdentifier } from '../generateAlgorithmRegistry.mjs';

const { mockReaddir, mockWriteFile, mockMkdir } = vi.hoisted(() => ({
    mockMkdir: vi.fn(),
    mockReaddir: vi.fn(),
    mockWriteFile: vi.fn(),
}));

// oxlint-disable-next-line vitest/prefer-import-in-mock
vi.mock('node:fs', () => ({
    promises: {
        mkdir: mockMkdir,
        readdir: mockReaddir,
        writeFile: mockWriteFile,
    },
}));

function makeEntry(name, isFile = true) {
    return { isFile: () => isFile, name };
}

describe('generateAlgorithmRegistry helpers', () => {
    describe('toIdentifier function', () => {
        it('strips the .js extension', () => {
            expect(toIdentifier('MyAlgorithm.js')).toBe('MyAlgorithm');
        });

        it('accepts names starting with underscore', () => {
            expect(toIdentifier('_Private.js')).toBe('_Private');
        });

        it('accepts names starting with dollar sign', () => {
            expect(toIdentifier('$Special.js')).toBe('$Special');
        });

        it('accepts names with numbers (not at start)', () => {
            expect(toIdentifier('Algo123.js')).toBe('Algo123');
        });

        it('throws for names with hyphens', () => {
            expect(() => toIdentifier('bad-name.js')).toThrow(
                'Algorithm file "bad-name.js" does not map to a valid JavaScript identifier',
            );
        });

        it('throws for names starting with a digit', () => {
            expect(() => toIdentifier('1Algorithm.js')).toThrow(
                'Algorithm file "1Algorithm.js" does not map to a valid JavaScript identifier',
            );
        });

        it('throws for names with spaces', () => {
            expect(() => toIdentifier('My Algo.js')).toThrow(
                'Algorithm file "My Algo.js" does not map to a valid JavaScript identifier',
            );
        });
    });

    describe('buildFileContents function', () => {
        it('generates import lines for each file', () => {
            const { importLines } = buildFileContents(['Algo1.js', 'Algo2.js']);
            expect(importLines).toStrictEqual([
                "import Algo1 from '../algos/Algo1.js';",
                "import Algo2 from '../algos/Algo2.js';",
            ]);
        });

        it('generates array lines for each file', () => {
            const { arrayLines } = buildFileContents(['Algo1.js', 'Algo2.js']);
            expect(arrayLines).toStrictEqual(['    Algo1,', '    Algo2,']);
        });

        it('returns empty arrays for empty input', () => {
            const { arrayLines, importLines } = buildFileContents([]);
            expect(importLines).toStrictEqual([]);
            expect(arrayLines).toStrictEqual([]);
        });

        it('throws when a filename is not a valid identifier', () => {
            expect(() => buildFileContents(['bad-name.js'])).toThrow(
                'Algorithm file "bad-name.js" does not map to a valid JavaScript identifier',
            );
        });
    });
});

describe('run function', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        mockMkdir.mockResolvedValue(null);
        mockWriteFile.mockResolvedValue(null);
    });

    it('writes the registry file with correct import lines on happy path', async () => {
        mockReaddir.mockResolvedValue([
            makeEntry('AlgoA.js'),
            makeEntry('AlgoB.js'),
            makeEntry('TemplateBasic.js'),
            makeEntry('README.md'),
            makeEntry('subdir', false),
        ]);

        await run();

        expect(mockWriteFile).toHaveBeenCalledOnce();
        const [[, content]] = mockWriteFile.mock.calls;
        expect(content).toContain("import AlgoA from '../algos/AlgoA.js';");
        expect(content).toContain("import AlgoB from '../algos/AlgoB.js';");
        expect(content).toContain("import TemplateBasic from '../algos/TemplateBasic.js';");
    });

    it('creates the output directory with recursive option', async () => {
        mockReaddir.mockResolvedValue([makeEntry('AlgoA.js')]);

        await run();

        expect(mockMkdir).toHaveBeenCalledWith(expect.any(String), { recursive: true });
    });

    it('separates algo files from template files', async () => {
        mockReaddir.mockResolvedValue([makeEntry('Orbit.js'), makeEntry('TemplateFoo.js')]);

        await run();

        const [[, content]] = mockWriteFile.mock.calls;
        expect(content).toContain('export const algorithms = [');
        expect(content).toContain('    Orbit,');
        expect(content).toContain('export const templateAlgorithms = [');
        expect(content).toContain('    TemplateFoo,');
    });

    it('throws when no .js files are found', async () => {
        mockReaddir.mockResolvedValue([makeEntry('README.md'), makeEntry('subdir', false)]);

        await expect(run()).rejects.toThrow('No .js files found');
    });
});
