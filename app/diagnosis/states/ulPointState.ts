import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";

export class ULPointState extends CephaloState {

    executeLine(): void {
        return
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
}