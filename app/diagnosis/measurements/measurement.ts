import { PointName } from "../model/enum";
import { DrawDetail } from "../model/type";
import { getDistanceBetweenPoint } from "./findPointUtils";

export interface MeasurementStrategy {
    execute(): number
}

export class MeasurementController {

    private strategy?: MeasurementStrategy
    private data: DrawDetail[] = []

    setData(drawDetails: DrawDetail[]) {
        this.data = drawDetails
    }

    setStrategy(strategy: MeasurementStrategy) {
        this.strategy = strategy
    }

    execute(): number {
        return this.strategy?.execute() ?? -1
    }

    findDrawingAction(pointName: PointName) {
        return this.data.findLast((draw) => draw.pointName === pointName);
    }

    getDistanceInPx() {
        const distancePoint = this.findDrawingAction(PointName.Distance)
        if (distancePoint) {
            return getDistanceBetweenPoint(
                distancePoint.startX,
                distancePoint.startY,
                distancePoint.endX,
                distancePoint.endY
            )
        }
        return -1
    }
}
