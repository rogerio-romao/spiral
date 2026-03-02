// side-effect import polifill
// oxlint-disable-next-line import/no-unassigned-import
import './src/utils/roundRectExtra.js';

import Spiral from './src/Spiral.js';

const spiral = new Spiral();

globalThis.addEventListener('beforeunload', () => spiral.destroy());
