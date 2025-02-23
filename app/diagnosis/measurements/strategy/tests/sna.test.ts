import { DiagnosisCephalo } from "../../../states/diagnosis";
import { MeasurementController } from "../../measurement";
import { DrawType, PointName } from "../../../model/enum";
import { SNAMeasurement } from "../snaMeasurement";

describe('SNA', () => {

    test('should return 0', () => {
        const controller = new MeasurementController()
        const strategy = new SNAMeasurement(controller)

        const result = strategy.execute()

        expect(result).toBe(0)
    });

    test('should return angle', () => {
        const diagnosis = new DiagnosisCephalo()
        diagnosis.addActionsDrawings({
            pointName: PointName.S,
            startX: 276,
            startY: 195,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.N,
            startX: 447,
            startY: 177,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.A,
            startX: 435,
            startY: 332,
            type: DrawType.Dot
        })

        const strategy = new SNAMeasurement(diagnosis.getMeasurementController())

        const result = strategy.execute()

        expect(result).toBe(79.56402239502609)
    });
})