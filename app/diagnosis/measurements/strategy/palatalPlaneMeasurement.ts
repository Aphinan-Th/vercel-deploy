import { PointName } from "../../model/enum";
import { findIntersectPointFromExtendLine, getDistanceBetweenPoint } from "../findPointUtils";
import { MeasurementController, MeasurementStrategy } from "../measurement";

export class PalatalPlaneMeasurement implements MeasurementStrategy {

    constructor(private controller: MeasurementController) { }

    execute(): number {
        const nPoint = this.controller.findDrawingAction(PointName.N);
        const poPoint = this.controller.findDrawingAction(PointName.Po);
        const meToIrLine = this.controller.findDrawingAction(PointName.MeToIr);
        const ansPoint = this.controller.findDrawingAction(PointName.ANS);
        const pnsPoint = this.controller.findDrawingAction(PointName.PNS);
        const p1Point = this.controller.findDrawingAction(PointName.P1);
        const p2Point = this.controller.findDrawingAction(PointName.P2);

        if (nPoint && poPoint && meToIrLine && ansPoint && pnsPoint && p1Point && p2Point) {
            const gnPoint = findIntersectPointFromExtendLine(
                { x: nPoint.startX, y: nPoint.startY },
                { x: poPoint.startX, y: poPoint.startY },
                { x: meToIrLine.endX ?? 0, y: meToIrLine.endY ?? 0 },
                { x: meToIrLine.startX, y: meToIrLine.startY }
            );

            const goPoint = findIntersectPointFromExtendLine(
                { x: p1Point.startX, y: p1Point.startY },
                { x: p2Point.startX, y: p2Point.startY },
                { x: meToIrLine.startX, y: meToIrLine.startY },
                { x: meToIrLine.endX ?? 0, y: meToIrLine.endY ?? 0 }
            )

            if (gnPoint?.x && gnPoint?.y && goPoint?.x && goPoint?.y) {
                const distancePxOfAnsPns = getDistanceBetweenPoint(
                    ansPoint.startX,
                    ansPoint.startY,
                    pnsPoint.startX,
                    pnsPoint.startY
                )

                const distancePxOfGoGn = getDistanceBetweenPoint(
                    goPoint.x,
                    goPoint.y,
                    gnPoint.x,
                    gnPoint.y
                )

                return (distancePxOfAnsPns / distancePxOfGoGn)
            }
        }
        return 0;
    }
}