import { DrawDetail, Point } from "../model/type";

export function getDistanceBetweenPoint(
    startX: number,
    startY: number,
    endX: number = 0,
    endY: number = 0
) {
    const x = (endX - startX) ** 2;
    const y = (endY - startY) ** 2;
    return Math.sqrt(x + y);
};

export function getAngleFromPoints(
    startPoint: DrawDetail,
    pivotPoint: DrawDetail,
    endPoint: DrawDetail
): number {
    const BA = [
        startPoint.startX - pivotPoint.startX,
        startPoint.startY - pivotPoint.startY,
    ];
    const BC = [
        endPoint.startX - pivotPoint.startX,
        endPoint.startY - pivotPoint.startY,
    ];

    const dotProduct = BA[0] * BC[0] + BA[1] * BC[1];
    const magnitudeBA = Math.sqrt(BA[0] ** 2 + BA[1] ** 2);
    const magnitudeBC = Math.sqrt(BC[0] ** 2 + BC[1] ** 2);

    const angleInRadians = Math.acos(dotProduct / (magnitudeBA * magnitudeBC));
    const angleInDegrees = angleInRadians * (180 / Math.PI);
    return angleInDegrees;
};

export function generateNewPointWithExtent(
    startX: number,
    startY: number,
    endX: number,
    endY: number,
    extentSize: number
): Point {
    const dx = endX - startX;
    const dy = endY - startY;
    const length = getDistanceBetweenPoint(startX, startY, endX, endY);

    const unitX = dx / length;
    const unitY = dy / length;

    const newX = endX + unitX * extentSize;
    const newY = endY + unitY * extentSize;
    return { x: newX, y: newY };
};

export function getLineIntersection(
    line1Start: Point,
    line1End: Point,
    line2Start: Point,
    line2End: Point
): Point | null {
    const { x: x1, y: y1 } = line1Start;
    const { x: x2, y: y2 } = line1End;
    const { x: x3, y: y3 } = line2Start;
    const { x: x4, y: y4 } = line2End;

    const denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
    if (denominator === 0) {
        return null;
    }

    const intersectX =
        ((x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4)) /
        denominator;
    const intersectY =
        ((x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4)) /
        denominator;

    return { x: intersectX, y: intersectY };
};

export function getDistancePointToLine(
    point: Point,
    lineStart: Point,
    lineEnd: Point
) {
    const numerator = Math.abs(
        (lineEnd.y - lineStart.y) * point.x -
        (lineEnd.x - lineStart.x) * point.y +
        lineEnd.x * lineStart.y -
        lineEnd.y * lineStart.x
    );
    const denominator = Math.sqrt(
        Math.pow(lineEnd.y - lineStart.y, 2) +
        Math.pow(lineEnd.x - lineStart.x, 2)
    );
    return numerator / denominator;
};

export function getPerpendicularPoint(
    point: Point,
    lineStart: Point,
    lineEnd: Point
) {
    const m = (lineEnd.y - lineStart.y) / (lineEnd.x - lineStart.x);
    const mPerpendicular = -1 / m;
    const b = lineStart.y - m * lineStart.x;
    const bPerpendicular = point.y - mPerpendicular * point.x;
    const xIntersection = (bPerpendicular - b) / (m - mPerpendicular);
    const yIntersection = m * xIntersection + b;

    return { x: xIntersection, y: yIntersection };
};

export function findIntersectPointFromExtendLine(
    lineStart: Point,
    lineEnd: Point,
    lineSecond: Point,
    lineSecondEnd: Point
): Point | undefined {
    let totalExtendedDistance = 0;
    while (totalExtendedDistance < 100) {
        totalExtendedDistance += 0.1;

        const newLine = generateNewPointWithExtent(
            lineStart.x,
            lineStart.y,
            lineEnd.x,
            lineEnd.y,
            totalExtendedDistance
        );

        const newLineSecond = generateNewPointWithExtent(
            lineSecond.x,
            lineSecond.y,
            lineSecondEnd.x,
            lineSecondEnd.y,
            totalExtendedDistance
        );

        const intersection = getLineIntersection(
            { x: lineStart.x, y: lineStart.y },
            { x: newLine.x, y: newLine.y },
            { x: lineSecond.x, y: lineSecond.y },
            { x: newLineSecond.x, y: newLineSecond.y }
        );

        if (intersection?.x != null && intersection?.y != null) {
            return intersection;
        }
    }
}