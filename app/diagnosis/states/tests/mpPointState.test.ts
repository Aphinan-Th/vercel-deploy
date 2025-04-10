import { CephaloPointStep } from "../../cephaloStep";
import { DrawType, PointName } from "../../model/enum";
import { DrawDetail, Point } from "../../model/type";
import { StateDescriptionModel } from "../cephaloState";
import { DiagnosisCephalo } from "../diagnosis";
import { MpPointState } from "../mpPointState";


describe('State Mp Point', () => {

    let pointState: MpPointState
    let mockDiagnosis: DiagnosisCephalo

    beforeEach(() => {
        mockDiagnosis = new DiagnosisCephalo()
        pointState = new MpPointState(mockDiagnosis)
        mockDiagnosis.addActionsDrawings = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawText = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawPoint = jest.fn().mockImplementation(() => { })
        mockDiagnosis.setState = jest.fn().mockImplementation(() => { })
        mockDiagnosis.undoActionsDrawings = jest.fn().mockImplementation(() => { })
    })

    test('Mp click should call addActionsDrawings, executeLine', () => {
        const testPoint: Point = { x: 100, y: 150 }
        pointState.executeLine = jest.fn().mockImplementation(() => { })

        pointState.click(testPoint)

        expect(mockDiagnosis.addActionsDrawings).toHaveBeenCalledWith({
            pointName: PointName.Mp,
            type: DrawType.Dot,
            startX: testPoint.x,
            startY: testPoint.y,
        })
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetpMpPoint)
    });

    test('Mp undo should undoActionsDrawings and setState to Mp', () => {
        pointState.undo()

        expect(mockDiagnosis.undoActionsDrawings).toHaveBeenCalled();
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetBrPoint);
    })

    test('Mp getStateDescription', () => {
        const actual = pointState.getStateDescription()

        const expectDesc: StateDescriptionModel = {
            pointName: PointName.Mp,
            title: PointName.Mp,
            description: "Set point of Mp",
            imagePath: "/assets/images/sample/Mp.webp"
        }
        expect(actual).toStrictEqual(expectDesc)
    })

    test('Mp invalidateState with valid', () => {
        const mockPoint: DrawDetail = {
            pointName: PointName.Mp,
            type: DrawType.Dot,
            startX: 1,
            startY: 1
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPoint)

        const actual = pointState.invalidateState()

        expect(actual).toBe(false)
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetpMpPoint);
    })

    test('Mp invalidateState with invalid', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        const actual = pointState.invalidateState()

        expect(actual).toBe(true)
        expect(mockDiagnosis.setState).toHaveBeenCalledTimes(0)
    })

    test('Mp executeLine with Mp', () => {
        const testPoint: Point = { x: 100, y: 150 }
        const mockPoint: DrawDetail = {
            pointName: PointName.Mp,
            type: DrawType.Dot,
            startX: 100,
            startY: 150
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPoint)

        pointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledWith(PointName.Mp, testPoint)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledWith({ x: testPoint.x, y: testPoint.y })
    })

    test('Mp executeLine without LL', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        pointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledTimes(0)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledTimes(0)
    })
})