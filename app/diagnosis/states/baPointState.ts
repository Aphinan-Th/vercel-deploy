import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { DrawType, PointName } from "../model/enum";
import { Point } from "../model/type";

export class BAPointState extends CephaloState {

    executeLine(): void {
        const baPoint = this.diagnosis.findDrawingAction(PointName.Ba)
        if (baPoint) {
            this.diagnosis.drawText(PointName.Ba, { x: baPoint.startX, y: baPoint.startY })
            this.diagnosis.drawPoint({ x: baPoint.startX, y: baPoint.startY })
        }
        return
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.Ba,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )
        this.diagnosis.drawText(PointName.Ba, point)
        this.diagnosis.setState(CephaloPointStep.SetENPoint)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetP2Point)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.Ba,
            title: PointName.Ba,
            description: "Set point of Ba",
            imagePath: "/assets/images/sample/Ba.webp"
        };
    }
}