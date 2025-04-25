import { DrawType, PointName } from "../../model/enum";
import { findIntersectPointFromExtendLine, getAngleFromPoints } from "../findPointUtils";
import { MeasurementController, MeasurementStrategy } from "../measurement";

export class FMAMeasurementStrategy implements MeasurementStrategy {

    constructor(private controller: MeasurementController) { }

    execute(): number {
        const prPoint = this.controller.findDrawingAction(PointName.Pr);
        const orPoint = this.controller.findDrawingAction(PointName.Or);
        const meToIrLine = this.controller.findDrawingAction(PointName.MeToIr);

        if (prPoint && orPoint && meToIrLine) {
            const intersectPoint = findIntersectPointFromExtendLine(
                { x: orPoint.startX, y: orPoint.startY },
                { x: prPoint.startX, y: prPoint.startY },
                { x: meToIrLine.endX ?? 0, y: meToIrLine.endY ?? 0 },
                { x: meToIrLine.startX, y: meToIrLine.startY }
            );

            if (intersectPoint?.x && intersectPoint?.y) {
                const pivotPoint = {
                    type: DrawType.Dot,
                    startX: intersectPoint.x,
                    startY: intersectPoint.y,
                };
                const angleResult = getAngleFromPoints(prPoint, pivotPoint, meToIrLine);

                return angleResult;
            }
        }
        return 0;
    }
}