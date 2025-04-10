import { CephaloPointStep } from "../../cephaloStep";
import { DrawType, PointName } from "../../model/enum";
import { DrawDetail, Point } from "../../model/type";
import { ARPointState } from "../arPointState";
import { StateDescriptionModel } from "../cephaloState";
import { DiagnosisCephalo } from "../diagnosis";


describe('State Ar Point', () => {

    let arPointState: ARPointState
    let mockDiagnosis: DiagnosisCephalo

    beforeEach(() => {
        mockDiagnosis = new DiagnosisCephalo()
        arPointState = new ARPointState(mockDiagnosis)
        mockDiagnosis.addActionsDrawings = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawText = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawPoint = jest.fn().mockImplementation(() => { })
        mockDiagnosis.setState = jest.fn().mockImplementation(() => { })
        mockDiagnosis.undoActionsDrawings = jest.fn().mockImplementation(() => { })
    })

    test('Ar, click should call addActionsDrawings, drawText', () => {
        const testPoint: Point = { x: 100, y: 150 }
        arPointState.executeLine = jest.fn().mockReturnValue({})

        arPointState.click(testPoint)

        expect(mockDiagnosis.addActionsDrawings).toHaveBeenCalledWith({
            pointName: PointName.Ar,
            type: DrawType.Dot,
            startX: testPoint.x,
            startY: testPoint.y,
        })
        expect(mockDiagnosis.drawText(PointName.Ar, testPoint))
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetB1Point)
    });

    test('Ar, undo should undoActionsDrawings and setState to a1', () => {
        arPointState.undo()

        expect(mockDiagnosis.undoActionsDrawings).toHaveBeenCalled();
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetA1Point);
    })

    test('Ar, getStateDescription', () => {
        const actual = arPointState.getStateDescription()

        const expectDesc: StateDescriptionModel = {
            pointName: PointName.Ar,
            title: PointName.Ar,
            description: "Set point of Ar",
            imagePath: "/assets/images/sample/Ar.webp"
        }
        expect(actual).toStrictEqual(expectDesc)
    })

    test('Ar, invalidateState with valid', () => {
        const mockPointAr: DrawDetail = {
            pointName: PointName.Ar,
            type: DrawType.Dot,
            startX: 1,
            startY: 1
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPointAr)

        const actual = arPointState.invalidateState()

        expect(actual).toBe(false)
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetB1Point);
    })

    test('Ar, invalidateState with invalid', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        const actual = arPointState.invalidateState()

        expect(actual).toBe(true)
        expect(mockDiagnosis.setState).toHaveBeenCalledTimes(0)
    })

    test('Ar, executeLine with a', () => {
        const testPoint: Point = { x: 100, y: 150 }
        const mockPointA1: DrawDetail = {
            pointName: PointName.Ar,
            type: DrawType.Dot,
            startX: 100,
            startY: 150
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPointA1)

        arPointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledWith(PointName.Ar, testPoint)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledWith({ x: testPoint.x, y: testPoint.y })
    })

    test('Ar, executeLine without a', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        arPointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledTimes(0)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledTimes(0)
    })
})