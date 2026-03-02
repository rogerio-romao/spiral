import htmlEscape from '../../src/utils/htmlEscape.js';

describe('htmlEscape', () => {
    it('escapes ampersands', () => {
        expect(htmlEscape('a&b')).toBe('a&amp;b');
    });

    it('escapes less-than', () => {
        expect(htmlEscape('<div>')).toBe('&lt;div&gt;');
    });

    it('escapes greater-than', () => {
        expect(htmlEscape('a>b')).toBe('a&gt;b');
    });

    it('escapes double quotes', () => {
        expect(htmlEscape('"hello"')).toBe('&quot;hello&quot;');
    });

    it('escapes single quotes', () => {
        expect(htmlEscape("it's")).toBe('it&#39;s');
    });

    it('escapes forward slashes', () => {
        expect(htmlEscape('a/b')).toBe('a&#x2F;b');
    });

    it('escapes all characters in a combined string', () => {
        expect(htmlEscape('<a href="/path?a=1&b=2">')).toBe(
            '&lt;a href=&quot;&#x2F;path?a=1&amp;b=2&quot;&gt;',
        );
    });

    it('converts non-string input via String()', () => {
        expect(htmlEscape(42)).toBe('42');
        expect(htmlEscape(null)).toBe('null');
    });

    it('returns empty string for empty input', () => {
        expect(htmlEscape('')).toBe('');
    });

    it('leaves safe characters unchanged', () => {
        expect(htmlEscape('hello world 123')).toBe('hello world 123');
    });
});
