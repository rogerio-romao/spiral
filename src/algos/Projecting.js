import AL from '../AlgorithmLoader.js';

export default class Projecting extends AL {
    constructor() {
        super();

        this.name = 'Projecting';

        // Uses gsap, throw if not present
        if (!AL.gsap) {
            throw new Error('GSAP is required for Projecting algorithm');
        }

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.getTweens();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.tl = null;
        this.modes = [
            'source-over',
            'multiply',
            'darken',
            'lighten',
            'xor',
            'difference',
            'exclusion',
            'overlay',
            'screen',
            'hue',
            'luminosity',
            'color',
            'saturation',
            'soft-light',
            'hard-light',
        ];
    }

    initializeProperties() {
        this.rotate1 = { rot: AL.random(1, 90) };
        this.rotate2 = { rot: AL.random(1, 90) };
        this.color1 = { color: AL.randomColor() };
        this.color2 = { color: AL.randomColor() };
        this.color3 = { color: AL.randomColor() };
        this.color4 = { color: AL.randomColor() };
        this.width = AL.random(4, 19);
    }

    setupConstantStyles() {
        AL.ctx.shadowBlur = 10;
        AL.ctx.strokeStyle = 'black';
        AL.ctx.shadowColor = this.color3.color;
    }

    setupDrawingStyles() {
        AL.ctx.fillStyle = this.color1.color;
        AL.ctx.globalCompositeOperation = AL.pickRandomElement(this.modes);
    }

    draw() {
        AL.ctx.translate(AL.w / 2, AL.h / 2);
        AL.ctx.rotate(this.rotate1.rot * (Math.PI / 180));
        AL.ctx.fillRect(0, 0, AL.w, this.width);
        AL.ctx.translate(-AL.w / 2, -AL.h / 2);

        this.t += 1;

        if (this.t % 480 === 0) {
            this.tl.kill();

            this.initializeProperties();
            this.setupDrawingStyles();

            this.getTweens();
        }

        this.requestFrame();
    }

    stop() {
        this.tl?.kill();
        super.stop();
    }

    getTweens() {
        this.tl = AL.gsap.timeline({
            defaults: { repeat: -1, yoyo: true },
        });
        this.tl.to(
            this.rotate1,
            {
                duration: AL.random(3, 8),
                rot: this.rotate2.rot,
            },
            '<',
        );
        this.tl.to(
            this.color1,
            {
                color: this.color2.color,
                duration: AL.random(3, 10),
                onUpdate: () => (AL.ctx.fillStyle = this.color1.color),
            },
            '<',
        );
        this.tl.to(
            this.color3,
            {
                color: this.color4.color,
                duration: AL.random(3, 10),
                onUpdate: () => (AL.ctx.shadowColor = this.color3.color),
            },
            '<',
        );
    }
}
