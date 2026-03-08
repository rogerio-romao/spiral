import AL from '../AlgorithmLoader.js';

export default class Clock extends AL {
    constructor() {
        super();

        this.name = 'Clock';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.modes = [
            'xor',
            'difference',
            'hard-light',
            'exclusion',
            'multiply',
            'color-burn',
            'color-dodge',
            'lighten',
            'darken',
            'overlay',
            'source-over',
        ];

        this.letters = [
            701, 702, 703, 706, 707, 708, 710, 711, 712, 713, 714, 715, 716, 717, 718, 719, 720,
            721, 722, 724, 726, 727, 729, 730, 731, 732, 733, 734, 735, 737, 740, 741, 744, 745,
            746, 747, 749, 753, 754, 756, 757, 758, 759, 760, 761, 762, 764, 766, 769, 771, 772,
            776, 778, 781, 782, 784, 790, 794, 795, 796,
        ];
        this.letter = String.fromCodePoint(AL.pickRandomElement(this.letters));

        this.color = AL.randomColor(0, 255, 0.66, 0.66);
        this.rotate = (18 * Math.PI) / 180;
    }

    setupDrawingStyles() {
        AL.ctx.shadowColor = AL.ctx.strokeStyle = this.color;
        AL.ctx.font = `${AL.random(60, 600)}px sans-serif`;
        AL.ctx.globalCompositeOperation = 'source-over';
        AL.ctx.textAlign = 'center';
        AL.ctx.shadowBlur = 8;
        AL.ctx.lineWidth = 3;
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.translate(AL.w / 2, AL.h / 2);
            AL.ctx.strokeText(`  ${this.letter}`, 0, 0);
            AL.ctx.rotate(this.rotate);
            AL.ctx.translate(-AL.w / 2, -AL.h / 2);
            AL.ctx.beginPath();
        }

        this.t += 1;

        if (this.t % (this.speed * 40) === 0) {
            AL.ctx.font = `${AL.random(60, 600)}px sans-serif`;

            const col = Math.random();
            if (col < 0.15) {
                AL.ctx.lineWidth = 2;
                AL.ctx.shadowBlur = 12;
                this.color = 'rgba(255, 255, 255, 0.5)';
            } else if (col < 0.3) {
                AL.ctx.lineWidth = 5;
                this.color = 'rgba(0, 0, 0, 0.5)';
            } else {
                AL.ctx.shadowBlur = 8;
                AL.ctx.lineWidth = 3;
                this.color = AL.randomColor(0, 255, 0.66, 0.66);
            }

            AL.ctx.shadowColor = AL.ctx.strokeStyle = this.color;
        }

        if (this.t % (this.speed * 120) === 0) {
            AL.ctx.globalCompositeOperation = AL.pickRandomElement(this.modes);
        }

        if (this.t % (this.speed * 200) === 0) {
            this.letter = String.fromCodePoint(AL.pickRandomElement(this.letters));
        }

        this.requestFrame();
    }
}
