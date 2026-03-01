import { promises as fs } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');
const algosDir = path.join(projectRoot, 'src', 'algos');
const outputDir = path.join(projectRoot, 'src', 'generated');
const outputFile = path.join(outputDir, 'algorithmRegistry.js');

const toIdentifier = (filename) => {
    const baseName = filename.replace(/\.js$/u, '');

    if (!/^[A-Za-z_$][A-Za-z0-9_$]*$/u.test(baseName)) {
        throw new Error(
            `Algorithm file "${filename}" does not map to a valid JavaScript identifier.`,
        );
    }

    return baseName;
};

const buildFileContents = (files) => {
    const importLines = files.map((file) => {
        const identifier = toIdentifier(file);
        return `import ${identifier} from '../algos/${file}';`;
    });
    const arrayLines = files.map((file) => `    ${toIdentifier(file)},`);
    return { importLines, arrayLines };
};

const run = async () => {
    const entries = await fs.readdir(algosDir, { withFileTypes: true });
    const algoFiles = entries
        .filter(
            (entry) =>
                entry.isFile() &&
                entry.name.endsWith('.js') &&
                !entry.name.startsWith('Template'),
        )
        .map((entry) => entry.name)
        .toSorted((a, b) => a.localeCompare(b));
    const templateFiles = entries
        .filter(
            (entry) =>
                entry.isFile() &&
                entry.name.endsWith('.js') &&
                entry.name.startsWith('Template'),
        )
        .map((entry) => entry.name)
        .toSorted((a, b) => a.localeCompare(b));

    if (algoFiles.length === 0 && templateFiles.length === 0) {
        throw new Error(
            `No .js files found in ${path.relative(projectRoot, algosDir)}.`,
        );
    }

    const { importLines: algoImports, arrayLines: algoArray } =
        buildFileContents(algoFiles);
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
};

try {
    await run();
} catch (error) {
    console.error(error);
    process.exit(1);
}
