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
                startX: 271,
                startY: 249,
                endX: 240,
                endY: 236,
                type: DrawType.Line
            }
        )
        diagnosis.addActionsDrawings({
            pointName: PointName.A1,
            startX: 451,
            startY: 395,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.Mp,
            startX: 365,
            startY: 374,
            type: DrawType.Dot
        })
        const strategy = new AngleOfCondylarPath(diagnosis.getMeasurementController())

        const result = strategy.execute()

        expect(result).toBe(9.028679209654044)
    });
})