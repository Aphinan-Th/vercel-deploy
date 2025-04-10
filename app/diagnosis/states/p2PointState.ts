import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";
import { findIntersectPointFromExtendLine } from "../measurements/findPointUtils";

export class P2PointState extends CephaloState {

    executeLine(): void {
        const p1Point = this.diagnosis.findDrawingAction(PointName.P1)
        const p2Point = this.diagnosis.findDrawingAction(PointName.P2)
        if (p2Point) {
            this.diagnosis.drawPoint({ x: p2Point.startX, y: p2Point.startY })
        }
        if (p1Point && p2Point) {
            this.diagnosis.drawLine({ x: p1Point.startX, y: p1Point.startY }, { x: p2Point.startX, y: p2Point.startY })
            this.drawGoPoint()
        }
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.P2,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )
        this.executeLine()
        this.diagnosis.setState(CephaloPointStep.SetBaPoint)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetP1Point)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.P2,
            title: PointName.P2,
            description: "Set point of P2",
            imagePath: "/assets/images/sample/P2.webp"
        };
    }

    private drawGoPoint() {
        const p1Point = this.diagnosis.findDrawingAction(PointName.P1)
        const p2Point = this.diagnosis.findDrawingAction(PointName.P2)
        const meToLrLinePoint = this.diagnosis.findDrawingAction(PointName.MeToLr)
        if (p1Point && p2Point && meToLrLinePoint) {
            const intersectPoint = findIntersectPointFromExtendLine(
                { x: p1Point.startX, y: p1Point.startY },
                { x: p2Point.startX, y: p2Point.startY },
                { x: meToLrLinePoint.startX, y: meToLrLinePoint.startY },
                { x: meToLrLinePoint.endX ?? 0, y: meToLrLinePoint.endY ?? 0 }
            );

            if (intersectPoint?.x && intersectPoint?.y) {
                this.diagnosis.setColor("yellow")
                this.diagnosis.drawLine({ x: p1Point.startX, y: p1Point.startY }, intersectPoint)
                this.diagnosis.drawLine({ x: meToLrLinePoint.startX, y: meToLrLinePoint.startY }, intersectPoint)
                this.diagnosis.drawPoint(intersectPoint)
                this.diagnosis.drawPoint({ x: p1Point.startX, y: p1Point.startY })
                this.diagnosis.drawPoint({ x: p2Point.startX, y: p2Point.startY })
                this.diagnosis.drawPoint({ x: meToLrLinePoint.startX, y: meToLrLinePoint.startY })
                this.diagnosis.drawPoint({ x: meToLrLinePoint.endX ?? 0, y: meToLrLinePoint.endY ?? 0 })
                this.diagnosis.drawText("Go", intersectPoint)
                this.diagnosis.drawText("Lr", { x: meToLrLinePoint.endX ?? 0, y: meToLrLinePoint.endY ?? 0 })
                this.diagnosis.setColor("red")
            }
        }
    }

    invalidateState(): boolean {
        const isValid = this.diagnosis.findDrawingAction(PointName.P2);
        if (isValid) {
            this.diagnosis.setState(CephaloPointStep.SetBaPoint)
        }
        return !isValid;
    }
}