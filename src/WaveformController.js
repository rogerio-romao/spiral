export default class WaveformController {
    constructor({ canvasElement, frequencyAnalyser }) {
        this.canvas = canvasElement;
        this.ctx = canvasElement?.getContext('2d');
        this.frequencyAnalyser = frequencyAnalyser;

        this.show = false;
        this.smoothing = 0.6;
        this._waveformData = null;
        this._animationId = null;

        if (canvasElement) {
            this._resizeCanvas();
        }
    }

    _resizeCanvas() {
        if (!this.canvas) {
            return;
        }

        const dpr = globalThis.devicePixelRatio || 1;
        const w = globalThis.innerWidth - 80;
        const h = Math.min(400, globalThis.innerHeight);
        this.canvas.width = w * dpr;
        this.canvas.height = h * dpr;
        this.canvas.style.width = `${w}px`;
        this.canvas.style.height = `${h}px`;
        if (this.ctx) {
            this.ctx.resetTransform();
            this.ctx.scale(dpr, dpr);
        }
    }

    resize() {
        this._resizeCanvas();
    }

    toggle() {
        this.show = !this.show;
        if (this.show) {
            this._resizeCanvas();
            this._start();
        } else {
            this._stop();
        }
        return this.show;
    }

    _start() {
        if (this._animationId) {
            return;
        }
        this._waveformData = null;
        const draw = () => {
            if (!this.show) {
                return;
            }
            this._draw();
            this._animationId = requestAnimationFrame(draw);
        };
        draw();
    }

    _stop() {
        if (this._animationId) {
            cancelAnimationFrame(this._animationId);
            this._animationId = null;
        }
        if (this.ctx && this.canvas) {
            const w = this.canvas.width / (globalThis.devicePixelRatio || 1);
            const h = this.canvas.height / (globalThis.devicePixelRatio || 1);
            this.ctx.clearRect(0, 0, w, h);
        }
    }

    _draw() {
        if (!this.ctx || !this.frequencyAnalyser) {
            return;
        }

        const { ctx } = this;
        const w = this.canvas.width / (globalThis.devicePixelRatio || 1);
        const h = this.canvas.height / (globalThis.devicePixelRatio || 1);

        const newData = this.frequencyAnalyser.getWaveform();

        if (!this._waveformData) {
            this._waveformData = newData;
        }

        this._waveformData = this._waveformData.map(
            (prev, i) => prev * this.smoothing + newData[i] * (1 - this.smoothing),
        );

        ctx.clearRect(0, 0, w, h);

        ctx.beginPath();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 10;

        const sliceWidth = w / this._waveformData.length;
        let x = 0;

        for (const value of this._waveformData) {
            const y = value * h;

            if (x === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        ctx.stroke();
    }

    destroy() {
        this._stop();
    }

    getWaveformData() {
        return this.frequencyAnalyser?.getWaveform();
    }
}
