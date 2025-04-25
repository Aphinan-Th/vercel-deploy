import { DiagnosisCephalo } from "../../../states/diagnosis";
import { MeasurementController } from "../../measurement";
import { DrawType, PointName } from "../../../model/enum";
import { DpoMeasurement } from "../dpoMeasurement";

describe('Dpo', () => {

    test('should return 0', () => {
        const controller = new MeasurementController()
        const strategy = new DpoMeasurement(controller)

        const result = strategy.execute()

        expect(result).toBe(0)
    });

    test('should return distance in mm between point', () => {
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
            pointName: PointName.D,
            startX: 251,
            startY: 266,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.pMp,
            startX: 451,
            startY: 395,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.Mp,
            startX: 365,
            startY: 374,
            type: DrawType.Dot
        })
        const strategy = new DpoMeasurement(diagnosis.getMeasurementController())

        const result = strategy.execute()

        expect(result).toBe(28.822717534265408)
    });
})