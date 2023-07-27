export interface Coordinate {
    x: number;
    y: number;
}

export enum Algorithms {
    BFS,
    DFS
}

export interface ExternalGridExplorationRequest {
    request: GridExplorationRequest;
    algorithm: Algorithms
}

export interface GridExplorationRequest {
    grid: CellState[][];
    start: Coordinate;
    target?: Coordinate;
}

export interface GridExplorationResult {
    foundTarget: boolean;
    shortestPath: Coordinate[];
    visitingOrder: Coordinate[];
    targetCoordinate?: Coordinate;
    request: GridExplorationRequest;
}

export enum CellState{
    EMPTY,
    BLOCKED,
    TARGET
}
