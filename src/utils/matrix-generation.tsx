export function generateMatrix<T>(value: T, n: number, m: number): T[][]{
    return Array.from({length: n}).map(row => Array.from({length: m}).map(() => value));
}
