/**
 * Controls the rendering of the audio waveform on a canvas element.
 * Handles resizing, toggling display, animation, and smoothing of waveform data.
 */
export default class WaveformController {
    // INSTANCE PROPERTIES
    showWaveform = false;
    smoothing = 0.6;
    waveformData = null;
    animationRafId = null;

    /**
     * @param {Object} params - Parameters object containing required components
     * @param {HTMLCanvasElement} params.canvasElement - The canvas element to draw the waveform on.
     * @param {import('./FrequencyAnalyser.js').default} params.frequencyAnalyser - FrequencyAnalyser instance providing waveform data.
     * @param {string} [params.waveColor] - The color of the waveform.
     */
    constructor({ canvasElement, frequencyAnalyser, waveColor = 'white' }) {
        this.canvas = canvasElement;
        this.ctx = canvasElement?.getContext('2d');
        this.waveColor = waveColor;

        this.frequencyAnalyser = frequencyAnalyser;

        this.resizeCanvas();
    }

    /**
     * Destroy the controller and stop animation.
     */
    destroy() {
        if (this.animationRafId) {
            cancelAnimationFrame(this.animationRafId);
            this.animationRafId = null;
        }

        const w = this.canvas.width / (globalThis.devicePixelRatio || 1);
        const h = this.canvas.height / (globalThis.devicePixelRatio || 1);
        this.ctx.clearRect(0, 0, w, h);
    }

    /**
     * Draw the current waveform data to the canvas.
     */
    draw() {
        if (!this.showWaveform) {
            return;
        }

        if (!this.ctx || !this.frequencyAnalyser) {
            // Re-schedule even if not ready, otherwise it stops permanently
            this.animationRafId = requestAnimationFrame(() => this.draw());
            return;
        }

        const w = this.canvas.width / (globalThis.devicePixelRatio || 1);
        const h = this.canvas.height / (globalThis.devicePixelRatio || 1);

        const newData = this.frequencyAnalyser.getWaveform();

        // Initialize waveformData on the first frame, then apply smoothing on subsequent frames
        if (!this.waveformData) {
            this.waveformData = newData;
        }
        this.waveformData = this.waveformData.map(
            (prev, i) => prev * this.smoothing + newData[i] * (1 - this.smoothing),
        );

        this.ctx.clearRect(0, 0, w, h);
        this.ctx.beginPath();

        this.ctx.strokeStyle = this.waveColor;
        this.ctx.lineWidth = 2;
        this.ctx.shadowColor = this.waveColor;
        this.ctx.shadowBlur = 10;

        const sliceWidth = w / this.waveformData.length;
        let x = 0;

        for (const value of this.waveformData) {
            const y = value * h;

            if (x === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        this.ctx.stroke();

        this.animationRafId = requestAnimationFrame(() => this.draw());
    }

    /**
     * Get the current waveform data from the frequency analyser.
     * @returns {number[]|undefined} The waveform data array, or undefined if not available.
     */
    getWaveformData() {
        return this.frequencyAnalyser?.getWaveform();
    }

    /**     * Resize the canvas to fit the window while maintaining high resolution, dependent on device pixel ratio.
     */
    resizeCanvas() {
        if (!this.canvas) {
            return;
        }

        const dpr = globalThis.devicePixelRatio || 1;
        const w = globalThis.innerWidth - 80;
        const h = Math.min(400, globalThis.innerHeight);
        // Keep both the drawing buffer (high-DPI) and CSS layout size.
        // canvas.width/height set the internal pixel buffer (multiplied by devicePixelRatio)
        // canvas.style.width/height set the element's layout size in CSS pixels.
        this.canvas.width = w * dpr;
        this.canvas.height = h * dpr;
        this.canvas.style.width = `${w}px`;
        this.canvas.style.height = `${h}px`;

        if (this.ctx) {
            this.ctx.resetTransform();
            this.ctx.scale(dpr, dpr);
        }
    }

    /**
     * Start the waveform animation loop.
     */
    start() {
        // Prevent multiple animation loops if already running
        if (this.animationRafId) {
            return;
        }

        // Reset waveform data to avoid showing stale data when starting
        this.waveformData = null;

        this.draw();
    }

    /**
     * Toggle the waveform display on or off.
     */
    toggleWaveform() {
        this.showWaveform = !this.showWaveform;
        if (this.showWaveform) {
            this.resizeCanvas();
            this.start();
        } else {
            this.destroy();
        }
    }
}
