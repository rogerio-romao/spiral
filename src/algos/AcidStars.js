import AL from '../AlgorithmLoader.js';

export default class AcidStars extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.name = 'Acid Stars';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.letters = [
            1606, 1607, 1608, 1610, 1611, 1613, 1614, 1616, 1618, 1619, 1621,
            1622, 1623, 1624, 1627, 1628, 1629, 1631, 1632, 1633, 1634, 1635,
            1636, 1637, 1639, 1640, 1644, 1645, 1647, 1648, 1649, 1650, 1654,
            1656, 1659, 1660, 1663, 1664, 1665, 1666, 1667, 1668, 1670, 1671,
            1672, 1673, 1674, 1675, 1677, 1678, 1680, 1682, 1683, 1686, 1690,
            1691, 1693, 1695, 1697,
        ];
        this.letter = String.fromCodePoint(AL.pickRandomElement(this.letters));
    }

    initializeProperties() {
        this.rotate = AL.random(2, 44);
        this.side = AL.random(30, 300);
        this.change = this.side / 1.618;
        this.fontSize = AL.random(14, 20);
    }

    setupConstantStyles() {
        this.ctx.shadowBlur = 15;
    }

    setupDrawingStyles() {
        this.ctx.font = this.fontSize + 'px serif';
        this.ctx.shadowColor = this.ctx.fillStyle = AL.randomColor(0, 255, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger = this.stagger % 3;

            if (this.stagger === 0) {
                this.ctx.fillText(
                    this.letter,
                    this.w / 2 + this.side / 2,
                    this.h / 2,
                );
                this.ctx.stroke();
            }

            if (this.stagger === 1) {
                this.ctx.fillText(
                    this.letter,
                    this.w / 2,
                    this.h / 2 - this.side / 2,
                );
            }

            if (this.stagger === 2) {
                this.ctx.translate(this.w / 2, this.h / 2);
                this.ctx.rotate((-this.rotate * Math.PI) / 180);
                this.ctx.fillText(
                    this.letter,
                    this.w / 2 - this.side / 2,
                    this.h / 2,
                );
                this.ctx.stroke();
                this.ctx.translate(-this.w / 2, -this.h / 2);
            }

            this.stagger++;
        }

        this.side += this.change;
        if (this.side > Math.max(this.w, this.h) || this.side < 5) {
            this.change = -this.change;
        }

        this.t++;

        if (this.t % (this.speed * 240) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            this.ctx.beginPath();
        }

        if (this.t % (this.speed * 720) === 0) {
            this.letter = String.fromCodePoint(
                AL.pickRandomElement(this.letters),
            );
        }

        this.requestFrame();
    }
}
