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

    return [
        '// AUTO-GENERATED FILE. DO NOT EDIT DIRECTLY.',
        '// Run "pnpm generate:algos" to refresh this list.',
        '',
        ...importLines,
        '',
        'export const algorithms = [',
        ...arrayLines,
        '];',
        '',
    ].join('\n');
};

const run = async () => {
    const entries = await fs.readdir(algosDir, { withFileTypes: true });
    const files = entries
        .filter(
            (entry) =>
                entry.isFile() &&
                entry.name.endsWith('.js') &&
                entry.name !== 'Template.js',
        )
        .map((entry) => entry.name)
        .sort((a, b) => a.localeCompare(b));

    if (files.length === 0) {
        throw new Error(
            `No .js files found in ${path.relative(projectRoot, algosDir)}.`,
        );
    }

    const contents = buildFileContents(files);

    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(outputFile, `${contents}\n`, 'utf8');

    console.log(
        `Generated ${files.length} algorithms into ${path.relative(projectRoot, outputFile)}`,
    );
};

run().catch((error) => {
    console.error(error);
    process.exit(1);
});
