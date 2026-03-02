import AL from '../AlgorithmLoader.js';

export default class Dye extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Dye';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.getTweens();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.letters = [
            3405, 3423, 3424, 3437, 3442, 3443, 3444, 3458, 3459, 3461, 3465, 3466, 3468, 3471,
            3482, 3484, 3491, 3492, 3493,
        ];

        this.tl = null;

        this.rotate = AL.random(1, 500);
    }

    initializeProperties() {
        this.text = String.fromCodePoint(AL.pickRandomElement(this.letters)).padStart(30, ' ');

        this.line1 = { width: 1 };
        this.font1 = { size: AL.random(14, 40) };
        this.font2 = { size: AL.random(60, 150) };
        this.line2 = { width: AL.random(4, 12) };
        this.color1 = { color: AL.randomColor() };
        this.color2 = { color: AL.randomColor() };
        this.color3 = { color: AL.randomColor() };
        this.color4 = { color: AL.randomColor() };
        this.offsetX = AL.random(-this.w / 5 / 2, this.w / 5 / 2);
        this.offsetY = AL.random(-this.h / 5 / 2, this.h / 5 / 2);
    }

    setupConstantStyles() {
        // this.ctx.clearRect(0, 0, this.w, this.h);
        this.ctx.globalCompositeOperation = 'soft-light';
    }

    setupDrawingStyles() {
        this.ctx.font = `${this.font1.size}px bold serif`;
        this.ctx.strokeStyle = this.color1.color;
        this.ctx.fillStyle = this.color2.color;
        this.ctx.lineWidth = this.line1.width;
    }

    draw() {
        for (let i = -100; i <= this.w + 100; i += this.w / 5) {
            for (let j = -100; j <= this.h + 100; j += this.h / 5) {
                this.rotateCanvasRadians(this.rotate);

                this.ctx.fillText(this.text, i + this.offsetX, j + this.offsetY);
                this.ctx.strokeText(this.text, i + this.offsetX, j + this.offsetY);
            }
        }

        this.t += 1;

        if (this.t % (this.speed * 400) === 0) {
            this.rotate = AL.random(1, 500);
        }

        if (this.t % 80 === 0) {
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
            defaults: { ease: 'circ', repeat: -1, yoyo: true },
        });
        this.tl
            .to(
                this.font1,
                {
                    duration: AL.random(4, 10),
                    onUpdate: () => (this.ctx.font = `${this.font1.size}px bold serif`),
                    size: this.font2.size,
                },
                '<',
            )
            .to(
                this.color1,
                {
                    color: this.color3.color,
                    duration: AL.random(3, 13),
                    onUpdate: () => (this.ctx.strokeStyle = this.color1.color),
                },
                '<',
            )
            .to(
                this.color2,
                {
                    color: this.color1.color,
                    duration: AL.random(3, 10),
                    onUpdate: () => (this.ctx.fillStyle = this.color2.color),
                },
                '<',
            )
            .to(
                this.line1,
                {
                    duration: AL.random(2, 10),
                    onUpdate: () => (this.ctx.lineWidth = this.line1.width),
                    width: this.line2.width,
                },
                '<',
            );
    }
}
