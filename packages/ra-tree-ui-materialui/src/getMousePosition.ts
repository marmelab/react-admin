import { XYCoord } from 'dnd-core';

export type MousePosition = 'above' | 'below' | 'over' | 'none';

/**
 * Get a value indicating where the cursor is inside a rectangle:
 *
 * @param rectangle The rectangle
 * @param mouseCoordinates The mouse coordinates
 *
 * @returns
 * - `above` if the cursor is in the upper part of the rectangle (above its middle line)
 * - `below` if the cursor is in the lower part of the rectangle (below its middle line)
 * - `over` if the cursor is in the middle part of the rectangle
 * - `none` if the cursor is not over the rectangle
 */
const getMousePosition = (
    rectangle: ClientRect,
    mouseCoordinates: XYCoord
): MousePosition => {
    // Get vertical middle
    const hoverMiddleY = (rectangle.bottom - rectangle.top) / 2;

    // Get pixels to the top
    const hoverClientY = mouseCoordinates.y - rectangle.top;
    const percentage = (hoverMiddleY - hoverClientY) / rectangle.height;

    const isAbove = percentage > 0.25;
    const isBelow = percentage < -0.25;

    return isAbove ? 'above' : isBelow ? 'below' : 'over';
};

export default getMousePosition;
