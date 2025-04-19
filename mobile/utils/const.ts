import { StyleSheet } from "react-native"

export const OPENSANS_REGULAR = "OpenSans_Regular"

export const globalStyles = StyleSheet.create({
    globalFont: {
        fontFamily: OPENSANS_REGULAR
    },
})

export const GRADIENTS = {
    BLACK_WHITE_HALF: {
        colors: ['#000000', '#FFFFF0'] as const,  
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 }
    },
    BACKGROUND: {
        colors: ['b55528', '#FFFFFF'] as const,
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
    }
};
