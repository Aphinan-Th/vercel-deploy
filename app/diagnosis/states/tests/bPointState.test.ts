import { CephaloPointStep } from "../../cephaloStep";
import { DrawType, PointName } from "../../model/enum";
import { DrawDetail, Point } from "../../model/type";
import { BPointState } from "../bPointState";
import { StateDescriptionModel } from "../cephaloState";
import { DiagnosisCephalo } from "../diagnosis";


describe('State B Point', () => {

    let brPointState: BPointState
    let mockDiagnosis: DiagnosisCephalo

    beforeEach(() => {
        mockDiagnosis = new DiagnosisCephalo()
        brPointState = new BPointState(mockDiagnosis)
        mockDiagnosis.addActionsDrawings = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawText = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawPoint = jest.fn().mockImplementation(() => { })
        mockDiagnosis.setState = jest.fn().mockImplementation(() => { })
        mockDiagnosis.undoActionsDrawings = jest.fn().mockImplementation(() => { })
    })

    test('B, click should call addActionsDrawings, executeLine', () => {
        const testPoint: Point = { x: 100, y: 150 }
        brPointState.executeLine = jest.fn().mockImplementation(() => { })

        brPointState.click(testPoint)

        expect(mockDiagnosis.addActionsDrawings).toHaveBeenCalledWith({
            pointName: PointName.B,
            type: DrawType.Dot,
            startX: testPoint.x,
            startY: testPoint.y,
        })
        expect(brPointState.executeLine).toHaveBeenCalled()
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetPoPoint)
    });

    test('B, undo should undoActionsDrawings and setState to p2', () => {
        brPointState.undo()

        expect(mockDiagnosis.undoActionsDrawings).toHaveBeenCalled();
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetpMpPoint);
    })

    test('B, getStateDescription', () => {
        const actual = brPointState.getStateDescription()

        const expectDesc: StateDescriptionModel = {
            pointName: PointName.B,
            title: PointName.B,
            description: "Set point of B",
            imagePath: "/assets/images/sample/B.webp"
        }
        expect(actual).toStrictEqual(expectDesc)
    })

    test('B, invalidateState with valid', () => {
        const mockPointBr: DrawDetail = {
            pointName: PointName.B,
            type: DrawType.Dot,
            startX: 1,
            startY: 1
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPointBr)

        const actual = brPointState.invalidateState()

        expect(actual).toBe(false)
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetPoPoint);
    })

    test('B, invalidateState with invalid', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        const actual = brPointState.invalidateState()

        expect(actual).toBe(true)
        expect(mockDiagnosis.setState).toHaveBeenCalledTimes(0)
    })

    test('B, executeLine with B', () => {
        const testPoint: Point = { x: 100, y: 150 }
        const mockPoint: DrawDetail = {
            pointName: PointName.B,
            type: DrawType.Dot,
            startX: 100,
            startY: 150
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPoint)

        brPointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledWith(PointName.B, testPoint)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledWith({ x: testPoint.x, y: testPoint.y })
    })

    test('B, executeLine without B', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        brPointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledTimes(0)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledTimes(0)
    })
})