import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";
import { generateNewPointWithExtent } from "../measurements/findPointUtils";
import { CANVAS_CONFIG } from "../../base-const";

export class ANSPointState extends CephaloState {

    executeLine(): void {
        const pnsPoint = this.diagnosis.findDrawingAction(PointName.PNS)
        const ansPoint = this.diagnosis.findDrawingAction(PointName.ANS)
        if (ansPoint) {
            this.diagnosis.drawText(PointName.ANS, { x: ansPoint.startX, y: ansPoint.startY })
            this.diagnosis.drawPoint({ x: ansPoint.startX, y: ansPoint.startY })
        }
        if (pnsPoint && ansPoint) {
            const pointEdge = generateNewPointWithExtent(ansPoint.startX,  ansPoint.startY,  pnsPoint.startX, pnsPoint.startY, CANVAS_CONFIG.size)
            this.diagnosis.drawLine({ x: ansPoint.startX, y: ansPoint.startY }, { x: pointEdge.x, y: pointEdge.y })
        }
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.ANS,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )
        this.executeLine()
        this.diagnosis.setState(CephaloPointStep.SetAPoint)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetPNSPoint)
    }

    invalidateState(): boolean {
        const isValid = this.diagnosis.findDrawingAction(PointName.ANS);
        if (isValid) {
            this.diagnosis.setState(CephaloPointStep.SetAPoint)
        }
        return !isValid;
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.ANS,
            title: PointName.ANS,
            description: "Set point of ANS",
            imagePath: "/assets/images/sample/ANS.webp"
        };
    }

}