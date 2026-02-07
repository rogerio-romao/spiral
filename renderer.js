// side effect import to patch the CanvasRenderingContext2D prototype with roundRect
import './src/utils/roundRect.js';

import MusicPlayer from './src/MusicPlayer.js';
import Spiral from './src/Spiral.js';

new Spiral();
new MusicPlayer();
