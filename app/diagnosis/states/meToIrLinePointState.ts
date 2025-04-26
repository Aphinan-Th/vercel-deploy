import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { PointName, DrawType } from "../model/enum";
import { findIntersectPointFromExtendLine, generateNewPointWithExtent } from "../measurements/findPointUtils";
import { CANVAS_CONFIG } from "../../base-const";
import { Point } from "../model/type";

export class MeToIrLineState extends CephaloState {

    executeLine(): void {
        const point = this.diagnosis.findDrawingAction(PointName.MeToIr)
        if (point && point.endX && point.endY) {
            this.diagnosis.drawPoint({ x: point.startX, y: point.startY })
            this.diagnosis.drawPoint({ x: point.endX ?? 0, y: point.endY ?? 0 })
            this.diagnosis.drawText("Me", { x: point.startX, y: point.startY })
            this.diagnosis.drawText("Ir", { x: point.endX ?? 0, y: point.endY ?? 0 })

            const pointEdge = generateNewPointWithExtent(point.startX, point.startY, point.endX, point.endY, CANVAS_CONFIG.size)
            this.diagnosis.drawLine({ x: point.startX, y: point.startY }, { x: pointEdge.x, y: pointEdge.y })
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
                pointName: PointName.MeToIr,
                type: DrawType.Line,
                startX: this.diagnosis.getCurrentPatch()[0].x,
                startY: this.diagnosis.getCurrentPatch()[0].y,
                endX: this.diagnosis.getCurrentPatch()[1].x,
                endY: this.diagnosis.getCurrentPatch()[1].y,
            })
            this.diagnosis.resetCurrentPatch()
            this.diagnosis.drawText("Ir", point)
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
            pointName: PointName.MeToIr,
            title: PointName.MeToIr,
            description: "Set point of Me to Ir",
            imagePath: "/assets/images/sample/Me.webp"
        };
    }

    private drawGnPoint() {
        const meToIrLine = this.diagnosis.findDrawingAction(PointName.MeToIr)
        const nPoint = this.diagnosis.findDrawingAction(PointName.N)
        const poPoint = this.diagnosis.findDrawingAction(PointName.Po)
        if (poPoint && nPoint && meToIrLine) {
            const gnPoint = findIntersectPointFromExtendLine(
                { x: nPoint.startX, y: nPoint.startY },
                { x: poPoint.startX, y: poPoint.startY },
                { x: meToIrLine.endX ?? 0, y: meToIrLine.endY ?? 0 },
                { x: meToIrLine.startX, y: meToIrLine.startY }
            )

            if (gnPoint) {
                this.diagnosis.setColor("yellow")
                this.diagnosis.drawLine({ x: nPoint.startX, y: nPoint.startY }, gnPoint)
                this.diagnosis.drawLine({ x: meToIrLine.startX, y: meToIrLine.startY }, gnPoint)
                this.diagnosis.drawPoint(gnPoint)
                this.diagnosis.drawText("Gn", gnPoint)
            }
        }
    }

    invalidateState(): boolean {
        const isValid = this.diagnosis.findDrawingAction(PointName.MeToIr);
        if (isValid) {
            this.diagnosis.setState(CephaloPointStep.SetP1Point)
        }
        return !isValid;
    }
}