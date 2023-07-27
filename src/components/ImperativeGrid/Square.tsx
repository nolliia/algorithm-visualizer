import React, {useEffect, useImperativeHandle, useState} from 'react';
import styled from "styled-components";
import {generateColorChangeTransition} from "./color-transition-animation";

export interface SquareProps {
    initialState: number;
    stateToColor: (state: number) => string;
    onClick?: () => void;
    onMouseDown?: () => void;
    onMouseEnter?: () => void;
    newStateType?: number;
    shouldUpdate?: boolean;
}

export interface SquareRef {
    updateState: (state: number) => void;
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
    border-right: 2px none black;
  }
  &:first-child {
    border-left: 2px none black;
  }
`

const Square = React.forwardRef<SquareRef, SquareProps>((({
    initialState,
    stateToColor,
    onClick,
    onMouseDown,
    onMouseEnter,
    }, ref) => {
    const [backgroundColor, setBackgroundColor] = useState<string>(stateToColor(initialState));
    const [nextColor, setNextColor] = useState<string | undefined>(undefined);
    const [state, setState] = useState<number>(initialState);
    const [currentState, setCurrentState] = useState<number>(initialState);

    const updateState = (state: number) => {
        setState(state);
    }

    useEffect(() => {
        if(state !== currentState){
            if(nextColor) setBackgroundColor(nextColor);
            setNextColor(stateToColor(state))
        }
        setCurrentState(state);
    }, [state]);

    useImperativeHandle(ref, () => ({updateState}), [])

    return(
        <SquareDiv
            color = {backgroundColor}
            nextColor = {nextColor}
            animationDurationMs={300}
            onMouseDown = {() => {if(onMouseDown){ onMouseDown(); }}}
            onMouseEnter = {() => {if(onMouseEnter) { onMouseEnter();}}}
            onClick = {onClick}
        />
    )
}))

Square.displayName = 'Square';
export default Square;
