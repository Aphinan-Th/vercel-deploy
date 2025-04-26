import { CephaloPointStep } from "../../cephaloStep";
import { DrawType, PointName } from "../../model/enum";
import { DrawDetail, Point } from "../../model/type";
import { StateDescriptionModel } from "../cephaloState";
import { DiagnosisCephalo } from "../diagnosis";
import { MeToIrLineState } from "../meToIrLinePointState";


describe('State Me to Ir Point', () => {

    let pointState: MeToIrLineState
    let mockDiagnosis: DiagnosisCephalo

    beforeEach(() => {
        mockDiagnosis = new DiagnosisCephalo()
        pointState = new MeToIrLineState(mockDiagnosis)
        mockDiagnosis.addActionsDrawings = jest.fn()
        mockDiagnosis.drawText = jest.fn()
        mockDiagnosis.drawPoint = jest.fn()
        mockDiagnosis.drawLine = jest.fn()
        mockDiagnosis.setState = jest.fn()
        mockDiagnosis.undoActionsDrawings = jest.fn()
        mockDiagnosis.addCurrentPatch = jest.fn()
        mockDiagnosis.undoCurrentPatch = jest.fn()
    })

    test('Me to Ir, click first should add current path', () => {
        const testPoint: Point = { x: 100, y: 150 }
        mockDiagnosis.getCurrentPatch = jest.fn().mockReturnValue([])
        pointState.executeLine = jest.fn().mockImplementation(() => { })

        pointState.click(testPoint)

        expect(mockDiagnosis.addActionsDrawings).toHaveBeenCalledTimes(0)
        expect(mockDiagnosis.setState).toHaveBeenCalledTimes(0)
        expect(mockDiagnosis.addCurrentPatch).toHaveBeenCalledWith(testPoint)
        expect(mockDiagnosis.drawText).toHaveBeenCalledTimes(1)
    })

    test('Me to Ir, click second should add action', () => {
        const testPoint: Point = { x: 100, y: 150 }
        let mockPatch: Point[] = [{ x: 10, y: 20 }]
        mockDiagnosis.resetCurrentPatch = jest.fn()
        mockDiagnosis.getCurrentPatch = jest.fn(() => mockPatch)

        mockDiagnosis.addCurrentPatch = jest.fn((point: Point) => {
            mockPatch = [...mockPatch, point]
        })
        pointState.executeLine = jest.fn().mockImplementation(() => { })

        pointState.click(testPoint)

        expect(mockDiagnosis.addCurrentPatch).toHaveBeenCalledWith(testPoint)
        expect(mockDiagnosis.addActionsDrawings).toHaveBeenCalledWith({
            pointName: PointName.MeToIr,
            type: DrawType.Line,
            startX: 10,
            startY: 20,
            endX: 100,
            endY: 150
        })
        expect(mockDiagnosis.addActionsDrawings).toHaveBeenCalledTimes(1)
        expect(mockDiagnosis.resetCurrentPatch).toHaveBeenCalledTimes(1)
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetP1Point)
        expect(mockDiagnosis.drawText).toHaveBeenCalledTimes(1)
    })

    test('Me to Ir, click undo when has first point should undoCurrentPatch', () => {
        const mockPatch: Point[] = [{ x: 10, y: 20 }]
        mockDiagnosis.getCurrentPatch = jest.fn(() => mockPatch)

        pointState.undo()

        expect(mockDiagnosis.undoCurrentPatch).toHaveBeenCalledTimes(1)
    })

    test('Me to Ir, click undo with complete state should undoActionsDrawings and set state SetPoPoint', () => {
        const mockPatch: Point[] = []
        mockDiagnosis.getCurrentPatch = jest.fn(() => mockPatch)

        pointState.undo()

        expect(mockDiagnosis.undoActionsDrawings).toHaveBeenCalledTimes(1)
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetPoPoint)
    })

    test('Me to Ir, getStateDescription', () => {
        const actual = pointState.getStateDescription()

        const expectDesc: StateDescriptionModel = {
            pointName: PointName.MeToIr,
            title: PointName.MeToIr,
            description: "Set point of Me to Ir",
            imagePath: "/assets/images/sample/Me.webp"
        }
        expect(actual).toStrictEqual(expectDesc)
    })

    test('Me to Ir, invalidateState should call set state P1', () => {
        const mockPoint: DrawDetail = {
            pointName: PointName.MeToIr,
            type: DrawType.Line,
            startX: 1,
            startY: 1
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPoint)

        const actual = pointState.invalidateState()

        expect(actual).toBe(false)
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetP1Point);
    })

    test('Me to Ir, executeLine', () => {
        const mockPoint: DrawDetail = {
            pointName: PointName.MeToIr,
            type: DrawType.Line,
            startX: 1,
            startY: 1,
            endX: 1,
            endY: 1
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPoint)

        pointState.executeLine()

        expect(mockDiagnosis.drawPoint).toHaveBeenCalledTimes(3)
        expect(mockDiagnosis.drawText).toHaveBeenCalledTimes(3)
        expect(mockDiagnosis.drawLine).toHaveBeenCalledTimes(3)

        expect(mockDiagnosis.drawPoint).toHaveBeenCalledWith({ "x": 1, "y": 1 })
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledWith({ "x": 1, "y": 1 })
        expect(mockDiagnosis.drawText).toHaveBeenCalledWith("Me", { "x": 1, "y": 1 })
        expect(mockDiagnosis.drawText).toHaveBeenCalledWith("Ir", { "x": 1, "y": 1 })
    })
})