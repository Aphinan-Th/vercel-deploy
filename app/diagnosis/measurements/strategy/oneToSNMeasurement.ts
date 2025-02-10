import { PointName, DrawType } from "../../model/enum";
import { findIntersectPointFromExtendLine, getAngleFromPoints } from "../findPointUtils";
import { MeasurementController, MeasurementStrategy } from "../measurement";

export class OneToSNMeasurement implements MeasurementStrategy {

    constructor(private controller: MeasurementController) { }

    execute(): number {
        const a1Point = this.controller.findDrawingAction(PointName.A1);
		const arPoint = this.controller.findDrawingAction(PointName.Ar);
		const sPoint = this.controller.findDrawingAction(PointName.S);
		const nPoint = this.controller.findDrawingAction(PointName.N);

		if (sPoint && nPoint && a1Point && arPoint) {
			const intersectPoint = findIntersectPointFromExtendLine(
				{ x: sPoint.startX, y: sPoint.startY },
				{ x: nPoint.startX, y: nPoint.startY },
				{ x: a1Point.startX, y: a1Point.startY },
				{ x: arPoint.startX, y: arPoint.startY }
			);

			if (intersectPoint?.x && intersectPoint?.y) {
				const pivotPoint = {
					type: DrawType.Dot,
					startX: intersectPoint.x,
					startY: intersectPoint.y,
				};
				const angleResult = getAngleFromPoints(sPoint, pivotPoint, arPoint);
				return angleResult;
			}
		}
		return 0;
    }

}