import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";

export class P1PointState extends CephaloState {

    executeLine(): void {
        const point = this.diagnosis.findDrawingAction(PointName.P1)
        if (point) {
            this.diagnosis.drawPoint({ x: point.startX, y: point.startY })
        }
        return
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.P1,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )

        this.diagnosis.setState(CephaloPointStep.SetP2Point)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetMeToIrLine)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.P1,
            title: PointName.P1,
            description: "Set point of P1",
            imagePath: "/assets/images/sample/P1.webp"
        };
    }

    invalidateState(): boolean {
        const isValid = this.diagnosis.findDrawingAction(PointName.P1);
        if (isValid) {
            this.diagnosis.setState(CephaloPointStep.SetP2Point)
        }
        return !isValid;
    }
}