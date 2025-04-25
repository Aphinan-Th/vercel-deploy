import { DiagnosisCephalo } from "../../../states/diagnosis";
import { MeasurementController } from "../../measurement";
import { DrawType, PointName } from "../../../model/enum";
import { FMAMeasurementStrategy } from "../fmaMeasurementStrategy";

describe('Fma', () => {

    test('should return 0', () => {
        const controller = new MeasurementController()
        const strategy = new FMAMeasurementStrategy(controller)

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
            pointName: PointName.MeToIr,
            startX: 388,
            startY: 475,
            endX: 266,
            endY: 410,
            type: DrawType.Dot
        })
        const strategy = new FMAMeasurementStrategy(diagnosis.getMeasurementController())

        const result = strategy.execute()

        expect(result).toBe(28.048105754553067)
    });
})