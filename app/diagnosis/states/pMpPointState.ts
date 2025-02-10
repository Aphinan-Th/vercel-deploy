import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";

export class PMpPointState extends CephaloState {

    executeLine(): void {
        const mpPoint = this.diagnosis.findDrawingAction(PointName.Mp)
        const pMpPoint = this.diagnosis.findDrawingAction(PointName.pMp)
        if (mpPoint && pMpPoint) {
            this.diagnosis.drawLine({ x: mpPoint.startX, y: mpPoint.startY }, { x: pMpPoint.startX, y: pMpPoint.startY })
        }
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.pMp,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )
        this.executeLine()
        this.diagnosis.setState(CephaloPointStep.SetBPoint)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetMpPoint)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.pMp,
            title: PointName.pMp,
            description: "Set point of pMp",
            imagePath: "/assets/images/sample/pMp.webp"
        };
    }
}