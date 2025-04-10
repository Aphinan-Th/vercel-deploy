import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";

export class LLPointState extends CephaloState {

    executeLine(): void {
        const point = this.diagnosis.findDrawingAction(PointName.LL)
        if (point) {
            this.diagnosis.drawText(PointName.LL, { x: point.startX, y: point.startY })
            this.diagnosis.drawPoint({ x: point.startX, y: point.startY })
        }
        return
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.LL,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )
        this.diagnosis.drawText(PointName.LL, point)
        this.diagnosis.setState(CephaloPointStep.SetDtPoint)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetULPoint)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.LL,
            title: PointName.LL,
            description: "Set point of LL",
            imagePath: "/assets/images/sample/LL.webp"
        };
    }

    invalidateState(): boolean {
        const isValid = this.diagnosis.findDrawingAction(PointName.LL);
        if (isValid) {
            this.diagnosis.setState(CephaloPointStep.SetDtPoint)
        }
        return !isValid;
    }
}