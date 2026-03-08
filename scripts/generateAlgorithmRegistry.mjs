import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const algosDir = path.join(projectRoot, 'src', 'algos');
const outputDir = path.join(projectRoot, 'src', 'generated');
const outputFile = path.join(outputDir, 'algorithmRegistry.js');

/**
 * Converts a filename to a valid JavaScript identifier (without extension).
 * Throws if the filename does not map to a valid identifier.
 * @param {string} filename - The filename to convert (e.g. 'MyAlgo.js').
 * @returns {string} The identifier (e.g. 'MyAlgo').
 * @throws {Error} If the filename does not map to a valid JavaScript identifier.
 */
function toIdentifier(filename) {
    const baseName = filename.replace(/\.js$/u, '');

    if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/u.test(baseName)) {
        throw new Error(
            `Algorithm file "${filename}" does not map to a valid JavaScript identifier.`,
        );
    }

    return baseName;
}

/**
 * Builds import and array lines for a list of algorithm files.
 * This is used to generate the contents of the algorithm registry file.
 * @param {string[]} files - List of .js filenames (e.g. ['MyAlgo.js']).
 * @returns {{ importLines: string[], arrayLines: string[] }} Object containing import lines and array lines for the given files.
 */
function buildFileContents(files) {
    const importLines = files.map((file) => {
        const identifier = toIdentifier(file);
        return `import ${identifier} from '../algos/${file}';`;
    });
    const arrayLines = files.map((file) => `    ${toIdentifier(file)},`);
    return { arrayLines, importLines };
}

/**
 * Main function to generate the algorithm registry file.
 * It reads the algorithm files from the algos directory, builds the import and array lines, and writes the output file.
 * Throws if no .js files are found in the algos directory.
 * @returns {Promise<void>} A promise that resolves when the file has been generated.
 * @throws {Error} If no .js files are found in the algos directory or if any filename does not map to a valid identifier.
 */
async function run() {
    const entries = await fs.readdir(algosDir, { withFileTypes: true });

    const algoFiles = entries
        .filter(
            (entry) =>
                entry.isFile() && entry.name.endsWith('.js') && !entry.name.startsWith('Template'),
        )
        .map((entry) => entry.name)
        .toSorted((a, b) => a.localeCompare(b));

    const templateFiles = entries
        .filter(
            (entry) =>
                entry.isFile() && entry.name.endsWith('.js') && entry.name.startsWith('Template'),
        )
        .map((entry) => entry.name)
        .toSorted((a, b) => a.localeCompare(b));

    if (algoFiles.length === 0 && templateFiles.length === 0) {
        throw new Error(`No .js files found in ${path.relative(projectRoot, algosDir)}.`);
    }

    const { importLines: algoImports, arrayLines: algoArray } = buildFileContents(algoFiles);
    const { importLines: templateImports, arrayLines: templateArray } =
        buildFileContents(templateFiles);

    const contents = [
        '// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.',
        '// Run "pnpm generate:algos" to refresh this list.',
        '',
        ...algoImports,
        ...templateImports,
        '',
        'export const algorithms = [',
        ...algoArray,
        '];',
        '',
        'export const templateAlgorithms = [',
        ...templateArray,
        '];',
        '',
    ].join('\n');

    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(outputFile, `${contents}\n`, 'utf8');
}

// If this script is run directly (e.g. "node generateAlgorithmRegistry.mjs"), execute the run function.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
    try {
        await run();
    } catch (error) {
        // oxlint-disable-next-line no-console
        console.error('Error generating algorithm registry:', error);
        throw new Error('Algorithm registry generation failed.', {
            cause: error,
        });
    }
}

export { buildFileContents, run, toIdentifier };
