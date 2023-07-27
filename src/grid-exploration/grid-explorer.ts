import {
    Algorithms,
    ExternalGridExplorationRequest,
    GridExplorationResult
} from "./grid-explorer.interfaces";

import { depthFirstSearch } from "./algorithms/grid-dfs";
import { breadthFirstSearch } from "./algorithms/grid-bfs";

export function exploreGrid({request, algorithm}: ExternalGridExplorationRequest): GridExplorationResult {
    switch(algorithm){
        case Algorithms.BFS:
            return breadthFirstSearch(request);
        case Algorithms.DFS:
            return depthFirstSearch(request);
    }
}
