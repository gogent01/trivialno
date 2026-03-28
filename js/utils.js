export function shuffleArray(arr) {
    let ri;
    let i = arr.length;

    while (i > 0) {
        ri = Math.floor(Math.random() * i);
        i--;

        [arr[i], arr[ri]] = [arr[ri], arr[i]];
    }

    return arr;
}

export function getAddress(x, y) {
    return x + ':' + y;
}

export function randRange(min, max) {
    return Math.random() * (max - min) + min;
}
