import AL from '../AlgorithmLoader.js';

export default class CounterClock extends AL {
    constructor() {
        super();

        this.name = 'Counter Clock';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.letters = [
            607, 611, 615, 616, 617, 618, 619, 622, 625, 629, 632, 639, 643, 650, 656, 662, 664,
            676, 683, 684, 685, 688, 690, 691, 694, 697, 698, 699,
        ];
        this.letter = String.fromCodePoint(AL.pickRandomElement(this.letters));
        this.color = AL.randomColor(0, 255, 1, 1);
        this.rotate = (8 * Math.PI) / 180;
    }

    setupDrawingStyles() {
        AL.ctx.shadowColor = AL.ctx.strokeStyle = this.color;
        AL.ctx.font = `${AL.random(75, 750)}px sans-serif`;
        AL.ctx.textAlign = 'center';
        AL.ctx.shadowBlur = 3;
        AL.ctx.lineWidth = 2;
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.translate(AL.w / 2, AL.h / 2);
            AL.ctx.strokeText(`   ${this.letter}`, 0, 0);
            AL.ctx.rotate(-this.rotate);
            AL.ctx.translate(-AL.w / 2, -AL.h / 2);
            AL.ctx.beginPath();
        }

        this.t += 1;

        if (this.t % (this.speed * 45) === 0) {
            const col = Math.random();
            if (col < 0.125) {
                AL.ctx.lineWidth = 1;
                AL.ctx.shadowBlur = 5;
                this.color = 'white';
            } else if (col < 0.25) {
                AL.ctx.lineWidth = 3;
                this.color = 'black';
            } else {
                AL.ctx.shadowBlur = 3;
                AL.ctx.lineWidth = 2;
                this.color = AL.randomColor();
            }

            AL.ctx.font = `${AL.random(75, 750)}px sans-serif`;
            AL.ctx.shadowColor = AL.ctx.strokeStyle = this.color;
        }

        if (this.t % (this.speed * 450) === 0) {
            this.letter = String.fromCodePoint(AL.pickRandomElement(this.letters));
        }

        this.requestFrame();
    }
}
