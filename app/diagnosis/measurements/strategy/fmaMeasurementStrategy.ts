import { DrawType, PointName } from "../../model/enum";
import { findIntersectPointFromExtendLine, getAngleFromPoints } from "../findPointUtils";
import { MeasurementController, MeasurementStrategy } from "../measurement";

export class FMAMeasurementStrategy implements MeasurementStrategy {

    constructor(private controller: MeasurementController) { }

    execute(): number {
        const prPoint = this.controller.findDrawingAction(PointName.Pr);
        const orPoint = this.controller.findDrawingAction(PointName.Or);
        const meToLrLine = this.controller.findDrawingAction(PointName.MeToLr);

        if (prPoint && orPoint && meToLrLine) {
            const intersectPoint = findIntersectPointFromExtendLine(
                { x: orPoint.startX, y: orPoint.startY },
                { x: prPoint.startX, y: prPoint.startY },
                { x: meToLrLine.endX ?? 0, y: meToLrLine.endY ?? 0 },
                { x: meToLrLine.startX, y: meToLrLine.startY }
            );

            if (intersectPoint?.x && intersectPoint?.y) {
                const pivotPoint = {
                    type: DrawType.Dot,
                    startX: intersectPoint.x,
                    startY: intersectPoint.y,
                };
                const angleResult = getAngleFromPoints(prPoint, pivotPoint, meToLrLine);

                return angleResult;
            }
        }
        return 0;
    }
}