import { DiagnosisCephalo } from "../../../states/diagnosis";
import { DrawType, PointName } from "../../../model/enum";
import { MeasurementController } from "../../measurement";
import { OneToSNMeasurement } from "../oneToSNMeasurement";

describe("One to sn plane", () => {

    test("should return 0", () => {
        const controller = new MeasurementController()
        const strategy = new OneToSNMeasurement(controller)

        const result = strategy.execute()

        expect(result).toBe(0)
    })

    test("should return angle", () => {
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

        const strategy = new OneToSNMeasurement(diagnosis.getMeasurementController())

        const result = strategy.execute()

        expect(result).toBe(108.43494882292204)
    })
})