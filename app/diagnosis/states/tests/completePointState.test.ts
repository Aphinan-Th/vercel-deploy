import { Point } from "../../model/type";
import { StateDescriptionModel } from "../cephaloState";
import { CompletedState } from "../completedState";
import { DiagnosisCephalo } from "../diagnosis";


describe('State Complete Point', () => {

    let pointState: CompletedState
    let mockDiagnosis: DiagnosisCephalo

    beforeEach(() => {
        mockDiagnosis = new DiagnosisCephalo()
        pointState = new CompletedState(mockDiagnosis)
        mockDiagnosis.addActionsDrawings = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawText = jest.fn().mockImplementation(() => { })
        mockDiagnosis.drawPoint = jest.fn().mockImplementation(() => { })
        mockDiagnosis.setState = jest.fn().mockImplementation(() => { })
        mockDiagnosis.undoActionsDrawings = jest.fn().mockImplementation(() => { })
    })

    test('Complete, click should not do anything', () => {
        const testPoint: Point = { x: 100, y: 150 }

        pointState.click(testPoint)

        expect(mockDiagnosis.addActionsDrawings).toHaveBeenCalledTimes(0)
        expect(mockDiagnosis.setState).toHaveBeenCalledTimes(0)
    });

    test('Complete, undo should not do anything', () => {
        pointState.undo()

        expect(mockDiagnosis.undoActionsDrawings).toHaveBeenCalledTimes(0)
        expect(mockDiagnosis.setState).toHaveBeenCalledTimes(0)
    })

    test('Complete, getStateDescription', () => {
        const actual = pointState.getStateDescription()

        const expectDesc: StateDescriptionModel = {
            pointName: "",
            title: "Completed",
            description: "Can get result from point",
            imagePath: ""
        }
        expect(actual).toStrictEqual(expectDesc)
    })

    test('Complete, invalidateState not do anything', () => {

        const actual = pointState.invalidateState()

        expect(actual).toBe(false)
        expect(mockDiagnosis.setState).toHaveBeenCalledTimes(0)
    })

    test('Complete, executeLine not do anything', () => {
        mockDiagnosis.findDrawingAction = jest.fn().mockReturnValue(null)

        pointState.executeLine()

        expect(mockDiagnosis.drawText).toHaveBeenCalledTimes(0)
        expect(mockDiagnosis.drawPoint).toHaveBeenCalledTimes(0)
    })
})