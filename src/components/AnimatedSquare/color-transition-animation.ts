import {keyframes} from "styled-components";

export function generateColorChangeTransition(initialColor: string, finalColor: string) {
    return keyframes`
        0% {
            background-color: ${initialColor};
            transform: scale(0.5);
          
        }

        100% {
            background-color: ${finalColor};
          transform: scale(0.99);
        }
    `
}
