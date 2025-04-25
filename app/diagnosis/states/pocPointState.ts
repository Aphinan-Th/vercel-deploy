import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";
import { findIntersectPointFromExtendLine, generateNewPointWithExtent } from "../measurements/findPointUtils";
import { CANVAS_CONFIG } from "../../base-const";

export class POCLineState extends CephaloState {

    executeLine(): void {
        const point = this.diagnosis.findDrawingAction(PointName.PoC)
        if (point) {
            this.diagnosis.drawLine({ x: point.startX, y: point.startY }, { x: point.endX ?? 0, y: point.endY ?? 0 })
            this.diagnosis.drawPoint({ x: point.startX, y: point.startY })
            this.diagnosis.drawPoint({ x: point.endX ?? 0, y: point.endY ?? 0 })
        }
        this.executeLineAngleOfCondylar()
    }

    executeLineAngleOfCondylar() {
        const poCPlane = this.diagnosis.findDrawingAction(PointName.PoC);
        const pMpPoint = this.diagnosis.findDrawingAction(PointName.pMp);
        const mpPoint = this.diagnosis.findDrawingAction(PointName.Mp);

        if (poCPlane && pMpPoint && mpPoint && poCPlane.endX && poCPlane.endY) {
            let newPoCPlaneStart: Point
            let newPoCPlaneEnd: Point
            if (poCPlane.startY > poCPlane.endY) {
                newPoCPlaneStart = { x: poCPlane.startX, y: poCPlane.startY }
                newPoCPlaneEnd = { x: poCPlane.endX, y: poCPlane.endY }
            } else {
                newPoCPlaneStart = { x: poCPlane.endX, y: poCPlane.endY }
                newPoCPlaneEnd = { x: poCPlane.startX, y: poCPlane.startY }
            }
            const intersectPoint = findIntersectPointFromExtendLine(
                { x: mpPoint.startX, y: mpPoint.startY },
                { x: pMpPoint.startX, y: pMpPoint.startY },
                { x: newPoCPlaneStart.x, y: newPoCPlaneStart.y },
                { x: newPoCPlaneEnd.x, y: newPoCPlaneEnd.y }
            )

            if (intersectPoint) {
                this.diagnosis.drawLine({ x: poCPlane.startX, y: poCPlane.startY }, { x: intersectPoint.x, y: intersectPoint.y })
            }
        }

    }

    executeLinePMpMpToEdge() {
        const pMpPoint = this.diagnosis.findDrawingAction(PointName.pMp);
        const mpPoint = this.diagnosis.findDrawingAction(PointName.Mp);

        if (pMpPoint && mpPoint) {
            const pointEdge = generateNewPointWithExtent(pMpPoint.startX, pMpPoint.startY, mpPoint.startX, mpPoint.startY, CANVAS_CONFIG.size)
            this.diagnosis.drawLine({x: pMpPoint.startX, y: pMpPoint.startY}, {x: pointEdge.x, y: pointEdge.y})
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