import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "fabric";
import { PointName, DrawType } from "../model/enum";
import { findIntersectPointFromExtendLine } from "../measurements/findPointUtils";

export class MeToLrLineState extends CephaloState {

    executeLine(): void {
        const point = this.diagnosis.findDrawingAction(PointName.MeToLr)
        if (point) {
            this.diagnosis.drawPoint({ x: point.startX, y: point.startY })
            this.diagnosis.drawPoint({ x: point.endX ?? 0, y: point.endY ?? 0 })
            this.diagnosis.drawText("Me", { x: point.startX, y: point.startY })
            this.diagnosis.drawText("Lr", { x: point.endX ?? 0, y: point.endY ?? 0 })
            this.diagnosis.drawLine({ x: point.startX, y: point.startY }, { x: point.endX ?? 0, y: point.endY ?? 0 })
            this.drawGnPoint()
        }
    }

    click(point: Point): void {
        if (this.diagnosis.getCurrentPatch().length < 1) {
            this.diagnosis.addCurrentPatch(point)
            this.diagnosis.drawText("Me", point)
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
            this.diagnosis.drawText("Lr", point)
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

    private drawGnPoint() {
        const meToLrLine = this.diagnosis.findDrawingAction(PointName.MeToLr)
        const nPoint = this.diagnosis.findDrawingAction(PointName.N)
        const poPoint = this.diagnosis.findDrawingAction(PointName.Po)
        if (poPoint && nPoint && meToLrLine) {
            const gnPoint = findIntersectPointFromExtendLine(
                { x: nPoint.startX, y: nPoint.startY },
                { x: poPoint.startX, y: poPoint.startY },
                { x: meToLrLine.endX ?? 0, y: meToLrLine.endY ?? 0 },
                { x: meToLrLine.startX, y: meToLrLine.startY }
            )

            if (gnPoint) {
                this.diagnosis.setColor("yellow")
                this.diagnosis.drawLine({ x: nPoint.startX, y: nPoint.startY }, gnPoint)
                this.diagnosis.drawLine({ x: meToLrLine.startX, y: meToLrLine.startY }, gnPoint)
                this.diagnosis.drawPoint(gnPoint)
                this.diagnosis.drawText("Gn", gnPoint)
                this.diagnosis.setColor("red")
            }
        }
    }
}