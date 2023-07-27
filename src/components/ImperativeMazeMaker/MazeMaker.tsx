import React, {useEffect, useRef, useState} from 'react';
import {Coordinate, MazeMakingResult, MazeNodeState} from "./maze-maker.interface";
import SingleSquare from "../SingleSquare";
import {generateMatrix} from "../../utils/matrix-generation";
import Grid, { GridRef } from "../ImperativeGrid/Grid";
import {Box} from "@mui/material";
import useWindowDimensions from "../../hooks/UseWindowDimensions";

export interface MazeMakerProps {
    stateToColorInterpreter: (state: MazeNodeState) => string;
    squareSize: number;
    initialValues?: MazeMakingResult;
    generationResultFetcher: React.MutableRefObject<{fetch: () => MazeMakingResult | void}>;
}

export function generateResponsiveColRowNumber(squareSize: number, screenWidth: number): {rowNumber: number, colNumber: number} {
    if(screenWidth < 1300){
        return{
            rowNumber: 20,
            colNumber: Math.floor((screenWidth - 100)/squareSize)
        }
    } else {
        return {
            rowNumber: 20,
            colNumber: 40
        }
    }
}

export default function MazeMaker({
    stateToColorInterpreter,
    squareSize,
    initialValues,
    generationResultFetcher
}: MazeMakerProps){

    const {width, height} = useWindowDimensions();
    const initialStart = initialValues?.start ?? {row: 3, col: 2};
    const initialTarget = initialValues?.target?? {row: 4, col: 8};
    const responsiveRowColNumbers = generateResponsiveColRowNumber(squareSize, width);
    const initialGrid = initialValues?.grid ?? generateMatrix<MazeNodeState>(MazeNodeState.EMPTY, responsiveRowColNumbers.rowNumber, responsiveRowColNumbers.colNumber);
    initialGrid[initialStart.row][initialStart.col] = MazeNodeState.START;
    initialGrid[initialTarget.row][initialTarget.col] = MazeNodeState.TARGET;

    const stateMatrix: React.MutableRefObject<number[][]> = useRef(JSON.parse(JSON.stringify(initialGrid)));
    const start = useRef<Coordinate>(initialStart);
    const target = useRef<Coordinate>(initialTarget);
    const [gridRows, setGridRows] = useState<number>(responsiveRowColNumbers.rowNumber);
    const [gridCols, setGridCols] = useState<number>(responsiveRowColNumbers.colNumber);
    const [placingType, setPlacingType] = useState<MazeNodeState>(MazeNodeState.BLOCKED);
    const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

    const gridRef: React.MutableRefObject<GridRef | null> = useRef(null);

    useEffect(() => {
        generationResultFetcher.current.fetch = () => ({
            grid: stateMatrix.current.map(row => row.map(value => value)),
            start: start.current,
            target: target.current,
        })
    }, []);

    // Set a square state in the generated grid based on passed coords and state.
    const setSquareState = (coord: Coordinate, state: MazeNodeState) => {
        // Prevent updating the state of the current start or target
        if(coord.row < stateMatrix.current.length && coord.col < stateMatrix.current[0].length){
            if((start.current.row == coord.row && start.current.col == coord.col) || (target.current.row == coord.row && target.current.col == coord.col)){
                return
            }

            switch(state) {
                // The start and target squares should be unique, so their current square gets set to empty
                // before they are updated
                case MazeNodeState.START:
                    stateMatrix.current[start.current.row][start.current.col] = MazeNodeState.EMPTY;
                    gridRef.current?.updateSquareState(start.current.row, start.current.col, MazeNodeState.EMPTY);
                    start.current = coord;
                    break;
                case MazeNodeState.TARGET:
                    stateMatrix.current[target.current.row][target.current.col] = MazeNodeState.EMPTY;
                    gridRef.current?.updateSquareState(target.current.row, target.current.col, MazeNodeState.EMPTY);
                    target.current = coord;
                    break;
                default:
                    break;
            }
            // Update the rendering view and the state matrix
            gridRef.current?.updateSquareState(coord.row, coord.col, state);
            stateMatrix.current[coord.row][coord.col] = state;
        }
    }

    // Update the size of the grid when requested
    useEffect(() => {
        if(start.current.row >= gridRows) {
            start.current.row = gridRows - 1;
        }
        if(start.current.col >= gridCols) {
            start.current.col = gridCols - 1;
        }
        if(target.current.row >= gridRows) {
            target.current.row = gridRows - 1;
        }
        if(target.current.col >= gridCols) {
            target.current.col = gridCols - 1;
        }
        // Change the size of the grid and copy the current grid the new increased/decreased grid.
        // TODO : Make the new grid
    }, [gridCols, gridRows]);

    const typeSelectionDivSx = {
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        alignItems: 'center'
    }

    return(
    <div onMouseDown={() => setIsMouseDown(true)}
         onMouseLeave={() => setIsMouseDown(false)}
         onMouseUp={() => setIsMouseDown(false)}
    >
        <Grid
            initialStateMatrix={initialGrid}
            stateToColor={stateToColorInterpreter}
            onSquareMouseDown = {(x: number, y: number) => {setSquareState({row: x, col: y}, placingType)}}
            onSquareClick = {(x: number, y: number) => {setSquareState({row: x, col: y}, placingType)}}
            onSquareMouseEnter = {(x: number, y: number) => {if(isMouseDown) setSquareState({row: x, col: y}, placingType)}}
            ref = {gridRef}
        />
        <Box sx = {{
            display: 'flex',
            gap: 4,
            marginTop: 2,
        }}>
            <Box sx={typeSelectionDivSx}>
                <SingleSquare color={stateToColorInterpreter(MazeNodeState.EMPTY)}
                              borderColor={'black'}
                              size={40}
                              onClick={() => setPlacingType(MazeNodeState.EMPTY)}
                />
                Empty
            </Box>
            <Box sx={typeSelectionDivSx}>
                <SingleSquare color={stateToColorInterpreter(MazeNodeState.BLOCKED)}
                              borderColor={'black'}
                              size={40}
                              onClick={() => setPlacingType(MazeNodeState.BLOCKED)}
                />
                Wall
            </Box>
            <Box sx={typeSelectionDivSx}>
                <SingleSquare color={stateToColorInterpreter(MazeNodeState.START)}
                              borderColor={'black'}
                              size={40}
                              onClick={() => setPlacingType(MazeNodeState.START)}
                />
                Start
            </Box>
            <Box sx={typeSelectionDivSx}>
                <SingleSquare color={stateToColorInterpreter(MazeNodeState.TARGET)}
                              borderColor={'black'}
                              size={40}
                              onClick={() => setPlacingType(MazeNodeState.TARGET)}
                />
                Target
            </Box>
        </Box>
    </div>
    )
}
