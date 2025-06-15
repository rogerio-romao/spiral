import AL from '../AlgorithmLoader.js';

export default class Projecting extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.getTweens();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
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

        this.tl = null;

        this.width = AL.random(4, 19);
        this.rot1 = { rot: AL.random(1, 90) };
        this.rot2 = { rot: AL.random(1, 90) };
        this.color1 = { color: AL.randomColor() };
        this.color2 = { color: AL.randomColor() };
        this.color3 = { color: AL.randomColor() };
        this.color4 = { color: AL.randomColor() };
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = this.color1.color;
        this.ctx.strokeStyle = 'black';
        this.ctx.shadowColor = this.color3.color;
        this.ctx.shadowBlur = 10;
        this.ctx.globalCompositeOperation =
            this.modes[AL.random(0, this.modes.length)];
    }

    draw() {
        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rot1.rot * (Math.PI / 180));
        this.ctx.fillRect(0, 0, this.w, this.width);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % 480 === 0) {
            this.tl.kill();

            this.rot1.rot = AL.random(1, 90);
            this.rot2.rot = AL.random(1, 90);
            this.color1.color = AL.randomColor();
            this.color2.color = AL.randomColor();
            this.color3.color = AL.randomColor();
            this.color4.color = AL.randomColor();
            this.width = AL.random(4, 19);
            this.ctx.globalCompositeOperation =
                this.modes[AL.random(0, this.modes.length)];

            this.ctx.fillStyle = this.color1.color;

            this.getTweens();
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }

    getTweens() {
        this.tl = AL.gsap.timeline({
            defaults: { repeat: -1, yoyo: true },
        });
        this.tl.to(
            this.rot1,
            {
                duration: AL.random(3, 8),
                rot: this.rot2.rot,
            },
            '<'
        );
        this.tl.to(
            this.color1,
            {
                duration: AL.random(3, 10),
                color: this.color2.color,
                onUpdate: () => (this.ctx.fillStyle = this.color1.color),
            },
            '<'
        );
        this.tl.to(
            this.color3,
            {
                duration: AL.random(3, 10),
                color: this.color4.color,
                onUpdate: () => (this.ctx.shadowColor = this.color3.color),
            },
            '<'
        );
    }
}
