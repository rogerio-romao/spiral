import AL from '../AlgorithmLoader.js';

export default class Wormholes extends AL {
    constructor() {
        super();

        this.name = 'Wormholes';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.letters = [
            2101, 2102, 2103, 2104, 2108, 2109, 2110, 2116, 2117, 2119, 2121, 2123, 2127, 2130,
            2134, 2142, 2304, 2305, 2312, 2313, 2314, 2316, 2317, 2318, 2319, 2320, 2325, 2328,
            2330, 2336, 2349, 2352, 2353, 2361, 2362, 2365, 2367, 2368, 2383, 2385, 2390, 2391,
        ];
        this.letter = String.fromCodePoint(AL.pickRandomElement(this.letters));

        this.size = 15;
        this.change = 2;
        this.rotate = AL.random(1, 22);
    }

    setupDrawingStyles() {
        AL.ctx.textAlign = 'center';
        AL.ctx.font = `${this.size}px sans-serif`;
        AL.ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)';
        AL.ctx.fillStyle = AL.randomColor(0, 255, 0.05, 0.15);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.fillText(this.letter, AL.w / 2, AL.h / 2);
            AL.ctx.strokeText(this.letter, AL.w / 2, AL.h / 2);
        }

        this.size += this.change;
        AL.ctx.font = `${this.size}px sans-serif`;

        if (AL.ctx.measureText(this.letter).width > AL.w / 2) {
            this.change *= -1;
        }
        if (AL.ctx.measureText(this.letter).width < 5) {
            this.change *= -1;
            this.rotate = AL.random(1, 22);
            this.letter = String.fromCodePoint(AL.pickRandomElement(this.letters));

            AL.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.fillScreen();

            AL.ctx.fillStyle = AL.randomColor(0, 255, 0.05, 0.15);
        }

        this.t += 1;

        this.rotateCanvasRadians(this.rotate);

        this.requestFrame();
    }
}
