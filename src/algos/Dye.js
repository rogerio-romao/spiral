import AL from '../AlgorithmLoader.js';

export default class Dye extends AL {
    constructor() {
        super();

        this.name = 'Dye';

        // Uses gsap, throw if not present
        if (!AL.gsap) {
            throw new Error('GSAP is required for Dye algorithm');
        }

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
        this.offsetX = AL.random(-AL.w / 5 / 2, AL.w / 5 / 2);
        this.offsetY = AL.random(-AL.h / 5 / 2, AL.h / 5 / 2);
    }

    setupConstantStyles() {
        // AL.ctx.clearRect(0, 0, AL.w, AL.h);
        AL.ctx.globalCompositeOperation = 'soft-light';
    }

    setupDrawingStyles() {
        AL.ctx.font = `${this.font1.size}px bold serif`;
        AL.ctx.strokeStyle = this.color1.color;
        AL.ctx.fillStyle = this.color2.color;
        AL.ctx.lineWidth = this.line1.width;
    }

    draw() {
        for (let i = -100; i <= AL.w + 100; i += AL.w / 5) {
            for (let j = -100; j <= AL.h + 100; j += AL.h / 5) {
                this.rotateCanvasRadians(this.rotate);

                AL.ctx.fillText(this.text, i + this.offsetX, j + this.offsetY);
                AL.ctx.strokeText(this.text, i + this.offsetX, j + this.offsetY);
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
                    onUpdate: () => (AL.ctx.font = `${this.font1.size}px bold serif`),
                    size: this.font2.size,
                },
                '<',
            )
            .to(
                this.color1,
                {
                    color: this.color3.color,
                    duration: AL.random(3, 13),
                    onUpdate: () => (AL.ctx.strokeStyle = this.color1.color),
                },
                '<',
            )
            .to(
                this.color2,
                {
                    color: this.color1.color,
                    duration: AL.random(3, 10),
                    onUpdate: () => (AL.ctx.fillStyle = this.color2.color),
                },
                '<',
            )
            .to(
                this.line1,
                {
                    duration: AL.random(2, 10),
                    onUpdate: () => (AL.ctx.lineWidth = this.line1.width),
                    width: this.line2.width,
                },
                '<',
            );
    }
}
