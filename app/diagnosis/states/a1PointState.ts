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

    executeLine(): void {
        return
    }
}