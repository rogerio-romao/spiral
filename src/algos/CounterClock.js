import AL from '../AlgorithmLoader.js';

export default class CounterClock extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Counter Clock';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.letters = [
            607, 611, 615, 616, 617, 618, 619, 622, 625, 629, 632, 639, 643,
            650, 656, 662, 664, 676, 683, 684, 685, 688, 690, 691, 694, 697,
            698, 699,
        ];
        this.letter = String.fromCodePoint(AL.pickRandomElement(this.letters));
        this.color = AL.randomColor(0, 255, 1, 1);
        this.rotate = (8 * Math.PI) / 180;
    }

    setupDrawingStyles() {
        this.ctx.shadowColor = this.ctx.strokeStyle = this.color;
        this.ctx.font = AL.random(75, 750) + 'px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.shadowBlur = 3;
        this.ctx.lineWidth = 2;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.strokeText('   ' + this.letter, 0, 0);
            this.ctx.rotate(-this.rotate);
            this.ctx.translate(-this.w / 2, -this.h / 2);
            this.ctx.beginPath();
        }

        this.t++;

        if (this.t % (this.speed * 45) === 0) {
            const col = Math.random();
            if (col < 0.125) {
                this.ctx.lineWidth = 1;
                this.ctx.shadowBlur = 5;
                this.color = 'white';
            } else if (col < 0.25) {
                this.ctx.lineWidth = 3;
                this.color = 'black';
            } else {
                this.ctx.shadowBlur = 3;
                this.ctx.lineWidth = 2;
                this.color = AL.randomColor();
            }

            this.ctx.font = AL.random(75, 750) + 'px sans-serif';
            this.ctx.shadowColor = this.ctx.strokeStyle = this.color;
        }

        if (this.t % (this.speed * 450) === 0) {
            this.letter = String.fromCodePoint(
                AL.pickRandomElement(this.letters),
            );
        }

        this.requestFrame();
    }
}
