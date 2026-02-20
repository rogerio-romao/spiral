// side effect import to patch the CanvasRenderingContext2D prototype with roundRect
import './src/utils/roundRectExtra.js';

import Spiral from './src/Spiral.js';
import SoapyBubbles from './src/algos/SoapyBubbles.js';

const devMode = false;
const devAlgorithmClass = SoapyBubbles;

const spiral = new Spiral({ devMode, devAlgorithmClass });

window.addEventListener('beforeunload', () => spiral.destroy());
