import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";

export class DistanceState extends CephaloState {

    executeLine(): void {
        const point = this.diagnosis.findDrawingAction(PointName.Distance)
        if (point) {
            this.diagnosis.drawText(PointName.Distance, { x: point.startX, y: point.startY })
            this.diagnosis.drawPoint({ x: point.startX, y: point.startY })
            this.diagnosis.drawPoint({ x: point.endX ?? 0, y: point.endY ?? 0 })
            this.diagnosis.drawLine({ x: point.startX, y: point.startY }, { x: point.endX ?? 0, y: point.endY ?? 0 })
        }
    }

    click(point: Point): void {
        if (this.diagnosis.getCurrentPatch().length < 1) {
            this.diagnosis.addCurrentPatch(point)
        } else {
            this.diagnosis.addCurrentPatch(point)
            this.diagnosis.addActionsDrawings({
                pointName: PointName.Distance,
                type: DrawType.Line,
                startX: this.diagnosis.getCurrentPatch()[0].x,
                startY: this.diagnosis.getCurrentPatch()[0].y,
                endX: this.diagnosis.getCurrentPatch()[1].x,
                endY: this.diagnosis.getCurrentPatch()[1].y,
            })
            this.diagnosis.resetCurrentPatch()
            this.executeLine()
            this.diagnosis.setState(CephaloPointStep.SetPrPoint)
        }
    }

    undo(): void {
        this.diagnosis.undoCurrentPatch()
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.Distance,
            title: "Define 1 cm",
            description: "Set two points, 1 cm apart",
            imagePath: ""
        };
    }

    invalidateState(): boolean {
        const isValid = this.diagnosis.findDrawingAction(PointName.Distance);
        if (isValid) {
            this.diagnosis.setState(CephaloPointStep.SetPrPoint)
        }
        return !isValid;
    }
}