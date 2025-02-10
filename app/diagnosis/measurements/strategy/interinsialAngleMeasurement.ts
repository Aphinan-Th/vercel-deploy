import { PointName, DrawType } from "../../model/enum";
import { findIntersectPointFromExtendLine, getAngleFromPoints } from "../findPointUtils";
import { MeasurementController, MeasurementStrategy } from "../measurement";

export class InterinsialAngleMeasurement implements MeasurementStrategy {

    constructor(private controller: MeasurementController) { }

    execute(): number {
        const a1Point = this.controller.findDrawingAction(PointName.A1);
        const arPoint = this.controller.findDrawingAction(PointName.Ar);
        const b1Point = this.controller.findDrawingAction(PointName.B1);
        const brPoint = this.controller.findDrawingAction(PointName.Br);

        if (a1Point && arPoint && b1Point && brPoint) {
            const intersectPoint = findIntersectPointFromExtendLine(
                { x: arPoint.startX, y: arPoint.startY },
                { x: a1Point.startX, y: a1Point.startY },
                { x: brPoint.startX, y: brPoint.startY },
                { x: b1Point.startX, y: b1Point.startY }
            );

            if (intersectPoint?.x && intersectPoint?.y) {
                const pivotPoint = {
                    type: DrawType.Dot,
                    startX: intersectPoint.x,
                    startY: intersectPoint.y,
                };
                const angleResult = getAngleFromPoints(arPoint, pivotPoint, brPoint);
                return angleResult;
            }
        }
        return 0;
    }

}