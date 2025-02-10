import { PointName } from "../../model/enum";
import { getAngleFromPoints } from "../findPointUtils";
import { MeasurementController, MeasurementStrategy } from "../measurement";

export class CranialBaseAngleMeasurement implements MeasurementStrategy {

    constructor(private controller: MeasurementController) { }

    execute(): number {
        const nPoint = this.controller.findDrawingAction(PointName.N);
        const sPoint = this.controller.findDrawingAction(PointName.S);
        const baPoint = this.controller.findDrawingAction(PointName.Ba);

        if (nPoint && sPoint && baPoint) {
            // TODO  drawAcuteAngle(canvasContext, NPoint, SPoint, BaPoint);
            
            const angleResult = getAngleFromPoints(nPoint, sPoint, baPoint);
            return angleResult;
        }
        return 0;
    }

}