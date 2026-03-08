import AL from '../AlgorithmLoader.js';

export default class TemplateFrequency extends AL {
    constructor() {
        super();

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
            AL.ctx.save();

            const bands = AL.frequencyAnalyser
                ? AL.frequencyAnalyser.getBands()
                : Array.from({ length: this.numberOfBands }, () => 0);
            const bandWidth = AL.w / this.numberOfBands;
            const centerY = AL.h / 2;

            const noMovement = bands.every((band) => band === 0);

            if (noMovement) {
                this.rotateCanvasRadians(this.rotate * this.t * 0.0005);
                AL.ctx.fillStyle = `rgba(0, 0, 0, 0.1)`;
                this.fillScreen();
            } else {
                AL.ctx.clearRect(0, 0, AL.w, AL.h);
            }

            for (let i = 0; i < this.numberOfBands; i++) {
                const bandValue = noMovement ? Math.random() : bands[i];
                const rectHeight = bandValue * AL.h;
                const x = i * bandWidth;
                const y = centerY - rectHeight / 2;
                const hue = Math.round(bandValue * 360);

                AL.ctx.fillStyle = `hsl(${hue} 100% 50% / ${this.alpha})`;
                AL.ctx.fillRect(x, y, bandWidth, rectHeight);
            }

            this.drawWaveform();

            AL.ctx.restore();

            if (this.t % (this.speed * 120) === 0) {
                this.initializeProperties();
            }
        }

        this.t += 1;
        this.requestFrame();
    }

    drawWaveform() {
        const waveformData = AL.waveformController?.getWaveformData();
        if (!waveformData) {
            return;
        }

        const height = Math.min(400, AL.h);
        const yOffset = AL.h - height - 20;

        AL.ctx.beginPath();
        AL.ctx.strokeStyle = 'white';
        AL.ctx.shadowColor = 'white';
        AL.ctx.lineWidth = 2;
        AL.ctx.shadowBlur = 10;

        const sliceWidth = AL.w / waveformData.length;
        let x = 0;

        for (const value of waveformData) {
            const y = yOffset + value * height;

            if (x === 0) {
                AL.ctx.moveTo(x, y);
            } else {
                AL.ctx.lineTo(x, y);
            }

            x += sliceWidth;
        }

        AL.ctx.stroke();
    }
}
