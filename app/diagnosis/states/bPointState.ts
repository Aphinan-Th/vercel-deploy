import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { DrawType, PointName } from "../model/enum";
import { Point } from "../model/type";

export class BPointState extends CephaloState {

    executeLine(): void {
        const nPoint = this.diagnosis.findDrawingAction(PointName.N)
        const bPoint = this.diagnosis.findDrawingAction(PointName.B)
        if (bPoint) {
            this.diagnosis.drawText(PointName.B, { x: bPoint.startX, y: bPoint.startY })
            this.diagnosis.drawPoint({ x: bPoint.startX, y: bPoint.startY })
        }
        if (nPoint && bPoint) {
            this.diagnosis.drawLine({ x: nPoint.startX, y: nPoint.startY }, { x: bPoint.startX, y: bPoint.startY })
        }
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.B,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )
        this.executeLine()
        this.diagnosis.setState(CephaloPointStep.SetPoPoint)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetpMpPoint)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.B,
            title: PointName.B,
            description: "Set point of B",
            imagePath: "/assets/images/sample/B.webp"
        };
    }

    invalidateState(): boolean {
        const isValid = this.diagnosis.findDrawingAction(PointName.B);
        if (isValid) {
            this.diagnosis.setState(CephaloPointStep.SetPoPoint)
        }
        return !isValid;
    }
}