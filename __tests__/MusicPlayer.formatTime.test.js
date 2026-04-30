import MusicPlayer from '../src/MusicPlayer.js';

// Access formatTime directly from the prototype to avoid constructor DOM side effects.
const { formatTime } = MusicPlayer.prototype;

describe('musicPlayer.formatTime', () => {
    it('formats 0 seconds as 0:00', () => {
        expect(formatTime(0)).toBe('0:00');
    });

    it('formats seconds under a minute', () => {
        expect(formatTime(45)).toBe('0:45');
    });

    it('pads single-digit seconds with a leading zero', () => {
        expect(formatTime(65)).toBe('1:05');
    });

    it('formats two-digit minutes correctly', () => {
        expect(formatTime(125)).toBe('2:05');
    });

    it('formats exactly one minute', () => {
        expect(formatTime(60)).toBe('1:00');
    });

    it('formats a large value under one hour without hours', () => {
        expect(formatTime(3599)).toBe('59:59');
    });

    it('formats values over one hour with hours included', () => {
        expect(formatTime(3661)).toBe('1:01:01');
    });

    it('returns 0:00 for NaN', () => {
        expect(formatTime(Number.NaN)).toBe('0:00');
    });

    it('returns 0:00 for Infinity', () => {
        expect(formatTime(Infinity)).toBe('0:00');
    });

    it('returns 0:00 for negative values', () => {
        expect(formatTime(-10)).toBe('0:00');
    });

    it('truncates fractional seconds', () => {
        expect(formatTime(65.9)).toBe('1:05');
    });
});
