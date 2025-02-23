import { DiagnosisCephalo } from "../../../states/diagnosis";
import { DrawType, PointName } from "../../../model/enum";
import { MeasurementController } from "../../measurement";
import { LowerLipToEPlaneMeasurement } from "../lowerLipToEPlaneMeasurement";

describe("Lower lip to e plane", () => {

    test("should return 0", () => {
        const controller = new MeasurementController()
        const strategy = new LowerLipToEPlaneMeasurement(controller)

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
            pointName: PointName.LL,
            startX: 479,
            startY: 418,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.EN,
            startX: 508,
            startY: 297,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.Dt,
            startX: 449,
            startY: 469,
            type: DrawType.Dot
        })

        const strategy = new LowerLipToEPlaneMeasurement(diagnosis.getMeasurementController())

        const result = strategy.execute()

        expect(result).toBe(4.378191130295413)
    })
})