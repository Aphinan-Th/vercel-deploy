import { DrawType, PointName } from "../../model/enum";
import { DrawDetail, Point } from "../../model/type";
import { findIntersectPointFromExtendLine, getAngleFromPoints } from "../findPointUtils";
import { MeasurementController, MeasurementStrategy } from "../measurement";

export class AngleOfCondylarPath implements MeasurementStrategy {

    constructor(private controller: MeasurementController) { }

    execute(): number {
        const poCPlane = this.controller.findDrawingAction(PointName.PoC);
        const a1Point = this.controller.findDrawingAction(PointName.A1);
        const mpPoint = this.controller.findDrawingAction(PointName.Mp);

        if (poCPlane && a1Point && mpPoint && poCPlane.endX && poCPlane.endY) {
            let newPoCPlaneStart: Point
            let newPoCPlaneEnd: Point
            if (poCPlane.startY > poCPlane.endY) {
                newPoCPlaneStart = { x: poCPlane.startX, y: poCPlane.startY }
                newPoCPlaneEnd = { x: poCPlane.endX, y: poCPlane.endY }
            } else {
                newPoCPlaneStart = { x: poCPlane.endX, y: poCPlane.endY }
                newPoCPlaneEnd = { x: poCPlane.startX, y: poCPlane.startY }
            }
            const intersectPoint = findIntersectPointFromExtendLine(
                { x: mpPoint.startX, y: mpPoint.startY },
                { x: a1Point.startX, y: a1Point.startY },
                { x: newPoCPlaneStart.x, y: newPoCPlaneStart.y },
                { x: newPoCPlaneEnd.x, y: newPoCPlaneEnd.y }
            );

            if (intersectPoint?.x && intersectPoint?.y) {
                const pivotPoint = {
                    type: DrawType.Dot,
                    startX: intersectPoint.x,
                    startY: intersectPoint.y,
                };
                const newPoCPlane: DrawDetail = {
                    type: DrawType.Line,
                    startX: newPoCPlaneStart.x,
                    startY: newPoCPlaneStart.y,
                    endX: newPoCPlaneEnd.x,
                    endY: newPoCPlaneEnd.y,
                }
                if (pivotPoint.startX > a1Point.startX) {
                    return getAngleFromPoints(newPoCPlane, pivotPoint, mpPoint);
                } else {
                    return 180 - getAngleFromPoints(newPoCPlane, pivotPoint, a1Point);
                }
            }
        }
        return 0;
    }

}