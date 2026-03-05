/**
 * FrequencyAnalyser — wraps the Web Audio API to provide real-time
 * frequency band data from an HTMLAudioElement.
 *
 * Audio graph: MediaElementSource → AnalyserNode → GainNode → AudioContext.destination
 * (audio still plays through speakers; the GainNode is used for sample-accurate fade in/out).
 *
 * @example
 * ```js
 *   const analyser = new FrequencyAnalyser(audioElement, { bandCount: 5 });
 *   analyser.resume();          // call on user gesture
 *   const bands = analyser.getBands(); // [0.72, 0.35, 0.11, ...] (0–1 normalised)
 *  ```
 */
export default class FrequencyAnalyser {
    /**
     * @param {HTMLAudioElement} audioElement — the <audio> element to analyse.
     * @param {object}  [options] - optional configuration options for the analyser.
     * @param {number}  [options.bandCount]  - number of frequency bands.
     * @param {number}  [options.fftSize] - FFT window size (power of 2).
     * @param {number}  [options.smoothing] - smoothingTimeConstant (0–1).
     */

    constructor(audioElement, { bandCount = 5, fftSize = 2048, smoothing = 0.8 } = {}) {
        // private so we can validate in the setter and prevent invalid states (e.g. negative band count, floating point values)
        this._bandCount = bandCount;

        // Create the audio context and graph
        this.ctx = new (globalThis.AudioContext || globalThis.webkitAudioContext)();
        this.analyser = this.ctx.createAnalyser();
        this.analyser.fftSize = fftSize;
        this.analyser.smoothingTimeConstant = smoothing;

        this.gain = this.ctx.createGain();
        this.gain.gain.value = 1;

        // createMediaElementSource can only be called once per element, so we do it here in the constructor and store the source node for potential future use (e.g. disconnecting/reconnecting)
        this.source = this.ctx.createMediaElementSource(audioElement);

        // Connect the audio graph: source → analyser → gain → destination
        this.source.connect(this.analyser);
        this.analyser.connect(this.gain);
        this.gain.connect(this.ctx.destination);

        // Reusable buffer for frequency data
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);

        // Reusable buffer for time-domain (waveform) data
        this.timeDomainData = new Uint8Array(this.analyser.fftSize);
    }

    // GETTERS & SETTERS

    /**
     * The underlying AudioContext, for advanced use.
     * @returns {AudioContext} The AudioContext instance.
     */
    get audioContext() {
        return this.ctx;
    }

    /**
     * The underlying AnalyserNode, for advanced configuration.
     * @returns {AnalyserNode} The AnalyserNode instance.
     */
    get analyserNode() {
        return this.analyser;
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
     * The underlying GainNode, for advanced use.
     * @returns {GainNode} The GainNode instance.
     */
    get gainNode() {
        return this.gain;
    }

    // METHODS

    /**
     * Smoothly ramp the output gain to `targetGain` over `durationMs` milliseconds.
     * Schedules a sample-accurate linear ramp on the `GainNode` — eliminates the
     * quantisation clicks that occur when mutating `HTMLAudioElement.volume` per frame.
     *
     * @param {number} targetGain - Target gain value (0 = silent, 1 = full volume).
     * @param {number} durationMs - Duration of the ramp in milliseconds.
     * @returns {Promise<void>} Resolves after the ramp duration has elapsed.
     */
    fadeTo(targetGain, durationMs) {
        const { gain } = this.gain;
        const { currentTime } = this.ctx;
        gain.cancelScheduledValues(currentTime);
        gain.setValueAtTime(gain.value, currentTime);
        gain.linearRampToValueAtTime(targetGain, currentTime + durationMs / 1000);
        // oxlint-disable-next-line promise/avoid-new
        return new Promise((resolve) => {
            setTimeout(resolve, durationMs);
        });
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
        // Get the raw frequency data into our reusable buffer
        this.analyser.getByteFrequencyData(this.dataArray);

        const binCount = this.dataArray.length;
        const bands = Array.from({ length: this._bandCount }, () => 0);

        if (this._bandCount <= 0 || binCount <= 0) {
            return bands;
        }

        // Calculate logarithmic band boundaries and average the bins within each band
        const activeBandCount = Math.min(this._bandCount, binCount);
        const logMax = Math.log(binCount + 1);

        for (let b = 0; b < activeBandCount; b++) {
            let start = Math.floor(Math.exp((b / activeBandCount) * logMax)) - 1;
            let end = Math.floor(Math.exp(((b + 1) / activeBandCount) * logMax)) - 1;

            start = Math.max(0, Math.min(start, binCount - 1));
            end = Math.max(start + 1, Math.min(end, binCount));

            let sum = 0;
            for (let i = start; i < end; i++) {
                sum += this.dataArray[i];
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
        this.analyser.getByteFrequencyData(this.dataArray);
        return this.dataArray;
    }

    /**
     * Get the current time-domain data (waveform) as normalized values.
     * Each value is 0–1, where 0.5 represents the center line (silence).
     *
     * @returns {number[]} Array of normalized 0–1 values representing the waveform.
     *   Returns all 0.5s when nothing is playing.
     */
    getWaveform() {
        this.analyser.getByteTimeDomainData(this.timeDomainData);
        return [...this.timeDomainData].map((value) => value / 255);
    }

    /**
     * Resume the `AudioContext` — must be called from a user gesture
     * (e.g. click/keypress) to satisfy browser autoplay policy.
     * Subsequent calls are no-ops.
     */
    resume() {
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    /**
     * Immediately set the output gain to `value` with no ramp.
     * Cancels any scheduled ramp first to avoid conflicts.
     *
     * @param {number} value - Gain value to apply instantly (0–1).
     */
    setGain(value) {
        const { gain } = this.gain;
        const { currentTime } = this.ctx;
        gain.cancelScheduledValues(currentTime);
        gain.setValueAtTime(value, currentTime);
    }
}
