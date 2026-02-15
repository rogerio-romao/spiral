import AL from '../AlgorithmLoader.js';

export default class Coils extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Coils';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.getTweens();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.tl = null;
    }

    initializeProperties() {
        this.dur1 = AL.random(5, 20);
        this.dur2 = AL.random(8, 30);
        this.dur3 = AL.random(10, 40);
        this.dur4 = AL.random(3, 10);
        this.rot = AL.random(1, 100);

        this.obj1 = {
            x: 0,
            y: 0,
            radius: AL.random(10, 35),
            color: AL.randomColor(60, 255, 0.6, 1),
        };
        this.obj2 = {
            x: this.w / 2,
            y: this.h / 2,
            radius: AL.random(30, 130),
            color: AL.randomColor(60, 255, 0.6, 1),
        };
    }

    setupDrawingStyles() {
        this.ctx.shadowBlur = 15;
        this.ctx.strokeStyle = this.ctx.shadowColor = this.obj1.color;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.beginPath();
            this.ctx.arc(
                this.obj1.x,
                this.obj1.y,
                this.obj1.radius,
                0,
                2 * Math.PI
            );
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.closePath();
        }

        this.rotateCanvasRadians(this.rot);

        this.t++;

        if (this.t % (this.speed * 720) === 0) {
            this.tl.kill();

            this.initializeProperties();

            this.getTweens();
        }

        this.requestFrame();
    }

    getTweens() {
        this.tl = AL.gsap.timeline({ defaults: { repeat: -1, yoyo: true } });
        this.tl
            .to(this.obj1, {
                duration: this.dur1,
                x: this.obj2.x,
                ease: 'elastic',
            })
            .to(
                this.obj1,
                {
                    duration: this.dur2,
                    y: this.obj2.y,
                    ease: 'bounce',
                },
                '<'
            )
            .to(
                this.obj1,
                {
                    duration: this.dur3,
                    radius: this.obj2.radius,
                    ease: 'back.out(3)',
                },
                '<'
            )
            .to(
                this.obj1,
                {
                    duration: this.dur4,
                    color: this.obj2.color,
                    ease: 'power1',
                    onUpdate: () =>
                        (this.ctx.strokeStyle = this.ctx.shadowColor =
                            this.obj1.color),
                },
                '<'
            );
    }
}
