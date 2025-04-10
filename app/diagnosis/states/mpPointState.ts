import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";

export class MpPointState extends CephaloState {

    executeLine(): void {
        const point = this.diagnosis.findDrawingAction(PointName.Mp)
        if (point) {
            this.diagnosis.drawText(PointName.Mp, { x: point.startX, y: point.startY })
            this.diagnosis.drawPoint({ x: point.startX, y: point.startY })
        }
        return
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.Mp,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )
        // TODO drawline
        this.diagnosis.drawText(PointName.Mp, point)
        this.diagnosis.setState(CephaloPointStep.SetpMpPoint)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetBrPoint)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.Mp,
            title: PointName.Mp,
            description: "Set point of Mp",
            imagePath: "/assets/images/sample/Mp.webp"
        };
    }
    
    invalidateState(): boolean {
        const isValid = this.diagnosis.findDrawingAction(PointName.Mp);
        if (isValid) {
            this.diagnosis.setState(CephaloPointStep.SetpMpPoint)
        }
        return !isValid;
    }
}