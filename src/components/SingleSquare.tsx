import React from 'react';
import styled from "styled-components";

export interface SingleSquareProps {
    color: string;
    borderColor: string;
    onClick?: () => void;
    size: number;
}

interface SingleSquareDivInterface {
    color: string;
    size: number;
    borderColor: string | undefined;
    clickable: boolean;
}

const SingleSquareDiv = styled.div<SingleSquareDivInterface>`
    background-color: ${props => props.color};
    height: ${props => props.size}px;
    width: ${props => props.size}px;
    ${props => props.borderColor ? `border: 2px solid ${props.borderColor};`: ''}
    ${props => props.clickable ? `cursor: pointer;` : ''}
    border-radius: 8px;
`

export default function SingleSquare({color, onClick, size, borderColor}: SingleSquareProps){
    return(
    <SingleSquareDiv
        color = {color}
        size = {size}
        borderColor = {borderColor}
        clickable = {!!onClick}
        onClick={onClick}
        className={'square'}>
    </SingleSquareDiv>
    )

}
