import { DiagnosisCephalo } from "../../../states/diagnosis";
import { MeasurementController } from "../../measurement";
import { DrawType, PointName } from "../../../model/enum";
import { WitsAppraisalMeasurementStrategy } from "../witsAppraisalMeasurement";

describe('Wit Appraisal', () => {

    test('should return 0', () => {
        const controller = new MeasurementController()
        const strategy = new WitsAppraisalMeasurementStrategy(controller)

        const result = strategy.execute()

        expect(result).toBe(0)
    });

    test('should return distance negative', () => {
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
            pointName: PointName.B,
            startX: 421,
            startY: 441,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.A,
            startX: 435,
            startY: 332,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.pMp,
            startX: 402,
            startY: 382,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.Mp,
            startX: 365,
            startY: 374,
            type: DrawType.Dot
        })
        const strategy = new WitsAppraisalMeasurementStrategy(diagnosis.getMeasurementController())

        const result = strategy.execute()

        expect(result).toBe(-3.461136575448154)
    });

    test('should return distance positive', () => {
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
            pointName: PointName.B,
            startX: 405,
            startY: 441,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.A,
            startX: 431,
            startY: 332,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.pMp,
            startX: 402,
            startY: 382,
            type: DrawType.Dot
        })
        diagnosis.addActionsDrawings({
            pointName: PointName.Mp,
            startX: 365,
            startY: 374,
            type: DrawType.Dot
        })
        const strategy = new WitsAppraisalMeasurementStrategy(diagnosis.getMeasurementController())

        const result = strategy.execute()

        expect(result).toBe(0.8799499768088554)
    });
})