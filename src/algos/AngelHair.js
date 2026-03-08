import AL from '../AlgorithmLoader.js';

export default class AngelHair extends AL {
    constructor() {
        super();

        this.name = 'Angel Hair';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.speed = 3;
    }

    initializeProperties() {
        this.x1 = AL.random(0, AL.w);
        this.y1 = AL.random(0, AL.h);
        this.x2 = AL.random(0, AL.w);
        this.y2 = AL.random(0, AL.h);
        this.rotate = AL.random(2, 359);
        this.radius1 = AL.random(20, 300);
        this.radius2 = AL.random(20, 300);
    }

    setupDrawingStyles() {
        AL.ctx.lineWidth = 0.3;
        AL.ctx.setLineDash([1, 4]);
        AL.ctx.globalCompositeOperation = 'hard-light';
        AL.ctx.strokeStyle = AL.randomColor(120, 255, 0.66, 0.95);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger %= 4;

            if (this.stagger === 0) {
                AL.ctx.moveTo(this.y2, this.x1);
            }

            if (this.stagger === 1) {
                AL.ctx.arcTo(AL.w / 2, AL.h, this.x1, this.y1, this.radius1);
                AL.ctx.stroke();
            }

            if (this.stagger === 2) {
                AL.ctx.arcTo(AL.w, AL.h / 2, this.x2, this.y2, this.radius2);
                AL.ctx.stroke();
            }

            if (this.stagger === 3) {
                this.rotateCanvasRadians(this.rotate);
            }
        }

        this.t += 1;

        this.stagger += 1;

        if (this.t % (this.speed * 360) === 0) {
            this.initializeProperties();

            AL.ctx.strokeStyle =
                Math.random() < 0.075 ? 'white' : AL.randomColor(120, 255, 0.66, 0.95);

            AL.ctx.beginPath();
        }

        this.requestFrame();
    }
}
