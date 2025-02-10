import { PointName, DrawType } from "../../model/enum";
import { findIntersectPointFromExtendLine, getAngleFromPoints } from "../findPointUtils";
import { MeasurementController, MeasurementStrategy } from "../measurement";


export class YAxisMeasurementStrategy implements MeasurementStrategy {

    constructor(private controller: MeasurementController) { }

    execute(): number {
        const nPoint = this.controller.findDrawingAction(PointName.N);
        const sPoint = this.controller.findDrawingAction(PointName.S);
        const poPoint = this.controller.findDrawingAction(PointName.Po);
        const meToLrLine = this.controller.findDrawingAction(PointName.MeToLr);

        if (nPoint && sPoint && poPoint && meToLrLine) {
            const intersectPoint = findIntersectPointFromExtendLine(
                { x: nPoint.startX, y: nPoint.startY },
                { x: poPoint.startX, y: poPoint.startY },
                { x: meToLrLine.endX ?? 0, y: meToLrLine.endY ?? 0 },
                { x: meToLrLine.startX, y: meToLrLine.startY }
            );

            if (intersectPoint?.x && intersectPoint?.y) {
                const gnPoint = {
                    type: DrawType.Dot,
                    startX: intersectPoint.x,
                    startY: intersectPoint.y,
                };
                //draw new point
                const angleResult = getAngleFromPoints(nPoint, sPoint, gnPoint);
                return angleResult;
            }
        }
        return 0;
    }

}