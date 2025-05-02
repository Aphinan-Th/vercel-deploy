import { CephaloPointStep } from "../../cephaloStep";
import { DrawType, PointName } from "../../model/enum";
import { DrawDetail, Point } from "../../model/type";
import { ANSPointState } from "../ansPointState";
import { StateDescriptionModel } from "../cephaloState";
import { DiagnosisCephalo } from "../diagnosis";


describe('State ANS Point', () => {

    let ansPointState: ANSPointState
    let mockDiagnosis: DiagnosisCephalo

    beforeEach(() => {
        mockDiagnosis = new DiagnosisCephalo()
        ansPointState = new ANSPointState(mockDiagnosis)
        mockDiagnosis.addActionsDrawings = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawText = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawPoint = jest.fn().mockImplementation(() => { })
        mockDiagnosis.setState = jest.fn().mockImplementation(() => { })
        mockDiagnosis.undoActionsDrawings = jest.fn().mockImplementation(() => { })
    })

    test('ANS, click should call addActionsDrawings, drawText', () => {
        const testPoint: Point = { x: 100, y: 150 }
        ansPointState.executeLine = jest.fn().mockReturnValue({})

        ansPointState.click(testPoint)

        expect(mockDiagnosis.addActionsDrawings).toHaveBeenCalledWith({
            pointName: PointName.ANS,
            type: DrawType.Dot,
            startX: testPoint.x,
            startY: testPoint.y,
        })
        expect(ansPointState.executeLine).toHaveBeenCalled()
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetAPoint)
    });

    test('ANS, undo should undoActionsDrawings and setState to pns', () => {
        ansPointState.undo()

        expect(mockDiagnosis.undoActionsDrawings).toHaveBeenCalled();
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetPNSPoint);
    })

    test('ANS, getStateDescription', () => {
        const actual = ansPointState.getStateDescription()

        const expectDesc: StateDescriptionModel = {
            pointName: PointName.ANS,
            title: PointName.ANS,
            description: "Set point of ANS",
            imagePath: "/assets/images/sample/ANS.webp"
        }
        expect(actual).toStrictEqual(expectDesc)
    })

    test('ANS, invalidateState with valid', () => {
        const mockPointAns: DrawDetail = {
            pointName: PointName.ANS,
            type: DrawType.Dot,
            startX: 1,
            startY: 1
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPointAns)

        const actual = ansPointState.invalidateState()

        expect(actual).toBe(false)
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetAPoint);
    })

    test('ANS, invalidateState with invalid', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        const actual = ansPointState.invalidateState()

        expect(actual).toBe(true)
        expect(mockDiagnosis.setState).toHaveBeenCalledTimes(0)
    })

    test('ANS, executeLine with ans', () => {
        const testPoint: Point = { x: 100, y: 150 }
        const mockPoint: DrawDetail = {
            pointName: PointName.ANS,
            type: DrawType.Dot,
            startX: 100,
            startY: 150
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPoint)

        ansPointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledWith(PointName.ANS, testPoint)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledWith({x: testPoint.x, y: testPoint.y})
    })

    test('ANS, executeLine without ans', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        ansPointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledTimes(0)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledTimes(0)
    })
})