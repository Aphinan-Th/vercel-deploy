import { DrawType, PointName } from "../../model/enum";
import { findIntersectPointFromExtendLine, getAngleFromPoints } from "../findPointUtils";
import { MeasurementController, MeasurementStrategy } from "../measurement";

export class PalatalPlaneMeasurement implements MeasurementStrategy {

    constructor(private controller: MeasurementController) { }

    execute(): number {
        const nPoint = this.controller.findDrawingAction(PointName.N);
        const poPoint = this.controller.findDrawingAction(PointName.Po);
        const meToLrLine = this.controller.findDrawingAction(PointName.MeToLr);
        const ansPoint = this.controller.findDrawingAction(PointName.ANS);
        const pnsPoint = this.controller.findDrawingAction(PointName.PNS);
        const p2Point = this.controller.findDrawingAction(PointName.P2);

        if (nPoint && poPoint && meToLrLine && ansPoint && pnsPoint && p2Point) {
            const gnPoint = findIntersectPointFromExtendLine(
                { x: nPoint.startX, y: nPoint.startY },
                { x: poPoint.startX, y: poPoint.startY },
                { x: meToLrLine.endX ?? 0, y: meToLrLine.endY ?? 0 },
                { x: meToLrLine.startX, y: meToLrLine.startY }
            );

            if (gnPoint?.x && gnPoint?.y) {
                const intersectPoint = findIntersectPointFromExtendLine(
                    { x: ansPoint.startX, y: ansPoint.startY },
                    { x: pnsPoint.startX, y: pnsPoint.startY },
                    { x: gnPoint.x, y: gnPoint.y },
                    { x: p2Point.startX, y: p2Point.startY }
                );

                if (intersectPoint?.x && intersectPoint?.y) {
                    const pivotPoint = {
                        type: DrawType.Dot,
                        startX: intersectPoint.x,
                        startY: intersectPoint.y,
                    };
                    const angleResult = getAngleFromPoints(pnsPoint, pivotPoint, p2Point);
                    return angleResult;
                }
            }
        }
        return 0;
    }
}