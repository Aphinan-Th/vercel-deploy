import { CephaloState, StateDescriptionModel } from "./cephaloState";
import { CephaloPointStep } from "../cephaloStep";
import { Point } from "../model/type";
import { PointName, DrawType } from "../model/enum";

export class OrPointState extends CephaloState {

    executeLine(): void {
        this.diagnosis.drawFrankfortPlane(0)
    }

    click(point: Point): void {
        this.diagnosis.addActionsDrawings(
            {
                pointName: PointName.Or,
                type: DrawType.Dot,
                startX: point.x,
                startY: point.y,
            }
        )
        const result = this.findNewPoint()
        this.diagnosis.rotateImageAlignGround(result.rotationAngle)
        this.diagnosis.setState(CephaloPointStep.SetSPoint)
    }

    undo(): void {
        this.diagnosis.undoActionsDrawings()
        this.diagnosis.setState(CephaloPointStep.SetPrPoint)
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: PointName.Or,
            title: PointName.Or,
            description: "Set point of Or",
            imagePath: "/assets/images/sample/Or.webp"
        };
    }

    findNewPoint() {
        const prPoint = this.diagnosis.findDrawingAction(PointName.Pr)
        const orPoint = this.diagnosis.findDrawingAction(PointName.Or)
        if (prPoint && orPoint) {
            return this.alignLineToHorizontal({ x: prPoint.startX, y: prPoint.startY }, { x: orPoint.startX, y: orPoint.startY })
        } else {
            throw new Error("Need more point")
        }
    }

    private alignLineToHorizontal(pr: Point, or: Point): { newP1: Point; newP2: Point, rotationAngle: number } {
        const angle = Math.atan2(or.y - pr.y, or.x - pr.x) * (180 / Math.PI);

        const rotationAngle = -angle;

        const newP1 = this.diagnosis.rotatePoint(pr, pr, rotationAngle);
        const newP2 = this.diagnosis.rotatePoint(or, pr, rotationAngle);

        return { newP1, newP2, rotationAngle };
    }
}