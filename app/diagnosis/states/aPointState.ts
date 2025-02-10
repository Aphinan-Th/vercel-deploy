import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";

export class APointState extends CephaloState {

    executeLine(): void {
        const nPoint = this.diagnosis.findDrawingAction(PointName.N)
        const aPoint = this.diagnosis.findDrawingAction(PointName.A)
        if (nPoint && aPoint) {
            this.diagnosis.drawLine({ x: nPoint.startX, y: nPoint.startY }, { x: aPoint.startX, y: aPoint.startY })
        }
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.A,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )
        this.executeLine()
        this.diagnosis.setState(CephaloPointStep.SetA1Point)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetANSPoint)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.A,
            title: PointName.A,
            description: "Set point of A",
            imagePath: "/assets/images/sample/A.webp"
        };
    }

}