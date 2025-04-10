import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";

export class POCLineState extends CephaloState {

    executeLine(): void {
        const point = this.diagnosis.findDrawingAction(PointName.PoC)
        if (point) {
            this.diagnosis.drawLine({ x: point.startX, y: point.startY }, { x: point.endX ?? 0, y: point.endY ?? 0 })
            this.diagnosis.drawPoint({ x: point.startX, y: point.startY })
            this.diagnosis.drawPoint({ x: point.endX ?? 0, y: point.endY ?? 0 })
        }
    }

    click(point: Point): void {
        if (this.diagnosis.getCurrentPatch().length < 1) {
            this.diagnosis.addCurrentPatch(point)
        } else {
            this.diagnosis.addCurrentPatch(point)
            this.diagnosis.addActionsDrawings({
                pointName: PointName.PoC,
                type: DrawType.Line,
                startX: this.diagnosis.getCurrentPatch()[0].x,
                startY: this.diagnosis.getCurrentPatch()[0].y,
                endX: this.diagnosis.getCurrentPatch()[1].x,
                endY: this.diagnosis.getCurrentPatch()[1].y,
            })
            this.diagnosis.resetCurrentPatch()
            this.executeLine()
            this.diagnosis.setState(CephaloPointStep.SetCompleted)
        }
    }

    undo(): void {
        if (this.diagnosis.getCurrentPatch().length > 0) {
            this.diagnosis.undoCurrentPatch()
        } else {
            this.diagnosis.undoActionsDrawings()
            this.diagnosis.setState(CephaloPointStep.SetDPoint)
        }
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.PoC,
            title: PointName.PoC,
            description: "Set point of PoC",
            imagePath: "/assets/images/sample/PoC.webp"
        };
    }

    invalidateState(): boolean {
        const isValid = this.diagnosis.findDrawingAction(PointName.PoC);
        if (isValid) {
            this.diagnosis.setState(CephaloPointStep.SetCompleted)
        }
        return !isValid;
    }
}