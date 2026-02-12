import AL from '../AlgorithmLoader.js';

export default class TemplateFrequency extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'TemplateFrequency';
        this.numberOfBands = 5;

        AL.frequencyAnalyser.bands = this.numberOfBands;

        this.interval = requestAnimationFrame(this.draw);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.save();

            this.ctx.clearRect(0, 0, this.w, this.h);

            const bands = AL.frequencyAnalyser
                ? AL.frequencyAnalyser.getBands()
                : Array.from({ length: this.numberOfBands }, () => 0);
            const bandWidth = this.w / this.numberOfBands;
            const centerY = this.h / 2;

            const noMovement = bands.every((b) => b === 0);

            for (let i = 0; i < this.numberOfBands; i++) {
                const bandValue = noMovement ? Math.random() : bands[i];
                const rectHeight = bandValue * this.h;
                const x = i * bandWidth;
                const y = centerY - rectHeight / 2;
                const hue = Math.round(bandValue * 360);

                this.ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
                this.ctx.fillRect(x, y, bandWidth, rectHeight);
            }

            this.ctx.restore();
        }

        this.t++;
        requestAnimationFrame(this.draw);
    }
}
