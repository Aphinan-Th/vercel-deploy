import { CephaloPointStep } from "../../cephaloStep";
import { DrawType, PointName } from "../../model/enum";
import { DrawDetail, Point } from "../../model/type";
import { StateDescriptionModel } from "../cephaloState";
import { DiagnosisCephalo } from "../diagnosis";
import { LLPointState } from "../llPointState";


describe('State LL Point', () => {

    let pointState: LLPointState
    let mockDiagnosis: DiagnosisCephalo

    beforeEach(() => {
        mockDiagnosis = new DiagnosisCephalo()
        pointState = new LLPointState(mockDiagnosis)
        mockDiagnosis.addActionsDrawings = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawText = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawPoint = jest.fn().mockImplementation(() => { })
        mockDiagnosis.setState = jest.fn().mockImplementation(() => { })
        mockDiagnosis.undoActionsDrawings = jest.fn().mockImplementation(() => { })
    })

    test('LL, click should call addActionsDrawings, executeLine', () => {
        const testPoint: Point = { x: 100, y: 150 }
        pointState.executeLine = jest.fn().mockImplementation(() => { })

        pointState.click(testPoint)

        expect(mockDiagnosis.addActionsDrawings).toHaveBeenCalledWith({
            pointName: PointName.LL,
            type: DrawType.Dot,
            startX: testPoint.x,
            startY: testPoint.y,
        })
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetDtPoint)
    });

    test('LL, undo should undoActionsDrawings and setState to Ba', () => {
        pointState.undo()

        expect(mockDiagnosis.undoActionsDrawings).toHaveBeenCalled();
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetULPoint);
    })

    test('LL, getStateDescription', () => {
        const actual = pointState.getStateDescription()

        const expectDesc: StateDescriptionModel = {
            pointName: PointName.LL,
            title: PointName.LL,
            description: "Set point of LL",
            imagePath: "/assets/images/sample/LL.webp"
        }
        expect(actual).toStrictEqual(expectDesc)
    })

    test('LL, invalidateState with valid', () => {
        const mockPoint: DrawDetail = {
            pointName: PointName.LL,
            type: DrawType.Dot,
            startX: 1,
            startY: 1
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPoint)

        const actual = pointState.invalidateState()

        expect(actual).toBe(false)
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetDtPoint);
    })

    test('LL, invalidateState with invalid', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        const actual = pointState.invalidateState()

        expect(actual).toBe(true)
        expect(mockDiagnosis.setState).toHaveBeenCalledTimes(0)
    })

    test('LL, executeLine with LL', () => {
        const testPoint: Point = { x: 100, y: 150 }
        const mockPoint: DrawDetail = {
            pointName: PointName.LL,
            type: DrawType.Dot,
            startX: 100,
            startY: 150
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPoint)

        pointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledWith(PointName.LL, testPoint)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledWith({ x: testPoint.x, y: testPoint.y })
    })

    test('LL, executeLine without LL', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        pointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledTimes(0)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledTimes(0)
    })
})