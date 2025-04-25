import { CephaloPointStep } from "../../cephaloStep";
import { DrawType, PointName } from "../../model/enum";
import { DrawDetail, Point } from "../../model/type";
import { StateDescriptionModel } from "../cephaloState";
import { DiagnosisCephalo } from "../diagnosis";
import { P1PointState } from "../p1PointState";


describe('State P1 Point', () => {

    let pointState: P1PointState
    let mockDiagnosis: DiagnosisCephalo

    beforeEach(() => {
        mockDiagnosis = new DiagnosisCephalo()
        pointState = new P1PointState(mockDiagnosis)
        mockDiagnosis.addActionsDrawings = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawText = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawPoint = jest.fn().mockImplementation(() => { })
        mockDiagnosis.setState = jest.fn().mockImplementation(() => { })
        mockDiagnosis.undoActionsDrawings = jest.fn().mockImplementation(() => { })
    })

    test('P1, click should call addActionsDrawings, rotateImageAlignGround', () => {
        const testPoint: Point = { x: 100, y: 150 }

        pointState.click(testPoint)

        expect(mockDiagnosis.addActionsDrawings).toHaveBeenCalledWith({
            pointName: PointName.P1,
            type: DrawType.Dot,
            startX: testPoint.x,
            startY: testPoint.y,
        })
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetP2Point)
    });

    test('P1, undo should undoActionsDrawings and setState to P1', () => {
        pointState.undo()

        expect(mockDiagnosis.undoActionsDrawings).toHaveBeenCalled();
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetMeToIrLine);
    })

    test('P1, getStateDescription', () => {
        const actual = pointState.getStateDescription()

        const expectDesc: StateDescriptionModel = {
            pointName: PointName.P1,
            title: PointName.P1,
            description: "Set point of P1",
            imagePath: "/assets/images/sample/P1.webp"
        }
        expect(actual).toStrictEqual(expectDesc)
    })

    test('P1, invalidateState with valid', () => {
        const mockPoint: DrawDetail = {
            pointName: PointName.P1,
            type: DrawType.Dot,
            startX: 1,
            startY: 1
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPoint)

        const actual = pointState.invalidateState()

        expect(actual).toBe(false)
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetP2Point);
    })

    test('P1, invalidateState with invalid', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        const actual = pointState.invalidateState()

        expect(actual).toBe(true)
        expect(mockDiagnosis.setState).toHaveBeenCalledTimes(0)
    })

    test('P1, executeLine with P1', () => {
        const testPoint: Point = { x: 100, y: 150 }
        const mockPoint: DrawDetail = {
            pointName: PointName.P1,
            type: DrawType.Dot,
            startX: 100,
            startY: 150
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPoint)

        pointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledTimes(0)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledWith({ x: testPoint.x, y: testPoint.y })
    })

    test('P1, executeLine without P1', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        pointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledTimes(0)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledTimes(0)
    })
})