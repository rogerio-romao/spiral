// side effect import to patch the CanvasRenderingContext2D prototype with roundRect
import './src/utils/roundRect.js';

import AlgorithmLoader from './src/AlgorithmLoader.js';
import MusicPlayer from './src/MusicPlayer.js';
import Spiral from './src/Spiral.js';
import Test from './src/algos/Test.js';
import FrequencyAnalyser from './src/utils/FrequencyAnalyser.js';

const devMode = false;
const devAlgorithmClass = Test;

new Spiral({ devMode, devAlgorithmClass });
new MusicPlayer();

// Wire up the frequency analyser so algorithms can read audio data.
// Uses the same <audio> element that MusicPlayer controls.
const audioElement = document.getElementById('audio');
AlgorithmLoader.frequencyAnalyser = new FrequencyAnalyser(audioElement);
