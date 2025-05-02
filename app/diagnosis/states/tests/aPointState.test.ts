import { CephaloPointStep } from "../../cephaloStep";
import { DrawType, PointName } from "../../model/enum";
import { DrawDetail, Point } from "../../model/type";
import { APointState } from "../aPointState";
import { StateDescriptionModel } from "../cephaloState";
import { DiagnosisCephalo } from "../diagnosis";


describe('State A Point', () => {

    let aPointState: APointState
    let mockDiagnosis: DiagnosisCephalo

    beforeEach(() => {
        mockDiagnosis = new DiagnosisCephalo()
        aPointState = new APointState(mockDiagnosis)
        mockDiagnosis.addActionsDrawings = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawText = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawPoint = jest.fn().mockImplementation(() => { })
        mockDiagnosis.setState = jest.fn().mockImplementation(() => { })
        mockDiagnosis.undoActionsDrawings = jest.fn().mockImplementation(() => { })
    })

    test('A, click should call addActionsDrawings, drawText', () => {
        const testPoint: Point = { x: 100, y: 150 }
        aPointState.executeLine = jest.fn().mockReturnValue({})

        aPointState.click(testPoint)

        expect(mockDiagnosis.addActionsDrawings).toHaveBeenCalledWith({
            pointName: PointName.A,
            type: DrawType.Dot,
            startX: testPoint.x,
            startY: testPoint.y,
        })
        expect(aPointState.executeLine).toHaveBeenCalled()
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetA1Point)
    });

    test('A, undo should undoActionsDrawings and setState to ans', () => {
        aPointState.undo()

        expect(mockDiagnosis.undoActionsDrawings).toHaveBeenCalled();
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetANSPoint);
    })

    test('A, getStateDescription', () => {
        const actual = aPointState.getStateDescription()

        const expectDesc: StateDescriptionModel = {
            pointName: PointName.A,
            title: PointName.A,
            description: "Set point of A",
            imagePath: "/assets/images/sample/A.webp"
        }
        expect(actual).toStrictEqual(expectDesc)
    })

    test('A, invalidateState with valid', () => {
        const mockPointA: DrawDetail = {
            pointName: PointName.A,
            type: DrawType.Dot,
            startX: 1,
            startY: 1
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPointA)

        const actual = aPointState.invalidateState()

        expect(actual).toBe(false)
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetA1Point);
    })

    test('A, invalidateState with invalid', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        const actual = aPointState.invalidateState()

        expect(actual).toBe(true)
        expect(mockDiagnosis.setState).toHaveBeenCalledTimes(0)
    })

    test('A, executeLine with a', () => {
        const testPoint: Point = { x: 100, y: 150 }
        const mockPoint: DrawDetail = {
            pointName: PointName.A,
            type: DrawType.Dot,
            startX: 100,
            startY: 150
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPoint)

        aPointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledWith(PointName.A, testPoint)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledWith({ x: testPoint.x, y: testPoint.y })
    })

    test('A, executeLine without a', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        aPointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledTimes(0)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledTimes(0)
    })
})