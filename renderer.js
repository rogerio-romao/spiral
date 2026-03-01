// side-effect import polifill
import './src/utils/roundRectExtra.js';

import Spiral from './src/Spiral.js';

const spiral = new Spiral();

window.addEventListener('beforeunload', () => spiral.destroy());
