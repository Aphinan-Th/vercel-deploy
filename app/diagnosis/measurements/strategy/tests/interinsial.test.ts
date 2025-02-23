import { DiagnosisCephalo } from "../../../states/diagnosis";
import { MeasurementController } from "../../measurement";
import { DrawType, PointName } from "../../../model/enum";
import { InterinsialAngleMeasurement } from "../interinsialAngleMeasurement";

describe('Interinsial', () => {

    test('should return 0', () => {
        const controller = new MeasurementController()
        const strategy = new InterinsialAngleMeasurement(controller)

        const result = strategy.execute()

        expect(result).toBe(0)
    });

    test('should return angle', () => {
        const diagnosis = new DiagnosisCephalo()
        diagnosis.addActionsDrawings({
            pointName: PointName.A1,
            startX: 451,
            startY: 395,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.Ar,
            startX: 421,
            startY: 329,
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
        const strategy = new InterinsialAngleMeasurement(diagnosis.getMeasurementController())

        const result = strategy.execute()

        expect(result).toBe(123.23642871140362)
    });
})