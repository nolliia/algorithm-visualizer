import {MazeNodeState} from "../ImperativeMazeMaker/maze-maker.interface";
import {CellRenderingState} from "./grid-explorer-transforming-grid.adapter";

export function mazeStateToColor(state: MazeNodeState) {
    switch (state) {
        case MazeNodeState.EMPTY:
            return '#fff';
        case MazeNodeState.BLOCKED:
            return '#5c5b54';
        case MazeNodeState.START:
            return '#1beab9';
        case MazeNodeState.TARGET:
            return '#053375';
    }
}

export function renderingStateToColor(state: CellRenderingState): string {
    switch (state) {
        case CellRenderingState.EMPTY:
            return '#fff';
        case CellRenderingState.BLOCKED:
            return '#5c5b54';
        case CellRenderingState.PATH:
            return '#00a619';
        case CellRenderingState.VISITED:
            return '#f1d416';
        case CellRenderingState.START:
            return '#1beab9';
        case CellRenderingState.TARGET:
            return '#053375';
        case CellRenderingState.VISITED_START:
            return '#c8e50a';
        case CellRenderingState.VISITED_TARGET:
            return '#cb880b';
        case CellRenderingState.PATH_START:
            return '#15d731';
        case CellRenderingState.PATH_TARGET:
            return '#035e11';
        default:
            return '#fff';
    }
}
