import { CephaloPointStep } from "../../cephaloStep";
import { DrawType, PointName } from "../../model/enum";
import { DrawDetail, Point } from "../../model/type";
import { StateDescriptionModel } from "../cephaloState";
import { DiagnosisCephalo } from "../diagnosis";
import { PoPointState } from "../poPointState";


describe('State Po Point', () => {

    let pointState: PoPointState
    let mockDiagnosis: DiagnosisCephalo

    beforeEach(() => {
        mockDiagnosis = new DiagnosisCephalo()
        pointState = new PoPointState(mockDiagnosis)
        mockDiagnosis.addActionsDrawings = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawText = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawPoint = jest.fn().mockImplementation(() => { })
        mockDiagnosis.setState = jest.fn().mockImplementation(() => { })
        mockDiagnosis.undoActionsDrawings = jest.fn().mockImplementation(() => { })
    })

    test('Po, click should call addActionsDrawings, rotateImageAlignGround', () => {
        const testPoint: Point = { x: 100, y: 150 }

        pointState.click(testPoint)

        expect(mockDiagnosis.addActionsDrawings).toHaveBeenCalledWith({
            pointName: PointName.Po,
            type: DrawType.Dot,
            startX: 100,
            startY: 150,
        })
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetMeToIrLine)
    });

    test('Po, undo should undoActionsDrawings and setState to P1', () => {
        pointState.undo()

        expect(mockDiagnosis.undoActionsDrawings).toHaveBeenCalled();
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetBPoint);
    })

    test('Po, getStateDescription', () => {
        const actual = pointState.getStateDescription()

        const expectDesc: StateDescriptionModel = {
            pointName: PointName.Po,
            title: PointName.Po,
            description: "Set point of Po",
            imagePath: "/assets/images/sample/Po.webp"
        }
        expect(actual).toStrictEqual(expectDesc)
    })

    test('Po, invalidateState with valid', () => {
        const mockPoint: DrawDetail = {
            pointName: PointName.Po,
            type: DrawType.Dot,
            startX: 1,
            startY: 1
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPoint)

        const actual = pointState.invalidateState()

        expect(actual).toBe(false)
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetMeToIrLine);
    })

    test('Po, invalidateState with invalid', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        const actual = pointState.invalidateState()

        expect(actual).toBe(true)
        expect(mockDiagnosis.setState).toHaveBeenCalledTimes(0)
    })

    test('Po, executeLine with Po', () => {
        const testPoint: Point = { x: 100, y: 150 }
        const mockPoint: DrawDetail = {
            pointName: PointName.Po,
            type: DrawType.Dot,
            startX: 100,
            startY: 150
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPoint)

        pointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledTimes(1)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledWith({ x: testPoint.x, y: testPoint.y })
    })

    test('Po, executeLine without Po', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        pointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledTimes(0)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledTimes(0)
    })
})