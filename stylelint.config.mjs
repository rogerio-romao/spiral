// oxlint-disable sort-keys
/** @type {import("stylelint").Config} */
// oxlint-disable-next-line import/no-anonymous-default-export
export default {
    extends: ['stylelint-config-standard'],
    reportDescriptionlessDisables: true,
    reportInvalidScopeDisables: true,
    reportNeedlessDisables: true,
    rules: {
        'no-descending-specificity': null,
        'no-unknown-animations': true,
        'no-unknown-custom-media': true,
        'no-unknown-custom-properties': true,
        'function-url-no-scheme-relative': true,
    },
    ignoreFiles: ['**/node_modules/**', '**/dist/**', '**/coverage/**'],
};
