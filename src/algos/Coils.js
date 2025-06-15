import BA from '../BaseAlgorithm.js';

export default class Coils extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.getTweens();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.dur1 = BA.random(5, 20);
        this.dur2 = BA.random(8, 30);
        this.dur3 = BA.random(10, 40);
        this.dur4 = BA.random(3, 10);
        this.rot = BA.random(1, 100);

        this.obj1 = {
            x: 0,
            y: 0,
            radius: BA.random(10, 35),
            color: BA.randomColor(60, 255, 0.6, 1),
        };
        this.obj2 = {
            x: this.w / 2,
            y: this.h / 2,
            radius: BA.random(30, 130),
            color: BA.randomColor(60, 255, 0.6, 1),
        };

        this.tl = null;
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

        this.ctx.translate(this.w / 2, this.h / 2);
        this.ctx.rotate(this.rot);
        this.ctx.translate(-this.w / 2, -this.h / 2);

        if (this.t % (this.speed * 720) === 0) {
            this.tl.kill();

            this.dur1 = BA.random(5, 20);
            this.dur2 = BA.random(8, 30);
            this.dur3 = BA.random(10, 40);
            this.dur4 = BA.random(3, 10);
            this.rot = BA.random(1, 100);

            this.obj1 = {
                x: 0,
                y: 0,
                radius: BA.random(10, 35),
                color: BA.randomColor(60, 255, 0.6, 1),
            };
            this.obj2 = {
                x: this.w / 2,
                y: this.h / 2,
                radius: BA.random(30, 130),
                color: BA.randomColor(60, 255, 0.6, 1),
            };

            this.getTweens();
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }

    getTweens() {
        this.tl = BA.gsap.timeline({ defaults: { repeat: -1, yoyo: true } });
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
