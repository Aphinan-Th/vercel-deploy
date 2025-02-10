import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { DrawType, PointName } from "../model/enum";
import { Point } from "../model/type";

export class BAPointState extends CephaloState {

    executeLine(): void {
        return
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.Ba,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )

        this.diagnosis.setState(CephaloPointStep.SetENPoint)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetP2Point)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.Ba,
            title: PointName.Ba,
            description: "Set point of Ba",
            imagePath: "/assets/images/sample/Ba.webp"
        };
    }
}