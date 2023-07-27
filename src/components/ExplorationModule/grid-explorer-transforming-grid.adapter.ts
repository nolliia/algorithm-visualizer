import {CellState, GridExplorationResult} from "../../grid-exploration/grid-explorer.interfaces";
import {Step, Transformation, TransformingGrid} from "../TransformingGridRenderer/transforming-grid-renderer.interface";

export enum CellRenderingState {
    EMPTY,
    BLOCKED,
    PATH,
    TARGET,
    START,
    VISITED,
    VISITED_START,
    VISITED_TARGET,
    PATH_START,
    PATH_TARGET
}

function cellStateToCellRenderingState(state: CellState): CellRenderingState{
    switch(state) {
        case CellState.EMPTY:
            return CellRenderingState.EMPTY
        case CellState.BLOCKED:
            return CellRenderingState.BLOCKED
        case CellState.TARGET:
            return CellRenderingState.TARGET
        default:
            return CellRenderingState.EMPTY
    }
}

export function explorationResultToTransformingGrid({
                                                        foundTarget,
                                                        shortestPath,
                                                        visitingOrder,
                                                        targetCoordinate,
                                                        request
                                                    }: GridExplorationResult): TransformingGrid{

    // Map the request's grid to the initial state of the grid
    const initialState: number[][] = request.grid.map(row => {
        return row.map(cellStateToCellRenderingState)
    });

    // Set the start square and, if possible, the target square
    if(request.target) initialState[request.target.x][request.target.y] = CellRenderingState.TARGET;
    if(targetCoordinate) initialState[targetCoordinate.x][targetCoordinate.y] = CellRenderingState.TARGET;
    initialState[request.start.x][request.start.y] = CellRenderingState.START;

    // Initialize the step array
    const steps: Step[] = [];

    // For every visited node, add a transformation making it visited in the rendering
    for (let  i = 0; i < visitingOrder.length; i++){
        const node = visitingOrder[i];

        const transformation: Transformation = {
            newSquareState: CellRenderingState.VISITED,
            row: node.x,
            col: node.y,
        }

        // Depending on the initial state of the node, set a different rendering state upon visiting
        switch(initialState[node.x][node.y]){
            case CellRenderingState.START:
                transformation.newSquareState = CellRenderingState.VISITED_START;
                break;
            case CellRenderingState.TARGET:
                transformation.newSquareState = CellRenderingState.VISITED_TARGET;
                break;
            default:
                transformation.newSquareState = CellRenderingState.VISITED;
        }

        steps.push({transformations: [transformation]})
    }

    // Create steps to render the computed shortest path.
    for (let  i = shortestPath.length - 1; i >= 0; i--){
        const node = shortestPath[i];

        const transformation: Transformation = {
            newSquareState: CellRenderingState.PATH,
            row: node.x,
            col: node.y
        }

        switch(initialState[node.x][node.y]){
            case CellRenderingState.START:
                transformation.newSquareState = CellRenderingState.PATH_START;
                break;
            case CellRenderingState.TARGET:
                transformation.newSquareState = CellRenderingState.PATH_TARGET;
                break;
            default:
                transformation.newSquareState = CellRenderingState.PATH;
        }

        steps.push({transformations: [transformation]})
    }

    return {
        initialState,
        steps
    }
}
