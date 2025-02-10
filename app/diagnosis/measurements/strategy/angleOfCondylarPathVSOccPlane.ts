import { DrawType, PointName } from "../../model/enum";
import { findIntersectPointFromExtendLine, getAngleFromPoints } from "../findPointUtils";
import { MeasurementController, MeasurementStrategy } from "../measurement";

export class AngleOfCondylarPath implements MeasurementStrategy {

    constructor(private controller: MeasurementController) { }

    execute(): number {
        const poCPlane = this.controller.findDrawingAction(PointName.PoC);
        const a1Point = this.controller.findDrawingAction(PointName.A1);
        const mpPoint = this.controller.findDrawingAction(PointName.Mp);

        if (poCPlane && a1Point && mpPoint) {
            const intersectPoint = findIntersectPointFromExtendLine(
                { x: mpPoint.startX, y: mpPoint.startY },
                { x: a1Point.startX, y: a1Point.startY },
                { x: poCPlane.startX, y: poCPlane.startY },
                { x: poCPlane.endX ?? 0, y: poCPlane.endY ?? 0 }
            );

            if (intersectPoint?.x && intersectPoint?.y) {
                const pivotPoint = {
                    type: DrawType.Dot,
                    startX: intersectPoint.x,
                    startY: intersectPoint.y,
                };
                const angleResult = getAngleFromPoints(poCPlane, pivotPoint, a1Point);
                return angleResult;
            }
        }
        return 0;
    }

}