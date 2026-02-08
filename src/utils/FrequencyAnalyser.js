/**
 * FrequencyAnalyser — wraps the Web Audio API to provide real-time
 * frequency band data from an HTMLAudioElement.
 *
 * Audio graph: MediaElementSource → AnalyserNode → AudioContext.destination
 * (audio still plays through speakers).
 *
 * Usage:
 *   const analyser = new FrequencyAnalyser(audioElement, { bandCount: 3 });
 *   analyser.resume();          // call on user gesture
 *   const bands = analyser.getBands(); // [0.72, 0.35, 0.11]  (0–1 normalised)
 */
export default class FrequencyAnalyser {
    /**
     * @param {HTMLAudioElement} audioElement — the <audio> element to analyse.
     * @param {object}  [options]
     * @param {number}  [options.bandCount=3]  — number of frequency bands.
     * @param {number}  [options.fftSize=2048] — FFT window size (power of 2).
     * @param {number}  [options.smoothing=0.8] — smoothingTimeConstant (0–1).
     */
    constructor(audioElement, { bandCount = 3, fftSize = 2048, smoothing = 0.8 } = {}) {
        this._bandCount = bandCount;

        // Create the audio context and graph
        this._ctx = new (window.AudioContext || window.webkitAudioContext)();
        this._analyser = this._ctx.createAnalyser();
        this._analyser.fftSize = fftSize;
        this._analyser.smoothingTimeConstant = smoothing;

        // createMediaElementSource can only be called once per element
        this._source = this._ctx.createMediaElementSource(audioElement);
        this._source.connect(this._analyser);
        this._analyser.connect(this._ctx.destination);

        // Reusable buffer for frequency data
        this._dataArray = new Uint8Array(this._analyser.frequencyBinCount);
    }

    /** Number of bands currently configured. */
    get bandCount() {
        return this._bandCount;
    }

    /**
     * Update the number of frequency bands.
     * @param {number} count — new band count (must be >= 1).
     */
    set bandCount(count) {
        if (count >= 1) {
            this._bandCount = Math.floor(count);
        }
    }

    /**
     * Resume the AudioContext — must be called from a user gesture
     * (e.g. click/keypress) to satisfy browser autoplay policy.
     * Subsequent calls are no-ops.
     */
    resume() {
        if (this._ctx.state === 'suspended') {
            this._ctx.resume();
        }
    }

    /**
     * Get the current frequency data split into `bandCount` bands,
     * each normalised to 0–1.
     *
     * @returns {number[]} Array of length `bandCount` with values 0–1.
     *   Returns all zeros when nothing is playing.
     */
    getBands() {
        this._analyser.getByteFrequencyData(this._dataArray);

        const binCount = this._dataArray.length;
        const binsPerBand = Math.floor(binCount / this._bandCount);
        const bands = new Array(this._bandCount);

        for (let b = 0; b < this._bandCount; b++) {
            const start = b * binsPerBand;
            // Last band absorbs any remainder bins
            const end = b === this._bandCount - 1
                ? binCount
                : start + binsPerBand;

            let sum = 0;
            for (let i = start; i < end; i++) {
                sum += this._dataArray[i];
            }
            // Normalise: byte values are 0–255
            bands[b] = sum / ((end - start) * 255);
        }

        return bands;
    }

    /**
     * Get the raw byte frequency data (0–255 per bin).
     * Useful for advanced visualisations that need full FFT resolution.
     *
     * @returns {Uint8Array} The internal data array (mutated on each call).
     */
    getRawData() {
        this._analyser.getByteFrequencyData(this._dataArray);
        return this._dataArray;
    }

    /** The underlying AnalyserNode, for advanced configuration. */
    get analyserNode() {
        return this._analyser;
    }

    /** The underlying AudioContext, for advanced use. */
    get audioContext() {
        return this._ctx;
    }
}
