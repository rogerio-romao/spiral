// side effect import to patch the CanvasRenderingContext2D prototype with roundRect
import './src/utils/roundRect.js';

import Spiral from './src/Spiral.js';
import TemplateFrequency from './src/algos/TemplateFrequency.js';

const devMode = false;
const devAlgorithmClass = TemplateFrequency;

new Spiral({ devMode, devAlgorithmClass });
