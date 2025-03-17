import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";

export class ANSPointState extends CephaloState {

    executeLine(): void {
        const pnsPoint = this.diagnosis.findDrawingAction(PointName.PNS)
        const ansPoint = this.diagnosis.findDrawingAction(PointName.ANS)
        if (pnsPoint && ansPoint) {
            this.diagnosis.drawText(PointName.ANS, { x: ansPoint.startX, y: ansPoint.startY })
            this.diagnosis.drawPoint({ x: ansPoint.startX, y: ansPoint.startY })
            this.diagnosis.drawLine({ x: pnsPoint.startX, y: pnsPoint.startY }, { x: ansPoint.startX, y: ansPoint.startY })
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

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.ANS,
            title: PointName.ANS,
            description: "Set point of ANS",
            imagePath: "/assets/images/sample/ANS.webp"
        };
    }

}