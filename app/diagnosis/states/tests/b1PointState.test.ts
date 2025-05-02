import { CephaloPointStep } from "../../cephaloStep";
import { DrawType, PointName } from "../../model/enum";
import { DrawDetail, Point } from "../../model/type";
import { B1PointState } from "../b1PointState";
import { StateDescriptionModel } from "../cephaloState";
import { DiagnosisCephalo } from "../diagnosis";


describe('State B1 Point', () => {

    let b1PointState: B1PointState
    let mockDiagnosis: DiagnosisCephalo

    beforeEach(() => {
        mockDiagnosis = new DiagnosisCephalo()
        b1PointState = new B1PointState(mockDiagnosis)
        mockDiagnosis.addActionsDrawings = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawText = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawPoint = jest.fn().mockImplementation(() => { })
        mockDiagnosis.setState = jest.fn().mockImplementation(() => { })
        mockDiagnosis.undoActionsDrawings = jest.fn().mockImplementation(() => { })
    })

    test('B1, click should call addActionsDrawings, drawText', () => {
        const testPoint: Point = { x: 100, y: 150 }

        b1PointState.click(testPoint)

        expect(mockDiagnosis.addActionsDrawings).toHaveBeenCalledWith({
            pointName: PointName.B1,
            type: DrawType.Dot,
            startX: testPoint.x,
            startY: testPoint.y,
        })
        expect(mockDiagnosis.drawText).toHaveBeenCalledWith(PointName.B1, testPoint)
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetBrPoint)
    });

    test('B1, undo should undoActionsDrawings and setState to ar', () => {
        b1PointState.undo()

        expect(mockDiagnosis.undoActionsDrawings).toHaveBeenCalled();
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetArPoint);
    })

    test('B1, getStateDescription', () => {
        const actual = b1PointState.getStateDescription()

        const expectDesc: StateDescriptionModel = {
            pointName: PointName.B1,
            title: PointName.B1,
            description: "Set point of B1",
            imagePath: "/assets/images/sample/B1.webp"
        }
        expect(actual).toStrictEqual(expectDesc)
    })

    test('B1, invalidateState with valid', () => {
        const mockPointB1: DrawDetail = {
            pointName: PointName.B1,
            type: DrawType.Dot,
            startX: 1,
            startY: 1
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPointB1)

        const actual = b1PointState.invalidateState()

        expect(actual).toBe(false)
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetBrPoint);
    })

    test('B1, invalidateState with invalid', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        const actual = b1PointState.invalidateState()

        expect(actual).toBe(true)
        expect(mockDiagnosis.setState).toHaveBeenCalledTimes(0)
    })

    test('B1, executeLine with b1', () => {
        const testPoint: Point = { x: 100, y: 150 }
        const mockPoint: DrawDetail = {
            pointName: PointName.B1,
            type: DrawType.Dot,
            startX: 100,
            startY: 150
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPoint)

        b1PointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledWith(PointName.B1, testPoint)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledWith({x: testPoint.x, y: testPoint.y})
    })

    test('B1, executeLine without a1', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        b1PointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledTimes(0)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledTimes(0)
    })
})