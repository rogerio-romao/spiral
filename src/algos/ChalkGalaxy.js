import AL from '../AlgorithmLoader.js';

export default class ChalkGalaxy extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.letters = [
            1401, 1402, 1403, 1404, 1406, 1407, 1408, 1410, 1411, 1412, 1413,
            1414, 1415, 1417, 1418, 1425, 1426, 1427, 1428, 1429, 1430, 1431,
            1440, 1441, 1470, 1472, 1475, 1478, 1490, 1491, 1492, 1493, 1495,
            1499, 1500, 10157,
        ];
        this.letter = String.fromCharCode(
            this.letters[AL.random(0, this.letters.length)]
        );
        this.rotate = AL.random(1, 179);
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(150, 255, 0.25, 0.25);
        this.ctx.font = `${AL.random(100, 500)}px bold`;
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        this.ctx.fillRect(0, 0, this.w, this.h);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.strokeText(this.letter, this.w / 2, this.h / 2);

            this.rotateCanvasDegrees(this.rotate);
        }

        this.t++;

        if (this.t % (this.speed * 100) === 0) {
            this.ctx.strokeStyle = AL.randomColor(170, 255, 0.2, 0.2);
            this.ctx.font = `${AL.random(100, 600)}px bold`;
        }

        if (this.t % (this.speed * 500) === 0) {
            this.ctx.strokeStyle = AL.randomColor(0, 115, 0.2, 0.2);
            this.rotate = AL.random(1, 179);
        }

        if (this.t % (this.speed * 1000) === 0) {
            this.letter = String.fromCharCode(
                this.letters[AL.random(0, this.letters.length)]
            );
        }

        requestAnimationFrame(this.draw);
    }
}
