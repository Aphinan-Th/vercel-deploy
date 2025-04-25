import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";
import { CANVAS_CONFIG } from "../../base-const";
import { generateNewPointWithExtent } from "../measurements/findPointUtils";

export class PMpPointState extends CephaloState {

    executeLine(): void {
        const mpPoint = this.diagnosis.findDrawingAction(PointName.Mp)
        const pMpPoint = this.diagnosis.findDrawingAction(PointName.pMp)
        if (pMpPoint) {
            this.diagnosis.drawText(PointName.pMp, { x: pMpPoint.startX, y: pMpPoint.startY })
            this.diagnosis.drawPoint({ x: pMpPoint.startX, y: pMpPoint.startY })
        }
        if (mpPoint && pMpPoint) {
            const pointEdge = generateNewPointWithExtent(pMpPoint.startX, pMpPoint.startY, mpPoint.startX, mpPoint.startY, CANVAS_CONFIG.size)
            this.diagnosis.drawLine({ x: pMpPoint.startX, y: pMpPoint.startY }, { x: pointEdge.x, y: pointEdge.y })
        }
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.pMp,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )
        this.executeLine()
        this.diagnosis.setState(CephaloPointStep.SetBPoint)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetMpPoint)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.pMp,
            title: PointName.pMp,
            description: "Set point of pMp",
            imagePath: "/assets/images/sample/pMp.webp"
        };
    }

    invalidateState(): boolean {
        const isValid = this.diagnosis.findDrawingAction(PointName.pMp);
        if (isValid) {
            this.diagnosis.setState(CephaloPointStep.SetBPoint)
        }
        return !isValid;
    }
}