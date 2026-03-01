// @vitest-environment jsdom

import FrequencyAnalyser from '../src/utils/FrequencyAnalyser.js';

function createMockAudioContext({ fftSize = 2048, binCount = 1024 } = {}) {
    const dataArray = new Uint8Array(binCount);
    const timeDomainData = new Uint8Array(fftSize);

    const mockAnalyser = {
        fftSize,
        frequencyBinCount: binCount,
        smoothingTimeConstant: 0.8,
        getByteFrequencyData: vi.fn((arr) => {
            for (let i = 0; i < arr.length; i++) {
                arr[i] = dataArray[i];
            }
        }),
        getByteTimeDomainData: vi.fn((arr) => {
            for (let i = 0; i < arr.length; i++) {
                arr[i] = timeDomainData[i];
            }
        }),
        connect: vi.fn(),
    };

    const mockSource = { connect: vi.fn() };

    const mockCtx = {
        createAnalyser: () => mockAnalyser,
        createMediaElementSource: () => mockSource,
        destination: {},
        state: 'running',
        resume: vi.fn(),
    };

    // eslint-disable-next-line func-style
    globalThis.AudioContext = vi.fn(function () { return mockCtx; });

    return { mockAnalyser, mockCtx, dataArray, timeDomainData };
}

describe('FrequencyAnalyser', () => {
    let analyser;
    let dataArray;
    let timeDomainData;

    beforeEach(() => {
        const mocks = createMockAudioContext();
        dataArray = mocks.dataArray;
        timeDomainData = mocks.timeDomainData;
        analyser = new FrequencyAnalyser({}, { bandCount: 5 });
    });

    afterEach(() => {
        delete globalThis.AudioContext;
    });

    describe('getBands', () => {
        it('returns an array of the requested band count', () => {
            const bands = analyser.getBands();
            expect(bands).toHaveLength(5);
        });

        it('returns all zeros when data array is all zeros', () => {
            dataArray.fill(0);
            const bands = analyser.getBands();
            for (const b of bands) {
                expect(b).toBe(0);
            }
        });

        it('returns values close to 0.5 when data is all 128', () => {
            dataArray.fill(128);
            const bands = analyser.getBands();
            for (const b of bands) {
                expect(b).toBeCloseTo(128 / 255, 1);
            }
        });

        it('returns values close to 1 when data is all 255', () => {
            dataArray.fill(255);
            const bands = analyser.getBands();
            for (const b of bands) {
                expect(b).toBeCloseTo(1, 1);
            }
        });

        it('returns values in 0-1 range', () => {
            dataArray.fill(200);
            const bands = analyser.getBands();
            for (const b of bands) {
                expect(b).toBeGreaterThanOrEqual(0);
                expect(b).toBeLessThanOrEqual(1);
            }
        });
    });

    describe('getWaveform', () => {
        it('returns normalized values between 0 and 1', () => {
            timeDomainData.fill(128);
            const waveform = analyser.getWaveform();
            for (const v of waveform) {
                expect(v).toBeGreaterThanOrEqual(0);
                expect(v).toBeLessThanOrEqual(1);
            }
        });

        it('normalizes 0 to 0', () => {
            timeDomainData.fill(0);
            const waveform = analyser.getWaveform();
            expect(waveform[0]).toBe(0);
        });

        it('normalizes 255 to 1', () => {
            timeDomainData.fill(255);
            const waveform = analyser.getWaveform();
            expect(waveform[0]).toBeCloseTo(1);
        });
    });

    describe('bandCount setter', () => {
        it('updates bandCount for values >= 1', () => {
            analyser.bandCount = 10;
            expect(analyser.bandCount).toBe(10);
        });

        it('floors non-integer values', () => {
            analyser.bandCount = 7.9;
            expect(analyser.bandCount).toBe(7);
        });

        it('ignores values below 1', () => {
            analyser.bandCount = 5;
            analyser.bandCount = 0;
            expect(analyser.bandCount).toBe(5);
        });
    });

    describe('resume', () => {
        it('calls AudioContext.resume when state is suspended', () => {
            analyser.audioContext.state = 'suspended';
            analyser.resume();
            expect(analyser.audioContext.resume).toHaveBeenCalledTimes(1);
        });

        it('does not call AudioContext.resume when state is running', () => {
            analyser.audioContext.state = 'running';
            analyser.resume();
            expect(analyser.audioContext.resume).not.toHaveBeenCalled();
        });
    });
});
