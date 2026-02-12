import AL from '../AlgorithmLoader.js';

export default class TemplateFrequency extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'TemplateFrequency';

        this.initializeProperties();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
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

            const noMovement = bands.every((b) => b === 0);

            if (noMovement) {
                this.rotateCanvasRadians(this.rotate * this.t * 0.0005);
            } else {
                this.ctx.clearRect(0, 0, this.w, this.h);
            }

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

            if (this.t % (this.speed * 240) === 0) {
                this.initializeProperties();
            }
        }

        this.t++;
        requestAnimationFrame(this.draw);
    }
}
