import { PointName } from "../../model/enum";
import { getDistanceBetweenPoint, getPerpendicularPoint } from "../findPointUtils";
import { MeasurementController, MeasurementStrategy } from "../measurement";

export class ConvexityToPointAMeasurementStrategy implements MeasurementStrategy {

	constructor(private controller: MeasurementController) { }

	execute(): number {
		const aPoint = this.controller.findDrawingAction(PointName.A);
		const nPoint = this.controller.findDrawingAction(PointName.N);
		const poPoint = this.controller.findDrawingAction(PointName.Po);

		if (aPoint && nPoint && poPoint) {
			const perpendicularPoint = getPerpendicularPoint(
				{ x: aPoint.startX, y: aPoint.startY },
				{ x: poPoint.startX, y: poPoint.startY },
				{ x: nPoint.startX, y: nPoint.startY }
			);
			const signedValue = aPoint.startX < perpendicularPoint.x ? -1 : 1
			const distance = getDistanceBetweenPoint(
				aPoint.startX,
				aPoint.startY,
				perpendicularPoint.x,
				perpendicularPoint.y
			);
			return (distance / this.controller.getDistanceInPx()) * signedValue * 10;
		}
		return 0;
	}
}