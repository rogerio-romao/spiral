// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
'use strict';

// Extend Canvas with rounded rectangles
CanvasRenderingContext2D.prototype.roundRect = function (
    x,
    y,
    width,
    height,
    radius,
    fill,
    stroke
) {
    const cornerRadius = {
        upperLeft: 0,
        upperRight: 0,
        lowerLeft: 0,
        lowerRight: 0
    };
    if (typeof stroke == 'undefined') {
        stroke = true;
    }
    if (typeof radius === 'object') {
        for (let side in radius) {
            cornerRadius[side] = radius[side];
        }
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
        y + height
    );
    this.lineTo(x + cornerRadius.lowerLeft, y + height);
    this.quadraticCurveTo(
        x,
        y + height,
        x,
        y + height - cornerRadius.lowerLeft
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

// Physics and math classes from Youtube channel Coding Math
// Vector class
class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    setPosX(value) {
        this.x = value;
    }
    getX() {
        return this.x;
    }
    setY(value) {
        this.y = value;
    }
    getY() {
        return this.y;
    }
    setAngle(angle) {
        const length = this.getLength();
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }
    getAngle() {
        return Math.atan2(this.y, this.x);
    }
    setLength(length) {
        const angle = this.getAngle();
        this.x = Math.cos(angle) * length;
        this.y = Math.sin(angle) * length;
    }
    getLength() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    add(v2) {
        return new Vector(this.x + v2.getX(), this.y + v2.getY());
    }
    subtract(v2) {
        return new Vector(this.x - v2.getX(), this.y - v2.getY());
    }
    multiply(val) {
        return new Vector(this.x * val, this.y * val);
    }
    divide(val) {
        return new Vector(this.x / val, this.y / val);
    }
    addTo(v2) {
        this.x += v2.getX();
        this.y += v2.getY();
    }
    subtractFrom(v2) {
        this.x -= v2.getX();
        this.y -= v2.getY();
    }
    multiplyBy(val) {
        this.x *= val;
        this.y *= val;
    }
    divideBy(val) {
        this.x /= val;
        this.y /= val;
    }
}

// Particle class
class Particle {
    constructor(x, y, speed, direction, grav = 0) {
        this.x = x;
        this.y = y;
        this.vx = Math.cos(direction) * speed;
        this.vy = Math.sin(direction) * speed;
        this.gravity = grav;
        this.bounce = -1;
        this.friction = 1;
        this.mass = 1;
        this.springs = [];
        this.gravitations = [];
    }
    accelerate(ax, ay) {
        this.vx += ax;
        this.vy += ay;
    }
    addGravitation(p) {
        this.removeGravitation(p); // case it already exists
        this.gravitations.push(p);
    }
    addSpring(point, k, length = 0) {
        this.removeSpring(point); // case it already exists
        this.springs.push({ point, k, length });
    }
    angleTo(p2) {
        return Math.atan2(p2.y - this.y, p2.x - this.x);
    }
    distanceTo(p2) {
        const dx = p2.x - this.x;
        const dy = p2.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
    getHeading() {
        return Math.atan2(this.vy, this.vx);
    }
    getSpeed() {
        return Math.sqrt(this.vx ** 2 + this.vy ** 2);
    }
    gravitateTo(p2) {
        const dx = p2.x - this.x;
        const dy = p2.y - this.y;
        const dSq = dx * dx + dy * dy;
        const dist = Math.sqrt(dSq);
        const force = p2.mass / dSq;
        const ax = (dx / dist) * force;
        const ay = (dy / dist) * force;

        this.vx += ax;
        this.vy += ay;
    }
    handleGravitations() {
        this.gravitations.forEach(gravitation => this.gravitateTo(gravitation));
    }
    handleSprings() {
        this.springs.forEach(spring =>
            this.springTo(spring.point, spring.k, spring.length)
        );
    }
    removeGravitation(p) {
        const gravIndex = this.gravitations.findIndex(g => g === p);
        this.gravitations.splice(gravIndex, 1);
    }
    removeSpring(point) {
        const springIndex = this.springs.findIndex(s => s.point === point);
        this.springs.splice(springIndex, 1);
    }
    setHeading(heading) {
        const speed = this.getSpeed();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
    }
    setSpeed(speed) {
        const heading = this.getHeading();
        this.vx = Math.cos(heading) * speed;
        this.vy = Math.sin(heading) * speed;
    }
    springTo(point, k, length = 0) {
        const dx = point.x - this.x;
        const dy = point.y - this.y;
        const distance = Math.hypot(dx, dy);
        const springForce = (distance - length) * k;
        this.vx += (dx / distance) * springForce;
        this.vy += (dy / distance) * springForce;
    }
    update() {
        this.handleSprings();
        this.handleGravitations();
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
    }
}

// Math utils
const utils = {
    norm(value, min, max) {
        return (value - min) / (max - min);
    },

    lerp(norm, min, max) {
        return (max - min) * norm + min;
    },

    map(value, sourceMin, sourceMax, destMin, destMax) {
        return this.lerp(
            this.norm(value, sourceMin, sourceMax),
            destMin,
            destMax
        );
    },

    clamp(value, min, max) {
        return Math.min(
            Math.max(value, Math.min(min, max)),
            Math.max(min, max)
        );
    },

    distance(p0, p1) {
        const dx = p1.x - p0.x;
        const dy = p1.y - p0.y;
        return Math.sqrt(dx * dx + dy * dy);
    },

    distanceXY(x0, y0, x1, y1) {
        const dx = x1 - x0;
        const dy = y1 - y0;
        return Math.sqrt(dx * dx + dy * dy);
    },

    circleCollision(c0, c1) {
        return this.distance(c0, c1) <= c0.radius + c1.radius;
    },

    circlePointCollision(x, y, circle) {
        return this.distanceXY(x, y, circle.x, circle.y) < circle.radius;
    },

    pointInRect(x, y, rect) {
        return (
            this.inRange(x, rect.x, rect.x + rect.width) &&
            this.inRange(y, rect.y, rect.y + rect.height)
        );
    },

    inRange(value, min, max) {
        return value >= Math.min(min, max) && value <= Math.max(min, max);
    },

    rangeIntersect(min0, max0, min1, max1) {
        return (
            Math.max(min0, max0) >= Math.min(min1, max1) &&
            Math.min(min0, max0) <= Math.max(min1, max1)
        );
    },

    rectIntersect(r0, r1) {
        return (
            this.rangeIntersect(r0.x, r0.x + r0.width, r1.x, r1.x + r1.width) &&
            this.rangeIntersect(r0.y, r0.y + r0.height, r1.y, r1.y + r1.height)
        );
    },

    degreesToRads(degrees) {
        return (degrees / 180) * Math.PI;
    },

    radsToDegrees(radians) {
        return (radians * 180) / Math.PI;
    },

    randomRange(min, max) {
        return min + Math.random() * (max - min);
    },

    randomInt(min, max) {
        return Math.floor(min + Math.random() * (max - min + 1));
    },

    roundToPlaces(value, places) {
        const mult = Math.pow(10, places);
        return Math.round(value * mult) / mult;
    },

    roundNearest(value, nearest) {
        return Math.round(value / nearest) * nearest;
    },

    quadraticBezier(p0, p1, p2, t, pFinal = {}) {
        pFinal.x =
            Math.pow(1 - t, 2) * p0.x + (1 - t) * 2 * t * p1.x + t * t * p2.x;
        pFinal.y =
            Math.pow(1 - t, 2) * p0.y + (1 - t) * 2 * t * p1.y + t * t * p2.y;
        return pFinal;
    },

    cubicBezier(p0, p1, p2, p3, t, pFinal = {}) {
        pFinal.x =
            Math.pow(1 - t, 3) * p0.x +
            Math.pow(1 - t, 2) * 3 * t * p1.x +
            (1 - t) * 3 * t * t * p2.x +
            t * t * t * p3.x;
        pFinal.y =
            Math.pow(1 - t, 3) * p0.y +
            Math.pow(1 - t, 2) * 3 * t * p1.y +
            (1 - t) * 3 * t * t * p2.y +
            t * t * t * p3.y;
        return pFinal;
    }
};

// DOM References
const canvas = document.querySelector('#canvas');
const canvas2 = document.getElementById('canvas2');
const ctx = canvas.getContext('2d');
const ctx2 = canvas2.getContext('2d');
const hud = document.querySelector('#hud');
const msg = document.querySelector('#msg');
const algosDisplay = document.querySelector('#algos');
const help = document.querySelector('#help');

// VARIABLES
// canvas to window size
let w = (canvas.width = canvas2.width = window.innerWidth);
let h = (canvas.height = canvas2.height = window.innerHeight);

// time-frame
let t = 0;
// for the animations
let stagger = 0;
let speed = 5;
// for repeats
let interval;
let regen;
let autoChange = 100;
let manual = false;
// hud messages
let silent = false;
let helpView = false;
let algoTimer;
let msgTimer;

// algorithms list
const ALGOS = [
    'circles',
    'starbursts',
    'square-nebulas',
    'beziers-straight',
    'orbits',
    'rims',
    'nebulas',
    'dysons',
    'discos',
    'neon-tartans',
    'dotted',
    'spiral-lines',
    'camouflage-postits',
    'the-badge',
    'black-white',
    'stained-glass',
    'spiral-text',
    'alphabet-soup',
    'punctuation',
    'acceleration-mandala',
    'evolving-mandala',
    'the-iris',
    'quadrants',
    'alien-flowers',
    'hyper-tunnel',
    'chalk-galaxy',
    'patterns',
    'rotation-patterns',
    'microscope',
    'spinner',
    'space-gears',
    'counter-clock',
    'clock',
    'pseye',
    'nuclear-vortex',
    'acid-stars',
    'vanishing-rays',
    'warp2001',
    'ghostly-creatures',
    'neural-slinky',
    'porthole',
    'plaid',
    'three-d',
    'supernova',
    'organic',
    'ufos',
    'offsets',
    'rounded',
    'spikey',
    'radiance',
    'universe',
    'parallel-universes',
    'atom',
    'geometer',
    'comets',
    'maelstrom',
    'maelstrom2',
    'lollipottery',
    'picnic',
    'behind-bars',
    'shadowy',
    'radio-waves',
    'starship',
    'crystal-tiles',
    'wallpapering',
    'pietri-dish',
    'autumn',
    'polyhedra',
    'perspective',
    'angel-hair',
    'sushi',
    'wormholes',
    'shells',
    'solar',
    'fluor',
    'the-fan',
    'fade-in',
    'ourobouros',
    'epic-rays',
    'abstractions',
    'medusa',
    'chillout',
    'swirls',
    'mirage',
    'majestic',
    'wormhole',
    'irradiate',
    'entropy',
    'tripping',
    'progression',
    'aperture',
    'upholstery',
    'unfocused',
    'matter',
    'seeds',
    'crayon-funnel',
    'big-bangs',
    'nazca',
    'smooth',
    'encoded',
    'concentric',
    'glow',
    'onion',
    'blends',
    'snakes-ladders',
    'cornucopia',
    'cornucopia2',
    'germinate',
    'gas-clouds',
    'networks',
    'spikral',
    'fruits',
    'typobrush',
    'veils',
    'harmonie',
    'portals',
    'sandala',
    'psycho-rainbow',
    'hallucinate',
    'the-hive',
    'boxes',
    'digital-art',
    'thread',
    'helix',
    'slices',
    'records',
    'lisajou',
    'division',
    'blur',
    'trance',
    'triangulate',
    'halfsies',
    'loading',
    'quadratic',
    'hubble',
    'vortrix',
    'vanishing-point',
    'cubist',
    'subwoofer',
    'deep-sea',
    'soapy-bubbles',
    'gridlock',
    'give-n-take',
    'ethereal',
    'glowsticks',
    'mikado',
    'semi-rings',
    'four-dee',
    'spring-orbits',
    'game-of-flies',
    'gravity-turbulence',
    'flares',
    'pulsar',
    'shards',
    'coils',
    'mesmerize',
    'genesis-typewriter',
    'dye',
    'planet-moss',
    'projecting'
];
// stores the last played algorithms
let LAST_ALGOS = [];

// choose a new algorithm that is not on the last x played
function chooseAlgos() {
    let picks = ALGOS.filter(algo => !LAST_ALGOS.includes(algo));
    let choose = picks[random(0, picks.length)];
    LAST_ALGOS.push(choose);
    if (LAST_ALGOS.length > 58) LAST_ALGOS.shift();
    // setup the chosen algorithm
    switch (choose) {
        case 'circles':
            displayAlgos('CIRCLES');
            ctx.save();
            runningAlgo = new Circles();
            runningAlgo.draw();
            break;
        case 'starbursts':
            displayAlgos('STARBURSTS');
            ctx.save();
            runningAlgo = new Starbursts();
            runningAlgo.draw();
            break;
        case 'square-nebulas':
            displayAlgos('SQUARE NEBULAS');
            ctx.save();
            runningAlgo = new SquareNebulas();
            runningAlgo.draw();
            break;
        case 'beziers-straight':
            displayAlgos('STRAIGHT BEZIERS');
            ctx.save();
            runningAlgo = new BeziersStraight();
            runningAlgo.draw();
            break;
        case 'orbits':
            displayAlgos('ORBITS');
            ctx.save();
            runningAlgo = new Orbits();
            runningAlgo.draw();
            break;
        case 'rims':
            displayAlgos('RIMS');
            ctx.save();
            runningAlgo = new Rims();
            runningAlgo.draw();
            break;
        case 'nebulas':
            displayAlgos('NEBULA');
            ctx.save();
            runningAlgo = new Nebulas();
            runningAlgo.draw();
            break;
        case 'dysons':
            displayAlgos('DYSON SPHERES');
            ctx.save();
            runningAlgo = new DysonSpheres();
            runningAlgo.draw();
            break;
        case 'discos':
            displayAlgos('DISCO');
            ctx.save();
            runningAlgo = new Discos();
            runningAlgo.draw();
            break;
        case 'neon-tartans':
            displayAlgos('NEON TARTAN');
            ctx.save();
            runningAlgo = new NeonTartans();
            runningAlgo.draw();
            break;
        case 'dotted':
            displayAlgos('DOTTED');
            ctx.save();
            runningAlgo = new Dotted();
            runningAlgo.draw();
            break;
        case 'spiral-lines':
            displayAlgos('SPIRAL LINES');
            ctx.save();
            runningAlgo = new SpiralLines();
            runningAlgo.draw();
            break;
        case 'camouflage-postits':
            displayAlgos('CAMOUFLAGE POST-ITS');
            ctx.save();
            runningAlgo = new CamouflagePostits();
            runningAlgo.draw();
            break;
        case 'the-badge':
            displayAlgos('THE BADGE');
            ctx.save();
            runningAlgo = new TheBadge();
            runningAlgo.draw();
            break;
        case 'black-white':
            displayAlgos('BLACK & WHITE');
            ctx.save();
            runningAlgo = new BlacknWhite();
            runningAlgo.draw();
            break;
        case 'stained-glass':
            displayAlgos('STAINED GLASS');
            ctx.save();
            runningAlgo = new StainedGlass();
            runningAlgo.draw();
            break;
        case 'spiral-text':
            displayAlgos('SPIRAL TEXT');
            ctx.save();
            runningAlgo = new SpiralText();
            runningAlgo.draw();
            break;
        case 'alphabet-soup':
            displayAlgos('ALPHABET SOUP');
            ctx.save();
            runningAlgo = new AlphabetSoup();
            runningAlgo.draw();
            break;
        case 'punctuation':
            displayAlgos('PUNCTUATION');
            ctx.save();
            runningAlgo = new Punctuation();
            runningAlgo.draw();
            break;
        case 'acceleration-mandala':
            displayAlgos('ACCELERATION MANDALA');
            ctx.save();
            runningAlgo = new AccelerationMandala();
            runningAlgo.draw();
            break;
        case 'evolving-mandala':
            displayAlgos('EVOLVING MANDALA');
            ctx.save();
            runningAlgo = new EvolvingMandala();
            runningAlgo.draw();
            break;
        case 'the-iris':
            displayAlgos('THE IRIS');
            ctx.save();
            runningAlgo = new TheIris();
            runningAlgo.draw();
            break;
        case 'quadrants':
            displayAlgos('QUADRANTS');
            ctx.save();
            runningAlgo = new Quadrants();
            runningAlgo.draw();
            break;
        case 'alien-flowers':
            displayAlgos('ALIEN FLOWERS');
            ctx.save();
            runningAlgo = new AlienFlowers();
            runningAlgo.draw();
            break;
        case 'hyper-tunnel':
            displayAlgos('HYPER TUNNEL');
            ctx.save();
            runningAlgo = new HyperTunnel();
            runningAlgo.draw();
            break;
        case 'chalk-galaxy':
            displayAlgos('CHALK GALAXY');
            ctx.save();
            runningAlgo = new ChalkGalaxy();
            runningAlgo.draw();
            break;
        case 'patterns':
            displayAlgos('PATTERNS');
            ctx.save();
            runningAlgo = new Patterns();
            runningAlgo.draw();
            break;
        case 'rotation-patterns':
            displayAlgos('ROTATION PATTERNS');
            ctx.save();
            runningAlgo = new RotationPatterns();
            runningAlgo.draw();
            break;
        case 'microscope':
            displayAlgos('MICROSCOPE');
            ctx.save();
            runningAlgo = new Microscope();
            runningAlgo.draw();
            break;
        case 'spinner':
            displayAlgos('SPINNER');
            ctx.save();
            runningAlgo = new Spinner();
            runningAlgo.draw();
            break;
        case 'space-gears':
            displayAlgos('SPACE GEARS');
            ctx.save();
            runningAlgo = new SpaceGears();
            runningAlgo.draw();
            break;
        case 'counter-clock':
            displayAlgos('COUNTER CLOCK');
            ctx.save();
            runningAlgo = new CounterClock();
            runningAlgo.draw();
            break;
        case 'clock':
            displayAlgos('CLOCK');
            ctx.save();
            runningAlgo = new Clock();
            runningAlgo.draw();
            break;
        case 'pseye':
            displayAlgos('PSEYE');
            ctx.save();
            runningAlgo = new Pseye();
            runningAlgo.draw();
            break;
        case 'nuclear-vortex':
            displayAlgos('NUCLEAR VORTEX');
            ctx.save();
            runningAlgo = new NuclearVortex();
            runningAlgo.draw();
            break;
        case 'acid-stars':
            displayAlgos('ACID STARS');
            ctx.save();
            runningAlgo = new AcidStars();
            runningAlgo.draw();
            break;
        case 'ghostly-creatures':
            displayAlgos('GHOSTLY CREATURES');
            ctx.save();
            runningAlgo = new GhostlyCreatures();
            runningAlgo.draw();
            break;
        case 'neural-slinky':
            displayAlgos('NEURAL SLINKY');
            ctx.save();
            runningAlgo = new NeuralSlinky();
            runningAlgo.draw();
            break;
        case 'vanishing-rays':
            displayAlgos('VANISHING RAYS');
            ctx.save();
            runningAlgo = new VanishingRays();
            runningAlgo.draw();
            break;
        case 'warp2001':
            displayAlgos('WARP 2001');
            ctx.save();
            runningAlgo = new Warp2001();
            runningAlgo.draw();
            break;
        case 'porthole':
            displayAlgos('PORTHOLE');
            ctx.save();
            runningAlgo = new Porthole();
            runningAlgo.draw();
            break;
        case 'plaid':
            displayAlgos('PLAID');
            ctx.save();
            runningAlgo = new Plaid();
            runningAlgo.draw();
            break;
        case 'three-d':
            displayAlgos('THREE D');
            ctx.save();
            runningAlgo = new ThreeD();
            runningAlgo.draw();
            break;
        case 'supernova':
            displayAlgos('SUPERNOVA');
            ctx.save();
            runningAlgo = new Supernova();
            runningAlgo.draw();
            break;
        case 'organic':
            displayAlgos('ORGANIC');
            ctx.save();
            runningAlgo = new Organic();
            runningAlgo.draw();
            break;
        case 'ufos':
            displayAlgos('UFOs');
            ctx.save();
            runningAlgo = new UFOs();
            runningAlgo.draw();
            break;
        case 'offsets':
            displayAlgos('OFFSETS');
            ctx.save();
            runningAlgo = new Offsets();
            runningAlgo.draw();
            break;
        case 'rounded':
            displayAlgos('ROUNDED');
            ctx.save();
            runningAlgo = new Rounded();
            runningAlgo.draw();
            break;
        case 'spikey':
            displayAlgos('SPIKEY');
            ctx.save();
            runningAlgo = new Spikey();
            runningAlgo.draw();
            break;
        case 'radiance':
            displayAlgos('RADIANCE');
            ctx.save();
            runningAlgo = new Radiance();
            runningAlgo.draw();
            break;
        case 'universe':
            displayAlgos('UNIVERSE');
            ctx.save();
            runningAlgo = new Universe();
            runningAlgo.draw();
            break;
        case 'parallel-universes':
            displayAlgos('PARALLEL UNIVERSES');
            ctx.save();
            runningAlgo = new ParallelUniverses();
            runningAlgo.draw();
            break;
        case 'atom':
            displayAlgos('ATOM');
            ctx.save();
            runningAlgo = new Atom();
            runningAlgo.draw();
            break;
        case 'geometer':
            displayAlgos('GEOMETER');
            ctx.save();
            runningAlgo = new Geometer();
            runningAlgo.draw();
            break;
        case 'comets':
            displayAlgos('COMETS');
            ctx.save();
            runningAlgo = new Comets();
            runningAlgo.draw();
            break;
        case 'maelstrom':
            displayAlgos('MAELSTROM');
            ctx.save();
            runningAlgo = new Maelstrom();
            runningAlgo.draw();
            break;
        case 'maelstrom2':
            displayAlgos('MAELSTROM 2');
            ctx.save();
            runningAlgo = new Maelstrom2();
            runningAlgo.draw();
            break;
        case 'lollipottery':
            displayAlgos('LOLLIPOTTERY');
            ctx.save();
            runningAlgo = new Lollipottery();
            runningAlgo.draw();
            break;
        case 'picnic':
            displayAlgos('PICNIC');
            ctx.save();
            runningAlgo = new Picnic();
            runningAlgo.draw();
            break;
        case 'behind-bars':
            displayAlgos('BEHIND BARS');
            ctx.save();
            runningAlgo = new BehindBars();
            runningAlgo.draw();
            break;
        case 'shadowy':
            displayAlgos('SHADOWY');
            ctx.save();
            runningAlgo = new Shadowy();
            runningAlgo.draw();
            break;
        case 'radio-waves':
            displayAlgos('RADIO WAVES');
            ctx.save();
            runningAlgo = new RadioWaves();
            runningAlgo.draw();
            break;
        case 'starship':
            displayAlgos('STARSHIP');
            ctx.save();
            runningAlgo = new Starship();
            runningAlgo.draw();
            break;
        case 'crystal-tiles':
            displayAlgos('CRYSTAL TILES');
            ctx.save();
            runningAlgo = new CrystalTiles();
            runningAlgo.draw();
            break;
        case 'wallpapering':
            displayAlgos('WALLPAPERING');
            ctx.save();
            runningAlgo = new Wallpapering();
            runningAlgo.draw();
            break;
        case 'pietri-dish':
            displayAlgos('PIETRI DISH');
            ctx.save();
            runningAlgo = new PietriDish();
            runningAlgo.draw();
            break;
        case 'autumn':
            displayAlgos('AUTUMN');
            ctx.save();
            runningAlgo = new Autumn();
            runningAlgo.draw();
            break;
        case 'polyhedra':
            displayAlgos('POLYHEDRA');
            ctx.save();
            runningAlgo = new Polyhedra();
            runningAlgo.draw();
            break;
        case 'perspective':
            displayAlgos('PERSPECTIVE');
            ctx.save();
            runningAlgo = new Perspective();
            runningAlgo.draw();
            break;
        case 'angel-hair':
            displayAlgos('ANGEL HAIR');
            ctx.save();
            runningAlgo = new AngelHair();
            runningAlgo.draw();
            break;
        case 'sushi':
            displayAlgos('SUSHI');
            ctx.save();
            runningAlgo = new Sushi();
            runningAlgo.draw();
            break;
        case 'wormholes':
            displayAlgos('WORMHOLES');
            ctx.save();
            runningAlgo = new Wormholes();
            runningAlgo.draw();
            break;
        case 'shells':
            displayAlgos('SHELLS');
            ctx.save();
            runningAlgo = new Shells();
            runningAlgo.draw();
            break;
        case 'solar':
            displayAlgos('SOLAR');
            ctx.save();
            runningAlgo = new Solar();
            runningAlgo.draw();
            break;
        case 'fluor':
            displayAlgos('FLUOR');
            ctx.save();
            runningAlgo = new Fluor();
            runningAlgo.draw();
            break;
        case 'the-fan':
            displayAlgos('THE FAN');
            ctx.save();
            runningAlgo = new TheFan();
            runningAlgo.draw();
            break;
        case 'fade-in':
            displayAlgos('FADE IN');
            ctx.save();
            runningAlgo = new FadeIn();
            runningAlgo.draw();
            break;
        case 'ourobouros':
            displayAlgos('OUROBOUROS');
            ctx.save();
            runningAlgo = new Ourobouros();
            runningAlgo.draw();
            break;
        case 'epic-rays':
            displayAlgos('EPIC RAYS');
            ctx.save();
            runningAlgo = new EpicRays();
            runningAlgo.draw();
            break;
        case 'abstractions':
            displayAlgos('ABSTRACTIONS');
            ctx.save();
            runningAlgo = new Abstractions();
            runningAlgo.draw();
            break;
        case 'medusa':
            displayAlgos('MEDUSA');
            ctx.save();
            runningAlgo = new Medusa();
            runningAlgo.draw();
            break;
        case 'chillout':
            displayAlgos('CHILL OUT');
            ctx.save();
            runningAlgo = new Chillout();
            runningAlgo.draw();
            break;
        case 'swirls':
            displayAlgos('SWIRLS');
            ctx.save();
            runningAlgo = new Swirls();
            runningAlgo.draw();
            break;
        case 'mirage':
            displayAlgos('MIRAGE');
            ctx.save();
            runningAlgo = new Mirage();
            runningAlgo.draw();
            break;
        case 'majestic':
            displayAlgos('MAJESTIC');
            ctx.save();
            runningAlgo = new Majestic();
            runningAlgo.draw();
            break;
        case 'wormhole':
            displayAlgos('WORMHOLE');
            ctx.save();
            runningAlgo = new Wormhole();
            runningAlgo.draw();
            break;
        case 'irradiate':
            displayAlgos('IRRADIATE');
            ctx.save();
            runningAlgo = new Irradiate();
            runningAlgo.draw();
            break;
        case 'entropy':
            displayAlgos('ENTROPY');
            ctx.save();
            runningAlgo = new Entropy();
            runningAlgo.draw();
            break;
        case 'tripping':
            displayAlgos('TRIPPING');
            ctx.save();
            runningAlgo = new Tripping();
            runningAlgo.draw();
            break;
        case 'progression':
            displayAlgos('PROGRESSION');
            ctx.save();
            runningAlgo = new Progression();
            runningAlgo.draw();
            break;
        case 'aperture':
            displayAlgos('APERTURE');
            ctx.save();
            runningAlgo = new Aperture();
            runningAlgo.draw();
            break;
        case 'upholstery':
            displayAlgos('UPHOLSTERY');
            ctx.save();
            runningAlgo = new Upholstery();
            runningAlgo.draw();
            break;
        case 'unfocused':
            displayAlgos('UNFOCUSED');
            ctx.save();
            runningAlgo = new Unfocused();
            runningAlgo.draw();
            break;
        case 'matter':
            displayAlgos('MATTER');
            ctx.save();
            runningAlgo = new Matter();
            runningAlgo.draw();
            break;
        case 'seeds':
            displayAlgos('SEEDS');
            ctx.save();
            runningAlgo = new Seeds();
            runningAlgo.draw();
            break;
        case 'crayon-funnel':
            displayAlgos('CRAYON FUNNEL');
            ctx.save();
            runningAlgo = new CrayonFunnel();
            runningAlgo.draw();
            break;
        case 'big-bangs':
            displayAlgos('BIG BANGS');
            ctx.save();
            runningAlgo = new BigBangs();
            runningAlgo.draw();
            break;
        case 'nazca':
            displayAlgos('NAZCA');
            ctx.save();
            runningAlgo = new Nazca();
            runningAlgo.draw();
            break;
        case 'smooth':
            displayAlgos('SMOOTH');
            ctx.save();
            runningAlgo = new Smooth();
            runningAlgo.draw();
            break;
        case 'encoded':
            displayAlgos('ENCODED');
            ctx.save();
            runningAlgo = new Encoded();
            runningAlgo.draw();
            break;
        case 'concentric':
            displayAlgos('CONCENTRIC');
            ctx.save();
            runningAlgo = new Concentric();
            runningAlgo.draw();
            break;
        case 'glow':
            displayAlgos('GLOW');
            ctx.save();
            runningAlgo = new Glow();
            runningAlgo.draw();
            break;
        case 'onion':
            displayAlgos('ONION');
            ctx.save();
            runningAlgo = new Onion();
            runningAlgo.draw();
            break;
        case 'blends':
            displayAlgos('BLENDS');
            ctx.save();
            runningAlgo = new Blends();
            runningAlgo.draw();
            break;
        case 'snakes-ladders':
            displayAlgos("SNAKES 'N LADDERS");
            ctx.save();
            runningAlgo = new SnakesLadders();
            runningAlgo.draw();
            break;
        case 'cornucopia':
            displayAlgos('CORNUCOPIA');
            ctx.save();
            runningAlgo = new Cornucopia();
            runningAlgo.draw();
            break;
        case 'cornucopia2':
            displayAlgos('CORNUCOPIA 2');
            ctx.save();
            runningAlgo = new Cornucopia2();
            runningAlgo.draw();
            break;
        case 'germinate':
            displayAlgos('GERMINATE');
            ctx.save();
            runningAlgo = new Germinate();
            runningAlgo.draw();
            break;
        case 'gas-clouds':
            displayAlgos('GAS CLOUDS');
            ctx.save();
            runningAlgo = new GasClouds();
            runningAlgo.draw();
            break;
        case 'networks':
            displayAlgos('NETWORKS');
            ctx.save();
            runningAlgo = new Networks();
            runningAlgo.draw();
            break;
        case 'spikral':
            displayAlgos('SPIKRAL');
            ctx.save();
            runningAlgo = new Spikral();
            runningAlgo.draw();
            break;
        case 'fruits':
            displayAlgos('FRUITS');
            ctx.save();
            runningAlgo = new Fruits();
            runningAlgo.draw();
            break;
        case 'typobrush':
            displayAlgos('TYPOBRUSH');
            ctx.save();
            runningAlgo = new Typobrush();
            runningAlgo.draw();
            break;
        case 'veils':
            displayAlgos('VEILS');
            ctx.save();
            runningAlgo = new Veils();
            runningAlgo.draw();
            break;
        case 'harmonie':
            displayAlgos('HARMONIE');
            ctx.save();
            runningAlgo = new Harmonie();
            runningAlgo.draw();
            break;
        case 'portals':
            displayAlgos('PORTALS');
            ctx.save();
            runningAlgo = new Portals();
            runningAlgo.draw();
            break;
        case 'sandala':
            displayAlgos('SANDALA');
            ctx.save();
            runningAlgo = new Sandala();
            runningAlgo.draw();
            break;
        case 'psycho-rainbow':
            displayAlgos('PSYCHO RAINBOW');
            ctx.save();
            runningAlgo = new PsychoRainbow();
            runningAlgo.draw();
            break;
        case 'hallucinate':
            displayAlgos('HALLUCINATE');
            ctx.save();
            runningAlgo = new Hallucinate();
            runningAlgo.draw();
            break;
        case 'the-hive':
            displayAlgos('THE HIVE');
            ctx.save();
            runningAlgo = new Hive();
            runningAlgo.draw();
            break;
        case 'boxes':
            displayAlgos('BOXES');
            ctx.save();
            runningAlgo = new Boxes();
            runningAlgo.draw();
            break;
        case 'digital-art':
            displayAlgos('DIGITAL ART');
            ctx.save();
            runningAlgo = new DigitalArt();
            runningAlgo.draw();
            break;
        case 'thread':
            displayAlgos('THREAD');
            ctx.save();
            runningAlgo = new Thread();
            runningAlgo.draw();
            break;
        case 'helix':
            displayAlgos('HELIX');
            ctx.save();
            runningAlgo = new Helix();
            runningAlgo.draw();
            break;
        case 'slices':
            displayAlgos('SLICES');
            ctx.save();
            runningAlgo = new Slices();
            runningAlgo.draw();
            break;
        case 'records':
            displayAlgos('RECORDS');
            ctx.save();
            runningAlgo = new Records();
            runningAlgo.draw();
            break;
        case 'lisajou':
            displayAlgos('LISA JOU');
            ctx.save();
            runningAlgo = new LisaJou();
            runningAlgo.draw();
            break;
        case 'division':
            displayAlgos('DIVISION');
            ctx.save();
            runningAlgo = new Division();
            runningAlgo.draw();
            break;
        case 'blur':
            displayAlgos('BLUR');
            ctx.save();
            runningAlgo = new Blur();
            runningAlgo.draw();
            break;
        case 'trance':
            displayAlgos('TRANCE');
            ctx.save();
            runningAlgo = new Trance();
            runningAlgo.draw();
            break;
        case 'triangulate':
            displayAlgos('TRIANGULATE');
            ctx.save();
            runningAlgo = new Triangulate();
            runningAlgo.draw();
            break;
        case 'halfsies':
            displayAlgos('HALFSIES');
            ctx.save();
            runningAlgo = new Halfsies();
            runningAlgo.draw();
            break;
        case 'loading':
            displayAlgos('LOADING');
            ctx.save();
            runningAlgo = new Loading();
            runningAlgo.draw();
            break;
        case 'quadratic':
            displayAlgos('QUADRATIC');
            ctx.save();
            runningAlgo = new Quadratic();
            runningAlgo.draw();
            break;
        case 'hubble':
            displayAlgos('HUBBLE');
            ctx.save();
            runningAlgo = new Hubble();
            runningAlgo.draw();
            break;
        case 'vortrix':
            displayAlgos('VORTRIX');
            ctx.save();
            runningAlgo = new Vortrix();
            runningAlgo.draw();
            break;
        case 'vanishing-point':
            displayAlgos('VANISHING POINT');
            ctx.save();
            runningAlgo = new VanishingPoint();
            runningAlgo.draw();
            break;
        case 'cubist':
            displayAlgos('CUBIST');
            ctx.save();
            runningAlgo = new Cubist();
            runningAlgo.draw();
            break;
        case 'subwoofer':
            displayAlgos('SUBWOOFER');
            ctx.save();
            runningAlgo = new Subwoofer();
            runningAlgo.draw();
            break;
        case 'deep-sea':
            displayAlgos('DEEP SEA');
            ctx.save();
            runningAlgo = new DeepSea();
            runningAlgo.draw();
            break;
        case 'soapy-bubbles':
            displayAlgos('SOAPY BUBBLES');
            ctx.save();
            runningAlgo = new SoapyBubbles();
            runningAlgo.draw();
            break;
        case 'gridlock':
            displayAlgos('GRIDLOCK');
            ctx.save();
            runningAlgo = new Gridlock();
            runningAlgo.draw();
            break;
        case 'give-n-take':
            displayAlgos("GIVE 'N TAKE");
            ctx.save();
            runningAlgo = new GiveNTake();
            runningAlgo.draw();
            break;
        case 'ethereal':
            displayAlgos('ETHEREAL');
            ctx.save();
            runningAlgo = new Ethereal();
            runningAlgo.draw();
            break;
        case 'glowsticks':
            displayAlgos('GLOWSTICKS');
            ctx.save();
            runningAlgo = new Glowsticks();
            runningAlgo.draw();
            break;
        case 'mikado':
            displayAlgos('MIKADO');
            ctx.save();
            runningAlgo = new Mikado();
            runningAlgo.draw();
            break;
        case 'semi-rings':
            displayAlgos('SEMI RINGS');
            ctx.save();
            runningAlgo = new SemiRings();
            runningAlgo.draw();
            break;
        case 'four-dee':
            displayAlgos('FOUR DEE');
            ctx.save();
            runningAlgo = new FourDee();
            runningAlgo.draw();
            break;
        case 'spring-orbits':
            displayAlgos('SPRING ORBITS');
            ctx.save();
            runningAlgo = new SpringOrbits();
            runningAlgo.draw();
            break;
        case 'game-of-flies':
            displayAlgos('GAME OF FLIES');
            ctx.save();
            runningAlgo = new GameOfFlies();
            runningAlgo.draw();
            break;
        case 'gravity-turbulence':
            displayAlgos('GRAVITY TURBULENCE');
            ctx.save();
            runningAlgo = new GravityTurbulence();
            runningAlgo.draw();
            break;
        case 'flares':
            displayAlgos('FLARES');
            ctx.save();
            runningAlgo = new Flares();
            runningAlgo.draw();
            break;
        case 'pulsar':
            displayAlgos('PULSAR');
            ctx.save();
            runningAlgo = new Pulsar();
            runningAlgo.draw();
            break;
        case 'shards':
            displayAlgos('SHARDS');
            ctx.save();
            runningAlgo = new Shards();
            runningAlgo.draw();
            break;
        case 'coils':
            displayAlgos('COILS');
            ctx.save();
            runningAlgo = new Coils();
            runningAlgo.draw();
            break;
        case 'mesmerize':
            displayAlgos('MESMERIZE');
            ctx.save();
            runningAlgo = new Mesmerize();
            runningAlgo.draw();
            break;
        case 'genesis-typewriter':
            displayAlgos('GENESIS TYPEWRITER');
            ctx.save();
            runningAlgo = new GenesisTypewriter();
            runningAlgo.draw();
            break;
        case 'dye':
            displayAlgos('DYE');
            ctx.save();
            runningAlgo = new Dye();
            runningAlgo.draw();
            break;
        case 'planet-moss':
            displayAlgos('PLANET MOSS');
            ctx.save();
            runningAlgo = new PlanetMoss();
            runningAlgo.draw();
            break;
        case 'projecting':
            displayAlgos('PROJECTING');
            ctx.save();
            runningAlgo = new Projecting();
            runningAlgo.draw();
            break;
    }
}

// ALGORITHMS / SPIRALS CLASSES

class Circles {
    constructor() {
        this.rot1 = random(1, 6);
        this.rot2 = random(1, 6);
        this.rot3 = random(1, 6);
        this.radius = random(10, h);
        this.radiusInc = random(12, 120);
        this.startAngle = random(0, 100);
        this.endAngle = random(101, 360);
        this.startRand = random(1, 90);
        this.length = random(50, Math.min(w, h) / 1.5);

        ctx.strokeStyle = randomColor(5, 255, 0.2, 0.2);
        ctx.fillStyle = randomColor(5, 255, 0.5, 0.5);
        ctx.fillRect(0, 0, w, h);
        speed *= 4;

        this.draw = () => {
            if (t % speed === 0) {
                stagger = stagger % 4;
                if (stagger === 0) {
                    ctx.translate(w / 2, h / 2);
                    ctx.rotate(random(this.rot2));
                    ctx.translate(-w / 2, -h / 2);
                    this.radiusInc = random(4, 99);
                    ctx.arc(
                        w / 2,
                        h / 2,
                        this.radius,
                        this.startAngle,
                        this.endAngle / 4
                    );
                }
                if (stagger === 1) {
                    ctx.beginPath();
                    ctx.arc(
                        w / 2,
                        h / 2,
                        this.radius,
                        this.endAngle / 4,
                        this.endAngle / 2
                    );
                }
                if (stagger === 2) {
                    ctx.arc(
                        w / 2,
                        h / 2,
                        this.radius,
                        this.endAngle / 2,
                        this.endAngle * 0.75
                    );
                    ctx.fill();
                    ctx.closePath();
                    ctx.beginPath();
                    if (stagger === 3) {
                        ctx.arc(
                            w / 2,
                            h / 2,
                            this.radius,
                            this.endAngle * 0.75,
                            this.endAngle
                        );
                    }
                }
                this.radius += this.radiusInc;
                if (this.radius > Math.min(w, h)) {
                    this.radius = random(1, this.radius / 2);
                    this.radiusInc = random(4, 100);
                    ctx.translate(w / 2, h / 2);
                    ctx.rotate(this.rot2);
                    ctx.translate(-w / 2, -h / 2);
                }
                this.startAngle += this.startRand;
                if (this.startAngle > 720) {
                    this.startAngle = -this.startAngle;
                    ctx.translate(w / 2, h / 2);
                    ctx.rotate(this.rot1);
                    ctx.translate(-w / 2, -h / 2);
                }
            }
            ctx.stroke();
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rot3);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 30) === 0) {
                ctx.closePath();
                ctx.fillStyle = randomColor(5, 255, 0.5, 0.5);
                ctx.arc(
                    w / 2,
                    h / 2,
                    this.length,
                    random(0, 100),
                    random(100, 360)
                );
                ctx.fill();
                ctx.beginPath();
                ctx.strokeStyle = randomColor(5, 255, 0.2, 0.2);
                ctx.translate(w / 2, h / 2);
                ctx.rotate(random(0, 3) * Math.PI);
                ctx.translate(-w / 2, -h / 2);
                this.rot3 = random(1, 11);
                this.rot1 = random(2, 5);
                this.rot2 = random(45, 359);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Starbursts {
    constructor() {
        this.length = random(50, Math.min(w, h) / 1.5);
        this.maxLength = this.length;
        this.gap = random(4, 120);
        this.maxGap = this.gap;
        this.startAngle = random(0, 100);
        this.endAngle = random(101, 360);
        this.rot1 = random(1, 6);

        ctx.fillStyle = randomColor(5, 255, 0.1, 0.1);
        ctx.strokeStyle = randomColor(5, 255, 0.8, 0.8);

        this.draw = () => {
            if (t % speed === 0) {
                stagger = stagger % 3;
                if (stagger === 0) {
                    ctx.arc(
                        w / 2,
                        h / 2 - this.length,
                        this.maxGap / 2,
                        this.startAngle,
                        this.endAngle
                    );
                }
                if (stagger === 1) {
                    ctx.lineTo(w / 2 + this.length, h / 2 - this.length);
                }
                if (stagger === 2) {
                    ctx.beginPath();
                    ctx.arc(
                        w / 2 + this.length,
                        h / 2 - 2 * this.length,
                        this.maxGap,
                        this.startAngle,
                        this.endAngle
                    );
                    ctx.fill();
                }
                ctx.stroke();
                this.length -= this.gap;
                if (this.length < -this.maxLength) {
                    this.length = random(7, 100);
                    this.maxLength = 2 * this.length;
                    this.gap = random(2, 30);
                    this.maxGap = 2 * this.gap;
                }
                ctx.translate(w / 2, h / 2);
                ctx.rotate(this.rot1);
                ctx.translate(-w / 2, -h / 2);
                stagger++;
            }
            t++;
            if (t % (speed * 420) === 0) {
                ctx.closePath();
                ctx.beginPath();
                ctx.strokeStyle = randomColor(5, 255, 0.8, 0.8);
                ctx.fillStyle = randomColor(5, 255, 0.1, 0.1);
                if (Math.random() < 0.15) ctx.fillStyle = 'rgb(0,0,0)';
                ctx.translate(w / 2, h / 2);
                ctx.rotate(Math.random() * Math.PI);
                ctx.translate(-w / 2, -h / 2);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class SquareNebulas {
    constructor() {
        this.length = random(50, Math.min(w, h) / 1.5);
        this.maxLength = this.length;
        this.gap = random(4, 100);

        ctx.fillStyle = randomColor(5, 255, 0.025, 0.025);
        ctx.strokeStyle = randomColor(5, 255, 0.8, 0.8);

        this.draw = () => {
            if (t % speed === 0) {
                stagger = stagger % 3;

                if (stagger === 0) {
                    ctx.beginPath();
                    ctx.moveTo(w / 2, h / 2);
                    ctx.fillRect(
                        random(0, w),
                        random(0, h),
                        this.length,
                        this.length
                    );
                    ctx.stroke();
                    ctx.closePath();
                }
                if (stagger === 1) {
                    ctx.strokeRect(
                        w / 2,
                        h / 2,
                        this.length / 2,
                        this.length / 2
                    );
                    ctx.stroke();
                    ctx.closePath();
                }
                if (stagger === 2) {
                    ctx.fillRect(
                        random(w / 2, w / 2 + this.length),
                        random(h / 2, h / 2 + this.length),
                        this.length / 8,
                        this.length / 8
                    );
                    ctx.fill();
                    ctx.closePath();
                    ctx.translate(w / 2, h / 2);
                    ctx.rotate(Math.random() * Math.PI);
                    ctx.translate(-w / 2, -h / 2);
                }
                ctx.moveTo(w / 2, h / 2);
                this.length -= this.gap;
                if (this.length < -this.maxLength) {
                    this.length = random(this.maxLength / 2, w / 3);
                    this.maxLength = 2 * this.length;
                    this.gap = random(2, 100);
                }
                ctx.translate(w / 2, h / 2);
                ctx.rotate(Math.random() * Math.PI);
                ctx.translate(-w / 2, -h / 2);
                stagger++;
            }
            t++;
            if (t % (speed * 300) === 0) {
                ctx.closePath();
                ctx.beginPath();
                ctx.strokeStyle = randomColor(5, 255, 0.8, 0.8);
                ctx.fillStyle = randomColor(5, 255, 0.025, 0.025);
                ctx.translate(w / 2, h / 2);
                ctx.rotate(Math.random() * Math.PI);
                ctx.translate(-w / 2, -h / 2);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class BeziersStraight {
    constructor() {
        this.x = random(0, w);
        this.y = random(0, w);
        this.cp1X = random(0, w);
        this.cp1Y = random(0, w);
        this.cp2X = random(0, w);
        this.cp2Y = random(0, w);
        this.rot = random(1, 21);

        ctx.strokeStyle = randomColor(5, 255, 0.2, 0.2);

        this.draw = () => {
            if (t % speed === 0) {
                stagger = stagger % 3;
                if (stagger === 0) {
                    ctx.bezierCurveTo(
                        this.cp1X,
                        this.cp1Y,
                        this.cp2X,
                        this.cp2Y,
                        this.x,
                        this.y
                    );
                    ctx.stroke();
                }
                if (stagger === 1) {
                    ctx.moveTo(w / 2, h / 2);
                    ctx.bezierCurveTo(
                        this.cp2X,
                        this.cp2Y,
                        this.cp1X,
                        this.cp1Y,
                        this.x,
                        this.y
                    );
                    ctx.stroke();
                }
                if (stagger === 2) {
                    ctx.moveTo(w / 2, h / 2);
                    ctx.bezierCurveTo(
                        this.cp2Y,
                        this.cp1X,
                        this.cp1Y,
                        this.cp2X,
                        this.y,
                        this.x
                    );
                    ctx.stroke();

                    ctx.translate(w / 2, h / 2);
                    ctx.rotate(this.rot);
                    ctx.translate(-w / 2, -h / 2);
                }
                stagger++;
            }
            t++;
            if (t % (speed * 280) === 0) {
                ctx.closePath();
                ctx.beginPath();
                ctx.strokeStyle = randomColor(5, 255, 0.2, 0.2);
                ctx.translate(w / 2, h / 2);
                ctx.rotate(random(0, 3) * Math.PI);
                ctx.translate(-w / 2, -h / 2);
                this.cp2Y = random(0, h);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Orbits {
    constructor() {
        this.radius = random(30, h);
        this.radius2 = random(10, this.radius);
        this.rot1 = random(1, 6);
        this.startAngle = random(0, 100);
        this.endAngle = random(101, 360);

        ctx.strokeStyle = randomColor(5, 255, 0.2, 0.2);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.ellipse(
                    w / 2,
                    h / 2,
                    this.radius,
                    this.radius2,
                    this.rot1,
                    this.startAngle,
                    this.endAngle
                );
            }
            ctx.stroke();
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rot1);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 150) === 0) {
                ctx.beginPath();
                ctx.strokeStyle = randomColor(5, 255, 0.2, 0.2);
                this.radius = random(30, h);
                this.radius2 = random(10, this.radius);
                this.startAngle = random(0, 50);
                this.rot1 = random(-3, 3);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Rims {
    constructor() {
        this.radius = random(30, h);
        this.radius2 = random(10, this.radius);
        this.rot1 = random(1, 6);
        this.startAngle = random(0, 100);
        this.endAngle = random(101, 360);
        this.gap = random(4, 100);

        ctx.fillStyle = randomColor(5, 255, 0.01, 0.01);
        ctx.strokeStyle = ' black';

        this.draw = () => {
            if (t % speed === 0) {
                stagger = stagger % 3;
                if (stagger === 0) {
                    ctx.ellipse(
                        w / 2,
                        h / 2,
                        this.radius,
                        this.radius2,
                        this.rot1,
                        this.startAngle,
                        this.endAngle
                    );
                }
                if (stagger === 1) {
                    ctx.ellipse(
                        w / 2,
                        h / 2,
                        this.radius2,
                        this.radius,
                        this.rot1,
                        this.startAngle + this.gap,
                        this.endAngle + this.gap
                    );
                }
                if (stagger === 2) {
                    ctx.ellipse(
                        this.startAngle + this.gap,
                        this.endAngle + this.gap,
                        this.radius,
                        this.radius2,
                        -this.rot1,
                        w / 2,
                        h / 2
                    );
                }
            }
            ctx.fill();
            ctx.stroke();
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rot1);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 150) === 0) {
                ctx.beginPath();
                ctx.fillStyle = randomColor(5, 255, 0.01, 0.01);
                this.radius = random(10, w);
                this.radius2 = random(10, h);
                this.startAngle = random(0, 50);
                this.endAngle = random(51, 360);
                this.gap = random(2, w / 4);
                speed = random(1, 10);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Nebulas {
    constructor() {
        this.length = random(50, Math.min(w, h) / 1.5);
        this.gap = random(4, 100);
        this.rotate = random(3, 160);

        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(255,255,255,0.7)';
        ctx.shadowOffsetX = 5;
        ctx.shadowOffsetY = 5;
        ctx.fillStyle = ctx.strokeStyle = randomColor(5, 255, 0.02, 0.02);

        this.draw = () => {
            ctx.lineWidth = random(1, 200);
            if (t % speed === 0) {
                ctx.strokeRect(w / 2, h / 2, this.length, this.gap);
                ctx.translate(w / 2, h / 2);
                ctx.rotate(this.rotate);
                ctx.translate(-w / 2, -h / 2);
                this.length = random(10, Math.max(w, h));
                this.gap += random(2, 10);
                if (this.gap > 1000) this.gap = 1;
                this.rotate = random(3, 160);
            }
            t++;
            if (t % (speed * 10) === 0) {
                ctx.fillRect(random(0, w), random(0, h), this.gap, this.gap);
            }
            if (t % (speed * 70) === 0) {
                this.rotate = -this.rotate;
                ctx.fillStyle = ctx.strokeStyle = randomColor(
                    5,
                    255,
                    0.02,
                    0.02
                );
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class DysonSpheres {
    constructor() {
        this.length = random(60, Math.max(h / 2, h - 60));
        this.height = random(20, h / 2 - 40);
        this.rot1 = random(1, 6);

        ctx.shadowBlur = 11;
        ctx.shadowOffsetX = 1;
        ctx.shadowOffsetY = 1;
        ctx.shadowColor = ctx.strokeStyle = randomColor(5, 255, 0.33, 0.33);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.ellipse(
                    w / 2,
                    h / 2,
                    this.length,
                    this.height,
                    this.rot1,
                    0,
                    0
                );
                ctx.stroke();
            }
            t++;
            if (t % (speed * 170) === 0) {
                ctx.beginPath();
                let color = Math.random();
                if (color < 0.2) {
                    ctx.shadowBlur = 1;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowColor = ctx.strokeStyle = 'black';
                } else if (color < 0.4) {
                    ctx.shadowBlur = 1;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;
                    ctx.shadowColor = ctx.strokeStyle = 'white';
                } else {
                    ctx.shadowBlur = 11;
                    ctx.shadowColor = ctx.strokeStyle = randomColor(
                        5,
                        255,
                        0.33,
                        0.33
                    );
                }
                this.length = random(60, Math.max(h / 2, h - 60));
                this.height = random(20, h / 2 - 40);
            }
            this.rot1 = random(0, 360);
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Discos {
    constructor() {
        this.color1 = randomColor(5, 255, 0.5, 0.5);
        this.color2 = randomColor(5, 255, 0.5, 0.5);
        this.startAngle = random(0, 100);
        this.endAngle = (180 * Math.PI) / 180;
        this.radius = random(10, h);
        this.anti = false;

        ctx.fillStyle = this.color1;

        this.draw = () => {
            if (t % speed === 0) {
                stagger = stagger % 3;
                if (stagger === 0) {
                    ctx.moveTo(w / 2, h / 2);
                    ctx.beginPath();
                    ctx.strokeStyle = this.color1;
                    ctx.lineWidth = random(0, 100);
                    ctx.arc(
                        w / 2,
                        h / 2,
                        this.radius,
                        this.startAngle,
                        this.endAngle,
                        this.anti
                    );
                    ctx.stroke();
                }
                if (stagger === 1) {
                    ctx.beginPath();
                    ctx.strokeStyle = this.color2;
                    this.anti = !this.anti;
                    this.radius = random(0, h);
                    ctx.arc(
                        w / 2,
                        h / 2,
                        this.radius,
                        this.startAngle,
                        this.endAngle,
                        this.anti
                    );
                    ctx.stroke();
                }
                if (stagger === 2) {
                    ctx.beginPath();
                    this.radius = random(0, h);
                    ctx.fillRect(w / 2, h / 2, w, 2);
                    ctx.stroke();
                }
                ctx.closePath();
                stagger++;
            }
            t++;
            if (t % (speed * 40) === 0) {
                ctx.translate(w / 2, h / 2);
                ctx.rotate((30 * Math.PI) / 180);
                ctx.translate(-w / 2, -h / 2);
            }
            if (t % (speed * 200) === 0) {
                this.color1 = ctx.fillStyle = randomColor(5, 255, 0.5, 0.5);
                this.color2 = randomColor(5, 255, 0.5, 0.5);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class NeonTartans {
    constructor() {
        this.lineX = random(0, h);
        this.lineY = random(0, w);
        this.length = random(50, Math.min(w, h) / 1.5);
        this.color1 = randomColor();
        this.color2 = randomColor();

        this.draw = () => {
            if (t % speed === 0) {
                stagger = stagger % 3;

                if (stagger === 0) {
                    ctx.beginPath();
                    ctx.moveTo(0, this.lineX);
                    ctx.lineTo(w, this.lineX);
                    ctx.shadowBlur = 5;
                    ctx.shadowColor = ctx.strokeStyle = this.color1;
                    ctx.stroke();
                }
                if (stagger === 1) {
                    ctx.beginPath();
                    ctx.moveTo(this.lineY, 0);
                    ctx.lineTo(this.lineY, h);
                    ctx.shadowBlur = 0;
                    ctx.shadowColor = ctx.strokeStyle = this.color2;
                    ctx.stroke();
                }
                if (stagger === 2) {
                    ctx.shadowBlur = 30;
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    ctx.arc(w / 2, h / 2, this.length, this.length, w, h);
                    ctx.stroke();
                    ctx.lineWidth = 1;
                }
                stagger++;
            }
            t++;
            if (t % (speed * 15) === 0) {
                ctx.translate(w / 2, h / 2);
                ctx.rotate((30 * Math.PI) / 180);
                ctx.translate(-w / 2, -h / 2);
                this.length = random(30, h / 2);
            }
            if (t % (speed * 180) === 0) {
                this.color1 = randomColor(0, 255, 1, 1);
                this.color2 = randomColor(0, 255, 1, 1);
            }
            this.lineX = random(0, h);
            this.lineY = random(0, w);
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Dotted {
    constructor() {
        this.vx1 = random(0, w);
        this.vx2 = random(0, w);
        this.vx3 = random(0, w);
        this.vy1 = random(0, h);
        this.vy2 = random(0, h);
        this.vy3 = random(0, h);

        ctx.globalCompositeOperation = 'overlay';
        ctx.strokeStyle = randomColor(5, 255, 0.75, 0.75);
        ctx.fillStyle = randomColor(5, 255, 0.015, 0.015);
        ctx.setLineDash([14, 6]);
        ctx.lineWidth = 2;

        this.draw = () => {
            if (t % speed === 0) {
                stagger = stagger % 3;

                if (stagger === 0) {
                    ctx.moveTo(w / 2, h / 2);
                    ctx.lineTo(this.vx2, this.vy2);
                    ctx.stroke();
                }
                if (stagger === 1) {
                    ctx.lineTo(this.vx3, this.vy3);
                    ctx.stroke();
                }
                if (stagger === 2) {
                    ctx.lineTo(this.vx1, this.vy1);
                    ctx.stroke();

                    ctx.beginPath();
                    this.vx1 = random(0, w);
                    this.vx2 = random(0, w);
                    this.vx3 = random(0, w);
                    this.vy1 = random(0, h);
                    this.vy2 = random(0, h);
                    this.vy3 = random(0, h);
                }
                stagger++;
            }
            t++;
            if (t % (speed * 5) === 0) {
                ctx.fillRect(0, 0, w, h);
            }
            if (t % (speed * 70) === 0) {
                ctx.setLineDash([random(1, 20), random(7, 50)]);
                ctx.lineWidth = random(1, 29);
            }
            if (t % (speed * 200) === 0) {
                ctx.fillStyle = randomColor(5, 255, 0.015, 0.015);
            }
            if (t % (speed * 280) === 0) {
                ctx.strokeStyle = randomColor(5, 255, 0.75, 0.75);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class SpiralLines {
    constructor() {
        this.radius = random(10, h);
        this.length = random(50, Math.min(w, h) / 1.5);
        this.gap = random(4, 100);
        this.rot1 = (random(1, 359) * Math.PI) / 180;
        this.cycles = 1;
        this.bw = Math.random();

        ctx.strokeStyle = randomColor(5, 255, 0.5, 0.5);
        ctx.lineWidth = random(1, 8);
        ctx.moveTo(w / 2, h / 2);
        ctx.beginPath();

        this.draw = () => {
            if (t % speed === 0) {
                stagger = stagger % 3;
                if (stagger === 0) {
                    ctx.moveTo(
                        w / 2 - this.radius - this.length / 2,
                        h / 2 + this.length / 2
                    );
                    ctx.lineTo(
                        w / 2 - this.radius - this.length / 2,
                        h / 2 - this.length / 2
                    );
                    ctx.stroke();
                }
                if (stagger === 1) {
                    ctx.lineTo(w / 2 - this.radius - this.length, h / 2);
                    ctx.stroke();
                }
                if (stagger === 2) {
                    ctx.lineTo(
                        w / 2 - this.radius - this.length / 2,
                        h / 2 + length / 2
                    );
                    ctx.stroke();
                }
                ctx.translate(w / 2, h / 2);
                ctx.rotate(this.rot1);
                ctx.translate(-w / 2, -h / 2);
                this.length += this.gap;
                if (this.length > Math.max(w, h)) {
                    this.cycles++;
                    this.length = this.gap;
                    ctx.beginPath();
                    ctx.strokeStyle = randomColor(5, 255, 0.5, 0.5);
                    ctx.arc(w / 2, h / 2, this.radius, 0, 360);
                    this.bw = Math.random();
                    this.radius = random(5, 65);
                    this.gap = random(2, 30);
                }
            }
            t++;
            if (this.cycles % 9 === 0) {
                this.bw < 0.5
                    ? (ctx.strokeStyle = 'rgba(255,255,255, .75)')
                    : (ctx.strokeStyle = 'rgba(0,0,0, .75)');
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class CamouflagePostits {
    constructor() {
        this.length = random(50, Math.min(w, h) / 1.5);
        this.x = random(0, w);
        this.y = random(0, w);
        this.rot1 = (random(0, 360) * Math.PI) / 180;
        this.randCol = random(0, 255);
        ctx.fillStyle = `rgb(${this.randCol + random(-8, 8)},${
            this.randCol + random(-8, 8)
        },${this.randCol + random(-8, 8)})`;

        this.modes = [
            'xor',
            'difference',
            'hard-light',
            'color-burn',
            'color-dodge',
            'lighten',
            'darken',
            'overlay',
            'source-atop'
        ];

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.moveTo(w / 2, h / 2);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.fillRect(this.x, this.y, this.length, this.length);
                this.x = random(0, w);
                this.y = random(0, h);
                ctx.translate(w / 2, h / 2);
                ctx.rotate(this.rot1);
                ctx.translate(-w / 2, -h / 2);
            }
            if (t % (speed * 25) === 0) {
                this.length = random(5, 125);
                this.randCol = random(0, 255);
                ctx.fillRect(
                    w / 2 - this.length * 1.5,
                    h / 2 - this.length * 1.5,
                    3 * this.length,
                    3 * this.length
                );
                ctx.strokeRect(
                    w / 2 - this.length * 1.5,
                    h / 2 - this.length * 1.5,
                    3 * this.length,
                    3 * this.length
                );
                ctx.fillStyle = `rgb(${this.randCol + random(-8, 8)},${
                    this.randCol + random(-8, 8)
                },${this.randCol + random(-8, 8)})`;
            }
            t++;
            if (t % (speed * 100) === 0) {
                this.rot1 = (random(0, 360) * Math.PI) / 180;
                ctx.globalCompositeOperation =
                    this.modes[random(0, this.modes.length - 1)];
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class TheBadge {
    constructor() {
        this.length = random(50, Math.min(w, h) / 1.5);
        this.rot1 = (random(0, 360) * Math.PI) / 180;
        this.randCol = random(0, 255);
        ctx.fillStyle = `rgb(${this.randCol + random(-28, 28)},${
            this.randCol + random(-28, 28)
        },${this.randCol + random(-28, 28)})`;
        this.modes = [
            'difference',
            'soft-light',
            'color',
            'lighten',
            'darken',
            'overlay',
            'source-atop'
        ];

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.fillRect(
                    w / 2 - this.length * 1.5,
                    h / 2 - this.length * 1.5,
                    3 * this.length,
                    3 * this.length
                );
                ctx.strokeRect(
                    w / 2 - this.length * 1.5,
                    h / 2 - this.length * 1.5,
                    3 * this.length,
                    3 * this.length
                );
                ctx.translate(w / 2, h / 2);
                ctx.rotate(this.rot1);
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            if (t % (speed * 25) === 0) {
                this.length = random(5, Math.min(w, h) / 3);
                this.randCol = random(0, 255);

                ctx.fillStyle = `rgb(${this.randCol + random(-28, 28)},${
                    this.randCol + random(-28, 28)
                },${this.randCol + random(-28, 28)})`;
            }
            if (t % (speed * 50) === 0) {
                this.rot1 = (random(0, 360) * Math.PI) / 180;
                ctx.globalCompositeOperation =
                    this.modes[random(0, this.modes.length - 1)];
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class BlacknWhite {
    constructor() {
        this.length = random(50, Math.min(w, h) / 1.5);
        this.height = this.length / random(1, 5);
        this.modes = ['source-over', 'difference', 'destination-out'];

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;

        this.draw = () => {
            if (t % speed === 0) {
                stagger = stagger % 4;
                if (stagger === 0) {
                    ctx.beginPath();
                    ctx.moveTo(w / 2, h / 2);
                    ctx.strokeRect(
                        w / 2 - this.length / 2,
                        h / 2 - this.height / 2,
                        this.length,
                        this.height
                    );
                    //
                    this.length = random(20, Math.max(w, h));
                    this.height = this.length / random(1, 5);
                }
                if (stagger === 1) {
                    ctx.translate(w / 2, h / 2);
                    ctx.rotate((random(-180, 180) * Math.PI) / 180);
                    ctx.translate(-w / 2, -h / 2);
                }
                if (stagger === 2) {
                    ctx.arcTo(this.height, this.length, 0, h / 2, w / 2);
                    ctx.stroke();
                }
                if (stagger === 3) {
                    ctx.arcTo(
                        w / 2,
                        h / 2,
                        random(1, 10),
                        this.height,
                        this.length
                    );
                    ctx.stroke();
                }
                stagger++;
            }
            t++;
            if (t % (speed * 100) === 0) {
                ctx.globalCompositeOperation =
                    this.modes[random(0, this.modes.length)];
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class StainedGlass {
    constructor() {
        this.length = w / 6;
        this.height = h / 5;
        this.rand1 = random(0, 3);
        this.rand2 = (random(1, 359) * Math.PI) / 180;
        this.modes = ['color', 'hue', 'saturation', 'overlay'];

        ctx.globalCompositeOperation = 'color';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 5;
        ctx.fillStyle = randomColor(0, 255, 0, 1);
        ctx.beginPath();

        this.draw = () => {
            if (t % speed === 0) {
                stagger = random(0, 30);
                if (stagger === 0) {
                    ctx.strokeRect(0, 0, this.length, this.height);
                    ctx.fillRect(0, 0, this.length, this.height);
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 1) {
                    ctx.strokeRect(this.length, 0, this.length, this.height);
                    ctx.fillRect(this.length, 0, this.length, this.height);
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 2) {
                    ctx.strokeRect(
                        2 * this.length,
                        0,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(2 * this.length, 0, this.length, this.height);
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 3) {
                    ctx.strokeRect(
                        3 * this.length,
                        0,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(3 * this.length, 0, this.length, this.height);
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 4) {
                    ctx.strokeRect(
                        4 * this.length,
                        0,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(4 * this.length, 0, this.length, this.height);
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 5) {
                    ctx.strokeRect(
                        5 * this.length,
                        0,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(5 * this.length, 0, this.length, this.height);
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 6) {
                    ctx.strokeRect(
                        5 * this.length,
                        this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(
                        5 * this.length,
                        this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 7) {
                    ctx.strokeRect(
                        4 * this.length,
                        this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(
                        4 * this.length,
                        this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 8) {
                    ctx.strokeRect(
                        3 * this.length,
                        this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(
                        3 * this.length,
                        this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 9) {
                    ctx.strokeRect(
                        2 * this.length,
                        this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(
                        2 * this.length,
                        this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 10) {
                    ctx.strokeRect(
                        this.length,
                        this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(
                        this.length,
                        this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 11) {
                    ctx.strokeRect(0, this.height, this.length, this.height);
                    ctx.fillRect(0, this.height, this.length, this.height);
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 12) {
                    ctx.strokeRect(
                        0,
                        2 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(0, 2 * this.height, this.length, this.height);
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 13) {
                    ctx.strokeRect(
                        this.length,
                        2 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(
                        this.length,
                        2 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 14) {
                    ctx.strokeRect(
                        2 * this.length,
                        2 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(
                        2 * this.length,
                        2 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 15) {
                    ctx.strokeRect(
                        3 * this.length,
                        2 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(
                        3 * this.length,
                        2 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 16) {
                    ctx.strokeRect(
                        4 * this.length,
                        2 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(
                        4 * this.length,
                        2 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 17) {
                    ctx.strokeRect(
                        5 * this.length,
                        2 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(
                        5 * this.length,
                        2 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 18) {
                    ctx.strokeRect(
                        5 * this.length,
                        3 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(
                        5 * this.length,
                        3 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 19) {
                    ctx.strokeRect(
                        4 * this.length,
                        3 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(
                        4 * this.length,
                        3 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 20) {
                    ctx.strokeRect(
                        3 * this.length,
                        3 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(
                        3 * this.length,
                        3 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 21) {
                    ctx.strokeRect(
                        2 * this.length,
                        3 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(
                        2 * this.length,
                        3 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 22) {
                    ctx.strokeRect(
                        this.length,
                        3 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(
                        this.length,
                        3 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 23) {
                    ctx.strokeRect(
                        0,
                        3 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(0, 3 * this.height, this.length, this.height);
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 24) {
                    ctx.strokeRect(
                        0,
                        4 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(0, 4 * this.height, this.length, this.height);
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 25) {
                    ctx.strokeRect(
                        this.length,
                        4 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(
                        length,
                        4 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 26) {
                    ctx.strokeRect(
                        2 * this.length,
                        4 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(
                        2 * this.length,
                        4 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 27) {
                    ctx.strokeRect(
                        3 * this.length,
                        4 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(
                        3 * this.length,
                        4 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 28) {
                    ctx.strokeRect(
                        4 * this.length,
                        4 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(
                        4 * this.length,
                        4 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                if (stagger === 29) {
                    ctx.strokeRect(
                        5 * this.length,
                        4 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillRect(
                        5 * this.length,
                        4 * this.height,
                        this.length,
                        this.height
                    );
                    ctx.fillStyle = randomColor(0, 255, 0, 1);
                }
                stagger++;
            }
            t++;
            if (t % (speed * 50) === 0) {
                ctx.globalCompositeOperation =
                    this.modes[random(0, this.modes.length)];
                ctx.translate(w / 2, h / 2);
                ctx.rotate(this.rand2);
                ctx.translate(-w / 2, -h / 2);
                this.rand1 = random(0, 3);
                ctx.fillRect(
                    w / 2 - this.rand1 * this.length,
                    h / 2 - this.height * 1.5,
                    this.rand1 * 2 * this.length,
                    3 * this.height
                );
                ctx.strokeRect(
                    w / 2 - this.rand1 * this.length,
                    h / 2 - this.height * 2.5,
                    this.rand1 * 2 * this.length,
                    5 * this.height
                );
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class SpiralText {
    constructor() {
        this.x = random(0, w);
        this.y = random(0, w);
        this.rot1 = (random(1, 20) * Math.PI) / 180;
        this.picker = random(0, 11);

        ctx.globalCompositeOperation = 'color';
        ctx.strokeStyle = randomColor(0, 255, 1, 1);
        ctx.textAlign = 'center';
        ctx.font = `bold ${random(10, 400)}px sans-serif`;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.strokeText('SPIRAL', this.x, this.y);
                ctx.translate(w / 2, h / 2);
                ctx.rotate(this.rot1);
                ctx.translate(-w / 2, -h / 2);
                this.x = random(0, w);
            }
            t++;
            if (t % (speed * 90) === 0) {
                this.y = random(0, h);
                this.picker = random(0, 11);
                if (this.picker === 0) {
                    ctx.strokeStyle = 'white';
                } else if (this.picker === 1) {
                    ctx.strokeStyle = 'black';
                } else if (this.picker === 2 || this.picker === 3) {
                    ctx.globalCompositeOperation = 'color-dodge';
                } else if (this.picker === 4 || this.picker === 5) {
                    ctx.globalCompositeOperation = 'source-over';
                } else if (this.picker === 6) {
                    ctx.globalCompositeOperation = 'darken';
                } else if (this.picker === 7) {
                    ctx.globalCompositeOperation = 'color-burn';
                } else {
                    ctx.globalCompositeOperation = 'color';
                }
                ctx.strokeStyle = randomColor(0, 255, 1, 1);
                ctx.font = `bold ${random(10, 400)}px sans-serif`;
            }
            if (t % (speed * 180) === 0) {
                this.rot1 = (random(1, 30) * Math.PI) / 180;
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class AlphabetSoup {
    constructor() {
        this.rot1 = (random(8, 35) * Math.PI) / 180;
        this.letters = [
            1301, 1302, 1303, 1305, 1306, 1307, 1308, 1309, 1311, 1313, 1314,
            1315, 1316, 1317, 1319, 1324, 1325, 1326, 1328, 1329, 1330, 1331,
            1332, 1334, 1337, 1338, 1340, 1342, 1344, 1345, 1347, 1351, 1354,
            1359, 1361, 1362, 1363, 1364, 1365, 1367, 1369, 1370, 1371, 1372,
            1373, 1374, 1375, 1376, 1377, 1378, 1383, 1384, 1385, 1386, 1388,
            1390, 1392, 1393, 1397, 1399, 1400
        ];
        this.letter1 = String.fromCharCode(
            this.letters[random(0, this.letters.length)]
        );
        this.letter2 = String.fromCharCode(
            this.letters[random(0, this.letters.length)]
        );
        this.letter3 = String.fromCharCode(
            this.letters[random(0, this.letters.length)]
        );
        this.letter4 = String.fromCharCode(
            this.letters[random(0, this.letters.length)]
        );
        this.fontChange = random(35, 180);

        ctx.fillStyle = randomColor(0, 255, 0.45, 0.7);
        ctx.font = `${random(10, 180)}px sans-serif`;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.fillText(
                    `${this.letter1} ${this.letter2} ${this.letter3} ${this.letter4}`,
                    w / 2,
                    h / 2
                );
                ctx.translate(w / 2, h / 2);
                ctx.rotate(this.rot1);
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            if (t % (speed * 100) === 0) {
                this.fontChange = random(35, 180);
                ctx.font = `${this.fontChange}px sans-serif`;
                ctx.fillStyle = randomColor(0, 255, 0.45, 0.7);
            }
            if (t % (speed * 200) === 0) {
                this.rot1 = (random(8, 35) * Math.PI) / 180;
            }
            if (t % (speed * 400) === 0) {
                this.letter1 = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                );
                this.letter2 = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                );
                this.letter3 = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                );
                this.letter4 = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                );
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Punctuation {
    constructor() {
        this.rot1 = (random(-359, -1) * Math.PI) / 180;
        this.fontChange = random(35, 250);
        this.letters = [
            '|',
            '(',
            ')',
            '-',
            '_',
            '{',
            '}',
            '[',
            ']',
            '\\',
            ':',
            '/',
            '<>',
            '~',
            '`',
            '.'
        ];
        this.letter = this.letters[random(0, this.letters.length)];

        ctx.fillStyle = randomColor(0, 255, 0.66, 0.66);
        ctx.font = `${random(15, 120)}px sans-serif`;

        this.draw = () => {
            if (t % speed === 0) {
                stagger = stagger % 4;
                if (stagger === 0) {
                    ctx.translate(w / 2, h / 2);
                    ctx.rotate(this.rot1);
                    ctx.translate(-w / 2, -h / 2);
                    ctx.fillText(this.letter, w / 2, h / 2);
                }
                if (stagger === 1) {
                    ctx.fillText(`  ${this.letter}`, w / 2, h / 2);
                    ctx.translate(w / 2, h / 2);
                    ctx.rotate(this.rot1);
                    ctx.translate(-w / 2, -h / 2);
                }
                if (stagger === 2) {
                    ctx.fillText(`    ${this.letter}`, w / 2, h / 2);
                }
                if (stagger === 3) {
                    ctx.fillText(`      ${this.letter}`, w / 2, h / 2);
                }
                stagger++;
            }
            t++;
            if (t % (speed * 100) === 0) {
                this.rot1 = (random(-35, -10) * Math.PI) / 180;
                this.fontChange = random(35, 250);
                ctx.font = `${this.fontChange}px sans-serif`;
            }
            if (t % (speed * 200) === 0) {
                ctx.fillStyle = randomColor(0, 255, 0.66, 0.66);
            }
            if (t % (speed * 400) === 0) {
                this.letter = this.letters[random(0, this.letters.length)];
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class AccelerationMandala {
    constructor() {
        this.letters = [
            1002, 1006, 1031, 1033, 1039, 1046, 1054, 1064, 1078, 1092, 1912,
            1916, 1920, 1921, 1935, 1944, 1959, 1963, 1964, 1968, 1988, 1991,
            1993, 1997, 12398
        ];
        this.letter = String.fromCharCode(
            this.letters[random(0, this.letters.length)]
        );
        this.rot = 1;

        ctx.strokeStyle = randomColor(12, 255, 0.33, 0.33);
        ctx.font = `bold ${random(125, 550)}px sans-serif`;
        ctx.textAlign = 'center';

        this.draw = () => {
            if (t % speed === 0) {
                ctx.strokeText(this.letter, w / 2, h / 2);
                ctx.translate(w / 2, h / 2);
                ctx.rotate(((this.rot + 1) * Math.PI) / 180);
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            if (t % (speed * 45) === 0) {
                this.rot++;
            }
            if (t % (speed * 90) === 0) {
                ctx.strokeStyle = randomColor(12, 255, 0.33, 0.33);
            }
            if (t % (speed * 135) === 0) {
                ctx.font = `bold ${random(125, 550)}px sans-serif`;
            }
            if (t % (speed * 360) === 0) {
                this.letter = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                );
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

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
            1274, 1275, 1276, 1278, 1280, 1284, 1286, 1294, 10400
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

class TheIris {
    constructor() {
        this.letter1 = String.fromCharCode(random(300, 100000));
        this.letter2 = String.fromCharCode(random(300, 100000));
        this.rot = random(-45, 45);
        ctx.fillStyle = randomColor(0, 255, 0.2, 0.2);
        ctx.strokeStyle = 'black';
        ctx.font = `bold ${random(50, 300)}px sans-serif`;
        ctx.textAlign = 'center';

        this.draw = () => {
            if (t % speed === 0) {
                ctx.fillText(this.letter1 + `   ` + this.letter2, w / 2, h / 2);
                ctx.strokeText(
                    this.letter1 + `   ` + this.letter2,
                    w / 2,
                    h / 2
                );
                ctx.translate(w / 2, h / 2);
                ctx.rotate(((this.rot + 1) * Math.PI) / 180);
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            if (t % (speed * 45) === 0) {
                ctx.font = `bold ${random(50, 300)}px sans-serif`;
                ctx.fillStyle = randomColor(0, 255, 0.2, 0.2);
            }
            if (t % (speed * 360) === 0) {
                this.rot = random(-45, 45);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Quadrants {
    constructor() {
        this.radius = random(5, 250);

        ctx.strokeStyle = ctx.fillStyle = randomColor(0, 255, 0.3, 0.3);

        this.draw = () => {
            if (t % speed === 0) {
                stagger = stagger % 5;
                if (stagger === 0) {
                    ctx.arc(w / 4, h / 4, this.radius, 0, 360);
                    ctx.stroke();
                    ctx.beginPath();
                }
                if (stagger === 1) {
                    ctx.arc(w * 0.75, h / 4, this.radius, 0, 360);
                    ctx.stroke();
                    ctx.beginPath();
                }
                if (stagger === 2) {
                    ctx.arc(w / 4, h * 0.75, this.radius, 0, 360);
                    ctx.stroke();
                    ctx.beginPath();
                }
                if (stagger === 3) {
                    ctx.arc(w * 0.75, h * 0.75, this.radius, 0, 360);
                    ctx.stroke();
                    ctx.beginPath();
                }
                if (stagger === 4) {
                    ctx.arc(w / 2, h / 2, this.radius, 0, 360);
                    ctx.stroke();
                    ctx.beginPath();
                }
                stagger++;
            }
            t++;
            if (t % (speed * 15) === 0) {
                this.radius = random(10, 350);
            }
            if (t % (speed * 45) === 0) {
                ctx.strokeStyle = ctx.fillStyle = randomColor(0, 255, 0.3, 0.3);
            }
            if (t % (speed * 225) === 0) {
                ctx.lineWidth = random(1, 40);
                ctx.strokeStyle = ctx.fillStyle = 'black';
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class AlienFlowers {
    constructor() {
        this.modes = [
            'hard-light',
            'color-dodge',
            'multiply',
            'overlay',
            'color-burn'
        ];

        ctx.shadowColor = ctx.strokeStyle = randomColor(5, 255, 0.1, 0.1);
        ctx.shadowOffsetX = ctx.shadowOffsetY = ctx.lineWidth = random(3, 36);
        ctx.lineJoin = 'bevel';
        ctx.setLineDash([random(1, 100), random(5, 200)]);
        ctx.globalCompositeOperation = 'source-over';
        ctx.lineCap = 'round';
        ctx.shadowBlur = 5;
        ctx.beginPath();

        this.draw = () => {
            if (t % speed === 0) {
                stagger = stagger % 4;
                if (stagger === 0) {
                    ctx.moveTo(w / 2, h / 2);
                    ctx.bezierCurveTo(
                        random(0, w / 2),
                        random(0, h / 2),
                        random(0, w / 4),
                        random(0, h / 4),
                        0,
                        0
                    );
                    ctx.stroke();
                }
                if (stagger === 1) {
                    ctx.moveTo(w / 2, h / 2);
                    ctx.bezierCurveTo(
                        random(w / 2, w),
                        random(0, h / 2),
                        random(w * 0.75, w),
                        random(0, h * 0.25),
                        w,
                        0
                    );
                    ctx.stroke();
                }
                if (stagger === 2) {
                    ctx.moveTo(w / 2, h / 2);
                    ctx.bezierCurveTo(
                        random(w / 2, w),
                        random(h / 2, h),
                        random(w * 0.75, w),
                        random(h * 0.75, h),
                        w,
                        h
                    );
                    ctx.stroke();
                }
                if (stagger === 3) {
                    ctx.moveTo(w / 2, h / 2);
                    ctx.bezierCurveTo(
                        random(0, w / 2),
                        random(h / 2, h),
                        random(0, w * 0.25),
                        random(h * 0.75, h),
                        0,
                        h
                    );
                    ctx.stroke();
                }
                stagger++;
            }
            t++;
            if (t % (speed * 16) === 0) {
                ctx.translate(w / 2, h / 2);
                ctx.rotate((random(1, 359) * 180) / Math.PI);
                ctx.translate(-w / 2, -h / 2);
            }
            if (t % (speed * 32) === 0) {
                ctx.beginPath();
                ctx.globalCompositeOperation =
                    this.modes[random(0, this.modes.length)];
            }
            if (t % (speed * 64) === 0) {
                ctx.beginPath();
                ctx.shadowColor = ctx.strokeStyle = randomColor(
                    5,
                    255,
                    0.1,
                    0.1
                );
                ctx.shadowOffsetX =
                    ctx.shadowOffsetY =
                    ctx.lineWidth =
                        random(3, 36);
            }
            if (t % (speed * 256) === 0) {
                ctx.setLineDash([random(1, 100), random(5, 200)]);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class HyperTunnel {
    constructor() {
        this.side = random(25, Math.min(w, h));
        this.rotate = random(95, 175);
        ctx.strokeStyle = randomColor(5, 255, 0.25, 0.25);

        if (this.side > Math.min(w, h) / 2) {
            ctx.fillStyle = randomColor(5, 255, 0.02, 0.02);
        } else {
            ctx.fillStyle = randomColor(5, 255, 0.2, 0.2);
        }

        this.draw = () => {
            if (t % speed === 0) {
                ctx.beginPath();
                ctx.moveTo(w / 2, h / 2);
                ctx.lineTo(w / 2 - this.side / 2, h / 2 - this.side / 2);
                ctx.stroke();
                ctx.moveTo(w / 2, h / 2);
                ctx.lineTo(w / 2 + this.side / 2, h / 2 - this.side / 2);
                ctx.stroke();
                ctx.lineTo(w / 2 - this.side / 2, h / 2 - this.side / 2);
                ctx.stroke();
                ctx.fill();
                ctx.translate(w / 2, h / 2);
                ctx.rotate((this.rotate * Math.PI) / 180);
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            if (t % (speed * (360 / this.rotate)) === 0) {
                this.side = random(25, Math.min(w, h));
                ctx.strokeStyle = randomColor(5, 255, 0.25, 0.25);
                if (this.side > Math.min(w, h) / 2) {
                    ctx.fillStyle = randomColor(5, 255, 0.02, 0.02);
                } else {
                    ctx.fillStyle = randomColor(5, 255, 0.2, 0.2);
                }
            }
            if (t % (speed * 75) === 0) {
                this.rotate = random(95, 175);
                this.side = random(25, Math.max(w, h));
                ctx.strokeStyle = randomColor(5, 255, 0.25, 0.25);
                if (this.side > Math.min(w, h) / 2) {
                    ctx.fillStyle = randomColor(5, 255, 0.02, 0.02);
                } else {
                    ctx.fillStyle = randomColor(5, 255, 0.1, 0.1);
                }
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class ChalkGalaxy {
    constructor() {
        this.letters = [
            1401, 1402, 1403, 1404, 1406, 1407, 1408, 1410, 1411, 1412, 1413,
            1414, 1415, 1417, 1418, 1425, 1426, 1427, 1428, 1429, 1430, 1431,
            1440, 1441, 1470, 1472, 1475, 1478, 1490, 1491, 1492, 1493, 1495,
            1499, 1500, 10157
        ];
        this.letter = String.fromCharCode(
            this.letters[random(0, this.letters.length)]
        );
        this.rotate = random(1, 179);
        ctx.strokeStyle = randomColor(150, 255, 0.25, 0.25);
        ctx.font = `${random(100, 500)}px bold`;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(0, 0, w, h);
        this.draw = this.draw.bind(this);
    }
    draw() {
        if (t % speed === 0) {
            ctx.strokeText(this.letter, w / 2, h / 2);
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rotate);
            ctx.translate(-w / 2, -h / 2);
        }
        t++;
        if (t % (speed * 100) === 0) {
            ctx.strokeStyle = randomColor(170, 255, 0.2, 0.2);
            ctx.font = `${random(100, 600)}px bold`;
        }
        if (t % (speed * 500) === 0) {
            ctx.strokeStyle = randomColor(0, 115, 0.2, 0.2);
            this.rotate = random(1, 179);
        }
        if (t % (speed * 1000) === 0) {
            this.letter = String.fromCharCode(
                this.letters[random(0, this.letters.length)]
            );
        }
        interval = requestAnimationFrame(this.draw);
    }
}

class Patterns {
    constructor() {
        this.radius = random(10, 250);
        this.rows = Math.ceil(h / 100) + 2;
        this.cols = Math.ceil(w / 100) + 2;

        ctx.globalCompositeOperation = 'overlay';
        ctx.globalAlpha = 0.1;
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.fillStyle = randomColor(0, 255, 0.05, 0.6);

        this.draw = () => {
            if (t % speed === 0) {
                for (let i = 0; i <= this.rows; i++) {
                    for (let j = 0; j <= this.cols; j++) {
                        ctx.beginPath();
                        ctx.arc(
                            100 * j - 50,
                            100 * i - 50,
                            this.radius,
                            0,
                            2 * Math.PI
                        );
                        ctx.stroke();
                        ctx.fill();
                    }
                }
            }
            t++;
            if (t % (speed * 40) === 0) {
                this.radius = random(10, 250);
                ctx.globalCompositeOperation = 'xor';
                ctx.strokeStyle = 'black';
                ctx.fillStyle = randomColor(0, 255, 0.05, 0.6);
                ctx.beginPath();
                ctx.arc(w / 2, h / 2, this.radius * 3, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.fill();
                ctx.globalCompositeOperation = 'overlay';
                ctx.strokeStyle = 'white';
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class RotationPatterns {
    constructor() {
        this.radiusX = random(10, 250);
        this.radiusY = random(10, 250);
        this.rows = Math.ceil(h / this.radiusY) + 5;
        this.cols = Math.ceil(w / this.radiusX) + 5;
        this.rotate = (random(1, 50) * Math.PI) / 180;

        ctx.globalAlpha = 0.33;
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.fillStyle = randomColor(0, 255, 0.1, 0.5);

        this.draw = () => {
            if (t % speed === 0) {
                for (let i = 0; i <= this.rows; i++) {
                    ctx.translate(w / 2, h / 2);
                    ctx.rotate(this.rotate);
                    ctx.translate(-w / 2, -h / 2);
                    for (let j = 0; j <= this.cols; j++) {
                        ctx.strokeRect(
                            this.radiusX * j,
                            this.radiusY * i,
                            this.radiusX,
                            this.radiusY
                        );
                    }
                }
            }
            t++;
            if (t % (speed * 15) === 0) {
                ctx.strokeStyle = randomColor(0, 255, 0.1, 0.5);
            }
            if (t % (speed * 45) === 0) {
                this.radiusX = random(10, 250);
                this.radiusY = random(10, 250);
                this.rows = Math.ceil(h / this.radiusY) + 5;
                this.cols = Math.ceil(w / this.radiusX) + 5;
            }
            if (t % (speed * 90) === 0) {
                ctx.lineWidth = random(2, 9);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Microscope {
    constructor() {
        this.radiusX = random(35, 415);
        this.radiusY = random(35, 415);
        this.rows = Math.ceil(h / this.radiusY) + 5;
        this.cols = Math.ceil(w / this.radiusX) + 5;
        this.rotate = random(1, 20);
        this.modes = [
            'xor',
            'difference',
            'hard-light',
            'color-burn',
            'color-dodge',
            'lighten',
            'darken',
            'overlay',
            'source-atop',
            'soft-light',
            'source-over',
            'luminosity',
            'exclusion'
        ];

        ctx.shadowColor = ctx.strokeStyle = randomColor(0, 255, 0.5, 0.5);
        ctx.shadowBlur = 6;

        this.draw = () => {
            if (t % speed === 0) {
                for (let i = 0; i <= this.rows; i++) {
                    ctx.globalCompositeOperation =
                        this.modes[random(0, this.modes.length)];
                    ctx.translate(w / 2, h / 2);
                    ctx.rotate(this.rotate);
                    ctx.translate(-w / 2, -h / 2);
                    for (let j = 0; j <= this.cols; j++) {
                        ctx.beginPath();
                        ctx.ellipse(
                            this.radiusX * j,
                            this.radiusY * i,
                            this.radiusX,
                            this.radiusY,
                            0,
                            2 * Math.PI,
                            false
                        );
                        ctx.stroke();
                    }
                }
            }
            t++;
            if (t % (speed * 50) === 0) {
                ctx.shadowColor = ctx.strokeStyle = randomColor(
                    0,
                    255,
                    0.5,
                    0.5
                );
            }
            if (t % (speed * 100) === 0) {
                this.radiusX = random(35, 415);
                this.radiusY = random(35, 415);
                this.rows = Math.ceil(h / this.radiusY) + 5;
                this.cols = Math.ceil(w / this.radiusX) + 5;
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Spinner {
    constructor() {
        this.color1 = randomColor(0, 255, 1, 1);
        this.color2 = randomColor(0, 255, 1, 1);
        this.side = Math.min(w, h);
        this.gap1 = random(15, 150);
        this.gap2 = random(-150, -15);
        ctx.fillStyle = this.color1;
        this.draw = () => {
            if (t % speed === 0) {
                ctx.translate(w / 2, h / 2);
                ctx.rotate((this.gap1 * Math.PI) / 180);
                ctx.lineWidth = 2;
                ctx.globalCompositeOperation = 'hard-light';
                ctx.globalAlpha = 0.08;
                ctx.shadowColor = ctx.fillStyle = this.color1;
                ctx.shadowBlur = 8;
                ctx.fillRect(
                    w / 2 - this.side / 2,
                    h / 2 - this.side / 2,
                    this.side,
                    this.side
                );
                ctx.translate(-w / 2, -h / 2);
                ctx.lineWidth = 3;
                ctx.globalAlpha = 0.2;
                ctx.shadowBlur = 0;
                ctx.globalCompositeOperation = 'difference';
                ctx.fillStyle = this.color2;
                ctx.fillRect(w / 2, h / 2, this.gap1 * 2, this.gap2 * 2);
            }
            t++;
            if (t % (speed * 50) === 0) {
                this.side = random(200, Math.max(w, h) / 2);
                this.gap1 = random(15, 150);
                this.gap2 = random(-150, -15);
                this.color2 = randomColor(0, 255, 1, 1);
            }
            if (t % (speed * 100) === 0) {
                ctx.beginPath();
                this.color1 = randomColor(0, 255, 1, 1);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class SpaceGears {
    constructor() {
        this.letters = [
            402, 406, 407, 409, 410, 412, 414, 415, 418, 420, 423, 424, 425,
            428, 429, 430, 433, 437, 438, 439, 440, 443, 444, 448, 449, 450,
            451, 458, 461, 474, 478, 480, 484, 488, 491, 494
        ];
        this.letter = String.fromCharCode(428);
        this.rotate = (random(3, 357) * Math.PI) / 180;
        ctx.font = random(100, 700) + 'px serif';

        ctx.strokeStyle = randomColor(0, 255, 0.6, 0.6);
        this.draw = () => {
            if (t % speed === 0) {
                ctx.textAlign = 'left';
                ctx.strokeText(' ' + this.letter.repeat(3), 0, 0);
                ctx.translate(w / 2, h / 2);
                ctx.rotate(this.rotate);
                ctx.textAlign = 'center';
                ctx.strokeText(this.letter, 0, 0);
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            if (t % (speed * 120) === 0) {
                ctx.strokeStyle = randomColor(0, 255, 0.6, 0.6);
                ctx.font = random(100, 700) + 'px serif';
            }
            if (t % (speed * 1260) === 0) {
                this.rotate = (random(3, 357) * Math.PI) / 180;
                this.letter = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                );
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class CounterClock {
    constructor() {
        this.letters = [
            607, 611, 615, 616, 617, 618, 619, 622, 625, 629, 632, 639, 643,
            650, 656, 662, 664, 676, 683, 684, 685, 688, 690, 691, 694, 697,
            698, 699
        ];
        this.letter = String.fromCharCode(
            this.letters[random(0, this.letters.length)]
        );
        this.color = randomColor(0, 255, 1, 1);
        this.rotate = (8 * Math.PI) / 180;

        ctx.font = random(75, 750) + 'px sans-serif';
        ctx.lineWidth = 2;
        ctx.textAlign = 'center';
        ctx.shadowColor = ctx.strokeStyle = this.color;
        ctx.shadowBlur = 3;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.translate(w / 2, h / 2);
                ctx.strokeText('   ' + this.letter, 0, 0);
                ctx.rotate(-this.rotate);
                ctx.translate(-w / 2, -h / 2);
                ctx.beginPath();
            }
            t++;
            if (t % (speed * 45) === 0) {
                ctx.font = random(75, 750) + 'px sans-serif';
                let col = Math.random();
                if (col < 0.125) {
                    ctx.lineWidth = 1;
                    ctx.shadowBlur = 5;
                    this.color = 'white';
                } else if (col < 0.25) {
                    ctx.lineWidth = 3;
                    this.color = 'black';
                } else {
                    ctx.shadowBlur = 3;
                    ctx.lineWidth = 2;
                    this.color = randomColor();
                }
                ctx.shadowColor = ctx.strokeStyle = this.color;
            }
            if (t % (speed * 450) === 0) {
                this.letter = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                );
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Clock {
    constructor() {
        this.modes = [
            'xor',
            'difference',
            'hard-light',
            'exclusion',
            'multiply',
            'color-burn',
            'color-dodge',
            'lighten',
            'darken',
            'overlay',
            'source-over'
        ];
        this.letters = [
            701, 702, 703, 706, 707, 708, 710, 711, 712, 713, 714, 715, 716,
            717, 718, 719, 720, 721, 722, 724, 726, 727, 729, 730, 731, 732,
            733, 734, 735, 737, 740, 741, 744, 745, 746, 747, 749, 753, 754,
            756, 757, 758, 759, 760, 761, 762, 764, 766, 769, 771, 772, 776,
            778, 781, 782, 784, 790, 794, 795, 796
        ];
        this.letter = String.fromCharCode(
            this.letters[random(0, this.letters.length)]
        );
        this.color = randomColor(0, 255, 0.66, 0.66);
        this.rotate = (18 * Math.PI) / 180;

        ctx.globalCompositeOperation = 'source-over';
        ctx.font = random(60, 600) + 'px sans-serif';
        ctx.lineWidth = 3;
        ctx.textAlign = 'center';
        ctx.shadowColor = ctx.strokeStyle = this.color;
        ctx.shadowBlur = 8;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.translate(w / 2, h / 2);
                ctx.strokeText('  ' + this.letter, 0, 0);
                ctx.rotate(this.rotate);
                ctx.translate(-w / 2, -h / 2);
                ctx.beginPath();
            }
            t++;
            if (t % (speed * 40) === 0) {
                ctx.font = random(60, 600) + 'px sans-serif';
                let col = Math.random();
                if (col < 0.15) {
                    ctx.lineWidth = 2;
                    ctx.shadowBlur = 12;
                    this.color = 'rgba(255, 255, 255, 0.5)';
                } else if (col < 0.3) {
                    ctx.lineWidth = 5;
                    this.color = 'rgba(0, 0, 0, 0.5)';
                } else {
                    ctx.shadowBlur = 8;
                    ctx.lineWidth = 3;
                    this.color = randomColor(0, 255, 0.66, 0.66);
                }
                ctx.shadowColor = ctx.strokeStyle = this.color;
            }
            if (t % (speed * 120) === 0) {
                ctx.globalCompositeOperation =
                    this.modes[random(0, this.modes.length)];
            }
            if (t % (speed * 200) === 0) {
                this.letter = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                );
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Pseye {
    constructor() {
        this.letters = [
            1502, 1505, 1509, 1510, 1511, 1512, 1513, 1520, 1522, 1524, 1540,
            1546, 1549, 1550, 1553, 1554, 1555, 1556, 1558, 1559, 1566, 1568,
            1569, 1570, 1571, 1572, 1573, 1574, 1575, 1576, 1577, 1578, 1583,
            1584, 1586, 1587, 1590, 1593, 1597, 1598, 1599
        ];
        this.letter = String.fromCharCode(
            this.letters[random(0, this.letters.length)]
        );
        this.x1 = random(0, w / 2);
        this.y1 = random(0, h / 2);
        this.x2 = random(0, w);
        this.y2 = random(0, h);
        this.rotate = (random(3, 357) * Math.PI) / 180;

        ctx.globalCompositeOperation = 'exclusion';
        ctx.fillStyle = randomColor(0, 255, 0.1, 0.3);
        ctx.strokeStyle = randomColor(0, 255, 0.5, 1);
        ctx.lineWidth = random(1, 8);
        ctx.font = `bold ${random(35, 350)}px serif`;
        ctx.textAlign = 'center';

        this.draw = () => {
            if (t % speed === 0) {
                ctx.translate(w / 2, h / 2);
                ctx.rotate(this.rotate);
                ctx.fillText(this.letter, this.x1, this.y1);
                ctx.moveTo(this.x1, this.y1);
                ctx.lineTo(this.x2, this.y2);
                ctx.stroke();
                ctx.fillText(this.letter, this.x2, this.y2);
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            if (t % (speed * 50) === 0) {
                this.x1 = random(0, w / 2);
                this.y1 = random(0, h / 2);
                this.x2 = random(0, w);
                this.y2 = random(0, h);
                ctx.beginPath();
                ctx.globalCompositeOperation = 'hard-light';
            }
            if (t % (speed * 100) === 0) {
                ctx.font = `bold ${random(35, 350)}px serif`;
                ctx.fillStyle = randomColor(0, 255, 0.1, 0.3);
                ctx.beginPath();
                ctx.globalCompositeOperation = 'multiply';
                ctx.strokeStyle = randomColor(0, 255, 0.5, 1);
            }
            if (t % (speed * 300) === 0) {
                this.letter = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                );
                ctx.beginPath();
                ctx.globalCompositeOperation = 'overlay';
            }
            if (t % (speed * 600) === 0) {
                ctx.lineWidth = random(1, 8);
            }
            if (t % (speed * 1200) === 0) {
                this.rotate = (random(3, 357) * Math.PI) / 180;
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class NuclearVortex {
    constructor() {
        this.x1 = random(0, w / 2);
        this.y1 = random(0, h / 2);
        this.x2 = random(0, w);
        this.y2 = random(0, h);
        this.rotate = (random(4, 176) * Math.PI) / 180;
        this.color1 = randomColor(50, 150, 0.1, 0.35);
        this.color2 = randomColor(50, 150, 0.1, 0.35);
        this.color3 = randomColor(50, 150, 0.1, 0.35);
        this.color4 = randomColor(50, 150, 0.1, 0.35);
        this.colors = [
            this.color1,
            this.color2,
            'rgba(255, 255, 255, 0.5)',
            this.color3,
            this.color4,
            'black'
        ];
        this.col = 0;

        ctx.setLineDash([random(10, 150), random(10, 150)]);
        ctx.globalAlpha = 0.2;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = this.color1;
        ctx.lineWidth = 2;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.moveTo(this.x1, this.y1);
                ctx.lineTo(this.x2, this.y2);
                ctx.stroke();
                ctx.translate(w / 2, h / 2);
                ctx.rotate(this.rotate);
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            if (t % (speed * 90) === 0) {
                this.x1 = random(0, w / 2);
                this.y1 = random(0, h / 2);
                this.x2 = random(0, w);
                this.y2 = random(0, h);
                this.rotate = (random(4, 176) * Math.PI) / 180;
            }
            if (t % (speed * 180) === 0) {
                ctx.beginPath();
                ctx.setLineDash([random(10, 150), random(10, 150)]);
                this.col++;
                if (this.col > this.colors.length - 1) this.col = 0;
                ctx.strokeStyle = this.colors[this.col];
            }
            if (t % (speed * 1080) === 0) {
                ctx.setLineDash([random(10, 100), random(10, 100)]);
                this.color1 = randomColor(50, 150, 0.1, 0.35);
                this.color2 = randomColor(50, 150, 0.1, 0.35);
                this.color3 = randomColor(50, 150, 0.1, 0.35);
                this.color4 = randomColor(50, 150, 0.1, 0.35);
                this.colors = [
                    this.color1,
                    this.color2,
                    'rgba(255, 255, 255, 0.5)',
                    this.color3,
                    this.color4,
                    'black'
                ];
                this.col = 0;
                ctx.strokeStyle = this.color1;
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class AcidStars {
    constructor() {
        this.side = random(30, 300);
        this.change = this.side / 1.618;
        this.rotate = random(2, 44);
        this.fontSize = random(12, 20);
        this.letters = [
            1606, 1607, 1608, 1610, 1611, 1613, 1614, 1616, 1618, 1619, 1621,
            1622, 1623, 1624, 1627, 1628, 1629, 1631, 1632, 1633, 1634, 1635,
            1636, 1637, 1639, 1640, 1644, 1645, 1647, 1648, 1649, 1650, 1654,
            1656, 1659, 1660, 1663, 1664, 1665, 1666, 1667, 1668, 1670, 1671,
            1672, 1673, 1674, 1675, 1677, 1678, 1680, 1682, 1683, 1686, 1690,
            1691, 1693, 1695, 1697
        ];
        this.letter = String.fromCharCode(
            this.letters[random(0, this.letters.length)]
        );
        ctx.font = this.fontSize + 'px serif';
        ctx.shadowColor = ctx.fillStyle = randomColor(0, 255, 1);
        ctx.shadowBlur = 15;
        this.draw = () => {
            if (t % speed === 0) {
                stagger = stagger % 3;
                if (stagger === 0) {
                    ctx.fillText(this.letter, w / 2 + this.side / 2, h / 2);
                    ctx.stroke();
                }
                if (stagger === 1) {
                    ctx.fillText(this.letter, w / 2, h / 2 - this.side / 2);
                }
                if (stagger === 2) {
                    ctx.translate(w / 2, h / 2);

                    ctx.rotate((-this.rotate * Math.PI) / 180);
                    ctx.fillText(this.letter, w / 2 - this.side / 2, h / 2);
                    ctx.stroke();
                    ctx.translate(-w / 2, -h / 2);
                }
                stagger++;
            }
            this.side += this.change;
            if (this.side > Math.max(w, h) || this.side < 5) {
                this.change = -this.change;
            }
            t++;
            if (t % (speed * 240) === 0) {
                this.rotate = random(2, 44);
                ctx.beginPath();
                ctx.shadowColor = ctx.fillStyle = randomColor(0, 255, 1);
                this.side = random(30, 300);
                this.change = this.side / 1.618;
                this.fontSize = random(12, 20);
                ctx.font = this.fontSize + 'px serif';
            }
            if (t % (speed * 720) === 0) {
                this.letter = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                );
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class GhostlyCreatures {
    constructor() {
        this.rx = random(0, w);
        this.ry = random(0, h);
        this.cp1x = random(0, w);
        this.cp1y = random(0, h);
        this.cp2x = random(0, w);
        this.cp2y = random(0, h);
        this.values = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
        this.changeRx = this.values[random(0, this.values.length)];
        this.changeRy = this.values[random(0, this.values.length)];
        this.changeCp1x = this.values[random(0, this.values.length)];
        this.changeCp1y = this.values[random(0, this.values.length)];
        this.changeCp2x = this.values[random(0, this.values.length)];
        this.changeCp2y = this.values[random(0, this.values.length)];

        ctx.globalCompositeOperation = 'source-out';
        ctx.strokeStyle = randomColor(100, 255, 0.25, 1);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.moveTo(w / 2, h / 2);
                ctx.bezierCurveTo(
                    this.cp1x,
                    this.cp1y,
                    this.cp2x,
                    this.cp2y,
                    this.rx,
                    this.ry
                );
                ctx.stroke();
            }
            this.rx += this.changeRx;
            if (this.rx < 0 || this.rx > w) {
                this.changeRx = -this.changeRx;
            }
            this.ry += this.changeRy;
            if (this.ry < 0 || this.ry > h) {
                this.changeRy = -this.changeRy;
            }
            this.cp1x += this.changeCp1x;
            if (this.cp1x < 0 || this.cp1x > w) {
                this.changeCp1x = -this.changeCp1x;
            }
            this.cp2y += this.changeCp2y;
            if (this.cp2y < 0 || this.cp2y > h) {
                this.changeCp2y = -this.changeCp2y;
            }
            t++;
            if (t % (speed * 1000) === 0) {
                ctx.beginPath();
                ctx.strokeStyle = randomColor(100, 255, 0.25, 1);
                this.rx = random(0, w);
                this.ry = random(0, h);
                this.cp1x = random(0, w);
                this.cp1y = random(0, h);
                this.cp2x = random(0, w);
                this.cp2y = random(0, h);
                this.changeRx = this.values[random(0, this.values.length)];
                this.changeRy = this.values[random(0, this.values.length)];
                this.changeCp1x = this.values[random(0, this.values.length)];
                this.changeCp1y = this.values[random(0, this.values.length)];
                this.changeCp2x = this.values[random(0, this.values.length)];
                this.changeCp2y = this.values[random(0, this.values.length)];
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class NeuralSlinky {
    constructor() {
        this.rx = random(0, w);
        this.ry = random(0, h);
        this.cp1x = random(0, w);
        this.cp1y = random(0, h);
        this.cp2x = random(0, w);
        this.cp2y = random(0, h);
        this.changeRx = random(-3, 3);
        this.changeRy = random(-3, 3);
        this.changeCp1x = random(-3, 3);
        this.changeCp1y = random(-3, 3);
        this.changeCp2x = random(-3, 3);
        this.changeCp2y = random(-3, 3);

        canvas.style.backgroundColor = 'white';
        ctx.shadowColor = randomColor(100, 255, 0.7, 1);
        ctx.strokeStyle = 'rgba(0,0,0,0.7)';
        ctx.shadowBlur = 3;
        ctx.moveTo(this.rx, this.ry);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.beginPath();
                ctx.shadowColor = randomColor(100, 255, 0.7, 1);
                ctx.bezierCurveTo(
                    this.cp1x,
                    this.cp1y,
                    this.cp2x,
                    this.cp2y,
                    this.rx,
                    this.ry
                );
                ctx.stroke();
            }
            this.rx += this.changeRx;
            if (this.rx < 0 || this.rx > w) {
                this.changeRx = -this.changeRx;
            }
            this.ry += this.changeRy;
            if (this.ry < 0 || this.ry > h) {
                this.changeRy = -this.changeRy;
            }
            this.cp1x += this.changeCp1x;
            if (this.cp1x < 0 || this.cp1x > w) {
                this.changeCp1x = -this.changeCp1x;
            }
            this.cp1y += this.changeCp1y;
            if (this.cp1y < 0 || this.cp1y > w) {
                this.changeCp1y = -this.changeCp1y;
            }
            this.cp2x += this.changeCp2x;
            if (this.cp2x < 0 || this.cp2x > h) {
                this.changeCp2x = -this.changeCp2x;
            }
            this.cp2y += this.changeCp2y;
            if (this.cp2y < 0 || this.cp2y > h) {
                this.changeCp2y = -this.changeCp2y;
            }
            t++;
            if (t % (speed * 150) === 0) {
                ctx.beginPath();
                ctx.shadowColor = randomColor(100, 255, 0.7, 1);

                this.rx = random(0, w);
                this.ry = random(0, h);
                ctx.moveTo(this.rx, this.ry);
                this.cp1x = random(0, w);
                this.cp1y = random(0, h);
                this.cp2x = random(0, w);
                this.cp2y = random(0, h);
                this.changeRx = random(-3, 3);
                this.changeRy = random(-3, 3);
                this.changeCp1x = random(-3, 3);
                this.changeCp1y = random(-3, 3);
                this.changeCp2x = random(-3, 3);
                this.changeCp2y = random(-3, 3);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Warp2001 {
    constructor() {
        this.x = 1;
        this.y = 1;
        this.rotate = (random(5, 355) * Math.PI) / 180;

        ctx.strokeStyle = randomColor();
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 3;
        ctx.lineWidth = random(5, 45);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.translate(w / 2, h / 2);
                ctx.moveTo(this.x, this.y);
                this.x *= 1.618;
                this.y *= 1.618;
                if (this.x >= Math.max(w, h)) {
                    this.x = 1;
                    this.y = 1;
                }
                ctx.lineTo(this.x, this.y);
                ctx.stroke();
                ctx.rotate(this.rotate);
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            if (t % (speed * 180) === 0) {
                ctx.beginPath();
                ctx.strokeStyle = randomColor();
                ctx.lineWidth = random(5, 45);
                this.rotate = (random(5, 355) * Math.PI) / 180;
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class VanishingRays {
    constructor() {
        this.letters = [
            1801, 1802, 1803, 1807, 1814, 1816, 1821, 1826, 1827, 1828, 1829,
            1830, 1831, 1833, 1834, 1835, 1836, 1837, 1838, 1839, 1869, 1872,
            1873, 1877, 1879, 1883, 1884, 1888, 1890, 1894, 1899
        ];
        this.incAlpha = 0;
        this.letter = String.fromCharCode(
            this.letters[random(0, this.letters.length)]
        );
        this.angle = 1;
        this.rotations = [20, 24, 30, 36, 40, 45, 60, 72, 80];
        this.rotate = this.rotations[random(0, this.rotations.length)];
        this.fontSize = random(30, 500);
        ctx.fillStyle = randomColor(50, 200, 0.0025, 0.0025);
        ctx.strokeStyle = randomColor(0, 255, 0.8, 0.8);
        ctx.font = `bold ${this.fontSize}px sans-serif`;

        this.draw = () => {
            if (t % speed === 0) {
                if (t % 6 === 0) {
                    ctx.fillRect(0, 0, w, h);
                }
                ctx.strokeText(this.letter.repeat(15), w / 2, h / 2);
                ctx.translate(w / 2, h / 2);
                ctx.rotate(((this.rotate * Math.PI) / 180) * this.angle);
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            if (t % (speed * (1440 / this.rotate)) === 0) {
                ctx.strokeStyle = randomColor(0, 255, 0.8, 0.8);
                this.fontSize = random(30, 500);
                ctx.font = `bold ${this.fontSize}px sans-serif`;
                this.angle *= -1;
            }
            if (t % (speed * 360) === 0) {
                ctx.fillStyle = randomColor(
                    0,
                    255,
                    0.006 + this.incAlpha,
                    0.006 + this.incAlpha
                );
                this.incAlpha += 0.002;
            }
            if (t % (speed * 720) === 0) {
                this.letter = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                );
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Porthole {
    constructor() {
        this.angle = 1;
        this.rotate = random(10, 350);
        this.change = random(-300, 300);

        ctx.fillStyle = randomColor(0, 255, 0.005, 0.005);
        ctx.strokeStyle = randomColor(0, 255, 0.75, 0.75);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.fillRect(
                    0 + this.change,
                    0 + this.change,
                    w - this.change,
                    h - this.change
                );
                ctx.strokeRect(
                    0 + this.change,
                    0 + this.change,
                    w - this.change,
                    h - this.change
                );
                ctx.translate(w / 2, h / 2);
                ctx.rotate(((this.rotate * Math.PI) / 180) * this.angle);
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            if (t % (speed * (1440 / this.rotate)) === 0) {
                ctx.beginPath();
                ctx.strokeStyle = randomColor(0, 255, 0.75, 0.75);
                this.angle *= -1;
            }
            if (t % (speed * 90) === 0) {
                this.change = random(-300, 300);
                this.rotate = random(10, 350);
                ctx.fillStyle = randomColor(0, 255, 0.015, 0.015);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Plaid {
    constructor() {
        this.side1 = random(20, 300);
        this.side2 = random(20, 300);
        this.rows = Math.ceil(h / 100) + 2;
        this.cols = Math.ceil(w / 100) + 2;

        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = 0.3;
        ctx.fillStyle = randomColor(10, 255, 0.2, 0.7);
        ctx.strokeStyle = randomColor(10, 255, 0.2, 0.7);
        ctx.lineWidth = random(1, 13);

        this.draw = () => {
            if (t % speed === 0) {
                for (let i = 0; i <= this.rows; i++) {
                    ctx.translate(w / 2, h / 2);
                    ctx.rotate((45 * Math.PI) / 180);
                    ctx.translate(-w / 2, -h / 2);
                    for (let j = 0; j <= this.cols; j++) {
                        ctx.beginPath();
                        ctx.strokeRect(
                            150 * j - 150,
                            150 * i - 150,
                            this.side1,
                            this.side2
                        );
                        ctx.fillRect(
                            150 * j - 150,
                            150 * i - 150,
                            this.side1,
                            this.side2
                        );
                    }
                }
            }
            t++;
            if (t % (speed * 30) === 0) {
                this.side1 = random(20, 300);
                this.side2 = random(20, 300);
                ctx.lineWidth = random(1, 13);
                ctx.globalCompositeOperation = 'overlay';
                ctx.fillStyle = randomColor(10, 255, 0.2, 0.7);
            }
            if (t % (speed * 60) === 0) {
                ctx.strokeStyle = randomColor(10, 255, 0.2, 0.7);
            }
            if (t * (speed * 90) === 0) {
                ctx.globalCompositeOperation = 'source-over';
            }
            if (t % (speed * 150) === 0) {
                ctx.globalCompositeOperation = 'color';
            }
            if (t % (speed * 240) === 0) {
                ctx.globalCompositeOperation = 'luminosity';
            }
            if (t % (speed * 570) === 0) {
                ctx.globalCompositeOperation = 'hue';
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class ThreeD {
    constructor() {
        this.letters = [
            3044, 3045, 3046, 3047, 3048, 3052, 3054, 3057, 3059, 3063, 3077,
            3079, 3080, 3086, 3087, 3088, 3090, 3093, 3094, 3097, 3100
        ];
        this.letter = String.fromCharCode(
            this.letters[random(0, this.letters.length)]
        );
        this.fontSize = random(12, 38);
        this.rot1 = random(-5, 5);
        this.rot2 = random(2, 11);
        this.rot3 = random(-8, 7);
        this.rot4 = random(4, 18);
        this.rot5 = random(-15, -2);

        ctx.fillStyle = randomColor(0, 255, 0.5, 1);
        ctx.shadowColor = 'black';
        ctx.shadowOffsetX = 4;
        ctx.shadowOffsetY = 4;
        ctx.shadowBlur = 5;
        ctx.textAlign = 'center';
        ctx.font = this.fontSize + 'px sans-serif';

        this.draw = () => {
            if (t % speed === 0) {
                stagger = stagger % 5;
                if (stagger === 0) {
                    ctx.save();
                    ctx.translate(w * 0.25, h * 0.25);
                    ctx.rotate(this.rot1);
                    ctx.fillText(this.letter, w * 0.25, 0);
                    ctx.translate(-w * 0.25, -h * 0.25);
                    ctx.restore();
                }
                if (stagger === 1) {
                    ctx.save();
                    ctx.translate(w * 0.75, h * 0.25);
                    ctx.rotate(this.rot2);
                    ctx.fillText(this.letter, 0, h * 0.25);
                    ctx.translate(-w * 0.75, -h * 0.25);
                    ctx.restore();
                }
                if (stagger === 2) {
                    ctx.save();
                    ctx.translate(w * 0.75, h * 0.75);
                    ctx.rotate(this.rot3);
                    ctx.fillText(this.letter, w * 0.75, 0);
                    ctx.translate(-w * 0.75, -h * 0.75);
                    ctx.restore();
                }
                if (stagger === 3) {
                    ctx.save();
                    ctx.translate(w * 0.25, h * 0.75);
                    ctx.rotate(this.rot4);
                    ctx.fillText(this.letter, 0, h * 0.75);
                    ctx.translate(-w * 0.25, -h * 0.75);
                    ctx.restore();
                }
                if (stagger === 4) {
                    ctx.translate(w / 2, h / 2);
                    ctx.rotate(this.rot5);
                    ctx.fillText(this.letter, 0, 0);
                    ctx.fillText(this.letter, w * 0.125, h * 0.125);
                    ctx.fillText(this.letter, w * 0.875, h * 0.125);
                    ctx.fillText(this.letter, w * 0.875, h * 0.875);
                    ctx.translate(-w / 2, -h / 2);
                    ctx.fillText(this.letter, w * 0.875, h * 0.125);
                }
                stagger++;
            }
            t++;
            if (t % (speed * 75) === 0) {
                this.fontSize = random(12, 38);
                ctx.font = this.fontSize + 'px serif';
            }
            if (t % (speed * 150) === 0) {
                ctx.fillStyle = randomColor(0, 255, 0.5, 1);
                this.rot1 = random(-5, 5);
                this.rot2 = random(2, 11);
                this.rot3 = random(-8, 7);
                this.rot4 = random(4, 18);
                this.rot5 = random(-15, -2);
            }
            if (t % (speed * 300) === 0) {
                this.letter = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                );
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Supernova {
    constructor() {
        this.fib = [0, +Math.random().toFixed(3)];
        this.length =
            this.fib[this.fib.length - 2] + this.fib[this.fib.length - 1] + 3;
        this.rot = random(1, 20);
        this.approach = random(5, 31);

        ctx.fillStyle = randomColor(0, 255, 0.03, 0.06);
        ctx.strokeStyle = randomColor(0, 255, 0.06, 0.12);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.translate(w / 2, h / 2);
                ctx.moveTo(0, 0);
                ctx.fillRect(0, 0, this.length, this.length);
                ctx.strokeRect(0, 0, this.length, this.length);
                ctx.rotate(1.618 * this.rot);
                ctx.translate(-w / 2, -h / 2);
            }
            if (t % (speed * this.approach) === 0) {
                this.fib.push(
                    this.fib[this.fib.length - 2] +
                        this.fib[this.fib.length - 1]
                );
                this.length =
                    this.fib[this.fib.length - 2] +
                    this.fib[this.fib.length - 1] +
                    3;
            }
            if (this.length > Math.max(w, h)) {
                this.length = 0;
                this.approach = random(5, 31);
                this.fib = [0, +Math.random().toFixed(3)];
                this.length =
                    this.fib[this.fib.length - 2] +
                    this.fib[this.fib.length - 1] +
                    3;
                this.rot = random(1, 20);
                ctx.strokeStyle = randomColor(0, 255, 0.06, 0.12);
                ctx.fillStyle = randomColor(0, 255, 0.03, 0.06);
            }
            t++;
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Organic {
    constructor() {
        this.rounded1 = random(10, 180);
        this.rounded2 = random(10, 180);
        this.rounded3 = random(10, 180);
        this.rounded4 = random(10, 180);
        this.decrease = 0.99;
        this.side1 = w / 2;
        this.side2 = h / 2;
        this.rotate = (random(5, 40) * Math.PI) / 180;

        ctx.lineWidth = random(6, 36);
        ctx.strokeStyle = randomColor(0, 255, 0.1, 0.45);
        ctx.fillStyle = randomColor(0, 255, 0.1, 0.45);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.translate(w / 2, h / 2);
                ctx.rotate(this.rotate);
                ctx.roundRect(
                    ctx.lineWidth - 2,
                    ctx.lineWidth - 2,
                    this.side1,
                    this.side2,
                    {
                        upperLeft: this.rounded1,
                        upperRight: this.rounded2,
                        lowerLeft: this.rounded3,
                        lowerRight: this.rounded4
                    },
                    true,
                    true
                );
                ctx.translate(-w / 2, -h / 2);
                this.side1 *= this.decrease;
                this.side2 *= this.decrease;
                if (this.side1 < 10 || this.side2 < 10) this.decrease = 1.01;
                if (this.side1 > w || this.side2 > h) this.decrease = 0.99;
            }
            t++;
            if (t % (speed * 250) === 0) {
                this.rounded1 = random(10, 180);
                this.rounded2 = random(10, 180);
                this.rounded3 = random(10, 180);
                this.rounded4 = random(10, 180);
                ctx.beginPath();
                ctx.lineWidth = random(6, 36);
                ctx.strokeStyle = randomColor(0, 255, 0.1, 0.45);
                ctx.fillStyle = randomColor(0, 255, 0.1, 0.45);
                this.rotate = (random(5, 40) * Math.PI) / 180;
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class UFOs {
    constructor() {
        this.color1 = randomColor();
        this.color2 = randomColor();
        this.color3 = randomColor();
        this.perc1 = random(1, 45);
        this.perc2 = random(1, 45);
        this.repeats = random(10, 150);

        canvas.style.background = `repeating-radial-gradient(circle at center, ${this.color1}, ${this.color2} ${this.perc2}%, ${this.color3} ${this.perc1}% ${this.repeats}px)`;
        ctx.globalCompositeOperation = 'multiply';

        this.draw = () => {
            if (t % speed === 0) {
                canvas.style.background = `repeating-radial-gradient(circle at center, ${
                    this.color1
                }, ${this.color2} ${this.perc2--}%, ${this.color3} ${this
                    .perc1++}% ${this.repeats++}px)`;
            }
            t++;
            if (t % (speed * 40) === 0) {
                ctx.beginPath();
                this.color1 = randomColor();
                this.color2 = randomColor();
                this.color3 = randomColor();
                this.perc1 = random(1, 45);
                this.perc2 = random(1, 45);
                this.repeats = random(10, 150);
                canvas.style.background = `repeating-radial-gradient(circle at center, ${
                    this.color1
                }, ${this.color2} ${this.perc2++}%, ${this.color3} ${this
                    .perc1--}% ${this.repeats}px)`;
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Offsets {
    constructor() {
        this.length = random(20, Math.max(w, h));
        this.rotate = random(7, 27);
        this.isLighten = true;

        ctx.shadowColor = randomColor();
        ctx.shadowOffsetX = random(-200, 200);
        ctx.shadowOffsetY = random(-200, 200);
        ctx.shadowBlur = 3;
        ctx.globalCompositeOperation = 'lighten';
        ctx.fillStyle = randomColor();
        ctx.strokeStyle = randomColor(0, 255, 0.1, 0.1);

        this.draw = () => {
            if (t % speed === 0) {
                stagger = stagger % 2;
                if (stagger === 0) {
                    ctx.lineTo(w / 2 - this.length, h / 2);
                    ctx.stroke();
                }
                if (stagger === 1) {
                    ctx.lineTo(w / 2, h / 2 - this.length);
                    ctx.stroke();
                }
                ctx.translate(w / 2, h / 2);
                ctx.rotate(this.rotate);
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            if (t % (speed * 40) === 0) {
                ctx.fill();
                ctx.beginPath();
                ctx.fillStyle = randomColor();
                this.length = random(20, Math.max(w, h));
            }
            if (t % (speed * 200) === 0) {
                ctx.shadowColor = randomColor();
                ctx.shadowOffsetX = random(-200, 200);
                ctx.shadowOffsetY = random(-200, 200);
            }
            if (t % (speed * 400) === 0) {
                this.isLighten = !this.isLigthen;
                ctx.strokeStyle = randomColor(0, 255, 0.1, 0.1);
                ctx.globalCompositeOperation = this.isLighten
                    ? 'lighten'
                    : 'darken';
                this.rotate = random(1, 37);
            }
            stagger++;
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Rounded {
    constructor() {
        this.rounded1 = random(15, 50);
        this.rounded2 = random(15, 50);
        this.rounded3 = random(15, 50);
        this.rounded4 = random(15, 50);
        this.side1 = random(0, w / 4);
        this.side2 = random(0, h / 4);
        this.rotate = (random(1, 359) * Math.PI) / 180;

        ctx.strokeStyle = randomColor(50, 255, 0.5, 1);
        ctx.filter = 'contrast(2)';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';

        this.draw = () => {
            if (t % speed === 0) {
                ctx.translate(w / 2, h / 2);
                ctx.rotate(this.rotate);
                ctx.roundRect(
                    this.side1,
                    this.side2,
                    this.side1,
                    this.side2,
                    {
                        upperLeft: this.rounded1,
                        upperRight: this.rounded2,
                        lowerLeft: this.rounded3,
                        lowerRight: this.rounded4
                    },
                    true,
                    true
                );
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            if (t % (speed * 125) === 0) {
                this.rounded1 = random(15, 50);
                this.rounded2 = random(15, 50);
                this.rounded3 = random(15, 50);
                this.rounded4 = random(15, 50);
                this.side1 = random(0, w / 4);
                this.side2 = random(0, h / 4);
                this.rotate = (random(1, 359) * Math.PI) / 180;
                ctx.beginPath();
                ctx.strokeStyle = randomColor(50, 255, 0.5, 1);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Spikey {
    constructor() {
        this.rounded1 = random(75, 475);
        this.rounded2 = random(75, 475);
        this.rounded3 = random(75, 475);
        this.rounded4 = random(75, 475);
        this.side1 = random(0, w);
        this.side2 = random(0, h);
        this.side3 = random(0, w);
        this.side4 = random(0, h);
        this.rotate = (random(2, 358) * Math.PI) / 180;

        ctx.beginPath();
        ctx.moveTo(w / 2, h / 2);
        ctx.strokeStyle = randomColor(60, 255, 1, 1);
        ctx.lineWidth = 0.1;

        this.draw = () => {
            if (t % speed === 0) {
                stagger = stagger % 2;
                if (stagger === 0) {
                    ctx.translate(w / 2, h / 2);
                    ctx.rotate(this.rotate);
                    ctx.roundRect(
                        this.side1--,
                        this.side2--,
                        this.side1--,
                        this.side2--,
                        {
                            upperLeft: this.rounded1++,
                            upperRight: this.rounded2++,
                            lowerLeft: this.rounded3++,
                            lowerRight: this.rounded4++
                        },
                        false,
                        true
                    );
                    ctx.translate(-w / 2, -h / 2);
                }
                if (stagger === 1) {
                    ctx.translate(w / 2, h / 2);
                    ctx.rotate(this.rotate);
                    ctx.roundRect(
                        this.side3++,
                        this.side4++,
                        this.side3++,
                        this.side4++,
                        {
                            upperLeft: this.rounded3--,
                            upperRight: this.rounded4--,
                            lowerLeft: this.rounded2--,
                            lowerRight: this.rounded1--
                        },
                        false,
                        true
                    );
                    ctx.translate(-w / 2, -h / 2);
                }
                stagger++;
            }
            t++;
            if (t % (speed * 400) === 0) {
                canvas.width = canvas.height = 0;
                canvas.width = w;
                canvas.height = h;
                this.rounded1 = random(75, 475);
                this.rounded2 = random(75, 475);
                this.rounded3 = random(75, 475);
                this.rounded4 = random(75, 475);
                this.side1 = random(0, w / 4);
                this.side2 = random(0, h / 4);
                ctx.beginPath();
                ctx.strokeStyle = randomColor(0, 255, 0.15, 0.6);
                this.rotate = (random(2, 358) * Math.PI) / 180;
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Radiance {
    constructor() {
        this.rounded1 = random(15, 50);
        this.rounded2 = random(15, 50);
        this.rounded3 = random(15, 50);
        this.rounded4 = random(15, 50);
        this.x1 = random(0, w / 2);
        this.y1 = random(0, h / 2);
        this.x2 = random(w / 2, w);
        this.y2 = random(0, h / 2);
        this.x3 = random(w / 2, w);
        this.y3 = random(h / 2, h);
        this.x4 = random(0, w / 2);
        this.y4 = random(h / 2, h);
        this.side1 = random(60, w / 2);
        this.side2 = random(60, h / 2);
        this.side3 = random(60, w / 2);
        this.side4 = random(60, h / 2);
        this.side5 = random(60, w / 2);
        this.side6 = random(60, h / 2);
        this.side7 = random(60, w / 2);
        this.side8 = random(60, h / 2);
        this.color1 = randomColor();
        this.color2 = randomColor();
        this.color3 = randomColor();
        this.color4 = randomColor();
        this.rotate = random(1, 11);

        ctx.fillStyle = randomColor(0, 255, 0.01, 0.05);

        this.draw = () => {
            if (t % speed === 0) {
                stagger = stagger % 4;
                if (stagger === 0) {
                    ctx.strokeStyle = this.color1;
                    ctx.roundRect(
                        this.x1,
                        this.y1,
                        this.side1,
                        this.side2,
                        {
                            upperLeft: this.rounded1,
                            upperRight: this.rounded1,
                            lowerLeft: this.rounded1,
                            lowerRight: this.rounded1
                        },
                        true,
                        true
                    );
                }
                if (stagger === 1) {
                    ctx.strokeStyle = this.color2;
                    ctx.roundRect(
                        this.x2,
                        this.y2,
                        this.side3,
                        this.side4,
                        {
                            upperLeft: this.rounded2,
                            upperRight: this.rounded2,
                            lowerLeft: this.rounded2,
                            lowerRight: this.rounded2
                        },
                        true,
                        true
                    );
                }
                if (stagger === 2) {
                    ctx.strokeStyle = this.color3;
                    ctx.roundRect(
                        this.x3,
                        this.y3,
                        this.side5,
                        this.side6,
                        {
                            upperLeft: this.rounded3,
                            upperRight: this.rounded3,
                            lowerLeft: this.rounded3,
                            lowerRight: this.rounded3
                        },
                        true,
                        true
                    );
                }
                if (stagger === 3) {
                    ctx.strokeStyle = this.color4;
                    ctx.roundRect(
                        this.x4,
                        this.y4,
                        this.side7,
                        this.side8,
                        {
                            upperLeft: this.rounded4,
                            upperRight: this.rounded4,
                            lowerLeft: this.rounded4,
                            lowerRight: this.rounded4
                        },
                        true,
                        true
                    );
                }
                ctx.translate(w / 2, h / 2);
                ctx.rotate(this.rotate);
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            if (t % (speed * 500) === 0) {
                this.rounded1 = random(15, 50);
                this.rounded2 = random(15, 50);
                this.rounded3 = random(15, 50);
                this.rounded4 = random(15, 50);
                this.x1 = random(0, w / 2);
                this.y1 = random(0, h / 2);
                this.x2 = random(w / 2, w);
                this.y2 = random(0, h / 2);
                this.x3 = random(w / 2, w);
                this.y3 = random(h / 2, h);
                this.x4 = random(0, w / 2);
                this.y4 = random(h / 2, h);
                this.side1 = random(60, w / 2);
                this.side2 = random(60, h / 2);
                this.side3 = random(60, w / 2);
                this.side4 = random(60, h / 2);
                this.side5 = random(60, w / 2);
                this.side6 = random(60, h / 2);
                this.side7 = random(60, w / 2);
                this.side8 = random(60, h / 2);
                this.color1 = randomColor();
                this.color2 = randomColor();
                this.color3 = randomColor();
                this.color4 = randomColor();

                ctx.fillStyle = randomColor(0, 255, 0.01, 0.05);
            }
            if (t % (speed * 1500) === 0) {
                this.rotate = random(1, 11);
            }
            stagger++;
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Universe {
    constructor() {
        this.rounded1 = random(5, 250);
        this.rounded2 = random(5, 250);
        this.rounded3 = random(5, 250);
        this.rounded4 = random(5, 250);
        this.x1 = random(0, w);
        this.y1 = random(0, h);
        this.x2 = random(0, w);
        this.y2 = random(0, h);
        this.x3 = random(0, w);
        this.y3 = random(0, h);
        this.x4 = random(0, w);
        this.y4 = random(0, h);
        this.side1 = random(20, w);
        this.side2 = random(20, h);
        this.side3 = random(20, w);
        this.side4 = random(20, h);
        this.side5 = random(20, w);
        this.side6 = random(20, h);
        this.side7 = random(20, w);
        this.side8 = random(20, h);
        this.rotate = random(1, 11);

        ctx.strokeStyle = randomColor(0, 255, 0.5, 1);
        ctx.fillStyle = randomColor(0, 255, 0.01, 0.05);

        this.draw = () => {
            if (t % speed === 0) {
                stagger = stagger % 4;
                if (stagger === 0) {
                    ctx.roundRect(
                        this.x1++,
                        this.y1++,
                        this.side1++,
                        this.side2++,
                        {
                            upperLeft: this.rounded1++,
                            upperRight: this.rounded1++,
                            lowerLeft: this.rounded1++,
                            lowerRight: this.rounded1++
                        },
                        false,
                        true
                    );
                }
                if (stagger === 1) {
                    ctx.roundRect(
                        this.x2--,
                        this.y2--,
                        this.side3--,
                        this.side4--,
                        {
                            upperLeft: this.rounded2++,
                            upperRight: this.rounded2++,
                            lowerLeft: this.rounded2++,
                            lowerRight: this.rounded2++
                        },
                        false,
                        true
                    );
                }
                if (stagger === 2) {
                    ctx.roundRect(
                        this.x3++,
                        this.y3++,
                        this.side5++,
                        this.side6++,
                        {
                            upperLeft: this.rounded3--,
                            upperRight: this.rounded3--,
                            lowerLeft: this.rounded3--,
                            lowerRight: this.rounded3--
                        },
                        false,
                        true
                    );
                }
                if (stagger === 3) {
                    ctx.roundRect(
                        this.x4,
                        this.y4,
                        this.side7,
                        this.side8,
                        {
                            upperLeft: this.rounded4++,
                            upperRight: this.rounded4++,
                            lowerLeft: this.rounded4--,
                            lowerRight: this.rounded4--
                        },
                        false,
                        true
                    );
                }
                ctx.translate(w / 2, h / 2);
                ctx.rotate(this.rotate);
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            if (t % (speed * 250) === 0) {
                this.rounded1 = random(15, 50);
                this.rounded2 = random(15, 50);
                this.rounded3 = random(15, 50);
                this.rounded4 = random(15, 50);
                this.x1 = random(0, w / 2);
                this.y1 = random(0, h / 2);
                this.x2 = random(w / 2, w);
                this.y2 = random(0, h / 2);
                this.x3 = random(w / 2, w);
                this.y3 = random(h / 2, h);
                this.x4 = random(0, w / 2);
                this.y4 = random(h / 2, h);
                this.side1 = random(60, w / 2);
                this.side2 = random(60, h / 2);
                this.side3 = random(60, w / 2);
                this.side4 = random(60, h / 2);
                this.side5 = random(60, w / 2);
                this.side6 = random(60, h / 2);
                this.side7 = random(60, w / 2);
                this.side8 = random(60, h / 2);
                this.rotate = random(1, 11);
                ctx.strokeStyle = randomColor(0, 255, 0.5, 1);
                ctx.fillStyle = randomColor(0, 255, 0.01, 0.05);
            }
            stagger++;
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class ParallelUniverses {
    constructor() {
        this.rounded1 = random(5, 250);
        this.rounded2 = random(5, 250);
        this.rounded3 = random(5, 250);
        this.rounded4 = random(5, 250);
        this.x1 = random(0, w);
        this.y1 = random(0, h);
        this.x2 = random(0, w);
        this.y2 = random(0, h);
        this.x3 = random(0, w);
        this.y3 = random(0, h);
        this.x4 = random(0, w);
        this.y4 = random(0, h);
        this.side1 = random(20, w);
        this.side2 = random(20, h);
        this.side3 = random(20, w);
        this.side4 = random(20, h);
        this.side5 = random(20, w);
        this.side6 = random(20, h);
        this.side7 = random(20, w);
        this.side8 = random(20, h);
        this.rotate = random(1, 11);
        this.color1 = randomColor(0, 255, 0.05, 0.1);
        this.color2 = randomColor(0, 255, 0.05, 0.1);

        this.draw = () => {
            if (t % speed === 0) {
                stagger = stagger % 4;
                if (stagger === 0) {
                    ctx.fillStyle = this.color1;
                    ctx.roundRect(
                        this.x1++,
                        this.y1++,
                        this.side1++,
                        this.side2++,
                        {
                            upperLeft: this.rounded1++,
                            upperRight: this.rounded1++,
                            lowerLeft: this.rounded1++,
                            lowerRight: this.rounded1++
                        },
                        true,
                        false
                    );
                }
                if (stagger === 1) {
                    ctx.fillStyle = this.color2;
                    ctx.roundRect(
                        this.x2--,
                        this.y2--,
                        this.side3--,
                        this.side4--,
                        {
                            upperLeft: this.rounded2++,
                            upperRight: this.rounded2++,
                            lowerLeft: this.rounded2++,
                            lowerRight: this.rounded2++
                        },
                        true,
                        false
                    );
                }
                if (stagger === 2) {
                    ctx.fillStyle = this.color1;
                    ctx.roundRect(
                        this.x3++,
                        this.y3++,
                        this.side5++,
                        this.side6++,
                        {
                            upperLeft: this.rounded3--,
                            upperRight: this.rounded3--,
                            lowerLeft: this.rounded3--,
                            lowerRight: this.rounded3--
                        },
                        true,
                        false
                    );
                }
                if (stagger === 3) {
                    ctx.fillStyle = this.color2;
                    ctx.roundRect(
                        this.x4,
                        this.y4,
                        this.side7,
                        this.side8,
                        {
                            upperLeft: this.rounded4++,
                            upperRight: this.rounded4++,
                            lowerLeft: this.rounded4--,
                            lowerRight: this.rounded4--
                        },
                        true,
                        false
                    );
                }
                ctx.translate(w / 2, h / 2);
                ctx.rotate(this.rotate);
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            if (t % (speed * 200) === 0) {
                this.rounded1 = random(5, 250);
                this.rounded2 = random(5, 250);
                this.rounded3 = random(5, 250);
                this.rounded4 = random(5, 250);
                this.x1 = random(0, w / 2);
                this.y1 = random(0, h / 2);
                this.x2 = random(w / 2, w);
                this.y2 = random(0, h / 2);
                this.x3 = random(w / 2, w);
                this.y3 = random(h / 2, h);
                this.x4 = random(0, w / 2);
                this.y4 = random(h / 2, h);
                this.side1 = random(20, w);
                this.side2 = random(20, h);
                this.side3 = random(20, w);
                this.side4 = random(20, h);
                this.side5 = random(20, w);
                this.side6 = random(20, h);
                this.side7 = random(20, w);
                this.side8 = random(20, h);
                this.rotate = random(1, 11);
                this.color1 = randomColor(0, 255, 0.05, 0.1);
                this.color2 = randomColor(0, 255, 0.05, 0.1);
            }
            stagger++;
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Atom {
    constructor() {
        this.change = 0;
        this.rate = random(5, 105);
        this.rotate = random(5, 24);

        ctx.shadowBlur = 1;
        ctx.shadowColor = randomColor();
        ctx.strokeStyle = randomColor();

        this.draw = () => {
            if (t % speed === 0) {
                ctx.lineTo(w / 2 + this.change, h / 2);
                ctx.stroke();
                this.change += this.rate;
                if (
                    Math.abs(this.change) >
                    Math.max(w / 2, h / 2 || this.change + this.rate <= 0)
                ) {
                    this.rate = -this.rate;
                }
                ctx.translate(w / 2, h / 2);
                ctx.rotate((this.rotate * Math.PI) / 180);
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            if (t % (speed * 450) === 0) {
                this.change = 0;
                this.rate = random(5, 105);
                this.rotate = random(5, 24);
                ctx.beginPath();
                ctx.shadowColor = 'black';
                ctx.strokeStyle = randomColor();
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Geometer {
    constructor() {
        this.change = 0;
        this.rate = random(25, 250);
        this.rotate = random(23, 179);

        ctx.shadowColor = 'black';
        ctx.strokeStyle = randomColor();
        ctx.lineWidth = random(2, 7);
        ctx.shadowBlur = 1;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.lineTo(w / 2 + this.change, h / 2 + this.change);
                ctx.stroke();
                this.change += this.rate;
                if (
                    Math.abs(this.change + this.rate) >
                    Math.max(w / 2, h / 2 || this.change + this.rate <= 0)
                ) {
                    this.rate = -this.rate;
                }
                ctx.translate(w / 2, h / 2);
                ctx.rotate((this.rotate * Math.PI) / 180);
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            if (t % (speed * 180) === 0) {
                this.change = 0;
                this.rate = random(25, 250);
                this.rotate = random(23, 179);
                ctx.beginPath();
                ctx.lineWidth = random(2, 7);
                let color = Math.random();
                if (color < 0.2) {
                    ctx.strokeStyle = 'white';
                    ctx.shadowColor = 'black';
                } else if (color < 0.4) {
                    ctx.strokeStyle = 'black';
                    ctx.shadowColor = 'white';
                } else {
                    ctx.strokeStyle = randomColor();
                    ctx.shadowColor = 'black';
                }
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Comets {
    constructor() {
        this.change = 0;
        this.rate = random(1, 7);
        this.rotate = random(3, 13);

        speed = 1;

        ctx.shadowColor = ctx.strokeStyle = randomColor();
        ctx.lineWidth = random(3, 12);
        ctx.shadowBlur = ctx.lineWidth;
        ctx.beginPath();

        this.draw = () => {
            if (t % speed === 0) {
                stagger = stagger % 4;
                if (stagger === 0) {
                    ctx.lineTo(w / 2 + this.change, h / 2);
                }
                if (stagger === 1) {
                    ctx.stroke();
                }
                if (stagger === 2) {
                    this.change += this.rate;
                    ctx.translate(w / 2, h / 2);
                    ctx.rotate((this.rotate * Math.PI) / 180);
                    ctx.translate(-w / 2, -h / 2);
                }
            }
            t++;
            if (t % (speed * 720) === 0) {
                this.change = 0;
                ctx.lineWidth = random(3, 12);
                ctx.shadowBlur = ctx.lineWidth;
                this.rate = random(1, 7);
                this.rotate = random(3, 13);
                ctx.beginPath();
                ctx.shadowColor = ctx.strokeStyle = randomColor();
            }
            stagger++;
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Maelstrom {
    constructor() {
        this.cp1 = random(0, w);
        this.cp2 = random(0, h);
        this.x1 = random(0, w);
        this.y1 = random(0, h);
        this.angle = random(1, 200);

        ctx.strokeStyle = randomColor();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';

        this.draw = () => {
            if (t % speed === 0) {
                ctx.moveTo(w / 2, h / 2);
                ctx.quadraticCurveTo(this.cp1, this.cp2, this.x1++, this.y1++);
                ctx.stroke();
                ctx.translate(w / 2, h / 2);
                ctx.rotate((this.angle * Math.PI) / 180);
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            if (t % (speed * 300) === 0) {
                ctx.fillRect(-w, -h, 3 * w, 3 * h);
                this.cp1 = random(0, w);
                this.cp2 = random(0, h);
                this.x1 = random(0, w);
                this.y1 = random(0, h);
                this.angle = random(1, 200);
                ctx.beginPath();
                ctx.strokeStyle = randomColor();
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Maelstrom2 {
    constructor() {
        this.cp1 = random(0, w);
        this.cp2 = random(0, h);
        this.alter1 = random(-5, 5);
        this.alter2 = random(-5, 5);
        this.alter3 = random(-5, 5);
        this.alter4 = random(-5, 5);
        this.x1 = random(0, w);
        this.y1 = random(0, h);
        this.angle = random(10, 350);

        ctx.lineWidth = 0.1;
        ctx.strokeStyle = randomColor(0, 255, 0.7, 1);
        ctx.fillStyle = randomColor(0, 255, 0.2, 0.4);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.moveTo(w / 2, h / 2);
                ctx.quadraticCurveTo(this.cp1, this.cp2, this.x1, this.y1);
                this.cp1 += this.alter1;
                if (this.cp1 > 2 * w || this.cp1 < -w) {
                    this.alter1 = -this.alter1;
                }
                this.cp2 += this.alter2;
                if (this.cp2 > 2 * h || this.cp2 < -h) {
                    this.alter2 = -this.alter2;
                }
                this.x1 += this.alter3;
                if (this.x1 > 2 * w || this.x1 < -w) {
                    this.alter3 = -this.alter3;
                }
                this.y1 += this.alter4;
                if (this.y1 > 2 * h || this.y1 < -h) {
                    this.alter4 = -this.alter4;
                }
                ctx.stroke();
                ctx.translate(w / 2, h / 2);
                ctx.rotate((this.angle * Math.PI) / 180);
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            if (t % (speed * 240) === 0) {
                ctx.fillRect(-w, -h, 3 * w, 3 * h);
                this.cp1 = random(0, w);
                this.cp2 = random(0, h);
                this.x1 = random(0, w);
                this.y1 = random(0, h);
                this.alter1 = random(-5, 5);
                this.alter2 = random(-5, 5);
                this.alter3 = random(-5, 5);
                this.alter4 = random(-5, 5);
                this.angle = random(10, 350);
                ctx.beginPath();
                ctx.strokeStyle = randomColor(0, 255, 0.7, 1);
                ctx.fillStyle = randomColor(0, 255, 0.2, 0.4);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Lollipottery {
    constructor() {
        this.radius = random(50, Math.max(w, h) / 2);
        this.alter = random(-50, 50);

        ctx.lineWidth = random(2, 14);
        ctx.globalCompositeOperation = 'overlay';
        ctx.strokeStyle = randomColor();
        ctx.shadowColor = randomColor();
        ctx.shadowBlur = 4;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.arc(w / 2, h / 2, this.radius, 0, 2 * Math.PI);
                this.radius += this.alter;
                if (this.radius > Math.max(w, h) || this.radius <= 40) {
                    this.radius = random(50, Math.max(w, h) / 2);
                    this.alter = random(-50, 50);
                    ctx.lineWidth = random(2, 14);
                }
                ctx.stroke();
                ctx.beginPath();
            }
            t++;
            if (t % (speed * 150) === 0) {
                this.radius = random(50, Math.max(w, h));
                this.alter = random(-50, 50);
                ctx.lineWidth = random(1, 12);
                ctx.beginPath();
                ctx.strokeStyle = randomColor();
                ctx.shadowColor = randomColor();
                ctx.globalCompositeOperation = 'overlay';
            }
            if (t % (speed * 600) === 0) {
                ctx.globalCompositeOperation = 'source-over';
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Picnic {
    constructor() {
        this.radius = random(10, 450);
        this.rows = Math.ceil(h / 150) + 2;
        this.cols = Math.ceil(w / 150) + 2;

        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = randomColor(10, 255, 0.2, 0.5);
        ctx.lineWidth = random(1, 25);

        this.draw = () => {
            if (t % speed === 0) {
                for (let i = 0; i <= this.rows; i++) {
                    for (let j = 0; j <= this.cols; j++) {
                        ctx.beginPath();
                        ctx.arc(
                            225 * j - 225,
                            225 * i - 225,
                            this.radius,
                            0,
                            2 * Math.PI
                        );
                        ctx.stroke();
                    }
                }
            }
            t++;
            if (t % (speed * 30) === 0) {
                this.radius = random(10, 450);
                ctx.lineWidth = random(1, 25);
                ctx.strokeStyle = randomColor(10, 255, 0.2, 0.5);
                ctx.globalCompositeOperation = 'source-over';
            }
            if (t * (speed * 90) === 0) {
                ctx.globalCompositeOperation = 'overlay';
            }
            if (t % (speed * 150) === 0) {
                ctx.globalCompositeOperation = 'color';
            }
            if (t % (speed * 240) === 0) {
                ctx.globalCompositeOperation = 'luminosity';
            }
            if (t % (speed * 570) === 0) {
                ctx.globalCompositeOperation = 'hue';
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class BehindBars {
    constructor() {
        this.rows = Math.ceil(h / 50) + 2;
        this.cols = Math.ceil(w / 50) + 2;
        this.rotate = random(1, 60);

        ctx.strokeStyle = randomColor();
        ctx.lineWidth = random(3, 75);
        ctx.shadowColor = randomColor();
        ctx.globalCompositeOperation = 'overlay';
        ctx.shadowBlur = ctx.lineWidth > 30 ? 30 : ctx.lineWidth;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'bevel';

        this.draw = () => {
            if (t % speed === 0) {
                for (let i = 0; i <= this.rows; i++) {
                    for (let j = 0; j <= this.cols; j++) {
                        ctx.beginPath();
                        ctx.moveTo(200 * j - 200, 200 * i - 200);
                        ctx.lineTo(200 * j, 200 * i);
                        ctx.stroke();
                    }
                }
            }
            t++;
            if (t % (speed * 15) === 0) {
                ctx.globalCompositeOperation = 'overlay';
                ctx.strokeStyle = randomColor();
                ctx.translate(w / 2, h / 2);
                ctx.rotate(this.rotate);
                ctx.translate(-w / 2, -h / 2);
            }
            if (t % (speed * 180) === 0) {
                ctx.globalCompositeOperation = 'source-over';
                this.rotate = random(1, 60);
                ctx.lineWidth = random(3, 75);
                ctx.shadowBlur = ctx.lineWidth > 30 ? 30 : ctx.lineWidth;
                ctx.shadowColor = randomColor();
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Shadowy {
    constructor() {
        this.letters = [
            3201, 3202, 3203, 3205, 3207, 3208, 3209, 3210, 3215, 3218, 3219,
            3223, 3225, 3231, 3235, 3236, 3238, 3246, 3247, 3249, 3250, 3254,
            3255, 3256, 3257, 3260, 3262, 3265, 3266, 3268, 3271, 3272, 3274,
            3275, 3285, 3287, 3296, 3297
        ];
        this.letter = String.fromCharCode(
            this.letters[random(0, this.letters.length)]
        );
        this.rotate = random(5, 355);
        this.fontSize = random(30, 100);

        ctx.font = `bold ${this.fontSize}px serif`;
        ctx.shadowColor = randomColor(55, 255, 0.7, 1);
        ctx.shadowBlur = 50;
        ctx.textAlign = 'right';
        ctx.globalCompositeOperation = 'overlay';
        ctx.strokeStyle = randomColor(0, 0, 0.15, 0.4);
        ctx.fillStyle = randomColor(0, 0, 0.15, 0.4);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.fillText(this.letter, w / 2, h / 2);
                ctx.strokeText(this.letter, w / 2, h / 2);
                ctx.translate(w / 2, h / 2);
                ctx.rotate((this.rotate * Math.PI) / 180);
                ctx.fillText(this.letter, w / 2, h / 2);
                ctx.strokeText(this.letter, w / 2, h / 2);
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            if (t % (speed * 75) === 0) {
                ctx.shadowColor = randomColor(55, 255, 0.7, 1);
                this.fontSize = random(30, 100);
                ctx.font = `bold ${this.fontSize}px serif`;
                this.rotate = random(5, 355);
            }
            if (t % (speed * 225) === 0) {
                ctx.strokeStyle = randomColor(0, 0, 0.15, 0.4);
                ctx.fillStyle = randomColor(0, 0, 0.15, 0.4);
            }
            if (t % (speed * 450) === 0) {
                this.letter = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                );
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class RadioWaves {
    constructor() {
        this.first = 0;
        this.second = 1;
        this.divisors = [2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 20, 24, 30, 36];
        this.divisor = this.divisors[random(0, this.divisors.length)];
        this.posX = this.divisors[random(0, this.divisors.length)];
        this.posY = this.divisors[random(0, this.divisors.length)];
        this.seq = [this.first, this.second];

        ctx.globalCompositeOperation = 'copy';
        ctx.shadowColor = ctx.strokeStyle = randomColor(30, 255, 1, 1);
        ctx.shadowBlur = 2;
        ctx.lineWidth = 0.5;

        this.draw = () => {
            if (t % speed === 0) {
                let radius = this.seq[0] + this.seq[1];
                this.seq.push(radius);
                this.seq.shift();
                if (radius > Math.max(w, h)) {
                    this.first++;
                    this.second++;
                    this.seq = [this.first, this.second];
                    ctx.translate(w / 2, h / 2);
                    ctx.rotate(Math.PI / this.divisor);
                    ctx.translate(-w / 2, -h / 2);
                }
                ctx.arc(w / this.posX, h / this.posY, radius, 0, 2 * Math.PI);
                ctx.stroke();
            }
            t++;
            if (t % (speed * 360) === 0) {
                ctx.beginPath();
                ctx.shadowColor = ctx.strokeStyle = randomColor(30, 255, 1, 1);
                this.divisor = this.divisors[random(0, this.divisors.length)];
                this.posX = this.divisors[random(0, this.divisors.length)];
                this.posY = this.divisors[random(0, this.divisors.length)];
            }
            if (t % (speed * 1440) === 0) {
                this.first = 0;
                this.second = 1;
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Starship {
    constructor() {
        this.first = 0;
        this.second = 1;
        this.divisors = [2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, 20, 24, 30, 36];
        this.divisor = this.divisors[random(0, this.divisors.length)];
        this.seq = [this.first, this.second];

        ctx.globalCompositeOperation = 'hard-light';
        ctx.shadowColor = ctx.strokeStyle = randomColor(0, 255, 0.6, 1);
        ctx.shadowBlur = 2;
        ctx.lineWidth = 0.1;

        this.draw = () => {
            if (t % speed === 0) {
                let radius = this.seq[0] + this.seq[1];
                this.seq.push(radius);
                this.seq.shift();
                if (radius > Math.max(w, h)) {
                    this.first++;
                    this.second++;
                    this.seq = [this.first, this.second];
                    ctx.translate(w / 2, h / 2);
                    ctx.rotate(Math.PI / this.divisor);
                    ctx.translate(-w / 2, -h / 2);
                }
                ctx.arc(w / 2, h / 2, radius, 0, 2 * Math.PI);
                ctx.stroke();
            }
            t++;
            if (t % (speed * 240) === 0) {
                ctx.beginPath();
                ctx.shadowColor = ctx.strokeStyle = randomColor(0, 255, 0.6, 1);
                this.divisor = this.divisors[random(0, this.divisors.length)];
            }
            if (t % (speed * 1200) === 0) {
                this.first = 0;
                this.second = 1;
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class CrystalTiles {
    constructor() {
        this.gray = random(50, 215);
        this.y = 0;
        this.x = 0;
        this.size = random(50, 150);
        this.rotate = random(1, 15);
        this.modes = [
            'source-over',
            'lighter',
            'xor',
            'overlay',
            'multiply',
            'screen',
            'overlay',
            'darken',
            'lighten',
            'color-dodge',
            'color-burn',
            'hard-light',
            'overlay',
            'soft-light',
            'difference',
            'saturation',
            'luminosity',
            'overlay'
        ];

        ctx.strokeStyle = 'white';
        ctx.globalCompositeOperation = 'overlay';
        ctx.lineWidth = random(1, 4);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.strokeRect(this.x, this.y, this.size, this.size);
                ctx.fillStyle = randomColor();
                ctx.fillRect(this.x, this.y, this.size, this.size);
                this.x += this.size;
                if (this.x > w) {
                    this.x = 0;
                    this.y += this.size;
                }
                if (this.y > h) {
                    this.x = 0;
                    this.y = 0;
                    ctx.translate(w / 2, h / 2);
                    ctx.rotate(this.rotate);
                    ctx.translate(-w / 2, -h / 2);
                    this.size = random(35, 150);
                    ctx.globalCompositeOperation =
                        this.modes[random(0, this.modes.length)];
                }
            }
            t++;
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Wallpapering {
    constructor() {
        this.y = 0;
        this.x = 0;
        this.size = random(50, 200);
        this.modes = [
            'source-over',
            'lighter',
            'xor',
            'overlay',
            'multiply',
            'screen',
            'overlay',
            'darken',
            'lighten',
            'color-dodge',
            'color-burn',
            'hard-light',
            'overlay',
            'soft-light',
            'difference',
            'saturation',
            'luminosity',
            'overlay'
        ];

        ctx.strokeStyle = 'black';
        ctx.lineWidth = 3;
        ctx.globalCompositeOperation = 'overlay';

        this.draw = () => {
            if (t % speed === 0) {
                ctx.strokeRect(this.x, this.y, this.size, this.size);
                ctx.fillStyle = randomColor();
                ctx.fillRect(this.x, this.y, this.size, this.size);
                this.x += this.size;
                if (this.x > w) {
                    this.x = 0;
                    this.y += this.size;
                }
                if (this.y > h) {
                    this.x = 0;
                    this.y = 0;
                    this.size = random(35, 200);
                    ctx.globalCompositeOperation =
                        this.modes[random(0, this.modes.length)];
                }
            }
            t++;
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class PietriDish {
    constructor() {
        this.y = 0;
        this.x = 0;
        this.size = random(15, 115);
        this.rotate = random(1, 90);

        ctx.globalCompositeOperation = 'overlay';
        ctx.shadowColor = randomColor(100, 255, 0.75, 1);
        ctx.fillStyle = randomColor();
        ctx.strokeStyle = randomColor();
        ctx.lineWidth = random(2, 18);
        ctx.shadowBlur = 35;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.beginPath();
                ctx.arc(
                    this.x - this.size / 2,
                    this.y - this.size / 2,
                    this.size / 2,
                    0,
                    2 * Math.PI
                );
                ctx.stroke();
                ctx.fill();
                this.x += this.size;
                if (this.x > w) {
                    this.x = 0;
                    this.y += this.size;
                }
                if (this.y > h) {
                    this.x = 0;
                    this.y = 0;
                    this.size = random(15, 115);
                }
            }
            t++;
            if (t % (speed * 150) === 0) {
                this.rotate = random(1, 90);
                ctx.lineWidth = random(2, 18);
                if (Math.random() < 0.2) {
                    ctx.fillStyle = 'black';
                } else {
                    ctx.fillStyle = randomColor();
                }
                ctx.shadowColor = randomColor(100, 255, 0.75, 1);
            }
            if (t % (speed * 450) === 0) {
                ctx.beginPath();
                this.size = random(15, 85);
                ctx.strokeStyle = randomColor();
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.rotate * Math.PI) / 180);
            ctx.translate(-w / 2, -h / 2);
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Autumn {
    constructor() {
        this.y = 0;
        this.x = 0;
        this.size = random(13, 110);
        this.rotate = random(1, 90);

        ctx.fillStyle = randomColor(0, 255, 0.1, 0.6);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI);
                ctx.fill();
                this.x += this.size;
                if (this.x > w) {
                    this.x = 0;
                    this.y += this.size;
                    this.size = random(15, 110);
                }
                if (this.y > h) {
                    this.x = 0;
                    this.y = 0;
                    this.rotate = random(1, 90);
                    ctx.fillStyle = randomColor(0, 255, 0.1, 0.6);
                }
            }
            t++;
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.rotate * Math.PI) / 180);
            ctx.translate(-w / 2, -h / 2);
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Polyhedra {
    constructor() {
        this.x = random(0, w);
        this.y = random(0, h);
        this.rotations = [
            1, 2, 4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 16, 17, 19, 20, 21, 23, 27,
            28, 29
        ];
        this.rotate = this.rotations[random(0, this.rotations.length)];

        ctx.fillStyle = randomColor(0, 255, 0.01, 0.05);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.lineTo(this.x, this.y);
                ctx.fill();
                ctx.translate(w / 2, h / 2);
                ctx.rotate(this.rotate);
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            if (t % (speed * 60) === 0) {
                this.x = random(0, w);
                this.y = random(0, h);
                ctx.beginPath();
                ctx.fillStyle = randomColor(0, 255, 0.01, 0.05);
                this.rotate = this.rotations[random(0, this.rotations.length)];
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Perspective {
    constructor() {
        this.color1 = randomColor();
        this.color2 = randomColor();
        this.skewX = Math.random(0, 255, 0.2, 0.6);
        this.skewY = Math.random(0, 255, 0.2, 0.6);
        this.size = 20;

        ctx.fillStyle = this.color1;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.setTransform(2, this.skewX, this.skewY, 2, 0, 0);
                ctx.fillStyle = this.color1;
                ctx.fillRect(
                    Math.round(random(-200, w) / this.size) * this.size,
                    Math.round(random(-260, h) / this.size) * this.size,
                    this.size,
                    this.size
                );
                ctx.fill();
                ctx.fillStyle = this.color2;
                ctx.fillRect(
                    Math.round(random(-200, w) / this.size) * this.size,
                    Math.round(random(-260, h) / this.size) * this.size,
                    this.size,
                    this.size
                );
                ctx.fill();
            }
            t++;
            if (t % (speed * 2000) === 0) {
                ctx.clearRect(-200, -200, w, h);
                this.color1 = randomColor(0, 255, 0.2, 0.6);
                this.color2 = randomColor(0, 255, 0.2, 0.6);
                this.skewX = Math.random();
                this.skewY = Math.random();
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class AngelHair {
    constructor() {
        this.x1 = random(0, w);
        this.y1 = random(0, h);
        this.x2 = random(0, w);
        this.y2 = random(0, h);
        this.rotate = random(2, 359);
        this.radius1 = random(20, 300);
        this.radius2 = random(20, 300);

        speed = 3;

        ctx.lineWidth = 0.1;
        ctx.setLineDash([1, 4]);
        ctx.strokeStyle = randomColor(100, 255, 0.5, 1);
        ctx.globalCompositeOperation = 'hard-light';

        this.draw = () => {
            if (t % speed === 0) {
                stagger = stagger % 4;
                if (stagger === 0) {
                    ctx.moveTo(this.y2, this.x1);
                }
                if (stagger === 1) {
                    ctx.arcTo(w / 2, h, this.x1, this.y1, this.radius1);
                    ctx.stroke();
                }
                if (stagger === 2) {
                    ctx.arcTo(w, h / 2, this.x2, this.y2, this.radius2);
                    ctx.stroke();
                }
                if (stagger === 3) {
                    ctx.translate(w / 2, h / 2);
                    ctx.rotate(this.rotate);
                    ctx.translate(-w / 2, -h / 2);
                }
            }
            stagger++;
            t++;
            if (t % (speed * 360) === 0) {
                ctx.beginPath();
                this.x1 = random(0, w);
                this.y1 = random(0, h);
                this.x2 = random(0, w);
                this.y2 = random(0, h);
                this.radius1 = random(20, 300);
                this.radius2 = random(20, 300);
                this.rotate = (random(2, 359) * Math.PI) / 180;
                if (Math.random() < 0.075) {
                    ctx.strokeStyle = 'white';
                } else {
                    ctx.strokeStyle = randomColor(100, 255, 0.5, 1);
                }
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Sushi {
    constructor() {
        this.radius = 40;
        this.rows = 20;
        this.cols = 14;

        ctx.strokeStyle = 'white';
        ctx.globalCompositeOperation = 'difference';
        ctx.lineWidth = random(3, 17);
        ctx.fillStyle = randomColor();

        this.draw = () => {
            if (t % speed === 0) {
                for (let i = 0; i <= this.rows; i++) {
                    for (let j = 0; j <= this.cols; j++) {
                        ctx.beginPath();
                        ctx.arc(
                            100 * j - 50,
                            100 * i - 50,
                            this.radius,
                            Math.random(),
                            Math.random() * 2 * Math.PI
                        );
                        ctx.stroke();
                        ctx.fill();
                    }
                }
            }
            t++;
            if (t % (speed * 30) === 0) {
                this.radius = random(10, 46);
                ctx.lineWidth = random(3, 17);
                ctx.fillStyle = randomColor();
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Wormholes {
    constructor() {
        this.letters = [
            2101, 2102, 2103, 2104, 2108, 2109, 2110, 2116, 2117, 2119, 2121,
            2123, 2127, 2130, 2134, 2142, 2304, 2305, 2312, 2313, 2314, 2316,
            2317, 2318, 2319, 2320, 2325, 2328, 2330, 2336, 2349, 2352, 2353,
            2361, 2362, 2365, 2367, 2368, 2383, 2385, 2390, 2391
        ];
        this.letter = String.fromCharCode(
            this.letters[random(0, this.letters.length)]
        );
        this.size = 15;
        this.change = 1;
        this.rotate = random(1, 22);

        ctx.textAlign = 'center';
        ctx.fillStyle = randomColor(0, 255, 0.05, 0.25);
        ctx.font = `${this.size}px sans-serif`;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.fillText(this.letter, w / 2, h / 2);
            }
            this.size += this.change;
            ctx.font = `${this.size}px sans-serif`;
            if (ctx.measureText(this.letter).width > w / 2) {
                this.change *= -1;
            }
            if (ctx.measureText(this.letter).width < 5) {
                this.letter = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                );
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(-w, -h, 3 * w, 3 * h);
                this.rotate = random(1, 22);
                this.change *= -1;
                ctx.fillStyle = randomColor(0, 255, 0.05, 0.25);
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rotate);
            ctx.translate(-w / 2, -h / 2);
            t++;
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Shells {
    constructor() {
        this.letters = [
            2404, 2405, 2413, 2414, 2416, 2422, 2424, 2425, 2426, 2427, 2428,
            2429, 2431, 2432, 2434, 2435, 2438, 2439, 2443, 2444, 2448, 2451,
            2452, 2454, 2455, 2462, 2464, 2467, 2472, 2479, 2480, 2489, 2492
        ];
        this.letter = String.fromCharCode(
            this.letters[random(0, this.letters.length)]
        );
        this.size = 15;
        this.change = random(1, 6);
        this.rotate = random(1, 22);

        ctx.textAlign = 'center';
        ctx.strokeStyle = randomColor(0, 255, 0.3, 0.65);
        ctx.font = `${this.size}px bold serif`;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.strokeText(this.letter, w / 2, h / 2);
            }
            this.size += this.change;
            ctx.font = `${this.size}px sans-serif`;
            if (ctx.measureText(this.letter).width > w / 2) {
                this.change = random(1, 6);
                this.change *= -1;
            }
            if (ctx.measureText(this.letter).width < 5) {
                this.letter = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                );
                let chooseColor = Math.random();
                if (chooseColor < 0.15) {
                    ctx.strokeStyle = 'black';
                } else if (chooseColor < 0.3) {
                    ctx.strokeStyle = 'white';
                } else {
                    ctx.strokeStyle = randomColor(0, 255, 0.3, 0.65);
                }
                this.rotate = random(1, 22);
                this.change *= -1;
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rotate);
            ctx.translate(-w / 2, -h / 2);
            t++;
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Solar {
    constructor() {
        this.x1 = random(0, w);
        this.y1 = random(0, h);
        this.x2 = random(0, w);
        this.y2 = random(0, h);
        this.rotate = random(1, 359);

        ctx.strokeStyle = randomColor();
        ctx.globalCompositeOperation = 'hard-light';

        this.draw = () => {
            if (t % speed === 0) {
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(this.x1, this.y1, this.x2, this.y2, w, h);
                ctx.stroke();
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rotate);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 120) === 0) {
                this.x1 = random(0, w);
                this.y1 = random(0, h);
                this.x2 = random(0, w);
                this.y2 = random(0, h);
                this.rotate = random(1, 359);
                ctx.beginPath();
                ctx.strokeStyle = randomColor();
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Fluor {
    constructor() {
        this.x1 = random(0, w);
        this.y1 = random(0, h);
        this.x2 = random(0, w);
        this.y2 = random(0, h);
        this.ox = random(0, w);
        this.oy = random(0, h);
        this.dx = random(0, w);
        this.dy = random(0, h);
        this.rotate = random(1, 359);

        ctx.strokeStyle = ctx.shadowColor = randomColor();
        ctx.globalCompositeOperation = 'overlay';
        ctx.shadowBlur = 2;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.moveTo(this.ox, this.oy);
                ctx.bezierCurveTo(
                    this.x1,
                    this.y1,
                    this.x2,
                    this.y2,
                    this.dx,
                    this.dy
                );
                ctx.stroke();
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.rotate * Math.PI) / 180);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 180) === 0) {
                this.x1 = random(0, w);
                this.y1 = random(0, h);
                this.x2 = random(0, w);
                this.y2 = random(0, h);
                this.ox = random(0, w);
                this.oy = random(0, h);
                this.dx = random(0, w);
                this.dy = random(0, h);
                this.rotate = random(1, 359);
                ctx.beginPath();
                ctx.strokeStyle = ctx.shadowColor = randomColor();
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class TheFan {
    constructor() {
        this.x1 = random(0, w / 2);
        this.y1 = random(0, h / 2);
        this.x2 = random(w / 2, w);
        this.y2 = random(h / 2, h);
        this.ox = random(0, w / 2);
        this.oy = random(0, h / 2);
        this.dx = random(w / 2, w);
        this.dy = random(h / 2, h);
        this.rotate = random(1, 359);

        ctx.strokeStyle = randomColor();
        ctx.globalCompositeOperation = 'luminosity';
        ctx.filter = 'saturate(500%)';
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 4;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.moveTo(this.ox++, this.oy);
                ctx.bezierCurveTo(
                    this.x1,
                    this.y1,
                    this.x2,
                    this.y2,
                    this.dx,
                    this.dy++
                );
                ctx.stroke();
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rotate);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 240) === 0) {
                this.x1 = random(0, w / 2);
                this.y1 = random(0, h / 2);
                this.x2 = random(w / 2, w);
                this.y2 = random(h / 2, h);
                this.ox = random(0, w / 2);
                this.oy = random(0, h / 2);
                this.dx = random(w / 2, w);
                this.dy = random(h / 2, h);
                this.rotate = random(1, 359);
                ctx.beginPath();
                ctx.strokeStyle = randomColor();
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class FadeIn {
    constructor() {
        this.x1 = random(0, w);
        this.y1 = random(0, h);
        this.c1 = random(-2, 2);
        this.c2 = random(-2, 2);
        this.x2 = random(0, w);
        this.y2 = random(0, h);
        this.c3 = random(-2, 2);
        this.c4 = random(-2, 2);
        this.ox = random(0, w);
        this.oy = random(0, h);
        this.c5 = random(-2, 2);
        this.c6 = random(-2, 2);
        this.dx = random(0, w);
        this.dy = random(0, h);
        this.c7 = random(-2, 2);
        this.c8 = random(-2, 2);
        this.rotate = random(1, 359);

        ctx.strokeStyle = randomColor();
        ctx.lineWidth = 0.2;
        ctx.globalAlpha = 0.15;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.moveTo(this.ox, this.oy);
                this.ox += this.c1;
                this.oy += this.c2;
                ctx.bezierCurveTo(
                    this.x1,
                    this.y1,
                    this.x2,
                    this.y2,
                    this.dx,
                    this.dy
                );
                this.x1 += this.c3;
                this.y1 += this.c4;
                this.x2 += this.c5;
                this.y2 += this.c6;
                this.dx += this.c7;
                this.dy += this.c8;
                ctx.stroke();
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rotate);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 150) === 0) {
                this.x1 = random(0, w);
                this.y1 = random(0, h);
                this.c1 = random(-2, 2);
                this.c2 = random(-2, 2);
                this.x2 = random(0, w);
                this.y2 = random(0, h);
                this.c3 = random(-2, 2);
                this.c4 = random(-2, 2);
                this.ox = random(0, w);
                this.oy = random(0, h);
                this.c5 = random(-2, 2);
                this.c6 = random(-2, 2);
                this.dx = random(0, w);
                this.dy = random(0, h);
                this.c7 = random(-2, 2);
                this.c8 = random(-2, 2);
                this.rotate = random(1, 359);
                ctx.beginPath();
                ctx.strokeStyle = randomColor();
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Ourobouros {
    constructor() {
        this.letters = [
            2503, 2504, 2508, 2509, 2510, 2519, 2527, 2528, 2529, 2530, 2531,
            2536, 2537, 2539, 2541, 2544, 2545, 2563, 2566, 2569, 2584, 2591,
            2596
        ];
        this.letter = String.fromCharCode(
            this.letters[random(0, this.letters.length)]
        );
        this.x = random(100, w - 100);
        this.y = random(100, h - 100);
        this.rotate = random(4, 30);

        ctx.globalCompositeOperation = 'difference';
        ctx.lineWidth = 20;
        ctx.font = `${random(40, 300)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.strokeStyle = randomColor(0, 255, 0.08, 0.4);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.strokeText(this.letter, this.x, this.y);
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.rotate * Math.PI) / 180);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 80) === 0) {
                this.x = random(100, w - 100);
                this.y = random(100, h - 100);
                ctx.font = `${random(40, 300)}px sans-serif`;
                this.rotate = random(4, 30);
                ctx.strokeStyle = randomColor(0, 255, 0.08, 0.4);
            }
            if (t % (speed * 1000) === 0) {
                this.letter = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                );
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class EpicRays {
    constructor() {
        this.pointAx = random(0, w);
        this.pointAy = random(0, h);
        this.pointBx = random(0, w);
        this.pointBy = random(0, h);
        this.pointCx = random(0, w);
        this.pointCy = random(0, h);
        this.rotations = [
            1, 2, 3, 4, 7, 8, 11, 13, 14, 16, 17, 19, 21, 22, 23, 26, 28, 29,
            31, 32, 33, 34, 37, 38, 39, 41, 43
        ];
        this.rotate = this.rotations[random(0, this.rotations.length)];

        ctx.strokeStyle = randomColor(40, 255, 0.25, 0.5);
        speed = 3;

        this.draw = () => {
            if (t % speed === 0) {
                stagger = stagger % 4;
                if (stagger === 0) {
                    ctx.beginPath();
                    ctx.moveTo(w / 2, h / 2);
                    ctx.lineTo(this.pointAx, this.pointAy);
                    ctx.stroke();
                }
                if (stagger === 1) {
                    ctx.beginPath();
                    ctx.moveTo(this.pointAx, this.pointAy);
                    ctx.lineTo(this.pointBx, this.pointBy);
                    ctx.stroke();
                }
                if (stagger === 2) {
                    ctx.beginPath();
                    ctx.moveTo(this.pointBx, this.pointBy);
                    ctx.lineTo(this.pointCx, this.pointCy);
                    ctx.stroke();
                }
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.rotate * Math.PI) / 180);
            ctx.translate(-w / 2, -h / 2);
            stagger++;
            t++;
            if (t % (speed * 300) === 0) {
                ctx.strokeStyle = randomColor(40, 255, 0.25, 0.5);
                this.pointAx = random(0, w);
                this.pointAy = random(0, h);
                this.pointBx = random(0, w);
                this.pointBy = random(0, h);
                this.pointCx = random(0, w);
                this.pointCy = random(0, h);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Abstractions {
    constructor() {
        this.pointAx = random(0, w);
        this.pointAy = random(0, h);
        this.pointCpAx = random(0, w);
        this.pointCpAy = random(0, h);
        this.pointBx = random(0, w);
        this.pointBy = random(0, h);
        this.pointCpBx = random(0, w);
        this.pointCpBy = random(0, h);
        this.pointCx = random(0, w);
        this.pointCy = random(0, h);
        this.pointCpCx = random(0, w);
        this.pointCpCy = random(0, h);
        this.rotations = [
            1, 2, 3, 4, 7, 8, 11, 13, 14, 16, 17, 19, 21, 22, 23, 26, 28, 29,
            31, 32, 33, 34, 37, 38, 39, 41, 43
        ];
        this.rotate = this.rotations[random(0, this.rotations.length)];

        speed = 3;

        ctx.shadowColor = ctx.strokeStyle = randomColor(0, 255, 0.25, 0.45);
        ctx.shadowBlur = 3;

        this.draw = () => {
            if (t % speed === 0) {
                stagger = stagger % 4;
                if (stagger === 0) {
                    ctx.beginPath();
                    ctx.moveTo(this.pointCx, this.pointCy);
                    ctx.quadraticCurveTo(
                        this.pointCpAx,
                        this.pointCpAy,
                        this.pointAx,
                        this.pointAy
                    );
                    ctx.stroke();
                }
                if (stagger === 1) {
                    ctx.beginPath();
                    ctx.moveTo(this.pointAx, this.pointAy);
                    ctx.quadraticCurveTo(
                        this.pointCpBx,
                        this.pointCpBy,
                        this.pointBx,
                        this.pointBy
                    );
                    ctx.stroke();
                }
                if (stagger === 2) {
                    ctx.beginPath();
                    ctx.moveTo(this.pointBx, this.pointBy);
                    ctx.quadraticCurveTo(
                        this.pointCpCx,
                        this.pointCpCy,
                        this.pointCx,
                        this.pointCy
                    );
                    ctx.stroke();
                }
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.rotate * Math.PI) / 180);
            ctx.translate(-w / 2, -h / 2);
            stagger++;
            t++;
            if (t % (speed * 180) === 0) {
                ctx.shadowColor = ctx.strokeStyle = randomColor(
                    0,
                    255,
                    0.25,
                    0.45
                );
                this.pointAx = random(0, w);
                this.pointAy = random(0, h);
                this.pointCpAx = random(0, w);
                this.pointCpAy = random(0, h);
                this.pointBx = random(0, w);
                this.pointBy = random(0, h);
                this.pointCpBx = random(0, w);
                this.pointCpBy = random(0, h);
                this.pointCx = random(0, w);
                this.pointCy = random(0, h);
                this.pointCpCx = random(0, w);
                this.pointCpCy = random(0, h);
                this.rotate = this.rotations[random(0, this.rotations.length)];
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Medusa {
    constructor() {
        this.pointAx = random(0, w);
        this.pointAy = random(0, h);
        this.pointCpAx = random(0, w);
        this.pointCpAy = random(0, h);
        this.pointBx = random(0, w);
        this.pointBy = random(0, h);
        this.pointCpBx = random(0, w);
        this.pointCpBy = random(0, h);
        this.pointCx = random(0, w);
        this.pointCy = random(0, h);
        this.pointCpCx = random(0, w);
        this.pointCpCy = random(0, h);
        this.rotate = random(1, 19);

        ctx.strokeStyle = randomColor(0, 185, 0.3, 0.65);
        speed = 3;
        ctx.globalCompositeOperation = 'overlay';

        this.draw = () => {
            if (t % speed === 0) {
                stagger = stagger % 4;
                if (stagger === 0) {
                    ctx.beginPath();
                    ctx.moveTo(this.pointCpCx, this.pointCpCy);
                    ctx.quadraticCurveTo(
                        this.pointCpAx,
                        this.pointCpAy,
                        this.pointAx++,
                        this.pointAy--
                    );
                    ctx.stroke();
                }
                if (stagger === 1) {
                    ctx.beginPath();
                    ctx.moveTo(this.pointCpAx, this.pointCpAy);
                    ctx.quadraticCurveTo(
                        this.pointCpBx,
                        this.pointCpBy++,
                        this.pointBx,
                        this.pointBy
                    );
                    ctx.stroke();
                }
                if (stagger === 2) {
                    ctx.beginPath();
                    ctx.moveTo(this.pointCpBx, this.pointCpBy);
                    ctx.quadraticCurveTo(
                        this.pointCpCx--,
                        this.pointCpCy,
                        this.pointCx,
                        this.pointCy
                    );
                    ctx.stroke();
                }
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.rotate++ * Math.PI) / 180);
            ctx.translate(-w / 2, -h / 2);
            stagger++;
            t++;
            if (t % (speed * 450) === 0) {
                ctx.clearRect(-w, -h, 3 * w, 3 * h);
                ctx.strokeStyle = randomColor(0, 185, 0.3, 0.65);
                this.pointAx = random(0, w);
                this.pointAy = random(0, h);
                this.pointCpAx = random(0, w);
                this.pointCpAy = random(0, h);
                this.pointBx = random(0, w);
                this.pointBy = random(0, h);
                this.pointCpBx = random(0, w);
                this.pointCpBy = random(0, h);
                this.pointCx = random(0, w);
                this.pointCy = random(0, h);
                this.pointCpCx = random(0, w);
                this.pointCpCy = random(0, h);
                this.rotate = random(1, 19);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Chillout {
    constructor() {
        this.x1 = random(0, w);
        this.y1 = random(0, h);
        this.x2 = random(0, w);
        this.y2 = random(0, h);
        this.x3 = random(0, w);
        this.y3 = random(0, h);
        this.rotate = random(1, 10);

        ctx.lineWidth = random(1, 5);
        ctx.strokeStyle = randomColor(0, 255, 0.4, 1);
        ctx.filter = 'saturate(17.5%)';

        this.draw = () => {
            if (t % speed === 0) {
                ctx.moveTo(this.x3, this.y3);
                ctx.quadraticCurveTo(this.x2, this.y2, this.x1, this.y1);
                ctx.stroke();
                ctx.translate(w / 2, h / 2);
                ctx.rotate(this.rotate);
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            if (t % (speed * 80) === 0) {
                this.x1 = random(0, w);
                this.y1 = random(0, h);
                this.x2 = random(0, w);
                this.y2 = random(0, h);
                this.x3 = random(0, w);
                this.y3 = random(0, h);
                ctx.beginPath();
                ctx.lineWidth = random(1, 5);
                ctx.strokeStyle = randomColor(0, 255, 0.4, 1);
                this.rotate = random(1, 10);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Swirls {
    constructor() {
        this.x1 = random(0, w);
        this.y1 = random(0, h);
        this.x2 = random(0, w);
        this.y2 = random(0, h);
        this.x3 = random(0, w);
        this.y3 = random(0, h);
        this.rotate = random(1, 10);

        ctx.strokeStyle = randomColor(0, 255, 0.4, 0.7);
        ctx.lineWidth = 0.1;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.moveTo(this.x3, this.y3);
                ctx.quadraticCurveTo(this.x2, this.y2, this.x1, this.y1);
                ctx.stroke();
                ctx.translate(w / 2, h / 2);
                ctx.rotate(this.rotate);
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            if (t % (speed * 240) === 0) {
                this.x1 = random(0, w);
                this.y1 = random(0, h);
                this.x2 = random(0, w);
                this.y2 = random(0, h);
                this.x3 = random(0, w);
                this.y3 = random(0, h);
                ctx.beginPath();

                ctx.strokeStyle = randomColor(0, 255, 0.4, 0.7);

                this.rotate = random(1, 10);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Mirage {
    constructor() {
        this.width = random(100, w);
        this.height = random(100, h);
        this.ul = random(10, 300);
        this.ur = random(10, 300);
        this.ll = random(10, 300);
        this.lr = random(10, 300);
        this.rotate = random(1, 50);

        ctx.fillStyle = randomColor(0, 255, 0.01, 0.05);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.roundRect(
                    w / 2 - this.width / 2,
                    h / 2 - this.height / 2,
                    this.width,
                    this.height,
                    {
                        upperLeft: this.ul,
                        upperRight: this.ur,
                        lowerLeft: this.ll,
                        lowerRight: this.lr
                    },
                    true,
                    false
                );
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rotate);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 200) === 0) {
                ctx.fillRect(-w, -h, 3 * w, 3 * h);
                this.width = random(100, w);
                this.height = random(100, h);
                this.ul = random(10, 300);
                this.ur = random(10, 300);
                this.ll = random(10, 300);
                this.lr = random(10, 300);
                this.rotate = random(1, 50);
                ctx.fillStyle = randomColor(0, 255, 0.01, 0.05);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Majestic {
    constructor() {
        this.x = random(0, w);
        this.y = random(0, h);
        this.width = random(30, w);
        this.height = random(30, h);
        this.ul = random(10, w);
        this.ur = random(10, h);
        this.ll = random(10, h);
        this.lr = random(10, w);
        this.rotate = random(1, 359);

        ctx.strokeStyle = randomColor();
        ctx.fillStyle = randomColor(0, 255, 0.01, 0.05);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.roundRect(
                    this.x,
                    this.y,
                    this.width,
                    this.height,
                    {
                        upperLeft: this.ul,
                        upperRight: this.ur,
                        lowerLeft: this.ll,
                        lowerRight: this.lr
                    },
                    true,
                    true
                );
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.rotate * Math.PI) / 180);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 180) === 0) {
                ctx.fillRect(-w, -h, 3 * w, 3 * h);
                this.width = random(30, w);
                this.height = random(30, h);
                this.x = random(0, w);
                this.y = random(0, h);
                this.ul = random(10, w);
                this.ur = random(10, h);
                this.ll = random(10, h);
                this.lr = random(10, w);
                this.rotate = random(1, 359);
                ctx.strokeStyle = randomColor();
                ctx.fillStyle = randomColor(0, 255, 0.01, 0.05);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Wormhole {
    constructor() {
        this.x = random(50, w - 50);
        this.y = random(50, h - 50);
        this.width = random(30, w);
        this.height = random(30, h);
        this.ul = random(10, 50);
        this.ur = random(10, 50);
        this.ll = random(10, 50);
        this.lr = random(10, 50);
        this.rotate = random(1, 44);

        ctx.strokeStyle = randomColor(0, 255, 0.2, 0.5);
        ctx.fillStyle = randomColor(0, 255, 0.01, 0.01);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.roundRect(
                    this.x,
                    this.y,
                    this.width,
                    this.height,
                    {
                        upperLeft: this.ul,
                        upperRight: this.ur,
                        lowerLeft: this.ll,
                        lowerRight: this.lr
                    },
                    true,
                    true
                );
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rotate);
            ctx.translate(-w / 2, -h / 2);
            this.width++;
            this.height++;
            this.ul++;
            this.ur++;
            t++;
            if (t % (speed * 360) === 0) {
                this.width = random(30, w);
                this.height = random(30, h);
                this.x = random(50, w - 50);
                this.y = random(50, h - 50);
                this.ul = random(10, 50);
                this.ur = random(10, 50);
                this.ll = random(10, 50);
                this.lr = random(10, 50);
                this.rotate = random(1, 44);
                ctx.strokeStyle = randomColor(0, 255, 0.2, 0.5);
                ctx.fillStyle = randomColor(0, 255, 0.01, 0.01);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Irradiate {
    constructor() {
        this.width = random(50, w / 2);
        this.height = random(50, h / 2);
        this.rotate = random(1, 181);
        this.ul = random(10, Math.min(w, h));
        this.ur = random(10, Math.min(w, h));
        this.ll = random(10, Math.min(w, h));
        this.lr = random(10, Math.min(w, h));

        ctx.strokeStyle = randomColor(0, 255, 0.33);
        ctx.globalCompositeOperation = 'hard-light';

        this.draw = () => {
            if (t % speed === 0) {
                ctx.roundRect(
                    w / 2 - this.width / 2,
                    h / 2 - this.height / 2,
                    this.width,
                    this.height,
                    {
                        upperLeft: this.ul,
                        upperRight: this.ur,
                        lowerLeft: this.ll,
                        lowerRight: this.lr
                    }
                );
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rotate);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 150) === 0) {
                ctx.beginPath();
                this.width = random(50, w / 2);
                this.height = random(50, h / 2);
                this.rotate = random(1, 181);
                this.ul = random(10, Math.min(w, h));
                this.ur = random(10, Math.min(w, h));
                this.ll = random(10, Math.min(w, h));
                this.lr = random(10, Math.min(w, h));
                ctx.strokeStyle = randomColor(0, 255, 0.33);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Entropy {
    constructor() {
        this.width = random(50, w);
        this.height = random(50, h);
        this.rotate = random(1, 181);
        this.ul = random(10, Math.min(w, h));
        this.ur = random(10, Math.min(w, h));
        this.ll = random(10, Math.min(w, h));
        this.lr = random(10, Math.min(w, h));

        ctx.strokeStyle = randomColor(0, 255, 0.75);
        ctx.globalCompositeOperation = 'overlay';

        this.draw = () => {
            if (t % speed === 0) {
                ctx.roundRect(0, 0, this.width++, this.height++, {
                    upperLeft: this.ul--,
                    upperRight: this.ur--,
                    lowerLeft: this.ll--,
                    lowerRight: this.lr--
                });
                ctx.roundRect(w, h, this.height, this.width, {
                    upperLeft: this.lr,
                    upperRight: this.ll,
                    lowerLeft: this.ur,
                    lowerRight: this.ul
                });
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rotate);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 500) === 0) {
                ctx.beginPath();
                this.width = random(50, w);
                this.height = random(50, h);
                this.rotate = random(1, 181);
                this.ul = random(10, Math.min(w, h));
                this.ur = random(10, Math.min(w, h));
                this.ll = random(10, Math.min(w, h));
                this.lr = random(10, Math.min(w, h));
                ctx.strokeStyle = randomColor(0, 255, 0.75);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Tripping {
    constructor() {
        this.x1 = random(0, w);
        this.y1 = random(0, h);
        this.x2 = random(0, w);
        this.y2 = random(0, h);
        this.width = random(50, w);
        this.height = random(50, h);
        this.rotate = random(1, 360);
        this.ul = random(10, Math.max(w, h));
        this.ur = random(10, Math.max(w, h));
        this.ll = random(10, Math.max(w, h));
        this.lr = random(10, Math.max(w, h));

        ctx.strokeStyle = randomColor(0, 255, 0.25, 0.5);
        ctx.lineWidth = 0.5;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.roundRect(
                    this.x1++,
                    this.y1++,
                    this.width++,
                    this.height++,
                    {
                        upperLeft: this.ul--,
                        upperRight: this.ur--,
                        lowerLeft: this.ll--,
                        lowerRight: this.lr--
                    }
                );
                ctx.roundRect(this.x2--, this.y2--, this.height, this.width, {
                    upperLeft: this.lr,
                    upperRight: this.ll,
                    lowerLeft: this.ur,
                    lowerRight: this.ul
                });
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rotate);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 500) === 0) {
                ctx.beginPath();
                ctx.clearRect(-w, -h, 3 * w, 3 * h);
                this.x1 = random(0, w);
                this.y1 = random(0, h);
                this.x2 = random(0, w);
                this.y2 = random(0, h);
                this.width = random(50, w);
                this.height = random(50, h);
                this.rotate = random(1, 360);
                this.ul = random(10, Math.max(w, h));
                this.ur = random(10, Math.max(w, h));
                this.ll = random(10, Math.max(w, h));
                this.lr = random(10, Math.max(w, h));
                ctx.strokeStyle = randomColor(0, 255, 0.25, 0.5);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Progression {
    constructor() {
        this.width = random(40, w);
        this.height = random(40, h);
        this.round = random(1, 350);
        this.rotate = random(1, 180);

        ctx.fillStyle = randomColor(0, 255, 0.01, 0.03);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.roundRect(
                    w / 2,
                    h / 2,
                    this.width,
                    this.height,
                    {
                        upperLeft: this.round,
                        upperRight: this.round,
                        lowerLeft: this.round,
                        lowerRight: this.round
                    },
                    true,
                    false
                );
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.rotate * Math.PI) / 180);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 180) === 0) {
                this.width = random(40, w);
                this.height = random(40, h);
                this.round = random(1, 350);
                this.rotate = random(1, 180);
                ctx.beginPath();
                ctx.fillStyle = randomColor(0, 255, 0.01, 0.03);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Aperture {
    constructor() {
        this.x = w / 2;
        this.y = random(100, h - 100);
        this.width = random(100, w - 100);
        this.height = random(100, h - 100);
        this.round = random(5, 100);
        this.white = true;
        this.rotate = random(1, 70);
        this.incX = Math.random();
        this.incH = Math.random();

        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'black';
        ctx.globalAlpha = 0.75;
        ctx.lineWidth = 4;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.roundRect(
                    this.x,
                    this.y,
                    this.width,
                    this.height,
                    {
                        upperLeft: this.round,
                        upperRight: this.round,
                        lowerLeft: this.round,
                        lowerRight: this.round
                    },
                    true
                );
            }
            this.x += this.incX;
            this.height += this.incH;
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rotate);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 300) === 0) {
                ctx.beginPath();
                if (this.white) {
                    ctx.strokeStyle = 'black';
                    ctx.fillStyle = 'white';
                } else {
                    ctx.strokeStyle = 'white';
                    ctx.fillStyle = 'black';
                }
                this.white = !this.white;
                this.x = w / 2;
                this.y = random(100, h - 100);
                this.rotate = random(1, 70);
                this.width = random(100, w - 100);
                this.height = random(100, h - 100);
                this.round = random(5, 100);
                this.incX = Math.random();
                this.incH = Math.random();
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Upholstery {
    constructor() {
        this.x1 = random(0, w);
        this.y1 = random(0, h);
        this.x2 = random(0, w);
        this.y2 = random(0, h);
        this.rotate = random(1, 55);
        this.dash1 = random(1, 15);
        this.dash2 = random(20, 40);
        this.dash3 = random(1, 50);

        ctx.strokeStyle = randomColor(50, 255, 1, 1);
        ctx.setLineDash([this.dash1, this.dash2, this.dash3]);
        ctx.globalCompositeOperation = 'overlay';

        this.draw = () => {
            if (t % speed === 0) {
                ctx.moveTo(this.x1, this.y1);
                ctx.lineTo(this.x2, this.y2);
                ctx.stroke();
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rotate);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 120) === 0) {
                this.dash1 = random(1, 15);
                this.dash2 = random(20, 40);
                this.dash3 = random(1, 50);
                ctx.setLineDash([this.dash1, this.dash2, this.dash3]);
                this.x1 = random(0, w);
                this.y1 = random(0, h);
                this.x2 = random(0, w);
                this.y2 = random(0, h);
                ctx.beginPath();
                ctx.strokeStyle = randomColor(50, 255, 1, 1);
                this.rotate = random(1, 55);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Unfocused {
    constructor() {
        this.x1 = random(0, w);
        this.y1 = random(0, h);
        this.radius1 = random(5, 55);
        this.x2 = random(0, w);
        this.y2 = random(0, h);
        this.radius2 = random(5, 55);
        this.x3 = random(0, w);
        this.y3 = random(0, h);
        this.radius3 = random(5, 55);
        this.rotate = random(1, 61);

        ctx.fillStyle = randomColor(10, 255, 0.1, 0.1);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.beginPath();
                ctx.arc(this.x1, this.y1, this.radius1, 0, 2 * Math.PI);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(this.x2, this.y2, this.radius2, 0, 2 * Math.PI);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(this.x3, this.y3, this.radius3, 0, 2 * Math.PI);
                ctx.fill();
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rotate);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 20) === 0) {
                this.x1 = random(0, w);
                this.y1 = random(0, h);
                this.radius1 = random(5, 55);
                this.x2 = random(0, w);
                this.y2 = random(0, h);
                this.radius2 = random(5, 55);
                this.x3 = random(0, w);
                this.y3 = random(0, h);
                this.radius3 = random(5, 55);
                ctx.fillStyle = randomColor(10, 255, 0.1, 0.1);
            }
            if (t % (speed * 100) === 0) {
                this.rotate = random(1, 61);
            }
            if (t % (speed * 500) === 0) {
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.fillRect(-w, -h, 3 * w, 3 * h);
                ctx.fillStyle = randomColor(10, 255, 0.1, 0.1);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Matter {
    constructor() {
        this.x1 = random(0, w);
        this.y1 = random(0, h);
        this.radius1 = random(5, 150);
        this.x2 = random(0, w);
        this.y2 = random(0, h);
        this.radius2 = random(5, 150);
        this.x3 = random(0, w);
        this.y3 = random(0, h);
        this.radius3 = random(5, 150);
        this.rotate = random(10, 101);

        ctx.fillStyle = randomColor(10, 255, 0.02, 0.07);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.beginPath();
                ctx.arc(this.x1, this.y1, this.radius1, 0, 2 * Math.PI);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(this.x2, this.y2, this.radius2, 0, 2 * Math.PI);
                ctx.fill();
                ctx.beginPath();
                ctx.arc(this.x3, this.y3, this.radius3, 0, 2 * Math.PI);
                ctx.fill();
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.rotate * Math.PI) / 180);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 120) === 0) {
                this.x1 = random(0, w);
                this.y1 = random(0, h);
                this.radius1 = random(5, 150);
                this.x2 = random(0, w);
                this.y2 = random(0, h);
                this.radius2 = random(5, 150);
                this.x3 = random(0, w);
                this.y3 = random(0, h);
                this.radius3 = random(5, 150);
                ctx.fillStyle = randomColor(10, 255, 0.02, 0.07);
                this.rotate = random(10, 101);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Seeds {
    constructor() {
        this.x1 = random(0, w);
        this.y1 = random(0, h);
        this.x2 = random(0, w);
        this.y2 = random(0, h);
        this.x3 = random(0, w);
        this.y3 = random(0, h);

        this.rotate = random(10, 101);

        ctx.fillStyle =
            ctx.strokeStyle =
            ctx.shadowColor =
                randomColor(40, 255, 0.65, 1);
        ctx.shadowBlur = 2;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.beginPath();
                ctx.arc(this.x1++, this.y1--, 5, 0, 0.5 * Math.PI);
                ctx.stroke();
                ctx.fill();
                ctx.beginPath();
                ctx.arc(this.x2--, this.y2++, 10, 0, 0.5 * Math.PI);
                ctx.stroke();
                ctx.fill();
                ctx.beginPath();
                ctx.arc(this.x3++, this.y3, 15, 0, 0.5 * Math.PI);
                ctx.stroke();
                ctx.fill();
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rotate);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 360) === 0) {
                this.x1 = random(0, w);
                this.y1 = random(0, h);
                this.x2 = random(0, w);
                this.y2 = random(0, h);
                this.x3 = random(0, w);
                this.y3 = random(0, h);
                ctx.fillStyle =
                    ctx.strokeStyle =
                    ctx.shadowColor =
                        randomColor(40, 255, 0.65, 1);
                this.rotate = random(10, 101);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class CrayonFunnel {
    constructor() {
        this.x = random(w / 3, w * 0.66);
        this.y = random(w / 3, h * 0.66);
        this.inc = random(1, 6);
        this.radius = random(5, 60);
        this.rotate = random(1, 150);

        ctx.strokeStyle = randomColor(0, 255, 1, 1);
        ctx.lineWidth = 2;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                this.radius += this.inc;
                ctx.stroke();
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rotate);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 180) === 0) {
                this.x = random(w / 3, w * 0.66);
                this.y = random(w / 3, h * 0.66);
                this.radius = random(5, 60);
                this.inc = random(1, 6);
                this.rotate = random(1, 150);
                if (Math.random() < 0.5) {
                    if (Math.random() < 0.5) {
                        ctx.strokeStyle = 'white';
                    } else {
                        ctx.strokeStyle = 'black';
                    }
                } else {
                    ctx.strokeStyle = randomColor(0, 255, 1, 1);
                }
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class BigBangs {
    constructor() {
        this.r = 1;
        this.i = random(5, 30);
        this.a = random(1, 180);

        ctx.fillStyle = randomColor(0, 255, 0.02, 0.05);
        ctx.strokeStyle = randomColor(0, 255, 0.5, 1);
        ctx.globalCompositeOperation = 'hard-light';

        this.draw = () => {
            if (t % speed === 0) {
                ctx.arc(w / 2, h / 2, this.r, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
                this.r += this.i;
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.a * Math.PI) / 180);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (this.r > Math.max(w, h)) {
                ctx.fillStyle = randomColor(0, 255, 0.02, 0.05);
                ctx.fillRect(-w, -h, 3 * w, 3 * h);
                this.a = random(1, 180);
                this.r = 1;
                this.i = random(5, 30);
                ctx.beginPath();
                ctx.strokeStyle = randomColor(0, 255, 0.5, 1);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Nazca {
    constructor() {
        this.r = 1;
        this.i = random(13, 60);
        this.a = random(1, 180);
        this.modes = ['soft-light', 'overlay', 'color'];
        this.cycles = 0;

        ctx.fillStyle = randomColor(0, 255, 0.15, 0.55);
        ctx.strokeStyle = randomColor(0, 255, 0.75, 1);
        ctx.globalCompositeOperation = 'soft-light';

        this.draw = () => {
            if (t % speed === 0) {
                ctx.arc(w / 2, h / 2, this.r, 0, Math.random() * Math.PI);
                ctx.fill();
                ctx.stroke();
                this.r += this.i;
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate(-this.a);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (this.r > Math.max(w, h)) {
                this.cycles++;
                if (this.cycles % 10 === 0) {
                    ctx.globalCompositeOperation =
                        this.modes[random(0, this.modes.length)];
                }
                ctx.lineWidth = random(1, 7);
                ctx.fillStyle = randomColor(0, 255, 0.15, 0.55);
                this.a = random(1, 180);
                this.r = 1;
                this.i = random(13, 60);
                ctx.beginPath();
                ctx.strokeStyle = randomColor(0, 255, 0.75, 1);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Smooth {
    constructor() {
        this.size = random(50, 500);
        this.x = random(0, w);
        this.y = random(0, h);
        this.rot = random(1, 11);

        ctx.fillStyle = randomColor(0, 255, 0.03, 0.08);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.fillRect(this.x, this.y, this.size, this.size);
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rot);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 60) === 0) {
                this.size = random(50, 500);
                this.x = random(0, w);
                this.y = random(0, h);
                ctx.fillStyle = randomColor(0, 255, 0.03, 0.08);
                this.rot = random(1, 11);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Encoded {
    constructor() {
        this.letters = ['S', 'P', 'I', 'R', 'A', 'L'];
        this.letter = this.letters[random(0, this.letters.length)];
        this.size = random(100, 600);
        this.rot = (random(1, 360) * Math.PI) / 180;
        this.x = random(0, w);
        this.y = random(0, h);
        this.angles = [10, 12, 15, 18, 20, 24, 36, 45, 72];
        this.angle = this.angles[random(0, this.angles.length)];

        ctx.shadowColor = ctx.strokeStyle = randomColor(30, 255, 0.2, 0.6);
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.font = `bold ${this.size}px serif`;
        ctx.textAlign = 'center';
        ctx.shadowBlur = 10;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.strokeText(this.letter, this.x, this.y);
                ctx.fillText(this.letter, this.x, this.y);
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.angle * Math.PI) / 180);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 72) === 0) {
                this.letter = this.letters[random(0, this.letters.length)];
                this.size = random(100, 600);
                this.rot = (random(1, 360) * Math.PI) / 180;
                ctx.shadowColor = ctx.strokeStyle = randomColor(
                    30,
                    255,
                    0.2,
                    0.6
                );
                ctx.font = `bold ${this.size}px serif`;
                this.x = random(0, w);
                this.y = random(0, h);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Concentric {
    constructor() {
        this.letters = [
            2605, 2608, 2617, 2626, 2632, 2635, 2641, 2652, 2654, 2662, 2663,
            2667, 2670, 2676, 2677, 2691, 2694, 2695, 2696, 2700
        ];
        this.letter1 = String.fromCharCode(
            this.letters[random(0, this.letters.length)]
        );
        this.letter2 = String.fromCharCode(
            this.letters[random(0, this.letters.length)]
        );
        this.letter3 = String.fromCharCode(
            this.letters[random(0, this.letters.length)]
        );
        this.letter4 = String.fromCharCode(
            this.letters[random(0, this.letters.length)]
        );
        this.size = random(25, 160);
        this.x = random(0, w);
        this.y = random(0, h);
        this.angles = [10, 12, 15, 18, 20, 24, 36, 45, 72];
        this.angle = this.angles[random(0, this.angles.length)];

        ctx.globalCompositeOperation = 'soft-light';
        ctx.shadowColor = ctx.strokeStyle = randomColor();
        ctx.fillStyle = randomColor();
        ctx.font = `bold ${this.size}px serif`;
        ctx.textAlign = 'center';
        ctx.shadowBlur = 7;
        ctx.lineWidth = 5;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.strokeText(
                    `${this.letter1}   ${this.letter2}   ${this.letter3}   ${this.letter4}`,
                    this.x,
                    this.y
                );
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.angle);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 150) === 0) {
                this.letter1 = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                );
                this.letter2 = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                );
                this.letter3 = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                );
                this.letter4 = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                );
                this.size = random(25, 160);
                ctx.fillStyle = randomColor();
                ctx.shadowColor = ctx.strokeStyle = randomColor(
                    30,
                    255,
                    0.2,
                    0.6
                );
                ctx.font = `bold ${this.size}px serif`;
                this.x = random(0, w);
                this.y = random(0, h);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Glow {
    constructor() {
        this.margin1 = random(25, w / 4);
        this.margin2 = random(25, w / 4);
        this.color1 = randomColor(0, 255, 0.05, 0.2);
        this.color2 = randomColor(0, 255, 0.05, 0.2);
        this.rot = random(1, 60);
        this.modes = ['color', 'source-over', 'overlay', 'soft-light'];

        ctx.strokeStyle = 'white';
        ctx.globalCompositeOperation = 'color';

        this.draw = () => {
            if (t % speed === 0) {
                ctx.fillStyle = this.color1;
                ctx.fillRect(0, 0, w / 2 + this.margin1, h);
                ctx.fillStyle = this.color2;
                ctx.fillRect(w / 2 - this.margin2, 0, w, h);
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rot);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 60) === 0) {
                this.margin1 = random(25, w / 4);
                this.color1 = randomColor(0, 255, 0.05, 0.2);
            }
            if (t % (speed * 90) === 0) {
                this.margin2 = random(25, w / 4);
                this.color2 = randomColor(0, 255, 0.05, 0.2);
            }
            if (t % (speed * 180) === 0) {
                this.rot = random(1, 60);
                ctx.globalCompositeOperation =
                    this.modes[random(0, this.modes.length)];
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Onion {
    constructor() {
        this.radius = random(45, 500);
        this.x = random(0, w);
        this.y = random(0, h);
        this.angle = random(2, 50);

        ctx.strokeStyle = 'black';
        ctx.fillStyle = randomColor(0, 255, 0.005, 0.015);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.angle / 180) * Math.PI);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 135) === 0) {
                this.radius = random(50, 500);
                this.x = random(0, w);
                this.y = random(0, h);
                ctx.beginPath();
                ctx.fillStyle = randomColor(0, 255, 0.005, 0.015);
            }
            if (t % (speed * 540) === 0) {
                this.angle = random(2, 50);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Blends {
    constructor() {
        this.x = random(0, w);
        this.y = random(0, h);
        this.x2 = random(0, w);
        this.y2 = random(0, h);
        this.length = random(30, 250);
        this.shape1 = () =>
            ctx.fillRect(this.x++, this.y, this.length++, this.length);
        this.shape2 = () =>
            ctx.arc(this.x2, this.y2++, this.length, 0, 2 * Math.PI);
        this.shape3 = () => {
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x2, this.y2);
        };
        this.currentShape = random(0, 3);
        this.rotation = random(2, 140);
        this.color1 = randomColor(0, 255, 0.025, 0.075);
        this.color2 = randomColor(0, 255, 0.025, 0.075);

        ctx.lineWidth = 3;
        ctx.strokeStyle = randomColor();

        this.draw = () => {
            if (t % speed === 0) {
                if (this.currentShape === 0) {
                    ctx.fillStyle = this.color2;
                    this.shape1();
                } else if (this.currentShape === 1) {
                    ctx.fillStyle = this.color1;
                    ctx.beginPath();
                    this.shape2();
                    ctx.fill();
                } else {
                    ctx.strokeStyle = this.color2;
                    ctx.beginPath();
                    this.shape3();
                    ctx.stroke();
                }
                this.currentShape++;
                if (this.currentShape > 2) this.currentShape = 0;
                ctx.translate(w / 2, h / 2);
                ctx.rotate((this.rotation * Math.PI) / 180);
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            if (t % (speed * 270) === 0) {
                this.rotation = random(2, 140);
                this.x = random(0, w);
                this.y = random(0, h);
                this.x2 = random(0, w);
                this.y2 = random(0, h);
                this.length = random(30, 250);
                ctx.beginPath();
                this.color1 = randomColor(0, 255, 0.025, 0.075);
                this.color2 = randomColor(0, 255, 0.025, 0.075);
                ctx.strokeStyle = randomColor();
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class SnakesLadders {
    constructor() {
        this.div = random(3, 17);
        this.div2 = random(3, 17);
        this.colSize = w / this.div;
        this.rowSize = h / this.div2;
        this.currCol = 0;
        this.currRow = 0;
        this.rotate = random(1, 83);

        ctx.fillStyle = randomColor(0, 255, 0.15, 0.53);
        ctx.strokeStyle = ctx.shadowColor = randomColor(0, 255, 0.55, 1);
        ctx.shadowBlur = 3;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.strokeRect(
                    this.colSize * this.currCol,
                    this.rowSize * this.currRow,
                    this.colSize,
                    this.rowSize
                );
                this.currCol++;
                if (this.currCol > this.div - 1) {
                    this.currCol = 0;
                    ctx.translate(w / 2, h / 2);
                    ctx.rotate(this.rotate);
                    ctx.translate(-w / 2, -h / 2);
                    this.currRow++;
                    if (this.currRow > this.div2 - 1) {
                        this.currRow = 0;
                    }
                }
            }
            t++;

            if (t % (speed * 720) === 0) {
                ctx.fillRect(-w, -h, 3 * w, 3 * h);
                this.rotate = random(1, 83);
                this.div = random(3, 17);
                this.div2 = random(3, 17);
                this.colSize = w / this.div;
                this.rowSize = h / this.div2;
                ctx.beginPath();
                ctx.fillStyle = randomColor(0, 255, 0.15, 0.53);
                ctx.strokeStyle = ctx.shadowColor = randomColor(
                    0,
                    255,
                    0.55,
                    1
                );
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Cornucopia {
    constructor() {
        this.x = random(0, w);
        this.y = random(0, h);
        this.width = random(15, 240);
        this.height = random(15, 150);
        this.ul = random(4, 35);
        this.ur = random(4, 35);
        this.dl = random(4, 35);
        this.dr = random(4, 35);
        this.rotate = random(1, 25);

        ctx.strokeStyle = randomColor();
        ctx.fillStyle = randomColor(0, 255, 0.025, 0.09);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.roundRect(
                    this.x,
                    this.y,
                    this.width++,
                    this.height--,
                    {
                        upperLeft: this.ul--,
                        upperRight: this.ur++,
                        lowerLeft: this.dl++,
                        lowerRight: this.dr--
                    },
                    true,
                    false
                );
            }
            t++;
            if (t % (speed * 210) === 0) {
                ctx.strokeStyle = randomColor();
                ctx.fillStyle = randomColor(0, 255, 0.025, 0.09);
                this.x = random(0, w);
                this.y = random(0, h);
                this.rotate = random(1, 25);
                this.width = random(15, 240);
                this.height = random(15, 150);
                this.ul = random(4, 35);
                this.ur = random(4, 35);
                this.dl = random(4, 35);
                this.dr = random(4, 35);
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rotate);
            ctx.translate(-w / 2, -h / 2);
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Cornucopia2 {
    constructor() {
        this.x = random(0, w);
        this.y = random(0, h);
        this.width = random(35, 440);
        this.height = random(35, 350);
        this.ul = random(4, 135);
        this.ulc = random(-5, 5);
        this.ur = random(4, 135);
        this.urc = random(-5, 5);
        this.dl = random(4, 135);
        this.dlc = random(-5, 5);
        this.dr = random(4, 135);
        this.drc = random(-5, 5);
        this.rotate = random(1, 75);

        ctx.strokeStyle = randomColor();
        ctx.fillStyle = randomColor();

        this.draw = () => {
            if (t % speed === 0) {
                ctx.roundRect(
                    this.x,
                    this.y,
                    this.width,
                    this.height,
                    {
                        upperLeft: this.ul,
                        upperRight: this.ur,
                        lowerLeft: this.dl,
                        lowerRight: this.dr
                    },
                    false,
                    true
                );
                this.ul += this.ulc;
                this.ur += this.urc;
                this.dl += this.dlc;
                this.dr += this.drc;
            }
            t++;
            if (t % (speed * 500) === 0) {
                ctx.strokeStyle = randomColor();
                ctx.fillStyle = randomColor();
                this.x = random(0, w);
                this.y = random(0, h);
                this.width = random(35, 440);
                this.height = random(35, 350);
                this.ul = random(4, 135);
                this.ulc = random(-5, 5);
                this.urc = random(-5, 5);
                this.dlc = random(-5, 5);
                this.drc = random(-5, 5);
                this.ur = random(4, 135);
                this.dl = random(4, 135);
                this.dr = random(4, 135);
                this.rotate = random(1, 75);
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rotate);
            ctx.translate(-w / 2, -h / 2);
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Germinate {
    constructor() {
        this.width = random(35, w * 0.8);
        this.height = random(35, h * 0.8);
        this.ul = random(4, 115);
        this.ur = random(4, 115);
        this.dl = random(4, 115);
        this.dr = random(4, 115);
        this.wc = random(-5, 6);
        this.hc = random(-5, 6);
        this.rc = random(-7, 8);
        this.angles = [
            5, 6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 32, 35, 36, 42, 44, 45, 48,
            50, 55, 64, 65, 66, 70, 72, 75, 95, 100
        ];
        this.rotate = this.angles[random(0, this.angles.length)];

        ctx.strokeStyle = ctx.shadowColor = randomColor(0, 255, 1, 1);
        ctx.fillStyle = randomColor(0, 255, 0.2, 0.2);
        ctx.shadowBlur = 2;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.roundRect(
                    w / 2,
                    h / 2,
                    this.width,
                    this.height,
                    {
                        upperLeft: this.ul,
                        upperRight: this.ur,
                        lowerLeft: this.dl,
                        lowerRight: this.dr
                    },
                    false,
                    true
                );
            }
            t++;
            if (t % (speed * 4) === 0) {
                this.ul += this.rc;
                this.ur += this.wc;
                this.dr += this.hc;
                this.dl -= this.rc;
            }
            if (t % (speed * 12) === 0) {
                this.width -= this.wc;
                this.height += this.hc;
            }
            if (t % (speed * 280) === 0) {
                ctx.strokeStyle = ctx.shadowColor = randomColor(0, 255, 1, 1);
                ctx.fillStyle = randomColor(0, 255, 0.2, 0.2);
                ctx.fillRect(-w, -h, 3 * w, 3 * h);
                this.width = random(35, w * 0.8);
                this.height = random(35, h * 0.8);
                this.ul = random(4, 115);
                this.ur = random(4, 115);
                this.dl = random(4, 115);
                this.dr = random(4, 115);
                this.wc = random(-5, 6);
                this.hc = random(-5, 6);
                this.rc = random(-7, 8);

                this.rotate = this.angles[random(0, this.angles.length)];
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.rotate * Math.PI) / 180);
            ctx.translate(-w / 2, -h / 2);
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class GasClouds {
    constructor() {
        this.width = random(0, w / 2);
        this.height = random(0, h / 2);
        this.ul = random(0, 300);
        this.ur = random(0, 300);
        this.dl = random(0, 300);
        this.dr = random(0, 300);
        this.x = 0;
        this.y = 0;
        this.rotate = random(0, 200);

        ctx.strokeStyle = randomColor(0, 150, 0.2, 0.5);
        ctx.fillStyle = randomColor(0, 255, 0.01, 0.02);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.roundRect(
                    this.x++,
                    this.y++,
                    this.width,
                    this.height,
                    {
                        upperLeft: this.ul,
                        upperRight: this.ur,
                        lowerLeft: this.dl,
                        lowerRight: this.dr
                    },
                    true,
                    false
                );
            }
            t++;

            if (t % (speed * 240) === 0) {
                ctx.strokeStyle = randomColor(0, 150, 0.2, 0.5);
                ctx.fillStyle = randomColor(0, 255, 0.01, 0.02);
                this.width = random(0, w / 2);
                this.height = random(0, h / 2);
                this.ul = random(0, 300);
                this.ur = random(0, 300);
                this.dl = random(0, 300);
                this.dr = random(0, 300);
                this.x = 0;
                this.y = 0;
                this.rotate = random(0, 200);
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rotate);
            ctx.translate(-w / 2, -h / 2);
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Networks {
    constructor() {
        this.drawAmount = 0.01;
        this.x = w / 2;
        this.y = h / 2;
        this.rot = random(1, 71);
        this.size = random(30, 200);
        this.sizeIncrease = Math.random() * random(0, 5);

        ctx.strokeStyle = randomColor();

        this.draw = () => {
            if (t % speed === 0) {
                ctx.arc(
                    this.x,
                    this.y,
                    this.size,
                    0,
                    this.drawAmount * Math.PI * 2
                );
                this.drawAmount += 0.001;
                this.size += this.sizeIncrease;
                ctx.stroke();
                ctx.beginPath();
            }
            t++;
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rot);
            ctx.translate(-w / 2, -h / 2);
            if (t % (speed * 480) === 0) {
                ctx.strokeStyle = randomColor();
                this.drawAmount = 0.01;
                this.x = random(0, w);
                this.y = random(0, h);
                this.rot = random(1, 71);
                this.size = random(30, 200);
                this.sizeIncrease = Math.random() * random(0, 5);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Spikral {
    constructor() {
        this.fillAmount = (Math.random() + 0.05) * (Math.PI / 2);
        this.rot = random(1, 22);
        this.size = random(20, 100);

        ctx.fillStyle = randomColor(0, 255, 0.25, 1);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.arc(w / 2, h / 2, this.size, 0, this.fillAmount);
                this.size *= 1.05;
                ctx.fill();
                ctx.beginPath();
            }
            t++;
            ctx.translate(w / 2, h / 2);
            ctx.rotate(-this.rot);
            ctx.translate(-w / 2, -h / 2);
            if (t % (speed * 150) === 0) {
                ctx.fillStyle = randomColor(0, 255, 0.25, 1);
                this.fillAmount = (Math.random() + 0.05) * (Math.PI / 2);
                this.size = random(20, 100);
            }
            if (t % (speed * 1500) === 0) {
                this.rot = random(1, 22);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Fruits {
    constructor() {
        this.row = 0;
        this.col = 0;
        this.cellSizes = [50, 100, 150, 200, 250, 300];
        this.cell = this.cellSizes[random(0, this.cellSizes.length)];
        this.size = random(10, 100);

        ctx.strokeStyle = 'black';
        ctx.fillStyle = randomColor(0, 255, 0.1, 0.33);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.arc(
                    this.col * this.cell - this.cell,
                    this.row * this.cell - this.cell,
                    this.size,
                    0,
                    2 * Math.PI
                );
                ctx.stroke();
                ctx.fill();
                ctx.beginPath();

                this.col++;
                if (this.col * this.cell - this.cell * 2 > w) {
                    this.col = 0;
                    this.row++;
                }
                if (this.row * this.cell - this.cell * 2 > h) {
                    ctx.beginPath();
                    this.col = 0;
                    this.row = 0;
                    this.cell =
                        this.cellSizes[random(0, this.cellSizes.length)];
                    this.size = random(10, 100);
                    ctx.beginPath();
                    ctx.fillStyle = randomColor(0, 255, 0.1, 0.33);
                }
            }
            t++;
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Typobrush {
    constructor() {
        this.x = random(0, w);
        this.y = random(0, h);
        this.letters = [
            2703, 2705, 2709, 2713, 2715, 2716, 2718, 2719, 2720, 2721, 2722,
            2725, 2726, 2731, 2732, 2735, 2738, 2739, 2741, 2742, 2743, 2745,
            2748, 2750, 2751, 2752, 2753, 2760, 2764, 2768, 2784, 2791, 2792,
            2795, 2796, 2797, 2798, 2799, 2800
        ];
        this.letter = String.fromCharCode(
            this.letters[random(0, this.letters.length)]
        );
        this.size = 20;
        this.sizeInc = random(1, 6);
        this.rot = random(1, 400);

        ctx.strokeStyle = randomColor(0, 255, 0.33, 0.33);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.textAlign = 'center';
        ctx.font = `${this.size}px serif`;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.strokeText(this.letter, this.x, this.y);
                ctx.font = `${this.size}px serif`;
                this.size += this.sizeInc;
            }
            t++;
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rot);
            ctx.translate(-w / 2, -h / 2);
            if (t % (speed * 150) === 0) {
                this.size = 20;
                ctx.font = `${this.size}px serif`;
                this.x = random(0, w);
                this.y = random(0, h);
                this.rot = random(1, 400);
                this.sizeInc = random(1, 6);
                ctx.strokeStyle = randomColor(0, 255, 0.33, 0.33);
            }
            if (t % (speed * 1500) === 0) {
                ctx.fillRect(-w, -h, 3 * w, 3 * h);
                this.letter = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                );
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Veils {
    constructor() {
        this.x = random(0, w);
        this.y = random(0, h);
        this.letters = [
            2801, 2817, 2819, 2822, 2824, 2827, 2832, 2835, 2837, 2849, 2855,
            2856, 2858, 2859, 2860, 2862, 2873, 2877, 2878, 2880, 2891, 2893
        ];
        this.letter = String.fromCharCode(
            this.letters[random(0, this.letters.length)]
        );
        this.rot = 1;
        ctx.strokeStyle = randomColor(0, 255, 0.5, 0.5);
        ctx.textAlign = 'center';
        this.size = random(30, 400);
        ctx.font = `${this.size}px serif`;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.strokeText(this.letter, this.x, this.y);

                this.size += 2;
                ctx.font = `${this.size}px serif`;
            }
            t++;
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rot);
            ctx.translate(-w / 2, -h / 2);
            if (t % (speed * 540) === 0) {
                this.letter = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                );
                this.size = random(30, 400);
                ctx.font = `${this.size}px serif`;
                this.x = random(0, w);
                this.y = random(0, h);
                ctx.strokeStyle = randomColor(0, 255, 0.5, 0.5);
            }
            if (t % (speed * 1620) === 0) {
                this.rot++;
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Harmonie {
    constructor() {
        this.x = random(0, w);
        this.y = random(0, h);
        this.letters = [
            2902, 2908, 2909, 2911, 2913, 2915, 2918, 2919, 2921, 2922, 2924,
            2925, 2926, 2927, 2928, 2929, 2930, 2931, 2932, 2934, 2938, 2947,
            2949, 2952, 2953, 2960, 2962, 2970, 2972, 2975, 2980, 2984, 2986,
            2990, 2991, 2992, 2994, 2997, 2998
        ];
        this.letter1 = String.fromCharCode(
            this.letters[random(0, this.letters.length)]
        );
        this.letter2 = String.fromCharCode(
            this.letters[random(0, this.letters.length)]
        );
        this.size = random(20, 50);
        this.rot = 23;

        ctx.strokeStyle = randomColor();
        ctx.fillStyle = randomColor();
        ctx.textAlign = 'center';
        ctx.font = `${this.size}px serif`;

        this.draw = () => {
            if (t % speed === 0) {
                if (t % 2) {
                    ctx.strokeText(this.letter1, this.x, this.y);
                } else {
                    ctx.fillText(this.letter2, this.x, this.y);
                }
                ctx.font = `${this.size}px serif`;
            }
            t++;
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.rot * Math.PI) / 180);
            ctx.translate(-w / 2, -h / 2);
            if (t % (speed * 180) === 0) {
                this.size = random(20, 50);
                ctx.font = `${this.size}px serif`;
                this.x = random(0, w);
                this.y = random(0, h);
                this.rot = random(1, 400);
                ctx.strokeStyle = randomColor();
                ctx.fillStyle = randomColor();
            }
            if (t % (speed * 900) === 0) {
                this.letter1 = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                );
                this.letter2 = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                );
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Portals {
    constructor() {
        this.cols = random(3, 13);
        this.rows = random(3, 13);
        this.width = random(20, w / this.cols + 3);
        this.height = random(20, w / this.rows + 3);
        this.round = random(0, 60);
        this.rot = random(1, 33);

        ctx.strokeStyle = randomColor(0, 255, 1, 1);
        ctx.globalCompositeOperation = 'hard-light';
        ctx.fillStyle = randomColor(0, 255, 0.45, 0.45);
        ctx.globalAlpha = 0.6;

        this.draw = () => {
            if (t % speed === 0) {
                for (let row = 0; row <= this.rows; row++) {
                    for (let col = 0; col <= this.cols; col++) {
                        ctx.roundRect(
                            col * (w / this.cols),
                            row * (h / this.rows),
                            this.width,
                            this.height,
                            {
                                upperLeft: this.round,
                                upperRight: this.round,
                                lowerLeft: this.round,
                                lowerRight: this.round
                            },
                            true,
                            true
                        );
                    }
                }
            }
            t++;

            if (t % (speed * 90) === 0) {
                this.cols = random(3, 13);
                this.rows = random(3, 13);
                this.width = random(20, w / 8);
                this.height = random(20, w / 8);
                this.round = random(0, 60);
                this.rot = random(1, 33);
                ctx.strokeStyle = randomColor(0, 255, 1, 1);
                ctx.fillStyle = randomColor(0, 255, 0.45, 0.45);
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rot);
            ctx.translate(-w / 2, -h / 2);
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Sandala {
    constructor() {
        this.cols = random(5, 12);
        this.rows = random(5, 12);
        this.letters = [
            3201, 3202, 3203, 3204, 3206, 3207, 3208, 3209, 3212, 3214, 3215,
            3218, 3219, 3221, 3222, 3223, 3226, 3227, 3228, 3231, 3232, 3234,
            3236, 3238, 3244, 3248, 3249, 3250, 3254, 3255, 3260, 3261, 3263,
            3270, 3294, 3298
        ];

        this.rot = random(1, 60);

        ctx.strokeStyle = randomColor(0, 255, 1, 1);
        ctx.globalCompositeOperation = 'soft-light';

        this.draw = () => {
            if (t % speed === 0) {
                for (let row = 0; row <= this.rows; row++) {
                    ctx.translate(w / 2, h / 2);
                    ctx.rotate((this.rot * Math.PI) / 180);
                    ctx.translate(-w / 2, -h / 2);
                    for (let col = 0; col <= this.cols; col++) {
                        ctx.strokeText(
                            String.fromCharCode(
                                this.letters[random(0, this.letters.length)]
                            ),
                            row * (w / this.cols),
                            col * (h / this.rows)
                        );
                    }
                }
            }
            t++;
            if (t % (speed * 80) === 0) {
                this.cols = random(5, 12);
                this.rows = random(5, 12);
                this.rot = random(1, 60);
                ctx.strokeStyle = randomColor(0, 255, 1, 1);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class PsychoRainbow {
    constructor() {
        this.blends = ['hard-light', 'difference', 'color', 'luminosity'];
        this.blend = this.blends[random(0, this.blends.length)];

        this.rows = random(3, 10);
        this.rot = random(1, 50);
        this.height = h / this.rows;
        this.colors = [];
        for (let i = 0; i <= this.rows; i++) {
            this.colors.push(randomColor(0, 255, 0.1, 0.5));
        }

        ctx.globalCompositeOperation = this.blend;

        this.draw = () => {
            if (t % speed === 0) {
                for (let i = 0; i <= this.rows; i++) {
                    ctx.fillStyle = this.colors[i];
                    ctx.fillRect(-w, i * this.height, 3 * w, this.height);
                }
            }
            t++;
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rot);
            ctx.translate(-w / 2, -h / 2);
            if (t % (speed * 100) === 0) {
                this.rows = random(3, 10);
                this.rot = random(1, 50);
                this.height = h / this.rows;
                this.colors = [];
                for (let i = 0; i <= this.rows; i++) {
                    this.colors.push(randomColor(0, 255, 0.1, 0.5));
                }
            }
            if (t % (speed * 700) === 0) {
                this.blend = this.blends[random(0, this.blends.length)];
                ctx.globalCompositeOperation = this.blend;
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Hallucinate {
    constructor() {
        this.rows = random(3, 17);
        this.rot = random(1, 180);
        this.height = h / this.rows;
        this.colors = [];
        for (let i = 0; i <= this.rows; i++) {
            this.colors.push(randomColor());
        }

        ctx.globalCompositeOperation = 'soft-light';

        this.draw = () => {
            if (t % speed === 0) {
                for (let i = 0; i <= this.rows; i++) {
                    ctx.fillStyle = this.colors[i];
                    ctx.fillRect(-w, i * this.height, 3 * w, this.height);
                }
            }
            t++;
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rot);
            ctx.translate(-w / 2, -h / 2);
            if (t % (speed * 150) === 0) {
                this.rows = random(3, 17);
                this.rot = random(1, 180);
                this.height = h / this.rows;
                this.colors = [];
                for (let i = 0; i <= this.rows; i++) {
                    this.colors.push(randomColor());
                }
            }
            if (t % (speed * 750) === 0) {
                ctx.clearRect(-w, -h, 3 * w, 3 * h);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Hive {
    constructor() {
        this.rows = random(3, 10);
        this.height = h / this.rows;
        this.angles = [9, 10, 12, 16, 20, 30, 36, 45, 60];
        this.rot = this.angles[random(1, this.angles.length)];

        ctx.globalCompositeOperation = 'overlay';
        ctx.strokeStyle = randomColor();
        ctx.shadowColor = randomColor();
        ctx.blur = 7;
        ctx.lineWidth = random(7, 18);

        this.draw = () => {
            if (t % speed === 0) {
                for (let i = 0; i <= this.rows; i++) {
                    ctx.strokeRect(
                        random(0, w),
                        i * this.height,
                        random(0, w),
                        this.height
                    );
                }
            }
            t++;
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.rot * Math.PI) / 180);
            ctx.translate(-w / 2, -h / 2);
            if (t % (speed * 125) === 0) {
                ctx.shadowColor = randomColor();
                this.rows = random(3, 10);
                this.rot = this.angles[random(1, this.angles.length)];
                this.height = h / this.rows;
                ctx.strokeStyle = randomColor();
                ctx.globalCompositeOperation = 'overlay';
            }
            if (t % (speed * 500) === 0) {
                ctx.globalCompositeOperation = 'difference';
            }
            if (t % (speed * 1500) === 0) {
                ctx.globalCompositeOperation = 'hard-light';
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Boxes {
    constructor() {
        this.rows = random(3, 17);
        this.height = h / this.rows;
        this.cols = random(3, 17);
        this.width = w / this.cols;
        this.angles = [15, 20, 24, 30, 36, 45, 48, 72, 80, 90];
        this.rot = this.angles[random(0, this.angles.length)];

        ctx.strokeStyle = 'black';
        ctx.fillStyle = randomColor(0, 255, 0.075, 0.075);

        this.draw = () => {
            if (t % speed === 0) {
                for (let i = 0; i <= this.rows; i++) {
                    ctx.fillRect(
                        i * this.width,
                        i * this.height,
                        this.width / 2,
                        this.height / 2
                    );
                    ctx.strokeRect(
                        i * this.width,
                        i * this.height,
                        this.width / 2,
                        this.height / 2
                    );
                }
            }
            t++;
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.rot * Math.PI) / 180);
            ctx.translate(-w / 2, -h / 2);
            if (t % (speed * 100) === 0) {
                this.cols = random(3, 17);
                this.width = w / this.cols;
                this.rows = random(3, 17);
                this.height = h / this.rows;
            }
            if (t % (speed * 200) === 0) {
                this.rot = this.angles[random(0, this.angles.length)];
            }
            if (t % (speed * 400) === 0) {
                ctx.fillStyle = randomColor(0, 255, 0.075, 0.075);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class DigitalArt {
    constructor() {
        this.x = random(75, w - 75);
        this.y = random(30, h - 30);
        this.rot = random(3, 40);
        this.size = random(12, 36);

        ctx.font = `${this.size}px serif`;
        ctx.fillStyle = randomColor();

        this.draw = () => {
            if (t % speed === 0) {
                let letter = t % 2 ? '0' : '1';
                if (t % 2) {
                    ctx.font = `${this.size * 2}px serif`;
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    ctx.fillText(letter + '-', w / 2, h / 2);
                } else {
                    ctx.font = `${this.size * 2}px serif`;
                    ctx.textAlign = 'right';
                    ctx.textBaseline = 'bottom';
                    ctx.fillText(letter + '_', w / 2, h / 2);
                }
                ctx.font = `${this.size}px serif`;
                ctx.fillText(letter, this.x, this.y);
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.rot * Math.PI) / 180);
            ctx.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 90) === 0) {
                this.x = random(75, w - 75);
                this.y = random(30, h - 30);
                this.size = random(12, 36);
                ctx.font = `${this.size}px serif`;
                ctx.fillStyle = randomColor();
            }
            if (t % (speed * 450) === 0) {
                this.rot = random(3, 40);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Thread {
    constructor() {
        this.offset = random(30, h * 0.75);
        this.speed = Math.random() * 40;
        this.angle = 0;
        this.radius = random(25, 350);
        this.rotate = random(1, 35);

        ctx.strokeStyle = randomColor();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';

        this.draw = () => {
            if (t % speed === 0) {
                const y = h / 2 + Math.sin(this.angle) * this.offset;
                ctx.beginPath();
                ctx.arc(w / 2, y, this.radius, 0, 2 * Math.PI);
                ctx.stroke();
                this.angle += this.speed;
            }
            t++;
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rotate);
            ctx.translate(-w / 2, -h / 2);
            if (t % (speed * 450) === 0) {
                ctx.fillRect(-w, -h, 3 * w, 3 * h);
                ctx.strokeStyle = randomColor();
                this.angle = 0;
                this.rotate = random(1, 35);
                this.radius = random(25, 350);
                this.offset = random(30, h * 0.75);
                this.speed = Math.random() * 40;
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Helix {
    constructor() {
        this.offsetX = random(0, w * 0.75);
        this.offsetY = random(0, h * 0.75);
        this.speed = Math.random() * 10;
        this.angle = 0;
        this.radius = random(55, 275);

        ctx.strokeStyle = randomColor(0, 255, 0.3, 0.3);

        this.draw = () => {
            if (t % speed === 0) {
                const x = w / 2 + Math.cos(this.angle) * this.offsetX;
                const y = h / 2 + Math.sin(this.angle) * this.offsetY;
                ctx.beginPath();
                ctx.arc(x, y, this.radius, 0, 2 * Math.PI);
                ctx.stroke();
                this.angle += this.speed;
            }
            t++;
            if (t % (speed * 300) === 0) {
                ctx.strokeStyle = randomColor(0, 255, 0.3, 0.3);
                this.angle = 0;
                this.radius = random(55, 275);
                this.offsetX = random(0, w * 0.75);
                this.offsetY = random(0, h * 0.75);
                this.speed = Math.random() * 10;
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Slices {
    constructor() {
        this.offsetX = random(50, w / 2);
        this.offsetY = random(50, h / 2);
        this.speed = Math.random() * 2 - 1;
        this.angle = 0;
        this.slice = Math.random();
        this.radius = random(30, 250);
        this.rotate = random(1, 90);

        ctx.strokeStyle = 'black';
        ctx.fillStyle = randomColor(0, 255, 0.02, 0.09);

        this.draw = () => {
            if (t % speed === 0) {
                const x = w / 2 + Math.sin(this.angle) * this.offsetX;
                const y = h / 2 + Math.cos(this.angle) * this.offsetY;
                ctx.beginPath();
                ctx.arc(x, y, this.radius, 0, this.slice * Math.PI);
                ctx.closePath();
                ctx.stroke();
                ctx.fill();
                this.angle += this.speed;
            }
            t++;
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.rotate * Math.PI) / 180);
            ctx.translate(-w / 2, -h / 2);
            if (t % (speed * 360) === 0) {
                ctx.fillStyle = randomColor(0, 255, 0.02, 0.09);
                this.offsetX = random(50, w / 2);
                this.offsetY = random(50, h / 2);
                this.speed = Math.random() * 2 - 1;
                this.slice = Math.random();
                this.angle = 0;
                this.radius = random(30, 250);
                this.rotate = random(1, 90);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Records {
    constructor() {
        this.offset = random(50, 330);
        this.speed = Math.random() * 7;
        this.angle = 0;
        this.radius = random(50, Math.min(w, h) / 2);
        this.rotate = random(1, 45);

        ctx.strokeStyle = ctx.fillStyle = randomColor();

        ctx.lineWidth = 2;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.beginPath();
                ctx.arc(w / 2, h / 2, this.radius, 0, Math.random() * Math.PI);
                ctx.stroke();
                this.angle += this.speed;
                this.radius = Math.abs(
                    this.radius + Math.sin(this.angle) * this.offset
                );
            }
            t++;
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rotate);
            ctx.translate(-w / 2, -h / 2);
            if (t % (speed * 120) === 0) {
                ctx.beginPath();
                ctx.arc(w / 2, h / 2, this.radius, 0, 2 * Math.PI);
                ctx.fill();
                ctx.strokeStyle = ctx.fillStyle = randomColor();
                this.angle = 0;
                this.rotate = random(1, 45);
                this.radius = random(50, Math.min(w, h) / 2);
                this.offset = random(50, 330);
                this.speed = Math.random() * 7;
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class LisaJou {
    constructor() {
        this.radiusX = random(100, w * 0.75);
        this.radiusY = random(100, h * 0.75);
        this.angleX = 0;
        this.angleY = 0;
        this.speedX = Math.random() * 3;
        this.speedY = Math.random() * 3;
        this.size = random(2, 13);

        ctx.strokeStyle = 'black';
        ctx.fillStyle = randomColor();
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = randomColor();

        this.draw = () => {
            if (t % speed === 0) {
                const x = w / 2 + Math.cos(this.angleX) * this.radiusX;
                const y = h / 2 + Math.sin(this.angleY) * this.radiusY;
                ctx.beginPath();
                ctx.arc(x, y, this.size, 0, 2 * Math.PI);
                ctx.fill();
                ctx.stroke();
                this.angleX += this.speedX;
                this.angleY += this.speedY;
            }
            t++;
            if (t % (speed * 720) === 0) {
                this.radiusX = random(100, w * 0.75);
                this.radiusY = random(100, h * 0.75);
                this.angleX = 0;
                this.angleY = 0;
                this.speedX = Math.random() * 3;
                this.speedY = Math.random() * 3;
                this.size = random(2, 13);
                ctx.fillStyle = randomColor();
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Division {
    constructor() {
        this.radius = random(25, Math.min(w, h) / 2);
        this.angle = 0;
        this.circles = random(5, 30);
        this.size = random(3, 24);

        ctx.strokeStyle = randomColor();
        ctx.shadowColor = 'white';
        ctx.fillStyle = randomColor();
        ctx.shadowBlur = 7;

        this.draw = () => {
            if (t % speed === 0) {
                for (let i = 0; i < this.circles; i++) {
                    this.angle = (i * Math.PI * 2) / this.circles;
                    const x = w / 2 + Math.cos(this.angle) * this.radius;
                    const y = h / 2 + Math.sin(this.angle) * this.radius;
                    ctx.beginPath();
                    ctx.arc(x, y, this.size, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();
                }
            }
            t++;
            if (t % (speed * 40) === 0) {
                this.radius = random(25, Math.min(w, h) / 2);
                this.angle = 0;
                this.circles = random(5, 30);
                this.size = random(3, 24);
            }
            if (t % (speed * 400) === 0) {
                ctx.strokeStyle = randomColor();
                ctx.fillStyle = randomColor();
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Blur {
    constructor() {
        this.radius = random(25, Math.max(w, h) / 2);
        this.angle = 0;
        this.circles = random(8, 25);
        this.size = random(8, 40);
        this.factor = random(3, 20);
        this.rotate = random(1, 71);

        ctx.strokeStyle = randomColor(0, 255, 0.5, 1);
        ctx.lineWidth = 0.25;

        speed *= 2;

        this.draw = () => {
            if (t % speed === 0) {
                for (let i = 0; i < this.circles * 2; i++) {
                    this.angle = (i * Math.PI * 2) / this.circles;
                    const x = w / 2 + Math.cos(this.angle) * this.radius;
                    const y = h / 2 + Math.sin(this.angle) * this.radius;
                    ctx.beginPath();
                    ctx.arc(x, y, this.size + i * this.factor, 0, 2 * Math.PI);
                    ctx.stroke();
                }
            }
            t++;
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rotate);
            ctx.translate(-w / 2, -h / 2);
            if (t % (speed * 90) === 0) {
                this.radius = random(25, Math.max(w, h) / 2);
                this.angle = 0;
                this.size = random(8, 40);
                this.factor = random(3, 20);
                this.rotate = random(1, 71);
                this.circles = random(8, 25);
                ctx.strokeStyle = randomColor(0, 255, 0.5, 1);
            }
            if (t % (speed * 630) === 0) {
                ctx.strokeStyle = 'black';
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Trance {
    constructor() {
        this.radius = random(25, Math.max(w, h) / 2);
        this.angle = 0;
        this.divisions = [2, 4, 6, 8, 10, 12];
        this.squares = this.divisions[random(0, this.divisions.length)];
        this.size = random(15, 220);
        this.factor = random(2, 8);
        this.rotate = random(1, 71);

        ctx.strokeStyle = randomColor();
        ctx.fillStyle = randomColor();
        ctx.globalCompositeOperation = 'overlay';

        this.draw = () => {
            if (t % speed === 0) {
                for (let i = 0; i < this.squares; i++) {
                    this.angle = (i * Math.PI * 2) / this.squares;
                    const x = w / 2 + Math.cos(this.angle) * this.radius;
                    const y = h / 2 + Math.sin(this.angle) * this.radius;
                    ctx.beginPath();
                    ctx.fillRect(
                        x - this.size / 4,
                        y - this.size / 4,
                        this.size / 2,
                        this.size / 2
                    );
                    ctx.strokeRect(
                        x - this.size / 2,
                        y - this.size / 2,
                        this.size,
                        this.size
                    );
                }
            }
            t++;
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rotate);
            ctx.translate(-w / 2, -h / 2);
            if (t % (speed * 9) === 0) {
                this.radius = random(25, Math.max(w, h) / 2);
                this.angle = 0;
                this.size = random(15, 220);
                this.rotate = random(1, 71);
                this.squares = this.divisions[random(0, this.divisions.length)];
                ctx.globalCompositeOperation = 'overlay';
                ctx.fillStyle = randomColor();
            }
            if (t % (speed * 63) === 0) {
                ctx.globalCompositeOperation = 'source-over';
                ctx.strokeStyle = randomColor();
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Triangulate {
    constructor() {
        this.radius = random(60, Math.max(w, h) / 2);
        this.angle = 0;
        this.divisions = [2, 3, 4, 5, 6, 8, 9, 10, 12];
        this.triangles = this.divisions[random(0, this.divisions.length)];
        this.size = random(15, 100);
        this.rotations = [
            10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 60, 72, 80, 90, 120
        ];
        this.rotate = this.rotations[random(0, this.rotations.length)];

        ctx.strokeStyle = 'black';
        ctx.fillStyle = randomColor(0, 255, 0.2, 0.45);
        ctx.lineWidth = 3;

        this.drawTriangle = (x, y, i) => {
            ctx.moveTo(x, y);
            ctx.beginPath();
            ctx.lineTo(x + this.size + i, y + i);
            ctx.lineTo(x + i, y + this.size + i);
            ctx.lineTo(x, y);
            ctx.closePath();
        };

        this.draw = () => {
            if (t % speed === 0) {
                for (let i = 0; i < this.triangles; i++) {
                    this.angle = (i * Math.PI * 2) / this.triangles;
                    const x = w / 2 + Math.cos(this.angle) * this.radius;
                    const y = h / 2 + Math.sin(this.angle) * this.radius;
                    this.drawTriangle(x, y, i);
                    ctx.fill();
                    ctx.stroke();
                }
            }
            t++;
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.rotate * Math.PI) / 180);
            ctx.translate(-w / 2, -h / 2);
            if (t % (speed * 60) === 0) {
                this.size = random(15, 100);
                this.triangles =
                    this.divisions[random(0, this.divisions.length)];
                ctx.fillStyle = randomColor(0, 255, 0.2, 0.45);
                this.angle = 0;
                this.radius = random(60, Math.max(w, h) / 2);
            }
            if (t % (speed * 180) === 0) {
                this.rotate = this.rotations[random(0, this.rotations.length)];
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Halfsies {
    constructor() {
        this.rot = random(3, 37);
        this.radius = random(40, 400);
        this.x = random(w / 2 - this.radius, w / 2 + this.radius);
        this.y = random(h / 2 - this.radius, h / 2 + this.radius);
        this.counter = false;
        this.width1 = random(2, 11);
        this.width2 = random(2, 11);

        this.draw = () => {
            ctx.lineWidth = t % 2 ? this.width1 : this.width2;
            ctx.strokeStyle = t % 2 ? 'black' : 'white';
            this.counter = t % 2 ? true : false;
            ctx.globalCompositeOperation = t % 2 ? 'source-over' : 'difference';
            if (t % speed === 0) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI, this.counter);
                ctx.stroke();
                ctx.closePath();
            }
            t++;
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.rot * Math.PI) / 180);
            ctx.translate(-w / 2, -h / 2);
            if (t % (speed * 120) === 0) {
                this.radius = random(40, 400);
                this.x = random(w / 2 - this.radius, w / 2 + this.radius);
                this.y = random(h / 2 - this.radius, h / 2 + this.radius);
                this.rot = random(3, 37);
                this.width1 = random(2, 11);
                this.width2 = random(2, 11);
                ctx.beginPath();
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Loading {
    constructor() {
        this.rot = random(2, 45);
        this.radius = random(30, Math.max(w, h) / 2);
        this.counter = false;
        this.width1 = random(4, 51);
        this.width2 = random(4, 51);
        this.color = randomColor(60, 255, 0.75, 1);
        ctx.fillStyle = 'black';
        ctx.fillRect(-w, -h, w * 3, h * 3);

        this.draw = () => {
            ctx.lineWidth = t % 2 ? this.width1 : this.width2;
            ctx.strokeStyle = t % 2 ? 'black' : this.color;
            ctx.globalCompositeOperation = t % 2 ? 'source-over' : 'difference';
            this.counter = t % 2 ? true : false;
            if (t % speed === 0) {
                ctx.beginPath();
                ctx.arc(w / 2, h / 2, this.radius, 0, Math.PI, this.counter);
                ctx.stroke();
            }
            t++;
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.rot * Math.PI) / 180);
            ctx.translate(-w / 2, -h / 2);
            if (t % (speed * 45) === 0) {
                this.radius = random(30, Math.max(w, h) / 2);
                this.rot = random(2, 45);
                this.width1 = random(4, 51);
                this.width2 = random(4, 51);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Quadratic {
    constructor() {
        this.rot = random(4, 91);
        this.startNum = random(5, 50);
        this.firstDiff = random(10, 50);
        this.secondDiff = random(3, 45);

        this.nums = this.createSeq(
            this.startNum,
            this.firstDiff,
            this.secondDiff
        );

        ctx.strokeStyle = randomColor(0, 255, 0.5, 1);

        this.draw = () => {
            if (t % speed === 0) {
                this.nums.forEach(num => {
                    return ctx.strokeRect(
                        w / 2 - num / 2,
                        h / 2 - num / 2,
                        num,
                        num
                    );
                });
            }
            t++;
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.rot * Math.PI) / 180);
            ctx.translate(-w / 2, -h / 2);
            if (t % (speed * 90) === 0) {
                ctx.beginPath();
                ctx.strokeStyle = randomColor(0, 255, 0.5, 1);
                this.startNum = random(5, 50);
                this.firstDiff = random(10, 50);
                this.secondDiff = random(3, 45);
                this.nums = this.createSeq(
                    this.startNum,
                    this.firstDiff,
                    this.secondDiff
                );
            }
            if (t % (speed * 180) === 0) {
                this.rot = random(4, 91);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }

    createSeq(startNum, firstDiff, secondDiff) {
        const arr = [startNum];
        while (startNum < Math.max(w, h)) {
            startNum += firstDiff;
            firstDiff += secondDiff;
            arr.push(startNum);
        }
        return arr;
    }
}

class Hubble {
    constructor() {
        this.seq = this.createSeq(13);
        this.index = 0;
        this.currentVal = this.seq[this.index];
        this.rotate = random(1, 44);

        ctx.fillStyle = randomColor(0, 255, 0.01, 0.05);
        ctx.filter = 'blur(5px)';
        ctx.globalCompositeOperation = 'hard-light';

        this.draw = () => {
            if (t % speed === 0) {
                ctx.fillRect(
                    w / 2,
                    h / 2,
                    this.currentVal * 3,
                    this.currentVal * 3
                );
                ctx.fillRect(
                    w / 2,
                    h / 2,
                    this.currentVal * 3,
                    -this.currentVal * 3
                );
                ctx.fillRect(
                    w / 2,
                    h / 2,
                    -this.currentVal * 3,
                    this.currentVal * 3
                );
                ctx.fillRect(
                    w / 2,
                    h / 2,
                    -this.currentVal * 3,
                    -this.currentVal * 3
                );
                this.index++;
                if (this.index >= this.seq.length - 1) {
                    this.index = 0;
                    this.rotate = random(1, 44);
                    ctx.fillStyle = randomColor(0, 255, 0.01, 0.05);
                }
                this.currentVal = this.seq[this.index];
            }
            t++;
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rotate);
            ctx.translate(-w / 2, -h / 2);
            interval = requestAnimationFrame(this.draw);
        };
    }

    createSeq(num) {
        const start = [0, 1];
        const values = [];
        for (let i = 1; i <= num; i++) {
            for (let j = 1; j <= num; j++) {
                values.push(
                    j * i * (start[start.length - 2] + start[start.length - 1])
                );
            }
        }
        return values;
    }
}

class Vortrix {
    constructor() {
        this.x = random(0, w);
        this.y = random(0, h);
        this.size = random(60, 400);
        this.rot = random(1, 60);

        ctx.strokeStyle = ctx.shadowColor = randomColor(0, 255, 0.5, 1);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.shadowBlur = 10;

        this.draw = () => {
            if (t % speed === 0) {
                this.drawTriangle(this.x, this.y);
                this.size--;
            }
            t++;
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rot);
            ctx.translate(-w / 2, -h / 2);
            if (t % (speed * 360) === 0) {
                this.x = random(0, w);
                this.y = random(0, h);
                this.size = random(60, 400);
                this.rot = random(1, 60);
                ctx.strokeStyle = ctx.shadowColor = randomColor(0, 255, 0.5, 1);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
    drawTriangle = (x, y) => {
        ctx.moveTo(x, y);
        ctx.beginPath();
        ctx.lineTo(x + this.size, y);
        ctx.lineTo(x, y + this.size);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };
}

class VanishingPoint {
    constructor() {
        this.size = Math.min(w, h);
        this.decrease = random(2, 11);
        this.rot = random(1, 90);
        this.color1 = randomColor(0, 255, 1, 1);
        this.color2 = randomColor(0, 255, 1, 1);
        this.color3 = randomColor(0, 255, 1, 1);
        this.color4 = randomColor(0, 255, 1, 1);
        this.colors = [this.color1, this.color2, this.color3, this.color4];

        ctx.strokeStyle = 'black';

        this.draw = () => {
            if (t % speed === 0) {
                ctx.fillStyle = this.colors[random(0, this.colors.length)];
                this.drawTriangle(w / 2, h / 2);
                this.size -= this.decrease;
                if (this.size - this.decrease <= 1) {
                    this.size = 1;
                    this.decrease = 0;
                    this.color1 = randomColor(0, 255, 1, 1);
                    this.color2 = randomColor(0, 255, 1, 1);
                    this.color3 = randomColor(0, 255, 1, 1);
                    this.color4 = randomColor(0, 255, 1, 1);
                    this.colors = [
                        this.color1,
                        this.color2,
                        this.color3,
                        this.color4
                    ];
                    this.rot = random(1, 90);
                    setTimeout(() => {
                        this.size = Math.min(w, h);
                        this.decrease = random(2, 11);
                    }, 3500);
                }
            }
            t++;
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.rot * Math.PI) / 180);
            ctx.translate(-w / 2, -h / 2);
            interval = requestAnimationFrame(this.draw);
        };
    }
    drawTriangle = (x, y) => {
        ctx.moveTo(x, y);
        ctx.beginPath();
        ctx.lineTo(x + this.size, y);
        ctx.lineTo(x, y + this.size);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };
}

class Cubist {
    constructor() {
        this.divisions = [2, 4, 8, 16];
        this.width = w / this.divisions[random(0, this.divisions.length)];
        this.height = h / this.divisions[random(0, this.divisions.length)];
        this.cycles = 0;
        this.x = 0;
        this.y = 0;
        this.color1 = randomColor();
        this.color2 = randomColor();
        this.color3 = randomColor();
        this.color4 = randomColor();

        ctx.strokeStyle = 'black';
        ctx.globalCompositeOperation = 'soft-light';

        this.draw = () => {
            if (t % speed === 0) {
                if (stagger % 4 === 0) {
                    ctx.fillStyle = this.color1;
                    this.drawTriangle(this.x, this.y);
                }
                if (stagger % 4 === 1) {
                    ctx.fillStyle = this.color2;
                    this.drawTriangleReverse(this.x, this.y);
                }
                if (stagger % 4 === 2) {
                    ctx.fillStyle = this.color3;
                    this.drawInverseTriangle(this.x, this.y);
                }
                if (stagger % 4 === 3) {
                    ctx.fillStyle = this.color4;
                    this.drawInverseTriangleReverse(this.x, this.y);
                }
                this.x += this.width;
                if (this.x > w) {
                    this.y += this.height;
                    this.x = 0;
                }
                if (this.y > h) {
                    this.cycles++;
                    this.y = 0;
                    this.x = 0;
                    this.width =
                        w / this.divisions[random(0, this.divisions.length)];
                    this.height =
                        h / this.divisions[random(0, this.divisions.length)];
                    this.color1 = randomColor();
                    this.color2 = randomColor();
                    this.color3 = randomColor();
                    this.color4 = randomColor();
                }
            }
            t++;
            stagger++;
            interval = requestAnimationFrame(this.draw);
        };
    }

    drawTriangle = (x, y) => {
        ctx.moveTo(x, y);
        ctx.beginPath();
        ctx.lineTo(x + this.width, y);
        ctx.lineTo(x, y + this.height);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    };

    drawTriangleReverse = (x, y) => {
        ctx.moveTo(x + this.width, y);
        ctx.beginPath();
        ctx.lineTo(x, y + this.height);
        ctx.lineTo(x + this.width, y + this.height);
        ctx.lineTo(x + this.width, y);
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
    };

    drawInverseTriangle = (x, y) => {
        ctx.moveTo(x, y);
        ctx.beginPath();
        ctx.lineTo(x + this.width, y + this.height);
        ctx.lineTo(x + this.width, y);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };

    drawInverseTriangleReverse = (x, y) => {
        ctx.moveTo(x, y);
        ctx.beginPath();
        ctx.lineTo(x + this.width, y + this.height);
        ctx.lineTo(x, y + this.height);
        ctx.lineTo(x, y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };
}

class Subwoofer {
    constructor() {
        this.size = random(15, 200);
        this.factor = random(10, this.size);
        this.divisor = random(1, 25);
        this.color1 = randomColor();
        this.color2 = randomColor();
        this.color3 = randomColor();
        this.color4 = randomColor();
        this.color5 = randomColor();
        this.colors = [
            this.color1,
            this.color2,
            this.color3,
            this.color4,
            this.color5
        ];
        ctx.strokeStyle = 'white';
        ctx.lineWidth = random(7, 70);

        this.draw = () => {
            if (t % speed === 0) {
                for (let i = 0; i < 30; i++) {
                    ctx.strokeStyle = this.colors[i % 5];
                    ctx.beginPath();
                    ctx.arc(
                        w / 2,
                        h / 2,
                        this.size + i * ctx.lineWidth,
                        0,
                        2 * Math.PI
                    );
                    ctx.stroke();
                }
            }
            t++;
            this.size = Math.max(
                this.size + Math.sin(t / this.divisor) * this.factor,
                1
            );
            if (t % (speed * 110) === 0) {
                this.size = random(15, 200);
                this.factor = random(10, this.size);
                this.divisor = random(1, 25);
                this.color1 = randomColor();
                this.color2 = randomColor();
                this.color3 = randomColor();
                this.color4 = randomColor();
                this.color5 = randomColor();
                this.colors = [
                    this.color1,
                    this.color2,
                    this.color3,
                    this.color4,
                    this.color5
                ];
                ctx.lineWidth = random(7, 70);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class DeepSea {
    constructor() {
        this.rotations = [
            4, 5, 6, 8, 9, 10, 12, 15, 18, 20, 24, 30, 36, 40, 45, 72, 90
        ];
        this.startX = random(0, w);
        this.startY = random(0, h);
        this.cp1x = random(0, w);
        this.cp1y = random(0, h);
        this.cp2x = random(0, w);
        this.cp2y = random(0, h);
        this.endX = random(0, w);
        this.endY = random(0, h);
        this.factor = random(180, 850);
        this.factor2 = random(36, 170);
        this.rot = this.rotations[random(0, this.rotations.length)];

        ctx.strokeStyle = randomColor(50, 200, 0.35, 0.7);
        ctx.shadowColor = 'randomColor(75, 200, 0.3, 0.5);';
        ctx.lineWidth = 0.1;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.045)';
        ctx.shadowBlur = 2;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.fillRect(-w, -h, 3 * w, 3 * h);
                ctx.moveTo(this.startX, this.startY);
                ctx.bezierCurveTo(
                    this.cp1x,
                    this.cp1y,
                    this.cp2x,
                    this.cp2y,
                    this.endX,
                    this.endY
                );
                ctx.stroke();
                this.endX += Math.sin(t) * this.factor;
                this.endY += Math.cos(t) * this.factor;
                this.cp1x += Math.sin(t) * this.factor2;
                this.cp1y += Math.cos(t) * this.factor2;
            }
            t++;
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.rot * Math.PI) / 180);
            ctx.translate(-w / 2, -h / 2);
            if (t % (speed * 270) === 0) {
                ctx.beginPath();
                this.startX = random(0, w);
                this.startY = random(0, h);
                this.cp1x = random(0, w);
                this.cp1y = random(0, h);
                this.cp2x = random(0, w);
                this.cp2y = random(0, h);
                this.endX = random(0, w);
                this.endY = random(0, h);
                this.factor = random(180, 850);
                this.factor2 = random(36, 170);
                this.rot = this.rotations[random(0, this.rotations.length)];
                ctx.strokeStyle = randomColor(50, 200, 0.35, 0.7);
                ctx.shadowColor = randomColor(75, 255, 0.3, 0.5);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class SoapyBubbles {
    constructor() {
        this.size = random(5, 50);
        this.length = Math.random() * 5 + 1;
        this.angle = Math.random() * (Math.PI / 4) + 0.1;
        this.rot = random(1, 61);
        this.position = new Vector(0, 0);
        this.velocity = new Vector(0, 0);
        this.velocity.setLength(this.length);
        this.velocity.setAngle(this.angle);

        ctx.strokeStyle = ctx.shadowColor = randomColor(50, 255, 0.5, 1);
        ctx.shadowBlur = 30;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';

        this.draw = () => {
            if (t % speed === 0) {
                ctx.beginPath();
                ctx.arc(
                    this.position.getX(),
                    this.position.getY(),
                    this.size,
                    0,
                    2 * Math.PI
                );
                ctx.stroke();
                ctx.fill();
                this.position.addTo(this.velocity);
            }
            t++;
            if (t % (speed * 320) === 0) {
                this.size = random(5, 50);
                this.length = Math.random() * 5 + 1;
                this.angle = Math.random() * (Math.PI / 4) + 0.1;
                this.rot = random(1, 61);
                this.position = new Vector(0, 0);
                this.velocity = new Vector(0, 0);
                this.velocity.setLength(this.length);
                this.velocity.setAngle(this.angle);

                ctx.strokeStyle = ctx.shadowColor = randomColor(
                    50,
                    255,
                    0.5,
                    1
                );
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rot);
            ctx.translate(-w / 2, -h / 2);
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Gridlock {
    constructor() {
        this.gap = random(5, 70);
        this.inc = this.gap;
        ctx.strokeStyle = 'white';
        let white = true;
        ctx.moveTo(this.gap, this.gap);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.lineTo(this.gap, h - this.gap);
                ctx.stroke();
                ctx.lineTo(w - this.gap, h - this.gap);
                ctx.stroke();
                ctx.lineTo(w - this.gap, this.gap);
                ctx.stroke();
                ctx.lineTo(this.gap + this.inc, this.gap);
                ctx.stroke();
                this.gap += this.inc;
            }
            t++;

            if (t % (speed * 150) === 0) {
                ctx.lineWidth = random(1, 7);
                ctx.translate(w / 2, h / 2);
                ctx.rotate(random(1, 99));
                ctx.translate(-w / 2, -h / 2);
                this.gap = random(5, 70);
                this.inc = this.gap;
                ctx.beginPath();
                white = !white;
                if (white) {
                    ctx.strokeStyle = 'white';
                } else {
                    ctx.strokeStyle = 'black';
                }
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class GiveNTake {
    constructor() {
        this.x1 = random(0, w);
        this.x2 = random(0, w);
        this.y1 = random(0, h);
        this.y2 = random(0, h);
        this.x3 = random(0, w);
        this.x4 = random(0, w);
        this.y3 = random(0, h);
        this.y4 = random(0, h);
        this.x5 = random(0, w);
        this.x6 = random(0, w);
        this.y5 = random(0, h);
        this.y6 = random(0, h);
        this.rotate = random(2, 100);
        this.color1 = randomColor();
        this.color2 = 'rgba(0, 0, 0, 0.5)';

        this.draw = () => {
            if (t % speed === 0) {
                ctx.fillStyle = t % 2 ? this.color1 : this.color2;
                ctx.fillRect(this.x1++, this.y1, this.x2, this.y2);
                ctx.fillStyle = this.color1;

                ctx.translate(w / 2, h / 2);
                ctx.rotate((this.rotate * 180) / Math.PI);
                ctx.fillRect(this.x3, this.y3--, this.x4, this.y4);
                ctx.translate(-w / 2, -h / 2);
                ctx.fillStyle = t % 2 ? this.color2 : this.color1;
                ctx.fillRect(this.x5, this.y5, this.x6++, this.y6);
            }
            t++;
            if (t % (speed * 250) === 0) {
                ctx.beginPath();
                this.rotate = random(2, 100);
                this.color1 = randomColor();
                this.x1 = random(0, w);
                this.x2 = random(0, w);
                this.y1 = random(0, h);
                this.y2 = random(0, h);
                this.x3 = random(0, w);
                this.x4 = random(0, w);
                this.y3 = random(0, h);
                this.y4 = random(0, h);
                this.x5 = random(0, w);
                this.x6 = random(0, w);
                this.y5 = random(0, h);
                this.y6 = random(0, h);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Ethereal {
    constructor() {
        this.x1 = random(0, w);
        this.y1 = random(0, h);
        this.x2 = random(0, w);
        this.y2 = random(0, h);
        this.x3 = random(0, w);
        this.y3 = random(0, h);
        this.x4 = random(0, w);
        this.y4 = random(0, h);
        this.cp1x = random(this.x1, this.x2);
        this.cp1y = random(this.y1, this.y2);
        this.cp2x = random(this.x2, this.x3);
        this.cp2y = random(this.y2, this.y3);
        this.cp3x = random(this.x3, this.x4);
        this.cp3y = random(this.y3, this.y4);
        this.cp4x = random(this.x4, this.x1);
        this.cp4y = random(this.y4, this.y1);
        this.rot = random(1, 200);
        this.maxAlpha = 0.08;

        this.color1 = randomColor(0, 255, 0.02, this.maxAlpha);
        this.color2 = randomColor(0, 255, 0.02, this.maxAlpha);
        this.color3 = randomColor(0, 255, 0.02, this.maxAlpha);
        this.color4 = randomColor(0, 255, 0.02, this.maxAlpha);

        ctx.strokeStyle = randomColor();
        ctx.globalCompositeOperation = 'soft-light';
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.beginPath();
                ctx.fillStyle = this.color1;
                ctx.quadraticCurveTo(this.cp1x--, this.cp1y, this.x2, this.y2);
                ctx.fill();
                ctx.stroke();
                ctx.fillStyle = this.color2;
                ctx.quadraticCurveTo(this.cp2x, this.cp2y--, this.x3, this.y3);
                ctx.fill();
                ctx.fillStyle = this.color3;
                ctx.quadraticCurveTo(this.cp3x, this.cp3y, this.x4--, this.y4);
                ctx.fill();
                ctx.fillStyle = this.color4;
                ctx.quadraticCurveTo(this.cp4x, this.cp4y, this.x1, this.y1--);
                ctx.fill();
                ctx.translate(w / 2, h / 2);
                ctx.rotate(this.rot);
                ctx.translate(-w / 2, -h / 2);
            }
            t++;
            this.cp1x = random(this.x1, this.x2);
            this.cp1y = random(this.y1, this.y2);
            this.cp2x = random(this.x2, this.x3);
            this.cp2y = random(this.y2, this.y3);
            this.cp3x = random(this.x3, this.x4);
            this.cp3y = random(this.y3, this.y4);
            this.cp4x = random(this.x4, this.x1);
            this.cp4y = random(this.y4, this.y1);
            if (t % (speed * 120) === 0) {
                this.x1 = random(0, w);
                this.y1 = random(0, h);
                this.x2 = random(0, w);
                this.y2 = random(0, h);
                this.x3 = random(0, w);
                this.y3 = random(0, h);
                this.x4 = random(0, w);
                this.y4 = random(0, h);
                this.rot = random(1, 200);
                ctx.strokeStyle = randomColor();
                this.color1 = randomColor(0, 255, 0.02, this.maxAlpha);
                this.color2 = randomColor(0, 255, 0.02, this.maxAlpha);
                this.color3 = randomColor(0, 255, 0.02, this.maxAlpha);
                this.color4 = randomColor(0, 255, 0.02, this.maxAlpha);
            }
            if (t % (speed * 360) === 0) {
                this.maxAlpha += 0.01;
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Glowsticks {
    constructor() {
        this.dist = random(10, 100);
        this.x = random(0, w - this.dist);
        this.y = random(this.dist, h);
        this.rot = random(1, 200);

        ctx.strokeStyle = ctx.shadowColor = randomColor();
        ctx.shadowBlur = 5;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.moveTo(this.x++, this.y++);
                ctx.lineTo(this.x + this.dist, this.y - this.dist);
                ctx.stroke();
                if (this.x > w) this.x = 0;
                if (this.x < 0) this.x = w - this.dist;
                if (this.y > h) this.y = this.dist;
                if (this.y < 0) this.x = h;
            }
            t++;
            if (t % (speed * 900) === 0) {
                ctx.beginPath();
                ctx.clearRect(-w, -h, 3 * w, 3 * h);
                ctx.strokeStyle = ctx.shadowColor = randomColor();
                this.dist = random(10, 100);
                this.x = random(0, w - this.dist);
                this.y = random(this.dist, h);
                this.rot = random(1, 200);
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rot);
            ctx.translate(-w / 2, -h / 2);
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class Mikado {
    constructor() {
        this.points = [
            { x: 0, y: 0 },
            { x: w / 4, y: 0 },
            { x: w / 2, y: 0 },
            { x: w * 0.75, y: 0 },
            { x: w, y: 0 },
            { x: w / 4, y: h / 4 },
            { x: w / 4, y: h / 2 },
            { x: w / 4, y: h * 0.75 },
            { x: w / 4, y: h },
            { x: w / 2, y: h / 4 },
            { x: w / 2, y: h / 2 },
            { x: w / 2, y: h * 0.75 },
            { x: w / 2, y: h },
            { x: w * 0.75, y: h / 4 },
            { x: w * 0.75, y: h / 2 },
            { x: w * 0.75, y: h * 0.75 },
            { x: w * 0.75, y: h },
            { x: w, y: h / 4 },
            { x: w, y: h / 2 },
            { x: w, y: h * 0.75 },
            { x: w, y: h },
            { x: 0, y: h / 4 },
            { x: 0, y: h / 2 },
            { x: 0, y: h * 0.75 },
            { x: 0, y: h }
        ];
        this.point1 = this.points[random(0, this.points.length)];
        this.point2 = this.points.filter(
            p => p.x !== this.point1.x || p.y !== this.point1.y
        )[random(0, this.points.length - 1)];
        this.angle = random(6, 81);

        ctx.strokeStyle = randomColor();
        ctx.shadowColor = 'black';
        ctx.shadowBlur = 15;
        ctx.lineWidth = 0.1;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.moveTo(this.point1.x, this.point1.y);
                ctx.lineTo(this.point2.x, this.point2.y);
                ctx.stroke();
            }
            t++;
            if (t % (speed * 3) === 0) {
                ctx.translate(w / 2, h / 2);
                ctx.rotate((this.angle * Math.PI) / 180);
                ctx.translate(-w / 2, -h / 2);
            }
            if (t % (speed * 300) === 0) {
                ctx.beginPath();
                ctx.strokeStyle = randomColor();
                this.angle = random(6, 81);
                this.point1 = this.points[random(0, this.points.length)];
                this.point2 = this.points.filter(
                    p => p.x !== this.point1.x || p.y !== this.point1.y
                )[random(0, this.points.length - 1)];
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class SemiRings {
    constructor() {
        this.points = [
            { x: 0, y: 0 },
            { x: w / 4, y: 0 },
            { x: w / 2, y: 0 },
            { x: w * 0.75, y: 0 },
            { x: w, y: 0 },
            { x: w / 4, y: h / 4 },
            { x: w / 4, y: h / 2 },
            { x: w / 4, y: h * 0.75 },
            { x: w / 4, y: h },
            { x: w / 2, y: h / 4 },
            { x: w / 2, y: h / 2 },
            { x: w / 2, y: h * 0.75 },
            { x: w / 2, y: h },
            { x: w * 0.75, y: h / 4 },
            { x: w * 0.75, y: h / 2 },
            { x: w * 0.75, y: h * 0.75 },
            { x: w * 0.75, y: h },
            { x: w, y: h / 4 },
            { x: w, y: h / 2 },
            { x: w, y: h * 0.75 },
            { x: w, y: h },
            { x: 0, y: h / 4 },
            { x: 0, y: h / 2 },
            { x: 0, y: h * 0.75 },
            { x: 0, y: h }
        ];
        this.point1 = this.points[random(0, this.points.length)];
        this.point2 = this.points.filter(
            p => p.x !== this.point1.x || p.y !== this.point1.y
        )[random(0, this.points.length - 1)];
        this.angle = random(1, 91);

        ctx.strokeStyle = randomColor(20, 255, 0.33, 1);

        this.draw = () => {
            if (t % speed === 0) {
                ctx.beginPath();
                ctx.arc(
                    this.point1.x,
                    this.point1.y,
                    random(10, 150),
                    0,
                    Math.PI
                );
                ctx.stroke();
                this.point1 = this.points[random(0, this.points.length)];
            }
            t++;
            if (t % (speed * 300) === 0) {
                ctx.beginPath();
                ctx.strokeStyle = randomColor(20, 255, 0.33, 1);
                this.angle = random(1, 91);
                this.point1 = this.points[random(0, this.points.length)];
                this.point2 = this.points.filter(
                    p => p.x !== this.point1.x || p.y !== this.point1.y
                )[random(0, this.points.length - 1)];
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class FourDee {
    constructor() {
        this.springPoint = { x: w / 2, y: h / 2 };
        this.weight = new Particle(random(0, w), random(0, h), 0, 0);
        this.weight.radius = 20;
        this.rot = random(-90, -1);
        let k = 0.1;

        ctx.strokeStyle = randomColor();
        ctx.fillStyle = randomColor(40, 255, 0.1, 0.25);

        this.draw = () => {
            if (t % speed === 0) {
                const dx = this.springPoint.x - this.weight.x;
                const dy = this.springPoint.y - this.weight.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const springForce = distance * k;
                const ax = (dx / distance) * springForce;
                const ay = (dy / distance) * springForce;
                this.weight.vx += ax;
                this.weight.vy += ay;
                this.weight.update();
                ctx.beginPath();
                ctx.arc(
                    this.weight.x,
                    this.weight.y,
                    this.weight.radius,
                    0,
                    2 * Math.PI
                );
                ctx.fill();
            }
            t++;
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rot);
            ctx.translate(-w / 2, -h / 2);
            if (t % (speed * 540) === 0) {
                ctx.fillStyle = 'black';
                ctx.fillRect(-w, -h, 3 * w, 3 * h);
                this.weight = new Particle(
                    random(0, w),
                    random(0, h),
                    random(-50, 50),
                    random(-360, 360)
                );
                this.weight.radius = 20;
                k = Math.random();
                this.rot = random(-90, -1);
                ctx.fillStyle = randomColor(40, 255, 0.1, 0.25);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class SpringOrbits {
    constructor() {
        this.springPoint = { x: w / 2, y: h / 2 };
        this.weight = new Particle(
            random(0, w),
            random(0, h),
            random(15, 120),
            Math.random() * Math.PI * 2
        );
        this.weight.friction = 0.975;
        let k = 0.04;

        ctx.strokeStyle = ctx.shadowColor = randomColor();
        ctx.shadowBlur = 2;
        ctx.lineWidth = 3;
        ctx.fillStyle = 'white';

        this.draw = () => {
            if (t % speed === 0) {
                const dx = this.springPoint.x - this.weight.x;
                const dy = this.springPoint.y - this.weight.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const springForce = distance * k;
                const ax = (dx / distance) * springForce;
                const ay = (dy / distance) * springForce;
                this.weight.vx += ax;
                this.weight.vy += ay;
                this.weight.update();
                ctx.beginPath();
                ctx.arc(
                    this.springPoint.x,
                    this.springPoint.y,
                    8,
                    0,
                    2 * Math.PI
                );
                ctx.fill();
                ctx.beginPath();
                ctx.moveTo(this.weight.x, this.weight.y);
                ctx.lineTo(this.springPoint.x, this.springPoint.y);
                ctx.stroke();
            }
            t++;
            if (t % (speed * 180) === 0) {
                this.weight = new Particle(
                    random(0, w),
                    random(0, h),
                    random(15, 120),
                    Math.random() * Math.PI * 2
                );
                this.weight.friction = 0.975;
                ctx.strokeStyle = ctx.shadowColor = randomColor();
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class GameOfFlies {
    constructor() {
        this.springPoint = { x: w / 2, y: h / 2 };
        this.p = new Particle(
            random(0, w),
            random(0, h),
            random(5, 50),
            Math.random() * Math.PI * 2
        );
        this.p.radius = random(3, 9);
        this.p.color = randomColor(60, 255, 0.5, 1);
        this.particles = [this.p];
        let k = 0.14;

        ctx.fillStyle = this.color2;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.fillStyle = 'rgba(0,0,0,0.14)';
                ctx.fillRect(0, 0, w, h);
                this.particles.forEach(prtcl => {
                    const dx = this.springPoint.x - prtcl.x;
                    const dy = this.springPoint.y - prtcl.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const springForce = distance * k;
                    const ax = (dx / distance) * springForce;
                    const ay = (dy / distance) * springForce;
                    prtcl.vx += ax;
                    prtcl.vy += ay;
                    prtcl.update();
                    ctx.beginPath();
                    ctx.arc(prtcl.x, prtcl.y, prtcl.radius, 0, 2 * Math.PI);
                    ctx.fillStyle = prtcl.color;
                    ctx.fill();
                });
            }
            t++;
            if (t % (speed * 130) === 0) {
                const p = new Particle(
                    random(0, w),
                    random(0, h),
                    random(5, 50),
                    Math.random() * Math.PI * 2
                );
                p.radius = random(3, 9);
                p.color = randomColor(60, 255, 0.5, 1);
                this.particles.push(p);
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
}

class GravityTurbulence {
    constructor() {
        this.sun1 = new Particle(150, 200, 1, Math.random() * Math.PI * 2);
        this.sun2 = new Particle(w / 2, h / 2, 2, Math.random() * Math.PI * 2);

        this.particles = [];
        this.numParticles = 200;
        this.sun1.mass = 50000;
        this.sun1.radius = 40;
        this.sun2.mass = -10000;
        this.sun2.radius = 30;

        for (let i = 0; i < this.numParticles; i++) {
            const p = new Particle(
                utils.randomRange(0, w),
                utils.randomRange(0, h),
                utils.randomRange(7, 8),
                Math.PI / 2 + utils.randomRange(-0.1, 0.1)
            );
            p.addGravitation(this.sun1);
            p.addGravitation(this.sun2);
            p.radius = 1.25;
            this.particles.push(p);
        }

        this.draw = () => {
            ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            ctx.fillRect(0, 0, w, h);
            this.sun1.update();
            this.sun2.update();
            if (this.sun1.x - this.sun1.radius > w) {
                this.sun1.x = -this.sun1.radius;
            }
            if (this.sun1.x + this.sun1.radius < 0) {
                this.sun1.x = w + this.sun1.radius;
            }
            if (this.sun1.y - this.sun1.radius > h) {
                this.sun1.y = -this.sun1.radius;
            }
            if (this.sun1.y + this.sun1.radius < 0) {
                this.sun1.y = h + this.sun1.radius;
            }
            if (this.sun2.x - this.sun2.radius > w) {
                this.sun2.x = -this.sun2.radius;
            }
            if (this.sun2.x + this.sun2.radius < 0) {
                this.sun2.x = w + this.sun2.radius;
            }
            if (this.sun2.y - this.sun2.radius > h) {
                this.sun2.y = -this.sun2.radius;
            }
            if (this.sun2.y + this.sun2.radius < 0) {
                this.sun2.y = h + this.sun2.radius;
            }
            this.particles.forEach(particle => {
                particle.update();
                this.drawPart(particle, 'white');
                if (
                    particle.x > w ||
                    particle.x < 0 ||
                    particle.y > h ||
                    particle.y < 0
                ) {
                    particle.x = utils.randomRange(0, w);
                    particle.y = utils.randomRange(0, h);
                    particle.setSpeed(utils.randomRange(7, 8));
                    particle.setHeading(
                        Math.PI / 2 + utils.randomRange(-0.1, 0.1)
                    );
                }
            });
            t++;
            if (t % (speed * 250) === 0) {
                this.sun1.mass = random(-100000, 100000);
                this.sun1.radius = random(3, 25);
                this.sun1.direction = Math.random() * Math.PI * 2;
                this.sun1.speed = Math.random() * 5 - 2.5;
                this.sun2.mass = random(-100000, 100000);
                this.sun2.radius = random(5, 40);
                this.sun2.direction = Math.random() * Math.PI * 2;
                this.sun2.speed = Math.random() * 5 - 2.5;
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
    drawPart(p, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

class Flares {
    constructor() {
        this.cp1x = random(0, w);
        this.cp1y = random(0, h);
        this.cp2x = random(0, w);
        this.cp2y = random(0, h);
        this.x = random(0, w);
        this.y = random(0, h);
        this.rot1 = random(1, 90);
        this.rot2 = random(1, 90);
        this.increment = random(10, 70);
        this.flares = random(3, 15);
        this.modes = [
            'source-over',
            'hard-light',
            'soft-light',
            'overlay',
            'xor',
            'difference',
            'exclusion',
            'lighten',
            'darken',
            'hue',
            'color',
            'luminosity',
            'multiply',
            'screen'
        ];

        ctx.strokeStyle = randomColor(0, 255, 0.5, 1);
        ctx2.strokeStyle = randomColor(0, 255, 0.5, 1);
        ctx.globalCompositeOperation = 'hard-light';
        ctx2.globalCompositeOperation = 'soft-light';

        this.draw = () => {
            if (t % speed === 0) {
                for (let i = 0; i < this.flares; i++) {
                    this.drawBezier(ctx, i * this.increment);
                    this.drawBezier(ctx2, i * this.increment);
                }
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rot1);
            ctx.translate(-w / 2, -h / 2);
            ctx2.translate(w / 2, h / 2);
            ctx2.rotate(this.rot2);
            ctx2.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 180) === 0) {
                this.cp1x = random(0, w);
                this.cp1y = random(0, h);
                this.cp2x = random(0, w);
                this.cp2y = random(0, h);
                this.x = random(0, w);
                this.y = random(0, h);
                this.rot1 = random(1, 90);
                this.rot2 = random(1, 90);
                this.increment = random(10, 70);
                this.flares = random(3, 15);
                ctx.strokeStyle = randomColor(0, 255, 0.5, 1);
                ctx2.strokeStyle = randomColor(0, 255, 0.5, 1);
                ctx.globalCompositeOperation =
                    this.modes[random(0, this.modes.length)];
                ctx2.globalCompositeOperation =
                    this.modes[random(0, this.modes.length)];
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
    drawBezier(context, increment) {
        context.beginPath();
        context.moveTo(w / 2, h / 2);
        context.bezierCurveTo(
            this.cp1x + increment,
            this.cp1y + increment,
            this.cp2x + increment,
            this.cp2y + increment,
            this.x + increment,
            this.y + increment
        );
        context.stroke();
        context.closePath();
    }
}

class Pulsar {
    constructor() {
        this.cp1x = random(0, w);
        this.cp1y = random(0, h);
        this.cp2x = random(0, w);
        this.cp2y = random(0, h);
        this.x = random(0, w);
        this.y = random(0, h);
        this.rot1 = random(1, 90);
        this.rot2 = random(1, 90);
        this.pulse1 = random(50, 300);
        this.pulse2 = random(30, 200);

        ctx.lineWidth = ctx2.lineWidth = 5;
        ctx.strokeStyle = ctx.shadowColor = randomColor();
        ctx2.strokeStyle = ctx2.shadowColor = randomColor();
        ctx.shadowBlur = ctx2.shadowBlur = 2;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.clearRect(-w, -h, 3 * w, 3 * h);
                ctx2.clearRect(-w, -h, 3 * w, 3 * h);
                for (let i = 0; i < 20; i++) {
                    this.drawBezier(ctx, i * 15);
                    this.drawBezier(ctx2, i * -15);
                }
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.rot1 * Math.PI) / 180);
            ctx.translate(-w / 2, -h / 2);
            ctx2.translate(w / 2, h / 2);
            ctx2.rotate((this.rot2 * Math.PI) / 180);
            ctx2.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 160) === 0) {
                this.cp1x = random(0, w);
                this.cp1y = random(0, h);
                this.cp2x = random(0, w);
                this.cp2y = random(0, h);
                this.x = random(0, w);
                this.y = random(0, h);
                this.rot1 = random(1, 90);
                this.rot2 = random(1, 90);
                this.pulse1 = random(50, 300);
                this.pulse2 = random(30, 200);
                ctx.strokeStyle = ctx.shadowColor = randomColor();
                ctx2.strokeStyle = ctx2.shadowColor = randomColor();
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
    drawBezier(context, rot) {
        context.beginPath();
        context.moveTo(
            w / 2 + Math.sin(t) * this.pulse1,
            h / 2 + Math.cos(t) * this.pulse2
        );
        context.translate(w / 2, h / 2);
        context.rotate((rot * Math.PI) / 180);
        context.bezierCurveTo(
            this.cp1x + rot,
            this.cp1y + this.pulse1,
            this.cp2x - rot,
            this.cp2y - this.pulse2,
            this.x,
            this.y
        );
        context.stroke();
        context.closePath();
        context.translate(-w / 2, -h / 2);
    }
}

class Shards {
    constructor() {
        this.c1x1 = random(0, w);
        this.c1y1 = random(0, h);
        this.c1x2 = random(0, w);
        this.c1y2 = random(0, h);
        this.c2x1 = random(0, w);
        this.c2y1 = random(0, h);
        this.c2x2 = random(0, w);
        this.c2y2 = random(0, h);
        this.x = random(0, w);
        this.y = random(0, h);
        this.rot1 = random(1, 90);
        this.rot2 = random(1, 90);
        this.deviation1 = random(50, 200);
        this.deviation2 = random(50, 200);
        this.color1 = randomColor(0, 255, 1, 1);
        this.color2 = randomColor();
        this.modes = [
            'source-over',
            'hard-light',
            'soft-light',
            'overlay',
            'xor',
            'difference',
            'exclusion',
            'lighten',
            'darken',
            'hue',
            'color',
            'luminosity',
            'multiply',
            'screen'
        ];

        ctx.strokeStyle = randomColor(0, 255, 1, 1);
        ctx2.strokeStyle = randomColor();
        ctx.globalCompositeOperation = this.modes[random(0, this.modes.length)];
        ctx2.globalCompositeOperation =
            this.modes[random(0, this.modes.length)];
        ctx2.globalAlpha = 0.7;

        this.draw = () => {
            if (t % speed === 0) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.01)';
                ctx2.fillStyle = 'rgba(0, 0, 0, 0.01)';
                ctx.fillRect(-w, -h, 3 * w, 3 * h);
                ctx2.fillRect(-w, -h, 3 * w, 3 * h);
                ctx.fillStyle = this.color1;
                this.drawTriangle(ctx);
                ctx2.fillStyle = this.color2;
                this.drawTriangle(ctx2);
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rot1);
            ctx.translate(-w / 2, -h / 2);
            ctx2.translate(w / 2, h / 2);
            ctx2.rotate(this.rot2);
            ctx2.translate(-w / 2, -h / 2);
            t++;
            if (t % (speed * 150) === 0) {
                this.c1x1 = random(0, w);
                this.c1y1 = random(0, h);
                this.c1x2 = random(0, w);
                this.c1y2 = random(0, h);
                this.c2x1 = random(0, w);
                this.c2y1 = random(0, h);
                this.c2x2 = random(0, w);
                this.c2y2 = random(0, h);
                this.rot1 = random(1, 90);
                this.rot2 = random(1, 90);
                this.color1 = randomColor(0, 255, 1, 1);
                this.color2 = randomColor();
                ctx.globalCompositeOperation =
                    this.modes[random(0, this.modes.length)];
                ctx2.globalCompositeOperation =
                    this.modes[random(0, this.modes.length)];

                ctx.strokeStyle = randomColor(0, 255, 1, 1);
                ctx2.strokeStyle = randomColor();
            }
            interval = requestAnimationFrame(this.draw);
        };
    }
    drawTriangle(context) {
        context.beginPath();
        context.moveTo(w / 2 + Math.sin(t) * 100, h / 2 + Math.cos(t) * 100);
        context === ctx && context.lineTo(this.c1x1, this.c1y1);
        context === ctx2 && context.lineTo(this.c2x1, this.c2y1);
        context === ctx && context.lineTo(this.c1x2, this.c1y2);
        context === ctx2 && context.lineTo(this.c2x2, this.c2y2);
        context.lineTo(
            w / 2 +
                Math.sin(t) *
                    (context === ctx ? this.deviation1 : this.deviation2),
            h / 2 +
                Math.cos(t) *
                    (context === ctx ? this.deviation1 : this.deviation2)
        );
        context.stroke();
        context.fill();
        context.closePath();
    }
}

class Coils {
    constructor() {
        this.obj1 = {
            x: 0,
            y: 0,
            radius: random(10, 35),
            color: randomColor(60, 255, 0.6, 1)
        };
        this.obj2 = {
            x: w / 2,
            y: h / 2,
            radius: random(30, 130),
            color: randomColor(60, 255, 0.6, 1)
        };
        this.dur1 = random(5, 20);
        this.dur2 = random(8, 30);
        this.dur3 = random(10, 40);
        this.dur4 = random(3, 10);
        this.rot = random(1, 100);
        this.tl = null;

        ctx.shadowBlur = 15;

        ctx.strokeStyle = ctx.shadowColor = this.obj1.color;

        this.getTweens();

        this.draw = () => {
            if (t % speed === 0) {
                ctx.beginPath();
                ctx.arc(
                    this.obj1.x,
                    this.obj1.y,
                    this.obj1.radius,
                    0,
                    2 * Math.PI
                );
                ctx.fill();
                ctx.stroke();
                ctx.closePath();
            }
            t++;

            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rot);
            ctx.translate(-w / 2, -h / 2);

            if (t % (speed * 720) === 0) {
                this.tl.kill();
                this.obj1 = {
                    x: 0,
                    y: 0,
                    radius: random(10, 35),
                    color: randomColor(60, 255, 0.6, 1)
                };
                this.obj2 = {
                    x: w / 2,
                    y: h / 2,
                    radius: random(30, 130),
                    color: randomColor(60, 255, 0.6, 1)
                };
                this.dur1 = random(5, 20);
                this.dur2 = random(8, 30);
                this.dur3 = random(10, 40);
                this.dur4 = random(3, 10);
                this.rot = random(1, 100);
                this.getTweens();
            }
            interval = requestAnimationFrame(this.draw);
        };
    }

    getTweens() {
        this.tl = gsap.timeline({ defaults: { repeat: -1, yoyo: true } });
        this.tl
            .to(this.obj1, {
                duration: this.dur1,
                x: this.obj2.x,
                easing: 'elastic'
            })
            .to(
                this.obj1,
                {
                    duration: this.dur2,
                    y: this.obj2.y,
                    easing: 'bounce'
                },
                '<'
            )
            .to(
                this.obj1,
                {
                    duration: this.dur3,
                    radius: this.obj2.radius,
                    easing: 'back.out(3)'
                },
                '<'
            )
            .to(
                this.obj1,
                {
                    duration: this.dur4,
                    color: this.obj2.color,
                    easing: 'linear',
                    onUpdate: () =>
                        (ctx.strokeStyle = ctx.shadowColor = this.obj1.color)
                },
                '<'
            );
    }
}

class Mesmerize {
    constructor() {
        this.rot = random(1, 199);
        this.w1 = random(30, 300);
        this.h1 = random(30, 300);
        this.w2 = random(60, 600);
        this.h2 = random(60, 600);
        this.x1 = random(0, w - this.w1);
        this.x2 = random(0, w - this.w1);
        this.y1 = random(0, h - this.height);
        this.y2 = random(0, h - this.height);
        this.ul1 = random(0, 30);
        this.ur1 = random(0, 30);
        this.ll1 = random(0, 30);
        this.lr1 = random(0, 30);
        this.ul2 = random(-300, 600);
        this.ur2 = random(-300, 600);
        this.ll2 = random(-300, 600);
        this.lr2 = random(-300, 600);
        this.color1 = randomColor(127, 255);
        this.color2 = randomColor(0, 127);
        this.fill1 = randomColor(0, 255, 0.01, 0.04);
        this.fill2 = randomColor(0, 255, 0.04, 0.1);
        this.obj1 = {
            width: this.w1,
            height: this.h1,
            x: this.x1,
            y: this.y1,
            upperLeft: this.ul1,
            upperRight: this.ur1,
            lowerLeft: this.ll1,
            lowerRight: this.lr1,
            color: this.color1,
            fill: this.fill1
        };
        this.obj2 = {
            width: this.w2,
            height: this.h2,
            x: this.x2,
            y: this.y2,
            upperLeft: this.ul2,
            upperRight: this.ur2,
            lowerLeft: this.ll2,
            lowerRight: this.lr2,
            color: this.color2,
            fill: this.fill2
        };

        ctx.strokeStyle = this.obj1.color;
        ctx.fillStyle = this.obj1.fill;

        this.getTweens();

        this.draw = () => {
            if (t % speed === 0) {
                ctx.roundRect(
                    this.obj1.width,
                    this.obj1.height,
                    this.obj1.x,
                    this.obj1.y,
                    {
                        upperLeft: this.obj1.upperLeft,
                        upperRight: this.obj1.upperRight,
                        lowerLeft: this.obj1.lowerLeft,
                        lowerRight: this.obj1.lowerRight
                    },
                    true,
                    true
                );
            }
            t++;
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rot);
            ctx.translate(-w / 2, -h / 2);
            if (t % (speed * 1620) === 0) {
                this.tl.kill();
                ctx.clearRect(-w, -h, 3 * w, 3 * h);
                this.rot = random(1, 199);
                this.w1 = random(30, 300);
                this.h1 = random(30, 300);
                this.w2 = random(60, 600);
                this.h2 = random(60, 600);
                this.x1 = random(0, w - this.w1);
                this.x2 = random(0, w - this.w1);
                this.y1 = random(0, h - this.height);
                this.y2 = random(0, h - this.height);
                this.ul1 = random(0, 30);
                this.ur1 = random(0, 30);
                this.ll1 = random(0, 30);
                this.lr1 = random(0, 30);
                this.ul2 = random(-300, 600);
                this.ur2 = random(-300, 600);
                this.ll2 = random(-300, 600);
                this.lr2 = random(-300, 600);
                this.color1 = randomColor(127, 255);
                this.color2 = randomColor(0, 127);
                this.fill1 = randomColor(0, 255, 0.01, 0.04);
                this.fill2 = randomColor(0, 255, 0.04, 0.1);
                this.obj1 = {
                    width: this.w1,
                    height: this.h1,
                    x: this.x1,
                    y: this.y1,
                    upperLeft: this.ul1,
                    upperRight: this.ur1,
                    lowerLeft: this.ll1,
                    lowerRight: this.lr1,
                    color: this.color1,
                    fill: this.fill1
                };
                this.obj2 = {
                    width: this.w2,
                    height: this.h2,
                    x: this.x2,
                    y: this.y2,
                    upperLeft: this.ul2,
                    upperRight: this.ur2,
                    lowerLeft: this.ll2,
                    lowerRight: this.lr2,
                    color: this.color2,
                    fill: this.fill2
                };

                this.rot = random(1, 199);
                ctx.strokeStyle = this.obj1.color;
                ctx.fillStyle = this.obj1.fill;

                this.getTweens();
            }
            interval = requestAnimationFrame(this.draw);
        };
    }

    getTweens() {
        this.tl = gsap.timeline({
            defaults: { repeat: -1, yoyo: true, easing: 'linear' }
        });
        this.tl
            .to(this.obj1, {
                duration: random(10, 100),
                width: this.obj2.width
            })
            .to(
                this.obj1,
                {
                    duration: random(10, 100),
                    height: this.obj2.height
                },
                '<'
            )
            .to(
                this.obj1,
                {
                    duration: random(10, 100),
                    x: this.obj2.x
                },
                '<'
            )
            .to(
                this.obj1,
                {
                    duration: random(10, 100),
                    y: this.obj2.y
                },
                '<'
            )
            .to(
                this.obj1,
                {
                    duration: random(10, 100),
                    upperLeft: this.obj2.upperLeft
                },
                '<'
            )
            .to(
                this.obj1,
                {
                    duration: random(10, 100),
                    upperRight: this.obj2.upperRight
                },
                '<'
            )
            .to(
                this.obj1,
                {
                    duration: random(10, 100),
                    lowerLeft: this.obj2.lowerLeft
                },
                '<'
            )
            .to(
                this.obj1,
                {
                    duration: random(1, 10),
                    lowerRight: this.obj2.lowerRight
                },
                '<'
            )
            .to(
                this.obj1,
                {
                    duration: random(2, 20),
                    color: this.obj2.color,
                    onUpdate: () => (ctx.strokeStyle = this.obj1.color)
                },
                '<'
            )
            .to(
                this.obj1,
                {
                    duration: random(2, 20),
                    fill: this.obj2.fill,
                    onUpdate: () => (ctx.fillStyle = this.obj1.fill)
                },
                '<'
            );
    }
}

class GenesisTypewriter {
    constructor() {
        this.tl = null;
        this.letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        this.text = this.letters[random(0, this.letters.length)];
        this.font1 = { size: random(20, 100) };
        this.font2 = { size: random(160, 600) };
        this.pos1 = { x: random(0, w), y: random(0, h) };
        this.pos2 = { x: random(0, w), y: random(0, h) };
        this.line1 = { width: 1 };
        this.line2 = { width: random(3, 7) };
        this.rot1 = { angle: random(1, 44) };
        this.rot2 = { angle: random(1, 44) };

        ctx.font = `${this.font1.size}px bold serif`;
        ctx.lineWidth = this.line1.width;
        ctx.strokeStyle = 'white';
        ctx.fillStyle = 'black';

        this.getTweens();

        this.draw = () => {
            ctx.fillText(this.text, this.pos1.x, this.pos1.y);
            ctx.strokeText(this.text, this.pos1.x, this.pos1.y);

            t++;
            if (t % 1000 === 0) {
                this.tl.kill();
                this.text = this.letters[random(0, this.letters.length)];
                this.font1 = { size: random(20, 100) };
                this.font2 = { size: random(160, 600) };
                this.pos1 = { x: random(0, w), y: random(0, h) };
                this.pos2 = { x: random(0, w), y: random(0, h) };
                this.line1 = { width: 1 };
                this.line2 = { width: random(3, 7) };
                this.rot1 = { angle: random(1, 44) };
                this.rot2 = { angle: random(1, 44) };

                ctx.font = `${this.font1.size}px bold serif`;
                ctx.lineWidth = this.line1.width;
                ctx.strokeStyle =
                    Math.random() < 0.25 ? 'white' : randomColor();
                ctx.fillStyle = 'black';

                this.getTweens();
            }
            ctx.translate(w / 2, h / 2);
            ctx.rotate((this.rot1.angle * 180) / Math.PI);
            ctx.translate(-w / 2, -h / 2);
            interval = requestAnimationFrame(this.draw);
        };
    }

    getTweens() {
        this.tl = gsap.timeline({
            defaults: { repeat: -1, yoyo: true, easing: 'back.out(1.7)' }
        });
        this.tl
            .to(
                this.font1,
                {
                    duration: random(12, 40),
                    size: this.font2.size,
                    onUpdate: () =>
                        (ctx.font = `${this.font1.size}px bold serif`)
                },
                '<'
            )
            .to(
                this.pos1,
                {
                    duration: random(15, 50),
                    x: this.pos2.x
                },
                '<'
            )
            .to(
                this.pos1,
                {
                    duration: random(15, 50),
                    y: this.pos2.y
                },
                '<'
            )
            .to(
                this.line1,
                {
                    duration: random(6, 14),
                    width: this.line2.width,
                    onUpdate: () => (ctx.lineWidth = this.line1.width)
                },
                '<'
            );
    }
}

class Dye {
    constructor() {
        this.tl = null;
        this.letters = [
            3405, 3423, 3424, 3437, 3442, 3443, 3444, 3458, 3459, 3461, 3465,
            3466, 3468, 3471, 3482, 3484, 3491, 3492, 3493
        ];
        this.text = String.fromCharCode(
            this.letters[random(0, this.letters.length)]
        ).padStart(30, ' ');
        this.font1 = { size: random(14, 40) };
        this.font2 = { size: random(60, 150) };
        this.line1 = { width: 1 };
        this.line2 = { width: random(4, 12) };
        this.rot = random(1, 500);
        this.color1 = { color: randomColor() };
        this.color2 = { color: randomColor() };
        this.color3 = { color: randomColor() };
        this.color4 = { color: randomColor() };
        this.offsetX = random(-w / 5 / 2, w / 5 / 2);
        this.offsetY = random(-h / 5 / 2, h / 5 / 2);

        ctx.font = `${this.font1.size}px bold serif`;
        ctx.lineWidth = this.line1.width;
        ctx.strokeStyle = this.color1.color;
        ctx.fillStyle = this.color2.color;
        ctx.globalCompositeOperation = 'soft-light';

        this.getTweens();

        this.draw = () => {
            for (let i = -100; i <= w + 100; i += w / 5) {
                for (let j = -100; j <= h + 100; j += h / 5) {
                    ctx.translate(w / 2, h / 2);
                    ctx.rotate(this.rot);
                    ctx.translate(-w / 2, -h / 2);
                    ctx.fillText(this.text, i + this.offsetX, j + this.offsetY);
                    ctx.strokeText(
                        this.text,
                        i + this.offsetX,
                        j + this.offsetY
                    );
                }
            }
            t++;
            if (t % (speed * 400) === 0) {
                this.rot = random(1, 500);
            }
            if (t % 80 === 0) {
                this.tl.kill();
                this.text = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                ).padStart(30, ' ');
                this.font1 = { size: random(14, 40) };
                this.font2 = { size: random(60, 150) };
                this.line1 = { width: 1 };
                this.line2 = { width: random(4, 12) };
                this.color1 = { color: randomColor() };
                this.color2 = { color: randomColor() };
                this.color3 = { color: randomColor() };
                this.color4 = { color: randomColor() };
                this.offsetX = random(-w / 5 / 2, w / 5 / 2);
                this.offsetY = random(-h / 5 / 2, h / 5 / 2);

                ctx.font = `${this.font1.size}px bold serif`;
                ctx.lineWidth = this.line1.width;
                ctx.strokeStyle = this.color1.color;
                ctx.fillStyle = this.color2.color;

                this.getTweens();
            }
            interval = requestAnimationFrame(this.draw);
        };
    }

    getTweens() {
        this.tl = gsap.timeline({
            defaults: { repeat: -1, yoyo: true, easing: 'circ' }
        });
        this.tl
            .to(
                this.font1,
                {
                    duration: random(4, 10),
                    size: this.font2.size,
                    onUpdate: () =>
                        (ctx.font = `${this.font1.size}px bold serif`)
                },
                '<'
            )
            .to(
                this.color1,
                {
                    duration: random(3, 13),
                    color: this.color3.color,
                    onUpdate: () => (ctx.strokeStyle = this.color1.color)
                },
                '<'
            )
            .to(
                this.color2,
                {
                    duration: random(3, 10),
                    color: this.color1.color,
                    onUpdate: () => (ctx.fillStyle = this.color2.color)
                },
                '<'
            )
            .to(
                this.line1,
                {
                    duration: random(2, 10),
                    width: this.line2.width,
                    onUpdate: () => (ctx.lineWidth = this.line1.width)
                },
                '<'
            );
    }
}

class PlanetMoss {
    constructor() {
        this.tl = null;
        this.letters = [
            3501, 3502, 3503, 3504, 3505, 3511, 3521, 3523, 3530, 3571, 3572,
            3585, 3588, 3589, 3591, 3598
        ];
        this.text = String.fromCharCode(
            this.letters[random(0, this.letters.length)]
        );
        this.modes = [
            'source-over',
            'multiply',
            'darken',
            'lighten',
            'xor',
            'difference',
            'exclusion',
            'overlay',
            'screen',
            'hue',
            'luminosity',
            'color',
            'saturation',
            'soft-light',
            'hard-light'
        ];
        this.rot1 = { rot: random(1, 90) };
        this.rot2 = { rot: random(1, 90) };
        this.pos1 = { x: random(0, w), y: random(0, h) };
        this.pos2 = { x: random(0, w), y: random(0, h) };
        this.fontsize = random(7, 25);

        ctx.font = `${this.fontsize}px bold serif`;
        ctx.strokeStyle = randomColor();
        ctx.fillStyle = randomColor();
        ctx.globalCompositeOperation = this.modes[random(0, this.modes.length)];

        this.getTweens();

        this.draw = () => {
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rot1.rot);
            ctx.fillRect(0, h / 2 - 1, w, h / 2 + 1);
            ctx.translate(-w / 2, -h / 2);
            ctx.fillText(this.text, this.pos1.x, this.pos1.y);
            ctx.strokeText(this.text, this.pos1.x, this.pos1.y);

            t++;
            if (t % (speed * 2400) === 0) {
                this.text = String.fromCharCode(
                    this.letters[random(0, this.letters.length)]
                );
            }
            if (t % 480 === 0) {
                this.tl.kill();
                ctx.globalCompositeOperation =
                    this.modes[random(0, this.modes.length)];
                this.rot1 = { rot: random(1, 90) };
                this.rot2 = { rot: random(1, 90) };
                this.pos1 = { x: random(0, w), y: random(0, h) };
                this.pos2 = { x: random(0, w), y: random(0, h) };
                this.fontsize = random(7, 25);

                ctx.font = `${this.fontsize}px bold serif`;

                ctx.strokeStyle = randomColor();
                ctx.fillStyle = randomColor();

                this.getTweens();
            }
            interval = requestAnimationFrame(this.draw);
        };
    }

    getTweens() {
        this.tl = gsap.timeline({
            defaults: { repeat: -1, yoyo: true }
        });
        this.tl
            .to(
                this.rot1,
                {
                    duration: random(3, 8),
                    rot: this.rot2.rot
                },
                '<'
            )
            .to(
                this.pos1,
                {
                    duration: random(3, 13),
                    x: this.pos2.x
                },
                '<'
            )
            .to(
                this.pos1,
                {
                    duration: random(3, 10),
                    y: this.pos2.y
                },
                '<'
            );
    }
}

class Projecting {
    constructor() {
        this.tl = null;
        this.width = random(4, 19);
        this.modes = [
            'source-over',
            'multiply',
            'darken',
            'lighten',
            'xor',
            'difference',
            'exclusion',
            'overlay',
            'screen',
            'hue',
            'luminosity',
            'color',
            'saturation',
            'soft-light',
            'hard-light'
        ];
        this.rot1 = { rot: random(1, 90) };
        this.rot2 = { rot: random(1, 90) };
        this.color1 = { color: randomColor() };
        this.color2 = { color: randomColor() };
        this.color3 = { color: randomColor() };
        this.color4 = { color: randomColor() };

        ctx.fillStyle = this.color1.color;
        ctx.strokeStyle = 'black';
        ctx.shadowColor = this.color3.color;
        ctx.shadowBlur = 10;
        ctx.globalCompositeOperation = this.modes[random(0, this.modes.length)];

        this.getTweens();

        this.draw = () => {
            ctx.translate(w / 2, h / 2);
            ctx.rotate(this.rot1.rot);
            ctx.fillRect(0, 0, w, this.width);
            ctx.translate(-w / 2, -h / 2);

            t++;

            if (t % 480 === 0) {
                this.tl.kill();
                ctx.globalCompositeOperation =
                    this.modes[random(0, this.modes.length)];
                this.rot1 = { rot: random(1, 90) };
                this.rot2 = { rot: random(1, 90) };
                this.color1 = { color: randomColor() };
                this.color2 = { color: randomColor() };
                this.color3 = { color: randomColor() };
                this.color4 = { color: randomColor() };

                ctx.fillStyle = this.color1.color;
                this.width = random(4, 19);
                this.getTweens();
            }
            interval = requestAnimationFrame(this.draw);
        };
    }

    getTweens() {
        this.tl = gsap.timeline({
            defaults: { repeat: -1, yoyo: true }
        });
        this.tl.to(
            this.rot1,
            {
                duration: random(3, 8),
                rot: this.rot2.rot
            },
            '<'
        );
        this.tl.to(
            this.color1,
            {
                duration: random(3, 10),
                color: this.color2.color,
                onUpdate: () => (ctx.fillStyle = this.color1.color)
            },
            '<'
        );
        this.tl.to(
            this.color3,
            {
                duration: random(3, 10),
                color: this.color4.color,
                onUpdate: () => (ctx.shadowColor = this.color3.color)
            },
            '<'
        );
    }
}

// END OF CLASSES

// initial setup of canvas settings and listeners
function init() {
    // display some user tips on screen
    canvas.focus();
    displayMsg('WELCOME');
    setTimeout(() => {
        displayMsg('PRESS H FOR HELP');
    }, 10000);
    setTimeout(() => {
        displayMsg('TIP: F FOR FULLSCREEN');
    }, 20000);
    // set the basic canvas settings
    ctx.strokeStyle = randomColor(5, 255, 0.8, 0.8);
    ctx.fillStyle = randomColor(5, 255, 0.5, 0.5);
    ctx2.clearRect(-w, -h, 3 * w, 3 * h);
    canvas.style.background = 'transparent';
    ctx.imageSmoothingQuality = 'high';
    ctx2.imageSmoothingQuality = 'high';
    ctx.lineWidth = 1;
    ctx.shadowBlur = 0;
    ctx.save();

    // LISTENERS
    //change canvas size on window resize
    window.addEventListener('resize', () => {
        w = canvas.width = canvas2.width = window.innerWidth;
        h = canvas.height = canvas2.height = window.innerHeight;
        canvas.click();
    });
    // keystroke listeners
    window.addEventListener('keyup', e => {
        // spacebar listener creates new spiral
        if (e.keyCode === 32) {
            canvas.click();
        }
        // f key for fullscreen
        if (e.keyCode === 70) {
            document.body.requestFullscreen();
        }
        // i key increases auto-change time
        if (e.keyCode === 73) {
            autoChange += 10;
            if (autoChange > 300) autoChange = 300;
            displayMsg(`Auto-change: ${autoChange}secs`);
        }
        // d key decreases auto-change time
        if (e.keyCode === 68) {
            autoChange -= 10;
            if (autoChange < 10) autoChange = 10;
            displayMsg(`Auto-change: ${autoChange}secs`);
        }
        // m key toggles manual mode
        if (e.keyCode === 77) {
            manual = !manual;
            displayMsg(manual ? 'Manual mode' : 'Auto mode');
        }
        // s key silences algorithm change messages
        if (e.keyCode === 83) {
            silent = !silent;
            displayMsg(silent ? 'Silent mode' : 'Display mode');
            algosDisplay.textContent = '';
            algosDisplay.style.display = 'none';
        }
        // h key toggles help screen view
        if (e.keyCode === 72) {
            helpView = !helpView;
            if (helpView) {
                help.style.display = 'block';
            } else {
                help.style.display = 'none';
            }
        }
    });
    // make algorithms auto-change if not in manual mode
    if (!manual) {
        regen = setInterval(() => {
            canvas.click();
        }, autoChange * 1000);
    }
}

// run init and start a random class spiral
init();
let runningAlgo = new NeuralSlinky();
runningAlgo.draw();

// the click listener resets settings and draws a new spiral
canvas.addEventListener('click', () => {
    // clear any timers
    cancelAnimationFrame(interval);
    interval = null;
    clearInterval(regen);
    t = 0;
    stagger = 0;
    // setup new auto-change timer if not in manual mode
    if (!manual) {
        regen = setInterval(() => {
            canvas.click();
        }, autoChange * 1000);
    }
    // new random speed
    speed = random(2, 6);
    // canvas resets
    ctx.restore();
    ctx2.clearRect(-w, -h, 3 * w, 3 * h);
    // picks a transition mode
    canvas.style.background = 'transparent';
    clearMethod();
    ctx.strokeStyle = randomColor(5, 255, 0.8, 0.8);
    ctx.fillStyle = randomColor(5, 255, 0.5, 0.5);
    ctx.beginPath();
    // selects next algorithm
    chooseAlgos();
});

// helper function for random nums
function random(min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

// helper function for random colors
function randomColor(minC = 0, maxC = 255, minA = 0.1, maxA = 1) {
    const r = random(minC, maxC);
    const g = random(minC, maxC);
    const b = random(minC, maxC);
    const a = +(Math.random() * (maxA - minA) + minA).toFixed(3);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

// helper function to get int pixels
function round(num) {
    return Math.round(num);
}

// chooses a transition method when spirals change
function clearMethod() {
    let pick = Math.random();
    // clears to black a portion of the screen based on the canvas size and its rotation at the moment
    if (pick < 0.25) {
        ctx.clearRect(0, 0, w, h);
        ctx2.clearRect(0, 0, w, h);
        // makes semi-transparent a portion of the screen based on the canvas size and its rotation at the moment
    } else if (pick < 0.5) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.fillRect(0, 0, w, h);
        ctx2.clearRect(0, 0, w, h);
    } else if (pick < 0.75) {
        // colors a portion of the screen based on the canvas size and its rotation at the moment, with random transparency
        ctx.fillStyle = randomColor(5, 255, 0.15, 0.9);
        ctx.fillRect(0, 0, w, h);
        ctx2.clearRect(0, 0, w, h);
        // completely fills the screen with black
    } else {
        ctx2.clearRect(0, 0, w, h);
        canvas.width = canvas.height = 0;
        canvas.width = w;
        canvas.height = h;
    }
    ctx.strokeStyle = randomColor(5, 255, 0.8, 0.8);
}

// displays the current algorithm on the screen for a few seconds when changing
function displayAlgos(algo) {
    // only if silent mode is not on
    if (!silent) {
        clearTimeout(algoTimer);
        algosDisplay.textContent = algo;
        algosDisplay.style.display = 'block';
        algoTimer = setTimeout(() => {
            algosDisplay.style.display = 'none';
            algosDisplay.textContent = '';
        }, 5000);
    }
}

// displays messages on the screen for a few seconds in response to user actions
function displayMsg(message) {
    clearTimeout(msgTimer);
    msg.textContent = message;
    msg.style.display = 'block';
    msgTimer = setTimeout(() => {
        msg.style.display = 'none';
        msg.textContent = '';
    }, 7500);
}

let pointer;

canvas.addEventListener('mousemove', () => {
    if (pointer) {
        pointer = null;
    }
    canvas.style.cursor = 'pointer';
    pointer = setTimeout(() => {
        canvas.style.cursor = 'none';
    }, 5000);
});

// MUSIC PLAYER

// DOM references
const player = document.getElementById('player');
const input = document.getElementById('input');
const label = document.getElementById('click-label');
const playList = document.getElementById('playlist');
const playBtn = document.getElementById('play');
const playIcon = document.getElementById('play-pause-icon');
const stopBtn = document.getElementById('stop');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const audio = document.getElementById('audio');
const progress = document.getElementById('progress-percent');

// initial settings
let playerShow = false;
player.style.display = 'none';
let trackList = [];
let currentSong = 0;
let isPlaying = false;
let playlistEls;

// listener for file input
input.addEventListener('change', handleFiles, false);

// handles the files and adds them to playlist
function handleFiles() {
    // pause if playing and re-init settings
    audio.pause();
    isPlaying = false;
    playIcon.name = 'play-outline';
    playList.innerHTML = '';
    currentSong = 0;
    trackList = [];
    const files = this.files;
    // add li for each song, create playlist
    for (let i = 0; i < files.length; i++) {
        let listItem = document.createElement('li');
        listItem.classList.add('list-item');
        listItem.textContent = files[i].name.slice(
            0,
            files[i].name.indexOf('.')
        );
        playList.appendChild(listItem);
        let objectURL = window.URL.createObjectURL(files[i]);
        trackList.push(objectURL);
    }
    let song = trackList[currentSong];
    audio.src = song;
    // style and prepare playlist for playback
    playlistEls = document.getElementsByClassName('list-item');
    playlistEls[currentSong].scrollIntoView();
    playlistEls[currentSong].style.color = 'rgba(255, 165, 0, 0.5)';
}

// play or pause current song
function playTrack() {
    // if paused, play
    if (!isPlaying && playlistEls) {
        isPlaying = !isPlaying;
        playIcon.name = 'pause-outline';
        updatePlaylistStyle();
        audio.play();
    } else {
        // if playing, pause
        if (playlistEls) {
            isPlaying = !isPlaying;
            playlistEls[currentSong].style.color = 'rgba(255, 165, 0, 0.5)';
            playIcon.name = 'play-outline';
            audio.pause();
        }
    }
}

// stop the track, rewind it and de-saturate color of li in playlist
function stopPlayback() {
    if (isPlaying) {
        audio.pause();
        audio.currentTime = 0;
        isPlaying = false;
        playIcon.name = 'play-outline';
        [...playlistEls].forEach(el => (el.style.color = '#555'));
        playlistEls[currentSong].style.color = 'rgba(255, 165, 0, 0.5)';
    } else {
        if (playlistEls) {
            audio.currentTime = 0;
        }
    }
}

// cue the next track and play it if play is on
function playPrev() {
    if (playlistEls) {
        audio.pause();
        audio.currentTime = 0;
        progress.value = 0;
        currentSong--;
        if (currentSong < 0) currentSong = trackList.length - 1;
        updatePlaylistStyle();
        audio.src = trackList[currentSong];
        if (isPlaying) {
            audio.play();
        } else {
            playlistEls[currentSong].style.color = 'rgba(255, 165, 0, 0.5)';
        }
    }
}

// cue the previous track and play it if play is on
function playNext() {
    if (playlistEls) {
        audio.pause();
        audio.currentTime = 0;
        progress.value = 0;
        currentSong++;
        if (currentSong > trackList.length - 1) currentSong = 0;
        updatePlaylistStyle();
        audio.src = trackList[currentSong];
        if (isPlaying) {
            audio.play();
        } else {
            playlistEls[currentSong].style.color = 'rgba(255, 165, 0, 0.5)';
        }
    }
}

// calculates and displays the current track's progress
function displayProgress() {
    const currentTime = audio.currentTime;
    const progressPercent = (currentTime / audio.duration) * 100;
    progress.value = Number.isFinite(progressPercent)
        ? progressPercent.toFixed(2)
        : '0';
}

// skips to the clicked time on the progress bar
function scrub(e) {
    if (playlistEls) {
        const scrubTime = (e.offsetX / progress.offsetWidth) * audio.duration;
        audio.currentTime = scrubTime;
        if (isPlaying) {
            audio.play();
        }
    }
}

// helper function for styling the playlist after changes
function updatePlaylistStyle() {
    [...playlistEls].forEach(el => (el.style.color = '#555'));
    playlistEls[currentSong].style.color = 'orange';
    playlistEls[currentSong].scrollIntoView();
}

// music player event listeners
playBtn.addEventListener('click', playTrack);
stopBtn.addEventListener('click', stopPlayback);
nextBtn.addEventListener('click', playNext);
prevBtn.addEventListener('click', playPrev);
audio.addEventListener('timeupdate', displayProgress);
audio.addEventListener('ended', playNext);
progress.addEventListener('mousedown', () => audio.pause());
progress.addEventListener('mouseup', scrub);
window.addEventListener('keyup', hidePlayer);

// hide/show the player with the p key
function hidePlayer(e) {
    if (e.keyCode === 80) {
        if (playerShow) {
            playerShow = !playerShow;
            player.style.display = 'none';
        } else {
            playerShow = !playerShow;
            player.style.display = 'block';
        }
    }
}
