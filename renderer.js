// side effect import to patch the CanvasRenderingContext2D prototype with roundRect
import './src/utils/roundRect.js';

import MusicPlayer from './src/MusicPlayer.js';
import Spiral from './src/Spiral.js';
import Test from './src/algos/Test.js';

const devMode = false;
const devAlgorithmClass = Test;

new Spiral({ devMode, devAlgorithmClass });
new MusicPlayer();
