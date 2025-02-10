import { PointName } from "../../model/enum";
import { getAngleFromPoints } from "../findPointUtils";
import { MeasurementController, MeasurementStrategy } from "../measurement";

export class SNBMeasurement implements MeasurementStrategy {

    constructor(private controller: MeasurementController) { }

    execute(): number {
        const sPoint = this.controller.findDrawingAction(PointName.S);
        const nPoint = this.controller.findDrawingAction(PointName.N);
        const bPoint = this.controller.findDrawingAction(PointName.B);

        if (nPoint && sPoint && bPoint) {
            // TODO drawAcuteAngle(canvasContext, SPoint, NPoint, BPoint);
            const angleResult = getAngleFromPoints(sPoint, nPoint, bPoint);
            return angleResult;
        }
        return 0;
    }

}