import AL from '../AlgorithmLoader.js';

export default class AcidStars extends AL {
    constructor() {
        super();

        this.name = 'Acid Stars';

        this.initializeBaseProperties();
        this.initializeProperties();
        this.setupConstantStyles();
        this.setupDrawingStyles();

        this.requestFrame();
    }

    initializeBaseProperties() {
        this.letters = [
            1606, 1607, 1608, 1610, 1611, 1613, 1614, 1616, 1618, 1619, 1621, 1622, 1623, 1624,
            1627, 1628, 1629, 1631, 1632, 1633, 1634, 1635, 1636, 1637, 1639, 1640, 1644, 1645,
            1647, 1648, 1649, 1650, 1654, 1656, 1659, 1660, 1663, 1664, 1665, 1666, 1667, 1668,
            1670, 1671, 1672, 1673, 1674, 1675, 1677, 1678, 1680, 1682, 1683, 1686, 1690, 1691,
            1693, 1695, 1697,
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
        AL.ctx.shadowBlur = 15;
    }

    setupDrawingStyles() {
        AL.ctx.font = `${this.fontSize}px serif`;
        AL.ctx.shadowColor = AL.ctx.fillStyle = AL.randomColor(0, 255, 1);
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.stagger %= 3;

            if (this.stagger === 0) {
                AL.ctx.fillText(this.letter, AL.w / 2 + this.side / 2, AL.h / 2);
                AL.ctx.stroke();
            }

            if (this.stagger === 1) {
                AL.ctx.fillText(this.letter, AL.w / 2, AL.h / 2 - this.side / 2);
            }

            if (this.stagger === 2) {
                AL.ctx.translate(AL.w / 2, AL.h / 2);
                AL.ctx.rotate((-this.rotate * Math.PI) / 180);
                AL.ctx.fillText(this.letter, AL.w / 2 - this.side / 2, AL.h / 2);
                AL.ctx.stroke();
                AL.ctx.translate(-AL.w / 2, -AL.h / 2);
            }

            this.stagger += 1;
        }

        this.side += this.change;
        if (this.side > Math.max(AL.w, AL.h) || this.side < 5) {
            this.change = -this.change;
        }

        this.t += 1;

        if (this.t % (this.speed * 240) === 0) {
            this.initializeProperties();
            this.setupDrawingStyles();
            AL.ctx.beginPath();
        }

        if (this.t % (this.speed * 720) === 0) {
            this.letter = String.fromCodePoint(AL.pickRandomElement(this.letters));
        }

        this.requestFrame();
    }
}
