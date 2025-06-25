import AL from '../AlgorithmLoader.js';

export default class Clock extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
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
            701, 702, 703, 706, 707, 708, 710, 711, 712, 713, 714, 715, 716,
            717, 718, 719, 720, 721, 722, 724, 726, 727, 729, 730, 731, 732,
            733, 734, 735, 737, 740, 741, 744, 745, 746, 747, 749, 753, 754,
            756, 757, 758, 759, 760, 761, 762, 764, 766, 769, 771, 772, 776,
            778, 781, 782, 784, 790, 794, 795, 796,
        ];
        this.letter = String.fromCharCode(AL.pickRandomElement(this.letters));

        this.color = AL.randomColor(0, 255, 0.66, 0.66);
        this.rotate = (18 * Math.PI) / 180;
    }

    setupDrawingStyles() {
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.font = AL.random(60, 600) + 'px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.lineWidth = 3;
        this.ctx.shadowColor = this.ctx.strokeStyle = this.color;
        this.ctx.shadowBlur = 8;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.strokeText('  ' + this.letter, 0, 0);
            this.ctx.rotate(this.rotate);
            this.ctx.translate(-this.w / 2, -this.h / 2);
            this.ctx.beginPath();
        }

        this.t++;

        if (this.t % (this.speed * 40) === 0) {
            this.ctx.font = AL.random(60, 600) + 'px sans-serif';

            const col = Math.random();
            if (col < 0.15) {
                this.ctx.lineWidth = 2;
                this.ctx.shadowBlur = 12;
                this.color = 'rgba(255, 255, 255, 0.5)';
            } else if (col < 0.3) {
                this.ctx.lineWidth = 5;
                this.color = 'rgba(0, 0, 0, 0.5)';
            } else {
                this.ctx.shadowBlur = 8;
                this.ctx.lineWidth = 3;
                this.color = AL.randomColor(0, 255, 0.66, 0.66);
            }

            this.ctx.shadowColor = this.ctx.strokeStyle = this.color;
        }

        if (this.t % (this.speed * 120) === 0) {
            this.ctx.globalCompositeOperation = AL.pickRandomElement(
                this.modes
            );
        }

        if (this.t % (this.speed * 200) === 0) {
            this.letter = String.fromCharCode(
                AL.pickRandomElement(this.letters)
            );
        }

        requestAnimationFrame(this.draw);
    }
}
