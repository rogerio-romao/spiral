import AL from '../AlgorithmLoader.js';

export default class Wormholes extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.letters = [
            2101, 2102, 2103, 2104, 2108, 2109, 2110, 2116, 2117, 2119, 2121,
            2123, 2127, 2130, 2134, 2142, 2304, 2305, 2312, 2313, 2314, 2316,
            2317, 2318, 2319, 2320, 2325, 2328, 2330, 2336, 2349, 2352, 2353,
            2361, 2362, 2365, 2367, 2368, 2383, 2385, 2390, 2391,
        ];
        this.letter = String.fromCharCode(AL.pickRandomElement(this.letters));

        this.size = 15;
        this.change = 2;
        this.rotate = AL.random(1, 22);
    }

    setupDrawingStyles() {
        this.ctx.textAlign = 'center';
        this.ctx.fillStyle = AL.randomColor(0, 255, 0.05, 0.15);
        this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
        this.ctx.font = `${this.size}px sans-serif`;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.fillText(this.letter, this.w / 2, this.h / 2);
            this.ctx.strokeText(this.letter, this.w / 2, this.h / 2);
        }

        this.size += this.change;
        this.ctx.font = `${this.size}px sans-serif`;

        if (this.ctx.measureText(this.letter).width > this.w / 2) {
            this.change *= -1;
        }
        if (this.ctx.measureText(this.letter).width < 5) {
            this.change *= -1;
            this.rotate = AL.random(1, 22);
            this.letter = String.fromCharCode(
                AL.pickRandomElement(this.letters)
            );

            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.fillScreen();

            this.ctx.fillStyle = AL.randomColor(0, 255, 0.05, 0.15);
        }

        this.t++;

        this.rotateCanvasRadians(this.rotate);

        requestAnimationFrame(this.draw);
    }
}
