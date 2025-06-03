// helper function for random nums
export function random(min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

// helper function for random colors
export function randomColor(minC = 0, maxC = 255, minA = 0.1, maxA = 1) {
    const r = random(minC, maxC);
    const g = random(minC, maxC);
    const b = random(minC, maxC);
    const a = +(Math.random() * (maxA - minA) + minA).toFixed(3);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}