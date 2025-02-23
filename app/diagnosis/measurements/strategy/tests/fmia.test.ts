import { DiagnosisCephalo } from "../../../states/diagnosis";
import { MeasurementController } from "../../measurement";
import { DrawType, PointName } from "../../../model/enum";
import { FMIAMeasurementStrategy } from "../fmiaMeasurement";

describe('Fmia', () => {

    test('should return 0', () => {
        const controller = new MeasurementController()
        const strategy = new FMIAMeasurementStrategy(controller)

        const result = strategy.execute()

        expect(result).toBe(0)
    });

    test('should return angle', () => {
        const diagnosis = new DiagnosisCephalo()
        diagnosis.addActionsDrawings({
            pointName: PointName.Pr,
            startX: 215,
            startY: 255,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.Or,
            startX: 401.45374761586316,
            startY: 255,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.B1,
            startX: 443,
            startY: 388,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.Br,
            startX: 412,
            startY: 437,
            type: DrawType.Dot
        })
        const strategy = new FMIAMeasurementStrategy(diagnosis.getMeasurementController())

        const result = strategy.execute()

        expect(result).toBe(57.680383491819896)
    });
})