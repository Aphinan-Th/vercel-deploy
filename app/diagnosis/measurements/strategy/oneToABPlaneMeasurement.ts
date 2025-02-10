import { PointName } from "../../model/enum";
import { getDistanceBetweenPoint, getPerpendicularPoint } from "../findPointUtils";
import { MeasurementController, MeasurementStrategy } from "../measurement";

export class OneToABPlaneMeasurementStrategy implements MeasurementStrategy {

	constructor(private controller: MeasurementController) { }

	execute(): number {
		const a1Point = this.controller.findDrawingAction(PointName.A1);
		const aPoint = this.controller.findDrawingAction(PointName.A);
		const bPoint = this.controller.findDrawingAction(PointName.B);

		if (a1Point && aPoint && bPoint) {
			const perpendicularPoint = getPerpendicularPoint(
				{ x: a1Point.startX, y: a1Point.startY },
				{ x: aPoint.startX, y: aPoint.startY },
				{ x: bPoint.startX, y: bPoint.startY }
			);
			const distance = getDistanceBetweenPoint(
				a1Point.startX,
				a1Point.startY,
				perpendicularPoint.x,
				perpendicularPoint.y
			);
			return distance;
		}
		return 0;
	}
}