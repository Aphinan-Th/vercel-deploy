import { PointName } from "../../model/enum";
import { getDistanceBetweenPoint, getPerpendicularPoint } from "../findPointUtils";
import { MeasurementController, MeasurementStrategy } from "../measurement";

export class LowerLipToEPlaneMeasurement implements MeasurementStrategy {

	constructor(private controller: MeasurementController) { }

	execute(): number {
		const llPoint = this.controller.findDrawingAction(PointName.LL);
		const enPoint = this.controller.findDrawingAction(PointName.EN);
		const dtPoint = this.controller.findDrawingAction(PointName.Dt);

		if (llPoint && enPoint && dtPoint) {
			const perpendicularPoint = getPerpendicularPoint(
				{ x: llPoint.startX, y: llPoint.startY },
				{ x: enPoint.startX, y: enPoint.startY },
				{ x: dtPoint.startX, y: dtPoint.startY }
			);
			const distance = getDistanceBetweenPoint(
				llPoint.startX,
				llPoint.startY,
				perpendicularPoint.x,
				perpendicularPoint.y
			);
			return distance;
		}
		return 0;
	}
}