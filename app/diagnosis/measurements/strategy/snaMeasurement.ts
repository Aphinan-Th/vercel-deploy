import { PointName } from "../../model/enum";
import { getAngleFromPoints } from "../findPointUtils";
import { MeasurementController, MeasurementStrategy } from "../measurement";

export class SNAMeasurement implements MeasurementStrategy {

    constructor(private controller: MeasurementController) { }

    execute(): number {
        const sPoint = this.controller.findDrawingAction(PointName.S);
        const nPoint = this.controller.findDrawingAction(PointName.N);
        const aPoint = this.controller.findDrawingAction(PointName.A);

        if (nPoint && sPoint && aPoint) {
            // TODO drawAcuteAngle(canvasContext, SPoint, NPoint, APoint);
            const angleResult = getAngleFromPoints(sPoint, nPoint, aPoint);
            return angleResult;
        }
        return 0;
    }

}