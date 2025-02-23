import { PointName } from "../../model/enum";
import { Point } from "../../model/type";
import { getDistancePointToLine } from "../findPointUtils";
import { MeasurementController, MeasurementStrategy } from "../measurement";

export class PointAToNvertMeasurementStrategy implements MeasurementStrategy {

    constructor(private controller: MeasurementController) { }

    execute(): number {
        const aPoint = this.controller.findDrawingAction(PointName.A);
        const nPoint = this.controller.findDrawingAction(PointName.N);
        const prPoint = this.controller.findDrawingAction(PointName.Pr);
        const orPoint = this.controller.findDrawingAction(PointName.Or);
        if (aPoint && nPoint && prPoint && orPoint) {
            const npoPoint: Point = { x: nPoint.startX, y: prPoint.startY };
            const signedValue = aPoint.startX < npoPoint.x ? -1 : 1
            const distance = getDistancePointToLine(
                {
                    x: aPoint.startX,
                    y: aPoint.startY,
                },
                {
                    x: npoPoint.x,
                    y: npoPoint.y,
                },
                {
                    x: npoPoint.x,
                    y: aPoint.startY,
                }
            );
            return (distance / this.controller.getDistanceInPx()) * signedValue * 10;
        }
        return 0;
    }
}