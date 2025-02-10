import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";

export class ARPointState extends CephaloState {

    executeLine(): void {
        return
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.Ar,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )
        // TODO drawline a1/ar
        this.diagnosis.setState(CephaloPointStep.SetB1Point)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetA1Point)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.Ar,
            title: PointName.Ar,
            description: "Set point of Ar",
            imagePath: "/assets/images/sample/Ar.webp"
        };
    }
}