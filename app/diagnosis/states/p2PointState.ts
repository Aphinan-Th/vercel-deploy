import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";

export class P2PointState extends CephaloState {

    executeLine(): void {
        const p1point = this.diagnosis.findDrawingAction(PointName.P1)
        const p2point = this.diagnosis.findDrawingAction(PointName.P2)
        if (p1point && p2point) {
            this.diagnosis.drawLine({ x: p1point.startX, y: p1point.startY }, { x: p2point.startX, y: p2point.startY })
        }
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.P2,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )
        this.executeLine()
        this.diagnosis.setState(CephaloPointStep.SetBaPoint)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetP1Point)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.P2,
            title: PointName.P2,
            description: "Set point of P2",
            imagePath: "/assets/images/sample/P2.webp"
        };
    }
}