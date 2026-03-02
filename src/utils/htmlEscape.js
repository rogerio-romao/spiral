// Escapes HTML special characters for safe insertion into innerHTML or attributes
// Usage: htmlEscape(str)
export default function htmlEscape(str) {
    return String(str)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;')
        .replaceAll('/', '&#x2F;');
}
