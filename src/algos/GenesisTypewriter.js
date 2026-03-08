import AL from '../AlgorithmLoader.js';

export default class GenesisTypewriter extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Genesis Typewriter';

        // Uses gsap, throw if not present
        if (!AL.gsap) {
            throw new Error('GSAP is required for Genesis Typewriter algorithm');
        }

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.getTweens();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.tl = null;
    }

    initializeProperties() {
        this.pos1 = { x: AL.random(0, this.w), y: AL.random(0, this.h) };
        this.pos2 = { x: AL.random(0, this.w), y: AL.random(0, this.h) };
        this.text = AL.pickRandomElement([...this.letters]);
        this.font2 = { size: AL.random(160, 600) };
        this.font1 = { size: AL.random(20, 100) };
        this.rotate = { angle: AL.random(1, 44) };
        this.line2 = { width: AL.random(3, 7) };
        this.line1 = { width: 1 };
    }

    setupConstantStyles() {
        this.ctx.strokeStyle = 'white';
        this.ctx.fillStyle = 'black';
    }

    setupDrawingStyles() {
        this.ctx.font = `${this.font1.size}px bold serif`;
        this.ctx.lineWidth = this.line1.width;
    }

    draw() {
        this.ctx.fillText(this.text, this.pos1.x, this.pos1.y);
        this.ctx.strokeText(this.text, this.pos1.x, this.pos1.y);

        this.t += 1;

        if (this.t % 1000 === 0) {
            this.tl.kill();

            this.initializeProperties();

            this.setupDrawingStyles();
            this.ctx.strokeStyle = Math.random() < 0.25 ? 'white' : AL.randomColor();

            this.getTweens();
        }

        this.rotateCanvasDegrees(this.rotate.angle);

        this.requestFrame();
    }

    stop() {
        this.tl?.kill();
        super.stop();
    }

    getTweens() {
        this.tl = AL.gsap.timeline({
            defaults: { ease: 'back.out(1.7)', repeat: -1, yoyo: true },
        });
        this.tl
            .to(
                this.font1,
                {
                    duration: AL.random(12, 40),
                    onUpdate: () => (this.ctx.font = `${this.font1.size}px bold serif`),
                    size: this.font2.size,
                },
                '<',
            )
            .to(
                this.pos1,
                {
                    duration: AL.random(15, 50),
                    x: this.pos2.x,
                },
                '<',
            )
            .to(
                this.pos1,
                {
                    duration: AL.random(15, 50),
                    y: this.pos2.y,
                },
                '<',
            )
            .to(
                this.line1,
                {
                    duration: AL.random(6, 14),
                    onUpdate: () => (this.ctx.lineWidth = this.line1.width),
                    width: this.line2.width,
                },
                '<',
            );
    }
}
