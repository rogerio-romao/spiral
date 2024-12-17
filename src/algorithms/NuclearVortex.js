class NuclearVortex {
    constructor() {
        // Your existing constructor code
    }

    draw = () => {
        if (t % speed === 0) {
            ctx.moveTo(this.x1, this.y1);
            ctx.lineTo(this.x2, this.y2);
            ctx.stroke();
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rotate);
            ctx.translate(-w / 2, -h / 2);
        }
        t++;
        if (t % (speed * 90) === 0) {
            this.x1 = random(0, w / 2);
            this.y1 = random(0, h / 2);
            this.x2 = random(0, w);
            this.y2 = random(0, h);
            this.rotate = (random(4, 176) * Math.PI) / 180;
        }
        if (t % (speed * 180) === 0) {
            ctx.beginPath();
            ctx.setLineDash([random(10, 150), random(10, 150)]);
            this.col++;
            if (this.col > this.colors.length - 1) this.col = 0;
            ctx.strokeStyle = this.colors[this.col];
        }
        if (t % (speed * 1080) === 0) {
            ctx.setLineDash([random(10, 100), random(10, 100)]);
            this.color1 = randomColor(50, 150, 0.1, 0.35);
            this.color2 = randomColor(50, 150, 0.1, 0.35);
            this.color3 = randomColor(50, 150, 0.1, 0.35);
            this.color4 = randomColor(50, 150, 0.1, 0.35);
            this.colors = [
                this.color1,
                this.color2,
                'rgba(255, 255, 255, 0.5)',
                this.color3,
                this.color4,
                'black',
            ];
            this.col = 0;
            ctx.strokeStyle = this.color1;
        }
        interval = requestAnimationFrame(this.draw);
    };
}

module.exports = NuclearVortex;