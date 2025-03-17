import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";

export class DPointState extends CephaloState {

    executeLine(): void {
        const dtPoint = this.diagnosis.findDrawingAction(PointName.Dt)
        const dPoint = this.diagnosis.findDrawingAction(PointName.D)
        if (dtPoint && dPoint) {
            this.diagnosis.drawText(PointName.D, { x: dPoint.startX, y: dPoint.startY })
            this.diagnosis.drawPoint({ x: dPoint.startX, y: dPoint.startY })
            this.diagnosis.drawLine({ x: dtPoint.startX, y: dtPoint.startY }, { x: dPoint.startX, y: dPoint.startY })
        }
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.D,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )
        this.executeLine()
        this.diagnosis.setState(CephaloPointStep.SetPoCLine)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetDtPoint)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.D,
            title: PointName.D,
            description: "Set point of D",
            imagePath: "/assets/images/sample/D.webp"
        };
    }
}