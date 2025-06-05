class EvolvingMandala {
    constructor() {
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
            this.letters[random(0, this.letters.length)]
        );
        this.rot = random(4, 356);

        speed *= 2;
        ctx.strokeStyle = randomColor(20, 255, 0.85, 0.85);
        ctx.font = `bold ${random(70, 260)}px sans-serif`;
        ctx.textAlign = 'center';

        this.draw = () => {
            if (t % speed === 0) {
                ctx.strokeText(
                    this.letter + ' ' + this.letter + '  ' + this.letter,
                    w / 2,
                    h / 2
                );
                ctx.translate(w / 2, h / 2);
                ctx.rotate((this.rot * Math.PI) / 180);
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            if (t % (speed * 45) === 0) {
                let pick = Math.random();
                if (pick < 0.075) {
                    ctx.strokeStyle = 'black';
                } else if (pick < 0.15) {
                    ctx.strokeStyle = 'white';
                } else {
                    ctx.strokeStyle = randomColor(20, 255, 0.85, 0.85);
                }
                this.rot += 2;
            }
            if (t % (speed * 90) === 0) {
                ctx.font = `bold ${random(70, 260)}px sans-serif`;
            }
            if (t % (speed * 360) === 0) {
                this.rot = random(4, 356);
                this.letter = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                );
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}
