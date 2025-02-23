import { DiagnosisCephalo } from "../../../states/diagnosis";
import { MeasurementController } from "../../measurement";
import { DrawType, PointName } from "../../../model/enum";
import { SNBMeasurement } from "../snbMeasurement";

describe('SNB', () => {

    test('should return 0', () => {
        const controller = new MeasurementController()
        const strategy = new SNBMeasurement(controller)

        const result = strategy.execute()

        expect(result).toBe(0)
    });

    test('should return angle', () => {
        const diagnosis = new DiagnosisCephalo()
        diagnosis.addActionsDrawings({
            pointName: PointName.B,
            startX: 421,
            startY: 441,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.N,
            startX: 447,
            startY: 177,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.S,
            startX: 276,
            startY: 195,
            type: DrawType.Dot
        })
        const strategy = new SNBMeasurement(diagnosis.getMeasurementController())

        const result = strategy.execute()

        expect(result).toBe(78.36636600105956)
    });
})