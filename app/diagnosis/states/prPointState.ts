import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";

export class PrPointState extends CephaloState {

    executeLine(): void {
        return
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.Pr,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )
        this.diagnosis.drawText(PointName.Pr, point)
        this.diagnosis.setState(CephaloPointStep.SetOrPoint)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.Distance)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.Pr,
            title: PointName.Pr,
            description: "Set point of Pr",
            imagePath: "/assets/images/sample/Pr.webp"
        };
    }
}