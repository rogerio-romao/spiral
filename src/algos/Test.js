import AL from '../AlgorithmLoader.js';

export default class Test extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Test';

        // Base properties — set once, frequency data modulates them each frame
        this.baseX = this.w / 2;
        this.baseY = this.h / 2;
        this.baseWidth = 100;
        this.baseHeight = 100;
        this.hue = AL.random(0, 360);

        this.interval = requestAnimationFrame(this.draw);
    }

    draw() {
        // Get frequency data every frame
        const bands = AL.frequencyAnalyser
            ? AL.frequencyAnalyser.getBands()
            : [100, 100, 100, 100, 100];

        const [low, midLow, mid, midHigh, high] = bands;

        if (this.t % this.speed === 0) {
            this.ctx.save();

            // Low frequencies drive size (scale 1x–4x)
            const widthScale = 1 + low * 6;
            const heightScale = 1 + midLow * 4;
            const w = this.baseWidth * widthScale;
            const h = this.baseHeight * heightScale;

            // Mid frequencies drive position offset (oscillate around centre)
            const offsetX = Math.sin(this.t * 0.2) * mid * 200;
            const offsetY = Math.cos(this.t * 0.2) * mid * 200;
            const x = this.baseX + offsetX - w / 2;
            const y = this.baseY + offsetY - h / 2;

            // High frequencies drive colour saturation and opacity
            this.hue = low * 360; // Hue shifts with low frequencies
            const saturation = 50 + high * 50;
            const lightness = 40 + midHigh * 30;

            this.ctx.fillStyle = `hsla(${this.hue}, ${saturation}%, ${lightness}%, 1)`;

            // Rotation driven by mid-high energy
            this.ctx.translate(x + w / 2, y + h / 2);
            this.ctx.rotate(high * Math.PI * 2);
            this.ctx.fillRect(-w / 2, -h / 2, w, h);

            this.ctx.restore();
        }

        this.t++;
        requestAnimationFrame(this.draw);
    }
}
