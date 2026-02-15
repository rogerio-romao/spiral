import AL from '../AlgorithmLoader.js';

export default class AccelerationMandala extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Acceleration Mandala';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.letters = [
            1002, 1006, 1031, 1033, 1039, 1046, 1054, 1064, 1078, 1092, 1912,
            1916, 1920, 1921, 1935, 1944, 1959, 1963, 1964, 1968, 1988, 1991,
            1993, 1997, 12398,
        ];
        this.letter = String.fromCharCode(AL.pickRandomElement(this.letters));

        this.rotate = 1;
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(12, 255, 0.33, 0.33);
        this.ctx.font = `bold ${AL.random(125, 550)}px sans-serif`;
        this.ctx.textAlign = 'center';
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.strokeText(this.letter, this.w / 2, this.h / 2);

            this.rotateCanvasDegrees(this.rotate + 1);
        }

        this.t++;

        if (this.t % (this.speed * 45) === 0) {
            this.rotate++;
        }

        if (this.t % (this.speed * 90) === 0) {
            this.ctx.strokeStyle = AL.randomColor(12, 255, 0.33, 0.33);
        }

        if (this.t % (this.speed * 135) === 0) {
            this.ctx.font = `bold ${AL.random(125, 550)}px sans-serif`;
        }

        if (this.t % (this.speed * 360) === 0) {
            this.letter = String.fromCharCode(
                AL.pickRandomElement(this.letters)
            );
        }

        this.requestFrame();
    }
}
