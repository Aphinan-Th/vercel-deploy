import { CephaloPointStep } from "../../cephaloStep";
import { DrawType, PointName } from "../../model/enum";
import { DrawDetail, Point } from "../../model/type";
import { A1PointState } from "../a1PointState";
import { StateDescriptionModel } from "../cephaloState";
import { DiagnosisCephalo } from "../diagnosis";


describe('State A1 Point', () => {

    let a1PointState: A1PointState
    let mockDiagnosis: DiagnosisCephalo

    beforeEach(() => {
        mockDiagnosis = new DiagnosisCephalo()
        a1PointState = new A1PointState(mockDiagnosis)
        mockDiagnosis.addActionsDrawings = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawText = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawPoint = jest.fn().mockImplementation(() => { })
        mockDiagnosis.setState = jest.fn().mockImplementation(() => { })
        mockDiagnosis.undoActionsDrawings = jest.fn().mockImplementation(() => { })
    })

    test('A1, click should call addActionsDrawings, drawText', () => {
        const testPoint: Point = { x: 100, y: 150 }

        a1PointState.click(testPoint)

        expect(mockDiagnosis.addActionsDrawings).toHaveBeenCalledWith({
            pointName: PointName.A1,
            type: DrawType.Dot,
            startX: testPoint.x,
            startY: testPoint.y,
        })
        expect(mockDiagnosis.drawText).toHaveBeenCalledWith(PointName.A1, testPoint)
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetArPoint)
    });

    test('A1, undo should undoActionsDrawings and setState to a', () => {
        a1PointState.undo()

        expect(mockDiagnosis.undoActionsDrawings).toHaveBeenCalled();
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetAPoint);

    })

    test('A1, getStateDescription', () => {
        const actual = a1PointState.getStateDescription()

        const expectDesc: StateDescriptionModel = {
            pointName: PointName.A1,
            title: PointName.A1,
            description: "Set point of A1",
            imagePath: "/assets/images/sample/A1.webp"
        }
        expect(actual).toStrictEqual(expectDesc)
    })

    test('A1, invalidateState with valid', () => {
        const mockPointA1: DrawDetail = {
            pointName: PointName.A1,
            type: DrawType.Dot,
            startX: 1,
            startY: 1
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPointA1)

        const actual = a1PointState.invalidateState()

        expect(actual).toBe(false)
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetArPoint);
    })

    test('A1, invalidateState with invalid', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        const actual = a1PointState.invalidateState()

        expect(actual).toBe(true)
        expect(mockDiagnosis.setState).toHaveBeenCalledTimes(0)
    })

    test('A1, executeLine with a1', () => {
        const testPoint: Point = { x: 100, y: 150 }
        const mockPointA1: DrawDetail = {
            pointName: PointName.A1,
            type: DrawType.Dot,
            startX: 100,
            startY: 150
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPointA1)

        a1PointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledWith(PointName.A1, testPoint)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledWith({x: testPoint.x, y: testPoint.y})
    })

    test('A1, executeLine without a1', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        a1PointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledTimes(0)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledTimes(0)
    })
})