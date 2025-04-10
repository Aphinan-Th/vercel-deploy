import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";

export class PNSPointState extends CephaloState {

    executeLine(): void {
        const point = this.diagnosis.findDrawingAction(PointName.PNS)
        if (point) {
            this.diagnosis.drawText(PointName.PNS, { x: point.startX, y: point.startY })
            this.diagnosis.drawPoint({ x: point.startX, y: point.startY })
        }
        return
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.PNS,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )
        this.diagnosis.drawText(PointName.PNS, point)
        this.diagnosis.setState(CephaloPointStep.SetANSPoint)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetNPoint)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.PNS,
            title: PointName.PNS,
            description: "Set point of PNS",
            imagePath: "/assets/images/sample/PNS.webp"
        };
    }

    invalidateState(): boolean {
        const isValid = this.diagnosis.findDrawingAction(PointName.PNS);
        if (isValid) {
            this.diagnosis.setState(CephaloPointStep.SetANSPoint)
        }
        return !isValid;
    }
}