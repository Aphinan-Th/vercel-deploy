import { DiagnosisCephalo } from "../../../states/diagnosis";
import { MeasurementController } from "../../measurement";
import { AngleOfCondylarPath } from "../angleOfCondylarPathVSOccPlane";
import { DrawType, PointName } from "../../../model/enum";

describe('Angle of Condylar Path VS OCC Plane', () => {

    test('should return 0', () => {
        const controller = new MeasurementController()
        const strategy = new AngleOfCondylarPath(controller)

        const result = strategy.execute()

        expect(result).toBe(0)
    });

    test('should angle', () => {
        const diagnosis = new DiagnosisCephalo()
        diagnosis.addActionsDrawings(
            {
                pointName: PointName.PoC,
                startX: 243,
                startY: 240,
                endX: 257,
                endY: 260,
                type: DrawType.Line
            }
        )
        diagnosis.addActionsDrawings({
            pointName: PointName.A1,
            startX: 448,
            startY: 401,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.Mp,
            startX: 361,
            startY: 378,
            type: DrawType.Dot
        })
        const strategy = new AngleOfCondylarPath(diagnosis.getMeasurementController())

        const result = strategy.execute()

        expect(result).toBe(40.19960276239894)
    });
})