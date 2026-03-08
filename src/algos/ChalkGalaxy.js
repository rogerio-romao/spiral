import AL from '../AlgorithmLoader.js';

export default class ChalkGalaxy extends AL {
    constructor() {
        super();

        this.name = 'Chalk Galaxy';

        this.initializeProperties();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeProperties() {
        this.letters = [
            1401, 1402, 1403, 1404, 1406, 1407, 1408, 1410, 1411, 1412, 1413, 1414, 1415, 1417,
            1418, 1425, 1426, 1427, 1428, 1429, 1430, 1431, 1440, 1441, 1470, 1472, 1475, 1478,
            1490, 1491, 1492, 1493, 1495, 1499, 1500, 10_157,
        ];
        this.letter = String.fromCodePoint(AL.pickRandomElement(this.letters));
        this.rotate = AL.random(1, 179);
    }

    setupDrawingStyles() {
        AL.ctx.strokeStyle = AL.randomColor(150, 255, 0.25, 0.25);
        AL.ctx.font = `${AL.random(100, 700)}px bold`;
        AL.ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        AL.ctx.fillRect(0, 0, AL.w, AL.h);
    }

    draw() {
        if (this.t % this.speed === 0) {
            AL.ctx.strokeText(this.letter, AL.w / 2, AL.h / 2);

            this.rotateCanvasRadians(this.rotate);
        }

        this.t += 1;

        if (this.t % (this.speed * 100) === 0) {
            AL.ctx.strokeStyle = AL.randomColor(170, 255, 0.2, 0.2);
            AL.ctx.font = `${AL.random(100, 600)}px bold`;
        }

        if (this.t % (this.speed * 500) === 0) {
            AL.ctx.strokeStyle = AL.randomColor(0, 115, 0.2, 0.2);
            this.rotate = AL.random(1, 179);
        }

        if (this.t % (this.speed * 1000) === 0) {
            this.letter = String.fromCodePoint(AL.pickRandomElement(this.letters));
        }

        this.requestFrame();
    }
}
