import React, {useEffect, useState} from 'react';
import styled from "styled-components";
import { generateColorChangeTransition } from "./color-transition-animation";

export interface AnimatedSquareProps {
    color: string;
}

interface AnimatedProps {
    currentColor: string;
    nextColor: string | undefined;
    animationDurationMs: number;
}

const Animated = styled.div<AnimatedProps>`
        background-color: ${({currentColor, nextColor}) => nextColor ?? currentColor};
        width: 100%;
        height: 100%;
        animation: ${({currentColor, nextColor}) => {if (nextColor){
        return generateColorChangeTransition(currentColor, nextColor)
        } else {
        return 'none'
        }
        }} ${({animationDurationMs}) => animationDurationMs}ms both;
    `

export default function AnimatedSquare({color}: AnimatedSquareProps){

    const [currentColor, setCurrentColor] = useState<string>(color);
    const [nextColor, setNextColor] = useState<string | undefined>(undefined);

    const animationDurationMs = 500;

    useEffect(() => {
        if(nextColor){
            setCurrentColor(nextColor);
            setNextColor(color);
        } else {
            setNextColor(color);
        }
    }, [color])


    useEffect(() => {
    }, [currentColor]);

    useEffect(() => {
    }, [nextColor]);



    return(
        <Animated currentColor={currentColor} nextColor={nextColor} animationDurationMs={animationDurationMs}/>
    )
}
