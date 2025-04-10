import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";

export class ULPointState extends CephaloState {

    executeLine(): void {
        const ulPoint = this.diagnosis.findDrawingAction(PointName.UL)
        if (ulPoint) {
            this.diagnosis.drawText(PointName.UL, { x: ulPoint.startX, y: ulPoint.startY })
            this.diagnosis.drawPoint({ x: ulPoint.startX, y: ulPoint.startY })
        }
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.UL,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )
        this.diagnosis.drawText(PointName.UL, point)
        this.diagnosis.setState(CephaloPointStep.SetLLPoint)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetENPoint)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.UL,
            title: PointName.UL,
            description: "Set point of UL",
            imagePath: "/assets/images/sample/UL.webp"
        };
    }

    invalidateState(): boolean {
        const isValid = this.diagnosis.findDrawingAction(PointName.UL);
        if (isValid) {
            this.diagnosis.setState(CephaloPointStep.SetLLPoint)
        }
        return !isValid;
    }
}