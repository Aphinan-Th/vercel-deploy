import { PointName } from "../../model/enum";
import { getDistanceBetweenPoint, getPerpendicularPoint } from "../findPointUtils";
import { MeasurementController, MeasurementStrategy } from "../measurement";

export class DpoMeasurement implements MeasurementStrategy {

	constructor(private controller: MeasurementController) { }

	execute(): number {
		const dPoint = this.controller.findDrawingAction(PointName.D);
		const a1Point = this.controller.findDrawingAction(PointName.A1);
		const mpPoint = this.controller.findDrawingAction(PointName.Mp);

		if (dPoint && a1Point && mpPoint) {
			const perpendicularPoint = getPerpendicularPoint(
				{ x: dPoint.startX, y: dPoint.startY },
				{ x: a1Point.startX, y: a1Point.startY },
				{ x: mpPoint.startX, y: mpPoint.startY }
			);
			const distance = getDistanceBetweenPoint(
				dPoint.startX,
				dPoint.startY,
				perpendicularPoint.x,
				perpendicularPoint.y
			);
			return distance / this.controller.getDistanceInPx() * 10;
		}
		return 0;
	}
}