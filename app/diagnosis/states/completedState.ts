import { Point } from "../model/type";
import { CephaloState, StateDescriptionModel } from "./cephaloState";

export class CompletedState extends CephaloState {

    executeLine(): void {
        return
    }

    click(point: Point): void {
        console.log(point)
        return
    }

    undo(): void {
        return
    }

    execute(): number {
        return -1
    }

    getStateDescription(): StateDescriptionModel {
        return {
            pointName: "",
            title: "Completed",
            description: "Can get result from point",
            imagePath: ""
        };
    }

    invalidateState(): boolean {
        return false;
    }
}