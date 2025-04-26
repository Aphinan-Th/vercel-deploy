import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";
import { getLineIntersection } from "../measurements/findPointUtils";

export class ARPointState extends CephaloState {

    executeLine(): void {
        const arPoint = this.diagnosis.findDrawingAction(PointName.Ar)
        if (arPoint) {
            this.diagnosis.drawText(PointName.Ar, { x: arPoint.startX, y: arPoint.startY })
            this.diagnosis.drawPoint({ x: arPoint.startX, y: arPoint.startY })
        }
        this.executeA1ArToSNLine()
    }

    executeA1ArToSNLine() {
        const arPoint = this.diagnosis.findDrawingAction(PointName.Ar)
        const a1Point = this.diagnosis.findDrawingAction(PointName.A1)
        const sPoint = this.diagnosis.findDrawingAction(PointName.S)
        const nPoint = this.diagnosis.findDrawingAction(PointName.N)
        if (arPoint && a1Point && sPoint && nPoint) {
            const intersectPoint = getLineIntersection({ x: sPoint.startX, y: sPoint.startY }, { x: nPoint.startX, y: nPoint.startY }, { x: a1Point.startX, y: a1Point.startY }, { x: arPoint.startX, y: arPoint.startY })
            if (intersectPoint) {
                this.diagnosis.drawPoint({ x: intersectPoint.x, y: intersectPoint.y })
                this.diagnosis.drawLine({ x: a1Point.startX, y: a1Point.startY }, { x: intersectPoint.x, y: intersectPoint.y })
            }
        }
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.Ar,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )
        this.diagnosis.drawText(PointName.Ar, point)
        this.diagnosis.setState(CephaloPointStep.SetB1Point)
        this.executeA1ArToSNLine()
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetA1Point)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.Ar,
            title: PointName.Ar,
            description: "Set point of Ar",
            imagePath: "/assets/images/sample/Ar.webp"
        };
    }

    invalidateState(): boolean {
        const isValid = this.diagnosis.findDrawingAction(PointName.Ar);
        if (isValid) {
            this.diagnosis.setState(CephaloPointStep.SetB1Point)
        }
        return !isValid;
    }
}