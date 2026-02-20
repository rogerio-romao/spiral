// side effect import to patch the CanvasRenderingContext2D prototype with roundRect
import './src/utils/roundRectExtra.js';

import Spiral from './src/Spiral.js';
import Pulsar from './src/algos/Pulsar.js';

const devMode = true;
const devAlgorithmClass = Pulsar;

const spiral = new Spiral({ devMode, devAlgorithmClass });

window.addEventListener('beforeunload', () => spiral.destroy());
