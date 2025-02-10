import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";

export class LLPointState extends CephaloState {

    executeLine(): void {
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

}