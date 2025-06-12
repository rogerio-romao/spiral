import BA from '../BaseAlgorithm.js';

export default class Sandala extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.letters = [
            3201, 3202, 3203, 3204, 3206, 3207, 3208, 3209, 3212, 3214, 3215,
            3218, 3219, 3221, 3222, 3223, 3226, 3227, 3228, 3231, 3232, 3234,
            3236, 3238, 3244, 3248, 3249, 3250, 3254, 3255, 3260, 3261, 3263,
            3270, 3294, 3298,
        ];

        this.cols = BA.random(5, 12);
        this.rows = BA.random(5, 12);
        this.rot = BA.random(1, 60);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = BA.randomColor(0, 255, 1, 1);
        this.ctx.globalCompositeOperation = 'soft-light';
    }

    draw() {
        if (this.t % this.speed === 0) {
            for (let row = 0; row <= this.rows; row++) {
                this.ctx.translate(this.w / 2, this.h / 2);
                this.ctx.rotate((this.rot * Math.PI) / 180);
                this.ctx.translate(-this.w / 2, -this.h / 2);

                for (let col = 0; col <= this.cols; col++) {
                    this.ctx.strokeText(
                        String.fromCharCode(
                            this.letters[BA.random(0, this.letters.length)]
                        ),
                        row * (this.w / this.cols),
                        col * (this.h / this.rows)
                    );
                }
            }
        }

        if (this.t % (this.speed * 80) === 0) {
            this.cols = BA.random(5, 12);
            this.rows = BA.random(5, 12);
            this.rot = BA.random(1, 60);

            this.ctx.strokeStyle = BA.randomColor(0, 255, 1, 1);
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}
