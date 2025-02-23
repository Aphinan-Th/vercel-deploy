import { DiagnosisCephalo } from "../../../states/diagnosis";
import { MeasurementController } from "../../measurement";
import { DrawType, PointName } from "../../../model/enum";
import { GonionAngleMeasurementStrategy } from "../gonionAngleMearsurementStrategy";

describe('Gonion', () => {

    test('should return 0', () => {
        const controller = new MeasurementController()
        const strategy = new GonionAngleMeasurementStrategy(controller)

        const result = strategy.execute()

        expect(result).toBe(0)
    });

    test('should return angle', () => {
        const diagnosis = new DiagnosisCephalo()
        diagnosis.addActionsDrawings({
            pointName: PointName.P1,
            startX: 241,
            startY: 289,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.P2,
            startX: 244,
            startY: 379,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.MeToLr,
            startX: 388,
            startY: 475,
            endX: 266,
            endY: 410,
            type: DrawType.Line
        })
        const strategy = new GonionAngleMeasurementStrategy(diagnosis.getMeasurementController())

        const result = strategy.execute()

        expect(result).toBe(119.95725818754944)
    });
})