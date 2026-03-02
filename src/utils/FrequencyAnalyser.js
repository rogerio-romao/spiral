/**
 * FrequencyAnalyser — wraps the Web Audio API to provide real-time
 * frequency band data from an HTMLAudioElement.
 *
 * Audio graph: MediaElementSource → AnalyserNode → AudioContext.destination
 * (audio still plays through speakers).
 *
 * Usage:
 *   const analyser = new FrequencyAnalyser(audioElement, { bandCount: 5 });
 *   analyser.resume();          // call on user gesture
 *   const bands = analyser.getBands(); // [0.72, 0.35, 0.11, ...] (0–1 normalised)
 */
export default class FrequencyAnalyser {
    /**
     * @param {HTMLAudioElement} audioElement — the <audio> element to analyse.
     * @param {object}  [options] — configuration options for the analyser.
     * @param {number}  [options.bandCount]  — number of frequency bands.
     * @param {number}  [options.fftSize] — FFT window size (power of 2).
     * @param {number}  [options.smoothing] — smoothingTimeConstant (0–1).
     */
    constructor(audioElement, { bandCount = 5, fftSize = 2048, smoothing = 0.8 } = {}) {
        this._bandCount = bandCount;

        // Create the audio context and graph
        this._ctx = new (globalThis.AudioContext || globalThis.webkitAudioContext)();
        this._analyser = this._ctx.createAnalyser();
        this._analyser.fftSize = fftSize;
        this._analyser.smoothingTimeConstant = smoothing;

        // createMediaElementSource can only be called once per element
        this._source = this._ctx.createMediaElementSource(audioElement);
        this._source.connect(this._analyser);
        this._analyser.connect(this._ctx.destination);

        // Reusable buffer for frequency data
        this._dataArray = new Uint8Array(this._analyser.frequencyBinCount);

        // Reusable buffer for time-domain (waveform) data
        this._timeDomainData = new Uint8Array(this._analyser.fftSize);
    }

    /**
     * Number of bands currently configured.
     * @returns {number} The current band count.
     */
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
     * Get the current frequency data split into `bandCount` logarithmic bands,
     * with more resolution in lower frequencies and broader ranges up high,
     * each normalised to 0–1.
     *
     * @returns {number[]} Array of length `bandCount` with values 0–1.
     *   Returns all zeros when nothing is playing.
     */
    getBands() {
        this._analyser.getByteFrequencyData(this._dataArray);

        const binCount = this._dataArray.length;
        const bands = Array.from({ length: this._bandCount }, () => 0);

        if (this._bandCount <= 0 || binCount <= 0) {
            return bands;
        }

        const activeBandCount = Math.min(this._bandCount, binCount);
        const logMax = Math.log(binCount + 1);

        for (let b = 0; b < activeBandCount; b++) {
            let start = Math.floor(Math.exp((b / activeBandCount) * logMax)) - 1;
            let end = Math.floor(Math.exp(((b + 1) / activeBandCount) * logMax)) - 1;

            start = Math.max(0, Math.min(start, binCount - 1));
            end = Math.max(start + 1, Math.min(end, binCount));

            let sum = 0;
            for (let i = start; i < end; i++) {
                sum += this._dataArray[i];
            }

            const binSpan = end - start;
            bands[b] = binSpan > 0 ? sum / (binSpan * 255) : 0;
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

    /**
     * Get the current time-domain data (waveform) as normalized values.
     * Each value is 0–1, where 0.5 represents the center line (silence).
     *
     * @returns {number[]} Array of normalized 0–1 values representing the waveform.
     *   Returns all 0.5s when nothing is playing.
     */
    getWaveform() {
        this._analyser.getByteTimeDomainData(this._timeDomainData);
        return [...this._timeDomainData].map((value) => value / 255);
    }

    /**
     * The underlying AnalyserNode, for advanced configuration.
     * @returns {AnalyserNode} The AnalyserNode instance.
     */
    get analyserNode() {
        return this._analyser;
    }

    /**
     * The underlying AudioContext, for advanced use.
     * @returns {AudioContext} The AudioContext instance.
     */
    get audioContext() {
        return this._ctx;
    }
}
