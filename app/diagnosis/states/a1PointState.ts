import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { DrawType, PointName } from "../model/enum";

export class A1PointState extends CephaloState {

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.A1,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )
        this.diagnosis.drawText(PointName.A1, point)
        this.diagnosis.setState(CephaloPointStep.SetArPoint)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetAPoint)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.A1,
            title: PointName.A1,
            description: "Set point of A1",
            imagePath: "/assets/images/sample/A1.webp"
        };
    }

    invalidateState(): boolean {
        const isValid = this.diagnosis.findDrawingAction(PointName.A1);
        if (isValid) {
            this.diagnosis.setState(CephaloPointStep.SetArPoint)
        }
        return !isValid;
    }

    executeLine(): void {
        const a1Point = this.diagnosis.findDrawingAction(PointName.A1)
        if (a1Point) {
            this.diagnosis.drawText(PointName.A1, { x: a1Point.startX, y: a1Point.startY })
            this.diagnosis.drawPoint({ x: a1Point.startX, y: a1Point.startY })
        }
        return
    }
}