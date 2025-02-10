import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";

export class DtPointState extends CephaloState {

    executeLine(): void {
        const dtPoint = this.diagnosis.findDrawingAction(PointName.Dt)
        const enPoint = this.diagnosis.findDrawingAction(PointName.EN)
        if (dtPoint && enPoint) {
            this.diagnosis.drawLine({ x: dtPoint.startX, y: dtPoint.startY }, { x: enPoint.startX, y: enPoint.startY })
        }
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.Dt,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )
        this.executeLine()
        this.diagnosis.setState(CephaloPointStep.SetDPoint)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetLLPoint)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.Dt,
            title: PointName.Dt,
            description: "Set point of Dt",
            imagePath: "/assets/images/sample/Dt.webp"
        };
    }

}