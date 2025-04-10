import { CephaloPointStep } from "../../cephaloStep";
import { DrawType, PointName } from "../../model/enum";
import { DrawDetail, Point } from "../../model/type";
import { StateDescriptionModel } from "../cephaloState";
import { DiagnosisCephalo } from "../diagnosis";
import { DistanceState } from "../distanceState";


describe('State Distance', () => {

    let pointState: DistanceState
    let mockDiagnosis: DiagnosisCephalo

    beforeEach(() => {
        mockDiagnosis = new DiagnosisCephalo()
        pointState = new DistanceState(mockDiagnosis)
        mockDiagnosis.addActionsDrawings = jest.fn().mockImplementation(() => { })
        mockDiagnosis.addCurrentPatch = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawText = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawPoint = jest.fn().mockImplementation(() => { })
        mockDiagnosis.setState = jest.fn().mockImplementation(() => { })
        mockDiagnosis.undoActionsDrawings = jest.fn().mockImplementation(() => { })
    })

    test('Distance, click should call addCurrentPatch', () => {
        const testPoint: Point = { x: 100, y: 150 }
        mockDiagnosis.addCurrentPatch = jest.fn().mockImplementation(() => { })
        mockDiagnosis.getCurrentPatch = jest.fn().mockReturnValue([])
        pointState.executeLine = jest.fn()

        pointState.click(testPoint)

        expect(mockDiagnosis.addCurrentPatch).toHaveBeenCalledTimes(1)
        expect(mockDiagnosis.addActionsDrawings).toHaveBeenCalledTimes(0)
        expect(pointState.executeLine).toHaveBeenCalledTimes(0)
        expect(mockDiagnosis.setState).toHaveBeenCalledTimes(0)
    });

    test('Distance round 2, click should call addCurrentPatch', () => {
        const testPoint: Point = { x: 100, y: 150 }

        let mockPatch: Point[] = [{ x: 10, y: 20 }]

        mockDiagnosis.resetCurrentPatch = jest.fn()
        mockDiagnosis.getCurrentPatch = jest.fn(() => mockPatch)

        mockDiagnosis.addCurrentPatch = jest.fn((point: Point) => {
            mockPatch = [...mockPatch, point]
        })

        pointState.executeLine = jest.fn()

        pointState.click(testPoint)

        expect(mockDiagnosis.addCurrentPatch).toHaveBeenCalledTimes(1)
        expect(mockDiagnosis.addActionsDrawings).toHaveBeenCalledWith({
            pointName: PointName.Distance,
            type: DrawType.Line,
            startX: 10,
            startY: 20,
            endX: 100,
            endY: 150,
        })
        expect(mockDiagnosis.resetCurrentPatch).toHaveBeenCalled()
        expect(pointState.executeLine).toHaveBeenCalledTimes(1)
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetPrPoint)
    });

    test('Distance, undo should undoCurrentPatch', () => {
        mockDiagnosis.undoCurrentPatch = jest.fn().mockImplementation(() => { })

        pointState.undo()

        expect(mockDiagnosis.undoCurrentPatch).toHaveBeenCalled();
    })

    test('Distance, getStateDescription', () => {
        const actual = pointState.getStateDescription()

        const expectDesc: StateDescriptionModel = {
            pointName: PointName.Distance,
            title: "Define 1 cm",
            description: "Set two points, 1 cm apart",
            imagePath: ""
        }
        expect(actual).toStrictEqual(expectDesc)
    })

    test('Distance, invalidateState with valid', () => {
        const mockPointBr: DrawDetail = {
            pointName: PointName.Distance,
            type: DrawType.Line,
            startX: 1,
            startY: 1,
            endX: 1,
            endY: 1
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPointBr)

        const actual = pointState.invalidateState()

        expect(actual).toBe(false)
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetPrPoint);
    })

    test('Distance, invalidateState with invalid', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        const actual = pointState.invalidateState()

        expect(actual).toBe(true)
        expect(mockDiagnosis.setState).toHaveBeenCalledTimes(0)
    })

    test('Distance, executeLine with Br', () => {
        const testPoint: Point = { x: 100, y: 150 }
        const mockPoint: DrawDetail = {
            pointName: PointName.Distance,
            type: DrawType.Dot,
            startX: 100,
            startY: 150,
            endX: 10,
            endY: 120
        }
        mockDiagnosis.drawLine = jest.fn()
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPoint)

        pointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledWith(PointName.Distance, testPoint)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledWith({ x: testPoint.x, y: testPoint.y })
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledWith({ x: mockPoint.endX, y: mockPoint.endY })
        expect(mockDiagnosis.drawLine).toHaveBeenCalledWith({ x: mockPoint.startX, y: mockPoint.startY }, { x: mockPoint.endX, y: mockPoint.endY })
    })

    test('Distance, executeLine without Distance', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        pointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledTimes(0)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledTimes(0)
    })
})