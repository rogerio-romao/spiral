// @vitest-environment jsdom

import FrequencyAnalyser from '../src/utils/FrequencyAnalyser.js';

function createMockAudioContext({ fftSize = 2048, binCount = 1024 } = {}) {
    const dataArray = new Uint8Array(binCount);
    const timeDomainData = new Uint8Array(fftSize);

    const mockAnalyser = {
        connect: vi.fn(),
        fftSize,
        frequencyBinCount: binCount,
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
        smoothingTimeConstant: 0.8,
    };

    const mockSource = { connect: vi.fn() };

    const mockGainNode = {
        connect: vi.fn(),
        gain: {
            cancelScheduledValues: vi.fn(),
            linearRampToValueAtTime: vi.fn(),
            setValueAtTime: vi.fn(),
            value: 1,
        },
    };

    const mockCtx = {
        createAnalyser: () => mockAnalyser,
        createGain: () => mockGainNode,
        createMediaElementSource: () => mockSource,
        currentTime: 0,
        destination: {},
        resume: vi.fn(),
        state: 'running',
    };

    // oxlint-disable-next-line jest/prefer-spy-on - in jsdom environment, AudioContext is not constructible, so we mock
    globalThis.AudioContext = vi.fn(function audioContext() {
        return mockCtx;
    });

    return { dataArray, mockAnalyser, mockCtx, mockGainNode, timeDomainData };
}

describe('frequencyAnalyser', () => {
    let analyser = null;
    let dataArray = null;
    let timeDomainData = null;

    beforeEach(() => {
        const mocks = createMockAudioContext();
        ({ dataArray } = mocks);
        ({ timeDomainData } = mocks);
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

            for (const value of waveform) {
                expect(value).toBeGreaterThanOrEqual(0);
                expect(value).toBeLessThanOrEqual(1);
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

            expect(analyser.audioContext.resume).toHaveBeenCalledOnce();
        });

        it('does not call AudioContext.resume when state is running', () => {
            analyser.audioContext.state = 'running';
            analyser.resume();

            expect(analyser.audioContext.resume).not.toHaveBeenCalled();
        });
    });

    describe('fadeTo', () => {
        beforeEach(() => {
            vi.useFakeTimers();
        });

        afterEach(() => {
            vi.useRealTimers();
        });

        it('cancels scheduled values and anchors current gain before ramp', async () => {
            const promise = analyser.fadeTo(0, 80);
            vi.runAllTimers();
            await promise;

            const { gain } = analyser.gainNode;
            expect(gain.cancelScheduledValues).toHaveBeenCalledWith(0);
            expect(gain.setValueAtTime).toHaveBeenCalledWith(1, 0);
        });

        it('schedules a linear ramp to the target gain', async () => {
            const promise = analyser.fadeTo(0, 80);
            vi.runAllTimers();
            await promise;

            const { gain } = analyser.gainNode;
            expect(gain.linearRampToValueAtTime).toHaveBeenCalledWith(0, 0.08);
        });

        it('resolves after the given duration', async () => {
            let isResolved = false;

            async function doFade() {
                await analyser.fadeTo(0, 80);
                isResolved = true;
            }

            doFade();

            expect(isResolved).toBeFalsy();

            vi.advanceTimersByTime(80);
            await Promise.resolve();

            expect(isResolved).toBeTruthy();
        });
    });

    describe('setGain', () => {
        it('cancels scheduled values and immediately sets gain', () => {
            analyser.setGain(0);
            const { gain } = analyser.gainNode;

            expect(gain.cancelScheduledValues).toHaveBeenCalledWith(0);
            expect(gain.setValueAtTime).toHaveBeenCalledWith(0, 0);
        });

        it('works for any gain value', () => {
            analyser.setGain(0.5);
            const { gain } = analyser.gainNode;

            expect(gain.setValueAtTime).toHaveBeenCalledWith(0.5, 0);
        });
    });
});
