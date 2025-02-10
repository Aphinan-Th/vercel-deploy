import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { DrawType, PointName } from "../model/enum";
import { Point } from "../model/type";

export class B1PointState extends CephaloState {

    executeLine(): void {
        return
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.B1,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )
        this.diagnosis.setState(CephaloPointStep.SetBrPoint)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetArPoint)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.B1,
            title: PointName.B1,
            description: "Set point of B1",
            imagePath: "/assets/images/sample/B1.webp"
        };
    }
}