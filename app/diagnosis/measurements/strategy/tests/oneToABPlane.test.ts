import { DiagnosisCephalo } from "../../../states/diagnosis";
import { DrawType, PointName } from "../../../model/enum";
import { MeasurementController } from "../../measurement";
import { OneToABPlaneMeasurementStrategy } from "../oneToABPlaneMeasurement";

describe("One to ab plane", () => {

    test("should return 0", () => {
        const controller = new MeasurementController()
        const strategy = new OneToABPlaneMeasurementStrategy(controller)

        const result = strategy.execute()

        expect(result).toBe(0)
    })

    test("should return distance in mm.", () => {
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
            pointName: PointName.A1,
            startX: 451,
            startY: 395,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.A,
            startX: 435,
            startY: 332,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.B,
            startX: 421,
            startY: 441,
            type: DrawType.Dot
        })

        const strategy = new OneToABPlaneMeasurementStrategy(diagnosis.getMeasurementController())

        const result = strategy.execute()

        expect(result).toBe(8.844102322600234)
    })
})