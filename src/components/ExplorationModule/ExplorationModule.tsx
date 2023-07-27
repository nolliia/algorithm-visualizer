import React, {useEffect, useRef, useState} from 'react';
import MazeMaker from "../ImperativeMazeMaker/MazeMaker";
import {MazeMakingResult, MazeNodeState} from "../ImperativeMazeMaker/maze-maker.interface";
import TransformingGridRenderer from "../TransformingGridRenderer/TransformingGridRenderer";
import {Algorithms, CellState, ExternalGridExplorationRequest} from "../../grid-exploration/grid-explorer.interfaces";
import {TransformingGrid} from "../TransformingGridRenderer/transforming-grid-renderer.interface";
import {explorationResultToTransformingGrid} from "./grid-explorer-transforming-grid.adapter";
import {exploreGrid} from "../../grid-exploration/grid-explorer";
import {renderingStateToColor, mazeStateToColor} from "./exploration-module.coloring";
import {Box, Button} from "@mui/material";

export interface ExplorationModuleProps {
}

export default function ExplorationModule({
}: ExplorationModuleProps){
    const [generatorMode, setGeneratorMode] = useState<boolean>(true);
    const [generationResult, setGenerationResult] = useState<MazeMakingResult | undefined>(undefined)
    const [explorationAlgorithm, setExplorationAlgorithm] = useState<Algorithms>(Algorithms.BFS);
    const [transformingGrid, setTransformingGrid] = useState<TransformingGrid | undefined>(undefined);

    const generationResultFetcher = useRef<{fetch: () => MazeMakingResult | void}>({
        fetch: () => {}
    })

    function mazeStateToCellState(squareState: MazeNodeState): CellState {
        switch(squareState){
            case MazeNodeState.BLOCKED:
                return CellState.BLOCKED
            case MazeNodeState.TARGET:
                return CellState.TARGET
            default:
                return CellState.EMPTY
        }
    }

    function generateExplorationRequest(algorithm: Algorithms, gridGenerationResult: MazeMakingResult): ExternalGridExplorationRequest {
        return {
            algorithm: explorationAlgorithm,
            request : {
                start: {x: gridGenerationResult.start.row, y: gridGenerationResult.start.col},
                target: {x: gridGenerationResult.target.row, y: gridGenerationResult.target.col},
                grid: gridGenerationResult.grid.map(row => row.map(mazeStateToCellState))
            }
        }
    }

    useEffect(() => {
        if(generatorMode){
            setTransformingGrid(undefined);
        }
        if(!generatorMode) {
            const generationResult = generationResultFetcher.current.fetch();
            if(generationResult) {
                setGenerationResult(generationResult);
                const externalExplorationRequest = generateExplorationRequest(explorationAlgorithm, generationResult);
                const explorationResult = exploreGrid(externalExplorationRequest);
                const transformingGrid = explorationResultToTransformingGrid(explorationResult);
                setTransformingGrid(transformingGrid);
            }
        }
    }, [generatorMode]);

    return(
    <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
    }}>
        <Box sx={{
            display: 'flex',
            gap: 2
        }}>
            <Button variant={'contained'} onClick={() => {setGeneratorMode(!generatorMode)}}>Toggle generation mode</Button>
            { generatorMode && <Button variant={'contained'} onClick={() => {setExplorationAlgorithm(Algorithms.BFS)}}>BFS</Button> }
            { generatorMode && <Button variant={'contained'} onClick={() => {setExplorationAlgorithm(Algorithms.DFS)}}>DFS</Button> }
        </Box>
        { generatorMode && <MazeMaker
            stateToColorInterpreter= {mazeStateToColor}
            generationResultFetcher={generationResultFetcher}
            squareSize={20}
            initialValues={generationResult}
        /> }
        {
            (transformingGrid && !generatorMode) && <TransformingGridRenderer
            transformingGrid={transformingGrid}
            stateColorInterpreter={renderingStateToColor}
            squareSize={20}
            />
        }
    </Box>
    )
}
