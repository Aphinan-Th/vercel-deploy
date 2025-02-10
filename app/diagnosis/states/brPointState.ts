import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { DrawType, PointName } from "../model/enum";
import { Point } from "../model/type";

export class BRPointState extends CephaloState {

    executeLine(): void {
        const brPoint = this.diagnosis.findDrawingAction(PointName.Br)
        const bPoint = this.diagnosis.findDrawingAction(PointName.B1)
        if (brPoint && bPoint) {
            this.diagnosis.drawLine({ x: brPoint.startX, y: brPoint.startY }, { x: bPoint.startX, y: bPoint.startY })
        }
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.Br,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )
        this.executeLine()
        this.diagnosis.setState(CephaloPointStep.SetMpPoint)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetB1Point)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.Br,
            title: PointName.Br,
            description: "Set point of Br",
            imagePath: "/assets/images/sample/Br.webp"
        };
    }
}