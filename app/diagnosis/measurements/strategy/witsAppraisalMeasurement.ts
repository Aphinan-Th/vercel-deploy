import { PointName } from "../../model/enum";
import { getDistanceBetweenPoint, getPerpendicularPoint } from "../findPointUtils";
import { MeasurementController, MeasurementStrategy } from "../measurement";

export class WitsAppraisalMeasurementStrategy implements MeasurementStrategy {

    constructor(private controller: MeasurementController) { }

    execute(): number {
        const aPoint = this.controller.findDrawingAction(PointName.A);
		const bPoint = this.controller.findDrawingAction(PointName.B);
		const pMpPoint = this.controller.findDrawingAction(PointName.pMp);
		const mpPoint = this.controller.findDrawingAction(PointName.Mp);

		if (aPoint && pMpPoint && bPoint && mpPoint) {
			const aoPoint = getPerpendicularPoint(
				{ x: aPoint.startX, y: aPoint.startY },
				{ x: pMpPoint.startX, y: pMpPoint.startY },
				{ x: mpPoint.startX, y: mpPoint.startY }
			);

			const boPoint = getPerpendicularPoint(
				{ x: bPoint.startX, y: bPoint.startY },
				{ x: pMpPoint.startX, y: pMpPoint.startY },
				{ x: mpPoint.startX, y: mpPoint.startY }
			);

			const signedValue = aoPoint.x < boPoint.x ? -1 : 1
			const distance = getDistanceBetweenPoint(aoPoint.x, aoPoint.y, boPoint.x, boPoint.y);
			return (distance / this.controller.getDistanceInPx()) * signedValue * 10;
		}
		return 0;
    }

}