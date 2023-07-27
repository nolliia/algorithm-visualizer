import {CellState, Coordinate} from "./grid-explorer.interfaces";

export function isCoordinateValid(coords: Coordinate, grid: CellState[][]): boolean {
    const {x, y} = coords;
    const n = grid.length;
    const m = grid[0].length;

    return x >= 0 && x < n && y >= 0 && y < m && grid[x][y] !== CellState.BLOCKED;
}

export function coordinateIndex(coords: Coordinate, grid: any[][]): number {
    const {x, y} = coords;
    const n = grid.length;
    const m = grid[0].length;

    return x * m + y;
}

export function indexCoordinate(index: number, grid: any[][]): Coordinate {
    const n = grid.length;
    const m = grid[0].length;

    return {x: Math.floor(index / m), y: index % m};
}

export function generateEmptyGrid(n: number, m: number): CellState[][] {
    const grid: CellState[][] = [];

    for (let i = 0; i < n; i++) {
        const row: CellState[] = [];
        for (let j = 0; j < m; j++) {
            row.push(CellState.EMPTY);
        }
        grid.push(row);
    }

    return grid;
}

export function generateNeighbours(coord: Coordinate, diagonal?: false): Coordinate[] {
    const x_diff = [0, 0, 1, -1];
    const y_diff = [1, -1, 0, 0];

    if (diagonal) {
        x_diff.push(1, -1, 1, -1);
        y_diff.push(1, -1, -1, 1);
    }

    const neighbors: Coordinate[] = [];
    for (let i = 0; i < x_diff.length; i++) {
        const x = coord.x + x_diff[i];
        const y = coord.y + y_diff[i];
        neighbors.push({x, y});
    }

    return neighbors;
}

export function buildPath(previous: number[], grid: any[][], target: Coordinate): Coordinate[] {

    // Initialize the current node and the result array
    let current = coordinateIndex({x: target.x, y: target.y}, grid);
    const resultingIndexes: number[] = [];

    // Add the starting node to the path
    resultingIndexes.push(current);

    // Defensive counter initialization
    let iteration_counter = 0;
    let max_iteration = previous.length;

    while (previous[current] != -1) {

        // Defensive coding in case there is a problem with the "previous" input array to prevent infinite looping
        iteration_counter++;
        if (iteration_counter > max_iteration) {
            console.log("Something is wrong with the buildShortestPath input, looks like we are stuck in an infinite loop");
            return [];
        }

        // Iterate through the previous array
        current = previous[current];
        resultingIndexes.push(current);
    }

    resultingIndexes.reverse();
    return resultingIndexes.map(index => (indexCoordinate(index, grid)));
}
