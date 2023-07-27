import {
    CellState,
    Coordinate,
    GridExplorationRequest,
    GridExplorationResult
} from "../grid-explorer.interfaces";
import {buildPath, coordinateIndex, generateNeighbours, isCoordinateValid} from "../grid-exploration-utils";

export function depthFirstSearch(req: GridExplorationRequest): GridExplorationResult {
    const {grid, start, target} = req;
    const n = grid.length;
    const m = grid[0].length;

    /*
        Algorithm structure :
        Create a queue that's getting filled
        If we reach the target node, stop the algorithm.
        If the queue is emptied before we reached the node, it means the node wasn't accessible.
     */

    // Declaring the variables
    const stack: Coordinate[] = [];
    const visited: Boolean[] = Array(n * m).map(() => false);
    const previous: number[] = Array(n * m).map(() => 0);
    const visitingOrder: Coordinate[] = [];

    // Initializing the variables
    stack.push(start);
    visited[coordinateIndex(start, grid)] = true;
    previous[coordinateIndex(start, grid)] = -1;


    while(stack.length > 0){
        // Dequeueing the current node
        const current = stack.pop()!;
        visitingOrder.push(current);

        // In case the current node is the target, end the algorithm
        if (grid[current.x][current.y] == CellState.TARGET || (current.x == target?.x && current.y == target?.y)) {
            // Build the shortest path
            const shortestPath: Coordinate[] = buildPath(previous, grid, current);

            return {
                foundTarget: true,
                shortestPath: shortestPath,
                visitingOrder: visitingOrder,
                targetCoordinate: current,
                request: req,
            }
        }

        // Otherwise, add this node's unexplored neighbours to the queue and set them to visited
        const neighbours = generateNeighbours(current);

        for (let i = 0; i < neighbours.length; i++){
            const neighbour = neighbours[i];

            // If the neighbour is valid and unvisited, set it to visited, enqueue it and set the current node
            // as its previous node.
            if(isCoordinateValid(neighbour, grid) && !visited[coordinateIndex(neighbour, grid)]) {
                visited[coordinateIndex(neighbour, grid)] = true;
                stack.push(neighbour);
                previous[coordinateIndex(neighbour, grid)] = coordinateIndex(current, grid);
            }
        }
    }

    // If we left the main loop without returning from the function, it means that the target node is unreachable.
    return {
        foundTarget: false,
        shortestPath: [],
        visitingOrder: visitingOrder,
        request: req,
    }
}
