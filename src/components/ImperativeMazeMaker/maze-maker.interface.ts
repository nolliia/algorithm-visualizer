export interface MazeMakingResult {
    grid: MazeNodeState[][],
    start: Coordinate,
    target: Coordinate
}

export interface Coordinate {
    row: number;
    col: number;
}

export enum MazeNodeState {
    EMPTY,
    BLOCKED,
    START,
    TARGET
}
