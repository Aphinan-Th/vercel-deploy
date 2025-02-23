import { DiagnosisCephalo } from "../../../states/diagnosis";
import { DrawType, PointName } from "../../../model/enum";
import { ConvexityToPointAMeasurementStrategy } from "../convexityToPointAMeasurement";
import { MeasurementController } from "../../measurement";

describe("Convexity to point A", () => {

    test("should return 0", () => {
        const controller = new MeasurementController()
        const strategy = new ConvexityToPointAMeasurementStrategy(controller)

        const result = strategy.execute()

        expect(result).toBe(0)
    })

    test("should return negative", () => {
        const diagnosis = new DiagnosisCephalo()
        diagnosis.addActionsDrawings(
            {
                pointName: PointName.Distance,
                startX: 544.910236648773,
                startY: 138.7191513861778,
                endX: 544.0252986836754,
                endY: 165.72316747264034,
                type: DrawType.Line
            }
        )
        diagnosis.addActionsDrawings(
            {
                pointName: PointName.A,
                startX: 425,
                startY: 332,
                type: DrawType.Dot
            }
        )
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

        const strategy = new ConvexityToPointAMeasurementStrategy(diagnosis.getMeasurementController())

        const result = strategy.execute()

        expect(result).toBe(-2.413516869267661)
    })

    test("should return positive", () => {
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
            pointName: PointName.A,
            startX: 435,
            startY: 332,
            type: DrawType.Dot
        })
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

        const strategy = new ConvexityToPointAMeasurementStrategy(diagnosis.getMeasurementController())

        const result = strategy.execute()

        expect(result).toBe(1.2694060932750406)
    })
})