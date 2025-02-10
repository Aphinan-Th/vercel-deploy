import { PointName, DrawType } from "../../model/enum";
import { DrawDetail } from "../../model/type";
import { findIntersectPointFromExtendLine, getAngleFromPoints } from "../findPointUtils";
import { MeasurementController, MeasurementStrategy } from "../measurement";

export class GonionAngleMeasurementStrategy implements MeasurementStrategy {

    constructor(private controller: MeasurementController) { }

    execute(): number {
        const p1Point = this.controller.findDrawingAction(PointName.P1);
        const p2Point = this.controller.findDrawingAction(PointName.P2);
        const meToLrLine = this.controller.findDrawingAction(PointName.MeToLr);

        if (p1Point && p2Point && meToLrLine) {
            const intersectPoint = findIntersectPointFromExtendLine(
                { x: p1Point.startX, y: p1Point.startY },
                { x: p2Point.startX, y: p2Point.startY },
                { x: meToLrLine.startX, y: meToLrLine.startY },
                { x: meToLrLine.endX ?? 0, y: meToLrLine.endY ?? 0 }
            );

            if (intersectPoint?.x && intersectPoint?.y) {
                const P2ToP1Point: DrawDetail = {
                    type: DrawType.Dot,
                    startX: p2Point.startX,
                    startY: p2Point.startY,
                    endX: p1Point.startX,
                    endY: p1Point.startY,
                };
                const pivotPoint = {
                    type: DrawType.Dot,
                    startX: intersectPoint.x,
                    startY: intersectPoint.y,
                };
                const angleResult = getAngleFromPoints(P2ToP1Point, pivotPoint, meToLrLine);
                return angleResult;
            }
        }
        return 0;
    }
}