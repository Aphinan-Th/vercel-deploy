import { CephaloPointStep } from "../../cephaloStep";
import { DrawType, PointName } from "../../model/enum";
import { DrawDetail, Point } from "../../model/type";
import { BAPointState } from "../baPointState";
import { StateDescriptionModel } from "../cephaloState";
import { DiagnosisCephalo } from "../diagnosis";


describe('State BA Point', () => {

    let baPointState: BAPointState
    let mockDiagnosis: DiagnosisCephalo

    beforeEach(() => {
        mockDiagnosis = new DiagnosisCephalo()
        baPointState = new BAPointState(mockDiagnosis)
        mockDiagnosis.addActionsDrawings = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawText = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawPoint = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawLine = jest.fn()
        mockDiagnosis.setState = jest.fn().mockImplementation(() => { })
        mockDiagnosis.undoActionsDrawings = jest.fn().mockImplementation(() => { })
    })

    test('BA, click should call addActionsDrawings, drawText', () => {
        const testPoint: Point = { x: 100, y: 150 }

        baPointState.click(testPoint)

        expect(mockDiagnosis.addActionsDrawings).toHaveBeenCalledWith({
            pointName: PointName.Ba,
            type: DrawType.Dot,
            startX: testPoint.x,
            startY: testPoint.y,
        })
        expect(mockDiagnosis.drawText).toHaveBeenCalledWith(PointName.Ba, testPoint)
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetENPoint)
    });

    test('BA, undo should undoActionsDrawings and setState to p2', () => {
        baPointState.undo()

        expect(mockDiagnosis.undoActionsDrawings).toHaveBeenCalled();
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetP2Point);
    })

    test('BA, getStateDescription', () => {
        const actual = baPointState.getStateDescription()

        const expectDesc: StateDescriptionModel = {
            pointName: PointName.Ba,
            title: PointName.Ba,
            description: "Set point of Ba",
            imagePath: "/assets/images/sample/Ba.webp"
        }
        expect(actual).toStrictEqual(expectDesc)
    })

    test('BA, invalidateState with valid', () => {
        const mockPointBA: DrawDetail = {
            pointName: PointName.Ba,
            type: DrawType.Dot,
            startX: 1,
            startY: 1
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPointBA)

        const actual = baPointState.invalidateState()

        expect(actual).toBe(false)
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetENPoint);
    })

    test('BA, invalidateState with invalid', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        const actual = baPointState.invalidateState()

        expect(actual).toBe(true)
        expect(mockDiagnosis.setState).toHaveBeenCalledTimes(0)
    })

    test('BA, executeLine with BA', () => {
        const testPoint: Point = { x: 100, y: 150 }
        const mockPointBa: DrawDetail = {
            pointName: PointName.Ba,
            type: DrawType.Dot,
            startX: 100,
            startY: 150
        }
        const mockPointS: DrawDetail = {
            pointName: PointName.Ba,
            type: DrawType.Dot,
            startX: 10,
            startY: 15
        }
        mockDiagnosis.findDrawingAction = jest.fn()
            .mockReturnValueOnce(mockPointBa)
            .mockReturnValueOnce(mockPointBa)
        .mockReturnValueOnce(mockPointS)

        baPointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledWith(PointName.Ba, testPoint)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledWith({x: testPoint.x, y: testPoint.y})
        expect(mockDiagnosis.drawLine).toHaveBeenCalledWith({x: testPoint.x, y: testPoint.y}, {x: 10, y: 15})
    })

    test('BA, executeLine without a1', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        baPointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledTimes(0)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledTimes(0)
    })
})