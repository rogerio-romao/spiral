import Spiral from './src/Spiral.js';
import MusicPlayer from './src/MusicPlayer.js';

// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
('use strict');

CanvasRenderingContext2D.prototype.roundRect = function (
    x,
    y,
    width,
    height,
    radius,
    fill,
    stroke,
) {
    const cornerRadius = {
        upperLeft: 0,
        upperRight: 0,
        lowerLeft: 0,
        lowerRight: 0,
    };
    if (typeof stroke == 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'object') {
        for (const side in radius) cornerRadius[side] = radius[side];
    }

    this.beginPath();
    this.moveTo(x + cornerRadius.upperLeft, y);
    this.lineTo(x + width - cornerRadius.upperRight, y);
    this.quadraticCurveTo(x + width, y, x + width, y + cornerRadius.upperRight);
    this.lineTo(x + width, y + height - cornerRadius.lowerRight);
    this.quadraticCurveTo(
        x + width,
        y + height,
        x + width - cornerRadius.lowerRight,
        y + height,
    );
    this.lineTo(x + cornerRadius.lowerLeft, y + height);
    this.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - cornerRadius.lowerLeft,
    );
    this.lineTo(x, y + cornerRadius.upperLeft);
    this.quadraticCurveTo(x, y, x + cornerRadius.upperLeft, y);
    this.closePath();
    if (stroke) {
        this.stroke();
    }
    if (fill) {
        this.fill();
    }
};

new Spiral();
new MusicPlayer();
