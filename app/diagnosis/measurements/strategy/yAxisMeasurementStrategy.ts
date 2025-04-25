import { PointName, DrawType } from "../../model/enum";
import { findIntersectPointFromExtendLine, getAngleFromPoints } from "../findPointUtils";
import { MeasurementController, MeasurementStrategy } from "../measurement";


export class YAxisMeasurementStrategy implements MeasurementStrategy {

    constructor(private controller: MeasurementController) { }

    execute(): number {
        const nPoint = this.controller.findDrawingAction(PointName.N);
        const sPoint = this.controller.findDrawingAction(PointName.S);
        const poPoint = this.controller.findDrawingAction(PointName.Po);
        const meToIrLine = this.controller.findDrawingAction(PointName.MeToIr);

        if (nPoint && sPoint && poPoint && meToIrLine) {
            const intersectPoint = findIntersectPointFromExtendLine(
                { x: nPoint.startX, y: nPoint.startY },
                { x: poPoint.startX, y: poPoint.startY },
                { x: meToIrLine.endX ?? 0, y: meToIrLine.endY ?? 0 },
                { x: meToIrLine.startX, y: meToIrLine.startY }
            );

            if (intersectPoint?.x && intersectPoint?.y) {
                const gnPoint = {
                    type: DrawType.Dot,
                    startX: intersectPoint.x,
                    startY: intersectPoint.y,
                };
                const angleResult = getAngleFromPoints(nPoint, sPoint, gnPoint);
                return angleResult;
            }
        }
        return 0;
    }

}