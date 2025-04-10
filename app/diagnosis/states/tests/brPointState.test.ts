import { CephaloPointStep } from "../../cephaloStep";
import { DrawType, PointName } from "../../model/enum";
import { DrawDetail, Point } from "../../model/type";
import { BRPointState } from "../brPointState";
import { StateDescriptionModel } from "../cephaloState";
import { DiagnosisCephalo } from "../diagnosis";


describe('State Br Point', () => {

    let brPointState: BRPointState
    let mockDiagnosis: DiagnosisCephalo

    beforeEach(() => {
        mockDiagnosis = new DiagnosisCephalo()
        brPointState = new BRPointState(mockDiagnosis)
        mockDiagnosis.addActionsDrawings = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawText = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawPoint = jest.fn().mockImplementation(() => { })
        mockDiagnosis.setState = jest.fn().mockImplementation(() => { })
        mockDiagnosis.undoActionsDrawings = jest.fn().mockImplementation(() => { })
    })

    test('Br, click should call addActionsDrawings, executeLine', () => {
        const testPoint: Point = { x: 100, y: 150 }
        brPointState.executeLine = jest.fn().mockImplementation(() => { })

        brPointState.click(testPoint)

        expect(mockDiagnosis.addActionsDrawings).toHaveBeenCalledWith({
            pointName: PointName.Br,
            type: DrawType.Dot,
            startX: testPoint.x,
            startY: testPoint.y,
        })
        expect(brPointState.executeLine).toHaveBeenCalled()
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetMpPoint)
    });

    test('Br, undo should undoActionsDrawings and setState to p2', () => {
        brPointState.undo()

        expect(mockDiagnosis.undoActionsDrawings).toHaveBeenCalled();
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetB1Point);
    })

    test('Br, getStateDescription', () => {
        const actual = brPointState.getStateDescription()

        const expectDesc: StateDescriptionModel = {
            pointName: PointName.Br,
            title: PointName.Br,
            description: "Set point of Br",
            imagePath: "/assets/images/sample/Br.webp"
        }
        expect(actual).toStrictEqual(expectDesc)
    })

    test('Br, invalidateState with valid', () => {
        const mockPointBr: DrawDetail = {
            pointName: PointName.Br,
            type: DrawType.Dot,
            startX: 1,
            startY: 1
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPointBr)

        const actual = brPointState.invalidateState()

        expect(actual).toBe(false)
        expect(mockDiagnosis.setState).toHaveBeenCalledWith(CephaloPointStep.SetMpPoint);
    })

    test('Br, invalidateState with invalid', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        const actual = brPointState.invalidateState()

        expect(actual).toBe(true)
        expect(mockDiagnosis.setState).toHaveBeenCalledTimes(0)
    })

    test('Br, executeLine with Br', () => {
        const testPoint: Point = { x: 100, y: 150 }
        const mockPoint: DrawDetail = {
            pointName: PointName.Br,
            type: DrawType.Dot,
            startX: 100,
            startY: 150
        }
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(mockPoint)

        brPointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledWith(PointName.Br, testPoint)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledWith({ x: testPoint.x, y: testPoint.y })
    })

    test('Br, executeLine without Br', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        brPointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledTimes(0)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledTimes(0)
    })
})