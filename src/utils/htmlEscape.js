/** * Escapes special characters in a string to prevent HTML injection.
 *
 * @param {string} str - The string to be escaped.
 * @returns {string} The escaped string.
 */
export default function htmlEscape(str) {
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;')
        .replaceAll('/', '&#x2F;');
}
