import { PointName, DrawType } from "../../model/enum";
import { findIntersectPointFromExtendLine, getAngleFromPoints } from "../findPointUtils";
import { MeasurementController, MeasurementStrategy } from "../measurement";

export class FMIAMeasurementStrategy implements MeasurementStrategy {

    constructor(private controller: MeasurementController) { }

    execute(): number {
        const prPoint = this.controller.findDrawingAction(PointName.Pr);
		const orPoint = this.controller.findDrawingAction(PointName.Or);
		const b1Point = this.controller.findDrawingAction(PointName.B1);
		const brPoint = this.controller.findDrawingAction(PointName.Br);

		if (prPoint && orPoint && b1Point && brPoint) {

			const intersectPoint = findIntersectPointFromExtendLine(
				{ x: brPoint.startX, y: brPoint.startY },
				{ x: b1Point.startX, y: b1Point.startY },
				{ x: prPoint.startX, y: prPoint.startY },
				{ x: orPoint.startX, y: orPoint.startY }
			);

			if (intersectPoint?.x && intersectPoint?.y) {
				const pivotPoint = {
					type: DrawType.Dot,
					startX: intersectPoint.x,
					startY: intersectPoint.y,
				};
				const angleResult = getAngleFromPoints(orPoint, pivotPoint, b1Point);
				return angleResult;
			}
		}
		return 0;
    }
}