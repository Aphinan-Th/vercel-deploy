import { CephaloPointStep as CephaloPointState } from "../cephaloStep";
import { CephaloDictionary, StateDescriptionModel } from "./cephaloState";
import { DistanceState } from "./distanceState";
import { PrPointState } from "./prPointState";
import { OrPointState } from "./orPointState";
import { SPointState } from "./sPointState";
import { NPointState } from "./nPointState";
import { PNSPointState } from "./pnsPointState";
import { ANSPointState } from "./ansPointState";
import { APointState } from "./aPointState";
import { A1PointState } from "./a1PointState";
import { ARPointState } from "./arPointState";
import { B1PointState } from "./b1PointState";
import { BRPointState } from "./brPointState";
import { PMpPointState } from "./pMpPointState";
import { MpPointState } from "./mpPointState";
import { BPointState } from "./bPointState";
import { PoPointState } from "./poPointState";
import { MeToIrLineState } from "./meToIrLinePointState";
import { P1PointState } from "./p1PointState";
import { P2PointState } from "./p2PointState";
import { BAPointState } from "./baPointState";
import { EnPointState } from "./enPointState";
import { ULPointState } from "./ulPointState";
import { LLPointState } from "./llPointState";
import { DtPointState } from "./dtPointState";
import { DPointState } from "./dPointState";
import { POCLineState } from "./pocPointState";
import EventEmitter from "events";
import { DrawDetail, Point, Result } from "../../diagnosis/model/type";
import { CranialBaseAngleMeasurement } from "../measurements/strategy/cranialBaseAngleMeasurement";
import { MeasurementController } from "../measurements/measurement";
import { YAxisMeasurementStrategy as YAxisMeasurement } from "../measurements/strategy/yAxisMeasurementStrategy";
import { FMAMeasurementStrategy as FMAMeasurement } from "../measurements/strategy/fmaMeasurementStrategy";
import { GonionAngleMeasurementStrategy as GonionAngleMeasurement } from "../measurements/strategy/gonionAngleMearsurementStrategy";
import { PointAToNvertMeasurementStrategy as PointAToNvertMeasurement } from "../measurements/strategy/pointAToNvertMeasurementStrategy";
import { WitsAppraisalMeasurementStrategy as WitsAppraisalMeasurement } from "../measurements/strategy/witsAppraisalMeasurement";
import { InterinsialAngleMeasurement } from "../measurements/strategy/interinsialAngleMeasurement";
import { OneToSNMeasurement } from "../measurements/strategy/oneToSNMeasurement";
import { FMIAMeasurementStrategy as FMIAMeasurement } from "../measurements/strategy/fmiaMeasurement";
import { ConvexityToPointAMeasurementStrategy as ConvexityToPointAMeasurement } from "../measurements/strategy/convexityToPointAMeasurement";
import { OneToABPlaneMeasurementStrategy as OneToABPlaneMeasurement } from "../measurements/strategy/oneToABPlaneMeasurement";
import { PalatalPlaneMeasurement } from "../measurements/strategy/palatalPlaneMeasurement";
import { DpoMeasurement } from "../measurements/strategy/dpoMeasurement";
import { AngleOfCondylarPath as AngleOfCondylarPathMeasurement } from "../measurements/strategy/angleOfCondylarPathVSOccPlane";
import { SNAMeasurement } from "../measurements/strategy/snaMeasurement";
import { SNBMeasurement } from "../measurements/strategy/snbMeasurement";
import { LowerLipToEPlaneMeasurement } from "../measurements/strategy/lowerLipToEPlaneMeasurement";
import { CompletedState } from "./completedState";
import { DrawType, PointName } from "../model/enum";
import { mapEnum as mapToPointName } from "./mappers/pointNameMapper";
import { CANVAS_CONFIG } from "../../../app/base-const";

export class DiagnosisCephalo {
    private actionDrawings: DrawDetail[] = []
    private currentPatch: Point[] = []
    private context?: CanvasRenderingContext2D
    private eventEmitter = new EventEmitter();
    private measurementController = new MeasurementController();
    private state: CephaloPointState = CephaloPointState.Distance
    private indexOfState = 0
    private tempRotationAngle = 0
    private isEditMode = false

    redrawImageCallBack: (rotationAngle: number) => void = () => { };

    allStates: CephaloDictionary = {
        [CephaloPointState.Distance]: new DistanceState(this),
        [CephaloPointState.SetPrPoint]: new PrPointState(this),
        [CephaloPointState.SetOrPoint]: new OrPointState(this),
        [CephaloPointState.SetSPoint]: new SPointState(this),
        [CephaloPointState.SetNPoint]: new NPointState(this),
        [CephaloPointState.SetPNSPoint]: new PNSPointState(this),
        [CephaloPointState.SetANSPoint]: new ANSPointState(this),
        [CephaloPointState.SetAPoint]: new APointState(this),
        [CephaloPointState.SetA1Point]: new A1PointState(this),
        [CephaloPointState.SetArPoint]: new ARPointState(this),
        [CephaloPointState.SetB1Point]: new B1PointState(this),
        [CephaloPointState.SetBrPoint]: new BRPointState(this),
        [CephaloPointState.SetMpPoint]: new MpPointState(this),
        [CephaloPointState.SetpMpPoint]: new PMpPointState(this),
        [CephaloPointState.SetBPoint]: new BPointState(this),
        [CephaloPointState.SetPoPoint]: new PoPointState(this),
        [CephaloPointState.SetMeToIrLine]: new MeToIrLineState(this),
        [CephaloPointState.SetP1Point]: new P1PointState(this),
        [CephaloPointState.SetP2Point]: new P2PointState(this),
        [CephaloPointState.SetBaPoint]: new BAPointState(this),
        [CephaloPointState.SetENPoint]: new EnPointState(this),
        [CephaloPointState.SetULPoint]: new ULPointState(this),
        [CephaloPointState.SetLLPoint]: new LLPointState(this),
        [CephaloPointState.SetDtPoint]: new DtPointState(this),
        [CephaloPointState.SetDPoint]: new DPointState(this),
        [CephaloPointState.SetPoCLine]: new POCLineState(this),
        [CephaloPointState.SetCompleted]: new CompletedState(this),
    }

    onChangeState(callback: () => void) {
        this.eventEmitter.on("changeState", () => callback());
    }

    onCompletedAllState(callback: (result: Result) => void) {
        this.eventEmitter.on("completedState", () => {
            const result = this.generateDiagnosisResult()
            callback(result)
        })
    }

    private notifyChange(eventName: string) {
        this.eventEmitter.emit(eventName);
    }

    click(point: Point) {
        if (this.state == CephaloPointState.SetCompleted) return
        this.drawPoint(point)
        this.allStates[this.state].click(point)

        if (this.isEditMode == true) {
            this.invalidateState()
            this.reRenderCanvas()
        }
    }

    private invalidateState() {
        this.indexOfState = 0
        for (const key in this.allStates) {
            const isUnAdded = this.allStates[key].invalidateState()
            if (isUnAdded == true) {
                break;
            } else {
                this.indexOfState += 1
            }
        }
        this.isEditMode = false
    }

    undo() {
        this.allStates[this.state].undo()
    }

    getStateContent(): StateDescriptionModel {
        return this.allStates[this.state].getStateDescription()
    }

    setEditPoint(detail: DrawDetail) {
        const pointName = detail.pointName;
        if (pointName) {
            this.removePoint(detail)
            this.isEditMode = true
            this.setState(mapToPointName(pointName))
            this.reRenderCanvas()
        }
    }

    private removePoint(detail: DrawDetail) {
        const index = this.actionDrawings.indexOf(detail, 0);
        if (index > -1) {
            this.actionDrawings.splice(index, 1);
        }
    }

    resetState() {
        this.actionDrawings = []
        this.currentPatch = []
        this.indexOfState = 0
        this.tempRotationAngle = 0
        this.state = CephaloPointState.Distance
        this.notifyChange("changeState")
    }

    getState(): CephaloPointState {
        return this.state
    }

    setState(state: CephaloPointState) {
        if (state === CephaloPointState.SetCompleted) {
            this.indexOfState = Object.keys(this.allStates).length -1
            this.notifyChange("completedState")
            this.notifyChange("changeState")
        }
        this.state = state
        this.notifyChange("changeState")
    }

    addActionsDrawings(drawDetail: DrawDetail) {
        this.actionDrawings.push(drawDetail)
        this.indexOfState += 1
    }

    undoActionsDrawings() {
        this.actionDrawings.pop()
        this.indexOfState -= 1
        this.reRenderCanvas()
    }

    getActionsDrawings(): DrawDetail[] {
        return this.actionDrawings
    }

    findDrawingAction(pointName: PointName) {
        return this.actionDrawings.findLast((draw) => draw.pointName === pointName);
    }

    getCurrentPatch(): Point[] {
        return this.currentPatch
    }

    addCurrentPatch(patch: Point) {
        this.currentPatch.push(patch)
    }

    resetCurrentPatch() {
        this.currentPatch = []
    }

    undoCurrentPatch() {
        this.currentPatch.pop()
        this.reRenderCanvas()
    }

    getMeasurementController(): MeasurementController {
        this.measurementController.setData(this.actionDrawings)
        return this.measurementController
    }

    setCanvasContext(ctx: CanvasRenderingContext2D) {
        this.context = ctx
    }

    getCanvasContext(): CanvasRenderingContext2D | undefined {
        return this.context
    }

    drawPoint(point: Point) {
        if (this.context == null) return
        this.context.beginPath();
        this.context.arc(point.x, point.y, 1, 0, 2 * Math.PI);
        this.context.fill();
        this.context.stroke();
    }

    drawLine(point1: Point, point2: Point) {
        if (this.context == null) return
        if (point2.x != 0 && point2.y != 0) {
            this.context.beginPath();
            this.context.lineWidth = 0.5
            this.context.moveTo(point1.x, point1.y);
            this.context.lineTo(point2.x, point2.y);
            this.context.stroke();
        }
    }

    setColor(color: string) {
        if (this.context == null) return
        this.context.fillStyle = color
        this.context.strokeStyle = color
    }

    drawText(pointName: string, point: Point) {
        if (this.context == null) return
        this.context.font = "12px";
        this.context.fillText(pointName, point.x, point.y - 8)
    }

    reRenderCanvas() {
        if (this.context == null) return
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height)
        this.redrawImageCallBack(this.tempRotationAngle)
        this.drawFrankfortPlane(0)
        for (const key in this.allStates) {
            this.allStates[key].executeLine()
        }
    }

    reRenderFromTab(newContext: CanvasRenderingContext2D) {
        this.context = newContext
        for (const key in this.allStates) {
            this.allStates[key].executeLine()
        }
    }

    setReDrawImage(callback: (rotationAngle: number) => void) {
        this.redrawImageCallBack = callback
    }

    rotateImageAlignGround(rotationAngle: number) {
        /*
            step
            1. calculate angle
            2. rotate image from angle
            3. loop re-calculate all point
            4. draw all point
        */
        const prPoint = this.findDrawingAction(PointName.Pr)
        this.tempRotationAngle = rotationAngle
        this.redrawImageCallBack(rotationAngle)

        if (prPoint) {
            this.drawFrankfortPlane(rotationAngle)
            const newActionDrawings: DrawDetail[] = []
            this.actionDrawings.forEach((action) => {
                if (action.type == DrawType.Dot) {
                    const newPoint = this.rotatePoint({ x: action.startX, y: action.startY }, { x: this.getCenterFrame(), y: this.getCenterFrame() }, rotationAngle)
                    this.drawPoint({ x: newPoint.x, y: newPoint.y })

                    const newAction: DrawDetail = {
                        type: action.type,
                        pointName: action.pointName,
                        startX: newPoint.x,
                        startY: newPoint.y
                    }
                    newActionDrawings.push(newAction)
                } else {
                    const newPoint = this.rotatePoint({ x: action.startX, y: action.startY }, { x: this.getCenterFrame(), y: this.getCenterFrame() }, rotationAngle)
                    this.drawPoint({ x: newPoint.x, y: newPoint.y })

                    const newPoint2 = this.rotatePoint({ x: action.endX ?? 0, y: action.endY ?? 0 }, { x: this.getCenterFrame(), y: this.getCenterFrame() }, rotationAngle)
                    this.drawPoint({ x: newPoint2.x, y: newPoint2.y })

                    this.drawLine({ x: newPoint.x, y: newPoint.y }, { x: newPoint2.x ?? 0, y: newPoint2.y ?? 0 })

                    const newAction: DrawDetail = {
                        type: action.type,
                        pointName: action.pointName,
                        startX: newPoint.x,
                        startY: newPoint.y,
                        endX: newPoint2.x,
                        endY: newPoint2.y
                    }
                    newActionDrawings.push(newAction)
                }
            })

            this.actionDrawings = newActionDrawings
        }
    }

    drawFrankfortPlane(rotationAngle: number) {
        const prPoint = this.findDrawingAction(PointName.Pr)
        const orPoint = this.findDrawingAction(PointName.Or)
        if (prPoint && orPoint) {
            const newPointPr = this.rotatePoint({ x: prPoint.startX, y: prPoint.startY }, { x: this.getCenterFrame(), y: this.getCenterFrame() }, rotationAngle)
            const newPointOr = this.rotatePoint({ x: orPoint.startX, y: orPoint.startY }, { x: this.getCenterFrame(), y: this.getCenterFrame() }, rotationAngle)
            if (newPointPr && newPointOr) {
                this.drawPoint({ x: newPointPr.x, y: newPointPr.y })
                this.drawPoint({ x: newPointOr.x, y: newPointOr.y })
                this.drawText(PointName.Pr, { x: newPointPr.x, y: newPointPr.y })
                this.drawText(PointName.Or, { x: newPointOr.x, y: newPointOr.y })
            }
            this.drawLine({ x: 0, y: newPointPr.y }, { x: CANVAS_CONFIG.size, y: newPointOr.y })
        }
    }

    rotatePoint(point: Point, center: Point, angle: number): Point {
        const rad = (angle * Math.PI) / 180;
        const cosTheta = Math.cos(rad);
        const sinTheta = Math.sin(rad);

        const newX = cosTheta * (point.x - center.x) - sinTheta * (point.y - center.y) + center.x;
        const newY = sinTheta * (point.x - center.x) + cosTheta * (point.y - center.y) + center.y;

        return { x: newX, y: newY };
    }

    getTempRotationAngle(): number {
        return this.tempRotationAngle
    }

    private generateDiagnosisResult(): Result {
        this.measurementController.setData(this.actionDrawings)
        const newResults: Result = {};

        newResults.rotationAngle = this.tempRotationAngle
        this.measurementController.setStrategy(new YAxisMeasurement(this.measurementController))
        newResults.yAxis = this.measurementController.execute();

        this.measurementController.setStrategy(new FMAMeasurement(this.measurementController))
        newResults.fma = this.measurementController.execute();

        this.measurementController.setStrategy(new GonionAngleMeasurement(this.measurementController))
        newResults.gonionAngle = this.measurementController.execute();

        this.measurementController.setStrategy(new CranialBaseAngleMeasurement(this.measurementController))
        newResults.cranialBaseAngle = this.measurementController.execute();

        this.measurementController.setStrategy(new SNAMeasurement(this.measurementController))
        newResults.sna = this.measurementController.execute();

        this.measurementController.setStrategy(new SNBMeasurement(this.measurementController))
        newResults.snb = this.measurementController.execute();

        newResults.anb = newResults.sna - newResults.snb;

        this.measurementController.setStrategy(new PointAToNvertMeasurement(this.measurementController))
        newResults.pointAToNvert = this.measurementController.execute();

        this.measurementController.setStrategy(new WitsAppraisalMeasurement(this.measurementController))
        newResults.witsAppraisal = this.measurementController.execute();

        this.measurementController.setStrategy(new InterinsialAngleMeasurement(this.measurementController))
        newResults.interincisalAngle = this.measurementController.execute()

        this.measurementController.setStrategy(new OneToSNMeasurement(this.measurementController))
        newResults.oneToSN = this.measurementController.execute()

        this.measurementController.setStrategy(new FMIAMeasurement(this.measurementController))
        newResults.fmia = this.measurementController.execute();

        newResults.impa = 180 - newResults.fmia - newResults.fma;

        this.measurementController.setStrategy(new ConvexityToPointAMeasurement(this.measurementController))
        newResults.convexityToPointA = this.measurementController.execute();

        this.measurementController.setStrategy(new LowerLipToEPlaneMeasurement(this.measurementController))
        newResults.lowerLipToEPlane = this.measurementController.execute();

        this.measurementController.setStrategy(new OneToABPlaneMeasurement(this.measurementController))
        newResults.oneToABPlane = this.measurementController.execute();

        this.measurementController.setStrategy(new PalatalPlaneMeasurement(this.measurementController))
        newResults.palatalPlane = this.measurementController.execute();

        this.measurementController.setStrategy(new DpoMeasurement(this.measurementController))
        newResults.dpo = this.measurementController.execute();

        this.measurementController.setStrategy(new AngleOfCondylarPathMeasurement(this.measurementController))
        newResults.angleOfCondylarPathVSOccPlane = this.measurementController.execute();

        return newResults
    }

    private getCenterFrame() {
        const frameSize = this.context?.canvas.width ?? 0
        return frameSize / 2
    }
}
