import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";

export class SPointState extends CephaloState {

    executeLine(): void {
        return
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.S,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )
        this.diagnosis.setState(CephaloPointStep.SetNPoint)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetOrPoint)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.S,
            title: PointName.S,
            description: "Set point of S",
            imagePath: "/assets/images/sample/S.webp"
        };
    }
}