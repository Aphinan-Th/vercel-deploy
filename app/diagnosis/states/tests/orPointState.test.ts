import { CephaloPointStep } from "../../cephaloStep";
import { DrawType, PointName } from "../../model/enum";
import { DrawDetail, Point } from "../../model/type";
import { StateDescriptionModel } from "../cephaloState";
import { DiagnosisCephalo } from "../diagnosis";
import { OrPointState } from "../orPointState";


describe('State Or Point', () => {

    let pointState: OrPointState
    let mockDiagnosis: DiagnosisCephalo

    beforeEach(() => {
        mockDiagnosis = new DiagnosisCephalo()
        pointState = new OrPointState(mockDiagnosis)
        mockDiagnosis.addActionsDrawings = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawText = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawPoint = jest.fn().mockImplementation(() => { })
        mockDiagnosis.setState = jest.fn().mockImplementation(() => { })
        mockDiagnosis.undoActionsDrawings = jest.fn().mockImplementation(() => { })
    })

    test('Or, click should call addActionsDrawings, rotateImageAlignGround', () => {
        const testPoint: Point = { x: 100, y: 150 }
        mockDiagnosis.rotateImageAlignGround = jest.fn()
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(
            [
                {
                    pointName: PointName.Pr,
                    type: DrawType.Dot,
                    startX: testPoint.x,
                    startY: testPoint.y,
                },
                {
                    pointName: PointName.Or,
                    type: DrawType.Dot,
                    startX: testPoint.x,
                    startY: testPoint.y,
                }
            ]
        )

        pointState.click(testPoint)

        expect(mockDiagnosis.addActionsDrawings).toHaveBeenCalledWith({
            pointName: PointName.Or,
            type: DrawType.Dot,
            startX: testPoint.x,
            startY: testPoint.y,
        })
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetSPoint)
        expect(mockDiagnosis.rotateImageAlignGround).toHaveBeenCalled()
    });

    test('Or, undo should undoActionsDrawings and setState to Or, ', () => {
        pointState.undo()

        expect(mockDiagnosis.undoActionsDrawings).toHaveBeenCalled();
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetPrPoint);
    })

    test('Or, getStateDescription', () => {
        const actual = pointState.getStateDescription()

        const expectDesc: StateDescriptionModel = {
            pointName: PointName.Or,
            title: PointName.Or,
            description: "Set point of Or",
            imagePath: "/assets/images/sample/Or.webp"
        }
        expect(actual).toStrictEqual(expectDesc)
    })

    test('Or, invalidateState with valid', () => {
        const mockPoint: DrawDetail = {
            pointName: PointName.Or,
            type: DrawType.Dot,
            startX: 1,
            startY: 1
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPoint)

        const actual = pointState.invalidateState()

        expect(actual).toBe(false)
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetSPoint);
    })

    test('Or, invalidateState with invalid', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        const actual = pointState.invalidateState()

        expect(actual).toBe(true)
        expect(mockDiagnosis.setState).toHaveBeenCalledTimes(0)
    })

    test('Or, executeLine with Or', () => {
        const testPoint: Point = { x: 100, y: 150 }
        const mockPoint: DrawDetail = {
            pointName: PointName.Or,
            type: DrawType.Dot,
            startX: 100,
            startY: 150
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPoint)

        pointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledWith(PointName.Or, testPoint)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledWith({ x: testPoint.x, y: testPoint.y })
    })

    test('Or, executeLine without Or', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        pointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledTimes(0)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledTimes(0)
    })
})