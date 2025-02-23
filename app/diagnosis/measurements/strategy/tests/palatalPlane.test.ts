import { DiagnosisCephalo } from "../../../states/diagnosis";
import { DrawType, PointName } from "../../../model/enum";
import { MeasurementController } from "../../measurement";
import { PalatalPlaneMeasurement } from "../palatalPlaneMeasurement";

describe("Palatal Plane", () => {

    test("should return 0", () => {
        const controller = new MeasurementController()
        const strategy = new PalatalPlaneMeasurement(controller)

        const result = strategy.execute()

        expect(result).toBe(0)
    })

    test("should return Ratio", () => {
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
            pointName: PointName.MeToLr,
            startX: 388,
            startY: 475,
            endX: 266,
            endY: 410,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.ANS,
            startX: 451,
            startY: 324,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.PNS,
            startX: 319,
            startY: 320,
            type: DrawType.Dot
        })
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

        const strategy = new PalatalPlaneMeasurement(diagnosis.getMeasurementController())

        const result = strategy.execute()

        expect(result).toBe(0.6809017771653828)
    })
})