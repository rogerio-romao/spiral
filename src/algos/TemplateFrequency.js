import AL from '../AlgorithmLoader.js';

export default class TemplateFrequency extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'TemplateFrequency';

        this.initializeProperties();

        this.requestFrame();
    }

    initializeProperties() {
        this.alpha = Math.random();
        this.rotate = AL.random(0, 360);
        this.numberOfBands = AL.random(3, 9);
        AL.frequencyAnalyser.bandCount = this.numberOfBands;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.save();

            const bands = AL.frequencyAnalyser
                ? AL.frequencyAnalyser.getBands()
                : Array.from({ length: this.numberOfBands }, () => 0);
            const bandWidth = this.w / this.numberOfBands;
            const centerY = this.h / 2;

            const noMovement = bands.every((band) => band === 0);

            if (noMovement) {
                this.rotateCanvasRadians(this.rotate * this.t * 0.0005);
                this.ctx.fillStyle = `rgba(0, 0, 0, 0.1)`;
                this.fillScreen();
            } else {
                this.ctx.clearRect(0, 0, this.w, this.h);
            }

            for (let i = 0; i < this.numberOfBands; i++) {
                const bandValue = noMovement ? Math.random() : bands[i];
                const rectHeight = bandValue * this.h;
                const x = i * bandWidth;
                const y = centerY - rectHeight / 2;
                const hue = Math.round(bandValue * 360);

                this.ctx.fillStyle = `hsl(${hue} 100% 50% / ${this.alpha})`;
                this.ctx.fillRect(x, y, bandWidth, rectHeight);
            }

            this.drawWaveform();

            this.ctx.restore();

            if (this.t % (this.speed * 120) === 0) {
                this.initializeProperties();
            }
        }

        this.t++;
        this.requestFrame();
    }

    drawWaveform() {
        const waveformData = AL.waveformController?.getWaveformData();
        if (!waveformData) {
            return;
        }

        const height = Math.min(400, this.h);
        const yOffset = this.h - height - 20;

        this.ctx.beginPath();
        this.ctx.strokeStyle = 'white';
        this.ctx.shadowColor = 'white';
        this.ctx.lineWidth = 2;
        this.ctx.shadowBlur = 10;

        const sliceWidth = this.w / waveformData.length;
        let x = 0;

        for (const value of waveformData) {
            const y = yOffset + value * height;

            if (x === 0) {
                this.ctx.moveTo(x, y);
            } else {
                this.ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        this.ctx.stroke();
    }
}
