import { DiagnosisCephalo } from "../../../states/diagnosis";
import { MeasurementController } from "../../measurement";
import { DrawType, PointName } from "../../../model/enum";
import { YAxisMeasurementStrategy } from "../yAxisMeasurementStrategy";

describe('Y axis', () => {

    test('should return 0', () => {
        const controller = new MeasurementController()
        const strategy = new YAxisMeasurementStrategy(controller)

        const result = strategy.execute()

        expect(result).toBe(0)
    });

    test('should return angle', () => {
        const diagnosis = new DiagnosisCephalo()
        diagnosis.addActionsDrawings({
            pointName: PointName.N,
            startX: 447,
            startY: 177,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.Po,
            startX: 418,
            startY: 468,
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
        diagnosis.addActionsDrawings({
            pointName: PointName.S,
            startX: 276,
            startY: 195,
            type: DrawType.Dot
        })
        const strategy = new YAxisMeasurementStrategy(diagnosis.getMeasurementController())

        const result = strategy.execute()

        expect(result).toBe(70.63566819338887)
    });
})