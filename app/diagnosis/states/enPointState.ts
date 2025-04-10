import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";

export class EnPointState extends CephaloState {

    executeLine(): void {
        const point = this.diagnosis.findDrawingAction(PointName.EN)
        if (point) {
            this.diagnosis.drawText(PointName.EN, { x: point.startX, y: point.startY })
            this.diagnosis.drawPoint({ x: point.startX, y: point.startY })
        }
        return
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.EN,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )
        this.executeLine()
        this.diagnosis.setState(CephaloPointStep.SetULPoint)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetBaPoint)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.EN,
            title: PointName.EN,
            description: "Set point of EN",
            imagePath: "/assets/images/sample/EN.webp"
        };
    }

    invalidateState(): boolean {
        const isValid = this.diagnosis.findDrawingAction(PointName.EN);
        if (isValid) {
            this.diagnosis.setState(CephaloPointStep.SetULPoint)
        }
        return !isValid;
    }
}