/**
 * A simple 2D vector class with basic vector operations.
 * Functions include addition, subtraction, multiplication, division, and properties for angle and length.
 * The angle is in radians, and the length is the magnitude of the vector.
 * The class provides both methods that return new vectors and methods that mutate the existing vector.
 * This was taken from the Youtube channel CodingMath, see https://www.youtube.com/@codingmath.
 * */
export default class Vector {
    /**
     * @param {number} x - the x coordinate
     * @param {number} y - the y coordinate
     */
    constructor(x, y) {
        this._x = x;
        this._y = y;
    }

    // GETTERS & SETTERS

    /**
     * Get the angle of the vector in radians.
     * @returns {number} The angle of the vector in radians
     */
    get angle() {
        return Math.atan2(this._y, this._x);
    }

    /**
     * Set the angle of the vector in radians.
     * @param {number} angle - The new angle in radians
     */
    set angle(angle) {
        const { length } = this;
        this._x = Math.cos(angle) * length;
        this._y = Math.sin(angle) * length;
    }

    /**
     * Get the length (magnitude) of the vector.
     * @returns {number} The length of the vector
     */
    get length() {
        return Math.hypot(this._x, this._y);
    }

    /**
     * Set the length (magnitude) of the vector.
     * @param {number} length - The new length of the vector
     */
    set length(length) {
        const { angle } = this;
        this._x = Math.cos(angle) * length;
        this._y = Math.sin(angle) * length;
    }

    /**
     * Get the x coordinate of the vector.
     * @returns {number} The x coordinate of the vector
     */
    get x() {
        return this._x;
    }

    /**
     * Set the x coordinate of the vector.
     * @param {number} value - The new x coordinate
     */
    set x(value) {
        this._x = value;
    }

    /**
     * Get the y coordinate of the vector.
     * @returns {number} The y coordinate of the vector
     */
    get y() {
        return this._y;
    }

    /**
     * Set the y coordinate of the vector.
     * @param {number} value - The new y coordinate
     */
    set y(value) {
        this._y = value;
    }

    // METHODS

    /**
     * Add another vector to this vector.
     * @param {Vector} v2 - The vector to add
     * @returns {Vector} A new vector that is the sum of this vector and v2
     */
    add(v2) {
        return new Vector(this._x + v2.x, this._y + v2.y);
    }

    /**
     * Add another vector to this vector in place.
     * @param {Vector} v2 - The vector to add
     */
    addTo(v2) {
        this._x += v2.x;
        this._y += v2.y;
    }

    /**
     * Divide this vector by a scalar.
     * @param {number} val - The scalar to divide by
     * @returns {Vector} A new vector that is the quotient of this vector and the scalar
     */
    divide(val) {
        return new Vector(this._x / val, this._y / val);
    }

    /**
     * Divide this vector by a scalar in place.
     * @param {number} val - The scalar to divide by
     */
    divideBy(val) {
        this._x /= val;
        this._y /= val;
    }

    /**
     * Multiply this vector by a scalar.
     * @param {number} val - The scalar to multiply by
     * @returns {Vector} A new vector that is the product of this vector and the scalar
     */
    multiply(val) {
        return new Vector(this._x * val, this._y * val);
    }

    /**
     * Multiply this vector by a scalar in place.
     * @param {number} val - The scalar to multiply by
     */
    multiplyBy(val) {
        this._x *= val;
        this._y *= val;
    }

    /**
     * Subtract another vector from this vector.
     * @param {Vector} v2 - The vector to subtract
     * @returns {Vector} A new vector that is the difference between this vector and v2
     */
    subtract(v2) {
        return new Vector(this._x - v2.x, this._y - v2.y);
    }

    /**
     * Subtract another vector from this vector in place.
     * @param {Vector} v2 - The vector to subtract
     */
    subtractFrom(v2) {
        this._x -= v2.x;
        this._y -= v2.y;
    }
}
