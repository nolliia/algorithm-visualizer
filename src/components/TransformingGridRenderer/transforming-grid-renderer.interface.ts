export interface TransformingGrid{
    initialState: number[][];
    steps: Step[];
}

export interface Step{
    transformations: Transformation[];
}

export interface Transformation{
    newSquareState: number;
    row: number;
    col: number;
}
