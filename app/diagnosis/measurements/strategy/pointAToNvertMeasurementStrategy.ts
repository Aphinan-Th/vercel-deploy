import { PointName } from "../../model/enum";
import { Point } from "../../model/type";
import { getDistanceBetweenPoint } from "../findPointUtils";
import { MeasurementController, MeasurementStrategy } from "../measurement";

export class PointAToNvertMeasurementStrategy implements MeasurementStrategy {

    constructor(private controller: MeasurementController) { }

    execute(): number {
        const aPoint = this.controller.findDrawingAction(PointName.A);
        const nPoint = this.controller.findDrawingAction(PointName.N);
        const prPoint = this.controller.findDrawingAction(PointName.Pr);
        const orPoint = this.controller.findDrawingAction(PointName.Or);
        if (aPoint && nPoint && prPoint && orPoint) {
            const noPoint: Point = {x: nPoint.startX, y: prPoint.startY};
            const aoPoint: Point = {x: aPoint.startX, y: prPoint.startY};
            const signedValue = aoPoint.x < noPoint.x ? -1 : 1
            const distance = getDistanceBetweenPoint(
                aoPoint.x,
                aoPoint.y,
                noPoint.x,
                noPoint.y
            );
            return (distance / this.controller.getDistanceInPx()) * signedValue;
        }
        return 0;
    }
}