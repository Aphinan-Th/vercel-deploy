import { DiagnosisCephalo } from "../../../states/diagnosis";
import { MeasurementController } from "../../measurement";
import { DrawType, PointName } from "../../../model/enum";
import { PointAToNvertMeasurementStrategy } from "../pointAToNvertMeasurementStrategy";

describe('Point A To Nvert', () => {

    test('should return 0', () => {
        const controller = new MeasurementController()
        const strategy = new PointAToNvertMeasurementStrategy(controller)

        const result = strategy.execute()

        expect(result).toBe(0)
    });

    test('should return distance negative', () => {
        const diagnosis = new DiagnosisCephalo()
        diagnosis.addActionsDrawings({
            pointName: PointName.Distance,
            startX: 544.910236648773,
            startY: 138.7191513861778,
            endX: 544.0252986836754,
            endY: 165.72316747264034,
            type: DrawType.Line
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.A,
            startX: 435,
            startY: 332,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.Or,
            startX: 401.45374761586316,
            startY: 255,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.N,
            startX: 447,
            startY: 177,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.Pr,
            startX: 215,
            startY: 255,
            type: DrawType.Dot
        })
        const strategy = new PointAToNvertMeasurementStrategy(diagnosis.getMeasurementController())

        const result = strategy.execute()

        expect(result).toBe(-4.441399261185635)
    });

    test('should return distance positive', () => {
        const diagnosis = new DiagnosisCephalo()
        diagnosis.addActionsDrawings({
            pointName: PointName.Distance,
            startX: 544.910236648773,
            startY: 138.7191513861778,
            endX: 544.0252986836754,
            endY: 165.72316747264034,
            type: DrawType.Line
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.A,
            startX: 455,
            startY: 332,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.N,
            startX: 447,
            startY: 177,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.Or,
            startX: 401.45374761586316,
            startY: 255,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.Pr,
            startX: 215,
            startY: 255,
            type: DrawType.Dot
        })
        const strategy = new PointAToNvertMeasurementStrategy(diagnosis.getMeasurementController())

        const result = strategy.execute()

        expect(result).toBe(2.9609328407904236)
    });
})