import {Step, TransformingGrid} from "./transforming-grid-renderer.interface";
import React, {useEffect, useRef, useState} from "react";
import Grid, { GridRef } from "../ImperativeGrid/Grid";
import {Box, Button} from "@mui/material";

export interface TransformingGridRendererProps {
    transformingGrid: TransformingGrid
    stateColorInterpreter: (state: number) => string;
    squareSize: number;
}

export default function TransformingGridRenderer({transformingGrid, stateColorInterpreter, squareSize}: TransformingGridRendererProps){
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const [intervalId, setIntervalId] = useState<NodeJS.Timer | undefined>(undefined);

    const gridRef: React.MutableRefObject<GridRef | null> = useRef(null);
    const stepMakerRef = useRef({
        stepNumber: -1,
        makeCurrentStep: (stepNumber: number) => {
            makeStep(transformingGrid.steps[stepNumber]);
        }
    })

    const makeStep = (step: Step) => {
        step.transformations.forEach(transformation => {
            gridRef.current?.updateSquareState(transformation.row, transformation.col, transformation.newSquareState)
        })
    }

    const toggleRunning = () => {
        console.log("toggled running");
        const running = !isRunning;
        setIsRunning(running);

        if(running) {
            if(intervalId) clearInterval(intervalId);
            setIntervalId(setInterval(() => {
                stepMakerRef.current.stepNumber += 1;
                if(stepMakerRef.current.stepNumber < transformingGrid.steps.length){
                    stepMakerRef.current.makeCurrentStep(stepMakerRef.current.stepNumber);
                } else {
                    if(intervalId) clearInterval(intervalId);
                }
            }, 40));
        } else {
            console.log("clearing interval")
            if(intervalId) clearInterval(intervalId);
        }
    }

    // Cleanup when unmounting
    useEffect(() => {
        return () => {if(intervalId) clearInterval(intervalId)}
    }, []);


    return(
        <Box sx ={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2
        }}>
            <Grid
                initialStateMatrix={JSON.parse(JSON.stringify(transformingGrid.initialState))}
                stateToColor={stateColorInterpreter}
                ref = {gridRef}
            />
            <Button variant={'contained'} onClick={toggleRunning}>Play/Pause</Button>
        </Box>
    )
}
