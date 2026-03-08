import AL from '../AlgorithmLoader.js';

export default class NeonTartans extends AL {
    constructor() {
        super();

        this.name = 'Neon Tartans';

        this.initializeProperties();

        this.requestFrame();
    }

    initializeProperties() {
        this.color1 = AL.randomColor();
        this.color2 = AL.randomColor();
        this.lineX = AL.random(0, AL.h);
        this.lineY = AL.random(0, AL.w);
        this.length = AL.random(50, Math.min(AL.w, AL.h) / 1.5);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger %= 3;

            if (this.stagger === 0) {
                AL.ctx.beginPath();
                AL.ctx.moveTo(0, this.lineX);
                AL.ctx.lineTo(AL.w, this.lineX);
                AL.ctx.shadowBlur = 5;
                AL.ctx.shadowColor = AL.ctx.strokeStyle = this.color1;
                AL.ctx.stroke();
            }

            if (this.stagger === 1) {
                AL.ctx.beginPath();
                AL.ctx.moveTo(this.lineY, 0);
                AL.ctx.lineTo(this.lineY, AL.h);
                AL.ctx.shadowBlur = 0;
                AL.ctx.shadowColor = AL.ctx.strokeStyle = this.color2;
                AL.ctx.stroke();
            }

            if (this.stagger === 2) {
                AL.ctx.shadowBlur = 30;
                AL.ctx.beginPath();
                AL.ctx.lineWidth = 2;
                AL.ctx.arc(AL.w / 2, AL.h / 2, this.length, AL.w, AL.h);
                AL.ctx.stroke();
                AL.ctx.lineWidth = 1;
            }

            this.stagger += 1;
        }

        this.t += 1;

        if (this.t % (this.speed * 15) === 0) {
            this.rotateCanvasDegrees(30);
            this.length = AL.random(30, AL.h / 2);
        }

        if (this.t % (this.speed * 180) === 0) {
            this.color1 = AL.randomColor(0, 255, 1, 1);
            this.color2 = AL.randomColor(0, 255, 1, 1);
        }

        this.lineX = AL.random(0, AL.h);
        this.lineY = AL.random(0, AL.w);

        this.requestFrame();
    }
}
