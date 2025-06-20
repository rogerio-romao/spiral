import AL from '../AlgorithmLoader.js';

export default class EvolvingMandala extends AL {
    constructor(ctx, w, h) {
        super(ctx, w, h);

        this.initializeProperties();
        this.setupDrawingStyles();

        this.interval = requestAnimationFrame(this.draw);
    }

    initializeProperties() {
        this.letters = [
            1101, 1102, 1103, 1104, 1107, 1111, 1114, 1115, 1116, 1118, 1120,
            1121, 1123, 1126, 1127, 1130, 1133, 1135, 1136, 1137, 1139, 1140,
            1141, 1144, 1146, 1148, 1152, 1154, 1155, 1156, 1160, 1161, 1168,
            1169, 1174, 1176, 1180, 1185, 1187, 1188, 1194, 1197, 1198, 1199,
            1200, 1202, 1204, 1205, 1208, 1209, 1210, 1216, 1218, 1219, 1229,
            1231, 1233, 1234, 1237, 1238, 1240, 1242, 1244, 1246, 1249, 1251,
            1254, 1255, 1261, 1262, 1265, 1266, 1267, 1269, 1270, 1271, 1273,
            1274, 1275, 1276, 1278, 1280, 1284, 1286, 1294, 10400,
        ];
        this.letter = String.fromCharCode(
            this.letters[AL.random(0, this.letters.length)]
        );

        this.rot = AL.random(4, 356);
        this.speed *= 2;
    }

    setupDrawingStyles() {
        this.ctx.strokeStyle = AL.randomColor(20, 255, 0.85, 0.85);
        this.ctx.font = `bold ${AL.random(70, 260)}px sans-serif`;
        this.ctx.textAlign = 'center';
    }

    draw() {
        if (this.t % this.speed === 0) {
            this.ctx.strokeText(
                this.letter + ' ' + this.letter + '  ' + this.letter,
                this.w / 2,
                this.h / 2
            );

            this.rotateCanvasDegrees(this.rot);
        }

        this.t++;

        if (this.t % (this.speed * 45) === 0) {
            const pick = Math.random();
            if (pick < 0.075) {
                this.ctx.strokeStyle = 'black';
            } else if (pick < 0.15) {
                this.ctx.strokeStyle = 'white';
            } else {
                this.ctx.strokeStyle = AL.randomColor(20, 255, 0.85, 0.85);
            }

            this.rot += 2;
        }

        if (this.t % (this.speed * 90) === 0) {
            this.ctx.font = `bold ${AL.random(70, 260)}px sans-serif`;
        }

        if (this.t % (this.speed * 360) === 0) {
            this.rot = AL.random(4, 356);
            this.letter = String.fromCharCode(
                this.letters[AL.random(0, this.letters.length)]
            );
        }

        requestAnimationFrame(this.draw);
    }
}
