import BA from '../BaseAlgorithm.js';

export default class AlphabetSoup extends BA {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.letters = [
            1301, 1302, 1303, 1305, 1306, 1307, 1308, 1309, 1311, 1313, 1314,
            1315, 1316, 1317, 1319, 1324, 1325, 1326, 1328, 1329, 1330, 1331,
            1332, 1334, 1337, 1338, 1340, 1342, 1344, 1345, 1347, 1351, 1354,
            1359, 1361, 1362, 1363, 1364, 1365, 1367, 1369, 1370, 1371, 1372,
            1373, 1374, 1375, 1376, 1377, 1378, 1383, 1384, 1385, 1386, 1388,
            1390, 1392, 1393, 1397, 1399, 1400,
        ];
        this.letter1 = String.fromCharCode(
            this.letters[BA.random(0, this.letters.length)]
        );
        this.letter2 = String.fromCharCode(
            this.letters[BA.random(0, this.letters.length)]
        );
        this.letter3 = String.fromCharCode(
            this.letters[BA.random(0, this.letters.length)]
        );
        this.letter4 = String.fromCharCode(
            this.letters[BA.random(0, this.letters.length)]
        );

        this.rot1 = (BA.random(8, 35) * Math.PI) / 180;
    }

    setupDrawingStyles() {
        this.ctx.fillStyle = BA.randomColor(0, 255, 0.45, 0.7);
        this.fontChange = BA.random(35, 180);
        this.ctx.font = `${this.fontChange}px sans-serif`;
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.translate(this.w / 2, this.h / 2);
            this.ctx.rotate(this.rot1);
            this.ctx.translate(-this.w / 2, -this.h / 2);

            this.ctx.fillText(
                `${this.letter1} ${this.letter2} ${this.letter3} ${this.letter4}`,
                this.w / 2,
                this.h / 2
            );
        }

        if (this.t % (this.speed * 100) === 0) {
            this.fontChange = BA.random(35, 180);
            this.ctx.font = `${this.fontChange}px sans-serif`;
            this.ctx.fillStyle = BA.randomColor(0, 255, 0.45, 0.7);
        }

        if (this.t % (this.speed * 200) === 0) {
            this.rot1 = (BA.random(8, 35) * Math.PI) / 180;
        }

        if (this.t % (this.speed * 400) === 0) {
            this.letter1 = String.fromCharCode(
                this.letters[BA.random(0, this.letters.length)]
            );
            this.letter2 = String.fromCharCode(
                this.letters[BA.random(0, this.letters.length)]
            );
            this.letter3 = String.fromCharCode(
                this.letters[BA.random(0, this.letters.length)]
            );
            this.letter4 = String.fromCharCode(
                this.letters[BA.random(0, this.letters.length)]
            );
        }

        this.t++;

        requestAnimationFrame(this.draw);
    }
}