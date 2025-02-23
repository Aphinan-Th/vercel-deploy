import { DiagnosisCephalo } from "../../../states/diagnosis";
import { DrawType, PointName } from "../../../model/enum";
import { MeasurementController } from "../../measurement";
import { CranialBaseAngleMeasurement } from "../cranialBaseAngleMeasurement";

describe("Cranial base angle", () => {

    test("should return 0", () => {
        const controller = new MeasurementController()
        const strategy = new CranialBaseAngleMeasurement(controller)

        const result = strategy.execute()

        expect(result).toBe(0)
    })

    test("should return negative", () => {
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
            pointName: PointName.Ba,
            startX: 205,
            startY: 299,
            type: DrawType.Dot
        })

        const strategy = new CranialBaseAngleMeasurement(diagnosis.getMeasurementController())

        const result = strategy.execute()

        expect(result).toBe(130.33005876095936)
    })
})