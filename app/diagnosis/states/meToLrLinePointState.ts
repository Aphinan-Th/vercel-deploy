import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "fabric";
import { PointName, DrawType } from "../model/enum";

export class MeToLrLineState extends CephaloState {

    executeLine(): void {
        const point = this.diagnosis.findDrawingAction(PointName.MeToLr)
        if (point) {
            this.diagnosis.drawPoint("Me", { x: point.startX, y: point.startY })
            this.diagnosis.drawPoint("Lr", { x: point.endX ?? 0, y: point.endY ?? 0 })
            this.diagnosis.drawLine({ x: point.startX, y: point.startY }, { x: point.endX ?? 0, y: point.endY ?? 0 })
        }
    }

    click(point: Point): void {
        if (this.diagnosis.getCurrentPatch().length < 1) {
            this.diagnosis.addCurrentPatch(point)
        } else {
            this.diagnosis.addCurrentPatch(point)
            this.diagnosis.addActionsDrawings({
                pointName: PointName.MeToLr,
                type: DrawType.Line,
                startX: this.diagnosis.getCurrentPatch()[0].x,
                startY: this.diagnosis.getCurrentPatch()[0].y,
                endX: this.diagnosis.getCurrentPatch()[1].x,
                endY: this.diagnosis.getCurrentPatch()[1].y,
            })
            this.diagnosis.resetCurrentPatch()
            this.executeLine()
            this.diagnosis.setState(CephaloPointStep.SetP1Point)
        }
    }

    undo(): void {
        if (this.diagnosis.getCurrentPatch().length > 0) {
            this.diagnosis.undoCurrentPatch()
        } else {
            this.diagnosis.undoActionsDrawings()
            this.diagnosis.setState(CephaloPointStep.SetPoPoint)
        }
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.MeToLr,
            title: PointName.MeToLr,
            description: "Set point of Me to Lr",
            imagePath: "/assets/images/sample/Me.webp"
        };
    }
}