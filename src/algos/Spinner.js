import AL from '../AlgorithmLoader.js';

export default class Spinner extends AL {
    constructor() {
        super();

        this.name = 'Spinner';

        this.initializeProperties();

        this.requestFrame();
    }

    initializeProperties() {
        this.gap1 = AL.random(15, 150);
        this.gap2 = AL.random(-150, -15);
        this.side = Math.min(AL.w, AL.h);
        this.color1 = AL.randomColor(0, 255, 1, 1);
        this.color2 = AL.randomColor(0, 255, 1, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.translate(AL.w / 2, AL.h / 2);
            AL.ctx.rotate((this.gap1 * Math.PI) / 180);
            AL.ctx.lineWidth = 2;
            AL.ctx.globalCompositeOperation = 'hard-light';
            AL.ctx.globalAlpha = 0.08;
            AL.ctx.shadowColor = AL.ctx.fillStyle = this.color1;
            AL.ctx.shadowBlur = 8;
            AL.ctx.fillRect(
                AL.w / 2 - this.side / 2,
                AL.h / 2 - this.side / 2,
                this.side,
                this.side,
            );

            AL.ctx.translate(-AL.w / 2, -AL.h / 2);
            AL.ctx.lineWidth = 3;
            AL.ctx.globalAlpha = 0.2;
            AL.ctx.shadowBlur = 0;
            AL.ctx.globalCompositeOperation = 'difference';
            AL.ctx.fillStyle = this.color2;
            AL.ctx.fillRect(AL.w / 2, AL.h / 2, this.gap1 * 2, this.gap2 * 2);
        }

        this.t += 1;

        if (this.t % (this.speed * 50) === 0) {
            this.gap1 = AL.random(15, 150);
            this.gap2 = AL.random(-150, -15);
            this.color2 = AL.randomColor(0, 255, 1, 1);
            this.side = AL.random(200, Math.max(AL.w, AL.h) / 2);
        }

        if (this.t % (this.speed * 100) === 0) {
            AL.ctx.beginPath();
            this.color1 = AL.randomColor(0, 255, 1, 1);
        }

        this.requestFrame();
    }
}
