import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";

export class NPointState extends CephaloState {

    executeLine(): void {
        const sPoint = this.diagnosis.findDrawingAction(PointName.S)
        const nPoint = this.diagnosis.findDrawingAction(PointName.N)
        if (nPoint) {
            this.diagnosis.drawText(PointName.N, { x: nPoint.startX, y: nPoint.startY })
            this.diagnosis.drawPoint({ x: nPoint.startX, y: nPoint.startY })
        }
        if (sPoint && nPoint) {
            this.diagnosis.drawText(PointName.S, { x: sPoint.startX, y: sPoint.startY })
            this.diagnosis.drawPoint({ x: sPoint.startX, y: sPoint.startY })
            this.diagnosis.drawLine({ x: sPoint.startX, y: sPoint.startY }, { x: nPoint.startX, y: nPoint.startY })
        }
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.N,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )
        this.executeLine()
        this.diagnosis.setState(CephaloPointStep.SetPNSPoint)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetSPoint)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.N,
            title: PointName.N,
            description: "Set point of N",
            imagePath: "/assets/images/sample/N.webp"
        };
    }
    
    invalidateState(): boolean {
        const isValid = this.diagnosis.findDrawingAction(PointName.N);
        if (isValid) {
            this.diagnosis.setState(CephaloPointStep.SetPNSPoint)
        }
        return !isValid;
    }
}