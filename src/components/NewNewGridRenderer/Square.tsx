import React, { useEffect, useState } from 'react';
import styled from "styled-components";
import {generateColorChangeTransition} from "./color-transition-animation";

export interface SquareProps {
    stateRef: React.MutableRefObject<number>;
    stateToColor: (state: number) => string;
    onClick?: () => void;
    onMouseDown?: () => void;
    onMouseEnter?: () => void;
    newStateType?: number;
    shouldUpdate?: boolean;
}

interface SquareDivProps {
    color: string;
    nextColor: string | undefined;
    animationDurationMs: number;
}

const SquareDiv = styled.div<SquareDivProps>`
  flex-grow: 1;
  background-color: ${props => props.color};
  border-left: 1px solid black;
  animation: ${({color, nextColor}) => {if (nextColor && (nextColor !== color)){
    return generateColorChangeTransition(color, nextColor)
  } else {
    return 'none'
  }
  }} ${({animationDurationMs}) => animationDurationMs}ms both;
  &:last-child {
    border-right: 1px solid black;
  }
`

export default function Square({
    stateRef,
    stateToColor,
    onClick,
    onMouseDown,
    onMouseEnter,
    newStateType,
    shouldUpdate,
}: SquareProps){
    const [backgroundColor, setBackgroundColor] = useState<string>(stateToColor(stateRef.current));
    const [nextColor, setNextColor] = useState<string | undefined>(undefined);
    const [state, setState] = useState<number>(stateRef.current);
    const [currentState, setCurrentState] = useState<number>(stateRef.current);

    useEffect(() => {
        setState(stateRef.current);
    }, [stateRef.current]);


    useEffect(() => {
        if(state !== currentState){
            if(nextColor) setBackgroundColor(nextColor);
            setNextColor(stateToColor(state))
        }
        setCurrentState(state);
    }, [state]);

    return(
        <SquareDiv
            color = {backgroundColor}
            nextColor = {nextColor}
            animationDurationMs={300}
            onMouseDown = {() => {if(onMouseDown){onMouseDown();
                if(newStateType) setState(newStateType)}}}
            onMouseEnter = {() => {
            if(onMouseEnter) {
                onMouseEnter();
                if(shouldUpdate) setState(newStateType ?? 0)}}}
            onClick = {onClick}
        />
    )
}
