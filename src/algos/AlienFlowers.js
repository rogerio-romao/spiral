import AL from '../AlgorithmLoader.js';

export default class AlienFlowers extends AL {
    constructor() {
        super();

        this.name = 'Alien Flowers';

        this.setupBaseStyles();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    setupConstantStyles() {
        this.modes = ['hard-light', 'color-dodge', 'multiply', 'overlay', 'color-burn'];

        AL.ctx.lineJoin = 'bevel';
        AL.ctx.lineCap = 'round';
        AL.ctx.shadowBlur = 5;

        AL.ctx.beginPath();
    }

    setupBaseStyles() {
        AL.ctx.setLineDash([AL.random(1, 100), AL.random(5, 200)]);
        AL.ctx.globalCompositeOperation = 'source-over';
    }

    setupDrawingStyles() {
        AL.ctx.shadowColor = AL.ctx.strokeStyle = AL.randomColor(5, 255, 0.1, 0.1);

        AL.ctx.shadowOffsetX = AL.ctx.shadowOffsetY = AL.ctx.lineWidth = AL.random(3, 36);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger %= 4;

            if (this.stagger === 0) {
                AL.ctx.moveTo(AL.w / 2, AL.h / 2);
                AL.ctx.bezierCurveTo(
                    AL.random(0, AL.w / 2),
                    AL.random(0, AL.h / 2),
                    AL.random(0, AL.w / 4),
                    AL.random(0, AL.h / 4),
                    0,
                    0,
                );
                AL.ctx.stroke();
            }

            if (this.stagger === 1) {
                AL.ctx.moveTo(AL.w / 2, AL.h / 2);
                AL.ctx.bezierCurveTo(
                    AL.random(AL.w / 2, AL.w),
                    AL.random(0, AL.h / 2),
                    AL.random(AL.w * 0.75, AL.w),
                    AL.random(0, AL.h * 0.25),
                    AL.w,
                    0,
                );
                AL.ctx.stroke();
            }

            if (this.stagger === 2) {
                AL.ctx.moveTo(AL.w / 2, AL.h / 2);
                AL.ctx.bezierCurveTo(
                    AL.random(AL.w / 2, AL.w),
                    AL.random(AL.h / 2, AL.h),
                    AL.random(AL.w * 0.75, AL.w),
                    AL.random(AL.h * 0.75, AL.h),
                    AL.w,
                    AL.h,
                );
                AL.ctx.stroke();
            }

            if (this.stagger === 3) {
                AL.ctx.moveTo(AL.w / 2, AL.h / 2);
                AL.ctx.bezierCurveTo(
                    AL.random(0, AL.w / 2),
                    AL.random(AL.h / 2, AL.h),
                    AL.random(0, AL.w * 0.25),
                    AL.random(AL.h * 0.75, AL.h),
                    0,
                    AL.h,
                );
                AL.ctx.stroke();
            }

            this.stagger += 1;
        }

        this.t += 1;

        if (this.t % (this.speed * 16) === 0) {
            this.rotateCanvasDegrees(AL.random(1, 359));
        }

        if (this.t % (this.speed * 32) === 0) {
            AL.ctx.globalCompositeOperation = AL.pickRandomElement(this.modes);

            AL.ctx.beginPath();
        }

        if (this.t % (this.speed * 64) === 0) {
            this.setupDrawingStyles();
            AL.ctx.beginPath();
        }

        if (this.t % (this.speed * 256) === 0) {
            AL.ctx.setLineDash([AL.random(1, 100), AL.random(5, 200)]);
        }

        this.requestFrame();
    }
}
