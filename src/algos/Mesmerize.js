import AL from '../AlgorithmLoader.js';

export default class Mesmerize extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Mesmerize';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.getTweens();

        this.requestFrame();
    }

    initializeProperties() {
        this.ul1 = AL.random(0, 30);
        this.ur1 = AL.random(0, 30);
        this.ll1 = AL.random(0, 30);
        this.lr1 = AL.random(0, 30);
        this.w1 = AL.random(30, 300);
        this.h1 = AL.random(30, 300);
        this.w2 = AL.random(60, 600);
        this.h2 = AL.random(60, 600);
        this.ul2 = AL.random(-300, 600);
        this.ur2 = AL.random(-300, 600);
        this.ll2 = AL.random(-300, 600);
        this.lr2 = AL.random(-300, 600);
        this.rotate = AL.random(1, 199);
        this.color2 = AL.randomColor(0, 127);
        this.color1 = AL.randomColor(127, 255);
        this.x1 = AL.random(0, this.w - this.w1);
        this.x2 = AL.random(0, this.w - this.w2);
        this.y1 = AL.random(0, this.h - this.h1);
        this.y2 = AL.random(0, this.h - this.h2);
        this.fill2 = AL.randomColor(0, 255, 0.04, 0.1);
        this.fill1 = AL.randomColor(0, 255, 0.01, 0.04);

        this.obj1 = {
            color: this.color1,
            fill: this.fill1,
            height: this.h1,
            lowerLeft: this.ll1,
            lowerRight: this.lr1,
            upperLeft: this.ul1,
            upperRight: this.ur1,
            width: this.w1,
            x: this.x1,
            y: this.y1,
        };
        this.obj2 = {
            color: this.color2,
            fill: this.fill2,
            height: this.h2,
            lowerLeft: this.ll2,
            lowerRight: this.lr2,
            upperLeft: this.ul2,
            upperRight: this.ur2,
            width: this.w2,
            x: this.x2,
            y: this.y2,
        };
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = this.obj1.color;
        this.ctx.fillStyle = this.obj1.fill;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.roundRectExtra(
                this.obj1.width,
                this.obj1.height,
                this.obj1.x,
                this.obj1.y,
                {
                    lowerLeft: this.obj1.lowerLeft,
                    lowerRight: this.obj1.lowerRight,
                    upperLeft: this.obj1.upperLeft,
                    upperRight: this.obj1.upperRight,
                },
                true,
                true,
            );
        }

        this.t++;

        this.rotateCanvasRadians(this.rotate);

        if (this.t % (this.speed * 1620) === 0) {
            this.tl.kill();

            this.clearScreen();

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
            defaults: { ease: 'power1', repeat: -1, yoyo: true },
        });
        this.tl
            .to(this.obj1, {
                duration: AL.random(10, 100),
                width: this.obj2.width,
            })
            .to(
                this.obj1,
                {
                    duration: AL.random(10, 100),
                    height: this.obj2.height,
                },
                '<',
            )
            .to(
                this.obj1,
                {
                    duration: AL.random(10, 100),
                    x: this.obj2.x,
                },
                '<',
            )
            .to(
                this.obj1,
                {
                    duration: AL.random(10, 100),
                    y: this.obj2.y,
                },
                '<',
            )
            .to(
                this.obj1,
                {
                    duration: AL.random(10, 100),
                    upperLeft: this.obj2.upperLeft,
                },
                '<',
            )
            .to(
                this.obj1,
                {
                    duration: AL.random(10, 100),
                    upperRight: this.obj2.upperRight,
                },
                '<',
            )
            .to(
                this.obj1,
                {
                    duration: AL.random(10, 100),
                    lowerLeft: this.obj2.lowerLeft,
                },
                '<',
            )
            .to(
                this.obj1,
                {
                    duration: AL.random(1, 10),
                    lowerRight: this.obj2.lowerRight,
                },
                '<',
            )
            .to(
                this.obj1,
                {
                    color: this.obj2.color,
                    duration: AL.random(2, 20),
                    onUpdate: () => (this.ctx.strokeStyle = this.obj1.color),
                },
                '<',
            )
            .to(
                this.obj1,
                {
                    duration: AL.random(2, 20),
                    fill: this.obj2.fill,
                    onUpdate: () => (this.ctx.fillStyle = this.obj1.fill),
                },
                '<',
            );
    }
}
