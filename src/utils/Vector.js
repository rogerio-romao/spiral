// Physics and math classes from Youtube channel Coding Math
// Vector class
export default class Vector {
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }
    set x(value) {
        this._x = value;
    }
    get x() {
        return this._x;
    }
    set y(value) {
        this._y = value;
    }
    get y() {
        return this._y;
    }
    set angle(angle) {
        this._x = Math.cos(angle) * this.length;
        this._y = Math.sin(angle) * this.length;
    }
    get angle() {
        return Math.atan2(this._y, this._x);
    }
    set length(length) {
        this._x = Math.cos(this.angle) * length;
        this._y = Math.sin(this.angle) * length;
    }
    get length() {
        return Math.sqrt(this._x * this._x + this._y * this._y);
    }
    add(v2) {
        return new Vector(this._x + v2.x, this._y + v2.y);
    }
    subtract(v2) {
        return new Vector(this._x - v2.x, this._y - v2.y);
    }
    multiply(val) {
        return new Vector(this._x * val, this._y * val);
    }
    divide(val) {
        return new Vector(this._x / val, this._y / val);
    }
    addTo(v2) {
        this._x += v2.x;
        this._y += v2.y;
    }
    subtractFrom(v2) {
        this._x -= v2.x;
        this._y -= v2.y;
    }
    multiplyBy(val) {
        this._x *= val;
        this._y *= val;
    }
    divideBy(val) {
        this._x /= val;
        this._y /= val;
    }
}
