import {RGBA} from "./types.ts";

export const getPixelColor = (imageData: ImageData, x: number, y: number): RGBA => {
    const index = (y * imageData.width + x) * 4;
    const data = imageData.data;
    return [data[index], data[index + 1], data[index + 2], data[index + 3]];
};

export const setPixelColor = (imageData: ImageData, x: number, y: number, color: RGBA) => {
    const index = (y * imageData.width + x) * 4;
    const data = imageData.data;
    [data[index], data[index + 1], data[index + 2], data[index + 3]] = color;
};

export const colorsMatch = (color1: RGBA, color2: RGBA) => {
    return color1.every((value, index) => value === color2[index]);
};

export const floodFill = (
    imageData: ImageData,
    x: number,
    y: number,
    targetColor: RGBA,
    fillColor: RGBA
) => {
    if (colorsMatch(targetColor, fillColor)) return;

    const stack = [[x, y]];

    while (stack.length > 0) {
        const [currentX, currentY] = stack.pop()!;
        const currentColor = getPixelColor(imageData, currentX, currentY);

        if (colorsMatch(currentColor, targetColor)) {
            setPixelColor(imageData, currentX, currentY, fillColor);

            // Push neighboring pixels onto the stack
            if (currentX > 0) stack.push([currentX - 1, currentY]); // Left
            if (currentX < imageData.width - 1) stack.push([currentX + 1, currentY]); // Right
            if (currentY > 0) stack.push([currentX, currentY - 1]); // Up
            if (currentY < imageData.height - 1) stack.push([currentX, currentY + 1]); // Down
        }
    }
};

export     const hexToRgba = (hex: string): RGBA => {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return [r, g, b, 255];
};