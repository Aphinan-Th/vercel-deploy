import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";
import { generateNewPointWithExtent, getPerpendicularPoint } from "../measurements/findPointUtils";
import { CANVAS_CONFIG } from "../../base-const";

export class DPointState extends CephaloState {

    executeLine(): void {
        const dPoint = this.diagnosis.findDrawingAction(PointName.D)
        if (dPoint) {
            this.diagnosis.drawText(PointName.D, { x: dPoint.startX, y: dPoint.startY })
            this.diagnosis.drawPoint({ x: dPoint.startX, y: dPoint.startY })
        }
        this.executeLineDpo()
        this.executeLinePMpToMp()
    }

    executeLineDpo(): void {
        const dPoint = this.diagnosis.findDrawingAction(PointName.D);
        const pMpPoint = this.diagnosis.findDrawingAction(PointName.pMp);
        const mpPoint = this.diagnosis.findDrawingAction(PointName.Mp);
        if (dPoint && pMpPoint && mpPoint) {
            
            const perpendicularPoint = getPerpendicularPoint(
                { x: dPoint.startX, y: dPoint.startY },
                { x: pMpPoint.startX, y: pMpPoint.startY },
                { x: mpPoint.startX, y: mpPoint.startY }
            );
            this.diagnosis.drawPoint({ x: perpendicularPoint.x, y: perpendicularPoint.y })
            this.diagnosis.drawLine({ x: dPoint.startX, y: dPoint.startY }, { x: perpendicularPoint.x, y: perpendicularPoint.y })
        }
    }

    executeLinePMpToMp() {
        const pMpPoint = this.diagnosis.findDrawingAction(PointName.pMp);
        const mpPoint = this.diagnosis.findDrawingAction(PointName.Mp);

        if (pMpPoint && mpPoint) {
            const pointEdge = generateNewPointWithExtent(pMpPoint.startX, pMpPoint.startY, mpPoint.startX, mpPoint.startY, CANVAS_CONFIG.size)
            this.diagnosis.drawLine({ x: pMpPoint.startX, y: pMpPoint.startY }, { x: pointEdge.x, y: pointEdge.y })
        }
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.D,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )
        this.executeLine()
        this.diagnosis.setState(CephaloPointStep.SetPoCLine)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetDtPoint)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.D,
            title: PointName.D,
            description: "Set point of D",
            imagePath: "/assets/images/sample/D.webp"
        };
    }

    invalidateState(): boolean {
        const isValid = this.diagnosis.findDrawingAction(PointName.D);
        if (isValid) {
            this.diagnosis.setState(CephaloPointStep.SetPoCLine)
        }
        return !isValid;
    }
}