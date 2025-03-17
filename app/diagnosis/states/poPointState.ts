import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";

export class PoPointState extends CephaloState {

    executeLine(): void {
        const nPoint = this.diagnosis.findDrawingAction(PointName.N)
        const poPoint = this.diagnosis.findDrawingAction(PointName.Po)
        if (nPoint && poPoint) {
            this.diagnosis.drawText(PointName.Po, { x: poPoint.startX, y: poPoint.startY })
            this.diagnosis.drawPoint({ x: poPoint.startX, y: poPoint.startY })
            this.diagnosis.drawLine({ x: nPoint.startX, y: nPoint.startY }, { x: poPoint.startX, y: poPoint.startY })
        }
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.Po,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )
        this.executeLine()
        this.diagnosis.setState(CephaloPointStep.SetMeToLrLine)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetBPoint)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.Po,
            title: PointName.Po,
            description: "Set point of Po",
            imagePath: "/assets/images/sample/Po.webp"
        };
    }
}